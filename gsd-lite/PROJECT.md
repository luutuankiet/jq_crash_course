# jq Master: Question Bank Manager

*Initialized: 2026-02-03*

## What This Is

A context-efficient management layer for the jq Master question bank (currently 126 questions across 18 categories). The system enables agents and humans to query, add, edit, and audit questions **without loading the entire dataset into memory** — proving the very jq/yq philosophy the playground teaches.

The project addresses a meta-problem: the tool that teaches efficient JSON querying was itself suffering from inefficient context management. Adding a single question required reading 140KB of raw JSON, causing agent context overflow and hallucinations.

## Core Value

**Agents can interact with the question bank surgically — querying metadata, adding validated questions, and auditing drift — without ever loading the full dataset into context.**

## Success Criteria

Project succeeds when:

- [ ] A manifest file (`questions-manifest.json`) provides category counts and question IDs without full data load
- [ ] Categories are defined as an enum — new questions must match existing categories exactly
- [ ] Adding a question validates against schema (category enum, narrative min length, required fields)
- [ ] An agent can answer "what categories exist and how many questions each?" by reading <2KB
- [ ] An agent can add question #127 without reading questions 1-126
- [ ] Drift detection queries exist (find duplicate categories, short narratives, missing fields)

## Context

### Technical Environment
- **Runtime:** Browser-based React app (Vite, TypeScript)
- **Current Data Format:** `recipes.ts` exports `RECIPE_DEFINITIONS` array → compiled to `compiled-questions.json` (140KB, 126 items)
- **Pain Point:** Full file must be read to add/query questions; no surgical access

### Prior Work
- Question bank exists with 126 questions across jq concepts
- Categories loosely organized but exhibiting drift (see Audit Finding LOG-001)
- Build script (`npm run dump`) compiles TS definitions to JSON

### The Meta-Problem
The jq Master playground teaches users to avoid loading entire JSON files into memory. Yet its own question bank requires exactly that anti-pattern. This project dogfoods the philosophy: if we can't manage our own data efficiently, how can we teach others to?

## Constraints

- **Browser-only runtime:** No server-side file writes from the app itself
- **Existing data:** Must migrate 126 questions without data loss
- **Agent compatibility:** Solution must work with agents that have jq/yq query tools but limited context windows

## Architectural Decisions

### Decision 1: Category Enum (not free-form)

**Choice:** Categories will be defined as an explicit enum. New questions must match exactly.

**Rejected Alternative:** Let categories emerge organically with normalization (trim, lowercase).

**Rationale:** The current drift (` " Basics..."` vs `"Basics..."`) proves organic growth fails silently. An enum catches mistakes at write-time, not during a future audit. The 18 existing categories are mature enough to canonicalize.

### Decision 2: Manifest Index File

**Choice:** Create `questions-manifest.json` — a lightweight index (~2KB) containing:
- Total question count
- Category enum with counts and question IDs per category  
- Schema version for future migrations

**Rationale:** Agents read the manifest to understand the bank's structure. They only fetch full question data when needed (by ID). This mirrors how databases use indexes — you don't table-scan to answer "how many rows?"

---

*Project definition complete. Ready to transition to moodboard for phase planning.*
