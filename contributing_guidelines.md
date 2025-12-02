# `jq` Recipe Contribution Guidelines

**Goal:** Expand the `jq` learning app question bank.
**Format:** TypeScript (Strict Schema).
**Core Principle:** **Separation of Data and Logic.** Complex JSON data must be defined as a constant first, then referenced in the recipe definition.

---

## 1. The Workflow
To add a new question, you must perform two steps:

### Step A: Define the Data Constant
*   If the data is complex or reusable, define it as a `const` variable at the top of the file.
*   **Naming Convention:** Uppercase Snake Case (e.g., `K8S_DEPLOYMENT_JSON`, `SERVER_METRICS_DATA`).
*   **Format:** Standard JavaScript/TypeScript Object.

### Step B: Define the Recipe Object
*   Add a new object to the `RECIPE_DEFINITIONS` array.
*   **Type:** `Omit<Recipe, "id">` (Do not provide an `id`).
*   **Input Field:** Must use `JSON.stringify(CONSTANT_NAME, null, 2)`.

---

## 2. The Schema

Each recipe object must strictly follow this structure:

| Field | Type | Description |
| :--- | :--- | :--- |
| `title` | `string` | Short, catchy title for the menu (e.g., "Filtering Logs"). |
| `category` | `string` | The grouping folder (see "Standard Categories" below). |
| `description` | `string` | The **Problem Statement**. Ask "How would you..." |
| `narrative` | `string` | The **Teacher's Voice**. Explain the *concept* or *mental model*, not just the syntax. |
| `hint` | `string` | A short clue pointing to the specific function or operator needed. |
| `input` | `expression` | `JSON.stringify(YOUR_CONSTANT, null, 2)` |
| `query` | `string` | The valid `jq` filter solution. |

---

## 3. Standard Categories
Stick to these categories to ensure the app navigation remains clean:
*   `Basics: Navigation & Extraction`
*   `Basics: Construction & Output`
*   `Arrays & Iteration`
*   `Filtering & Logic`
*   `Object Manipulation`
*   `Data Transformation` (Math, String, Dates)
*   `Aggregation & Summary`
*   `Scenario: Cloud & DevOps`
*   `Scenario: APIs & Data`
*   `Advanced Concepts & CLI`

---

## 4. Few-Shot Examples

### Example 1: Simple Data (Inline)
*Use this for tiny, one-off examples.*

```typescript
// Step A: (Skipped, data is trivial)

// Step B: Recipe Definition
{
  title: "Simple Addition",
  category: "Data Transformation",
  description: "Problem: How do you add 5 to the input number?",
  narrative: "You can perform basic arithmetic directly on the input value.",
  hint: "Use the + operator.",
  input: "10", // Simple strings don't need JSON.stringify if they are just primitives
  query: ". + 5"
}
```

### Example 2: Complex Data (The Standard Pattern)
*Use this for real-world scenarios (Logs, API responses, Configs).*

```typescript
// Step A: Define Data Constant
const CI_PIPELINE_JSON = {
  "id": "pipe-123",
  "status": "failed",
  "stages": [
    { "name": "build", "duration": 120, "status": "success" },
    { "name": "test", "duration": 45, "status": "failed", "error": "NullPointer" },
    { "name": "deploy", "duration": 0, "status": "skipped" }
  ]
};

// Step B: Recipe Definition
{
  title: "Find Failed Stage",
  category: "Scenario: Cloud & DevOps",
  description: "Problem: How would you extract the name of the specific stage that failed in this CI pipeline?",
  narrative: "When debugging pipelines, we often need to isolate the exact step that broke. We can filter the stages array based on the status field.",
  hint: "Iterate stages and select where status is 'failed'.",
  // REFERENCING THE CONSTANT HERE:
  input: JSON.stringify(CI_PIPELINE_JSON, null, 2),
  query: ".stages[] | select(.status == \"failed\") | .name"
}
```

### Example 3: Nested Data Extraction (DevOps)

```typescript
// Step A: Define Data Constant
const DOCKER_INSPECT_JSON = [
  {
    "Id": "a1b2",
    "Config": {
      "Env": ["HOST=0.0.0.0", "PORT=80", "API_KEY=secret_123"]
    },
    "NetworkSettings": {
      "Networks": {
        "app_net": { "IPAddress": "172.18.0.3" }
      }
    }
  }
];

// Step B: Recipe Definition
{
  title: "Docker: Extract IP",
  category: "Scenario: Cloud & DevOps",
  description: "Problem: How would you drill down to find the IP address of this container on the 'app_net' network?",
  narrative: "Docker inspect objects are deeply nested. You need to follow the path through NetworkSettings to the specific network key.",
  hint: "Path: .NetworkSettings.Networks.app_net...",
  input: JSON.stringify(DOCKER_INSPECT_JSON, null, 2),
  query: ".[0].NetworkSettings.Networks.app_net.IPAddress"
}
```

---

## 5. Quality Checklist for the Agent
1.  **Is the JSON valid?** (Ensure `input` is proper JSON).
2.  **Does the Query work?** (The query must produce the expected result from the input).
3.  **Is the Narrative helpful?** (It should teach *why*, not just *what*).
4.  **Is the ID omitted?** (The code handles IDs automatically).
5.  **Is the Input stringified?** (Must use `JSON.stringify(VAR, null, 2)`).