# GSD-Lite Work Log

<!--
PERPETUAL SESSION WORK LOG - captures all work during project execution.
Tracks vision, planning, execution, decisions, and blockers across multiple tasks.

LIFECYCLE:
- Created: When project starts
- Updated: Throughout project execution
- Housekeeping: User-controlled archiving of completed tasks to HISTORY.md
- Perpetual: Logs persist until user requests archiving

PURPOSE:
- Session continuity: Fresh agents resume by reading Current Understanding (30-second context)
- Detailed history: Atomic log provides HOW we got here with full evidence
- Non-linear access: Grep patterns enable quick discovery (headers, log IDs, types, tasks)
- PR extraction: Filter by task to generate PR descriptions from execution logs

GREP PATTERNS FOR DISCOVERY:
- Headers: grep "^## " WORK.md — discover 3-part structure
- All logs with summaries: grep "^### \[LOG-" WORK.md — scan project evolution from headers
- Log by ID: grep "\[LOG-015\]" WORK.md — find specific entry
- Log by type: grep "\[DECISION\]" WORK.md — find all decisions
- Log by task: grep "Task: MODEL-A" WORK.md — filter by task

FILE READING STRATEGY:
1. Discover structure: grep "^## " to find section boundaries
2. Surgical read: Read from start_line using read_to_next_pattern or calculate end_line
3. See PROTOCOL.md "File Reading Strategy" section for detailed patterns
-->

---

## 1. Current Understanding (Read First)

<!--
HANDOFF SECTION - Read this first when resuming work.
Updated at checkpoint time or when significant state changes.
Target: Fresh agent can understand current state in 30 seconds.

Structure:
- current_mode: What workflow are we in? (moodboard, execution, checkpoint, etc.)
- active_task: What task is being worked on NOW
- parked_tasks: What tasks are on hold (waiting for decisions, dependencies, etc.)
- vision: What user wants - the intent, feel, references, success criteria
- decisions: Key decisions with rationale - not just WHAT but WHY
- blockers: Open questions, stuck items, waiting on user, ambiguities
- next_action: Specific first action when resuming this session

Use concrete facts, not jargon. Avoid "as discussed" or "per original vision" - fresh agent has zero context.

IMPORTANT: Below are EXAMPLE entries showing format - replace with your actual session content.
-->

<current_mode>
planning (PROJECT.md created, ready for moodboard phase planning)
</current_mode>

<active_task>
Task: QBANK-INIT - Question Bank Manager project initialization (complete)
</active_task>

<parked_tasks>
None - project just initialized, phases not yet planned
</parked_tasks>

<vision>
User needs context-efficient question bank management for jq Master playground.
Current pain: Adding/querying questions requires loading 140KB (126 questions) into agent context.
Goal: Surgical access via manifest index + NDJSON format + schema validation.
Meta-goal: Dogfood the jq/yq philosophy the playground teaches.
</vision>

<decisions>
1. Categories as enum (not free-form) — prevents drift like " Filtering & Logic" vs "Filtering & Logic"
2. Manifest index file — agents read 2KB to query structure, not 140KB full data
3. Schema validation — min narrative length, required fields, category enum check
</decisions>

<blockers>
None currently. Ready to plan first phase (moodboard workflow).
</blockers>

<next_action>
Run moodboard workflow to plan Phase 1: Migration & Manifest Creation
</next_action>

---

## 2. Key Events Index (Query Accelerator)

<!--
GREP ACCELERATOR - One-line summaries of major log entries.
Updated for "major" entries: VISION, DECISION, BLOCKER, DISCOVERY with code.
Skip EXEC/PLAN entries unless they're phase-changing.

Purpose: Quick scan without reading full atomic log.
Agent greps for type/task, reads index for context, then reads full log entry if needed.

Format: 10 words max per summary.

IMPORTANT: Below are EXAMPLE entries showing format - replace with your actual index content.
-->

| Log ID | Type | Task | Summary |
|--------|------|------|---------|
| LOG-001 | DISCOVERY | QBANK-AUDIT | Category drift found: leading spaces create duplicates |
| LOG-002 | DECISION | QBANK-ARCH | Categories will be enum, not free-form strings |
| LOG-003 | DECISION | QBANK-ARCH | Manifest index for surgical metadata access |
| LOG-004 | VISION | QBANK-INIT | Project initialized: context-efficient question bank mgmt |

---

## 3. Atomic Session Log (Chronological)

<!--
TYPE-TAGGED ATOMIC ENTRIES - All session work captured here.
Each entry is self-contained with code snippets where applicable.

Entry types (6 types):
- [VISION] - User vision/preferences, vision evolution, reference points
- [DECISION] - Decision made (tech, scope, approach) with rationale
- [DISCOVERY] - Evidence, findings, data (ALWAYS with code snippets)
- [PLAN] - Planning work: task breakdown, risk identification, approach
- [BLOCKER] - Open questions, stuck items, waiting states
- [EXEC] - Execution work: files modified, commands run (ALWAYS with code snippets)

Entry format:
### [LOG-NNN] - [TYPE] - {{one line summary}} - Task: TASK-ID
**Timestamp:** [YYYY-MM-DD HH:MM]
**Details:** [Full context with code snippets for EXEC/DISCOVERY]

WHY THIS FORMAT:
- Agents grep headers (`^### \[LOG-`) to scan project evolution without reading full content
- Summary in header line enables quick onboarding from grep output alone
- "###" level headers render nicely in IDE outlines for human navigation
- Timestamp moved under header keeps the grep-scanned line focused on WHAT happened

Use action timestamp (when decision made or action taken), not entry-write time.
Code snippets REQUIRED for EXEC and DISCOVERY entries (enables PR extraction).

IMPORTANT: Below are EXAMPLE entries showing format. Real entries should use [LOG-NNN] not [EXAMPLE-NNN].
-->

### [EXAMPLE-001] - [VISION] - User wants Linear-like feel + Bloomberg density for power users - Task: MODEL-A
**Timestamp:** 2026-01-22 14:00
**Details:**
- Context: Discussed UI patterns during moodboard session
- Reference: Clean layout (Linear) but with information density (Bloomberg terminal)
- Implication: Interface should not patronize advanced users with excessive whitespace

### [EXAMPLE-002] - [PLAN] - Broke card layout into 3 sub-tasks - Task: MODEL-A
**Timestamp:** 2026-01-22 14:10
**Details:**
- SUBTASK-001: Base card component with props interface
- SUBTASK-002: Engagement metrics display (likes, comments, shares)
- SUBTASK-003: Layout grid with responsive breakpoints
- Risk: Responsive behavior may need user verification on mobile

### [EXAMPLE-003] - [DECISION] - Use card-based layout, not timeline view - Task: MODEL-A
**Timestamp:** 2026-01-22 14:15
**Details:**
- Rationale: Cards support varying content length (post + engagement + metadata); timeline more rigid
- Alternative considered: Timeline view (simpler implementation, less flexible for content types)
- Impact: Unblocks component design; affects SUBTASK-001 (card props interface)

### [EXAMPLE-004] - [EXEC] - Created base card component with TypeScript interface - Task: MODEL-A
**Timestamp:** 2026-01-22 14:30
**Details:**
- Files modified: src/components/Card.tsx (created), src/types/post.ts (created)
- Code snippet:
```typescript
interface PostCardProps {
  post: {
    id: string;
    content: string;
    author: string;
    timestamp: Date;
    engagement: {
      likes: number;
      comments: number;
      shares: number;
    };
  };
}
```
- Status: SUBTASK-001 complete, proceeding to SUBTASK-002

### [EXAMPLE-005] - [DISCOVERY] - Found engagement pattern in Linear reference app - Task: MODEL-A
**Timestamp:** 2026-01-22 15:00
**Details:**
- Observation: Linear shows engagement inline, not in dropdown/modal
- Evidence from inspection:
```html
<div class="engagement-bar">
  <span class="metric">👍 12</span>
  <span class="metric">💬 5</span>
  <span class="metric">🔄 3</span>
</div>
```
- Impact: Informs SUBTASK-002 design (inline engagement, emoji + count)

### [EXAMPLE-006] - [EXEC] - Implemented engagement metrics component - Task: MODEL-A
**Timestamp:** 2026-01-22 15:30
**Details:**
- Files modified: src/components/EngagementBar.tsx (created)
- Code snippet:
```typescript
export function EngagementBar({ likes, comments, shares }: EngagementProps) {
  return (
    <div className="engagement-bar">
      <Metric icon="👍" count={likes} />
      <Metric icon="💬" count={comments} />
      <Metric icon="🔄" count={shares} />
    </div>
  );
}
```
- Status: SUBTASK-002 complete, proceeding to SUBTASK-003

### [EXAMPLE-007] - [BLOCKER] - Mobile breakpoint unclear - 768px or 640px? - Task: MODEL-A
**Timestamp:** 2026-01-22 16:00
**Details:**
- Issue: User hasn't specified mobile breakpoint preference
- Context: Linear uses 768px, Bloomberg uses custom breakpoints
- Waiting on: User decision on responsive strategy
- Impact: Blocks SUBTASK-003 (layout grid) until clarified

### [EXAMPLE-008] - [DECISION] - Use 768px breakpoint, standard tablet/mobile split - Task: MODEL-A
**Timestamp:** 2026-01-22 16:15
**Details:**
- Rationale: 768px is industry standard, matches Linear reference
- User preference: "Keep it simple, use standard breakpoints"
- Impact: Unblocks SUBTASK-003

### [EXAMPLE-009] - [EXEC] - Implemented responsive grid with 768px breakpoint - Task: MODEL-A
**Timestamp:** 2026-01-22 16:45
**Details:**
- Files modified: src/components/CardGrid.tsx (created), src/styles/grid.css (created)
- Code snippet:
```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

@media (max-width: 768px) {
  .card-grid {
    grid-template-columns: 1fr;
  }
}
```
- Status: SUBTASK-003 complete, Task: MODEL-A ready for verification

### [EXAMPLE-010] - [VISION] - Authentication must support refresh token rotation - Task: AUTH-IMPL
**Timestamp:** 2026-01-23 10:00
**Details:**
- Security requirement from user: "Don't want long-lived tokens floating around"
- Reference: OAuth 2.0 refresh token rotation best practice
- Success criteria: Access token 15min, refresh token rotates on use

### [EXAMPLE-011] - [PLAN] - JWT auth broken into 3 tasks - Task: AUTH-IMPL
**Timestamp:** 2026-01-23 10:20
**Details:**
- TASK-001: Library setup (jose v0.5.0) + token generation
- TASK-002: Login endpoint with bcrypt password hashing
- TASK-003: Token validation middleware + refresh rotation
- Risk: Token expiry strategy may need user decision

### [EXAMPLE-012] - [EXEC] - Installed jose library and created token generation - Task: AUTH-IMPL
**Timestamp:** 2026-01-23 10:30
**Details:**
- Files modified: src/auth/token.ts (created), package.json (jose added)
- Code snippet:
```typescript
export async function generateAccessToken(userId: string): Promise<string> {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  return await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('15m')
    .sign(secret);
}
```
- Status: TASK-001 complete

### [EXAMPLE-013] - [DISCOVERY] - bcrypt cost factor 12 optimal for performance - Task: AUTH-IMPL
**Timestamp:** 2026-01-23 11:00
**Details:**
- Benchmark: Cost 10 = 50ms, Cost 12 = 150ms, Cost 14 = 600ms
- Code used for testing:
```typescript
import bcrypt from 'bcrypt';
for (const cost of [10, 12, 14]) {
  const start = Date.now();
  await bcrypt.hash('password', cost);
  console.log(`Cost ${cost}: ${Date.now() - start}ms`);
}
```
- Decision: Use cost 12 (150ms acceptable for login latency)

### [EXAMPLE-014] - [EXEC] - Created login endpoint with bcrypt hashing - Task: AUTH-IMPL
**Timestamp:** 2026-01-23 11:30
**Details:**
- Files modified: src/api/auth/login.ts (created)
- Code snippet:
```typescript
export async function loginHandler(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = await db.findUserByEmail(email);
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new AuthError('Invalid credentials');
  const accessToken = await generateAccessToken(user.id);
  res.json({ accessToken });
}
```
- Status: TASK-002 complete, proceeding to TASK-003

### [EXAMPLE-015] - [BLOCKER] - Password reset flow unclear - same JWT or separate token? - Task: AUTH-IMPL
**Timestamp:** 2026-01-23 12:00
**Details:**
- Issue: Security model for password reset not specified
- Question: Reuse main JWT or generate separate reset token?
- Waiting on: User decision on security approach
- Impact: Blocks finalization of auth module architecture

### [EXAMPLE-016] - [DECISION] - Use separate reset token, not main JWT - Task: AUTH-IMPL
**Timestamp:** 2026-01-23 12:15
**Details:**
- Rationale: Separate token provides better security isolation
- User preference: "Don't reuse auth token for password reset - keep them separate"
- Expiry: 1 hour for reset token (short-lived for security)
- Impact: Need to add generateResetToken() to auth module

### [EXAMPLE-017] - [EXEC] - Added password reset token generation - Task: AUTH-IMPL
**Timestamp:** 2026-01-23 12:45
**Details:**
- Files modified: src/auth/token.ts (updated), src/api/auth/reset.ts (created)
- Code snippet:
```typescript
export async function generateResetToken(userId: string): Promise<string> {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  return await new SignJWT({ userId, type: 'reset' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1h')
    .sign(secret);
}
```
- Status: Password reset complete, Task: AUTH-IMPL ready for verification


### [LOG-001] - [DISCOVERY] - Question bank exhibits category drift and schema inconsistencies - Task: QBANK-AUDIT
**Timestamp:** 2026-02-03 15:30
**Details:**

#### The Investigation

We used jq queries against `compiled-questions.json` (126 questions, 140KB) to audit the question bank's health. The queries themselves demonstrate the surgical data access pattern this project aims to enable.

#### Finding 1: Category Name Drift (CRITICAL)

**The Problem:** Categories that should be identical are split due to leading whitespace inconsistencies.

**Evidence Query:**
```bash
# Extract all unique categories
jq '[.[] | .category] | unique' compiled-questions.json
```

**Output (truncated for clarity):**
```json
[
  " Advanced Concepts & CLI",    // ← Leading space
  " Basics: Navigation & Extraction",
  "Advanced Concepts & CLI",     // ← No leading space (DUPLICATE!)
  "Basics: Navigation & Extraction",
  "Scenario: APIs & Data"        // ← Different naming pattern entirely
]
```

**Impact Quantified:**
```bash
# Count questions per category
jq 'group_by(.category) | map({category: .[0].category, count: length})' compiled-questions.json
```

**Results showing the split:**
| Category (with space) | Count | Category (no space) | Count |
|-----------------------|-------|---------------------|-------|
| `" Advanced Concepts & CLI"` | 12 | `"Advanced Concepts & CLI"` | 1 |
| `" Aggregation & Summary"` | 4 | `"Aggregation & Summary"` | 2 |
| `" Arrays & Iteration"` | 6 | `"Arrays & Iteration"` | 1 |
| `" Filtering & Logic"` | 8 | `"Filtering & Logic"` | 6 |

**Why This Happens:** When an agent (or human) adds a new question, they type the category from memory. Without seeing the existing categories, they might write `"Filtering & Logic"` when the canonical form is `" Filtering & Logic"` (with leading space). The question gets added, no error occurs, but the data silently drifts.

**Synthesized Example for Clarity:**

Imagine two agents adding questions on different days:

```typescript
// Day 1: Agent A adds this (copies from existing question)
{
  title: "Filter by Type",
  category: " Filtering & Logic",  // ← Has leading space (correct)
  ...
}

// Day 30: Agent B adds this (types from memory)
{
  title: "Boolean AND/OR",
  category: "Filtering & Logic",   // ← No leading space (DRIFT!)
  ...
}
```

The app now shows **two separate categories** in the UI, or worse, filters fail silently.

---

#### Finding 2: Narrative Quality Variance

**The Problem:** The `narrative` field should teach the *why* behind a jq pattern. Some narratives are rich explanations; others are single-phrase restates of the hint.

**Evidence Query:**
```bash
# Find questions with narratives under 50 characters
jq '.[] | select((.narrative | length) < 50) | {title, narrative_len: (.narrative | length), narrative}' compiled-questions.json
```

**Output (14 questions flagged):**
```json
{"title": "Stripe: Normalize Currency", "narrative_len": 24, "narrative": "Divide `.amount` by 100."}
{"title": "Defining Functions `def`", "narrative_len": 25, "narrative": "Modularize complex logic."}
{"title": "GitHub: Find Forks", "narrative_len": 42, "narrative": "Use `select` on the boolean `.fork` field."}
```

**Contrast with Good Narratives (avg 108 chars):**
```json
{"title": "Regex: Capture", "narrative": "When you need to extract specific parts of a string (like a user and domain from an email)."}
```

**Why This Matters:** A narrative like "Divide `.amount` by 100." doesn't teach anything — it just restates the solution. A learner gains no insight into *when* or *why* to use this pattern.

---

#### Finding 3: Input Data Duplication (Observation, not critical)

**Evidence Query:**
```bash
# Find questions with large (>1000 char) inputs
jq '.[] | {title, input_len: (.input | length)} | select(.input_len > 1000)' compiled-questions.json
```

**Output:** 15 questions share identical large inputs:
- 7 OpenAPI questions share a 1,435-char spec
- 5 dbt questions share a 1,621-char manifest

**Implication:** Not inherently wrong, but when an agent loads these questions, it's loading the same 1.4KB blob 7 times. A future optimization could reference shared fixtures.

---

#### Finding 4: Schema Consistency (Positive)

**Evidence Query:**
```bash
# Check if all questions have identical keys
jq '[.[] | keys] | unique' compiled-questions.json
```

**Output:**
```json
[["category", "description", "hint", "input", "narrative", "query", "title"]]
```

All 126 questions have exactly these 7 keys. No missing fields, no extra fields. This is the one area without drift.

---

#### Root Cause Analysis

The drift exists because:

1. **No enum constraint:** Categories are free-form strings. Any typo becomes a new category.
2. **No validation at write-time:** The build script (`npm run dump`) compiles whatever is in `recipes.ts` without checking.
3. **Full-file context required:** To see existing categories, an agent must load all 126 questions — triggering the very context overflow that causes hallucinations and typos.

**The Irony:** The jq playground teaches users to query JSON surgically. But maintaining the playground requires loading everything into memory. We're not eating our own cooking.

---

#### Recommended Actions (captured in PROJECT.md)

1. **Canonicalize categories as enum** — Define the 10 canonical categories (after merging duplicates). Reject questions that don't match.
2. **Create manifest index** — `questions-manifest.json` with category counts, so agents can query structure without loading content.
3. **Add schema validation** — Minimum narrative length (50 chars), required fields, category enum check.
4. **Migration script** — Fix existing drift (trim whitespace, merge duplicates) as a one-time cleanup.

---

### [LOG-002] - [DECISION] - Categories will be an enum, not free-form - Task: QBANK-ARCH
**Timestamp:** 2026-02-03 15:45
**Details:**

**Decision:** Define categories as an explicit enum. New questions must match exactly.

**Alternatives Considered:**
1. **Free-form with normalization** — Trim spaces, compare lowercase. Problems: "Scenario: APIs & Data" vs "Scenario: Cloud & DevOps" would still drift semantically.
2. **AI-assisted categorization** — Let agent suggest category, human approves. Problems: Adds friction, doesn't prevent drift at source.

**Rationale:** The existing 18 categories (after deduplication → ~10 canonical) are mature. An enum catches mistakes at write-time with a clear error: "Invalid category 'Filterring & Logic'. Did you mean 'Filtering & Logic'?"

**Impact:** Requires migration to fix existing drift before enum enforcement.

---

### [LOG-003] - [DECISION] - Create manifest index for surgical metadata access - Task: QBANK-ARCH
**Timestamp:** 2026-02-03 15:50
**Details:**

**Decision:** Create `questions-manifest.json` — a lightweight index (~2KB) enabling agents to query structure without loading content.

**Proposed Schema:**
```json
{
  "schema_version": "1.0",
  "total_questions": 126,
  "categories": {
    "Basics: Navigation & Extraction": {
      "count": 12,
      "question_ids": ["nav-001", "nav-002", "..."]
    },
    "Filtering & Logic": {
      "count": 14,
      "question_ids": ["filter-001", "..."]
    }
  },
  "category_enum": [
    "Basics: Navigation & Extraction",
    "Basics: Construction & Output",
    "Arrays & Iteration",
    "Filtering & Logic",
    "Object Manipulation",
    "Data Transformation",
    "Aggregation & Summary",
    "Scenario: Cloud & DevOps",
    "Scenario: APIs & Data",
    "Advanced Concepts & CLI"
  ]
}
```

**Usage Pattern:**
```bash
# Agent wants to know categories (reads 2KB, not 140KB)
jq '.category_enum' questions-manifest.json

# Agent wants questions in a category
jq '.categories["Filtering & Logic"].question_ids' questions-manifest.json
# Then fetches only those questions from main file
```

**Rationale:** This mirrors database indexing. You don't full-table-scan to answer "how many rows?" The manifest is the index; the question bank is the table.

---

### [LOG-004] - [VISION] - Question Bank Manager project initialized - Task: QBANK-INIT
**Timestamp:** 2026-02-03 16:00
**Details:**

**User Vision:** A context-efficient management layer for the jq Master question bank that:
1. Lets agents query metadata without loading full data
2. Validates new questions against schema (enum categories, min narrative length)
3. Enables surgical edits (update one question, not read-all-write-all)
4. Demonstrates the jq/yq philosophy the playground teaches

**Core Insight from User:**
> "The struggle here is also overflowing the agent context when I ask it to add a new question: it would need to go read ALL the json into memory... Context rot kicks in hard."

**Meta-Problem:** The tool that teaches efficient JSON querying suffers from inefficient context management. This project dogfoods the philosophy.

**Success Criteria:** Agent can add question #127 without reading questions 1-126. Agent can audit drift by running jq queries against manifest.

**Artifact Created:** `gsd-lite/PROJECT.md` — Full project definition with constraints and architectural decisions

---

*Housekeeping: Run "write PR for [TASK]" to extract task logs, or "archive [TASK]" to move completed entries to HISTORY.md*
