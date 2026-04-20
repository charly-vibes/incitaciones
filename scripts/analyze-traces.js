#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const REPO_ROOT = path.resolve(__dirname, "..");
const MANIFEST_PATH = path.join(REPO_ROOT, "content", "manifest.json");
const CACHE_DIR = path.join(REPO_ROOT, ".cache");
const CACHE_PATH = path.join(CACHE_DIR, "trace-analysis-cache.json");

const PROVIDER_DETECTION_RULES = [
  ["claude", ["claude", "anthropic"]],
  ["gemini", ["gemini", "google"]],
  ["codex", ["codex", "openai"]],
  ["ampcode", ["ampcode", "amp code", ".amp"]],
  ["opencode", ["opencode", "open-code", ".opencode"]],
];

const PROVIDER_HINTS = {
  claude: {
    eventKeys: ["messages", "content", "usage"],
    roles: ["user", "assistant", "tool_result"],
  },
  gemini: {
    eventKeys: ["contents", "parts", "usageMetadata"],
    roles: ["user", "model"],
  },
  codex: {
    eventKeys: ["items", "tool_name", "model"],
    roles: ["user", "assistant", "tool"],
  },
  ampcode: {
    eventKeys: ["conversation", "events", "tools"],
    roles: ["user", "assistant"],
  },
  opencode: {
    eventKeys: ["trace", "steps", "messages"],
    roles: ["user", "assistant", "tool"],
  },
  unknown: {
    eventKeys: [],
    roles: [],
  },
};

function defaultArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function loadManifest() {
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
}

function hashText(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function computeCacheVersion() {
  const scriptHash = hashText(fs.readFileSync(__filename, "utf8"));
  const manifestHash = hashText(fs.readFileSync(MANIFEST_PATH, "utf8"));
  return `v2:${scriptHash}:${manifestHash}`;
}

function parseArgs(argv) {
  const args = {
    inputs: [],
    format: "markdown",
    top: 10,
    jsonOut: null,
    sessionRecordsOut: null,
    labelsPath: null,
    labelQueueOut: null,
    autoDetect: false,
    noCache: false,
    verbose: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--format") {
      args.format = argv[index + 1] || "markdown";
      index += 1;
      continue;
    }
    if (value === "--top") {
      args.top = Number.parseInt(argv[index + 1] || "10", 10);
      index += 1;
      continue;
    }
    if (value === "--json-out") {
      args.jsonOut = argv[index + 1] || null;
      index += 1;
      continue;
    }
    if (value === "--session-records-out") {
      args.sessionRecordsOut = argv[index + 1] || null;
      index += 1;
      continue;
    }
    if (value === "--labels") {
      args.labelsPath = argv[index + 1] || null;
      index += 1;
      continue;
    }
    if (value === "--label-queue-out") {
      args.labelQueueOut = argv[index + 1] || null;
      index += 1;
      continue;
    }
    if (value === "--auto-detect") {
      args.autoDetect = true;
      continue;
    }
    if (value === "--no-cache") {
      args.noCache = true;
      continue;
    }
    if (value === "--verbose") {
      args.verbose = true;
      continue;
    }
    if (value === "--help" || value === "-h") {
      printHelp();
      process.exit(0);
    }
    args.inputs.push(value);
  }

  if (args.inputs.length === 0 && !args.autoDetect) {
    printHelp();
    process.exit(1);
  }

  if (!["markdown", "json", "both"].includes(args.format)) {
    throw new Error(`Unsupported format: ${args.format}`);
  }

  return args;
}

function printHelp() {
  console.log(`Usage: node scripts/analyze-traces.js <trace-path...> [options]

Analyze trace exports from multiple agent tools and summarize usage patterns.

Options:
  --format markdown|json|both   Output format (default: markdown)
  --top N                       Top N items per ranking (default: 10)
  --json-out PATH               Write JSON report to PATH
  --session-records-out PATH    Write normalized per-session records as JSONL
  --labels PATH                 Join manual labels from JSON or JSONL
  --label-queue-out PATH        Write unlabeled session queue as JSONL
  --auto-detect                 Scan common local CLI history locations
  --no-cache                    Disable incremental per-file cache
  --verbose                     Include full source and file inventories in markdown
  --help                        Show this help

Accepted inputs:
  - Directories containing trace exports
  - Individual .json, .jsonl, .ndjson, .log, .txt, or .md files
`);
}

function listFiles(inputPath) {
  const absolute = path.resolve(inputPath);
  const stats = fs.statSync(absolute);
  if (stats.isFile()) {
    if (/labels.*\.(json|jsonl|ndjson)$/i.test(path.basename(absolute))) {
      return [];
    }
    return [absolute];
  }

  const files = [];
  for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) {
    const entryPath = path.join(absolute, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === ".cache") {
        continue;
      }
      files.push(...listFiles(entryPath));
      continue;
    }
    if (/labels.*\.(json|jsonl|ndjson)$/i.test(entry.name)) {
      continue;
    }
    if (/\.(json|jsonl|ndjson|log|txt|md)$/i.test(entry.name)) {
      files.push(entryPath);
    }
  }
  return files;
}

function fileExists(targetPath) {
  try {
    fs.accessSync(targetPath, fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

function ensureDirectory(targetPath) {
  fs.mkdirSync(targetPath, { recursive: true });
}

function loadCache(disabled = false) {
  const version = computeCacheVersion();
  if (disabled || !fileExists(CACHE_PATH)) {
    return {
      version,
      files: {},
    };
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(CACHE_PATH, "utf8"));
    if (!parsed || typeof parsed !== "object" || !parsed.files || parsed.version !== version) {
      return { version, files: {} };
    }
    return parsed;
  } catch {
    return { version, files: {} };
  }
}

function saveCache(cache, disabled = false) {
  if (disabled) {
    return;
  }
  ensureDirectory(CACHE_DIR);
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
}

function writeJsonl(outputPath, rows) {
  ensureDirectory(path.dirname(path.resolve(outputPath)));
  const body = rows.map((row) => JSON.stringify(row)).join("\n");
  fs.writeFileSync(path.resolve(outputPath), body.length > 0 ? `${body}\n` : "");
}

function loadLabels(labelsPath) {
  if (!labelsPath) {
    return [];
  }

  const resolved = path.resolve(labelsPath);
  if (!fileExists(resolved)) {
    throw new Error(`Labels file not found: ${resolved}`);
  }

  const content = fs.readFileSync(resolved, "utf8").trim();
  if (!content) {
    return [];
  }

  if (/\.jsonl$/i.test(resolved) || /\.ndjson$/i.test(resolved)) {
    return content
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => JSON.parse(line));
  }

  const parsed = JSON.parse(content);
  if (Array.isArray(parsed)) {
    return parsed;
  }
  return [parsed];
}

function buildLabelIndex(labels) {
  const bySessionId = new Map();
  const byFilePath = new Map();

  for (const label of labels) {
    if (label.session_id) {
      bySessionId.set(label.session_id, label);
    }
    if (label.file_path) {
      byFilePath.set(path.resolve(label.file_path), label);
    }
  }

  return { bySessionId, byFilePath };
}

function getFileSignature(filePath) {
  const stats = fs.statSync(filePath);
  return {
    mtimeMs: stats.mtimeMs,
    size: stats.size,
  };
}

function readMetricsWithCache(
  filePath,
  promptMatchers,
  skillCatalog,
  cache,
  cacheStats,
  cacheDisabled = false,
  sourceProvider = null,
) {
  const signature = getFileSignature(filePath);
  const cacheEntry = cache.files[filePath];

  if (
    !cacheDisabled &&
    cacheEntry &&
    cacheEntry.mtimeMs === signature.mtimeMs &&
    cacheEntry.size === signature.size &&
    cacheEntry.metrics
  ) {
    cacheStats.hits += 1;
    return cacheEntry.metrics;
  }

  cacheStats.misses += 1;
  const metrics = parseContent(filePath, promptMatchers, skillCatalog, sourceProvider);
  cache.files[filePath] = {
    mtimeMs: signature.mtimeMs,
    size: signature.size,
    metrics,
  };
  return metrics;
}

function expandHome(targetPath) {
  if (!targetPath.startsWith("~/")) {
    return targetPath;
  }
  return path.join(process.env.HOME || "", targetPath.slice(2));
}

function autoDetectInputs() {
  const detected = [];
  const seen = new Set();

  function addPath(provider, candidatePath) {
    const resolved = path.resolve(expandHome(candidatePath));
    if (!fileExists(resolved) || seen.has(resolved)) {
      return;
    }
    seen.add(resolved);
    detected.push({ provider, path: resolved });
  }

  function walk(rootPath, predicate) {
    const resolvedRoot = path.resolve(expandHome(rootPath));
    if (!fileExists(resolvedRoot)) {
      return;
    }

    const stats = fs.statSync(resolvedRoot);
    if (stats.isFile()) {
      if (predicate(resolvedRoot)) {
        addPath("unknown", resolvedRoot);
      }
      return;
    }

    for (const entry of fs.readdirSync(resolvedRoot, { withFileTypes: true })) {
      const entryPath = path.join(resolvedRoot, entry.name);
      if (entry.isDirectory()) {
        walk(entryPath, predicate);
        continue;
      }
      if (predicate(entryPath)) {
        addPath("unknown", entryPath);
      }
    }
  }

  walk(
    "~/.claude/projects",
    (entryPath) => /\.jsonl$/i.test(entryPath) && !/\/subagents\//i.test(entryPath),
  );

  walk("~/.gemini/tmp", (entryPath) => /\/chats\/session-.*\.json$/i.test(entryPath));

  addPath("codex", "~/.codex/history.jsonl");
  addPath("codex", "~/.codex/log/codex-tui.log");

  walk("~/.amp", (entryPath) =>
    /conversation|session|transcript|history/i.test(path.basename(entryPath)) &&
    /\.(json|jsonl|ndjson|log|txt|md)$/i.test(entryPath),
  );
  walk("~/.config/amp", (entryPath) =>
    /conversation|session|transcript|history/i.test(path.basename(entryPath)) &&
    /\.(json|jsonl|ndjson|log|txt|md)$/i.test(entryPath),
  );

  walk("~/.opencode", (entryPath) =>
    /conversation|session|transcript|history/i.test(path.basename(entryPath)) &&
    /\.(json|jsonl|ndjson|log|txt|md)$/i.test(entryPath),
  );
  walk("~/.config/opencode", (entryPath) =>
    /conversation|session|transcript|history/i.test(path.basename(entryPath)) &&
    /\.(json|jsonl|ndjson|log|txt|md)$/i.test(entryPath),
  );

  return detected.map((item) => ({
    provider: inferProviderForDetectedPath(item.path) || item.provider,
    path: item.path,
  }));
}

function deriveSessionId(filePath) {
  const base = path.basename(filePath).replace(/\.(json|jsonl|ndjson|log|txt|md)$/i, "");
  return base || hashText(filePath).slice(0, 12);
}

function inferProviderForDetectedPath(targetPath) {
  const sample = targetPath.toLowerCase();
  for (const [provider, needles] of PROVIDER_DETECTION_RULES) {
    if (needles.some((needle) => sample.includes(needle))) {
      return provider;
    }
  }
  return null;
}

function detectProvider(filePath, content) {
  const sample = `${filePath}\n${content.slice(0, 4000)}`.toLowerCase();
  for (const [provider, needles] of PROVIDER_DETECTION_RULES) {
    if (needles.some((needle) => sample.includes(needle))) {
      return provider;
    }
  }
  return "unknown";
}

function emptyMetrics(provider, filePath) {
  return {
    provider,
    filePath,
    sessionId: deriveSessionId(filePath),
    traceCount: 1,
    messageCount: 0,
    firstTimestamp: null,
    lastTimestamp: null,
    firstUserExcerpt: "",
    lastAssistantExcerpt: "",
    roleCounts: {},
    toolCalls: {},
    modelCounts: {},
    promptCounts: {},
    skillFormatCounts: {},
    slashCommandCounts: {},
    fileMentions: {},
    referenceCounts: {},
    referenceCountsBySkill: {},
    referenceStageCounts: {},
    stageCounts: {},
    skillsUsed: {},
    tokenUsage: {
      input: 0,
      output: 0,
      total: 0,
    },
    eventTypes: {},
    promptToolPairs: {},
    transitions: {},
    toolRunsAfterPrompt: 0,
    testsMentioned: 0,
    outputSignals: {
      codeBlocks: 0,
      checklists: 0,
    },
    promptRefsInUserMessages: 0,
    promptRefsInAssistantMessages: 0,
    outcome: "unknown",
    outcomeEvidence: [],
    summary: {
      providerHintsMatched: 0,
      structured: false,
    },
  };
}

function increment(map, key, amount = 1) {
  if (!key) {
    return;
  }
  map[key] = (map[key] || 0) + amount;
}

function numeric(value) {
  return Number.isFinite(value) ? value : 0;
}

function accumulateTokens(tokenUsage, candidate) {
  if (!candidate || typeof candidate !== "object") {
    return;
  }

  const inputCandidates = [
    numeric(candidate.input_tokens),
    numeric(candidate.inputTokens),
    numeric(candidate.prompt_tokens),
    numeric(candidate.promptTokens),
    numeric(candidate.inputTokenCount),
  ].filter(Boolean);
  const outputCandidates = [
    numeric(candidate.output_tokens),
    numeric(candidate.outputTokens),
    numeric(candidate.completion_tokens),
    numeric(candidate.completionTokens),
    numeric(candidate.candidatesTokenCount),
  ].filter(Boolean);
  const totalCandidates = [
    numeric(candidate.total_tokens),
    numeric(candidate.totalTokens),
    numeric(candidate.totalTokenCount),
  ].filter(Boolean);

  const input = inputCandidates.length > 0 ? Math.max(...inputCandidates) : 0;
  const output = outputCandidates.length > 0 ? Math.max(...outputCandidates) : 0;
  const total = totalCandidates.length > 0 ? Math.max(...totalCandidates) : input + output;

  tokenUsage.input += input;
  tokenUsage.output += output;
  tokenUsage.total += total;
}

function clipText(text, maxLength = 240) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }
  return `${normalized.slice(0, maxLength - 1)}…`;
}

function maybeUpdateTimestamps(metrics, object) {
  const candidate = object.timestamp || object.created || object.modified || object.updated_at || null;
  if (typeof candidate !== "string" || !candidate) {
    return;
  }
  if (!metrics.firstTimestamp || candidate < metrics.firstTimestamp) {
    metrics.firstTimestamp = candidate;
  }
  if (!metrics.lastTimestamp || candidate > metrics.lastTimestamp) {
    metrics.lastTimestamp = candidate;
  }
}

function extractText(value) {
  if (value == null) {
    return "";
  }
  if (typeof value === "string") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(extractText).filter(Boolean).join("\n");
  }
  if (typeof value === "object") {
    const preferredKeys = [
      "text",
      "content",
      "message",
      "body",
      "input",
      "output",
      "prompt",
      "completion",
      "value",
      "parts",
    ];
    for (const key of preferredKeys) {
      if (key in value) {
        const extracted = extractText(value[key]);
        if (extracted) {
          return extracted;
        }
      }
    }
    return Object.values(value).map(extractText).filter(Boolean).join("\n");
  }
  return String(value);
}

function flattenObjects(root) {
  const objects = [];

  function walk(node) {
    if (!node || typeof node !== "object") {
      return;
    }
    objects.push(node);
    if (Array.isArray(node)) {
      for (const item of node) {
        walk(item);
      }
      return;
    }
    for (const value of Object.values(node)) {
      walk(value);
    }
  }

  walk(root);
  return objects;
}

function normalizeRole(object) {
  const role = object.role || object.sender || object.author || object.type || object.kind || null;
  if (!role) {
    return null;
  }

  const normalized = String(role).toLowerCase();
  if (normalized.includes("assistant") || normalized.includes("model")) {
    return "assistant";
  }
  if (normalized.includes("user") || normalized.includes("human")) {
    return "user";
  }
  if (normalized.includes("tool") || normalized.includes("function")) {
    return "tool";
  }
  if (normalized.includes("system") || normalized.includes("developer")) {
    return "system";
  }
  return normalized;
}

function collectPotentialMessages(root) {
  const seen = new Set();
  const messages = [];

  for (const object of flattenObjects(root)) {
    if (!object || typeof object !== "object" || Array.isArray(object)) {
      continue;
    }

    const role = normalizeRole(object);
    const hasContent =
      "content" in object ||
      "text" in object ||
      "message" in object ||
      "prompt" in object ||
      "input" in object ||
      "output" in object ||
      "parts" in object;

    if (!role || !hasContent) {
      continue;
    }
    if (seen.has(object)) {
      continue;
    }

    seen.add(object);
    messages.push(object);
  }

  return messages;
}

function buildPromptMatchers(manifest) {
  return manifest.prompts.map((prompt) => {
    const aliases = new Set();
    aliases.add(prompt.name.toLowerCase());
    aliases.add(`/${prompt.name.toLowerCase()}`);
    aliases.add(prompt.title.toLowerCase());
    if (prompt.name.includes("-")) {
      aliases.add(prompt.name.replace(/-/g, " ").toLowerCase());
    }
    return {
      name: prompt.name,
      aliases: Array.from(aliases),
    };
  });
}

function deriveSkillFormat(prompt) {
  if (prompt.skill_format) {
    return prompt.skill_format;
  }
  return /\/SKILL\.md$/i.test(prompt.distilled) ? "progressive-disclosure" : "single-file";
}

function deriveEvalReferences(prompt) {
  const configured = defaultArray(prompt.eval?.references).map((reference) => ({
    ...reference,
    aliases: defaultArray(reference.aliases).map(normalizeText),
  }));
  if (configured.length > 0) {
    return configured;
  }

  if (deriveSkillFormat(prompt) !== "progressive-disclosure") {
    return [];
  }

  const referenceDir = path.join(path.dirname(prompt.distilled), "references");
  const absoluteReferenceDir = path.join(REPO_ROOT, referenceDir);
  if (!fileExists(absoluteReferenceDir)) {
    return [];
  }

  return fs
    .readdirSync(absoluteReferenceDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.md$/i.test(entry.name))
    .sort((left, right) => left.name.localeCompare(right.name))
    .map((entry) => ({
      id: entry.name.replace(/\.md$/i, ""),
      path: path.join(referenceDir, entry.name),
      purpose: "reference",
      stage: null,
      optional: true,
      aliases: [
        normalizeText(`references/${entry.name}`),
        normalizeText(entry.name),
        normalizeText(entry.name.replace(/\.md$/i, "").replace(/-/g, " ")),
      ],
    }));
}

function buildSkillCatalog(manifest) {
  const byName = {};

  for (const prompt of manifest.prompts) {
    const skillFormat = deriveSkillFormat(prompt);
    const stages = defaultArray(prompt.eval?.stages).map((stage) => ({
      name: stage.name,
      hints: Array.from(
        new Set([
          normalizeText(stage.name).replace(/-/g, " "),
          ...defaultArray(stage.hints).map(normalizeText),
        ]),
      ),
    }));
    const references = deriveEvalReferences(prompt).map((reference) => {
      const normalizedPath = normalizeText(reference.path);
      const relativeToSkill = normalizeText(
        path.relative(path.dirname(prompt.distilled), reference.path).replace(/\\/g, "/"),
      );
      return {
        ...reference,
        aliases: Array.from(
          new Set([
            normalizedPath,
            relativeToSkill,
            ...defaultArray(reference.aliases).map(normalizeText),
          ]),
        ),
      };
    });

    byName[prompt.name] = {
      name: prompt.name,
      title: prompt.title,
      distilled: prompt.distilled,
      skillFormat,
      stages,
      references,
      eval: prompt.eval || null,
    };
  }

  return byName;
}

function extractPromptRefs(text, promptMatchers) {
  const matches = new Set();
  for (const matcher of promptMatchers) {
    if (matcher.aliases.some((alias) => text.includes(alias))) {
      matches.add(matcher.name);
    }
  }
  return Array.from(matches);
}

function extractFileMentions(text) {
  return (
    text.match(/(?:content\/|references\/)?[\w./-]+\.(md|json|js|ts|tsx|jsx|py|rb|go|rs|sh)\b/g) || []
  ).map((match) => match.replace(/^['"`]+|['"`]+$/g, ""));
}

function extractSkillRefsFromSlashCommands(slashCommands, skillCatalog) {
  const matches = new Set();
  for (const slashCommand of slashCommands) {
    const normalized = normalizeText(slashCommand).replace(/^\//, "");
    if (skillCatalog[normalized]) {
      matches.add(normalized);
    }
  }
  return Array.from(matches);
}

function resolveActiveSkills(promptRefs, slashCommands, activeSkills, skillCatalog) {
  const matches = new Set();
  for (const promptRef of promptRefs) {
    matches.add(promptRef);
  }
  for (const skillRef of extractSkillRefsFromSlashCommands(slashCommands, skillCatalog)) {
    matches.add(skillRef);
  }
  for (const activeSkill of activeSkills) {
    matches.add(activeSkill);
  }
  return Array.from(matches);
}

function extractStageHints(text, activeSkills, skillCatalog, fileMentions = []) {
  const matches = [];
  const seen = new Set();
  const normalizedFileMentions = fileMentions.map(normalizeText);

  for (const skillName of activeSkills) {
    const skill = skillCatalog[skillName];
    if (!skill) {
      continue;
    }
    for (const stage of skill.stages) {
      if (!stage.name || stage.hints.length === 0) {
        continue;
      }
      if (
        stage.hints.some((hint) => text.includes(hint)) ||
        normalizedFileMentions.some((fileMention) =>
          stage.hints.some((hint) => fileMention.includes(hint) || hint.includes(fileMention)),
        )
      ) {
        const key = `${skillName}:${stage.name}`;
        if (!seen.has(key)) {
          seen.add(key);
          matches.push({ skill: skillName, stage: stage.name });
        }
      }
    }
  }

  return matches;
}

function extractReferenceMentions(text, activeSkills, skillCatalog, fileMentions = []) {
  const matches = [];
  const seen = new Set();
  const normalizedFileMentions = fileMentions.map(normalizeText);

  for (const skillName of activeSkills) {
    const skill = skillCatalog[skillName];
    if (!skill) {
      continue;
    }
    for (const reference of skill.references) {
      if (!reference.id || defaultArray(reference.aliases).length === 0) {
        continue;
      }
      if (
        reference.aliases.some((alias) => text.includes(alias)) ||
        normalizedFileMentions.some((fileMention) =>
          reference.aliases.some((alias) => fileMention === alias || fileMention.endsWith(alias) || alias.endsWith(fileMention)),
        )
      ) {
        const key = `${skillName}:${reference.id}`;
        if (!seen.has(key)) {
          seen.add(key);
          matches.push({
            skill: skillName,
            reference: reference.id,
            stage: reference.stage || null,
            optional: reference.optional !== false,
          });
        }
      }
    }
  }

  return matches;
}

function extractSlashCommands(text) {
  return (text.match(/(?:^|\s)(\/[a-z0-9][\w-]*)\b/gi) || []).map((match) =>
    match.trim().toLowerCase(),
  );
}

function extractToolName(object) {
  const candidateKeys = ["tool_name", "toolName", "function_name", "functionName", "name"];
  for (const key of candidateKeys) {
    const value = object[key];
    if (typeof value !== "string") {
      continue;
    }
    if (key === "name" && normalizeRole(object) !== "tool") {
      continue;
    }
    return value;
  }
  return null;
}

function detectTestsMentioned(text) {
  return /\b(test|tests|pytest|vitest|jest|npm test|cargo test|go test)\b/.test(text);
}

function classifyEventFromMessage(message, promptRefs, slashCommands, toolName) {
  if (promptRefs.length > 0) {
    return "prompt";
  }
  if (slashCommands.length > 0) {
    return "command";
  }
  if (toolName) {
    return "tool";
  }

  const role = normalizeRole(message);
  if (role === "assistant") {
    return "assistant";
  }
  if (role === "user") {
    return "user";
  }
  return null;
}

function buildTransitions(events, metrics) {
  let previous = null;
  let activePrompt = null;

  for (const event of events) {
    if (previous) {
      increment(metrics.transitions, `${previous}->${event.kind}`);
    }
    previous = event.kind;

    if (event.promptRefs.length > 0) {
      activePrompt = event.promptRefs[0];
      continue;
    }

    if (event.toolName) {
      if (activePrompt) {
        metrics.toolRunsAfterPrompt += 1;
        increment(metrics.promptToolPairs, `${activePrompt} -> ${event.toolName}`);
      }
      continue;
    }
  }
}

function classifyOutcome(messages) {
  if (messages.length === 0) {
    return {
      outcome: "unknown",
      evidence: [],
    };
  }

  const assistantMessages = messages
    .filter((message) => normalizeRole(message) === "assistant")
    .map((message) => extractText(message).toLowerCase())
    .filter(Boolean);

  const sample = assistantMessages.slice(-3).join("\n");
  const evidence = [];

  if (/(all tests pass|tests passed|implemented|completed|done|verified|success)/.test(sample)) {
    evidence.push("positive completion language");
  }
  if (/(could not|failed|error|exception|blocked|unable to|didn't work)/.test(sample)) {
    evidence.push("failure language");
  }
  if (/(need user input|waiting for confirmation|how should i proceed|requires approval)/.test(sample)) {
    evidence.push("waiting language");
  }

  if (evidence.includes("failure language")) {
    return { outcome: "failed", evidence };
  }
  if (evidence.includes("waiting language")) {
    return { outcome: "needs_input", evidence };
  }
  if (evidence.includes("positive completion language")) {
    return { outcome: "succeeded", evidence };
  }
  return { outcome: "unknown", evidence };
}

function analyzeStructuredContent(structured, filePath, promptMatchers, skillCatalog, provider) {
  const metrics = emptyMetrics(provider, filePath);
  metrics.summary.structured = true;

  const objects = flattenObjects(structured);
  const messages = collectPotentialMessages(structured);
  const events = [];
  const activeSkills = new Set();

  for (const hint of PROVIDER_HINTS[provider]?.eventKeys || []) {
    if (JSON.stringify(structured).toLowerCase().includes(`"${hint.toLowerCase()}"`)) {
      metrics.summary.providerHintsMatched += 1;
    }
  }

  for (const object of objects) {
    if (!object || typeof object !== "object" || Array.isArray(object)) {
      continue;
    }

    accumulateTokens(metrics.tokenUsage, object);

    const eventType = object.event || object.event_type || object.type;
    if (typeof eventType === "string") {
      increment(metrics.eventTypes, eventType);
    }

    const toolName = extractToolName(object);
    if (toolName) {
      increment(metrics.toolCalls, toolName);
    }

    const modelName = object.model || object.model_name || object.modelName;
    if (typeof modelName === "string" && modelName) {
      increment(metrics.modelCounts, modelName);
    }

    if (typeof object.sessionId === "string" && object.sessionId) {
      metrics.sessionId = object.sessionId;
    }
    maybeUpdateTimestamps(metrics, object);
  }

  for (const message of messages) {
    const role = normalizeRole(message) || "unknown";
    const text = extractText(message).toLowerCase();
    const promptRefs = extractPromptRefs(text, promptMatchers);
    const slashCommands = extractSlashCommands(text);
    const toolName = role === "tool" ? extractToolName(message) : null;
    const fileMentions = extractFileMentions(text);
    const resolvedSkills = resolveActiveSkills(promptRefs, slashCommands, Array.from(activeSkills), skillCatalog);
    const stageHints = extractStageHints(text, resolvedSkills, skillCatalog, fileMentions);
    const referenceMentions = extractReferenceMentions(text, resolvedSkills, skillCatalog, fileMentions);

    metrics.messageCount += 1;
    increment(metrics.roleCounts, role);

    for (const promptRef of promptRefs) {
      increment(metrics.promptCounts, promptRef);
      metrics.skillsUsed[promptRef] = skillCatalog[promptRef] || {
        name: promptRef,
        skillFormat: "unknown",
        stages: [],
        references: [],
        eval: null,
      };
      increment(metrics.skillFormatCounts, metrics.skillsUsed[promptRef].skillFormat || "unknown");
    }
    for (const slashCommand of slashCommands) {
      increment(metrics.slashCommandCounts, slashCommand);
    }
    for (const promptRef of extractSkillRefsFromSlashCommands(slashCommands, skillCatalog)) {
      metrics.skillsUsed[promptRef] = skillCatalog[promptRef] || {
        name: promptRef,
        skillFormat: "unknown",
        stages: [],
        references: [],
        eval: null,
      };
      increment(metrics.skillFormatCounts, metrics.skillsUsed[promptRef].skillFormat || "unknown");
    }
    for (const activeSkill of resolvedSkills) {
      activeSkills.add(activeSkill);
    }
    for (const fileMention of fileMentions) {
      increment(metrics.fileMentions, fileMention);
    }

    if (role === "user") {
      metrics.promptRefsInUserMessages += promptRefs.length;
      if (!metrics.firstUserExcerpt && text) {
        metrics.firstUserExcerpt = clipText(text);
      }
    }
    if (role === "assistant") {
      metrics.promptRefsInAssistantMessages += promptRefs.length;
      if (text) {
        metrics.lastAssistantExcerpt = clipText(text);
      }
      if (text.includes("```")) {
        metrics.outputSignals.codeBlocks += 1;
      }
      if (/\[[ x]\]/.test(text)) {
        metrics.outputSignals.checklists += 1;
      }
    }
    if (detectTestsMentioned(text)) {
      metrics.testsMentioned += 1;
    }
    for (const stageHint of stageHints) {
      increment(metrics.stageCounts, `${stageHint.skill}:${stageHint.stage}`);
    }
    for (const referenceMention of referenceMentions) {
      increment(metrics.referenceCounts, `${referenceMention.skill}:${referenceMention.reference}`);
      increment(metrics.referenceCountsBySkill, referenceMention.skill);
      if (referenceMention.stage) {
        increment(metrics.referenceStageCounts, `${referenceMention.skill}:${referenceMention.stage}`);
        increment(metrics.stageCounts, `${referenceMention.skill}:${referenceMention.stage}`);
      }
    }

    const kind = classifyEventFromMessage(message, promptRefs, slashCommands, toolName);
    if (kind) {
      events.push({ kind, promptRefs, toolName });
    }
  }

  if (metrics.messageCount === 0) {
    const fallbackText = JSON.stringify(structured).toLowerCase();
    for (const promptRef of extractPromptRefs(fallbackText, promptMatchers)) {
      increment(metrics.promptCounts, promptRef);
      metrics.skillsUsed[promptRef] = skillCatalog[promptRef] || {
        name: promptRef,
        skillFormat: "unknown",
        stages: [],
        references: [],
        eval: null,
      };
      increment(metrics.skillFormatCounts, metrics.skillsUsed[promptRef].skillFormat || "unknown");
    }
  }

  buildTransitions(events, metrics);
  const outcome = classifyOutcome(messages);
  metrics.outcome = outcome.outcome;
  metrics.outcomeEvidence = outcome.evidence;

  return metrics;
}

function analyzeTextContent(content, filePath, promptMatchers, skillCatalog, provider) {
  const metrics = emptyMetrics(provider, filePath);
  const text = content.toLowerCase();
  metrics.firstUserExcerpt = clipText(content);
  metrics.lastAssistantExcerpt = clipText(content);

  metrics.messageCount = (text.match(/\b(user|assistant|tool|system)\b/g) || []).length;

  for (const promptRef of extractPromptRefs(text, promptMatchers)) {
    increment(metrics.promptCounts, promptRef);
    metrics.skillsUsed[promptRef] = skillCatalog[promptRef] || {
      name: promptRef,
      skillFormat: "unknown",
      stages: [],
      references: [],
      eval: null,
    };
    increment(metrics.skillFormatCounts, metrics.skillsUsed[promptRef].skillFormat || "unknown");
  }
  const slashCommands = extractSlashCommands(text);
  const fileMentions = extractFileMentions(text);
  for (const slashCommand of slashCommands) {
    increment(metrics.slashCommandCounts, slashCommand);
  }
  for (const promptRef of extractSkillRefsFromSlashCommands(slashCommands, skillCatalog)) {
    metrics.skillsUsed[promptRef] = skillCatalog[promptRef] || {
      name: promptRef,
      skillFormat: "unknown",
      stages: [],
      references: [],
      eval: null,
    };
    increment(metrics.skillFormatCounts, metrics.skillsUsed[promptRef].skillFormat || "unknown");
  }
  for (const fileMention of fileMentions) {
    increment(metrics.fileMentions, fileMention);
  }
  const activeSkills = Object.keys(metrics.skillsUsed);
  for (const stageHint of extractStageHints(text, activeSkills, skillCatalog, fileMentions)) {
    increment(metrics.stageCounts, `${stageHint.skill}:${stageHint.stage}`);
  }
  for (const referenceMention of extractReferenceMentions(text, activeSkills, skillCatalog, fileMentions)) {
    increment(metrics.referenceCounts, `${referenceMention.skill}:${referenceMention.reference}`);
    increment(metrics.referenceCountsBySkill, referenceMention.skill);
    if (referenceMention.stage) {
      increment(metrics.referenceStageCounts, `${referenceMention.skill}:${referenceMention.stage}`);
      increment(metrics.stageCounts, `${referenceMention.skill}:${referenceMention.stage}`);
    }
  }
  if (detectTestsMentioned(text)) {
    metrics.testsMentioned += 1;
  }
  if (text.includes("```")) {
    metrics.outputSignals.codeBlocks += 1;
  }
  if (/\[[ x]\]/.test(text)) {
    metrics.outputSignals.checklists += 1;
  }

  const outcome = classifyOutcome([
    {
      role: "assistant",
      content,
    },
  ]);
  metrics.outcome = outcome.outcome;
  metrics.outcomeEvidence = outcome.evidence;

  return metrics;
}

function parseContent(filePath, promptMatchers, skillCatalog, sourceProvider = null) {
  const content = fs.readFileSync(filePath, "utf8");
  const provider = sourceProvider || detectProvider(filePath, content);

  try {
    if (/\.(jsonl|ndjson)$/i.test(filePath)) {
      const records = content
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => JSON.parse(line));
      return analyzeStructuredContent(records, filePath, promptMatchers, skillCatalog, provider);
    }
    if (/\.json$/i.test(filePath)) {
      return analyzeStructuredContent(JSON.parse(content), filePath, promptMatchers, skillCatalog, provider);
    }
  } catch (error) {
    return analyzeTextContent(content, filePath, promptMatchers, skillCatalog, provider);
  }

  return analyzeTextContent(content, filePath, promptMatchers, skillCatalog, provider);
}

function sumMapValues(map) {
  return Object.values(map).reduce((sum, value) => sum + value, 0);
}

function inferTaskType(record) {
  const promptNames = record.prompts_used;
  const excerpt = `${record.first_user_excerpt} ${record.last_assistant_excerpt}`.toLowerCase();

  if (promptNames.includes("debug") || /bug|debug|error|failing|broken/.test(excerpt)) {
    return "debugging";
  }
  if (promptNames.includes("commit") || /git commit|commit/.test(excerpt)) {
    return "commit";
  }
  if (promptNames.includes("tdd") || /test|pytest|jest|vitest|cargo test/.test(excerpt)) {
    return "testing";
  }
  if (promptNames.includes("code-review") || promptNames.includes("parallel-review") || promptNames.includes("rule-of-5")) {
    return "review";
  }
  if (/plan|roadmap|phase/.test(excerpt)) {
    return "planning";
  }
  if (/document|docs|readme/.test(excerpt)) {
    return "documentation";
  }
  return "unknown";
}

function buildSessionRecord(fileReport) {
  const promptsUsed = topEntries(fileReport.promptCounts, 50).map((entry) => entry.name);
  const slashCommands = topEntries(fileReport.slashCommandCounts, 50).map((entry) => entry.name);
  const toolsUsed = topEntries(fileReport.toolCalls, 50).map((entry) => entry.name);
  const topModel = topEntries(fileReport.modelCounts, 1)[0]?.name || null;
  const stageHints = topEntries(fileReport.stageCounts, 50).map((entry) => entry.name);
  const referencesUsed = topEntries(fileReport.referenceCounts, 50).map((entry) => entry.name);
  const skillFormats = Object.fromEntries(
    Object.entries(fileReport.skillsUsed).map(([skillName, skill]) => [skillName, skill.skillFormat || "unknown"]),
  );

  const record = {
    session_id: fileReport.sessionId,
    file_path: fileReport.filePath,
    provider: fileReport.provider,
    model: topModel,
    task_type: "unknown",
    prompts_used: promptsUsed,
    skill_formats: skillFormats,
    progressive_skills_used: promptsUsed.filter((promptName) => skillFormats[promptName] === "progressive-disclosure"),
    references_used: referencesUsed,
    stage_hints: stageHints,
    prompt_sequence_hints: topEntries(fileReport.promptToolPairs, 20).map((entry) => entry.name),
    slash_commands: slashCommands,
    tools_used: toolsUsed,
    tool_call_count: sumMapValues(fileReport.toolCalls),
    file_mentions_count: sumMapValues(fileReport.fileMentions),
    files_mentioned_top: topEntries(fileReport.fileMentions, 10).map((entry) => entry.name),
    tests_run_or_mentioned: fileReport.testsMentioned > 0,
    verification_present:
      fileReport.testsMentioned > 0 || fileReport.outputSignals.checklists > 0,
    commit_created:
      promptsUsed.includes("commit") ||
      slashCommands.includes("/commit") ||
      /git commit|create commit|committed/.test(fileReport.lastAssistantExcerpt),
    tokens_total: fileReport.tokenUsage.total,
    turn_count: fileReport.messageCount,
    role_counts: fileReport.roleCounts,
    outcome_guess: fileReport.outcome,
    outcome_evidence: fileReport.outcomeEvidence,
    first_timestamp: fileReport.firstTimestamp,
    last_timestamp: fileReport.lastTimestamp,
    first_user_excerpt: fileReport.firstUserExcerpt,
    last_assistant_excerpt: fileReport.lastAssistantExcerpt,
    prompt_help_signals: {
      prompt_refs_in_user_messages: fileReport.promptRefsInUserMessages,
      prompt_refs_in_assistant_messages: fileReport.promptRefsInAssistantMessages,
      prompt_to_tool_runs: fileReport.toolRunsAfterPrompt,
      code_blocks: fileReport.outputSignals.codeBlocks,
      checklists: fileReport.outputSignals.checklists,
      references_loaded_or_mentioned: sumMapValues(fileReport.referenceCounts),
      stages_detected: sumMapValues(fileReport.stageCounts),
    },
    human_labeled: false,
    label: null,
  };

  record.task_type = inferTaskType(record);
  return record;
}

function joinLabels(sessionRecords, labelIndex) {
  return sessionRecords.map((record) => {
    const label =
      labelIndex.bySessionId.get(record.session_id) ||
      labelIndex.byFilePath.get(path.resolve(record.file_path)) ||
      null;

    if (!label) {
      return record;
    }

    return {
      ...record,
      human_labeled: true,
      label,
    };
  });
}

function buildLabelQueue(sessionRecords) {
  return sessionRecords
    .filter((record) => !record.human_labeled)
    .map((record) => ({
      session_id: record.session_id,
      file_path: record.file_path,
      provider: record.provider,
      model: record.model,
      task_type_guess: record.task_type,
      prompts_used: record.prompts_used,
      progressive_skills_used: record.progressive_skills_used,
      references_used: record.references_used,
      stage_hints: record.stage_hints,
      outcome_guess: record.outcome_guess,
      first_user_excerpt: record.first_user_excerpt,
      last_assistant_excerpt: record.last_assistant_excerpt,
      questions: [
        "What is the task type?",
        "What was the final outcome? (succeeded|partial|failed|abandoned|needs_input)",
        "Which prompts were actually helpful?",
        "Which references were actually helpful?",
        "Was human rescue needed?",
        "Was verification present?",
      ],
    }));
}

function buildEffectivenessSummary(sessionRecords) {
  const labeled = sessionRecords.filter((record) => record.human_labeled && record.label);
  const byPrompt = {};
  const byReference = {};

  for (const record of labeled) {
    const outcome = record.label.outcome || "unknown";
    for (const prompt of record.prompts_used) {
      if (!byPrompt[prompt]) {
        byPrompt[prompt] = {
          labeled_sessions: 0,
          outcomes: {},
          human_rescue_needed: 0,
          verification_present: 0,
          helpful_votes: 0,
        };
      }
      const bucket = byPrompt[prompt];
      bucket.labeled_sessions += 1;
      increment(bucket.outcomes, outcome);
      if (record.label.human_rescue_needed === true) {
        bucket.human_rescue_needed += 1;
      }
      if (record.label.verification_present === true) {
        bucket.verification_present += 1;
      }
      const helpful = record.label.prompt_helpfulness || record.label.prompt_effectiveness || null;
      if (
        helpful === true ||
        helpful === "helpful" ||
        (typeof helpful === "object" && helpful[prompt] && ["helpful", true].includes(helpful[prompt]))
      ) {
        bucket.helpful_votes += 1;
      }
    }

    const helpfulReferences = record.label.reference_helpfulness || record.label.reference_effectiveness || null;
    for (const referenceName of defaultArray(record.references_used)) {
      if (!byReference[referenceName]) {
        byReference[referenceName] = {
          labeled_sessions: 0,
          outcomes: {},
          helpful_votes: 0,
        };
      }
      const bucket = byReference[referenceName];
      bucket.labeled_sessions += 1;
      increment(bucket.outcomes, outcome);
      if (
        helpfulReferences === true ||
        helpfulReferences === "helpful" ||
        (typeof helpfulReferences === "object" &&
          helpfulReferences[referenceName] &&
          ["helpful", true].includes(helpfulReferences[referenceName]))
      ) {
        bucket.helpful_votes += 1;
      }
    }
  }

  return {
    labeled_sessions: labeled.length,
    prompts: byPrompt,
    references: byReference,
  };
}

function mergeMaps(target, source) {
  for (const [key, value] of Object.entries(source)) {
    target[key] = (target[key] || 0) + value;
  }
}

function buildAggregate(fileReports) {
  const aggregate = {
    traces: fileReports.length,
    providers: {},
    totals: {
      messages: 0,
      traces: fileReports.length,
      tokenUsage: {
        input: 0,
        output: 0,
        total: 0,
      },
      toolRunsAfterPrompt: 0,
      testsMentioned: 0,
    },
    roleCounts: {},
    promptCounts: {},
    skillFormatCounts: {},
    skillSessionCounts: {},
    skillSessionCountsByFormat: {},
    slashCommandCounts: {},
    toolCalls: {},
    modelCounts: {},
    fileMentions: {},
    referenceCounts: {},
    referenceCountsBySkill: {},
    referenceStageCounts: {},
    stageCounts: {},
    stageSessionCounts: {},
    referenceSessionCounts: {},
    eventTypes: {},
    transitions: {},
    promptToolPairs: {},
    outcomes: {},
    outputSignals: {
      codeBlocks: 0,
      checklists: 0,
    },
  };

  for (const report of fileReports) {
    aggregate.totals.messages += report.messageCount;
    aggregate.totals.tokenUsage.input += report.tokenUsage.input;
    aggregate.totals.tokenUsage.output += report.tokenUsage.output;
    aggregate.totals.tokenUsage.total += report.tokenUsage.total;
    aggregate.totals.toolRunsAfterPrompt += report.toolRunsAfterPrompt;
    aggregate.totals.testsMentioned += report.testsMentioned;

    if (!aggregate.providers[report.provider]) {
      aggregate.providers[report.provider] = {
        traces: 0,
        messages: 0,
        tokenUsage: {
          input: 0,
          output: 0,
          total: 0,
        },
        prompts: {},
        models: {},
        tools: {},
        outcomes: {},
      };
    }

    const provider = aggregate.providers[report.provider];
    provider.traces += 1;
    provider.messages += report.messageCount;
    provider.tokenUsage.input += report.tokenUsage.input;
    provider.tokenUsage.output += report.tokenUsage.output;
    provider.tokenUsage.total += report.tokenUsage.total;
    mergeMaps(provider.prompts, report.promptCounts);
    mergeMaps(provider.models, report.modelCounts);
    mergeMaps(provider.tools, report.toolCalls);
    increment(provider.outcomes, report.outcome);

    mergeMaps(aggregate.roleCounts, report.roleCounts);
    mergeMaps(aggregate.promptCounts, report.promptCounts);
    mergeMaps(aggregate.skillFormatCounts, report.skillFormatCounts);
    mergeMaps(aggregate.slashCommandCounts, report.slashCommandCounts);
    mergeMaps(aggregate.toolCalls, report.toolCalls);
    mergeMaps(aggregate.modelCounts, report.modelCounts);
    mergeMaps(aggregate.fileMentions, report.fileMentions);
    mergeMaps(aggregate.referenceCounts, report.referenceCounts);
    mergeMaps(aggregate.referenceCountsBySkill, report.referenceCountsBySkill);
    mergeMaps(aggregate.referenceStageCounts, report.referenceStageCounts);
    mergeMaps(aggregate.stageCounts, report.stageCounts);
    mergeMaps(aggregate.eventTypes, report.eventTypes);
    mergeMaps(aggregate.transitions, report.transitions);
    mergeMaps(aggregate.promptToolPairs, report.promptToolPairs);
    increment(aggregate.outcomes, report.outcome);
    aggregate.outputSignals.codeBlocks += report.outputSignals.codeBlocks;
    aggregate.outputSignals.checklists += report.outputSignals.checklists;
  }

  return aggregate;
}

function augmentAggregateWithSessionRecords(aggregate, sessionRecords) {
  for (const record of sessionRecords) {
    for (const promptName of defaultArray(record.prompts_used)) {
      increment(aggregate.skillSessionCounts, promptName);
      increment(aggregate.skillSessionCountsByFormat, record.skill_formats?.[promptName] || "unknown");
    }
    for (const referenceName of defaultArray(record.references_used)) {
      increment(aggregate.referenceSessionCounts, referenceName);
    }
    for (const stageName of defaultArray(record.stage_hints)) {
      increment(aggregate.stageSessionCounts, stageName);
    }
  }

  return aggregate;
}

function topEntries(map, limit) {
  return Object.entries(map)
    .sort((left, right) => {
      if (right[1] !== left[1]) {
        return right[1] - left[1];
      }
      return left[0].localeCompare(right[0]);
    })
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }));
}

function inferConclusions(aggregate, top) {
  const conclusions = [];
  const providerLeader = topEntries(
    Object.fromEntries(Object.entries(aggregate.providers).map(([name, metrics]) => [name, metrics.traces])),
    1,
  )[0];
  const promptLeaders = topEntries(aggregate.skillSessionCounts, 3);
  const toolLeaders = topEntries(aggregate.toolCalls, 3);
  const referenceLeaders = topEntries(aggregate.referenceSessionCounts, 3);
  const transitionLeaders = topEntries(aggregate.transitions, 3);
  const outcomeLeaders = topEntries(aggregate.outcomes, 3);

  if (providerLeader) {
    conclusions.push(
      `${providerLeader.name} produced the largest share of analyzed traces (${providerLeader.count}/${aggregate.traces}).`,
    );
  }

  if (promptLeaders.length > 0) {
    conclusions.push(
      `The most used skills by session were ${promptLeaders.map((item) => `${item.name} (${item.count})`).join(", ")}.`,
    );
  } else {
    conclusions.push("No prompt references were detected. The traces may need richer exports or additional aliases.");
  }

  if (toolLeaders.length > 0) {
    conclusions.push(
      `The heaviest tool usage clustered around ${toolLeaders.map((item) => `${item.name} (${item.count})`).join(", ")}.`,
    );
  }

  if (referenceLeaders.length > 0) {
    conclusions.push(
      `The most frequently used progressive-disclosure references by session were ${referenceLeaders.map((item) => `${item.name} (${item.count})`).join(", ")}.`,
    );
  }

  if (transitionLeaders.length > 0) {
    conclusions.push(
      `The dominant workflow transitions were ${transitionLeaders.map((item) => `${item.name} (${item.count})`).join(", ")}.`,
    );
  }

  if (outcomeLeaders.length > 0) {
    conclusions.push(
      `Detected session outcomes skewed toward ${outcomeLeaders.map((item) => `${item.name} (${item.count})`).join(", ")}.`,
    );
  }

  if (aggregate.totals.toolRunsAfterPrompt > 0) {
    conclusions.push(
      `Prompt references were followed by tool execution ${aggregate.totals.toolRunsAfterPrompt} times, which is a useful proxy for prompts driving actual work.`,
    );
  }

  if (aggregate.totals.tokenUsage.total > 0) {
    conclusions.push(
      `Structured token usage was available for ${aggregate.totals.tokenUsage.total} total tokens across the analyzed exports.`,
    );
  } else {
    conclusions.push("Most traces did not expose token usage fields, so the report is stronger on behavior than cost.");
  }

  return conclusions.slice(0, top);
}

function formatMarkdown(report, top, verbose = false) {
  const lines = [];
  const aggregate = report.aggregate;

  lines.push("# Trace Usage Analysis");
  lines.push("");
  lines.push(`Analyzed ${aggregate.traces} trace files.`);
  lines.push("");

  lines.push("## Sources");
  lines.push("");
  if (report.detectedInputs.length === 0) {
    lines.push("- No auto-detected sources recorded");
  } else if (verbose) {
    for (const detectedInput of report.detectedInputs) {
      lines.push(`- ${detectedInput.provider}: ${detectedInput.path}`);
    }
  } else {
    const sourceCounts = {};
    for (const detectedInput of report.detectedInputs) {
      increment(sourceCounts, detectedInput.provider);
    }
    for (const entry of topEntries(sourceCounts, top)) {
      lines.push(`- ${entry.name}: ${entry.count} source paths`);
    }
    lines.push(`- Use \`--verbose\` to list all ${report.detectedInputs.length} detected sources`);
  }
  lines.push("");

  lines.push("## Totals");
  lines.push("");
  lines.push(`- Messages: ${aggregate.totals.messages}`);
  lines.push(`- Input tokens: ${aggregate.totals.tokenUsage.input}`);
  lines.push(`- Output tokens: ${aggregate.totals.tokenUsage.output}`);
  lines.push(`- Total tokens: ${aggregate.totals.tokenUsage.total}`);
  lines.push(`- Prompt -> tool executions: ${aggregate.totals.toolRunsAfterPrompt}`);
  lines.push(`- Test mentions: ${aggregate.totals.testsMentioned}`);
  lines.push(`- Reference evidence hits: ${sumMapValues(aggregate.referenceCounts)}`);
  lines.push(`- Stage evidence hits: ${sumMapValues(aggregate.stageCounts)}`);
  lines.push(`- Assistant code blocks: ${aggregate.outputSignals.codeBlocks}`);
  lines.push(`- Assistant checklists: ${aggregate.outputSignals.checklists}`);
  lines.push(`- Cache hits: ${report.cache.hits}`);
  lines.push(`- Cache misses: ${report.cache.misses}`);
  lines.push("");

  lines.push("## Providers");
  lines.push("");
  for (const [provider, metrics] of Object.entries(aggregate.providers).sort((a, b) => b[1].traces - a[1].traces)) {
    const outcomes = topEntries(metrics.outcomes, 2).map((entry) => `${entry.name}=${entry.count}`).join(", ");
    lines.push(
      `- ${provider}: ${metrics.traces} traces, ${metrics.messages} messages, ${metrics.tokenUsage.total} total tokens${outcomes ? `, outcomes: ${outcomes}` : ""}`,
    );
  }
  lines.push("");

  lines.push("## Progressive Disclosure");
  lines.push("");
  const progressiveSessions = report.session_records.filter(
    (record) => defaultArray(record.progressive_skills_used).length > 0,
  );
  lines.push(`- Sessions using progressive-disclosure skills: ${progressiveSessions.length}`);
  lines.push(`- Progressive-disclosure skill sessions: ${aggregate.skillSessionCountsByFormat["progressive-disclosure"] || 0}`);
  lines.push(`- Single-file skill sessions: ${aggregate.skillSessionCountsByFormat["single-file"] || 0}`);
  lines.push(`- Progressive-disclosure evidence hits: ${aggregate.skillFormatCounts["progressive-disclosure"] || 0}`);
  lines.push(`- Single-file evidence hits: ${aggregate.skillFormatCounts["single-file"] || 0}`);
  if (progressiveSessions.length > 0) {
    const avgReferences =
      progressiveSessions.reduce((sum, record) => sum + defaultArray(record.references_used).length, 0) /
      progressiveSessions.length;
    const avgStages =
      progressiveSessions.reduce((sum, record) => sum + defaultArray(record.stage_hints).length, 0) /
      progressiveSessions.length;
    lines.push(`- Average references per progressive session: ${avgReferences.toFixed(2)}`);
    lines.push(`- Average stage hints per progressive session: ${avgStages.toFixed(2)}`);
  } else {
    lines.push("- No progressive-disclosure skill usage detected");
  }
  lines.push("");

  const sections = [
    ["Top Skills By Session", aggregate.skillSessionCounts],
    ["Skill Formats By Session", aggregate.skillSessionCountsByFormat],
    ["Skill Evidence Hits", aggregate.skillFormatCounts],
    ["Top Prompt Mentions", aggregate.promptCounts],
    ["Top Slash Commands", aggregate.slashCommandCounts],
    ["Top Tools", aggregate.toolCalls],
    ["Top Models", aggregate.modelCounts],
    ["Top References By Session", aggregate.referenceSessionCounts],
    ["Top Reference Evidence Hits", aggregate.referenceCounts],
    ["Reference Usage By Skill", aggregate.referenceCountsBySkill],
    ["Top Stages By Session", aggregate.stageSessionCounts],
    ["Top Stage Evidence Hits", aggregate.stageCounts],
    ["Top Prompt -> Tool Pairs", aggregate.promptToolPairs],
    ["Top Workflow Transitions", aggregate.transitions],
    ["Top File Mentions", aggregate.fileMentions],
    ["Outcomes", aggregate.outcomes],
  ];

  for (const [title, map] of sections) {
    lines.push(`## ${title}`);
    lines.push("");
    const entries = topEntries(map, top);
    if (entries.length === 0) {
      lines.push("- None detected");
    } else {
      for (const entry of entries) {
        lines.push(`- ${entry.name}: ${entry.count}`);
      }
    }
    lines.push("");
  }

  lines.push("## Conclusions");
  lines.push("");
  for (const conclusion of report.conclusions) {
    lines.push(`- ${conclusion}`);
  }
  lines.push("");

  if (report.effectiveness) {
    lines.push("## Labels");
    lines.push("");
    lines.push(`- Labeled sessions: ${report.effectiveness.labeled_sessions}`);
    const rankedPrompts = Object.entries(report.effectiveness.prompts)
      .sort((left, right) => right[1].labeled_sessions - left[1].labeled_sessions)
      .slice(0, top);
    if (rankedPrompts.length === 0) {
      lines.push("- No labeled prompt effectiveness data yet");
    } else {
      for (const [prompt, stats] of rankedPrompts) {
        const outcomes = topEntries(stats.outcomes, 3)
          .map((entry) => `${entry.name}=${entry.count}`)
          .join(", ");
        lines.push(
          `- ${prompt}: labeled=${stats.labeled_sessions}, helpful_votes=${stats.helpful_votes}, verification=${stats.verification_present}, rescue=${stats.human_rescue_needed}${outcomes ? `, outcomes: ${outcomes}` : ""}`,
        );
      }
    }
    const rankedReferences = Object.entries(report.effectiveness.references || {})
      .sort((left, right) => right[1].labeled_sessions - left[1].labeled_sessions)
      .slice(0, top);
    if (rankedReferences.length === 0) {
      lines.push("- No labeled reference effectiveness data yet");
    } else {
      for (const [referenceName, stats] of rankedReferences) {
        const outcomes = topEntries(stats.outcomes, 3)
          .map((entry) => `${entry.name}=${entry.count}`)
          .join(", ");
        lines.push(
          `- ${referenceName}: labeled=${stats.labeled_sessions}, helpful_votes=${stats.helpful_votes}${outcomes ? `, outcomes: ${outcomes}` : ""}`,
        );
      }
    }
    lines.push("");
  }

  lines.push("## Files");
  lines.push("");
  if (verbose) {
    for (const fileReport of report.files) {
      const relativePath = path.relative(REPO_ROOT, fileReport.filePath);
      lines.push(
        `- ${relativePath}: ${fileReport.provider}, ${fileReport.messageCount} messages, outcome=${fileReport.outcome}, hints=${fileReport.summary.providerHintsMatched}, references=${sumMapValues(fileReport.referenceCounts || {})}, stages=${sumMapValues(fileReport.stageCounts || {})}`,
      );
    }
  } else {
    const rankedFiles = [...report.files]
      .sort((left, right) => right.messageCount - left.messageCount)
      .slice(0, top);
    for (const fileReport of rankedFiles) {
      const relativePath = path.relative(REPO_ROOT, fileReport.filePath);
      lines.push(
        `- ${relativePath}: ${fileReport.provider}, ${fileReport.messageCount} messages, outcome=${fileReport.outcome}`,
      );
    }
    lines.push(`- Use \`--verbose\` to list all ${report.files.length} analyzed files`);
  }
  lines.push("");

  return lines.join("\n");
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const manifest = loadManifest();
  const promptMatchers = buildPromptMatchers(manifest);
  const skillCatalog = buildSkillCatalog(manifest);
  const detectedInputs = args.autoDetect ? autoDetectInputs() : [];
  const explicitInputs = args.inputs.map((input) => ({
    provider: "explicit",
    path: path.resolve(input),
  }));
  const allInputs = [...explicitInputs, ...detectedInputs];

  if (allInputs.length === 0) {
    throw new Error("No inputs found. Use --auto-detect or pass one or more paths.");
  }

  const fileEntries = allInputs.flatMap((input) =>
    listFiles(input.path).map((filePath) => ({ filePath, provider: input.provider })),
  );
  const files = fileEntries.map((entry) => entry.filePath);

  if (files.length === 0) {
    throw new Error("No trace files found in the provided paths.");
  }

  const cache = loadCache(args.noCache);
  const cacheStats = {
    hits: 0,
    misses: 0,
  };
  const providerByFile = new Map(fileEntries.map((entry) => [entry.filePath, entry.provider]));
  const fileReports = files.map((filePath) =>
    readMetricsWithCache(
      filePath,
      promptMatchers,
      skillCatalog,
      cache,
      cacheStats,
      args.noCache,
      providerByFile.get(filePath) === "explicit" ? null : providerByFile.get(filePath) || null,
    ),
  );
  saveCache(cache, args.noCache);
  const rawSessionRecords = fileReports.map((fileReport) => buildSessionRecord(fileReport));
  const aggregate = augmentAggregateWithSessionRecords(buildAggregate(fileReports), rawSessionRecords);
  const labels = loadLabels(args.labelsPath);
  const labeledSessionRecords = joinLabels(rawSessionRecords, buildLabelIndex(labels));
  const effectiveness = labels.length > 0 ? buildEffectivenessSummary(labeledSessionRecords) : null;
  const labelQueue = buildLabelQueue(labeledSessionRecords);

  const report = {
    generated_at: new Date().toISOString(),
    inputs: allInputs.map((input) => input.path),
    detectedInputs: allInputs,
    cache: cacheStats,
    aggregate,
    effectiveness,
    files: fileReports.map((fileReport) => ({
      provider: fileReport.provider,
      sessionId: fileReport.sessionId,
      filePath: fileReport.filePath,
      messageCount: fileReport.messageCount,
      roleCounts: fileReport.roleCounts,
      promptCounts: fileReport.promptCounts,
      skillFormatCounts: fileReport.skillFormatCounts,
      slashCommandCounts: fileReport.slashCommandCounts,
      toolCalls: fileReport.toolCalls,
      modelCounts: fileReport.modelCounts,
      referenceCounts: fileReport.referenceCounts,
      referenceCountsBySkill: fileReport.referenceCountsBySkill,
      referenceStageCounts: fileReport.referenceStageCounts,
      stageCounts: fileReport.stageCounts,
      tokenUsage: fileReport.tokenUsage,
      promptToolPairs: fileReport.promptToolPairs,
      transitions: fileReport.transitions,
      testsMentioned: fileReport.testsMentioned,
      outputSignals: fileReport.outputSignals,
      outcome: fileReport.outcome,
      outcomeEvidence: fileReport.outcomeEvidence,
      summary: fileReport.summary,
      firstTimestamp: fileReport.firstTimestamp,
      lastTimestamp: fileReport.lastTimestamp,
      firstUserExcerpt: fileReport.firstUserExcerpt,
      lastAssistantExcerpt: fileReport.lastAssistantExcerpt,
    })),
    session_records: labeledSessionRecords,
    label_queue_size: labelQueue.length,
    conclusions: inferConclusions(aggregate, args.top),
  };

  if (args.sessionRecordsOut) {
    writeJsonl(args.sessionRecordsOut, labeledSessionRecords);
  }
  if (args.labelQueueOut) {
    writeJsonl(args.labelQueueOut, labelQueue);
  }

  if (args.jsonOut) {
    fs.writeFileSync(path.resolve(args.jsonOut), JSON.stringify(report, null, 2));
  }

  if (args.format === "json") {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  if (args.format === "both") {
    console.log(formatMarkdown(report, args.top, args.verbose));
    console.log("\n---\n");
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  console.log(formatMarkdown(report, args.top, args.verbose));
}

main();
