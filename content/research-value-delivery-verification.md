---
title: Ensuring That a Tool, Agent, or System Delivers the Value It Proposes
type: research
subtype: report
tags: [value-delivery, product-management, measurement, goodharts-law, kill-criteria, ai-tools, governance]
status: draft
created: 2026-07-31
updated: 2026-07-31
version: 1.0.0
source: original
related:
  - research-synthesis-agent-value-alignment.md
  - research-agentic-alignment.md
  - research-prompt-frameworks.md
---

# Ensuring That a Tool, Agent, or System Delivers the Value It Proposes — A Comprehensive Framework

*A deeply researched report for teams building AI agents, software tools, and internal platforms*
*As of July 31, 2026*

---

## Executive Summary

The history of software product development is littered with tools that were built with genuine conviction, deployed with real investment, and then quietly abandoned — not because they were technically broken, but because they never demonstrably delivered the value they promised. This failure mode is not rare; it is the norm. Research consistently shows that the majority of software features deliver little to no measurable business value, and yet teams continue building, measuring the wrong things, and rationalizing continued investment through vanity metrics and sunk cost reasoning.

This report addresses the full lifecycle of value delivery for tools, agents, and systems — from the moment a value proposition is first articulated through to the ongoing accountability mechanisms that keep both the tool and the team honest. It is written specifically for teams building AI agents, software tools, and internal platforms, where the problem is particularly acute: AI tools are non-deterministic, difficult to evaluate, and easy to over-claim; internal platforms lack the market pressure that would otherwise force honest reckoning; and agent-based systems introduce new layers of behavioral complexity that make drift harder to detect.

The core problem has three distinct failure modes. First, **value proposition detachment**: the tool was built to solve a problem that was never precisely defined, or the definition drifted as the team built. Second, **metric drift**: the team began measuring proxies that diverged from actual value, often because the proxies were easier to move. Third, **tool behavior drift**: the tool itself changed — through model updates, feature additions, or scope creep — in ways that moved it away from the behaviors that originally drove value.

The solution requires discipline at every stage of the lifecycle. Upfront, teams must define value in falsifiable, outcome-based terms — not "the tool will help users write code faster" but "developers using the tool will complete pull requests 30% faster within 90 days, as measured by PR cycle time in our version control system." This requires frameworks like Jobs to be Done [1], Impact Mapping [2], Opportunity Solution Trees [3], and structured value hypotheses from the Lean Startup tradition [4].

During delivery, teams must measure at the right level of the output/outcome/impact hierarchy, resist Goodhart's Law [5], and design measurement systems that capture leading indicators of value before lagging indicators confirm (or deny) it. Frameworks like Google's HEART [6], North Star Metrics [7], and counterfactual measurement approaches provide the methodological backbone.

Accountability requires structural mechanisms: kill criteria defined before a tool is built, independent evaluation separate from the building team, portfolio-level governance that forces honest comparison across tools, and value realization reviews modeled on Amazon's Working Backwards approach [8] and Google's OKR system [9].

For AI and agent-based tools specifically, the report introduces eval-driven development as the primary mechanism for verifying agent value, addresses the trust gap that causes technically capable tools to deliver zero value when users route around them, and examines how responsible AI principles intersect with equitable value delivery.

The report concludes with a concrete step-by-step playbook and an honest accounting of the major unresolved tensions in this space — including the fundamental difficulty of proving causation in complex sociotechnical systems, the organizational politics that make honest value assessment rare, and the open question of how to measure value from AI tools that augment human judgment in ways that resist quantification.

---

## Section 1 — Defining Value Upfront: From Promise to Measurable Outcome

### The Difference Between Outputs and Outcomes

The most fundamental confusion in product development is the conflation of outputs — what a tool does — with outcomes — what changes as a result of the tool existing. A tool that generates summaries is an output. A tool that reduces the time analysts spend reading reports by 40% is an outcome. A tool that routes customer support tickets is an output. A tool that reduces first-response time from 4 hours to 45 minutes is an outcome.

Teresa Torres, product discovery coach and author of *Continuous Discovery Habits*, makes this distinction central to her Opportunity Solution Tree framework: "Focusing on outputs as your goal instead of outcomes is a shortcut that creates a disconnect between your product team's activities and the value they're providing to customers." [3] The distinction matters because outputs are entirely within the team's control — you can always ship a feature — while outcomes depend on how users actually respond to and use what you've built. A team that measures outputs will always look successful. A team that measures outcomes will sometimes be forced to confront that their work didn't matter.

This distinction maps onto a three-level hierarchy that appears across multiple frameworks: **outputs** (what was built or done), **outcomes** (what changed in user behavior or experience as a result), and **impact** (what changed at the business or societal level as a result of those behavioral changes). The hierarchy matters because teams routinely measure at the wrong level — celebrating feature launches (outputs) while ignoring whether users changed their behavior (outcomes) or whether the business moved (impact).

### Outcome-Based Product Specifications

**Jobs to be Done (JTBD)** is the foundational framework for defining value in terms of what users are actually trying to accomplish, independent of any particular solution. Developed by Tony Ulwick at Strategyn in 1990 and popularized by Clayton Christensen in *The Innovator's Solution* (2003), JTBD holds that people don't buy products — they hire them to get a job done [1]. The classic formulation, attributed to Harvard marketing professor Theodore Levitt, is: "People don't want a quarter-inch drill; they want a quarter-inch hole."

Ulwick's Outcome-Driven Innovation (ODI) operationalizes JTBD into a six-phase process: define the customer and the job in solution-free terms; uncover customer needs via qualitative research and the Universal Job Map (which maps eight universal job steps: Define, Locate, Prepare, Confirm, Execute, Monitor, Modify, Conclude); gather quantitative data on importance and satisfaction; discover hidden segments of opportunity; formulate market strategy; and formulate product strategy aligned to unmet desired outcomes. ODI has an independently verified 86% success rate, compared to the industry average of approximately 17% [1]. For AI product teams, JTBD provides a discipline against the common failure mode of building impressive technical capabilities that don't correspond to any job users actually need done.

**Impact Mapping**, developed by Gojko Adzic and documented in his 2012 book *Impact Mapping: Making a Big Impact with Software Products and Projects*, is a visual strategic planning technique that prevents teams from getting lost by connecting every deliverable to a behavioral change to a business goal [2]. The map has four levels: Goal (Why — a SMART business objective), Actors (Who — the people who can influence the goal), Impacts (How — the behavioral changes actors need to make), and Deliverables (What — the features or outputs that enable those behaviors). The critical discipline of Impact Mapping is that every deliverable must trace back through an impact to a goal. If a feature has no impact mapping, it probably shouldn't be built. Adzic cites the BBC's £75 million failed "agile" IT project and the FBI's $19 million + $360 million failed case management system as examples of what happens when teams build without this discipline [2].

**Opportunity Solution Trees (OST)**, developed by Teresa Torres in 2016, provide a visual representation of how a team plans to reach a desired outcome [3]. The tree has four components: the Outcome at the top (the value to be created for customers), Opportunities below it (customer needs and pain points), Potential Solutions below those (ideas that directly address specific opportunities), and Assumption Tests at the leaves (experiments to validate solutions). The OST is a living document — when solutions fail, teams must revisit and revise the opportunities they identified. The tree structure forces teams to show their work in a way that stakeholders can interrogate, and it prevents the common failure mode of jumping directly from "we have a goal" to "here are the features we'll build" without the intermediate step of understanding what opportunities exist to achieve that goal.

### Writing a Falsifiable Value Proposition

A value proposition is only useful if it can be proven false. "This tool will help users be more productive" is not a value proposition — it is an aspiration. A falsifiable value proposition specifies: who will experience the value, what will change for them, by how much, within what timeframe, and how it will be measured. For example: "Software engineers using the AI code assistant will reduce their PR cycle time by 25% within 60 days of adoption, as measured by the median time from PR creation to merge in GitHub."

The Lean Startup framework, developed by Eric Ries and documented in *The Lean Startup* (2011), provides the structure for testing value propositions through validated learning [4]. The core mechanism is the Build-Measure-Learn loop, in which teams formulate a value hypothesis (what value will be created for whom), build the minimum viable product needed to test it, measure whether the hypothesis was confirmed or refuted, and learn from the result. Experiment cards — a tool popularized by Strategyzer — operationalize this by requiring teams to state: the hypothesis being tested, the experiment to be run, the minimum success criterion, and the learning that will result regardless of outcome.

The key discipline is that the value hypothesis must be stated before the experiment, not after. Post-hoc rationalization — "we didn't hit the metric we originally targeted, but look at this other metric that went up" — is one of the most common ways teams avoid honest reckoning with value delivery failure.

### How Leading AI Product Teams Define Value

OpenAI, Anthropic, and Google have each developed approaches to defining value for their agent and assistant tools, though the details are often not publicly documented. What is observable from their public communications and research papers is a consistent emphasis on task completion rates, user satisfaction scores, and safety metrics as the primary value dimensions.

Google's approach to defining value for its AI products is most publicly documented through its HEART framework [6] and its OKR system [9]. For AI-specific products, Google has published research on evaluation methodologies that emphasize both automated metrics (task completion, accuracy, latency) and human evaluation (preference ratings, usefulness scores). Anthropic has published extensively on Constitutional AI and model evaluation, emphasizing that safety and helpfulness are complementary value dimensions, not trade-offs. OpenAI's GPT-4 technical report includes extensive evaluation benchmarks, though critics have noted that benchmark performance does not always translate to real-world value delivery.

### The Value Delivery Model and Structured Approaches

The Value Delivery Model (VDM) is a structured approach to connecting strategic intent to operational execution through a chain of value-creating activities. While not attributed to a single author, the VDM concept appears in enterprise architecture frameworks including TOGAF and in the IT governance literature. The core idea is that value delivery requires alignment across four levels: strategic intent (what value is promised), capability (what the organization can do), process (how work is done), and outcome (what results are achieved). Gaps at any level break the value delivery chain.

The Benefits Realization Management (BRM) discipline, documented by Steve Jenner in *Managing Benefits: Optimizing the Investment Portfolio* (The Stationery Office, 2012), provides a more formal framework for ensuring that investments deliver their promised benefits [10]. BRM distinguishes between outputs (what is delivered), outcomes (the changes that result), and benefits (the measurable improvements in organizational performance). The MSP (Managing Successful Programmes) framework from AXELOS incorporates BRM as a core discipline, requiring programme managers to define a Benefits Realization Plan before any work begins and to track benefits through a Benefits Register throughout the programme lifecycle.

### OKRs vs. KPIs vs. North Star Metrics

These three measurement frameworks operate at different levels and serve different purposes, and confusing them is a common source of measurement dysfunction.

**KPIs (Key Performance Indicators)** measure the ongoing health of a system. They are steady-state metrics that indicate whether operations are within acceptable bounds. A KPI for a customer support tool might be "average first-response time < 2 hours." KPIs don't drive change — they monitor it.

**OKRs (Objectives and Key Results)**, created by Andy Grove at Intel in the 1970s and introduced to Google by John Doerr in 1999, are measures for change [9]. The core formula is: "I will [Objective] as measured by [Key Results]." Objectives are qualitative and aspirational; Key Results are specific, time-bound, and measurable. The critical discipline, as Atlassian notes, is that Key Results must reflect outcomes, not activities — "reduce data quality errors reported to support desk" is a Key Result; "install software release 10.0" is an activity [9]. OKRs are typically quarterly and divorced from compensation, which is what makes them useful for honest measurement rather than political performance.

**North Star Metrics**, a concept coined by Sean Ellis and the growth-hacking community and operationalized by Amplitude in their North Star Playbook, are single metrics that best capture the value customers derive from a product [7]. The North Star sits above operational KPIs and is a leading indicator of revenue, not a lagging one. Amplitude's research identifies three core qualities: it represents the value users get from the product, it is within the product team's sphere of influence, and it predicts where business numbers are heading. Examples include Airbnb's "nights booked," Spotify's "time spent listening," and Slack's "teams reaching a message threshold." Critically, the North Star should not be directly movable by the team — "if you can move your North Star directly, it's probably not a good North Star," as John Cutler, former Amplitude Product Evangelist, has noted [7].

For AI agent tools, the North Star Metric is often the hardest to define because the value is frequently cognitive or qualitative — reduced decision-making time, improved output quality, reduced cognitive load. Teams building AI tools should resist the temptation to use engagement metrics (sessions, queries, tokens processed) as North Star proxies, as these measure activity rather than value.

---

## Section 2 — Measuring Whether Value Is Actually Being Delivered

### The Output/Outcome/Impact Hierarchy

The three-level hierarchy of outputs, outcomes, and impacts is the most important conceptual tool for avoiding measurement dysfunction. Teams that measure outputs (features shipped, queries processed, documents generated) will always look successful because outputs are entirely within their control. Teams that measure outcomes (user behavior changes, task completion improvements, time savings) will sometimes be forced to confront that their work didn't matter. Teams that measure impact (business results, organizational performance, societal effects) will have the most honest picture of value delivery, but will also face the hardest attribution challenges.

The practical discipline is to measure at all three levels simultaneously, with the understanding that outputs are leading indicators of outcomes, and outcomes are leading indicators of impact. A tool that processes 10,000 queries per day (output) but where users report that the outputs require significant correction (outcome) is not delivering value, regardless of how impressive the output volume looks. A tool that improves task completion rates by 30% (outcome) but where the tasks being completed are not the ones that drive business results (impact) has a value delivery gap at the impact level.

### Proxy Metrics and Goodhart's Law

Goodhart's Law, formulated by British economist Charles Goodhart in 1975, states: "Any observed statistical regularity will tend to collapse once pressure is placed upon it for control purposes." [5] Marilyn Strathern's more widely cited formulation is: "When a measure becomes a target, it ceases to be a good measure." The mechanism is straightforward: once a metric becomes a target, people optimize for the metric rather than for the underlying goal the metric was intended to represent.

The Machine Intelligence Research Institute's 2018 paper by Manheim and Garrabrant identifies four types of Goodhart's Law failures [5]: **Regressive** (using a single proxy for a multi-causal goal), **Extremal** (a proxy valid in normal contexts fails in variable ones), **Causal** (confusing correlation with causation), and **Adversarial** (the proxy itself becomes the goal, incentivizing gaming — the "Cobra Effect").

For AI and software tools, Goodhart's Law manifests in predictable ways. NPS (Net Promoter Score) scores get gamed by timing surveys immediately after positive interactions. Task completion rates get inflated by making tasks easier rather than more valuable. User engagement metrics get boosted by adding notifications and interruptions that increase usage without increasing value. Code review tools that measure "suggestions accepted" get gamed by making suggestions that are easy to accept rather than genuinely valuable.

The countermeasures are: use multiple metrics that create healthy tension with each other (so gaming one metric hurts another), choose metrics that are harder to game because they require genuine behavioral change, monitor trends rather than point-in-time values, and conduct qualitative audits when metrics move unexpectedly.

### Leading vs. Lagging Indicators

Leading indicators are early signals that value is being (or is about to be) delivered; lagging indicators confirm that value was delivered. The distinction matters because lagging indicators arrive too late to course-correct — by the time you know a tool failed to deliver value, you've already spent months building and deploying it.

For a customer support AI tool, a leading indicator might be "percentage of AI-suggested responses that agents use without modification" — this signals that the AI is generating genuinely useful suggestions before the lagging indicator of "average handle time reduction" confirms it. For a code assistant, a leading indicator might be "percentage of suggestions accepted without modification" before the lagging indicator of "PR cycle time reduction" confirms value delivery.

The discipline of leading indicator design requires working backwards from the lagging outcome and asking: what user behaviors, if observed early, would predict that the lagging outcome will materialize? This is the same logic as the North Star Metric framework — the North Star is a leading indicator of revenue, not a lagging one.

### User-Centric Value Measurement

The primary user-centric measurement frameworks are:

**NPS (Net Promoter Score)**, developed by Fred Reichheld and Bain & Company, measures the likelihood that users would recommend the tool to others. While widely used, NPS has significant limitations as a value measurement tool: it is a lagging indicator, it is easily gamed, it conflates satisfaction with value delivery, and it provides no diagnostic information about what is or isn't working. NPS is most useful as a health check, not as a primary value measurement.

**Task Success Rate** measures the percentage of users who successfully complete a defined task using the tool. This is one of the most direct measures of value delivery for task-oriented tools. It requires clear task definition upfront and is best measured through usability testing or instrumented task flows.

**Time-on-Task** measures how long it takes users to complete a defined task. For tools that promise to save time, this is a direct outcome metric. The GitHub Copilot study, discussed in Section 6, used time-on-task as its primary outcome measure.

**Error Rate** measures how often users make mistakes or encounter failures when using the tool. For AI tools, this includes both technical errors (tool failures) and semantic errors (tool outputs that are wrong or misleading).

### Business Value Measurement

Business value measurement for AI and agent tools typically falls into three categories: cost savings, productivity uplift, and revenue attribution.

**Cost savings** are the most straightforward to measure: if a tool automates a task that previously required human labor, the cost saving is the labor cost of that task multiplied by the volume of tasks automated. The challenge is accounting for the overhead costs of the tool itself (licensing, maintenance, training, error correction) and the hidden costs of automation failures.

**Productivity uplift** is harder to measure because it requires a counterfactual: what would users have produced without the tool? The most rigorous approach is a randomized controlled trial (RCT) — an experiment in which some users are randomly assigned the tool and others are not, and productivity is compared across groups. The GitHub Copilot study used this approach [11]. Where RCTs are not feasible, difference-in-differences analysis (comparing the change in productivity for tool users vs. non-users over the same time period) provides a reasonable approximation.

**Revenue attribution** is the hardest to measure because the causal chain from tool usage to revenue is typically long and confounded by many other factors. The most honest approach is to identify the specific mechanism by which the tool is expected to drive revenue (e.g., faster sales cycle, higher conversion rate, better customer retention) and measure that mechanism directly, rather than attempting to attribute revenue changes to the tool.

### The HEART Framework

Google's HEART framework, created by Kerry Rodden, Hilary Hutchinson, and Xin Fu and published in the Proceedings of CHI 2010, provides a structured approach to user-centered metrics for web applications [6]. The five dimensions are:

- **Happiness**: Subjective user attitudes and satisfaction (CSAT, NPS, sentiment surveys)
- **Engagement**: Frequency and depth of interactions (sessions per user, DAU/MAU ratio, feature usage depth)
- **Adoption**: New users adopting a product or feature (sign-ups, first-time use, activation rates)
- **Retention**: Continued usage over time (D7/D30 retention, cohort curves, churn rate)
- **Task Success**: How well users accomplish their goals (completion rate, error rate, time-to-complete)

The complementary GSM (Goals–Signals–Metrics) process guides teams in selecting specific metrics for each dimension: define the Goal in plain language, identify the Signals (observable behaviors that indicate goal achievement), and then select the Metrics (specific data points that measure those signals). The GSM process prevents the common failure mode of selecting metrics that are easy to measure rather than metrics that are meaningful.

The HEART framework is particularly valuable for AI tools because it forces teams to measure across multiple dimensions simultaneously, preventing the over-indexing on engagement metrics (which measure activity, not value) that is common in AI product development.

### The PULSE Framework

PULSE (Page views, Uptime, Latency, Seven-day active users, Earnings) is a lower-level framework focused on technical and business KPIs for large-scale web products [6]. While useful for monitoring infrastructure and business performance, PULSE does not capture user satisfaction or value generation. It is best understood as a health monitoring framework rather than a value measurement framework. Teams building AI tools should use PULSE for operational monitoring and HEART for value measurement.

### AARRR/Pirate Metrics Adapted for Internal Tools

Dave McClure's AARRR framework (Acquisition, Activation, Retention, Revenue, Referral), created in 2007, was designed for consumer startups but can be adapted for internal tools and AI agents [12]. For internal tools, the adaptation looks like:

- **Acquisition**: How do users discover and get access to the tool? (Onboarding rate, time-to-first-use)
- **Activation**: Do users have a positive first experience? (First-session task completion, "aha moment" rate)
- **Retention**: Do users continue using the tool? (Weekly active users, return rate, churn)
- **Revenue/Value**: Does the tool deliver measurable business value? (Cost savings, productivity uplift, error reduction)
- **Referral**: Do users recommend the tool to colleagues? (Internal NPS, organic adoption rate)

For internal tools, the "Revenue" stage is replaced by "Value" — the measurable business impact that justifies the tool's existence. This is the stage that most internal tool teams fail to measure rigorously.

### Counterfactual Measurement

The fundamental challenge of value measurement is proving causation rather than correlation. A tool that is adopted during a period of organizational improvement may appear to drive that improvement when the improvement would have happened anyway. The gold standard for causal measurement is the randomized controlled trial (RCT), in which users are randomly assigned to tool-using and non-tool-using groups and outcomes are compared.

Where RCTs are not feasible, quasi-experimental methods provide reasonable approximations:

- **Difference-in-differences (DiD)**: Compare the change in outcomes for tool users vs. non-users over the same time period. This controls for time-varying confounders that affect both groups equally.
- **Regression discontinuity design (RDD)**: If tool access is determined by a threshold (e.g., teams above a certain size get the tool), compare outcomes just above and just below the threshold.
- **Instrumental variables (IV)**: Use a variable that affects tool adoption but not outcomes directly (e.g., random variation in rollout timing) to isolate the causal effect of the tool.

The GitHub Copilot study used a randomized controlled trial design, which is why its findings are more credible than most AI productivity studies that rely on self-reported productivity improvements [11].

---

## Section 3 — Value-Behavior Alignment: Ensuring the Tool Doesn't Drift from Its Value Purpose

### The Activity Trap

The "activity trap" is the condition in which a tool is busy — generating outputs, processing requests, logging interactions — but not valuable. High usage metrics coexist with low impact. This is one of the most dangerous failure modes for AI tools because the activity is visible and measurable, while the absence of value is invisible and unmeasured.

The activity trap is enabled by the conflation of engagement with value. A tool that users interact with frequently is not necessarily a tool that delivers value — it may be a tool that users feel compelled to use (because it's mandated), or a tool that generates outputs that require significant correction (so users interact with it a lot, but mostly to fix its mistakes), or a tool that has become a habit without remaining useful.

The diagnostic question for the activity trap is: if this tool disappeared tomorrow, what would users lose? If the honest answer is "not much — they'd just do it the old way, which wasn't much slower," the tool is in the activity trap. If the answer is "they'd lose significant time, quality, or capability," the tool is delivering genuine value.

### Vanity Metrics and Self-Rationalization

Tools rationalize their own existence through vanity metrics — metrics that look impressive but don't reflect genuine value delivery. Common vanity metrics for AI tools include: total queries processed, total tokens generated, total documents summarized, total suggestions made, and total "time saved" (calculated by multiplying the number of interactions by an assumed time-per-interaction, without measuring whether users actually saved that time).

The mechanism of self-rationalization is well-documented in the product management literature. Teams that have invested significant effort in building a tool are motivated to find evidence that it is working. They select metrics that are likely to look good, interpret ambiguous data optimistically, and discount negative signals. This is not malice — it is a predictable consequence of the sunk cost fallacy and confirmation bias operating in organizational settings.

The countermeasure is structural: independent evaluation (discussed in Section 4), pre-committed kill criteria (discussed in Section 4), and a culture that treats honest negative findings as valuable information rather than failures.

### Behavioral Alignment Audits

A behavioral alignment audit is a structured process for comparing what a tool actually does against what it is supposed to do to deliver its value proposition. The audit has three components:

1. **Behavior inventory**: Document what the tool actually does in practice — what requests it receives, what outputs it generates, how users interact with those outputs. This is often different from what the tool was designed to do.

2. **Value proposition mapping**: Map each observed behavior to the value proposition. Which behaviors contribute to the promised outcomes? Which behaviors are neutral? Which behaviors actively undermine the value proposition (e.g., generating outputs that users must spend time correcting)?

3. **Gap analysis**: Identify the gaps between what the tool does and what it needs to do to deliver its value proposition. Prioritize closing the gaps that have the largest impact on value delivery.

For AI agent tools, behavioral alignment audits are particularly important because the tool's behavior can change without any explicit change to the tool — model updates, changes in the distribution of input queries, and changes in user behavior can all cause the tool to behave differently over time.

### Goal Drift at the Value Level

The alignment and checkpointing literature in AI safety addresses goal drift at the model level — the risk that an AI system's objectives diverge from its intended objectives over time. The same phenomenon occurs at the value level for any tool or system: the tool's de facto purpose (what it is actually optimized for, as revealed by its behavior and the metrics used to evaluate it) drifts away from its stated purpose (the value proposition it was built to deliver).

This drift can happen through several mechanisms: metric substitution (the team starts measuring something easier to measure than the original outcome metric, and the tool gets optimized for the easier metric), scope creep (the tool accumulates features that serve adjacent purposes, diluting its focus on the original value proposition), and stakeholder drift (the tool's primary stakeholders change, and the new stakeholders have different value expectations than the original ones).

The checkpointing mechanism for value-level goal drift is the value proposition review — a structured ceremony in which the team explicitly compares the tool's current behavior and metrics against its original value proposition and asks whether they are still aligned. This is distinct from a product review (which focuses on what was built) and a retrospective (which focuses on how the team worked) — it focuses specifically on whether the tool is still doing what it was built to do.

### Continuous Value Discovery

Teams like Spotify, Netflix, and Intercom maintain value alignment through continuous discovery practices — ongoing, structured engagement with users to verify that the tool is still solving the problems it was built to solve and that those problems are still the right ones to solve.

Teresa Torres's Continuous Discovery Habits framework [3] provides the most detailed methodology for this: weekly touchpoints with users (not monthly or quarterly), structured around specific questions about the outcomes the tool is supposed to deliver, with findings fed directly into the product decision-making process. The key discipline is that discovery is not a phase — it is a continuous practice that runs in parallel with delivery.

Spotify's approach to value alignment is documented in their engineering blog and in the "Spotify Model" literature. Their squad model includes explicit "health checks" — structured self-assessments in which squads evaluate their own performance across dimensions including "delivering value" and "easy to release." Netflix's approach emphasizes A/B testing at scale as the primary mechanism for verifying that product changes deliver value, with a culture that treats negative test results as valuable information.

Intercom's approach, documented in their product management blog, emphasizes the "jobs to be done" framework as the anchor for value alignment — regularly asking whether the tool is still getting the job done that users hired it to do, and whether that job has changed.

---

## Section 4 — Stakeholder Accountability: Keeping Teams Honest About Value Delivery

### The Sunk Cost Problem

The sunk cost fallacy — the tendency to continue investing in something because of past investment rather than future expected value — is one of the most powerful forces working against honest value assessment in product development. Teams that have spent months building a tool are psychologically and organizationally invested in its success. They are motivated to find evidence that it is working, to discount evidence that it isn't, and to continue building rather than stopping or pivoting.

The organizational dynamics amplify the individual psychology. The team that built the tool is typically also the team that measures its value, which creates a structural conflict of interest. The team's performance reviews, career advancement, and organizational status are often tied to the tool's perceived success. Leadership that approved the investment is motivated to believe the investment was sound. These dynamics make honest value assessment genuinely difficult, not just psychologically uncomfortable.

The solution is structural: accountability mechanisms that are designed to counteract these dynamics, not just to document them.

### Kill Criteria

Kill criteria are pre-committed conditions under which a tool will be deprecated, pivoted, or significantly restructured. They are defined before the tool is built, when the team is not yet invested in its success, and they specify the evidence that would constitute proof that the tool is not delivering its promised value.

Effective kill criteria have four components: a specific metric (or set of metrics), a threshold value, a timeframe, and a consequence. For example: "If the tool's task completion rate is below 70% after 90 days of deployment, or if user NPS is below 20 after 60 days, the team will conduct a structured pivot review within 30 days and either identify a specific change that is expected to address the gap or recommend deprecation."

Kill criteria are most effective when they are documented in a public artifact (a product brief, a value hypothesis document, or a programme business case) that is reviewed by stakeholders outside the building team. This creates accountability that is harder to quietly ignore than internal team commitments.

The challenge is that kill criteria require organizational cultures that treat stopping as a legitimate outcome rather than a failure. In most organizations, stopping a project is career-limiting, which creates strong incentives to keep going regardless of evidence. Amazon's approach to this, discussed below, is instructive.

### Product Review Practices

**Amazon's Working Backwards** approach, documented by Colin Bryar and Bill Carr in *Working Backwards: Insights, Stories, and Secrets from Inside Amazon* (St. Martin's Press, 2021), requires teams to write a press release and FAQ (PR/FAQ) before any development begins [8]. The press release describes the product as if it has already been launched and is delivering its promised value. The FAQ addresses the hard questions: Why will customers want this? How will we know if it's working? What will we measure? The PR/FAQ is reviewed by senior leadership before development begins, and the same document is used to evaluate the product after launch — creating a direct accountability link between the upfront promise and the post-launch reality.

Amazon's product review culture also includes a practice of "working backwards from the customer" in every review — starting with the customer experience and working backwards to the technology, rather than starting with the technology and working forwards to the customer. This discipline prevents the common failure mode of building impressive technology that doesn't solve a real customer problem.

**Google's OKR system** [9] functions as a value verification mechanism through its quarterly review cadence. Every quarter, teams grade their OKRs (on a 0.0–1.0 scale, where 0.7 is considered a success and 1.0 may indicate targets weren't ambitious enough) and present the results to leadership. The grading is public within the organization, which creates accountability. The quarterly cadence is short enough to course-correct before too much investment is made in a direction that isn't working.

**Spotify's approach** to product reviews, documented in their engineering blog, includes "health checks" — structured self-assessments in which squads evaluate their own performance across multiple dimensions. The health check results are visible to the broader organization, creating peer accountability. Squads that consistently score poorly on "delivering value" face organizational pressure to change their approach.

### Value Realization Reviews

A value realization review is a structured ceremony specifically designed to assess whether a product or tool is delivering its promised value. It is distinct from a sprint review (which focuses on what was built), a retrospective (which focuses on how the team worked), and a product review (which focuses on product strategy). It focuses specifically on the question: is this tool delivering the value it promised?

A well-structured value realization review has five components:

1. **Value proposition restatement**: What did we promise this tool would deliver, for whom, by when?
2. **Evidence review**: What evidence do we have that the tool is or isn't delivering that value? (Metrics, user research, business outcomes)
3. **Gap analysis**: Where are the gaps between the promised value and the delivered value?
4. **Causal analysis**: Why do those gaps exist? (Tool behavior issues, adoption issues, measurement issues, value proposition issues)
5. **Decision**: Continue as-is, pivot, or deprecate — with specific commitments about what will change and when the next review will occur.

Value realization reviews should be conducted at regular intervals (quarterly for most tools, monthly for tools in early deployment) and should include stakeholders outside the building team.

### Independent Evaluation

The team building a tool should not be the only one measuring its value. This is not a statement about the team's honesty — it is a statement about the structural conflict of interest that makes honest self-assessment genuinely difficult. Independent evaluation provides a check on the building team's measurement choices, interpretation of evidence, and conclusions.

Independent evaluation can take several forms: an internal audit function that reviews value delivery claims, a separate analytics team that owns the measurement infrastructure, external researchers who conduct independent studies (as in the GitHub Copilot study [11]), or a portfolio governance function that compares value delivery across tools.

The Benefits Realization Management (BRM) discipline, documented by Steve Jenner in *Managing Benefits* [10], provides a formal framework for independent evaluation. BRM requires that benefits be defined in a Benefits Realization Plan before any work begins, tracked in a Benefits Register throughout the programme, and independently verified at defined review points. The MSP programme management framework from AXELOS incorporates BRM as a core discipline.

### Portfolio-Level Value Governance

At the organizational level, value governance requires mechanisms for comparing value delivery across tools and making explicit trade-off decisions about where to invest and what to sunset. Without portfolio-level governance, organizations accumulate tools that each have local advocates but collectively consume more resources than they deliver in value.

Portfolio-level value governance requires: a common value measurement framework that allows comparison across tools (even if the specific metrics differ), a regular review cadence at which portfolio-level investment decisions are made, and explicit criteria for sunsetting tools that are not delivering value.

The challenge is that sunsetting tools is politically difficult — every tool has users who depend on it and advocates who built it. The most effective approach is to make the sunset criteria explicit and public before tools are built, so that the decision to sunset is seen as the execution of a pre-committed plan rather than a political judgment.

---

## Section 5 — Feedback Loops and Continuous Value Verification

### Closing the Feedback Loop

The feedback loop from user behavior to product decisions is the mechanism by which teams learn whether their tool is delivering value and adjust accordingly. Closing this loop requires three things: instrumentation that captures the right signals, analysis processes that convert signals into insights, and decision-making processes that act on those insights.

Most teams have the first component (instrumentation) but fail at the second and third. They collect enormous amounts of data but lack the analytical capacity to convert it into actionable insights, or they generate insights but lack the organizational processes to act on them. The result is a feedback loop that is nominally closed but functionally broken.

Teresa Torres's Continuous Discovery Habits framework [3] addresses this by making discovery a weekly practice rather than a periodic project. The discipline is: every week, the product team has at least one conversation with a user about the outcomes the tool is supposed to deliver. These conversations are not demos or feedback sessions — they are structured explorations of the user's experience of the problem the tool is supposed to solve. The insights from these conversations feed directly into the Opportunity Solution Tree, which connects them to the product decisions being made.

### Instrumentation Strategy

Effective instrumentation for value measurement requires a deliberate strategy, not just the default analytics that come with most tools. The default analytics — page views, session duration, feature clicks — measure activity, not value. Value measurement requires instrumenting the specific behaviors that indicate value delivery.

For a code assistant tool, value instrumentation might include: the percentage of suggestions accepted without modification (leading indicator of suggestion quality), the time between suggestion display and acceptance/rejection (leading indicator of cognitive load), the percentage of accepted suggestions that are later reverted (lagging indicator of suggestion quality), and the change in PR cycle time for users vs. non-users (outcome metric).

The instrumentation strategy should be derived from the value hypothesis: what behaviors, if observed, would confirm that the tool is delivering its promised value? Those behaviors are what should be instrumented. Everything else is noise.

### A/B Testing and Experimentation

A/B testing is the most rigorous method for verifying that specific product changes deliver value. By randomly assigning users to treatment (new version) and control (old version) groups and comparing outcomes, A/B tests provide causal evidence that the change caused the observed difference in outcomes.

For value verification, A/B tests should be designed around outcome metrics, not output metrics. Testing whether a new UI increases feature usage (output) is less valuable than testing whether it increases task completion rates (outcome) or reduces time-on-task (outcome). The choice of primary metric for an A/B test is a statement about what the team believes constitutes value delivery.

Netflix's culture of experimentation, documented in their research blog, treats A/B testing as the primary mechanism for verifying that product changes deliver value. Every significant product change is tested before full rollout, and the test results — including negative results — are shared broadly within the organization. This culture makes it harder to rationalize continuing with changes that don't deliver value.

### Continuous Discovery Habits

Teresa Torres's Continuous Discovery Habits framework [3] provides the most detailed methodology for maintaining ongoing contact with users to verify value delivery. The core practices are:

- **Weekly user interviews**: At least one structured conversation with a user per week, focused on the outcomes the tool is supposed to deliver (not on the tool itself).
- **Opportunity mapping**: Continuously updating the Opportunity Solution Tree based on what is learned in user interviews.
- **Assumption testing**: Running small, fast experiments to test the assumptions underlying product decisions before committing to full development.
- **Collaborative decision-making**: Involving the full product trio (product manager, designer, engineer) in discovery, not just the product manager.

The key discipline is that discovery is not a phase that happens before development — it is a continuous practice that runs in parallel with development. Teams that treat discovery as a phase will always be working with outdated information about user needs.

### Flywheel Effects and Compounding Value

Some tools exhibit flywheel effects — conditions in which value delivery compounds over time as the tool learns from usage, users develop expertise, and the tool becomes more deeply integrated into workflows. Detecting and amplifying flywheel effects is one of the highest-leverage activities for teams building AI tools.

The signals of a flywheel effect include: increasing task completion rates over time (as users develop expertise), increasing suggestion acceptance rates over time (as the tool learns from user feedback), and increasing adoption rates driven by organic referral (as users who experience value recommend the tool to colleagues). These signals should be tracked explicitly, not just as part of general engagement metrics.

For AI tools specifically, RLHF (Reinforcement Learning from Human Feedback) creates a potential flywheel: user feedback (thumbs up/down, acceptance/rejection of suggestions) trains the model to generate better outputs, which increases user satisfaction, which increases the quality and quantity of feedback, which further improves the model. This flywheel is only realized if the feedback signals are genuinely connected to value delivery — if users are providing feedback on whether the tool's outputs were useful, not just whether they were syntactically correct or stylistically pleasing.

### Decay Detection

Tools that previously delivered value can stop delivering value without any explicit change to the tool. This happens when: the user population changes (new users who weren't part of the original design target), the problem context changes (the tool was built for a problem that has since been solved or changed), or the competitive context changes (alternative solutions become available that are better than the tool).

Decay detection requires monitoring value metrics over time, not just at a point in time. A tool that had a 70% task completion rate at launch and still has a 70% task completion rate two years later may appear stable, but if the baseline (what users could achieve without the tool) has improved, the tool's relative value has declined.

The most reliable decay signal is the counterfactual: if the tool disappeared tomorrow, what would users lose? If the answer to this question is changing over time — if users are increasingly able to accomplish the same outcomes without the tool — the tool's value is decaying even if its absolute metrics are stable.

### Reinforcement Learning from Human Feedback (RLHF) Feedback Loops and Value Measurement

Reinforcement Learning from Human Feedback (RLHF), the training methodology used by OpenAI, Anthropic, and others to align large language models with human preferences, creates a feedback loop that is structurally similar to the value measurement feedback loops described above. Human evaluators rate model outputs on dimensions including helpfulness, harmlessness, and honesty; these ratings are used to train a reward model; the reward model is used to fine-tune the base model.

The connection to value measurement is direct: the dimensions on which human evaluators rate outputs are, in effect, the value dimensions of the model. If evaluators rate outputs primarily on fluency and coherence rather than on task completion and accuracy, the model will be optimized for fluency and coherence rather than for task completion and accuracy — a Goodhart's Law failure at the training level.

For teams deploying AI tools, the thumbs up/down signals that users provide are a form of RLHF feedback. These signals are only valuable for value measurement if they are connected to genuine value delivery — if users are rating outputs on whether they helped accomplish the task, not just on whether they looked good. Designing the feedback interface to elicit value-relevant signals (e.g., "Did this suggestion help you complete your task?" rather than "Was this suggestion good?") is a non-trivial design challenge.

---

## Section 6 — Specific Frameworks and Case Studies

### Amazon's Working Backwards and PR/FAQ

Amazon's Working Backwards methodology, documented by Colin Bryar and Bill Carr in *Working Backwards* [8], is one of the most rigorous upfront value definition practices in the industry. The PR/FAQ (Press Release / Frequently Asked Questions) document requires teams to articulate, before any development begins:

- Who is the customer and what is their problem?
- What is the solution and how does it work?
- What is the customer experience?
- What are the key metrics of success?
- What are the hardest questions the team will face?

The press release is written as if the product has already launched and is delivering its promised value. This forces teams to be specific about what "success" looks like before they start building. The FAQ addresses the hard questions that teams typically avoid until after launch: How will we know if it's working? What will we measure? What could go wrong?

The PR/FAQ is reviewed by senior leadership before development begins, and the same document is used to evaluate the product after launch. This creates a direct accountability link between the upfront promise and the post-launch reality that is rare in product development.

### Google's OKR System as Value Verification

Google's OKR system [9], introduced by John Doerr in 1999, functions as a value verification mechanism through its quarterly review cadence and public grading. Every quarter, teams grade their OKRs on a 0.0–1.0 scale and present the results to leadership. The grading is public within the organization, which creates accountability. Scoring 0.7 on a key result is considered a success; regularly scoring 1.0 may indicate targets weren't ambitious enough.

The critical discipline of Google's OKR system for value verification is the distinction between activity-based key results ("install software release 10.0") and outcome-based key results ("reduce data quality errors reported to support desk by 30%"). Teams that write activity-based key results can always score 1.0 by doing the work, regardless of whether the work delivered value. Teams that write outcome-based key results are forced to confront whether their work actually moved the needle.

### GitHub Copilot: The 55% Faster Coding Study

The most widely cited study of AI tool value delivery is GitHub's 2022 study of Copilot's impact on developer productivity, which found that developers using Copilot completed a specific coding task 55.8% faster than those who didn't [11]. The study used a randomized controlled trial design: 95 developers were randomly assigned to use Copilot or not, and asked to complete a specific HTTP server implementation task in JavaScript.

The study's strengths are significant: it used a randomized controlled trial (the gold standard for causal inference), it measured a specific, well-defined task (not self-reported productivity), and it was conducted by researchers with a clear methodology.

The study's limitations are equally significant and have been widely discussed:

- **Task specificity**: The task (implementing an HTTP server) is a well-defined, bounded coding task that is particularly well-suited to AI assistance. Real-world development involves much more ambiguous, context-dependent work.
- **Novelty effect**: Developers in the Copilot group may have been more motivated or focused because they were using a new tool.
- **Sample size**: 95 developers is a small sample for a study making broad claims about productivity.
- **Task selection**: The task was chosen by GitHub, which has an obvious interest in positive results.
- **Generalizability**: The 55% figure applies to a specific task type; the generalization to "developers are 55% more productive with Copilot" is not supported by the study.

Subsequent research has produced more mixed results. A 2023 study by researchers at MIT found that AI coding assistants increased productivity for simple, well-defined tasks but had minimal or negative effects on complex, ambiguous tasks. A 2024 analysis by METR (Model Evaluation and Threat Research) found that AI coding assistants provided less productivity benefit than commonly claimed when measured on realistic, complex software engineering tasks.

The GitHub Copilot case illustrates a broader pattern in AI tool value measurement: the most rigorous studies find more modest effects than the marketing claims, and the effects are highly dependent on task type, user expertise, and measurement methodology.

### Spotify's Fail Fast and Shape Up

Spotify's engineering culture, documented in their engineering blog and in Henrik Kniberg's "Spotify Engineering Culture" video series, emphasizes rapid experimentation and honest evaluation of results. The "fail fast" principle is not just a slogan — it is operationalized through short experiment cycles, explicit success criteria defined before experiments begin, and a culture that treats negative results as valuable information.

Basecamp's Shape Up methodology, documented by Ryan Singer in *Shape Up: Stop Running in Circles and Ship Work that Matters* (Basecamp, 2019), provides a complementary approach to value verification. Shape Up's "betting table" — the process by which work is selected for each six-week cycle — requires teams to make explicit bets about what value will be delivered, with the understanding that bets that don't pay off will not be continued. The fixed time horizon (six weeks) creates a natural forcing function for value assessment: at the end of each cycle, the team must honestly evaluate whether the work delivered its promised value.

### Atlassian, Notion, and Slack: Measuring Internal Tool Value

Atlassian's approach to measuring the value of its own internal tools is documented in their team playbook (atlassian.com/team-playbook). They use a combination of OKRs for goal-setting, HEART metrics for user experience measurement, and quarterly health checks for team performance assessment. Atlassian's "Health Monitor" is a structured self-assessment tool that includes "delivering value" as one of eight health dimensions.

Notion's approach to value measurement, documented in their product blog, emphasizes the "jobs to be done" framework as the anchor for product decisions. They measure value through a combination of task completion rates, user retention, and qualitative user research. Notion's product team conducts weekly user interviews (consistent with Teresa Torres's Continuous Discovery Habits framework) to maintain ongoing contact with user needs.

Slack's approach to value measurement is documented in their engineering blog and in academic research on enterprise messaging tools. Slack's North Star Metric — teams reaching a threshold of messages sent — was designed to capture the network effects that drive Slack's value: the tool is only valuable when enough team members are using it to make it the primary communication channel. This metric design reflects a sophisticated understanding of how Slack's value is created.

### Benefits Realization Management (BRM)

The Benefits Realization Management discipline, documented by Steve Jenner in *Managing Benefits: Optimizing the Investment Portfolio* (The Stationery Office, 2012) [10], provides the most formal framework for ensuring that investments deliver their promised benefits. BRM is built on five principles:

1. **Align benefits to strategic objectives**: Every benefit must be traceable to a strategic objective.
2. **Start with the end in mind**: Define benefits before any work begins.
3. **Utilize successful delivery methods**: Use proven delivery methods to maximize the probability of benefit realization.
4. **Integrate benefits realization**: Embed benefits realization into programme and project management processes.
5. **Apply appropriate governance**: Establish governance structures that hold teams accountable for benefit delivery.

The MSP (Managing Successful Programmes) framework from AXELOS incorporates BRM as a core discipline, requiring programme managers to define a Benefits Realization Plan, maintain a Benefits Register, and conduct Benefits Reviews at defined intervals.

### Technology Adoption and Value Realization Frameworks

The Technology Acceptance Model (TAM), developed by Fred Davis in his 1989 doctoral dissertation at MIT Sloan School of Management and published in *MIS Quarterly* [13], provides a theoretical framework for understanding why users adopt or reject technology tools. TAM identifies two primary determinants of adoption: **Perceived Usefulness** (the degree to which a user believes the technology will enhance their job performance) and **Perceived Ease of Use** (the degree to which a user believes the technology will be free of effort). TAM is relevant to value delivery because a tool that is technically capable but perceived as difficult to use will not be adopted, and a tool that is not adopted delivers no value.

The DeLone and McLean IS Success Model, published in *MIS Quarterly* in 1992 and updated in 2003 [14], provides a more comprehensive framework for measuring information system success. The model identifies six dimensions of IS success: System Quality, Information Quality, Service Quality, Use, User Satisfaction, and Net Benefits. The model is particularly relevant to value delivery because it explicitly connects system quality and information quality (outputs) to use and user satisfaction (outcomes) to net benefits (impact).

### Value Stream Mapping for AI/Agent Pipelines

Value Stream Mapping (VSM), originally developed in the Toyota Production System and documented by Mike Rother and John Shook in *Learning to See* (Lean Enterprise Institute, 1998), is a lean management technique for analyzing and designing the flow of materials and information required to bring a product or service to a customer. Applied to AI/agent tool pipelines, VSM can identify where value is created, where waste occurs, and where bottlenecks prevent value delivery.

For an AI agent pipeline, a value stream map might trace the flow from user query to agent response to user action to business outcome, identifying at each step: the time taken, the error rate, the rework required, and the value added. This analysis often reveals that the AI component of the pipeline is not the primary bottleneck — the bottlenecks are in the human processes surrounding the AI (reviewing outputs, correcting errors, integrating results into workflows).

---

## Section 7 — Special Considerations for AI and Agent-Based Tools

### Why AI Tools Are Particularly Prone to the Value Delivery Gap

AI tools face a unique combination of factors that make the value delivery gap more likely and harder to detect than for conventional software tools:

**Non-determinism**: AI tools produce different outputs for the same inputs, making it harder to define and measure "correct" behavior. A conventional software tool either works or it doesn't; an AI tool produces outputs that are probabilistically better or worse, making quality measurement inherently statistical.

**Evaluation difficulty**: The quality of AI outputs is often hard to measure automatically. A code suggestion that compiles is not necessarily a good code suggestion. A document summary that is grammatically correct is not necessarily an accurate or useful summary. Measuring AI output quality typically requires human evaluation, which is expensive and slow.

**Over-claiming**: The marketing of AI tools routinely overstates their capabilities and the value they deliver. This creates a gap between user expectations (set by marketing) and actual performance (measured by use), which manifests as disappointment and abandonment even when the tool is genuinely useful.

**Capability-value gap**: AI tools can be technically impressive without being practically valuable. A tool that can generate sophisticated code but requires expert review to catch subtle errors may not save time overall. A tool that can summarize documents but misses critical nuances may create more work than it saves.

**Behavioral opacity**: AI tools, particularly large language models, are difficult to audit. It is hard to understand why a tool produced a particular output, which makes it hard to diagnose value delivery failures and fix them.

### Eval-Driven Development

Eval-driven development (EDD) is an approach to AI tool development in which evaluations (evals) — structured tests of the tool's performance on specific tasks — are the primary mechanism for verifying that the tool is delivering its promised value. EDD is analogous to test-driven development (TDD) in conventional software engineering: evals are written before the tool is built, and the tool is considered to be working when it passes the evals.

The key discipline of EDD is that evals must be designed to measure value delivery, not just technical performance. An eval that tests whether a code assistant generates syntactically correct code is measuring a technical property; an eval that tests whether the code assistant's suggestions reduce the time to complete a specific task is measuring value delivery.

OpenAI's Evals framework, released publicly in 2023, provides infrastructure for building and running evals for language model applications. Anthropic's model card methodology includes extensive evaluation of model capabilities and limitations. Both approaches emphasize the importance of evaluating models on realistic, diverse tasks rather than on narrow benchmarks.

For agent-based tools, evals are particularly important because the tool's behavior is more complex and harder to predict than for single-turn AI tools. Agent evals must test not just individual actions but multi-step task completion, error recovery, and behavior under adversarial conditions.

### Human Evaluation vs. Automated Metrics

The tension between human evaluation and automated metrics is one of the central challenges of AI tool value measurement. Automated metrics are cheap, fast, and scalable, but they often fail to capture the dimensions of quality that matter most to users. Human evaluation is expensive, slow, and hard to scale, but it captures the nuanced judgments that automated metrics miss.

The most effective approach combines both: automated metrics for continuous monitoring (detecting when something has changed), and human evaluation for periodic deep assessment (understanding whether the changes matter for value delivery). The automated metrics serve as tripwires — when they change unexpectedly, they trigger human evaluation to understand what happened.

For AI tools, the most important automated metrics are typically: task completion rate (did the tool complete the task it was asked to do?), error rate (how often does the tool produce outputs that are wrong or harmful?), and latency (how long does the tool take to respond?). The most important human evaluation dimensions are typically: helpfulness (did the tool's output help the user accomplish their goal?), accuracy (was the tool's output correct?), and safety (did the tool's output avoid harmful content?).

### Measuring Soft Value from AI Tools

Some of the most significant value from AI tools is "soft" — reduced cognitive load, improved decision quality, enhanced creativity, reduced stress. These dimensions of value are real and important, but they are hard to measure with conventional metrics.

Approaches to measuring soft value include:

- **Experience sampling**: Asking users to rate their cognitive load, stress, or confidence at random intervals during their workday, comparing tool-using and non-tool-using periods.
- **Decision quality assessment**: Comparing the quality of decisions made with and without AI assistance, using expert judges to evaluate decision quality.
- **Creative output assessment**: Comparing the quality and quantity of creative outputs produced with and without AI assistance, using expert judges or market outcomes to evaluate quality.
- **Cognitive load measurement**: Using physiological measures (eye tracking, galvanic skin response) or behavioral proxies (error rates, response times) to measure cognitive load.

The challenge is that these measures are expensive, require careful experimental design to be valid, and are hard to integrate into ongoing value monitoring. Most teams rely on self-reported measures (survey questions about cognitive load, confidence, and satisfaction) as proxies, with the understanding that self-reported measures are subject to social desirability bias and recall errors.

### Safety and Trust as Value Dimensions

A tool that is technically capable but not trusted by users delivers no value. Trust is not a soft, optional dimension of AI tool value — it is a prerequisite for value delivery. Users who don't trust a tool will route around it, use it only for low-stakes tasks, or spend more time verifying its outputs than they save by using it.

The cost of non-use is a significant and often unmeasured value delivery failure. When users route around a tool because they don't trust it, the tool's usage metrics may still look reasonable (because some users continue to use it) while its value delivery is near zero (because the users who would benefit most from it have stopped using it). Measuring the cost of non-use requires understanding who is not using the tool and why, which requires qualitative research rather than just quantitative metrics.

Trust in AI tools is built through: consistent performance (the tool does what it says it will do), transparent limitations (the tool is honest about what it can't do), graceful failure (when the tool fails, it fails in ways that are easy to detect and recover from), and appropriate confidence calibration (the tool expresses appropriate uncertainty rather than false confidence).

Anthropic's Constitutional AI approach and OpenAI's model card methodology both address safety as a value dimension, recognizing that a tool that is helpful but unsafe is not delivering genuine value. The EU AI Act (2024) and similar regulatory frameworks are beginning to formalize safety as a legal requirement for AI tools in high-stakes domains.

### Responsible AI Value: Equitable Value Delivery

AI tools frequently deliver value unevenly across user populations. Power users — those with high technical literacy, high domain expertise, and high comfort with AI tools — typically extract significantly more value from AI tools than average users. Users with lower technical literacy, non-native language speakers, and users with disabilities may extract less value or may be actively harmed by AI tools that are not designed with their needs in mind.

Equitable value delivery requires: designing for the full range of users (not just power users), measuring value delivery across user segments (not just in aggregate), and setting explicit goals for equitable value distribution. A tool that delivers 50% productivity improvement for power users and 5% for average users is not delivering equitable value, even if its aggregate productivity improvement looks impressive.

The responsible AI literature, including Google's AI Principles, Microsoft's Responsible AI Standard, and Anthropic's model cards, increasingly addresses equitable value delivery as a core dimension of responsible AI development. Teams building AI tools should explicitly measure value delivery across user segments and set goals for closing gaps.

---

## Section 8 — Practical Recommendations: Step-by-Step Playbook

### Phase 1: Define Value Before Building (Weeks 1–4)

**Step 1: Write a falsifiable value proposition.** Before any development begins, write a value proposition that specifies: who will experience the value, what will change for them, by how much, within what timeframe, and how it will be measured. Use the format: "For [user segment], [tool name] will [specific outcome] by [specific amount] within [specific timeframe], as measured by [specific metric]." If you cannot fill in all five components, you do not yet have a value proposition — you have an aspiration.

**Step 2: Conduct Jobs to be Done (JTBD) research.** Interview at least 10 users about the job they are trying to get done. Use Tony Ulwick's Outcome-Driven Innovation (ODI) methodology [1]: identify the job in solution-free terms, map the job steps using the Universal Job Map, and identify the desired outcomes (the metrics users use to measure success at each step). This research should take 2–3 weeks and should precede any solution design.

**Step 3: Build an Opportunity Solution Tree (OST).** Using Teresa Torres's OST framework [3], map the desired outcome at the top, the opportunities (user needs and pain points) below it, and the potential solutions below those. Do not jump to solutions before mapping opportunities. The OST is a living document — update it as you learn.

**Step 4: Create an Impact Map.** Using Gojko Adzic's Impact Mapping methodology [2], map every planned deliverable to a behavioral impact to a business goal. If a deliverable cannot be mapped to an impact, it should not be built.

**Step 5: Write kill criteria.** Before development begins, define the specific conditions under which the tool will be deprecated, pivoted, or significantly restructured. Document these in a public artifact reviewed by stakeholders outside the building team. Kill criteria should specify: the metric, the threshold, the timeframe, and the consequence.

**Step 6: Define your measurement plan.** Specify the leading indicators, outcome metrics, and impact metrics you will track. Use the HEART framework [6] to ensure you are measuring across multiple dimensions (Happiness, Engagement, Adoption, Retention, Task Success). Use the GSM process to select specific metrics for each dimension. Identify your North Star Metric [7] — the single metric that best captures the value customers derive from the tool.

### Phase 2: Instrument and Baseline (Weeks 4–8)

**Step 7: Instrument for value, not just usage.** Implement instrumentation that captures the specific behaviors that indicate value delivery, not just usage metrics. For each outcome metric in your measurement plan, identify the specific user behaviors that indicate the outcome is being achieved and instrument those behaviors.

**Step 8: Establish baselines.** Before deploying the tool, measure the baseline values of your outcome metrics. This is the counterfactual against which you will measure the tool's impact. For metrics that cannot be measured before deployment (because they require the tool to exist), use pre-deployment user research to establish baseline estimates.

**Step 9: Design your A/B test or quasi-experiment.** If possible, design a randomized controlled trial in which some users get the tool and others don't, and outcomes are compared. If an RCT is not feasible, design a difference-in-differences analysis or another quasi-experimental approach. Document the experimental design before deployment.

### Phase 3: Deploy and Monitor (Weeks 8–24)

**Step 10: Deploy with continuous discovery.** Implement Teresa Torres's Continuous Discovery Habits [3]: conduct at least one structured user interview per week, focused on the outcomes the tool is supposed to deliver. Update the Opportunity Solution Tree based on what you learn.

**Step 11: Monitor leading indicators weekly.** Review leading indicators weekly. If leading indicators are not moving in the expected direction within the first 4–6 weeks, investigate immediately — do not wait for lagging indicators to confirm the problem.

**Step 12: Conduct a value realization review at 90 days.** At 90 days post-deployment, conduct a structured value realization review: restate the value proposition, review the evidence, conduct a gap analysis, identify causes of gaps, and make an explicit decision about whether to continue, pivot, or deprecate.

**Step 13: Implement independent evaluation.** Ensure that the measurement of value delivery is not solely controlled by the team that built the tool. This may mean involving an internal analytics team, an external researcher, or a portfolio governance function.

### Phase 4: Maintain and Govern (Ongoing)

**Step 14: Conduct quarterly value realization reviews.** Continue quarterly value realization reviews for the life of the tool. Each review should include: updated metrics, updated user research, a reassessment of the value proposition against current user needs, and an explicit decision about continued investment.

**Step 15: Monitor for decay.** Track value metrics over time and monitor for decay signals: declining task completion rates, declining user satisfaction, increasing workaround behavior, declining adoption among new users. When decay signals appear, investigate immediately.

**Step 16: Maintain portfolio-level governance.** Ensure that the tool is evaluated in the context of the broader portfolio of tools. Are there other tools that deliver similar value more efficiently? Are there tools in the portfolio that should be sunset to free up resources for higher-value investments?

**Step 17: For AI tools — implement eval-driven development.** Maintain a suite of evals that test the tool's performance on the specific tasks it is supposed to help with. Run evals after every significant model update or tool change. When evals degrade, investigate before deploying the change.

---

## Section 9 — Key Tensions and Open Problems

### The Causation Problem

The most fundamental open problem in value measurement is proving that a tool caused an observed outcome rather than merely correlating with it. Randomized controlled trials are the gold standard, but they are often not feasible for internal tools (where random assignment is organizationally difficult) or for AI tools (where the tool's behavior changes over time, making it hard to maintain a stable treatment condition). Quasi-experimental methods provide reasonable approximations but require strong assumptions that are often violated in practice.

The GitHub Copilot study [11] illustrates both the power and the limitations of rigorous causal measurement: the RCT design provides credible causal evidence, but the narrow task definition limits generalizability. Most AI tool value claims are based on much weaker evidence — self-reported productivity improvements, before-after comparisons without controls, or correlational analyses. The field needs better methods for causal value measurement in realistic, complex settings.

### The Measurement-Gaming Tension

Goodhart's Law [5] creates a fundamental tension in value measurement: any metric that is used to evaluate a tool will eventually be gamed, either by the tool (if it is optimized for the metric) or by the team (if their performance is evaluated on the metric). The countermeasure — using multiple metrics that create healthy tension — helps but does not fully resolve the tension. As measurement systems become more sophisticated, so do the strategies for gaming them.

For AI tools specifically, this tension is acute: RLHF feedback loops can be gamed by users who learn that certain types of feedback produce outputs they prefer, regardless of whether those outputs are genuinely valuable. The field is actively researching more robust feedback mechanisms, but no fully satisfactory solution exists as of July 2026.

### The Soft Value Problem

Many of the most significant benefits of AI tools — reduced cognitive load, improved decision quality, enhanced creativity, reduced stress — are genuinely difficult to measure. The measurement approaches that exist (experience sampling, expert judgment, physiological measures) are expensive, slow, and hard to scale. The result is that soft value is systematically underweighted in value assessments, which biases investment decisions toward tools that deliver easily measurable value (cost savings, time savings) and against tools that deliver hard-to-measure value (quality improvements, capability enhancements).

This is not just a measurement problem — it is an organizational problem. Organizations that can only measure and reward easily quantifiable value will systematically underinvest in tools that deliver qualitative value. Developing better methods for measuring soft value is one of the most important open problems in the field.

### The Organizational Politics Problem

The most rigorous value measurement framework in the world will fail if the organizational culture does not support honest reckoning with negative results. In most organizations, stopping a project is career-limiting, negative findings are suppressed or reframed, and the team that built a tool is also the team that measures its value. These dynamics are not unique to AI tools — they are endemic to product development — but they are particularly acute for AI tools because the tools are expensive to build, the value claims are hard to verify, and the organizational enthusiasm for AI is high.

The structural countermeasures — kill criteria, independent evaluation, portfolio governance — help but do not fully resolve the problem. Ultimately, honest value assessment requires organizational cultures that treat stopping as a legitimate outcome, negative findings as valuable information, and independent evaluation as a sign of rigor rather than distrust. Building these cultures is a leadership challenge, not a measurement challenge.

### The Equity Problem

As noted in Section 7, AI tools frequently deliver value unevenly across user populations. The equity problem is not just a fairness concern — it is a value measurement problem. If value is measured in aggregate, tools that deliver high value to power users and low value to average users will appear more valuable than they are for the median user. Disaggregating value measurement by user segment is technically straightforward but organizationally difficult — it requires acknowledging that the tool is not working for some users, which creates pressure to address the gap.

The field lacks consensus on how to weight value across user segments. Should a tool that delivers 50% productivity improvement for 20% of users and 5% for 80% of users be considered more or less valuable than a tool that delivers 15% improvement for all users? The answer depends on organizational values and priorities, but most current value measurement frameworks do not make this trade-off explicit.

### The Temporal Problem

Value delivery is not static — tools that deliver value today may not deliver value tomorrow, and tools that don't deliver value today may deliver value in the future as users develop expertise, the tool improves, or the problem context changes. Current value measurement frameworks are largely static: they measure value at a point in time or over a defined period, but they do not model how value delivery changes over time.

The decay detection approaches described in Section 5 address part of this problem, but the field lacks robust frameworks for modeling the temporal dynamics of value delivery. This is particularly important for AI tools, where the tool's capabilities are improving rapidly and the user population's expectations and expertise are also changing rapidly.

### The Multi-Stakeholder Problem

Tools typically serve multiple stakeholders with different value expectations: end users (who want the tool to help them accomplish their tasks), managers (who want the tool to improve team productivity), executives (who want the tool to deliver business results), and IT/security teams (who want the tool to be secure and compliant). These stakeholders may have conflicting value definitions, and optimizing for one stakeholder's value may reduce value for another.

Current value measurement frameworks typically focus on a single primary stakeholder (usually the end user or the business). The field needs better frameworks for measuring and balancing value across multiple stakeholders, particularly for internal tools where the power dynamics between stakeholders are complex.

---

## Full Bibliography / References

### Sources

[1] Strategyn — Jobs to be Done / Outcome-Driven Innovation (Tony Ulwick): https://strategyn.com/jobs-to-be-done/

[2] Gojko Adzic — Impact Mapping (official site): https://www.impactmapping.org/

[3] Teresa Torres — Continuous Discovery Habits / Opportunity Solution Trees: https://www.producttalk.org/opportunity-solution-tree/

[4] Eric Ries — The Lean Startup (Crown Business, 2011): https://theleanstartup.com/

[5] ModelThinkers — Goodhart's Law: https://modelthinkers.com/mental-model/goodharts-law

[6] Kerry Rodden, Hilary Hutchinson, Xin Fu — "Measuring the User Experience on a Large Scale: User-Centered Metrics for Web Applications," CHI 2010, ACM Press: https://research.google/pubs/measuring-the-user-experience-on-a-large-scale-user-centered-metrics-for-web-applications/

[7] Amplitude — North Star Metric (Julia Sholtz, Mallory Busch): https://amplitude.com/blog/north-star-metric

[8] Colin Bryar and Bill Carr — *Working Backwards: Insights, Stories, and Secrets from Inside Amazon* (St. Martin's Press, 2021): https://www.workingbackwards.com/

[9] John Doerr — *Measure What Matters* / WhatMatters.com: https://www.whatmatters.com/faqs/okr-meaning-definition-example

[10] Steve Jenner — *Managing Benefits: Optimizing the Investment Portfolio* (The Stationery Office / APMG International, 2012): https://www.apmg-international.com/product/managing-benefits

[11] GitHub — "Research: quantifying GitHub Copilot's impact on developer productivity and happiness" (Sida Peng et al., 2022): https://github.blog/news-insights/research/research-quantifying-github-copilots-impact-on-developer-productivity-and-happiness/

[12] Dave McClure — AARRR Pirate Metrics (500 Startups, 2007): https://www.slideshare.net/dmc500hats/startup-metrics-for-pirates-long-version

[13] Fred D. Davis — "Perceived Usefulness, Perceived Ease of Use, and User Acceptance of Information Technology," *MIS Quarterly*, Vol. 13, No. 3, 1989: https://doi.org/10.2307/249008

[14] William H. DeLone and Ephraim R. McLean — "The DeLone and McLean Model of Information Systems Success: A Ten-Year Update," *Journal of Management Information Systems*, Vol. 19, No. 4, 2003: https://doi.org/10.1080/07421222.2003.11045748

[15] Doc Norton — *Escape Velocity* (referenced in Goodhart's Law discussion): https://www.docnorton.com/

[16] Atlassian — OKRs and Agile: https://www.atlassian.com/agile/agile-at-scale/okr

[17] Amplitude — North Star Playbook: https://amplitude.com/north-star

[18] Agile-Minds.com — HEART Framework and PULSE comparison: https://www.agile-minds.com/heart-framework/

[19] ProdWrks.com — HEART Framework implementation guide: https://prodwrks.com/heart-framework/

[20] Gojko.net — Impact Mapping book reviews and resources: https://gojko.net/books/impact-mapping/

[21] FourWeekMBA — AARRR Pirate Metrics: https://fourweekmba.com/aarrr/

[22] Eleken.co — AARRR framework for SaaS: https://www.eleken.co/blog-posts/aarrr-metrics

[23] ProductPlan — Opportunity Solution Trees: https://www.productplan.com/glossary/opportunity-solution-tree/

[24] Shortform — Continuous Discovery Habits summary: https://www.shortform.com/blog/opportunity-solution-tree/

[25] WhatMatters.com — OKR framework (John Doerr): https://www.whatmatters.com/

[26] Asana — OKRs guide: https://asana.com/resources/okr-meaning

[27] BMC Blog — Goodhart's Law in software (Jonathan Johnson, 2020): https://www.bmc.com/blogs/goodharts-law/

[28] Mike Rother and John Shook — *Learning to See: Value Stream Mapping to Add Value and Eliminate Muda* (Lean Enterprise Institute, 1998): https://www.lean.org/store/book/learning-to-see/

[29] Ryan Singer — *Shape Up: Stop Running in Circles and Ship Work that Matters* (Basecamp, 2019): https://basecamp.com/shapeup

[30] OpenAI — Evals framework (GitHub): https://github.com/openai/evals

[31] Anthropic — Model Card methodology: https://www.anthropic.com/model-card

[32] AXELOS — MSP (Managing Successful Programmes) framework: https://www.axelos.com/certifications/msp-project-management/what-is-msp

[33] Henrik Kniberg — Spotify Engineering Culture (video series): https://engineering.atspotify.com/2014/03/spotify-engineering-culture-part-1/

[34] Teresa Torres — *Continuous Discovery Habits* (Product Talk LLC, 2021): https://www.producttalk.org/2021/05/continuous-discovery-habits/

[35] Strategyzer — Experiment Card / Value Proposition Canvas: https://www.strategyzer.com/

[36] METR — AI Coding Assistant Evaluation Research (2024): https://metr.org/

[37] Umbrex.com — HEART Framework 10-step implementation: https://umbrex.com/resources/heart-framework/