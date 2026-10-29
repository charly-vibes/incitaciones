# Purpose: probe native Whisper boundaries in an isolated committed repository.
# Responsibilities: check supersession evidence and partial recall budget recovery.
# Rationale: CLI boundary checks complement, but do not replace, agent evaluation.
import json
import os
from pathlib import Path
import subprocess
import tempfile


def require(condition, message):
    if not condition:
        raise RuntimeError(message)


def main():
    with tempfile.TemporaryDirectory() as directory:
        environment = os.environ.copy()
        for name in list(environment):
            if name.startswith('GIT_'):
                del environment[name]
        environment['GIT_CONFIG_NOSYSTEM'] = '1'
        environment['GIT_CONFIG_GLOBAL'] = os.devnull

        def run(*arguments, text=None):
            result = subprocess.run(
                arguments, cwd=directory, env=environment, input=text,
                text=True, capture_output=True, timeout=20,
            )
            require(result.returncode == 0,
                    f'{arguments[:2]} failed: {result.stderr}')
            if arguments[0] == 'turu':
                envelope = json.loads(result.stdout)
                require(envelope.get('ok'), f'Turu error: {envelope}')
                return envelope['data']
            return result.stdout

        run('git', 'init', '-b', 'main')
        for key, value in [('user.name', 'Fixture'),
                           ('user.email', 'fixture@example.invalid'),
                           ('commit.gpgsign', 'false'),
                           ('core.hooksPath', str(Path(directory) / 'no-hooks'))]:
            run('git', 'config', '--local', key, value)
        run('git', 'commit', '--allow-empty', '-m', 'fixture')
        run('git', 'remote', 'add', 'origin',
            'https://example.invalid/test/renew.git')
        run('turu', 'init', '--json')

        def append(topic, body, *extra):
            return run('turu', 'append', 'branch', '--topic', topic,
                       '--stdin', '--json', *extra, text=body)

        def recall(topic, budget):
            return run('turu', 'recall', 'branch', '--topic', topic,
                       '--budget', str(budget), '--no-usage', '--json')

        old = append('resume-test', 'Format: 1\nTask: test\nNext: old')
        new = append('resume-test',
                     f'Format: 1\nTask: test\nPrevious entry: {old["id"]}\nNext: new',
                     '--supersedes', old['id'])
        entries = recall('resume-test', 8000)['entries']
        by_id = {entry['id']: entry for entry in entries}
        require(new['id'] in by_id, 'Replacement missing from ordinary recall')
        require(f'Previous entry: {old["id"]}' in by_id[new['id']]['text'],
                'Explicit replacement relation did not survive round trip')
        if old['id'] in by_id:
            require(f'superseded by {new["id"]}' in by_id[old['id']]['text'],
                    'Retained obsolete entry lacks expected relation evidence')
        print('PASS: replacement body and relation survive native round trip')

        append('resume-large', 'Format: 1\nNext: stale')
        large = append('resume-large',
                       'Format: 1\n' + 'x' * 10000 + '\nConstraint: no push')
        partial = recall('resume-large', 8000)
        require(partial['entries'] and partial['entries_skipped'] > 0,
                'Expected a nonempty recall with a skipped current handoff')
        require(all(entry['id'] != large['id'] for entry in partial['entries']),
                'Oversized handoff unexpectedly fit initial budget')
        recovered = recall('resume-large', 16000)
        body = next((entry['text'] for entry in recovered['entries']
                     if entry['id'] == large['id']), None)
        require(body and 'Constraint: no push' in body,
                'Bounded retry failed to recover the critical constraint')
        print('PASS: bounded retry recovers skipped current handoff and constraint')


if __name__ == '__main__':
    main()
