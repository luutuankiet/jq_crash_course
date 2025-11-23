import { Recipe } from "./types";
import { SAMPLE_JSON } from "./constants";

const LOG_DATA = [
  { level: "INFO", msg: "Service started", ts: 1610000000, context: { region: "us-east-1" } },
  { level: "ERROR", msg: "Database connection failed", ts: 1610000050, context: { db: "users", region: "us-east-1" } },
  { level: "WARN", msg: "High latency detected", ts: 1610000060, context: { latency_ms: 500, region: "us-west-2" } },
  { level: "ERROR", msg: "Timeout waiting for upstream", ts: 1610000100, context: { service: "auth", region: "us-east-1" } }
];

const AWS_TAGS_DATA = [
  {
    "InstanceId": "i-12345",
    "Tags": [
      { "Key": "Name", "Value": "web-server-01" },
      { "Key": "Environment", "Value": "Production" },
      { "Key": "Owner", "Value": "DevOps" }
    ]
  },
  {
    "InstanceId": "i-67890",
    "Tags": [
      { "Key": "Name", "Value": "db-server-01" },
      { "Key": "Environment", "Value": "Staging" }
    ]
  }
];

const API_DATA = {
  "users": [
    { "id": 1, "name": "Alice", "email": "alice@example.com", "roles": ["admin", "editor"] },
    { "id": 2, "name": "Bob", "email": "bob@example.com", "roles": ["viewer"] },
    { "id": 3, "name": "Charlie", "email": "charlie@company.org", "roles": ["editor"] }
  ],
  "meta": { "page": 1, "total": 3 }
};

export const RECIPES: Recipe[] = [
  // --- Data Extraction ---
  {
    id: "extract-basic",
    title: "Basic Field Extraction",
    category: "Data Extraction",
    description: "Extract specific fields from an array of objects.",
    narrative: "The simplest and most common task. We use `.store.book[]` to iterate over the array of books, then pipe `|` each book object to `.title` to extract just that value. The result is a stream of strings.",
    input: JSON.stringify(SAMPLE_JSON, null, 2),
    query: ".store.book[] | .title"
  },
  {
    id: "extract-nested",
    title: "Deeply Nested Access",
    category: "Data Extraction",
    description: "Access a single value deep within a structure.",
    narrative: "You can chain dot notation to traverse deep structures. Here `.store.bicycle.price` goes from the root, into `store`, into `bicycle`, and gets the `price`. It's equivalent to `.store | .bicycle | .price`.",
    input: JSON.stringify(SAMPLE_JSON, null, 2),
    query: ".store.bicycle.price"
  },
  {
    id: "extract-keys-with-spaces",
    title: "Keys with Special Characters",
    category: "Data Extraction",
    description: "Access keys that have spaces or special characters.",
    narrative: "Standard dot notation `.key` only works for simple alphanumeric identifiers. If your JSON has keys like \"First Name\" or \"@timestamp\", you must use quotes and brackets: `.\"First Name\"`.",
    input: JSON.stringify({ "First Name": "John", "Last Name": "Doe", "@version": 1 }, null, 2),
    query: ".\"First Name\""
  },

  // --- Filtering & Validation ---
  {
    id: "filter-select",
    title: "Filter by Numeric Condition",
    category: "Filtering",
    description: "Select items where a number meets a condition (e.g., price < 10).",
    narrative: "`select(boolean_expression)` is the bread and butter of filtering. It passes the input through if true, and discards it if false. We iterate books `.[]` and then pipe to `select(.price < 10)`.",
    input: JSON.stringify(SAMPLE_JSON, null, 2),
    query: ".store.book[] | select(.price < 10)"
  },
  {
    id: "filter-string-contains",
    title: "Filter by String Content",
    category: "Filtering",
    description: "Find items where a string field contains a specific word.",
    narrative: "We use the `contains` function (or `test` for regex) inside `select`. This query finds all books where the author's name contains 'Tolkien'. Note that `contains` is case-sensitive.",
    input: JSON.stringify(SAMPLE_JSON, null, 2),
    query: ".store.book[] | select(.author | contains(\"Tolkien\"))"
  },
  {
    id: "filter-complex-logic",
    title: "Complex Boolean Logic",
    category: "Filtering",
    description: "Filter using AND/OR logic with multiple conditions.",
    narrative: "You can combine conditions using `and` / `or`. Parentheses help with precedence. This finds books that are either 'fiction' OR have a price less than 10.",
    input: JSON.stringify(SAMPLE_JSON, null, 2),
    query: ".store.book[] | select(.category == \"fiction\" or .price < 10)"
  },

  // --- Data Transformation ---
  {
    id: "transform-new-object",
    title: "Construct New Objects",
    category: "Transformation",
    description: "Create a new, simplified object structure from the input.",
    narrative: "We often want to 'reshape' data. We iterate books, then create a new object `{}`. Inside, we define new keys (`Title`, `Cost`) and assign them values from the input (`.title`, `.price`). wrapping the whole thing in `[]` collects the stream back into an array.",
    input: JSON.stringify(SAMPLE_JSON, null, 2),
    query: "[.store.book[] | {Title: .title, Cost: .price}]"
  },
  {
    id: "transform-masking",
    title: "Data Masking (PII)",
    category: "Transformation",
    description: "Update specific fields to mask sensitive data while keeping the structure.",
    narrative: "The `|=` update operator is powerful. It allows you to modify a value 'in place'. Here `.users[] | .email |= \"******\"` iterates users, targets the email field, and replaces it with stars, returning the full user object with the modification.",
    input: JSON.stringify(API_DATA, null, 2),
    query: ".users[] | .email |= \"******\""
  },
  {
    id: "transform-add-field",
    title: "Adding Conditional Fields",
    category: "Transformation",
    description: "Add a new field to objects based on existing data.",
    narrative: "We can add fields using `+`. Here we iterate users and add a `is_admin` field which is `true` if the roles array contains 'admin'. Note the use of parentheses to ensure the boolean logic evaluates before the addition.",
    input: JSON.stringify(API_DATA, null, 2),
    query: ".users[] | . + {is_admin: (.roles | contains([\"admin\"]))}"
  },

  // --- Aggregation & Stats ---
  {
    id: "stats-sum",
    title: "Summing Values",
    category: "Aggregation",
    description: "Calculate the total cost of all items.",
    narrative: "To sum values, we first extract them into an array or stream them, then pass them to `add`. `[.store.book[].price] | add` creates an array of prices `[8.95, 12.99...]` and adds them up.",
    input: JSON.stringify(SAMPLE_JSON, null, 2),
    query: "[.store.book[].price] | add"
  },
  {
    id: "stats-group-count",
    title: "Group By & Count",
    category: "Aggregation",
    description: "Group items by category and count how many are in each.",
    narrative: "1. `.store.book` gets the array.\n2. `group_by(.category)` creates an array of arrays, grouped by category.\n3. `map(...)` iterates over these groups.\n4. We construct a new object with the category name (taken from the first item in the group `.[0].category`) and the `count` (using `length`).",
    input: JSON.stringify(SAMPLE_JSON, null, 2),
    query: ".store.book | group_by(.category) | map({category: .[0].category, count: length})"
  },

  // --- Real World: Log Processing ---
  {
    id: "logs-errors",
    title: "Extract Error Logs",
    category: "Log Processing",
    description: "Find all logs with level ERROR and output just the message and timestamp.",
    narrative: "A classic DevOps use case. Filter stream for `ERROR`, then construct a clean object with just the necessary details. We can even format the timestamp if needed, but here we keep it simple.",
    input: JSON.stringify(LOG_DATA, null, 2),
    query: ".[] | select(.level == \"ERROR\") | {msg, ts}"
  },
  {
    id: "logs-context",
    title: "Flatten Log Context",
    category: "Log Processing",
    description: "Promote nested context fields to the top level.",
    narrative: "Sometimes logs have nested `context` objects that interfere with CSV export. We can use `+` to merge `.context` into the main object, then `del(.context)` to remove the original nested key.",
    input: JSON.stringify(LOG_DATA, null, 2),
    query: ".[] | . + .context | del(.context)"
  },

  // --- Real World: AWS / Cloud ---
  {
    id: "aws-tags-to-object",
    title: "Flatten AWS Tags",
    category: "Cloud Ops",
    description: "Convert AWS 'Key/Value' tag arrays into a simple dictionary object.",
    narrative: "AWS returns tags as `[{Key: 'Name', Value: 'Web'}]` which is hard to query. `from_entries` is the perfect tool. It expects keys as `Key` and values as `Value` (case insensitive usually, but best to map specifically if needed). Here we transform the tags array into a simple object `{\"Name\": \"Web\"}`.",
    input: JSON.stringify(AWS_TAGS_DATA, null, 2),
    query: ".[] | {InstanceId, Tags: (.Tags | from_entries)}"
  },
  {
    id: "aws-find-by-tag",
    title: "Find Instance by Tag",
    category: "Cloud Ops",
    description: "Find instances belonging to the 'Production' environment.",
    narrative: "Combining the previous technique: We first use `from_entries` on the tags to make them queryable, then `select` based on the new dictionary structure.",
    input: JSON.stringify(AWS_TAGS_DATA, null, 2),
    query: ".[] | select((.Tags | from_entries | .Environment) == \"Production\") | .InstanceId"
  },

  // --- Advanced Array Manipulation ---
  {
    id: "array-unique",
    title: "Unique Values",
    category: "Arrays",
    description: "Get a sorted list of all unique roles across all users.",
    narrative: "1. `.users[].roles[]` explodes all roles from all users into a massive stream.\n2. `[...]` collects them into a single flat array.\n3. `unique` sorts them and removes duplicates.",
    input: JSON.stringify(API_DATA, null, 2),
    query: "[.users[].roles[]] | unique"
  },
  {
    id: "array-to-csv",
    title: "Export to CSV",
    category: "Arrays",
    description: "Convert a list of objects into CSV format.",
    narrative: "To create CSVs, we first need an array of values for each row. \n1. `[.users[]]` gets the array of user objects.\n2. We pass this to `map(...)` to create an array of arrays (rows): `[.id, .name, .email]`.\n3. Finally, we pipe to `@csv` which handles quoting and escaping.",
    input: JSON.stringify(API_DATA, null, 2),
    query: ".users | map([.id, .name, .email])[] | @csv"
  }
];
