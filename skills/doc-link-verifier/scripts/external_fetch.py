#!/usr/bin/env python3
"""External URL fetching: async HEAD/GET with redirect tracking and rate limiting.

One polite fetcher shared by the whole check run: per-host locks serialize
requests (conservative fixed delay), a semaphore bounds concurrent fetches,
and results are cached by URL+mode upstream.
Rationale: all aiohttp interaction lives here; link classification and
reporting stay network-free.
"""

from __future__ import annotations

import asyncio
import re
import time
import urllib.parse
from collections import defaultdict

import aiohttp

from link_checks import CheckResult


DEFAULT_UA = "Mozilla/5.0 (compatible; doc-link-verifier/1.0)"

# Conservative per-host delay so we don't hammer any single site.
PER_HOST_DELAY = 0.5  # seconds

TITLE_RE = re.compile(r'<title[^>]*>(.*?)</title>', re.IGNORECASE | re.DOTALL)
H1_HTML_RE = re.compile(r'<h1[^>]*>(.*?)</h1>', re.IGNORECASE | re.DOTALL)
HEADING_HTML_RE = re.compile(r'<h([1-3])[^>]*>(.*?)</h\1>', re.IGNORECASE | re.DOTALL)
TAG_STRIP = re.compile(r'<[^>]+>')


def strip_html(s: str) -> str:
    return re.sub(r'\s+', ' ', TAG_STRIP.sub('', s)).strip()


def _parse_body(body: bytes) -> tuple[str | None, list[str]]:
    """Extract title and headings from an HTML body."""
    try:
        text = body.decode('utf-8', errors='replace')
    except Exception:
        return None, []
    title = _extract_html_title(text)
    headings = [strip_html(hm.group(2)) for hm in HEADING_HTML_RE.finditer(text)]
    return title, headings[:50]


def _extract_html_title(text: str) -> str | None:
    m = TITLE_RE.search(text)
    if m:
        return strip_html(m.group(1))
    h1 = H1_HTML_RE.search(text)
    if h1:
        return strip_html(h1.group(1))
    return None


def _elapsed_ms(start: float) -> int:
    return int((time.monotonic() - start) * 1000)


def _error_result(start: float, redirect_chain: list[str], *, status: str,
                  reason: str) -> CheckResult:
    return CheckResult(
        status=status, reason=reason,
        redirect_chain=redirect_chain,
        elapsed_ms=_elapsed_ms(start),
    )


def _success_result(url: str, http_status: int, final_url: str,
                    redirect_chain: list[str], body: bytes, deep: bool,
                    start: float) -> CheckResult:
    if http_status >= 400:
        return CheckResult(
            status='broken', http_status=http_status,
            reason=f"HTTP {http_status}",
            final_url=final_url, redirect_chain=redirect_chain,
            elapsed_ms=_elapsed_ms(start),
        )
    result_status = 'redirected' if redirect_chain or final_url != url else 'ok'
    title = None
    headings: list[str] = []
    if deep and body:
        title, headings = _parse_body(body)
    return CheckResult(
        status=result_status,
        http_status=http_status,
        final_url=final_url,
        title=title,
        headings=headings,
        redirect_chain=redirect_chain,
        elapsed_ms=_elapsed_ms(start),
    )


async def fetch_external(session: aiohttp.ClientSession, url: str,
                         timeout: aiohttp.ClientTimeout,
                         deep: bool = False) -> CheckResult:
    """
    Async HEAD request; fall back to GET if the server returns 403/405/501.
    When deep=True, always GET and parse title/headings.
    """
    start = time.monotonic()
    redirect_chain: list[str] = []

    async def _request(method: str) -> tuple[int, str, bytes]:
        async with session.request(method, url, timeout=timeout,
                                   allow_redirects=True,
                                   max_redirects=10) as resp:
            # Capture redirect history
            for h in resp.history:
                redirect_chain.append(str(h.url))
            body = b''
            if method == 'GET':
                body = await resp.content.read(200_000)
            return resp.status, str(resp.url), body

    try:
        method = 'GET' if deep else 'HEAD'
        status, final_url, body = await _request(method)

        # Some servers reject HEAD — fall back to GET
        if method == 'HEAD' and status in (403, 405, 501):
            redirect_chain.clear()
            status, final_url, body = await _request('GET')

        return _success_result(url, status, final_url, redirect_chain, body, deep, start)
    except asyncio.TimeoutError:
        return _error_result(start, redirect_chain, status='unknown', reason='timeout')
    except aiohttp.ClientError as e:
        return _error_result(start, redirect_chain, status='broken',
                             reason=f"{type(e).__name__}: {e}")
    except Exception as e:
        return _error_result(start, redirect_chain, status='unknown',
                             reason=f"{type(e).__name__}: {e}")


# -------- Async main driver --------

async def check_external_urls(
    to_fetch: dict[str, list[int]],
    links: list[dict],
    results: list[dict | None],
    cache: dict[str, dict],
    cache_key_suffix: str,
    concurrency: int,
    timeout_s: int,
    user_agent: str,
    deep: bool,
) -> None:
    """Fetch all external URLs concurrently with per-host rate limiting."""
    semaphore = asyncio.Semaphore(concurrency)
    # Per-host lock + last-hit time for polite rate limiting
    host_locks: dict[str, asyncio.Lock] = defaultdict(asyncio.Lock)
    host_last_hit: dict[str, float] = {}
    timeout = aiohttp.ClientTimeout(total=timeout_s)

    async with aiohttp.ClientSession(
        headers={'User-Agent': user_agent,
                 'Accept': 'text/html,application/xhtml+xml,*/*;q=0.8'},
    ) as session:
        tasks = [_fetch_one(session, url, semaphore, host_locks, host_last_hit,
                            timeout, cache, cache_key_suffix, deep)
                 for url in to_fetch]
        for coro in asyncio.as_completed(tasks):
            url, check = await coro
            for idx in to_fetch[url]:
                results[idx] = {**links[idx], 'check': check}


async def _fetch_one(session: aiohttp.ClientSession, url: str,
                     semaphore: asyncio.Semaphore,
                     host_locks: dict[str, asyncio.Lock],
                     host_last_hit: dict[str, float],
                     timeout: aiohttp.ClientTimeout,
                     cache: dict[str, dict],
                     cache_key_suffix: str,
                     deep: bool) -> tuple[str, dict]:
    cache_key = url + cache_key_suffix
    if cache_key in cache:
        return url, cache[cache_key]

    host = urllib.parse.urlparse(url).netloc
    # Host lock serializes requests per host (delay + fetch together).
    # Semaphore only wraps the fetch so delays don't waste slots.
    async with host_locks[host]:
        await _respect_host_delay(host, host_last_hit)
        async with semaphore:
            host_last_hit[host] = time.monotonic()
            r = await fetch_external(session, url, timeout, deep=deep)
        d = r.to_dict()
        cache[cache_key] = d
        return url, d


async def _respect_host_delay(host: str, host_last_hit: dict[str, float]) -> None:
    now = time.monotonic()
    wait = PER_HOST_DELAY - (now - host_last_hit.get(host, 0))
    if wait > 0:
        await asyncio.sleep(wait)
