# **Architecting AI-Driven User Interfaces: Methodologies for Specification, Implementation, and Automated Verification**

## **1\. The Imperative for Deterministic Specifications in Probabilistic Systems**

The integration of Large Language Models (LLMs) into software engineering workflows has fundamentally altered the paradigm of user interface (UI) development. Historically, UI development relied on strictly deterministic processes: designers produced static visual artifacts, and engineers manually translated these artifacts into explicit, deterministic code architectures. The introduction of generative artificial intelligence replaces this deterministic translation with a probabilistic generation mechanism. While LLMs exhibit profound capabilities in natural language understanding and code synthesis, their non-deterministic, stochastic nature introduces novel challenges in predictability, structural adherence, and operational reliability.1

The primary challenge in deploying LLMs for UI generation is bridging the semantic gap between high-level human design intent and the strict syntactic requirements of executable code. Current generative UI systems frequently emphasize design ideation and creative exploration but critically neglect the transition from conceptual design to usable, executable prototypes.2 This phenomenon, often termed the "last-mile gap," limits the adoption of generative tools in enterprise-grade software development workflows.2 The core issue stems from the dual unknowns introduced by LLMs: in traditional product design, the only variable is the human user, but the introduction of an LLM introduces a secondary layer of non-determinism, requiring interfaces that govern the communication between the user and the probabilistic model.1

Furthermore, attempts to deploy autonomous agents using naive "plan-code-test-repeat" loops—colloquially known as the "Ralph Wiggum loop"—frequently result in uncontrolled iteration.3 In these unstructured workflows, agents burn through computational resources and token limits without converging on a stable, functional implementation, often declaring success on code that is fundamentally broken.3 To effectively leverage LLMs for UI interactions and workflows, the interaction model must transition from unstructured natural language prompting to rigorous, specification-driven engineering. This requires a comprehensive architecture that bounds the generative capabilities of the LLM using formal intermediate representations, strict serialization formats like JSON Schema, finite state machines, and test-driven feedback loops.

## **2\. Foundational Prompt Engineering and Interaction Taxonomies**

Before implementing complex architectural boundaries, the fundamental layer of communication with the LLM—the prompt—must be systematically engineered. When communicating UI workflows to an LLM, vague requests yield format drift, hallucinations, and unmaintainable code.4 If a task is underspecified, the model generates statistically plausible but functionally incorrect code; conversely, if it is overspecified, the prompt becomes as complex as the target code itself, negating the efficiency gains of utilizing an LLM.4

### **2.1 Structured Prompting Frameworks**

To optimize the translation of human intent into machine-actionable UI tasks, industry practitioners utilize structured prompting frameworks. One of the most effective frameworks is RTCF, an acronym for Role, Task, Context, and Format.5 By organizing prompts into these distinct, logical sections, engineers provide the model with strong semantic cues regarding constraints and expectations.6 Empirical data indicates that employing structured frameworks like RTCF can improve AI-generated UI quality by three to five times and reduce the required iteration cycles from an average of five to seven down to merely one or two.5

When deploying these frameworks, developers utilize specific XML tags (such as \<background\>, \<instructions\>, \<tools\>, and \<output\_format\>) to demarcate sections, preventing the LLM from conflating context with instructions.6 Furthermore, the application of "few-shot" prompting—providing three to five explicit examples wrapped in \<example\> tags—dramatically improves the model's ability to extrapolate the desired UI structure.7

### **2.2 Advanced Reasoning Directives**

For complex UI workflows requiring sequential execution, standard prompting is insufficient. Engineers must employ advanced prompt engineering techniques to guide the LLM's reasoning path, reduce ambiguity, and mitigate biased outputs.8

* **Chain of Thought (CoT):** This technique directs the LLM to explicitly identify and list intermediary steps toward the final goal before generating the final code. By forcing the model to articulate its reasoning regarding DOM structure or state management, transparency and accuracy increase.9  
* **Least to Most:** This methodology entails breaking down a complex prompt into distinct subproblems, then executing them in a defined sequence. For a UI component, this might involve generating the HTML structure first, followed by CSS styling, and concluding with JavaScript event bindings.9  
* **Directional Stimulus:** The LLM's output is shaped by providing specific hints, keywords, or constraints within the prompt to guide the generation toward a specific architectural pattern (e.g., forcing the use of the Receive an Object, Return an Object pattern).9  
* **Maieutic Prompting:** This involves gradual, open-ended prompts that build upon previous answers, guiding the model to reflect on its own reasoning and self-correct potential architectural flaws in the UI layout before finalizing the code.9

## **3\. Intermediate Representations: Bounding Design Intent**

While advanced prompt engineering improves output quality, natural language remains inherently ambiguous. To provide an LLM with a specific set of steps for UI generation, developers must utilize Intermediate Representations (IR). An IR acts as a translation layer, decoupling the abstract human design intent from the highly specific, framework-dependent execution code, allowing the LLM to operate within a constrained, parameterized environment.2

### **3.1 The SPEC Language and SpecifyUI Architecture**

A paramount advancement in intermediate representations is the SPEC language, introduced alongside the SpecifyUI system.2 SPEC functions as a structured, parameterized, and hierarchical intermediate representation explicitly designed to expose UI elements as controllable variables. Unlike traditional prompt-based interactions that rely on volatile one-shot generation, SPEC enables continuous, iterative refinement by encoding UI design guidelines and element hierarchies into a deterministic schema.2

The SPEC representation is formalized as a dual-layer structural system, mathematically denoted as ![][image1].2 The Global Specification (![][image2]) layer dictates the macro-level design principles of the interface, encompassing parameterized grid layout descriptions augmented with semantic organization labels, color vectors paired with specific semantic roles, and semantic scenario tags that describe the overall interaction rhythms.2 Conversely, the Page Composition (![][image3]) layer decomposes the interface into a rigorous hierarchy of specific sections, containers, and granular UI components, effectively mapping visual intent to specific structural component architectures.2

By utilizing this hierarchical structure within a multi-agent generation pipeline, the system can execute highly localized edits.2 For instance, if a designer wishes to alter a specific button, an "Edit Generator" LLM processes the natural language request and outputs a structured \<operation, path, value\> triplet (e.g., replace, global.typography.header, sans-serif).12 This mechanism preserves all unaffected attributes, maintaining structural fidelity across iterative cycles and shifting the workflow from an unpredictable black-box generation to a highly controllable, specification-driven paradigm.12 Quantitative experiments demonstrate that SPEC-based generation more faithfully captures reference intent than prompt-based baselines, outperforming commercial tools like Stitch in intent alignment, design quality, and controllability.2

### **3.2 Semantic Frontend Intermediate Languages (UIR-X)**

Beyond visual layouts, LLMs require explicit directives regarding frontend framework behaviors, state models, and event bindings. Intermediate languages such as UIR-X provide a critical semantic mapping layer for these functional elements.15 The workflow for utilizing UIR-X dictates that the LLM first parses the target framework to extract template syntax, state models, and routing constraints.15 Subsequently, it parses the UIR-X inputs, which include abstract representations of screens, design tokens, data sources, and queries.15

The LLM is then instructed to construct an intermediate lowering map, translating abstract concepts into framework-specific constructs. For example, an abstract DashboardPage is explicitly mapped to a target screen primitive; queries are mapped to the framework's async resource layer; and commands are mapped to action handlers.15 This structured mapping prevents the LLM from hallucinating non-existent component libraries and ensures that the generated UI adheres strictly to the defined data and state model. A final validation pass guarantees that every referenced state field exists and that loading or error states are present where required by the framework.15

### **3.3 Domain-Specific Languages: The Markdown-UI DSL**

For developers utilizing agentic IDE tools such as GitHub Copilot Agent Mode, defining complex UI layouts in natural language often results in hallucinations or spaghetti CSS.11 To combat this, developers have engineered lightweight Domain-Specific Languages (DSLs) such as the Markdown-UI DSL.11

This approach utilizes highly rigid, deterministic Markdown syntax (e.g., ||| COLUMN |||, ::: CARD :::, ||) paired with YAML frontmatter that defines the specific framework (e.g., Next.js \+ TailwindCSS) and points to a global design system file.11 Because the syntax is strictly structured, the LLM parses the constraints deterministically, mapping the wireframe perfectly to the targeted frontend component.11 Furthermore, this enables two-way code synchronization: updating the wireframe specification in the .ui.md file instructs the agent to automatically locate and refactor the corresponding frontend code, maintaining perfect alignment between the specification and the implementation.11

| IR Methodology | Primary Function | Abstraction Level | Key Mechanism |
| :---- | :---- | :---- | :---- |
| **SPEC Language** | Visual and layout specification | High (Design intent) | Dual-layer ![][image4] structure; \<operation, path, value\> triplets |
| **UIR-X** | Semantic state and functional mapping | Medium (Architecture) | Intermediate lowering map translating abstract concepts to framework primitives |
| **Markdown-UI DSL** | Rigid layout wireframing | Low (Implementation) | Deterministic parsing of markdown tokens into specific component code |

## **4\. Serialization and Syntactic Control: The Role of JSON Schema**

While conceptual representations like SPEC and UIR-X define the overarching architectural intent, the actual data payload exchanged with the LLM must be tightly constrained. Generative models natively produce free-form text, which is unsuitable for programmatic execution. To ensure that UI specifications are adhered to systematically, JSON (JavaScript Object Notation) Schema serves as the definitive, unambiguous data contract.16

### **4.1 The Mechanics of JSON Prompting**

JSON prompting forces the LLM to conform to explicit key-value pairs, thereby drastically reducing output entropy and bounding the token prediction space.17 When a model is prompted using a JSON Schema, it shifts its output modality from creative, unstructured prose to structured serialization.18 A comprehensive JSON prompt sets expectations by utilizing an object structure that explicitly defines fields for desired outputs, imposes constraints on data types (e.g., integers, booleans, datetime strings), and dictates nested hierarchies.18

The efficacy of this approach is amplified by the integration of data validation libraries such as Pydantic in Python or Zod in TypeScript.18 These libraries allow developers to define the data structure programmatically. For example, converting a Pydantic model into a JSON schema via the MyModel.model\_json\_schema() function automatically encodes field names, requirement status (optional versus required fields), enumerations, numeric bounds, and string regular expression patterns.16 This generated schema is then injected directly into the LLM's system prompt. Because models like GPT-4o, Claude 3.5 Sonnet, and Gemini 2.5 Flash have been heavily instruction-tuned on structured data, they demonstrate adherence rates frequently exceeding 99% when provided with rigorous JSON schemas.19

### **4.2 Grammar-Based Decoding and Compressed Finite State Machines**

Despite high adherence rates, naive JSON prompting can still suffer from "format drift," a phenomenon where the model occasionally injects conversational filler, trailing commas, or markdown formatting (such as code fences) that ultimately invalidate the parsing of the payload.17 To entirely eliminate format drift and guarantee 100% syntactic compliance, the industry has shifted toward deterministic decoding mechanisms, specifically Grammar-Based Decoding and Compressed Finite State Machines.22

In grammar-based decoding, the JSON schema is converted into a formal grammar or regular expression.22 During token generation, a Finite State Machine (FSM) actively monitors the decoding process. For every state within the FSM, the system calculates the permissible token transitions. If the LLM's probability distribution predicts a token that violates the JSON schema (for example, attempting to predict an alphabetical character when an integer is explicitly required), the logits for that specific token are masked—effectively set to negative infinity.23 This mathematically prevents the model from generating an invalid structure.

Advanced frameworks like SGLang leverage compressed FSMs to significantly accelerate this process.23 By analyzing the FSM of the regular expression, these systems compress singular transition paths and decode multiple tokens in a single step whenever feasible. Compared to earlier systems like guidance combined with llama.cpp, compressed FSMs reduce generation latency by up to 2x and boost overall throughput by up to 2.5x, making constrained, structured decoding even faster than standard unconstrained generation.23

### **4.3 The Reliable JSON Integration Pipeline**

To implement UI specifications robustly, the engineering pipeline must treat the LLM output not as a chat response, but as a strict API contract.17 The optimal implementation to guarantee this contract follows a rigid five-stage pattern: Prompt, Generate, Validate, Repair, and Parse.17

1. **Prompt:** The prompt includes a compact JSON skeleton defining allowed enumerations and types, explicitly instructing the model to answer only in valid JSON format. Inference temperature is set to ![][image5] to minimize probabilistic variance.17  
2. **Generate:** The LLM produces the structured payload, optionally governed by the aforementioned grammar-based decoding to prevent syntax violations.  
3. **Validate:** The output is intercepted by the validation library (e.g., Pydantic or Zod). If the schema matches perfectly, it proceeds to the final parsing stage.17  
4. **Repair:** If validation fails due to hallucinated keys or type mismatches, an automated fault-tolerance loop is triggered. A secondary, highly focused prompt is dispatched to the LLM containing the erroneous output and the specific validation error stack trace, commanding the model to return nothing except the corrected JSON.17  
5. **Parse:** The fully validated payload is cast into strongly typed objects, ready for deterministic rendering in the UI layer or execution by the testing framework.17

## **5\. Temporal and Operational Governance via Finite State Machines**

While JSON schemas excel at enforcing the structure of static data payloads, they are insufficient for describing complex, multi-step UI interaction workflows. UI applications are inherently stateful; users navigate through specific sequences of screens, authentication gates, and data mutation events. When LLM agents are permitted to operate on these systems without state constraints, they exhibit unpredictable behaviors, break operational business logic, and hallucinate invalid transition paths.24

### **5.1 FSMs as Deterministic Gatekeepers for LLM Agents**

To govern unsupervised agent behavior, UI workflows must be modeled as Finite State Machines (FSMs). An FSM is a computation model that describes a system through a discrete number of defined states and the deterministic transitions permitted between those states.25 In the context of LLM orchestration, the FSM acts as a strict operational boundary, defining the precise "world" the agent exists within.24

Consider a complex UI workflow, such as an equipment troubleshooting sequence or a multi-stage e-commerce checkout. The orchestrating system must manage two distinct levels of internal state.26 The lower-level state tracks the strict progression of business logic (e.g., verifying that a shopping cart is populated before transitioning to the payment state), while the higher-level state orchestrates the LLM's conversational flow, tool retrieval, and API utilization.26

By explicitly defining these states, the LLM is mathematically constrained to only evaluate actions that are valid within its current state node.27 Frameworks such as StateFlow conceptualize the entire task-solving process as a state machine.27 Within each state, StateFlow permits the execution of a defined series of actions—ranging from generating targeted prompts to utilizing external tools. State transitions are controlled by specific, hardcoded rules or explicitly bounded decisions made by the LLM. If an agent attempts to trigger an invalid transition, the FSM actively blocks the procedure, resetting the flow or halting progression until necessary preconditions are met, effectively nullifying the LLM's tendency to bypass critical workflow steps.25 The ![][image6]\-Bench benchmark demonstrates that when agents possess business process state awareness, they internalize logic constraints, recognizing that certain operations (like returning an order) are only unlocked after specific lifecycle states (like delivery) are achieved.28

### **5.2 The R2F2C (Requirement-to-FSM-to-Code) Methodology**

To utilize LLMs to autonomously generate the code that drives these stateful workflows, advanced methodologies employ a structured "Requirement-to-FSM-to-Code" (R2F2C) pattern.29 This methodology effectively translates abstract requirements into rigorous state management code.

1. **Requirement-FSM Prompting:** Natural language user requirements are fed into an LLM utilizing a highly structured template. The model analyzes the text to extract functional logic, identify distinct UI states, and explicitly define the transition conditions, outputting a formal, machine-readable FSM representation.29  
2. **FSM Verification:** Before any executable code is generated, the extracted FSM undergoes automated validation. This includes format checks to guarantee syntactic integrity and graph checks to verify the logical correctness of the system (e.g., identifying unreachable states or infinite loops).29  
3. **Guided Code Generation:** The verified FSM serves as an infallible structural blueprint. The LLM is then prompted to translate the specific states, transitions, and triggers into the target framework's syntax, such as React useReducer hooks, XState configurations, or backend state management logic.29

Through the implementation of the R2F2C methodology, the generated UI code maintains absolute logical consistency with the original specifications, utilizing the formal mathematical rigor of the FSM to override the probabilistic variance inherent to the LLM.29

| FSM Component | Function in LLM Governance | Prevention Mechanism |
| :---- | :---- | :---- |
| **State Nodes** | Defines the current context the LLM is operating within | Restricts token generation to context-relevant components |
| **Transition Rules** | Dictates logical flow between UI screens or actions | Blocks hallucinated attempts to skip required workflow steps |
| **Preconditions** | Ensures required data (e.g., auth tokens) is present | Halts agent execution until requirements are satisfied |
| **Graph Checking** | Verifies logical flow prior to code generation | Eliminates unreachable UI states and infinite execution loops |

## **6\. Architectural Patterns and Agent Orchestration**

Implementing specification-driven UI generation requires a robust orchestration layer. Building effective agentic systems does not necessarily demand complex, highly abstracted frameworks. Rather, the most successful implementations rely on simple, composable patterns where the LLM is heavily augmented with contextual memory and specific functional tools.31

### **6.1 Predefined Code Paths versus Autonomous Agents**

A fundamental architectural distinction exists between *workflows* and *agents*. Workflows orchestrate LLMs through predefined, deterministic code paths, ensuring absolute predictability and consistency for well-defined UI tasks.31 Conversely, agents dynamically direct their own processes and tool usage, prioritizing flexibility and model-driven decision-making.31 For the strict requirements of generating UI specifications and executing tests, workflow patterns are heavily favored over pure autonomous agents, trading slight latency and operational cost for significantly higher task performance and reliability.31

Key workflow patterns for orchestrating LLMs include 31:

* **Prompt Chaining:** Decomposing the UI generation task into a sequence of sequential steps. The output of one LLM call (for example, generating the SPEC intermediate representation) directly becomes the input for the next (generating the JSON payload), separated by programmatic validation gates to ensure the process remains on track.  
* **Routing:** Classifying the input and directing it to specialized prompts or varying model architectures. Simple UI layout adjustments can be routed to faster, smaller models (e.g., Claude Haiku), while complex state-machine generation is routed to highly capable reasoning models (e.g., Claude Sonnet).  
* **Parallelization:** Executing independent subtasks simultaneously to increase speed and output confidence. For instance, generating the CSS styling structure in parallel with the JavaScript event logic, or utilizing multiple models to simultaneously generate diverse outputs and aggregating them via programmatic voting.  
* **Orchestrator-Workers:** A central orchestrator LLM dynamically synthesizes a broad UI requirement, breaks it down into component-level tasks, and delegates these subtasks to worker LLMs. The orchestrator then synthesizes the returned code into a cohesive application.  
* **Evaluator-Optimizer:** An iterative feedback loop where a generator LLM writes the UI code, and a secondary evaluator LLM critiques the code against the initial JSON schema or FSM specification. This loop continually refines the output until it explicitly passes all defined evaluation criteria.

### **6.2 Structured Prompt-Driven Development (SPDD)**

To operationalize these advanced orchestration patterns within enterprise environments, frameworks like Thoughtworks' Structured Prompt-Driven Development (SPDD) have emerged.32 SPDD fundamentally shifts the development paradigm by elevating the prompt from a transient chat message to a first-class engineering artifact.32 In an SPDD workflow, prompts are stored in version control alongside the source code, serving as the definitive alignment mechanism between business needs and implementation logic.32

SPDD relies heavily on a conceptual and infrastructural framework known as Lattice, which mitigates the friction of AI-assisted programming by categorizing AI skills into three composable tiers 33:

1. **Atoms:** Foundational, battle-tested engineering disciplines embedded into the system. These include principles of Clean Architecture, Domain-Driven Design (DDD), secure coding standards, and accessibility requirements.33  
2. **Molecules:** Combinations of specific atoms applied to execute complex component generation tasks.33  
3. **Refiners:** Iterative validation rules that scrutinize the generated output to ensure it strictly complies with the established atomic standards.33

By utilizing this tiered structure, Lattice maintains a "living context layer" (stored locally in a .lattice/ directory) that actively accumulates a project's standard decisions and review insights.33 Consequently, as the system processes multiple feature cycles, the atoms evolve from applying generic rules to applying project-specific rules informed by the repository's history, drastically increasing the coherence and maintainability of the generated UI code.33

## **7\. The Model Context Protocol (MCP) and Real-Time Environmental Grounding**

To execute the architectures discussed above, LLMs must be empowered to interact with the external world—accessing local file systems, querying design databases, and interacting with UI testing tools. The Model Context Protocol (MCP) provides a standardized, open protocol for server implementations, acting as a secure conduit that allows AI models to interact with local and remote resources programmatically.35 MCP eliminates the need to write custom integration scripts for every new model, allowing one MCP server to scale across thousands of integrations.35

### **7.1 Bridging the Text-to-UI Gap with MCP-UI**

A critical limitation of traditional LLM interactions is the reliance on text-only interfaces, forcing developers to manually copy generated code into an IDE or browser to visualize the UI.36 The experimental MCP-UI extension fundamentally alters this dynamic by bringing interactive web components directly into agent conversations.36

MCP-UI extends MCP's existing embedded resources specification by introducing a new UIResource interface.36 This interface utilizes schemas mapped via the mimeType property to dictate the rendering strategy. Through this mechanism, MCP-UI supports distinct rendering approaches:

* **Inline HTML Rendering:** The simplest approach, where HTML is embedded directly into sandboxed iframes utilizing the srcDoc attribute. This is highly effective for self-contained UI components that do not require external asset loading.36  
* **Remote DOM Architecture:** For complex applications, the application/vnd.mcp-ui.remote-dom mime type allows the agent to connect to a remote application state via WebSockets.36

This architecture allows the LLM to output a generated UI component and immediately render it interactively in real-time. Because the application remains isolated from the host environment but can still communicate via a secure PostMessage channel, the user can interact with the rendered UI, generating fresh data that is fed back into the LLM's context window.36

### **7.2 MCP Integrations for UI Workflows**

The utility of MCP is heavily augmented by specialized servers tailored for UI and UX engineers.38 For instance, the *MCP-Miro* server integrates with Miro's REST API, allowing the LLM to read user journey maps and visual flowcharts directly from whiteboards to inform component generation.35 The *Photoshop Python API* and *Illustrator MCP* servers grant the LLM direct programmatic control over Adobe design tools, enabling automated asset extraction.38 Most critically for verification, the *Playwright MCP* server enables the LLM to instantiate a browser, navigate the DOM, and execute automated tests directly against the code it just generated.38

## **8\. Test-Driven Development (TDD) as the Ultimate LLM Constraint**

The most significant barrier to relying on LLMs for comprehensive UI generation is the phenomenon of regression and logical drift over extended generation sequences. When requested to add features or refactor code, AI agents frequently break previously working implementations, alter existing logic where they were not instructed to, and introduce unintentional security vulnerabilities.40 The definitive solution to this instability is integrating Test-Driven Development (TDD) as a foundational mechanism of prompt engineering.41

### **8.1 Bounding the Autonomous Loop**

Autonomous agents operating on open-ended instructions (e.g., "build this complex dashboard") lack reliable termination conditions. This results in the aforementioned "Ralph Wiggum loop," where agents confidently declare success on broken code after burning thousands of tokens in aimless iteration.3

By treating the AI coding agent as a control system rather than a creative generator, engineers transform chaotic generation into bounded, feedback-driven automation.3 In this architecture, the feedback loop is defined not by the LLM's subjective self-evaluation, but by the objective, deterministic execution of automated test runners.42 This fundamentally alters the prompt dynamic: rather than asking the LLM to write code, the developer provides a specification and asks the LLM to *make a specific test pass*.

### **8.2 Red-Green-Refactor with AI Agents**

The classical TDD cycle—Red, Green, Refactor—mirrors the scientific method (hypothesis, prediction, experiment, result) and serves as the ideal framework for LLM orchestration.43

1. **Red (Test Specification):** The engineer, or a specialized evaluator LLM, writes a failing test that explicitly asserts the correct final outcome of the UI component. This codifies the exact intent, boundary conditions, input validations, and state transitions before any implementation code exists.43  
2. **Green (Implementation):** The prompt is specifically structured to highly constrain the LLM. An optimal prompt formulation dictates: *"Given this failing test case and context, write the minimal code change needed so that the test passes—no extra features. Do not write tests, only implementation"*.46 The LLM generates the component, and a local agent automatically executes the test runner. If the test fails, the agent is fed the specific terminal error trace and automatically retries the generation step until the runner returns a success.43  
3. **Refactor (Optimization):** Once the test passes, a secondary prompt is executed to improve code quality, enforce structural patterns, and remove hallucinated clutter.10 Because the test suite is already established, the LLM can safely optimize the code; if the refactoring process inadvertently breaks functionality, the test runner immediately flags it, and the agent reverts the change.42

This "Test-First" architecture drastically improves AI-generated code security, produces between 40% to 80% fewer bugs than traditional test-after generation, and cuts wasted token iterations by roughly 50%.3 By writing failing tests first, developers codify their intent in a machine-readable format that serves as an immovable guardrail for the LLM.45

| TDD Phase | LLM Agent Role | Prompt Constraint Mechanism | Output Verification |
| :---- | :---- | :---- | :---- |
| **Red** | Generate boundary conditions and assertions | Focuses solely on requirements, ignoring implementation details | Execution ensures the test fails (verifying test validity) |
| **Green** | Synthesize minimal functional code | Restricted to making the test pass; forbidden from feature creep | Execution ensures the test passes |
| **Refactor** | Optimize architecture and styling | Enforces design system adherence and security protocols | Execution ensures the test *still* passes without regression |

## **9\. Behavior-Driven Development (BDD): Translating Business Logic to Automation**

While TDD provides granular validation at the unit and component level, validating end-to-end UI interactions requires high-level business logic specifications. Behavior-Driven Development (BDD) utilizing the Gherkin syntax bridges the gap between natural language requirements and executable automation, aligning software behavior with business expectations.47

### **9.1 Translating Intent to Executable Scenarios**

Gherkin relies on a highly structured, keyword-driven format (utilizing Given, When, Then, And, But) to describe preconditions, actions, and expected outcomes.47 Because Gherkin perfectly mirrors natural human language while simultaneously adhering to strict formatting constraints, it serves as an ideal intermediary output format for LLMs processing raw user stories or Product Requirements Documents (PRDs).48

Recent industrial deployments have demonstrated exceptional efficacy in multi-step LLM translation pipelines. Systems such as AutoUAT utilize large reasoning models (such as GPT-4 Turbo) to automatically ingest user story titles and natural language descriptions, subsequently outputting structured Gherkin scenarios.49 In comprehensive enterprise evaluations conducted with automotive partners, 95% of these LLM-generated Gherkin scenarios were deemed highly helpful by product owners.48 The models were frequently noted for identifying edge cases and missing logical boundaries that human analysts had previously overlooked.48

Generating the Gherkin syntax, however, is only the first phase. The critical link in the specification pipeline is transforming these abstract BDD scenarios into executable UI test scripts. Frameworks like Test Flow seamlessly integrate into this pipeline. Test Flow ingests the LLM-generated Gherkin scenarios alongside the initial user story and the target HTML DOM structure, synthesizing deterministic testing scripts in Cypress or Playwright using TypeScript syntax.49 In industrial trials, 92% of the test scripts generated by Test Flow were usable, automating the traditionally labor-intensive process of writing End-to-End (E2E) tests.50

### **9.2 Context-Aware Regression Generation**

A common pitfall when generating Gherkin scenarios via LLMs is treating the prompt as an isolated event. Pasting a single requirement into an LLM produces an isolated test that inherently lacks awareness of the broader application state, leading to fragmented regression suites that ignore negative flows and architectural boundaries.51

To maintain alignment between shifting UI requirements and the comprehensive test suite, the prompt architecture must be context-aware.51 This involves feeding the LLM not only the new feature requirements but also the existing JSON schemas, historical BDD requirements, and interface state boundaries.51 By utilizing Retrieval-Augmented Generation (RAG) to inject the historical context of the application into the prompt, the LLM can intelligently write new Gherkin steps that explicitly test against negative integration boundaries, ensuring that newly generated UI features do not silently degrade existing functionalities.51

## **10\. AI-Native Browser Automation and Execution Engines**

Once the UI is generated and the testing scripts are formulated via BDD and TDD, the final layer of the specification workflow relies on the execution environment. The choice of browser automation framework fundamentally dictates the reliability and speed of the automated feedback loop.

### **10.1 The Shift from Cypress to Playwright**

Historically, Cypress has been widely utilized for UI automation; however, its architectural limitations create significant friction when orchestrating advanced, autonomous AI agents. Specifically, Cypress is limited to JavaScript/TypeScript, operates within the same session per spec file, and lacks native support for multiple tabs.52 Playwright has rapidly emerged as the superior execution engine for LLM-assisted testing and UI generation. Playwright supports multiple programming languages, utilizes isolated browser contexts, and allows for robust real-time interaction control—including mobile device emulation, geolocation, and multi-tab handling—making it highly suitable for agents executing complex, multi-step workflows.52 The migration of legacy Cypress test suites to Playwright is actively being automated by specialized AI refactoring agents, further solidifying Playwright as the indispensable foundation for modern AI-driven UI validation.53

### **10.2 AI-Native Browser Automation: The Stagehand Framework**

Traditional browser automation relies on explicit DOM selectors (e.g., XPath strings or CSS IDs), which are notoriously brittle. When an LLM updates a UI component's design, the associated tests frequently break, resulting in false negatives and failing CI/CD pipelines.54 Conversely, purely "agentic" web navigators that rely solely on vision models are highly unpredictable and difficult to debug.54

To reconcile these two extremes, specialized AI-native frameworks like Stagehand have been engineered to sit directly atop Playwright.54 Stagehand exposes four fundamental primitives that allow developers to blend deterministic execution code with LLM-powered natural language interpretation, giving the test suite human-like navigation capabilities 54:

1. page.act(): Executes natural language instructions (e.g., await page.act("click the primary login button")) by allowing the LLM to dynamically map the human intent to the current DOM state, entirely bypassing brittle CSS selectors.54 Variables can also be masked to prevent sensitive data from being passed to the LLM.55  
2. page.extract(): Pulls unstructured text from the UI and utilizes JSON Schema validation (via the Zod library) to force the LLM to return strictly typed, structured data objects for programmatic assertion.54  
3. page.observe(): Analyzes the current viewport to identify and list all possible interactive elements, effectively documenting the UI's state machine transitions in real-time.54  
4. page.agent(): A high-level orchestration primitive that allows an autonomous LLM to navigate a multi-step workflow until a defined condition is met, bridging the gap between discrete actions and comprehensive E2E verification.54

By utilizing frameworks like Stagehand within the TDD Green/Refactor loop, the testing infrastructure becomes self-healing.56 If an LLM refactors a UI component and alters its class names or nested DOM structure, a Stagehand-powered test utilizing page.act() will successfully identify the new component visually and semantically, preventing the test suite from failing due to trivial HTML changes.55 If the actual functional logic is broken, the framework captures the exact failure state, extracts the execution logs, and feeds the deterministic error trace directly back to the generating agent via the Model Context Protocol.44 This closes the automated repair loop, ensuring that the generated code is continuously validated, corrected, and verified without human intervention.

## **11\. Concluding Synthesis**

The reliable generation and management of User Interfaces by Large Language Models cannot be achieved through naive natural language prompting. As the industry transitions from isolated coding assistants to autonomous engineering agents, development methodologies must prioritize deterministic boundaries to govern probabilistic generation.

The optimal architectural methodology begins by translating human design intent into hierarchical intermediate representations like SPEC and semantic mappings like UIR-X, which explicitly define visual intent, component architecture, and state bindings. The communication of these specifications to the LLM must be executed via rigorous JSON schemas, heavily augmented by grammar-based decoding and automated validation libraries to guarantee data integrity and prevent format drift. To manage the chronological interaction of the UI, these specifications must be modeled as Finite State Machines, serving as absolute gatekeepers against LLM hallucination and invalid state transitions.

Furthermore, the orchestration of these models should rely on structured workflow patterns—such as Prompt Chaining and Evaluator-Optimizers—governed by enterprise frameworks like SPDD and connected to localized environments via the Model Context Protocol. Finally, the entire generation process must be rigidly encapsulated within a Test-Driven Development feedback loop. By defining specifications as executable Gherkin scenarios and executing them via Playwright-driven, AI-native frameworks like Stagehand prior to code generation, the agent's generative loop is bounded by objective, deterministic criteria. This comprehensive synthesis of intermediate representations, strict schema formatting, state modeling, and automated test-driven verification represents the definitive state-of-the-art for deploying LLMs in production-grade user interface engineering.

#### **Works cited**

1. Designing LLM interfaces: a new paradigm | by Jason Bejot | Medium, accessed May 7, 2026, [https://medium.com/@jasonbejot/designing-llm-interfaces-a-new-paradigm-11dd40e2c4a1](https://medium.com/@jasonbejot/designing-llm-interfaces-a-new-paradigm-11dd40e2c4a1)  
2. SpecifyUI: Supporting Iterative UI Design Intent Expression through Structured Specifications and Generative AI \- arXiv, accessed May 7, 2026, [https://arxiv.org/html/2509.07334v1](https://arxiv.org/html/2509.07334v1)  
3. Stop Burning Tokens: The Tests-First Agent Loop That Cuts Thrash by 50% \- Medium, accessed May 7, 2026, [https://medium.com/@Micheal-Lanham/stop-burning-tokens-the-tests-first-agent-loop-that-cuts-thrash-by-50-d66bd62a948e](https://medium.com/@Micheal-Lanham/stop-burning-tokens-the-tests-first-agent-loop-that-cuts-thrash-by-50-d66bd62a948e)  
4. AI Spec Template: What to Include and Leave Out | Augment Code, accessed May 7, 2026, [https://www.augmentcode.com/guides/ai-spec-template](https://www.augmentcode.com/guides/ai-spec-template)  
5. Prompt to UI Design: How AI Turns Text Into Interfaces \- Figr, accessed May 7, 2026, [https://figr.design/blog/prompt-to-ui-design](https://figr.design/blog/prompt-to-ui-design)  
6. How to write a good spec for AI agents \- Addy Osmani, accessed May 7, 2026, [https://addyosmani.com/blog/good-spec/](https://addyosmani.com/blog/good-spec/)  
7. Prompting best practices \- Claude API Docs, accessed May 7, 2026, [https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)  
8. Everything You Need to Know About Prompt Engineering Frameworks \- Parloa, accessed May 7, 2026, [https://www.parloa.com/knowledge-hub/prompt-engineering-frameworks/](https://www.parloa.com/knowledge-hub/prompt-engineering-frameworks/)  
9. What Is Prompt Engineering? A Guide. \- Oracle, accessed May 7, 2026, [https://www.oracle.com/artificial-intelligence/prompt-engineering/](https://www.oracle.com/artificial-intelligence/prompt-engineering/)  
10. Test-First Prompting: Using TDD for Secure AI-Generated Code | Blog | Endor Labs, accessed May 7, 2026, [https://www.endorlabs.com/learn/test-first-prompting-using-tdd-for-secure-ai-generated-code](https://www.endorlabs.com/learn/test-first-prompting-using-tdd-for-secure-ai-generated-code)  
11. How I force Copilot to write deterministic React UI (using a custom Markdown Skill) \#189283, accessed May 7, 2026, [https://github.com/orgs/community/discussions/189283](https://github.com/orgs/community/discussions/189283)  
12. \[Literature Review\] SpecifyUI: Supporting Iterative UI Design Intent Expression through Structured Specifications and Generative AI \- Moonlight | AI Colleague for Research Papers, accessed May 7, 2026, [https://www.themoonlight.io/en/review/specifyui-supporting-iterative-ui-design-intent-expression-through-structured-specifications-and-generative-ai](https://www.themoonlight.io/en/review/specifyui-supporting-iterative-ui-design-intent-expression-through-structured-specifications-and-generative-ai)  
13. \[2509.07334\] SpecifyUI: Supporting Iterative UI Design Intent Expression through Structured Specifications and Generative AI \- arXiv, accessed May 7, 2026, [https://arxiv.org/abs/2509.07334](https://arxiv.org/abs/2509.07334)  
14. LaTCoder: Converting Webpage Design to Code with Layout-as-Thought | Request PDF, accessed May 7, 2026, [https://www.researchgate.net/publication/394255889\_LaTCoder\_Converting\_Webpage\_Design\_to\_Code\_with\_Layout-as-Thought](https://www.researchgate.net/publication/394255889_LaTCoder_Converting_Webpage_Design_to_Code_with_Layout-as-Thought)  
15. UIR-X: A Semantic Frontend Intermediate Language for LLM Coding | by Jonas \- Medium, accessed May 7, 2026, [https://medium.com/@jonas.neustock/uir-x-a-semantic-frontend-intermediate-language-for-llm-coding-7c647ceec45b](https://medium.com/@jonas.neustock/uir-x-a-semantic-frontend-intermediate-language-for-llm-coding-7c647ceec45b)  
16. Schema-Driven UIs for LLM Applications | by Ramu Ramaiah \- Medium, accessed May 7, 2026, [https://medium.com/@ramu.ramaiah/schema-driven-uis-for-llm-applications-cde53e02ff02](https://medium.com/@ramu.ramaiah/schema-driven-uis-for-llm-applications-cde53e02ff02)  
17. Mastering JSON Prompting for LLMs \- MachineLearningMastery.com, accessed May 7, 2026, [https://machinelearningmastery.com/mastering-json-prompting-for-llms/](https://machinelearningmastery.com/mastering-json-prompting-for-llms/)  
18. JSON prompting for LLMs \- IBM Developer, accessed May 7, 2026, [https://developer.ibm.com/articles/json-prompting-llms/](https://developer.ibm.com/articles/json-prompting-llms/)  
19. Structured Prompting with JSON: The Engineering Path to Reliable LLMs | by vishal dutt, accessed May 7, 2026, [https://medium.com/@vishal.dutt.data.architect/structured-prompting-with-json-the-engineering-path-to-reliable-llms-2c0cb1b767cf](https://medium.com/@vishal.dutt.data.architect/structured-prompting-with-json-the-engineering-path-to-reliable-llms-2c0cb1b767cf)  
20. LLMs are Effective UI Generators \- arXiv, accessed May 7, 2026, [https://arxiv.org/html/2604.09577v1](https://arxiv.org/html/2604.09577v1)  
21. AI-assisted JSON Schema Creation and Mapping Deutsche Forschungsgemeinschaft (DFG) under project numbers 528693298 (preECO), 358283783 (SFB1333), and 390740016 (EXC2075) \- arXiv, accessed May 7, 2026, [https://arxiv.org/html/2508.05192v2](https://arxiv.org/html/2508.05192v2)  
22. Structured Output Generation in LLMs: JSON Schema and Grammar-Based Decoding | by Emre Karatas | Medium, accessed May 7, 2026, [https://medium.com/@emrekaratas-ai/structured-output-generation-in-llms-json-schema-and-grammar-based-decoding-6a5c58b698a6](https://medium.com/@emrekaratas-ai/structured-output-generation-in-llms-json-schema-and-grammar-based-decoding-6a5c58b698a6)  
23. Fast JSON Decoding for Local LLMs with Compressed Finite State Machine \- LMSYS Blog, accessed May 7, 2026, [https://lmsys.org/blog/2024-02-05-compressed-fsm/](https://lmsys.org/blog/2024-02-05-compressed-fsm/)  
24. How leveraging the Finite State Machine model for AI agent design can prevent infinite loops and enhance observability in production environments. \- Reddit, accessed May 7, 2026, [https://www.reddit.com/r/ArtificialInteligence/comments/1rslgti/how\_leveraging\_the\_finite\_state\_machine\_model\_for/](https://www.reddit.com/r/ArtificialInteligence/comments/1rslgti/how_leveraging_the_finite_state_machine_model_for/)  
25. Constraining LLM Outputs with Finite State Machines | by Chirag Bajaj | Medium, accessed May 7, 2026, [https://medium.com/@chiragbajaj25/constraining-llm-outputs-with-finite-state-machines-79ca9e336b1f](https://medium.com/@chiragbajaj25/constraining-llm-outputs-with-finite-state-machines-79ca9e336b1f)  
26. Conversation Routines: A Prompt Engineering Framework for Task-Oriented Dialog Systems, accessed May 7, 2026, [https://arxiv.org/html/2501.11613v2](https://arxiv.org/html/2501.11613v2)  
27. StateFlow: Enhancing LLM Task-Solving through State-Driven Workflows \- arXiv, accessed May 7, 2026, [https://arxiv.org/html/2403.11322v1](https://arxiv.org/html/2403.11322v1)  
28. Improving Language Agents through BREW \- arXiv, accessed May 7, 2026, [https://arxiv.org/html/2511.20297v1](https://arxiv.org/html/2511.20297v1)  
29. Guiding LLM-based Smart Contract Generation with Finite ... \- IJCAI, accessed May 7, 2026, [https://www.ijcai.org/proceedings/2025/0653.pdf](https://www.ijcai.org/proceedings/2025/0653.pdf)  
30. 8 Vibe Coding Prompt Techniques for Web Development \- Strapi, accessed May 7, 2026, [https://strapi.io/blog/vibe-coding-prompt-techniques](https://strapi.io/blog/vibe-coding-prompt-techniques)  
31. Building Effective AI Agents \\ Anthropic, accessed May 7, 2026, [https://www.anthropic.com/research/building-effective-agents](https://www.anthropic.com/research/building-effective-agents)  
32. Structured-Prompt-Driven Development (SPDD) \- Martin Fowler, accessed May 7, 2026, [https://martinfowler.com/articles/structured-prompt-driven/](https://martinfowler.com/articles/structured-prompt-driven/)  
33. Fragments \- Martin Fowler, accessed May 7, 2026, [https://martinfowler.com/fragments/](https://martinfowler.com/fragments/)  
34. Patterns for Reducing Friction in AI-Assisted Development \- Martin Fowler, accessed May 7, 2026, [https://martinfowler.com/articles/reduce-friction-ai/](https://martinfowler.com/articles/reduce-friction-ai/)  
35. punkpeye/awesome-mcp-servers \- GitHub, accessed May 7, 2026, [https://github.com/punkpeye/awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers)  
36. MCP-UI: A Technical Overview of Interactive Agent Interfaces \- WorkOS, accessed May 7, 2026, [https://workos.com/blog/mcp-ui-a-technical-deep-dive-into-interactive-agent-interfaces](https://workos.com/blog/mcp-ui-a-technical-deep-dive-into-interactive-agent-interfaces)  
37. MCP Apps \- Model Context Protocol, accessed May 7, 2026, [https://modelcontextprotocol.io/extensions/apps/overview](https://modelcontextprotocol.io/extensions/apps/overview)  
38. 14 MCP Servers for UI/UX Engineers \- Snyk, accessed May 7, 2026, [https://snyk.io/articles/14-mcp-servers-for-ui-ux-engineers/](https://snyk.io/articles/14-mcp-servers-for-ui-ux-engineers/)  
39. Integrate Cursor and LLM for BDD Testing With Playwright MCP \- DZone, accessed May 7, 2026, [https://dzone.com/articles/integrating-cursor-llm-bdd-testing-playwright-mcp](https://dzone.com/articles/integrating-cursor-llm-bdd-testing-playwright-mcp)  
40. Test driven development works best with AI agents : r/ChatGPTCoding \- Reddit, accessed May 7, 2026, [https://www.reddit.com/r/ChatGPTCoding/comments/1k9b2gy/test\_driven\_development\_works\_best\_with\_ai\_agents/](https://www.reddit.com/r/ChatGPTCoding/comments/1k9b2gy/test_driven_development_works_best_with_ai_agents/)  
41. Test-driven development as prompt engineering \- David Luhr, accessed May 7, 2026, [https://luhr.co/blog/2024/02/07/test-driven-development-as-prompt-engineering/](https://luhr.co/blog/2024/02/07/test-driven-development-as-prompt-engineering/)  
42. Feedback loop engineering \- Daniel Demmel, accessed May 7, 2026, [https://www.danieldemmel.me/blog/feedback-loop-engineering](https://www.danieldemmel.me/blog/feedback-loop-engineering)  
43. Better AI Driven Development with Test Driven Development | by Eric Elliott \- Medium, accessed May 7, 2026, [https://medium.com/effortless-programming/better-ai-driven-development-with-test-driven-development-d4849f67e339](https://medium.com/effortless-programming/better-ai-driven-development-with-test-driven-development-d4849f67e339)  
44. Processes for Better Agentic Coding | by Tim Sylvester \- Medium, accessed May 7, 2026, [https://medium.com/@TimSylvester/processes-for-better-agentic-coding-f452d4620ba8](https://medium.com/@TimSylvester/processes-for-better-agentic-coding-f452d4620ba8)  
45. Test-Driven Development (TDD) Guide for Mobile-App QA 2025 \- Quash, accessed May 7, 2026, [https://quashbugs.com/blog/test-driven-development-tdd-guide](https://quashbugs.com/blog/test-driven-development-tdd-guide)  
46. Set up a test-driven development flow in VS Code, accessed May 7, 2026, [https://code.visualstudio.com/docs/copilot/guides/test-driven-development-guide](https://code.visualstudio.com/docs/copilot/guides/test-driven-development-guide)  
47. A Comparative Study of LLMs for Gherkin Generation, accessed May 7, 2026, [https://sol.sbc.org.br/index.php/sbes/article/download/36996/36781/](https://sol.sbc.org.br/index.php/sbes/article/download/36996/36781/)  
48. A Business Process-Centric Approach for LLM-Driven Functional Test Generation \- IEEE Xplore, accessed May 7, 2026, [https://ieeexplore.ieee.org/iel8/6287639/11323511/11422864.pdf](https://ieeexplore.ieee.org/iel8/6287639/11323511/11422864.pdf)  
49. Acceptance Test Generation with Large Language Models: An Industrial Case Study \- arXiv, accessed May 7, 2026, [https://arxiv.org/html/2504.07244v1](https://arxiv.org/html/2504.07244v1)  
50. Acceptance Test Generation with Large Language Models: An Industrial Case Study \- arXiv, accessed May 7, 2026, [https://arxiv.org/abs/2504.07244](https://arxiv.org/abs/2504.07244)  
51. Context-Aware Test Automation with LLMs: Keeping Regression Tests Aligned with Requirement Changes \- MagicPod, accessed May 7, 2026, [https://blog.magicpod.com/context-aware-test-automation-with-llms-keeping-regression-tests-aligned-with-requirement-changes](https://blog.magicpod.com/context-aware-test-automation-with-llms-keeping-regression-tests-aligned-with-requirement-changes)  
52. Playwright vs Cypress: Key Differences 2025 \- Abstracta, accessed May 7, 2026, [https://abstracta.us/blog/api-testing/playwright-vs-cypress/](https://abstracta.us/blog/api-testing/playwright-vs-cypress/)  
53. Migrate Cypress to Playwright with AI \- 10x Faster\! \- YouTube, accessed May 7, 2026, [https://www.youtube.com/watch?v=IlC7H3eB5Cw](https://www.youtube.com/watch?v=IlC7H3eB5Cw)  
54. Introducing Stagehand, accessed May 7, 2026, [https://docs.stagehand.dev/v3/first-steps/introduction](https://docs.stagehand.dev/v3/first-steps/introduction)  
55. Stagehand: A New Era of Automation Testing with Natural Language and LLMs, accessed May 7, 2026, [https://yatheendrasai.medium.com/stagehand-a-new-era-of-automation-testing-with-natural-language-and-llms-09d613cab80e](https://yatheendrasai.medium.com/stagehand-a-new-era-of-automation-testing-with-natural-language-and-llms-09d613cab80e)  
56. How to Build a Self-Improving AI Agent That Learns From Its Own Mistakes | MindStudio, accessed May 7, 2026, [https://www.mindstudio.ai/blog/self-improving-ai-agent-feedback-loop](https://www.mindstudio.ai/blog/self-improving-ai-agent-feedback-loop)  
57. Automated UI Testing via AI agent \- TestSprite, accessed May 7, 2026, [https://www.testsprite.com/use-cases/en/automated-ui-testing](https://www.testsprite.com/use-cases/en/automated-ui-testing)

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF0AAAAZCAYAAABTuCK5AAAD7ElEQVR4XtWYW6gOURTH1xzXF6VcokTHJYWUW1JIPFCEeBKl3CXlVqQcJddEeSHl8oAil0JCkfKAPKiTByKRUpKihBzpWGvW3jN71uw9s2e++c75zq/+fTP/vfZtfbP3t+cDqJxAGqWJW6quzQ6Dhtxlhp0/0BHSKEvYVX5/ZegvDV9mou6g9qIWK+8wakwUUW/sWdkvDQsLUTtQ91AHUROVPwB1TAf5EfbfDTUYNRI1DTUZOA8DdUAE3y1B9U74HpzHyu34eQp1DfUD1Q9FXulvsRCpXIcWTXS09AU05nYM/o6fJ1DXUb+BE9eKumnE5qKG8Qd47ja1oR6genBoSE/UCuM+lzeoXdIE7uCkNL2xJLEEX6Rh8BB4jFtkgUInaYos8GQ9cP1zsgDZCVxmEND98KRnh74hUTniAnTUUy4wvq9L8WWC1oDHvU4WGNCKvSrNArwD7mNUeJd8iLqrslVG0VbgOrnMAXfSadl2JrQfz5emgsZ8VpommIij+LFB+gmyV6NeKTYmAZctMDza72nryYA7XAZcmZ5qqtRIvJSG4jm4k6EIJ3dcunacmXclvRfqPdjL6Ae9L19a2w3NZogbp29poxlhkm4i7VTIdLBPahGw/08WpAlobrWQTHo83SPkB/atqwnyVpfiAMQdmPLJ6ytI19Oi08Rn1FvUC9QzoFNSSG7DVHd5dBeH67YPRU4dCHivpn4+Aa+Y06gbyqOVNjeOTsG58yfQTxiJrpPk5irGO1QEqlvX1qDHZvuBn4DaI+T6TciDTk3Uz9SEqwaXMzfasumAUohbwB3SkalScgZrsia6SlbSSU8T8LIX8ngxso0qPP5R4m2FeYwH3rat7JOGgpY1dTpMFlgYi5rFCtRnhoLwafSB+redeXUyzRcTiY4pkzAN1V8tTU8+SkOzEvVYmgp6G7U/TRnUMkML24BPCJJNwGO7LQsMdNIlQ4CPkXlvuLSlhPVLzsn2MhVyBrjhpdpQHdCrM/n0Op2LdVBW040jnPZsepW3Qf8P2ZJKrAV30q8A+69lgWA3mPUdA3RAx8UZ0lSEexYFUHLp+PUI9QT1wQjqbGaj+jhmvR3i5D5F/QQ+8g5FbQb7ix39ofcV9U0WKH5B3KaWx9E0AeWwGNbp1YOMjoJkISXUk4xGk7Q5YwOH7wc9wJelWR9qGmcuf6VRAfd9x+wZpqFVNK9wrQaEXquzTipFoD+p7kozRfmctRSqXCC0GhIdZvbeBNGPvTsuKnGHEOOgzJ7rRzN2PkiaHUT2rEtyURoNSEt0VZcU1IIxoIYbW9XUZYJlGy1bz6CCJhqN5JScEwwyyroMXX8GDU9npfg/39DHRitnbMoAAAAASUVORK5CYII=>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAZCAYAAADuWXTMAAABPElEQVR4XrVSPUtDQRDcVWxSaxuwFH9KQP+EgkQEwTqtCqJgpQi2Nmolgo21df6EtiJYSpy9zb3b3VxenoUDc3s3sx93eSH6AzgKrUjZspiytg7Ww34L4Rp8AY+NtVa2eUKp3ASvwAmkZxiX2D+Cp+AyOG4yBaWOX7F8gYfxhjjvIEymdOiBY64YgtyImR4Q7qNzR1p4G42AM3Avev46XC0UXERhm7TwJxoKLl+NeN17zVQ+Ed/P5CgYqJGvvGq0KXiEZQQtRdbzwOZI4Uc+hEGpMecBnOJ5uZEK8t6V8rYZSM47Vdx9UvMpGgbiD8vR92g+VWyNd+4mj2nDiC4ugUekDT7BN/AbvAH74IGmWdgxcWRCRaxIipZfzOm6lX/PjBiO8/1O6FyzKHGR7+Cuzu6RRf9ndJ1i8+bU/AL87zZ6mL7qCwAAAABJRU5ErkJggg==>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAZCAYAAADuWXTMAAABHklEQVR4Xq1SO04DMRB9Fi2KuAKp06SNBEehoaeIRJ9DUEdKlUTiBvR03IETIFoKFOZjez1jr5dinzTr8XtvPN7ZBQLmQfecLKbEuPPmmuKWYkVxH3RdUiyMawQXjuDWGB8Uu8LbRDKDe2k3eW4ofil+VMswFyqKS4jnDaJRHoqaImVRioUbHlcUX6qXGCofoeLeDkd2R9XCyUgZAQdo8YO5i6YXWlm7cXwGizyQ16CTPZPjPfJbsN0VCBfBpmfHNbct8LddczLpNYaAJ3Qm2QN/hm+kYn/j6gxL3EELPw07DfkhfLwYC3yvSFWkJ/zeoCvOCu3U7pfYltriKkTTv7wJPLqxAsuPuTC8VceC4oCGrUEZlPrQrZ5Y7YP8rn+bnjFtiYJnpQAAAABJRU5ErkJggg==>

[image4]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAAZCAYAAAB6v90+AAAC+UlEQVR4Xs2XS8hNURTH1ybPSEKRJBmRkkyYMiGUDBiSiZIiipQPJTPPpKTkE1LMUMy9SkImyoAi8iqPQhh81jrr7HP2+e+1zz3nfvfDr/733vNfa6+1z2ufc4n+E1zwiWSuHWrNDNYINC266tfVoBTVYp1K/2CNQxNYytrMus46xVqZ+8NYx3xSJ2Aik1kzWQtZi1nzOWE6f48Kk4Ixuw2vlgtolGQl9rEGWL9Yp0nzX7OmsC6xPvtss6Pl6cEYcFo3lqOX/D0nyBeeUljNrluwjfSoW3lHSRudxECOn8gODLTgDXeWGsgk0tprA+8Kqz/YLjEmbxUVzpHGLsuGMU7YyvpAZtiwYjaQ9pBeEfnZfB5Ysg68C7ZruYtGjhR9yBqDgYBVrItotqCftM9G3YwOhsTuVS13PE6LWceagCaPO0xatFOJ1ay5aLbAX8oWslBJbDwGmINoIDfQYKayvpHVMN7NiWi0JLVj01jvWd8xkCMLV5VgbntYz8rNIiaeNLuNAZO6WGf8jslKe4R1nvSgfiJ9pKQ4m30mev8kXa4R32wNBkjPUF8p18fF5ZKpIdGdaBPpangVAw3ZjobnBdld/Y7NK5wya0UeC3W/iFZwcfGqIc8/GS8razecQcNzjezgHdKGSwonmiF9JNz5JPHgHBkvB7cb+GzTcPlhVZdngtyggJPXG3nDeIWRAH+2kNGsXaxlGDCQ8evRLLBmXFL0LtIg/1DxqxrYSTp4ZMVVFsi94YwdY28LqS8HJo3LDoDkza6ff5KbaMQ4OlD+rLCc/Jlx9ITKy09eVheRfW/Jo+IxS97zLGTl82c7VBvkPk/9E6nsQvkC2zveotETXPb++BvtFCfQ6AFf0cjo8roLkPv3VrHVoF7ymeDJagSFrJq5t5fy/1NWziD5whqLZkai2SM0MhLJHXiARg+pexsBdPL7qdkS/feID+osNJoRF/q3uCGYUquCrZKb0aZknBs7OcnA4PFnoUmLupwgpj/rknvOEDSrKfkH9I2OhS+WeLAAAAAASUVORK5CYII=>

[image5]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAXCAYAAAAyet74AAABCklEQVR4XnWRoY5CMRBFpxZHAgkhSNggSLAkq1bxBXwCweJYi+Mf0CgEihDcBrcWjeAbkBi40077bgtMMu3rmTvT6TwRNRfd+S0af5PlOOa+WAUpbLe8u2aAfYvDkkLBTFCD3/H9rQWM37BektDsCp8WbAJ/0NmXUDAmqHgEf8CH3LWCQfHMjoQC60RcAF8JBGtK4H8MUdF1qzn4udSd3iRyJp3P7JkgyhvGT6ZJj+kXk20Z3xH04CfXyVA50Jyo/MMX3CFsJjZHzv+FH+LBAhvxj4w0mpOLjWmF33jEvgds55rsTju8VCILMV2rzI/6/OFMUsSysxLuTQtla6WgLJA2Xbx/6pNLkuIJU7klDtAbkvAAAAAASUVORK5CYII=>

[image6]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAZCAYAAAA8CX6UAAABHUlEQVR4Xr2TOwoCMRCGJ0ewUCwEK2vBUkQ8gHgJOw+kB/AGlt5ACxG8gY124gFknck7s5PNguAHY2b+eSQkKwBHsRUd77aCD5C7d2hbtC7aC+2epgndqIQBiVBZI2bW74Q0URsgcsHCPTlYPsGlwrXHagLtZsIZ/OmkjkiT0pY52oaLBqFLkBwPLsTQSywyNtUVCob4e4p26PDNKP5AeJUKleCHl7oxzemeN9rA+mO0VZTL449jnL5PGK5pKHzZTlDSPQaFHbdeGpPJapk+MoFUzUTeWaM9XZAitMo7ag5oRxeYOndHDV0JCkZg7mfJUwZhkCBlRCKb+JXS4FKeEGqYJFRE+GxzWZlyf7kC6kU8/gfpntGftnyYckWJLzqPJNgunJqxAAAAAElFTkSuQmCC>