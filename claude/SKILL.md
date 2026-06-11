---
name: test-designer-v1-8
description: analyze a jira requirement ticket using atlassian rovo mcp connector tools and produce qa impact analysis, explicit requirements, gherkin test cases, regression coverage, a requirement traceability matrix, and xray-ready csv import artifacts. use when the user provides a jira ticket url or key and asks for qa analysis, test cases, regression coverage, xray import csv, or test design from jira/confluence context.
---

# Test Designer v1.8

## Trigger summary

Use this skill when:
- User provides a Jira ticket URL or Jira key.
- User asks for QA analysis, test cases, Gherkin scenarios, regression coverage, requirement traceability, or Xray import output.
- User uses a short prompt such as `Use Test Designer v1.8 for PFX-12645`. Treat this as a request to run the full workflow, including Xray-ready CSV generation.

## Overview

Use this skill to build a requirements understanding from Jira and Confluence context, then produce explicit requirements, impact analysis, Gherkin test cases, regression test cases, a requirement traceability matrix, and Xray-ready CSV import artifacts.

The user typically provides a Jira URL or key such as `https://captureagency.atlassian.net/browse/PFX-12645` or `PFX-12645`.

The user may provide a Sprint/Cycle name, but the skill must support the minimal prompt `Use Test Designer v1.8 for PFX-12645` without asking for Squad. Pull Squad from Jira.

## Atlassian tool guard

Before attempting Jira or Confluence retrieval, check whether Atlassian Rovo MCP tools are available.

If Atlassian Rovo MCP tools are unavailable, inform the user and stop execution. Do not proceed using assumptions, stale context, or only the user-provided ticket key.

## Operating principles

- Use Atlassian Rovo MCP connector tools as the source of truth for Jira and Confluence content.
- Do not rely only on the ticket title, description, or user summary when connector access is available.
- Do not invent requirements, acceptance criteria, tester notes, linked pages, dependencies, squad names, defects, or sprint/cycle names.
- List explicit requirements based only on the source evidence retrieved from the Jira ticket, comments, notes, linked tickets, and linked Confluence pages.
- Capture uncertainty explicitly when a field, linked page, linked ticket, squad, or tester note cannot be accessed.
- Maintain a working knowledge base in the active conversation: summarize what was learned, reuse it in later turns, and update it when new Jira or Confluence context is read.
- Do not claim persistent memory across unrelated conversations unless an explicit persistent memory or storage tool is available.

## Workflow

### 1. Parse user input

Extract the Jira key from the user input.

Examples:
- `https://captureagency.atlassian.net/browse/PFX-12645` -> `PFX-12645`
- `PFX-12645` -> `PFX-12645`

If the input contains multiple Jira keys, treat the first one as the core requirement and the others as supporting context unless the user specifies otherwise.

Treat `Use Test Designer v1.8 for <Jira key>` and `Use Test Designer v1.7 for <Jira key>` as sufficient input to start the full workflow. If the prompt includes a Sprint/Cycle name, extract it. If Sprint/Cycle is not provided, try to read it from Jira. If Jira Sprint/Cycle is empty or `None`, continue and generate CSV using `No Sprint` as the Sprint/Cycle folder segment rather than stopping the workflow.

Never ask the user for Squad before attempting to read it from Jira. The Jira issue may show Squad in the Details panel; fetch enough Jira fields and metadata to locate a field named `Squad`, including custom fields.

### 2. Discover and use Atlassian tools

Use the Atlassian Rovo MCP connector tools to retrieve Jira and Confluence information.

At minimum, attempt to retrieve:
- Core Jira issue fields: key, title, status, type, priority, assignee, reporter, components, labels, fix versions, sprint, epic, parent, squad, and description.
- Acceptance Criteria.
- Notes to testers or QA notes.
- All Jira comments, preserving author/date where available.
- Attachments or embedded links when their text is accessible through the connector.
- Linked Confluence pages, especially spikes, analysis notes, technical design, test strategy, release notes, or product docs.
- Subtasks and child issues.
- Linked work items, including blocks/is blocked by, relates to, clones, duplicates, depends on, tests, implements, or similar link types.
- Defects/bugs associated with the requirement.
- Epic or parent context.

When the exact connector tool names or schemas are unknown, first inspect available MCP resources/tools, then call the relevant Jira and Confluence read/search tools. Prefer direct issue/page retrieval over broad search when the key or URL is known.

### Jira field extraction requirements

When retrieving the Jira ticket, fetch enough fields and metadata to identify custom fields by display name. At minimum, request Jira field names/schema/metadata or fetch all accessible fields when supported.

For Squad:
- Search retrieved fields for a display name exactly matching `Squad`.
- Also inspect rendered fields and custom field mappings because Jira may expose Squad as a custom field such as `customfield_#####`.
- Use the visible Jira Details panel value when available, for example `Apollo`.
- Do not ask the user for Squad if the value is present in Jira.

For Assignee:
- Use the current Jira assignee from the requirement ticket.
- If the Jira assignee field is empty, null, or unset, use the literal value `Unassigned` (not blank, not empty string).

For Sprint/Cycle:
- Prefer a user-provided Sprint/Cycle value.
- If absent, use Jira Sprint/Cycle if populated.
- If Jira says Sprint is `None` or the value is missing, use `No Sprint` in the Test Folder Location rather than blocking CSV generation.

### 3. Build the working knowledge base

Create and maintain a concise knowledge base in the response or conversation context. Structure it like this:

```markdown
## Working knowledge base

### Core requirement
- Jira: [key] - [summary]
- Goal:
- Business/user outcome:
- Scope:
- Out of scope:
- Current status:
- Assignee:
- Squad:

### Source evidence
- Requirement description:
- Acceptance Criteria:
- Notes to testers:
- Comments:
- Linked Confluence pages:
- Related Jira tickets:

### Functional understanding
- Actors/personas:
- Preconditions:
- Main flows:
- Alternate/error flows:
- Data, permissions, integrations:
- UI/API/reporting touchpoints:

### Risks and assumptions
- Confirmed risks:
- Open questions:
- Assumptions made due to missing source data:
```

Update this knowledge base whenever new linked tickets, comments, pages, defects, or user clarifications are provided.

### 4. List explicit requirements

Before impact analysis or test generation, list the requirements explicitly based on the retrieved requirement ticket and supporting evidence. Do not assume any requirement.

Use requirement IDs such as `RQ-<ticket-number>-01`, `RQ-<ticket-number>-02`, etc.

Use this format:

```markdown
## Explicit requirements

| Requirement ID | Requirement | Source | Evidence summary |
|---|---|---|---|
| RQ-12645-01 | [requirement text] | Acceptance Criteria | [brief evidence] |
```

### 5. Analyze related Jira and Confluence context

For each related item, decide how it affects the core requirement:

- **Subtasks**: implementation details, component ownership, changed areas, partial scope.
- **Linked work items**: dependencies, blockers, impacted flows, upstream/downstream changes.
- **Defects**: known regressions, edge cases, historical failure modes, areas needing defensive tests.
- **Epic/parent**: broader business intent, rollout assumptions, cross-feature dependencies.
- **Spikes/Confluence pages**: design decisions, constraints, architectural approach, rejected options, QA guidance.

Summarize each related item only to the level needed for test design and impact analysis.

### 6. Perform impact analysis

Produce an impact analysis with these sections:

```markdown
## Impact analysis

### Summary
[Concise explanation of the requirement and likely impact]

### Impacted areas
| Area | Impact | Evidence/source | Test focus |
|---|---|---|---|

### Dependencies and integrations
| Dependency | Direction | Impact | Validation needed |
|---|---:|---|---|

### Data and migration considerations
[Data setup, data compatibility, audit/logging, migration, cleanup, reporting]

### Permissions, roles, and access
[Role-based behavior and security-relevant checks]

### UI/API/contract impact
[Impacted screens, endpoints, events, schemas, validation messages]

### Risks
| Risk | Why it matters | Mitigation/test coverage |
|---|---|---|

### Open questions
[Questions that block or limit confidence]
```

### 7. Generate Gherkin test cases

Generate Gherkin test cases for the core requirement. Include positive and negative cases, then regression cases to prove the requirement is safe.

#### Mandatory visible test case output

Always display every generated Gherkin test case in the chat window before producing Xray CSV, XLSX, summaries, or downloadable artifacts.

The same exact scenarios used for the downloadable CSV file must be printed visibly in chat. Do not create one set of scenarios for chat and a different set for CSV.

Do not replace visible Gherkin test cases with:
- coverage summaries only;
- generated file links only;
- CSV-only output;
- an Xray import summary;
- a statement that artifacts were generated.

For every generated test case, print:
- Test Case ID;
- Title Description;
- full Gherkin scenario;
- REQ mapping.

Only after all visible core and regression test cases are printed may the skill generate:
- Requirement Traceability Matrix;
- Xray CSV plain-text block;
- downloadable CSV file.

Rules:
- Use the explicit requirements list as the source of truth.
- Keep one behavior per test case.
- Make data values concrete when the requirement provides them; otherwise use clear placeholders.
- Include technical values, flags, endpoints, roles, statuses, environments, or configuration keys where they are important.
- Do not generate test cases from assumptions unless clearly marked as assumption-based and included in open questions.
- Continue numbering sequentially from `TC-[ticket-number]-001`.
- Display the test cases in chat first before generating any Xray CSV artifact.

Use this exact format:

```markdown
TC-[ticket-number]-001

Title Description: [clear test case title]

```gherkin
Scenario: [scenario name]
  Given [precondition or setup]
  And [additional context if needed]
  When [user action, system event, or condition]
  Then [expected result]
  And [additional expected result if needed]
```

REQ: [requirement ID]
```

Example:

```markdown
TC-12660-011

Title Description: Override is ignored in protected environments

```gherkin
Scenario: Override is ignored in staging or production environments
  Given a deployment in a protected environment matching uk-prod, us-prod, uk-staging, or us-staging
  And FEATURE_FLAG_OVERRIDES includes a valid flag key
  When backend feature flag evaluation runs
  Then the override must not be applied
  And ENV_OVERRIDE must not be returned
```

REQ: RQ-12660-06
```

### 8. Generate regression test cases

Generate regression tests to prove the change is safe across related areas.

Include regression tests for:
- Existing happy-path flows around the impacted component.
- Previously reported defects linked to or similar to the requirement.
- Upstream/downstream integrations.
- Existing roles and permissions.
- Data creation, update, delete, search, reporting, and audit behavior when relevant.
- Feature toggles, configuration, rollout, or backward compatibility when present.
- Edge cases suggested by Jira comments, tester notes, subtasks, defects, or spike pages.

Use the same test case format as the core requirement tests and continue the same `TC-[ticket-number]-###` numbering sequence.

### 9. Produce the requirement traceability matrix

Create a full traceability matrix that maps each explicit requirement and finding to generated tests.

Use this exact format:

```markdown
## Requirement traceability matrix

| Requirement ID | Requirement Summary | Test Case ID | Title Description | Scenario Type: Positive / Negative / Regression | Coverage Area | Source: Acceptance Criteria / Comment / Notes to Testers / Linked Ticket / Confluence Spike |
|---|---|---|---|---|---|---|
```

Status values are not required in this v1.8 matrix. The matrix must align with the Xray CSV export: the `Requirement ID` values in the matrix become the `Acceptance Criteria` values in the CSV.

## Xray CSV export

After generating and displaying every core and regression Gherkin test case in chat, reuse the same generated test cases to create Xray-ready CSV output when the user asks for Xray output or when Xray CSV generation is part of the workflow.

Do not generate a different set of tests for the CSV. The CSV must be a formatted export of the same exact test cases already shown to the user in the chat window.

### CSV format specification (critical — read carefully)

The CSV format must exactly match the following rules. Deviating from these rules will cause Xray import failures.

#### Header row

Write the header row with NO quotes around any header name:

```
Issue Id,Acceptance Criteria,Test Summary,Test Description,Test Type,Assignee,Tests,Squad,Test Folder Location
```

Do NOT write:
```
"Issue Id","Acceptance Criteria","Test Summary","Test Description","Test Type","Assignee","Tests","Squad","Test Folder Location"
```

#### Data rows — quoting rules

Apply quotes ONLY when a cell value contains a comma, a newline character, or a double-quote character. For all other cells, write the value with NO surrounding quotes.

| Column | Quoted? | Reason |
|---|---|---|
| Issue Id | Never | Plain integer |
| Acceptance Criteria | Only if it contains a comma (rare) | Usually unquoted e.g. `RQ-12566-01` or `RQ-12566-01;RQ-12566-02` |
| Test Summary | Only if it contains a comma | Usually unquoted |
| Test Description | Always | Contains newlines (Gherkin is multiline) |
| Test Type | Never | Always the literal word `Manual` |
| Assignee | Never | Plain text or `Unassigned` |
| Tests | Never | Plain Jira key e.g. `PFX-12566` |
| Squad | Never | Plain text e.g. `Apollo` |
| Test Folder Location | Never | Plain path e.g. `Plan-Apps/No Sprint/Apollo/PFX-12566` |

#### Correct example data row

```
1,RQ-12566-01,TC-12566-001_Commit selected suggestion populates a campaign plan,"Scenario: Committing a selected suggestion populates the campaign plan;

Given a user has a selected Smart Planning suggestion;
And the target plan does not already contain activities;
When the commit suggestion endpoint is called;
Then the campaign plan is populated with the selected touchpoints and configuration;
And the response indicates success;",Manual,Unassigned,PFX-12566,Apollo,Plan-Apps/No Sprint/Apollo/PFX-12566
```

Note what is NOT quoted: `1`, `RQ-12566-01`, `TC-12566-001_...`, `Manual`, `Unassigned`, `PFX-12566`, `Apollo`, `Plan-Apps/No Sprint/Apollo/PFX-12566`.

Note what IS quoted: the full `Test Description` cell because it spans multiple lines.

#### Gherkin in Test Description

- Do NOT add semicolons (`;`) at the end of Gherkin lines unless the source scenario already contains them.
- Each Gherkin line (Scenario:, Given, And, When, Then) goes on its own line inside the quoted cell.
- Insert one blank line between the `Scenario:` line and the first `Given` step.
- The closing `"` of the cell appears immediately after the last Gherkin line with no trailing newline.

Correct Test Description cell content (inside the surrounding quotes):

```
Scenario: Committing a selected suggestion populates the campaign plan

Given a user has a selected Smart Planning suggestion
And the target plan does not already contain activities
When the commit suggestion endpoint is called
Then the campaign plan is populated with the selected touchpoints and configuration
And the response indicates success
```

#### Assignee column rules

- If the Jira ticket has a named assignee, use that name verbatim.
- If the Jira ticket assignee is empty, null, or unset, write the literal text `Unassigned` (not an empty string, not `""`, not blank).

#### Final CSV output rules

- Return the CSV as plain text in a single CSV code block.
- Also create a downloadable `.csv` file for the user whenever file generation tools are available.
- Include the header row followed by one test case per CSV row.
- The header row must have NO quotes on any column name.
- Simple value columns (all except Test Description) must have NO surrounding quotes unless the value itself contains a comma or newline.
- The Test Description column must always be quoted because it is multiline.
- Do not add semicolons to Gherkin lines.
- Do not add extra explanations after the CSV block.
- Preserve CSV validity: double-quote any `"` character inside a quoted cell by writing it as `""`.
- Use the existing `importConfigurationGherkinManual.json` config for Xray import.

### CSV header column order

1. `Issue Id`
2. `Acceptance Criteria`
3. `Test Summary`
4. `Test Description`
5. `Test Type`
6. `Assignee`
7. `Tests`
8. `Squad`
9. `Test Folder Location`

### Column value rules

- `Issue Id`: numeric incremental value starting from `1`. Never quoted.
- `Acceptance Criteria`: use the traceability/requirement ID generated by this skill, e.g. `RQ-12645-01`. If a test maps to multiple requirements, join them using `;` with no spaces, e.g. `RQ-12566-01;RQ-12566-02`. Only quote if value contains a comma.
- `Test Summary`: prefix the generated test case ID to the one-line test title using an underscore, e.g. `TC-12645-001_Inline warning is visible when the Plan Attributes drawer opens`. Only quote if value contains a comma.
- `Test Description`: use the full Gherkin scenario. Always quoted. No semicolons on Gherkin lines. Blank line after `Scenario:` line. Each step on its own line.
- `Test Type`: always the literal word `Manual`. Never quoted.
- `Assignee`: use the Jira ticket assignee name. If unset, write `Unassigned`. Never quoted.
- `Tests`: use the requirement ticket key provided by the user, e.g. `PFX-12645`. Never quoted.
- `Squad`: pull from the Jira requirement ticket or linked Jira context. Look for a field named `Squad` in Jira fields, rendered fields, names/schema metadata, or custom fields. Do not ask the user for Squad unless every Jira retrieval attempt fails to expose it. Never quoted.
- `Test Folder Location`: build using the rule below. Never quoted.

### Xray test folder location rule

Build `Test Folder Location` using this exact pattern:

`Plan-Apps/<Sprint or Cycle>/<Squad>/<Ticket>`

Derive each value as follows:
- `Plan-Apps`: always use this constant value.
- `<Sprint or Cycle>`: use the user-provided value when present; otherwise use the Jira Sprint/Cycle field when present; otherwise use `No Sprint` so the workflow can still produce CSV output from a minimal prompt.
- `<Squad>`: pull from the Jira requirement ticket or linked Jira context, especially the Jira Details field named `Squad`.
- `<Ticket>`: use the Jira requirement ticket key provided by the user.

If the user has not provided Sprint/Cycle and Jira does not contain a Sprint/Cycle value, do not stop or ask for Sprint/Cycle. Use `No Sprint` in the folder path and continue to generate the downloadable CSV artifact.

Example:
- User input ticket: `PFX-11803`
- User input Sprint/Cycle: `Sprint 158`
- Jira Squad: `Apollo`
- Test Folder Location: `Plan-Apps/Sprint 158/Apollo/PFX-11803`

### Xray import steps

When providing the final Xray CSV output, include these steps before the CSV block:

1. Copy CSV output.
2. Save as `.csv` file.
3. Use existing JSON config.
4. Import into Xray.

After these steps, output the CSV block and do not add any extra explanations after the CSV block.

### Xray export validation

Before returning CSV output, validate:
- Header row has NO quotes on any column name.
- Every row has a numeric `Issue Id` with no surrounding quotes.
- `Issue Id` values are incremental starting from `1`.
- Every row has `Acceptance Criteria` coverage, unquoted unless it contains a comma.
- Every `Test Summary` is populated and prefixed with the generated Test Case ID using an underscore, unquoted unless it contains a comma.
- Every `Test Description` contains the matching Gherkin scenario shown in chat, always quoted, with NO semicolons added to Gherkin lines, and a blank line after the `Scenario:` line.
- `Test Type` is exactly `Manual` for every row, never quoted.
- `Assignee` is the Jira assignee name or `Unassigned` (never blank, never quoted).
- `Tests` is the input requirement Jira key, never quoted.
- `Squad` is the Jira squad value, never quoted.
- `Test Folder Location` follows `Plan-Apps/<Sprint or Cycle>/<Squad>/<Ticket>`, never quoted.
- The downloadable CSV remains valid CSV, with multiline `Test Description` values correctly quoted.
- No extra explanations appear after the final CSV block.

### Xray export script

When helper-based CSV generation is requested, use `scripts/generate_xray_import.py` if available. The script must:
- Write the header row with NO quotes.
- Write simple value columns with NO quotes.
- Write `Test Description` with surrounding quotes (always multiline).
- NOT add semicolons to Gherkin lines.
- Write `Unassigned` when assignee is empty.

Prepare an input JSON file containing the generated tests, then run:

```bash
python scripts/generate_xray_import.py \
  --input /path/to/test_cases.json \
  --ticket PFX-12645 \
  --sprint "Sprint 158" \
  --squad "Apollo" \
  --assignee "Assignee Name" \
  --outdir /mnt/data
```

Input JSON format:

```json
[
  {
    "id": "TC-12645-001",
    "acceptance_criteria": "RQ-12645-01",
    "title": "Inline warning is displayed when plan attributes drawer opens",
    "gherkin": "Scenario: Inline warning is visible...\n\nGiven ...\nWhen ...\nThen ..."
  }
]
```

The script writes a valid downloadable CSV, optional XLSX, copied import configuration JSON, and a validation summary. The downloadable CSV uses quoted multiline `Test Description` cells and unquoted simple value cells. When the user needs final Xray output in chat, paste the CSV contents as plain text and do not add any explanation after the CSV block.

## Final answer structure

Unless the user asks for a different format, respond with:

1. `## Working knowledge base`
2. `## Explicit requirements`
3. `## Impact analysis`
4. `## Core requirement Gherkin scenarios`
5. `## Regression test cases`
6. `## Requirement traceability matrix`
7. `## Xray import steps` when CSV output is requested
8. A downloadable CSV file link when file generation tools are available
9. A final plain-text CSV code block when CSV output is requested

When final CSV output is provided, the CSV code block must be the last content in the response. Put any download link, open questions, assumptions, or warnings before the CSV block. Do not add `Open questions and assumptions` or any other explanation after the CSV block.

Keep the output detailed enough for QA/test planning, but avoid excessive repetition from Jira or Confluence sources.
