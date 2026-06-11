# MCP Agent Automation - Playwright Project

This repository contains a Playwright-based automation testing framework for MCP Agent testing, along with Claude AI skills used to accelerate and enhance the QA workflow.

---

## 📁 Project Structure

- `tests/` - Playwright test files (`*.spec.ts`)
- `playwright.config.ts` - Playwright configuration
- `package.json` - Project dependencies and scripts
- `claude/` - Claude AI skills for AI-assisted test design and QA automation

---

## 🤖 Claude Skills (`claude/`)

### Test Designer v1.8 (`claude/SKILL.md`)

**Test Designer v1.8** is a Claude AI skill built specifically for the **MCP Agent Automation** project. It integrates with **Atlassian Jira and Confluence** via the **Atlassian Rovo MCP connector** to automate the full QA test design workflow — from reading a Jira requirement ticket through to generating Xray-ready CSV test artifacts.

#### What it does

Given a Jira ticket key (e.g. `PFX-12645`), Test Designer v1.8 automatically:

1. **Fetches the full Jira ticket** — description, acceptance criteria, notes to testers, comments, assignee, squad, sprint, linked tickets, subtasks, and defects
2. **Reads linked Confluence pages** — spikes, design docs, test strategies, release notes, and product documentation
3. **Builds a working knowledge base** — summarising the requirement, impacted areas, actors, preconditions, flows, and open questions
4. **Lists explicit requirements** — each assigned a traceable ID (e.g. `RQ-12645-01`) sourced directly from Jira evidence
5. **Produces an impact analysis** — covering impacted areas, dependencies, data considerations, permissions, UI/API contracts, and risks
6. **Generates Gherkin test cases** — positive, negative, and regression scenarios using the `TC-[ticket]-###` numbering convention
7. **Produces a Requirement Traceability Matrix** — mapping every requirement to its test cases and source evidence
8. **Exports an Xray-ready CSV** — formatted for direct import into Xray for Jira, with correct quoting, folder paths, assignee, squad, and sprint values

#### Who it's built for

This skill is designed for QA engineers and test leads working on the **MCP Agent Automation** Playwright project who use **Jira + Confluence + Xray** as their test management stack.

#### How to trigger it

Install the skill in Claude.ai, then use any of these prompts:

```
Use Test Designer v1.8 for PFX-12645
```
```
https://captureagency.atlassian.net/browse/PFX-12645
```
```
Generate test cases and Xray CSV for PFX-12645, Sprint 158
```

#### Prerequisites

- Claude.ai account with the **Atlassian Rovo MCP connector** connected
- Access to the relevant Jira project and Confluence space
- Xray for Jira (for CSV import)

#### Output artifacts

| Artifact | Description |
|---|---|
| Working knowledge base | Structured summary of requirement, scope, actors, flows |
| Explicit requirements | Traceable requirement list with IDs and source evidence |
| Impact analysis | Impacted areas, dependencies, risks, open questions |
| Gherkin test cases | Core positive/negative + regression scenarios |
| Traceability matrix | Full REQ → TC mapping with scenario type and source |
| Xray CSV | Ready-to-import CSV formatted for Xray for Jira |

---

## 🛠️ Playwright Setup

### Installation

```bash
npm install
```

### Running Tests

```bash
# Run all tests
npm test

# Run in UI mode
npm run test:ui

# Run in headed mode
npm run test:headed

# Debug tests
npm run test:debug

# Generate tests with Codegen
npm run codegen
```

### Configuration

Edit `playwright.config.ts` to customise:
- Browser types (Chromium, Firefox, WebKit)
- Test retries and parallelisation
- Base URL
