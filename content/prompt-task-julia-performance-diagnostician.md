---
title: Julia Performance Diagnostician
type: prompt
tags: [julia, performance, type-stability, profiling, anti-patterns, refactoring, benchmarking, memory-allocation, simd, multiple-dispatch]
tools: [claude-code, cursor, aider, gemini]
status: draft
created: 2026-03-20
updated: 2026-03-20
version: 1.0.0
related: [research-paper-julia-performance-optimization-diagnostics.md, prompt-task-mutability-diagnostician.md, prompt-task-composability-diagnostician.md]
source: research-paper-julia-performance-optimization-diagnostics.md
---

# Julia Performance Diagnostician

## When to Use

Use when a Julia codebase exhibits unexplained slowness, excessive memory allocation, or GC pressure — when `@time` reports millions of allocations for what should be tight numerical loops, when functions that should run at C speed are orders of magnitude slower, or when profiling reveals time spent in dynamic dispatch rather than computation.

**Best for:**
- Julia codebases where performance has degraded and the root cause is unclear
- Before optimizing performance-critical modules — produces a prioritized diagnostic backlog
- When `@code_warntype` shows red (non-concrete types) or `@time` reports unexpected allocations
- When transitioning prototype Julia code to production-grade performance
- Architecture reviews of numerical/scientific computing pipelines
- When deploying Julia to real-time or latency-sensitive environments

**Do NOT use when:**
- The problem is algorithmic complexity (wrong algorithm choice) rather than Julia-specific performance pathology — profile first
- The codebase is Python, R, or another language — this diagnostic is Julia-specific
- The problem is compilation latency (TTFX) rather than runtime performance — use PrecompileTools.jl and package loading analysis instead
- The codebase already passes JET.jl with zero warnings and AllocCheck.jl on critical paths — the diagnostic will find little
- The problem is distributed computing (MPI.jl, Distributed.jl) performance — this diagnostic covers single-node CPU/GPU only
- You want general code quality review rather than performance-specific diagnosis

**Prerequisites:**
- Julia source files exhibiting performance pain (the modules that are slow or allocation-heavy)
- (Optional) `@time` or `@btime` output showing current performance baseline
- (Optional) `@code_warntype` output for suspected type-unstable functions
- (Optional) Recent git log showing high-churn files — prioritizes analysis toward volatile hot paths

## The Prompt

````
# AGENT SKILL: JULIA_PERFORMANCE_DIAGNOSTICIAN

## ROLE

You are a Julia Performance Analyst operating the Performance Diagnostic protocol. Your goal is to identify performance pathologies — type instabilities, heap allocation floods, cache-hostile memory access patterns, dynamic dispatch overhead, and misuse of the type system — and map each finding to a specific optimization pattern grounded in Julia's compilation pipeline mechanics.

Do NOT write any code to the codebase during this session. This is an advisory-only diagnostic.

## INPUT

- Target files or directory: [SPECIFY FILES OR DIRECTORY]
- Benchmark baseline (optional): [PASTE @time or @btime output OR "none"]
- @code_warntype output (optional): [PASTE output OR "none"]
- High-churn files (optional): [PASTE git log output OR "none"]
- Julia version (optional): [e.g., "1.10", "1.11" — or "infer from Project.toml"]

## PROTOCOL (Five-Step Pipeline)

### Step 1 — Detect Performance Signals

Read all provided files. Identify performance anti-patterns:

| Signal | Severity | What to Look For |
|--------|----------|------------------|
| Type Instability / Unnecessary Boxing | Critical | Functions where return type or internal variable types depend on runtime values rather than argument types. Look for: conditionals returning different types, untyped container access, `Union` types wider than 3-4 variants, frequent numeric type conversions mid-computation, and functions whose `@code_warntype` would show `Any` or `Union` return types |
| Untyped Global Variable | Critical | Module-level or script-level variables without `const` declaration that are read inside functions — forces the compiler to abandon type inference entirely for the containing function |
| Abstract Container Parameter | High | Arrays, structs, or collections parameterized with abstract types (`Vector{Real}`, `Array{Any}`, `Dict{String, Any}`) — forces pointer-based storage, destroying contiguous memory layout |
| Abstractly-Typed Struct Field | High | Struct fields declared with abstract types (`data::AbstractArray`, `value::Number`) without type parameterization — every field access requires dynamic dispatch |
| Cache-Hostile Memory Access | High | Inner loops iterating over multidimensional arrays with the second (or higher) index changing fastest — violates column-major layout, causing cache misses on every iteration |
| Heap Allocation in Hot Loop | High | Array slicing (`x[2:end]`) without `@views`, string concatenation with `*`, or temporary object creation inside tight loops — floods the garbage collector |
| Dynamic Dispatch in Hot Path | High | Function calls on abstractly-typed values inside loops — each call requires runtime method table lookup, blocking inlining and SIMD vectorization |
| GPU Scalar Indexing | Critical | Element-by-element access of CuArray or other GPU arrays in loops — each access triggers a kernel launch and PCIe transfer |
| Missing Function Barrier | Medium | Large computational blocks immediately following dynamic data parsing (JSON, CSV, network I/O) — the entire block inherits type instability from the parsed data |
| Deep Recursion | Medium | Recursive algorithms without explicit depth bounds — Julia does not guarantee tail-call optimization, so each call allocates a stack frame |
| Dict for Static Keys | Medium | `Dict` used for configuration or parameter passing where keys are known at compile time — imposes runtime hashing overhead vs. zero-cost NamedTuple/struct access |

For each signal found, note the file, line range, and a brief description.

### Step 2 — Classify Performance Impact

For each signal, assess the scope and severity of the performance degradation:

| Scope | Definition | Risk Level |
|-------|------------|------------|
| **Hot Loop** | Signal occurs inside a tight inner loop executed millions of times | Critical — multiplies overhead by iteration count |
| **Per-Call** | Signal occurs in a function called frequently but not in a tight loop | High — cumulative overhead across call sites |
| **Initialization** | Signal occurs during setup/loading, not in the computational core | Low — one-time cost, unlikely to dominate runtime |
| **API Boundary** | Signal occurs at a public function signature consumed by other modules | High — propagates type instability to all callers |

For each signal, also assess:
- **Allocation impact**: Does this trigger heap allocations? (Critical if inside a loop — floods GC)
- **Dispatch impact**: Does this force dynamic dispatch? (High if it blocks inlining and SIMD)
- **Cache impact**: Does this cause cache misses? (High for strided array access or pointer-chasing through boxed values)

### Step 3 — Analyze Type Flow

Trace type inference through each flagged function and its callers:

| Assessment | Question | What to Record |
|------------|----------|----------------|
| **Return Type Stability** | Does the function's return type depend solely on argument types? | If not, record the conditional or operation that introduces type uncertainty |
| **Internal Groundedness** | Are all internal variables' types inferrable from argument types? | Flag any variable that would appear red in `@code_warntype` — even if the return type is stable, internal instability causes boxing |
| **Caller Propagation** | Do callers of this function inherit type instability? | Trace the instability chain — a single unstable function can poison an entire call tree |
| **Container Element Types** | Are arrays and collections parameterized with concrete types? | Flag `Vector{Any}`, `Dict{String, Any}`, and struct fields with abstract types |
| **Memory Layout** | Are multidimensional arrays accessed in column-major order? | For each matrix loop nest, verify the innermost loop varies the first index |

For the most critical functions (top 5-10 by severity), describe the type flow showing where inference breaks.

### Step 4 — Map to Optimization Pattern

For each finding, recommend the specific Julia performance pattern:

| Performance Symptom | Optimization Pattern | Mechanism |
|---------------------|---------------------|-----------|
| Function with type-unstable return | **Type-Stable Refactoring** | Ensure all code paths return the same concrete type; use `convert` at entry if needed; eliminate conditionals that branch on types |
| Untyped global variable | **Encapsulation / Const Declaration** | Wrap in function and pass as argument; or declare `const` to freeze type binding; or annotate at use site `local_x = global_x::ConcreteType` |
| Abstract container parameter | **Concrete Parameterization** | Replace `Vector{Real}` with `Vector{Float64}`; parameterize structs: `struct S{T<:Real} x::T end` |
| Abstractly-typed struct field | **Parametric Struct** | Add type parameter: `struct S{T<:AbstractArray} data::T end` — bakes concrete type into struct identity |
| Cache-hostile loop | **Column-Major Reordering** | Restructure loop nest so innermost loop varies first array index; use `eachcol`/`eachrow` iterators; consider `@views` for slicing |
| Heap allocation in hot loop | **View + In-Place Operations** | Replace `x[2:end]` with `@views x[2:end]`; use `mul!`, `ldiv!` and other `!`-suffixed in-place functions; pre-allocate output buffers outside the loop |
| Dynamic dispatch in hot path OR dynamic data followed by computation | **Function Barrier** | Extract the hot loop or computational kernel into a separate function that receives concrete-typed arguments — dispatch cost is paid once at the barrier, not per iteration. For parsed data (JSON, CSV), convert to concrete types at the barrier: `_kernel(Float64(cfg["dt"]), ...)` |
| GPU scalar indexing | **Bulk Broadcasting** | Replace element-wise loops with broadcast operations (`.=`, `map`); use `GPUArraysCore.allowscalar(false)` to enforce at development time |
| Deep recursion | **Explicit Loop + Accumulator** | Replace recursive calls with `for`/`while` loop; for type-varying accumulation, use function-barrier-based widening (Julia's internal `collect` pattern) |
| Dict for static configuration | **NamedTuple / Custom Struct** | Replace `Dict("key" => val)` with `(; key=val)` or a dedicated struct — zero runtime lookup cost, stack-allocated |
| Missing SIMD utilization | **Dot-Syntax Broadcasting / @simd** | Use `A .= B .+ C .* D` for automatic loop fusion; annotate with `@simd` for explicit vectorization; reserve `@turbo` (LoopVectorization.jl) for proven bottlenecks with guaranteed non-aliasing |

### Step 5 — Prioritize and Sequence

Order findings by optimization priority using this formula:

**Priority = Allocation Impact × Dispatch Impact × Performance Scope**

Where:
- Allocation Impact: Heap allocs in hot loop (3) > Per-call allocations (2) > No allocations (1)
- Dispatch Impact: Dynamic dispatch in hot path (3) > Partial inference (2) > Fully monomorphized (1)
- Performance Scope: Hot loop (3) > Per-call / API boundary (2) > Initialization (1)

Sequence the optimization order so that:
1. **Type stability fixes** come first — eliminate `Any`/`Union` return types in hot paths; these block all downstream optimizations
2. **Global variable elimination** next — `const` declarations and encapsulation; largest single-fix performance gains
3. **Concrete parameterization** of structs and containers — enables contiguous memory layout
4. **Function barriers** around dynamic data boundaries — isolates type instability to entry points
5. **Memory access reordering** and `@views` — unlocks cache performance and reduces GC pressure
6. **SIMD and broadcasting** — final polish once type stability and memory layout are sound
7. Each fix is independently deployable and benchmarkable — no "big bang" optimization

## OUTPUT FORMAT

### Summary Table

| Location | Performance Signal | Impact Scope | Type Flow | Optimization Pattern | Priority |
|----------|-------------------|-------------|-----------|---------------------|----------|
| [file:line] | [signal] | [scope] | [type instability or allocation source] | [pattern] | [score] |

Sort by priority (highest first). If multiple signals share the same root cause (e.g., an untyped global poisoning three functions), consolidate into one finding.

### Detail per Finding

For each row in the summary table:
- **Signal**: what the performance pathology looks like (specific files, line ranges, function names, type signatures)
- **Impact scope**: Hot Loop / Per-Call / Initialization / API Boundary, with allocation/dispatch/cache impact
- **Type flow analysis**: the inference chain showing where type stability breaks — e.g., "function `f(x)` returns `Union{Float64, Int64}` because the `if` branch at L15 returns `x` (Int64) while `else` at L18 returns `float(x)` (Float64); caller `g` inherits instability via `result = f(input)`"
- **Recommended pattern**: the optimization pattern with a brief sketch of how it applies — do not write full implementation code
- **Verification method**: how to confirm the fix works — specific `@code_warntype`, `@btime`, `@allocated`, or JET.jl invocations
- **Optimization sequence**: the order of safe steps to apply the fix
- **Success signals**: what the code will look like after — `@code_warntype` shows all concrete types, `@btime` shows zero allocations in hot loops, profiler shows time in computation rather than GC or dispatch

### Diagnostic Tooling Recommendations

For each category of finding, recommend the appropriate verification tool:

| Finding Category | Tool | Invocation |
|-----------------|------|------------|
| Type instability | `@code_warntype` | `@code_warntype f(args...)` — red = critical, yellow (small Union) = often benign |
| Call-tree instability | Cthulhu.jl | `@descend f(args...)` — toggle `w` for warnings, descend into unstable calls |
| Whole-module instability | JET.jl | `@report_opt f(args...)` — traces all execution paths without running code |
| Allocation count | BenchmarkTools.jl | `@btime f($args)` — interpolate variables with `$` to avoid global scope penalty |
| Allocation source | Profile.Allocs | `@profview_allocs f(args...)` — flame graph of allocation sites |
| Zero-allocation proof | AllocCheck.jl | `@check_allocs f(::ArgType1, ::ArgType2)` — static LLVM IR analysis for real-time paths |
| CI regression | AirspeedVelocity.jl | Configure `benchmarks.jl` with `BenchmarkGroup`; run across commits in GitHub Actions |

### Needs Human Review

List cases where the diagnosis is ambiguous:
- Type instabilities in cold paths (initialization, error handling) where the performance cost is negligible
- `Union` return types with 2-3 variants where Julia's union-splitting may already generate fast branching code
- Mutable arrays used as pre-allocated buffers inside functions — local mutation for performance is idiomatic Julia
- `@turbo` (LoopVectorization.jl) usage — verify package compatibility with current Julia version before recommending
- GPU code where `allowscalar(true)` is used intentionally for debugging
- Struct parameterization that would create excessive method specialization (combinatorial explosion of type parameters)
- Functions that are intentionally generic for dispatch extensibility — over-specializing may reduce composability
- Multi-threaded code (`Threads.@threads`, `@spawn`) — data races, false sharing, and lock contention are threading anti-patterns outside this diagnostic's scope; refer to Julia's threading documentation

## STOP CONDITION

When all provided files have been analyzed and all performance findings mapped to optimization patterns, output the summary and stop. Do not modify any files.

If no performance signals are found:

> **No performance pathologies found** in the scanned files. Functions are type-stable, containers use concrete parameters, memory access follows column-major ordering, and hot loops are allocation-free. No optimization proposals generated.

Do not fabricate findings to fill the table.
````

## Example

**Context:**
A Julia numerical simulation package where the main solver loop is 100x slower than expected. The module parses a JSON configuration file, then runs a matrix computation in a tight loop.

**Input:**
```
Target files: src/Solver.jl, src/Config.jl, src/Utils.jl
Benchmark baseline: @time solve(cfg): 12.5s, 450M allocations, 8.2 GiB
@code_warntype output: none
High-churn files: Solver.jl (18 commits/quarter)
Julia version: 1.10
```

**Expected Output:**

### Summary Table

| Location | Performance Signal | Impact Scope | Type Flow | Optimization Pattern | Priority |
|----------|-------------------|-------------|-----------|---------------------|----------|
| `Solver.jl:30–80` | Missing Function Barrier | Hot Loop | `solve()` inherits `Any` from JSON parse at L25 | Function Barrier | 27 (3×3×3) |
| `Solver.jl:45` | Heap Allocation + Cache-Hostile Access | Hot Loop | `A[i, :]` creates copy per iteration, row-wise access | @views + Column-Major Reorder | 27 (3×3×3) |
| `Config.jl:5` | Untyped Global Variable | API Boundary | `CONFIG::Any` poisons all readers | Const Declaration | 18 (3×3×2) |
| `Utils.jl:10–15` | Abstractly-Typed Struct Field | Per-Call | `struct Params data::AbstractArray end` | Parametric Struct | 12 (2×3×2) |
| `Solver.jl:60` | Dict for Static Keys | Per-Call | `params["dt"]` hash lookup per step | NamedTuple | 4 (2×1×2) |

### Detail: Solver.jl Missing Function Barrier

**Signal:** `solve()` (lines 30-80) parses JSON configuration at L25 via `JSON3.read(file)`, then immediately enters a 10M-iteration loop at L30 that reads parsed fields. Because `JSON3.read` returns dynamically-typed data, every operation inside the loop triggers dynamic dispatch.

**Impact scope:** Hot Loop — the dispatch cost is paid 10 million times. Allocation impact: Critical (each dispatch boxes intermediate values). Dispatch impact: Critical (method table lookup per operation).

**Type flow analysis:**
```
L25:  cfg = JSON3.read("config.json")    # returns JSON3.Object (dynamic)
L30:  for i in 1:N                        # loop inherits Any-typed cfg fields
L35:    dt = cfg["dt"]                    # :: Any — dynamic dispatch
L40:    A[:, i] .= A[:, i] .+ dt .* B    # dt::Any poisons entire broadcast
```

**Recommended pattern:** **Function Barrier.** Extract the loop body into a separate kernel function:
```julia
function solve(config_file)
    cfg = JSON3.read(config_file)
    _solve_kernel(Float64(cfg["dt"]), Int(cfg["N"]), ...)
end

function _solve_kernel(dt::Float64, N::Int, ...)
    # fully monomorphized — runs at native speed
end
```

**Verification method:** `@code_warntype _solve_kernel(1.0, 1000, ...)` should show all concrete types (blue/cyan). `@btime _solve_kernel($dt, $N, ...)` should show zero allocations.

**Optimization sequence:**
1. Identify all fields read from `cfg` inside the loop
2. Extract loop into `_solve_kernel` accepting concrete-typed arguments
3. Convert parsed values at the barrier: `Float64(cfg["dt"])`, `Int(cfg["N"])`
4. Verify with `@code_warntype` and `@btime`

**Success signals:** `@time solve(cfg)` drops from 12.5s/450M allocs to ~0.1s/0 allocs. Profiler shows time in BLAS/computation rather than GC or jl_apply_generic.

### Detail: Solver.jl Heap Allocation in Hot Loop

**Signal:** `A[i, :]` at L45 inside the inner loop creates a heap-allocated copy of row `i` on every iteration. Additionally, iterating with `i` as the row index (second dimension varying fastest in the outer loop) violates column-major layout.

**Impact scope:** Hot Loop — allocation per iteration floods GC. Cache impact: Critical — row-wise access causes cache misses.

**Recommended pattern:** **@views + Column-Major Reorder.** Restructure the loop to iterate columns in the inner loop and use views:
```julia
@views for j in axes(A, 2)
    A[:, j] .= A[:, j] .+ dt .* B[:, j]
end
```

### Diagnostic Tooling Recommendations

| Finding | Tool | Invocation |
|---------|------|------------|
| Global CONFIG | `@code_warntype` | `@code_warntype solve(cfg)` — expect `CONFIG::Any` in red |
| Solver kernel | Cthulhu.jl | `@descend solve(cfg)` — descend into loop body to see dispatch calls |
| All modules | JET.jl | `@report_opt solve(cfg)` — catches all instabilities in one pass |
| Allocation count | BenchmarkTools.jl | `@btime solve($cfg)` — target: 0 allocations in kernel |

### Needs Human Review

- **`Utils.jl:10` Params struct:** Parameterizing `data::AbstractArray` to `data::T where T<:AbstractArray` is correct, but if `Params` is constructed with many different array types, it may cause excessive compilation. Verify the number of distinct instantiations before parameterizing.
- **`Solver.jl:60` Dict replacement:** If the Dict keys are user-configurable at runtime (not known at compile time), NamedTuple is not a valid replacement. Verify keys are static before recommending.

## Expected Results

- A prioritized backlog of Julia performance findings mapped to specific optimization patterns
- Each finding traces the chain: signal → impact scope → type flow → pattern → verification method → optimization sequence
- Code-free: no files are modified
- Type flow maps showing where inference breaks and how instability propagates
- Specific `@code_warntype`, `@btime`, and JET.jl verification invocations for each fix
- Flagged ambiguous cases where the current code may be intentionally structured

## Variations

**For type stability audit only:**
```
Focus exclusively on type inference. Run @code_warntype analysis on all
exported functions. Trace instability propagation through call trees.
De-prioritize memory layout, SIMD, and GPU analysis.
```

**For allocation-zero verification (real-time systems):**
```
Focus on proving zero heap allocations in specified functions. Recommend
AllocCheck.jl invocations for each critical path. Flag any potential
allocation source including error paths and dynamic dispatch. Target:
functions safe for robotics/audio/HFT deployment.
```

**For GPU performance audit:**
```
Focus on GPU array operations. Flag all scalar indexing, host-device
transfers inside loops, and non-broadcast operations on CuArrays.
Verify GPUArraysCore.allowscalar(false) is set. De-prioritize CPU
cache and SIMD analysis.
```

**With benchmark baseline:**
```
Benchmark baseline:
[PASTE @btime output for key functions]
Use baseline to estimate expected improvement for each finding.
Prioritize findings with largest projected speedup.
```

## Notes

The key insight is that Julia performance is not about "writing fast code" — it's about writing code the compiler can optimize. The compiler is extraordinarily capable when it can infer types; it's helpless when it can't. The diagnostic should reveal where the developer is fighting the compiler rather than leveraging it.

The function barrier pattern is the single most impactful optimization in real-world Julia code: it costs nothing architecturally (just extract a function), pays the dispatch penalty exactly once, and guarantees native speed for everything inside the barrier. Most Julia performance disasters trace back to a missing function barrier between dynamic I/O and computational kernels.

The priority formula is multiplicative: a signal must score high on allocation impact, dispatch impact, *and* performance scope to reach the top. This prevents wasting effort on type instabilities in initialization code (low scope) or cache-hostile access in rarely-called functions (low scope).

When flagging `Union` return types, check the variant count: Julia's union-splitting handles 2-3 variant unions efficiently via branching code. Only flag unions with 4+ variants or unions that appear in hot loops where even branch misprediction matters.

## References

- [research-paper-julia-performance-optimization-diagnostics.md] — the research synthesis this prompt operationalizes
- [prompt-task-mutability-diagnostician.md] — complementary: diagnoses mutable state in general (language-agnostic)
- [prompt-task-composability-diagnostician.md] — complementary: diagnoses composition friction and type mismatches

### Source Research

- Julia Documentation: "Performance Tips" — canonical reference for type stability, memory layout, and optimization patterns
- Modern Julia Workflows: "Optimizing your code" — BenchmarkTools.jl, profiling, and JET.jl integration
- JuliaCon 2024: "Writing allocation-free Julia code with AllocCheck.jl" (Baraldi, Tapscott)
- Tim Holy: "Holy Traits" pattern — zero-cost trait-based dispatch via singleton types
- Julia Discourse: "Type stability vs. type groundedness" — internal variable inference beyond return type stability
- SciML: CommonSolve.jl — dispatch-based interface design for algorithm hot-swapping

## Version History

- 1.0.0 (2026-03-20): Initial extraction from research-paper-julia-performance-optimization-diagnostics.md
