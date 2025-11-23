import { Recipe } from "./types";
import { SAMPLE_JSON, DOCKER_INSPECT_JSON, LOOKER_DASHBOARD_JSON, GENAI_TRACE_JSON, STRIPE_INVOICE_JSON, BQ_JSON_EXPORT } from "./constants";

const API_DATA = {
  "users": [
    { "id": 1, "name": "Alice", "email": "alice@example.com", "roles": ["admin", "editor"] },
    { "id": 2, "name": "Bob", "email": "bob@example.com", "roles": ["viewer"] },
    { "id": 3, "name": "Charlie", "email": "charlie@company.org", "roles": ["editor"] }
  ],
  "meta": { "page": 1, "total": 3 }
};

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

// --- New Constants for Expanded Recipes ---

const GITHUB_REPOS_JSON = [
  { "id": 1, "name": "my-app", "private": false, "fork": false, "stargazers_count": 152, "language": "TypeScript" },
  { "id": 2, "name": "dotfiles", "private": true, "fork": false, "stargazers_count": 10, "language": "Shell" },
  { "id": 3, "name": "react", "private": false, "fork": true, "stargazers_count": 200000, "language": "TypeScript" }
];

const GITHUB_ISSUES_JSON = [
  { "title": "Feature request", "state": "open", "labels": [{ "name": "enhancement" }], "number": 101 },
  { "title": "Login fails on Safari", "state": "open", "labels": [{ "name": "bug" }, { "name": "p1" }], "number": 102 },
  { "title": "Update documentation", "state": "closed", "labels": [], "number": 99 }
];

const STRIPE_CHARGES_JSON = {
  "object": "list",
  "data": [
    { "id": "ch_1", "amount": 2000, "currency": "usd", "status": "succeeded", "metadata": { "order_id": "123" } },
    { "id": "ch_2", "amount": 1500, "currency": "eur", "status": "succeeded", "metadata": { "order_id": "124" } },
    { "id": "ch_3", "amount": 3000, "currency": "usd", "status": "failed", "metadata": { "order_id": "125" } }
  ]
};

const AWS_EC2_JSON = {
  "Reservations": [{
    "Instances": [
      { "InstanceId": "i-123", "PublicIpAddress": "54.1.2.3", "Tags": [{ "Key": "Name", "Value": "web-01" }, { "Key": "Env", "Value": "prod" }] },
      { "InstanceId": "i-456", "PublicIpAddress": "52.4.5.6", "Tags": [{ "Key": "Name", "Value": "db-01" }, { "Key": "Env", "Value": "prod" }] },
      { "InstanceId": "i-789", "PublicIpAddress": null, "Tags": [{ "Key": "Name", "Value": "worker-01" }, { "Key": "Env", "Value": "dev" }] }
    ]
  }]
};

const K8S_PODS_JSON = {
  "items": [
    { "metadata": { "name": "my-pod-1" }, "status": { "phase": "Running", "containerStatuses": [{ "name": "main", "restartCount": 0 }] } },
    { "metadata": { "name": "crashing-pod-2" }, "status": { "phase": "Running", "containerStatuses": [{ "name": "main", "restartCount": 12 }] } },
    { "metadata": { "name": "pending-pod-3" }, "status": { "phase": "Pending", "containerStatuses": null } }
  ]
};

const GEOJSON_FEATURE_JSON = {
  "type": "FeatureCollection",
  "features": [
    { "type": "Feature", "geometry": { "type": "Point", "coordinates": [-105.0, 40.0] }, "properties": { "name": "Denver" } },
    { "type": "Feature", "geometry": { "type": "Point", "coordinates": [-87.6, 41.8] }, "properties": { "name": "Chicago" } }
  ]
};


export const RECIPES: Recipe[] = [
  // ==========================================
  // 1. BASICS: NAVIGATION & EXTRACTION
  // Focus: Selecting, drilling down, and inspecting structure
  // ==========================================
  {
    id: "foundational-001-identity",
    title: "Identity: Output the Input",
    category: " Basics: Navigation & Extraction",
    description: "The most basic filter, `.` outputs the entire input JSON, unchanged.",
    narrative: "Let's start with the simplest possible operation. The `.` filter is the identity operator. It takes the input and produces it exactly as it was, with no modifications.",
    hint: "The query is simply `.`",
    input: JSON.stringify({ "message": "Hello, jq!" }, null, 2),
    query: "."
  },
  {
    id: "foundational-002-basic-field-access",
    title: "Basic Field Access",
    category: " Basics: Navigation & Extraction",
    description: "Extract the value of a specific key from an object using dot notation.",
    narrative: "Most of the time, you'll want to access a specific piece of data. Use the dot notation `.key` to access the value associated with that key in an object.",
    hint: "Use `.users` to get the array of users.",
    input: JSON.stringify(API_DATA, null, 2),
    query: ".users"
  },
  {
    id: "foundational-003-array-indexing",
    title: "Array Indexing",
    category: " Basics: Navigation & Extraction",
    description: "Get a single element from an array by its zero-based index.",
    narrative: "To get a specific item from a list (an array), you use square brackets `[index]`. Remember that arrays are zero-indexed.",
    hint: "To get the first user, access the `users` array and then use index `[0]`.",
    input: JSON.stringify(API_DATA, null, 2),
    query: ".users[0]"
  },
  {
    id: "foundational-004-nested-access",
    title: "Nested Field Access",
    category: " Basics: Navigation & Extraction",
    description: "Chain field and index accessors to retrieve deeply nested data.",
    narrative: "Real-world data is often nested. You can chain dot and bracket accessors together to navigate deep into the JSON structure.",
    hint: "First get the first user with `.users[0]`, then get their name with `.name`.",
    input: JSON.stringify(API_DATA, null, 2),
    query: ".users[0].name"
  },
  {
    id: "foundational-005-array-iteration",
    title: "Array Iteration with .[]",
    category: " Basics: Navigation & Extraction",
    description: "Use `[]` to turn an array into a stream of its individual elements.",
    narrative: "To perform an operation on *every* element in an array, you need to 'unwind' or 'explode' it. The `.[]` syntax iterates over an array.",
    hint: "`.users[]` will output each user object one by one.",
    input: JSON.stringify(API_DATA, null, 2),
    query: ".users[]"
  },
  {
    id: "foundational-006-pipe-operator",
    title: "The Pipe Operator |",
    category: " Basics: Navigation & Extraction",
    description: "Chain multiple filters together using the `|` pipe operator.",
    narrative: "The pipe `|` is the most powerful feature in jq. It lets you take the output of one filter and use it as the input for the next.",
    hint: "First iterate with `.users[]`, then pipe `|` the result to `.name`.",
    input: JSON.stringify(API_DATA, null, 2),
    query: ".users[] | .name"
  },
  {
    id: "foundational-010-length",
    title: "Get Length",
    category: " Basics: Navigation & Extraction",
    description: "`length` can be used to get the size of arrays, strings, and objects.",
    narrative: "The `length` function is versatile. When used on an array, it returns the number of elements. On a string, the number of characters.",
    hint: "Pipe the `users` array to the `length` function.",
    input: JSON.stringify(API_DATA, null, 2),
    query: "{user_count: .users | length, first_name_length: .users[0].name | length}"
  },
  {
    id: "foundational-011-keys",
    title: "Get Object Keys",
    category: " Basics: Navigation & Extraction",
    description: "The `keys` function returns a sorted array of an object's keys.",
    narrative: "Sometimes you need to know what keys are available in an object before you process it. `keys` gives you a sorted array of all the key names.",
    hint: "Select the first user, then pipe it to `keys`.",
    input: JSON.stringify(API_DATA, null, 2),
    query: ".users[0] | keys"
  },
  {
    id: "intermediate-060-array-slicing",
    title: "Array Slicing",
    category: " Basics: Navigation & Extraction",
    description: "Extract a portion of an array using the `[start:end]` syntax.",
    narrative: "You can select a sub-section of an array. The slice `[start:end]` includes the element at `start` and goes up to, but does not include, the element at `end`.",
    hint: "To get the 2nd and 3rd elements (indices 1 and 2), use `[1:3]`.",
    input: JSON.stringify(["a", "b", "c", "d", "e"], null, 2),
    query: "{ first_three: .[:3], middle_three: .[1:4], last_two: .[-2:] }"
  },
  {
    id: "advanced-076-path",
    title: "Finding Paths with `path`",
    category: " Basics: Navigation & Extraction",
    description: "`path(filter)` outputs the paths to the values selected by the filter, not the values themselves.",
    narrative: "Sometimes you need to know *where* a piece of data is located, not just what it is. `path` gives you an array representing the path, e.g., `[\"users\", 0, \"name\"]`.",
    hint: "Find the path to any value that equals `\"admin\"`.",
    input: JSON.stringify(API_DATA, null, 2),
    query: "path(.users[].roles[] == \"admin\")"
  },
  {
    id: "advanced-099-get-paths",
    title: "Get Paths of Values",
    category: " Basics: Navigation & Extraction",
    description: "The `paths` function outputs all possible paths in a JSON document as arrays.",
    narrative: "While `path(filter)` finds the path to a specific value, `paths` simply lists all valid paths. This can be useful for understanding the structure of an unknown JSON document.",
    hint: "Pipe the input to `paths`.",
    input: JSON.stringify({ "a": { "b": [1, 2] } }, null, 2),
    query: "paths"
  },

  // ==========================================
  // 2. BASICS: CONSTRUCTION & OUTPUT
  // Focus: Building new JSON objects, arrays, and strings
  // ==========================================
  {
    id: "foundational-007-object-construction",
    title: "Simple Object Construction",
    category: " Basics: Construction & Output",
    description: "Create a new JSON object with `{}` and custom keys.",
    narrative: "You're not limited to just extracting data; you can create new objects. The syntax `{ \"new_key\": .old.path }` creates a new object mapping.",
    hint: "Use curly braces `{}` to define the new object.",
    input: JSON.stringify(API_DATA, null, 2),
    query: "{ first_user_name: .users[0].name, total_users: .meta.total }"
  },
  {
    id: "foundational-008-object-shorthand",
    title: "Object Construction Shorthand",
    category: " Basics: Construction & Output",
    description: "If the new key name is the same as the input field, you can use a shorthand.",
    narrative: "Instead of `{\"name\": .name, \"id\": .id}`, you can just write `{name, id}`.",
    hint: "Iterate the users, then pipe each to `{id, name}`.",
    input: JSON.stringify(API_DATA, null, 2),
    query: ".users[] | {id, name}"
  },
  {
    id: "foundational-009-array-construction",
    title: "Array Construction with []",
    category: " Basics: Construction & Output",
    description: "Collect a stream of values into a single array using `[]`.",
    narrative: "If you wrap a filter that produces a stream in square brackets `[...]`, it will collect all the outputs into a single array.",
    hint: "The expression `.users[] | .name` produces a stream of names. Wrap it in `[]`.",
    input: JSON.stringify(API_DATA, null, 2),
    query: "[.users[] | .name]"
  },
  {
    id: "intermediate-066-string-interpolation",
    title: "String Interpolation",
    category: " Basics: Construction & Output",
    description: "Construct strings with embedded JSON data using `\\(filter)`.",
    narrative: "Often the goal is to produce a human-readable string. You can embed the result of any jq filter directly into a string using the `\\(...)` syntax.",
    hint: "The string will be `\"User \\(.name) has ID \\(.id).\"`",
    input: JSON.stringify({ "id": 1, "name": "Alice" }, null, 2),
    query: "\"User \\(.name) has ID \\(.id).\""
  },
  {
    id: "advanced-080-conditional-object-fields",
    title: "Conditional Object Fields",
    category: " Basics: Construction & Output",
    description: "Construct an object, but only include certain key-value pairs if a condition is met.",
    narrative: "By wrapping a key-value pair in parentheses inside an `if` statement, you can conditionally include it using the `+` operator.",
    hint: "Use `+ (if .optional? then {opt_key: .optional} else {} end)`.",
    input: JSON.stringify([{ "id": 1, "name": "A" }, { "id": 2, "name": "B", "optional": "value" }], null, 2),
    query: ".[] | {id, name} + (if has(\"optional\") then {opt_key: .optional} else {} end)"
  },

  // ==========================================
  // 3. ARRAYS & ITERATION
  // Focus: Processing lists, sorting, and reshaping arrays
  // ==========================================
  {
    id: "intermediate-026-map",
    title: "Transforming Arrays with `map`",
    category: " Arrays & Iteration",
    description: "`map(filter)` applies a given filter to each element of an input array, returning a new array.",
    narrative: "When you want to transform every item in an array without changing the number of items, `map` is the right tool.",
    hint: "Use `map` to apply the transformation `{name, id}` to each user.",
    input: JSON.stringify(API_DATA, null, 2),
    query: ".users | map({name, id})"
  },
  {
    id: "foundational-018-unique",
    title: "Get Unique Array Values",
    category: " Arrays & Iteration",
    description: "`unique` takes an array and returns a new sorted array with duplicates removed.",
    narrative: "To get a distinct list of values, such as all the unique roles users have, use `unique`.",
    hint: "First, create an array of all roles: `[.users[].roles[]]`. Then pipe it to `unique`.",
    input: JSON.stringify(API_DATA, null, 2),
    query: "[.users[].roles[]] | unique"
  },
  {
    id: "foundational-019-sort",
    title: "Sorting an Array",
    category: " Arrays & Iteration",
    description: "`sort` takes an array of numbers or strings and returns a sorted array.",
    narrative: "The `sort` filter sorts an array in ascending order. If it's an array of strings, it sorts alphabetically.",
    hint: "Create an array of names `[.users[] | .name]` and pipe it to `sort`.",
    input: JSON.stringify(API_DATA, null, 2),
    query: "[.users[] | .name] | sort"
  },
  {
    id: "advanced-079-sort-by-multiple-keys",
    title: "Sort by Multiple Keys",
    category: " Arrays & Iteration",
    description: "To sort by multiple criteria, sort by the least important key first, then the next.",
    narrative: "jq's `sort` is stable. To sort by `region` then `level`, you sort by `level` first, then `region`.",
    hint: "Sort by msg, then sort by level.",
    input: JSON.stringify(LOG_DATA, null, 2),
    query: "sort_by(.msg) | sort_by(.level)"
  },
  {
    id: "intermediate-068-flatten",
    title: "Flattening Nested Arrays",
    category: " Arrays & Iteration",
    description: "`flatten` takes an array of arrays and produces a single, flat array.",
    narrative: "Sometimes you end up with nested arrays. `flatten` will 'unpack' these nested arrays by one level.",
    hint: "Pipe the nested array to `flatten`.",
    input: JSON.stringify([[1, 2], [3, 4, 5], [], [6]], null, 2),
    query: "flatten"
  },
  {
    id: "advanced-068-join",
    title: "Joining Array Elements",
    category: " Arrays & Iteration",
    description: "`join(separator)` combines an array of strings into a single string.",
    narrative: "The opposite of `split`. `join` is useful for creating formatted strings, like a comma-separated list of tags.",
    hint: "Pipe the array of roles to `join(\", \")`.",
    input: JSON.stringify(API_DATA.users[0], null, 2),
    query: ".roles | join(\", \")"
  },

  // ==========================================
  // 4. FILTERING & LOGIC
  // Focus: Conditionals, selection, and boolean logic
  // ==========================================
  {
    id: "foundational-012-select-equality",
    title: "Filtering with `select`",
    category: " Filtering & Logic",
    description: "The `select()` function filters a stream, letting only items that match the condition pass through.",
    narrative: "`select()` is the primary way to filter data in jq. You provide it with a condition that evaluates to true or false.",
    hint: "Iterate the array, then pipe each object to `select()` with the condition inside.",
    input: JSON.stringify(LOG_DATA, null, 2),
    query: ".[] | select(.level == \"ERROR\")"
  },
  {
    id: "foundational-013-select-numeric",
    title: "Filtering by Numeric Condition",
    category: " Filtering & Logic",
    description: "Use `select` with numeric operators like `>` or `<=`.",
    narrative: "You can use any boolean expression inside `select`. This is useful for finding data that falls within a certain numeric range.",
    hint: "The condition is `.context.latency_ms >= 500`.",
    input: JSON.stringify(LOG_DATA, null, 2),
    query: ".[] | select(.context.latency_ms >= 500)"
  },
  {
    id: "foundational-014-has",
    title: "Check if Key Exists with `has`",
    category: " Filtering & Logic",
    description: "`has(key)` returns true if the input object has the given key.",
    narrative: "Sometimes you need to find objects that contain an optional field. The `has()` function checks for the presence of a key.",
    hint: "We want to find the log entry that `has` the `latency_ms` key in its context.",
    input: JSON.stringify(LOG_DATA, null, 2),
    query: ".[] | select(.context | has(\"latency_ms\"))"
  },
  {
    id: "foundational-016-boolean-logic",
    title: "Boolean Logic `and`/`or`",
    category: " Filtering & Logic",
    description: "Combine multiple conditions in `select` using `and` or `or`.",
    narrative: "Real-world filtering often requires multiple criteria. You can combine checks using `and` and `or`.",
    hint: "The condition is `(.level == \"ERROR\") and (.context.region == \"us-east-1\")`.",
    input: JSON.stringify(LOG_DATA, null, 2),
    query: ".[] | select((.level == \"ERROR\") and (.context.region == \"us-east-1\"))"
  },
  {
    id: "intermediate-029-alternative-operator",
    title: "Default Values with `//`",
    category: " Filtering & Logic",
    description: "The `//` operator provides a default value if the left-hand side is `null` or `false`.",
    narrative: "Dealing with missing data is common. The `//` operator lets you gracefully handle this by substituting a default value.",
    hint: "Try to access `.context.service`, which is sometimes missing, and provide a default.",
    input: JSON.stringify(LOG_DATA, null, 2),
    query: ".[] | {msg, service: (.context.service // \"unknown\")}"
  },
  {
    id: "intermediate-022-if-then-else",
    title: "Conditional Logic `if-then-else`",
    category: " Filtering & Logic",
    description: "Perform conditional logic using `if A then B else C end`.",
    narrative: "jq supports standard `if-then-else` expressions. This is powerful for transforming data conditionally.",
    hint: "Check `if (.roles | contains([\"admin\"])) then \"Admin User\" else \"Regular User\" end`.",
    input: JSON.stringify(API_DATA, null, 2),
    query: ".users[] | . + {type: (if .roles | contains([\"admin\"]) then \"Admin User\" else \"Regular User\" end)}"
  },
  {
    id: "intermediate-067-any-all",
    title: "Boolean Aggregation `any`/`all`",
    category: " Filtering & Logic",
    description: "`any` returns true if any item in a stream meets a condition. `all` returns true if all items meet it.",
    narrative: "These are useful for validating data. Does this user have *any* admin roles? Do *all* the items in this order have a price?",
    hint: "Check if `any` role is equal to `\"admin\"`.",
    input: JSON.stringify(API_DATA.users, null, 2),
    query: ".[] | {name, is_admin: (.roles | any(. == \"admin\"))}"
  },
  {
    id: "intermediate-061-type-checking",
    title: "Checking Data Types",
    category: " Filtering & Logic",
    description: "The `type` function returns the type of its input as a string (e.g., \"number\", \"string\", \"object\").",
    narrative: "When processing unpredictable data, it's good practice to check types before attempting operations that might fail.",
    hint: "Select elements where `type == \"number\"`.",
    input: JSON.stringify([1, "text", { "a": 1 }, 42, null, true], null, 2),
    query: ".[] | {value: ., type: type}"
  },

  // ==========================================
  // 5. OBJECT MANIPULATION
  // Focus: Modifying objects, merging, reshaping
  // ==========================================
  {
    id: "foundational-020-del",
    title: "Deleting a Field",
    category: " Object Manipulation",
    description: "`del(.path)` removes a key-value pair from an object.",
    narrative: "Sometimes you want to remove sensitive or unnecessary data. The `del()` function removes a field.",
    hint: "Iterate the users and pipe each one to `del(.email)`.",
    input: JSON.stringify(API_DATA, null, 2),
    query: ".users[] | del(.email)"
  },
  {
    id: "intermediate-021-update-assignment",
    title: "Update Assignment `|=`",
    category: " Object Manipulation",
    description: "The `|=` operator updates a field in place by applying a filter to it.",
    narrative: "Instead of just replacing a value, `|=` lets you take the current value, run a filter on it, and replace the original value with the result.",
    hint: "The path is `.users[0].name`. The filter to apply is `ascii_upcase`.",
    input: JSON.stringify(API_DATA, null, 2),
    query: ".users[0].name |= ascii_upcase"
  },
  {
    id: "foundational-092-addition-merging",
    title: "Merging Objects",
    category: " Object Manipulation",
    description: "The `+` operator merges objects (right-biased).",
    narrative: "On objects, `+` performs a shallow merge. If a key exists in both, the value from the right-hand object is used.",
    hint: "Combine the objects with `+`.",
    input: JSON.stringify({ "o1": { "a": 1, "b": 2 }, "o2": { "b": 3, "c": 4 } }, null, 2),
    query: ".o1 + .o2"
  },
  {
    id: "advanced-094-deep-merging-objects",
    title: "Deep (Recursive) Merging",
    category: " Object Manipulation",
    description: "The `*` operator on objects performs a deep merge, recursively merging nested objects.",
    narrative: "Unlike `+`, the `*` operator will merge nested objects as well. This is what you usually want when merging configuration files.",
    hint: "Use `.[0] * .[1]` to merge the default and user configs.",
    input: JSON.stringify([
      { "db": { "host": "db", "port": 5432, "ssl": false } },
      { "db": { "port": 1234, "user": "admin" } }
    ], null, 2),
    query: ".[0] * .[1]"
  },
  {
    id: "advanced-065-diffing-objects",
    title: "Diffing Objects",
    category: " Object Manipulation",
    description: "The subtraction operator `-` on objects produces a diff, showing what has changed.",
    narrative: "If you subtract one object from another, jq will remove all key-value pairs from the first object that are also present in the second.",
    hint: "The query is `.[1] - .[0]`",
    input: JSON.stringify([{ "a": 1, "b": 2, "c": 3 }, { "a": 1, "b": 99, "c": 3 }], null, 2),
    query: ".[1] - .[0]"
  },
  {
    id: "intermediate-027-to-entries",
    title: "Object to Array (`to_entries`)",
    category: " Object Manipulation",
    description: "`to_entries` converts an object into an array of `{key, value}` objects.",
    narrative: "Sometimes it's easier to process data as a list rather than an object, especially if you need to filter by key names.",
    hint: "Pipe the `meta` object to `to_entries`.",
    input: JSON.stringify(API_DATA, null, 2),
    query: ".meta | to_entries"
  },
  {
    id: "intermediate-028-from-entries",
    title: "Array to Object (`from_entries`)",
    category: " Object Manipulation",
    description: "`from_entries` converts an array of `{key, value}` objects back into a single object.",
    narrative: "This is useful for pivoting data or reconstructing an object after filtering via `to_entries`.",
    hint: "This structure is already perfect for `from_entries`.",
    input: JSON.stringify([{ "key": "Name", "value": "web-server-01" }, { "key": "Environment", "value": "Production" }], null, 2),
    query: "from_entries"
  },
  {
    id: "advanced-077-map-values",
    title: "Transform Object Values",
    category: " Object Manipulation",
    description: "`map_values(f)` runs a filter on every value of an object, returning a new object.",
    narrative: "This is a convenient way to apply a transformation to all values in an object without changing the keys.",
    hint: "Use `map_values(tostring)`.",
    input: JSON.stringify({ "id": 123, "count": 45, "name": "item" }, null, 2),
    query: "map_values(if type==\"number\" then . * 2 else . end)"
  },
  {
    id: "advanced-100-get-set-path",
    title: "Get and Set by Path",
    category: " Object Manipulation",
    description: "Use `getpath` and `setpath` to dynamically read or write to a location using a path array.",
    narrative: "This is the programmatic equivalent of dot notation, useful when paths are dynamic variables.",
    hint: "Define a path, then use `setpath` to change the value at that location.",
    input: JSON.stringify({ "a": { "b": [1, 2] } }, null, 2),
    query: "[\"a\", \"b\", 1] as $path | setpath($path; 99)"
  },

  // ==========================================
  // 6. DATA TRANSFORMATION
  // Focus: Math, Strings, Regex, Encodings, Dates
  // ==========================================
  {
    id: "intermediate-059-multiplication-division",
    title: "Math: Basic Arithmetic",
    category: " Data Transformation",
    description: "Use `*`, `/`, and `%` (modulo) for basic arithmetic.",
    narrative: "Standard arithmetic operators are available for numeric calculations.",
    hint: "Calculate total price with `*`.",
    input: JSON.stringify({ "quantity": 10, "price_per_item": 2.50 }, null, 2),
    query: "{ total_cost: (.quantity * .price_per_item) }"
  },
  {
    id: "intermediate-058-subtraction",
    title: "Math: Subtraction & Sets",
    category: " Data Transformation",
    description: "The `-` operator subtracts numbers and calculates the set difference for arrays.",
    narrative: "The `-` operator is context-aware. On numbers, it subtracts. On arrays, it removes elements found in the second array from the first.",
    hint: "Calculate `.price - .discount` and `.all_permissions - .user_permissions`",
    input: JSON.stringify({ "price": 100, "discount": 15, "all": ["a", "b"], "user": ["a"] }, null, 2),
    query: "{ final_price: (.price - .discount), missing: (.all - .user) }"
  },
  {
    id: "advanced-083-handling-nulls-in-arithmetic",
    title: "Math: Handling Nulls",
    category: " Data Transformation",
    description: "Use `// 0` to substitute `0` for `null` before performing arithmetic.",
    narrative: "Math on `null` produces `null`. A common pattern is `(.field // 0)` to ensure you are always working with a number.",
    hint: "Calculate `(.price // 0) - (.discount // 0)`.",
    input: JSON.stringify([{ "price": null, "discount": null }], null, 2),
    query: ".[] | {final_price: ((.price // 0) - (.discount // 0))}"
  },
  {
    id: "foundational-015-string-contains",
    title: "String: Contains",
    category: " Data Transformation",
    description: "The `contains(substring)` function checks if a string contains another string.",
    narrative: "`contains` is useful for simple keyword searching within text fields.",
    hint: "Use `select` with the condition `.msg | contains(\"database\")`.",
    input: JSON.stringify(LOG_DATA, null, 2),
    query: ".[] | select(.msg | contains(\"Database\"))"
  },
  {
    id: "intermediate-063-startswith-endswith",
    title: "String: Starts/Ends With",
    category: " Data Transformation",
    description: "Boolean functions to check if a string begins or ends with a specific substring.",
    narrative: "Perfect for filtering filenames or prefixes without complex regex.",
    hint: "Select files where the name `endswith(\".log\")`.",
    input: JSON.stringify(["app.log", "config.json"], null, 2),
    query: ".[] | select(endswith(\".log\"))"
  },
  {
    id: "intermediate-062-string-splitting",
    title: "String: Splitting",
    category: " Data Transformation",
    description: "`split(separator)` splits a string into an array of strings.",
    narrative: "Useful for parsing structured strings like CSV lines or tags.",
    hint: "Pipe the string to `split(\",\")`.",
    input: JSON.stringify({ "tags": "go,docker,linux" }, null, 2),
    query: ".tags | split(\",\")"
  },
  {
    id: "intermediate-064-regex-test",
    title: "Regex: Test",
    category: " Data Transformation",
    description: "`test(regex)` returns `true` or `false` if the input string matches the regex.",
    narrative: "For complex string matching, use regular expressions within `test()`.",
    hint: "The regex for a gmail/outlook is `\"@(gmail|outlook)\\\\.com$\"`.",
    input: JSON.stringify([{ "email": "test@gmail.com" }], null, 2),
    query: ".[] | select(.email | test(\"@(gmail|outlook)\\\\.com$\"))"
  },
  {
    id: "intermediate-065-regex-capture",
    title: "Regex: Capture",
    category: " Data Transformation",
    description: "`capture(regex)` returns an object of the named capture groups from a regex match.",
    narrative: "When you need to extract specific parts of a string (like a user and domain from an email).",
    hint: "The regex is `\"^(?<user>[^@]+)@(?<domain>.+)\"`.",
    input: JSON.stringify({ "email": "alice@example.com" }, null, 2),
    query: ".email | capture(\"^(?<user>[^@]+)@(?<domain>.+)\")"
  },
  {
    id: "advanced-081-base64-encoding",
    title: "Encoding: Base64",
    category: " Data Transformation",
    description: "Use `@base64` and `@base64d` to encode and decode strings.",
    narrative: "Common in Kubernetes Secrets and web APIs.",
    hint: "Pipe to `@base64` then `@base64d`.",
    input: JSON.stringify({ "text": "hello jq" }, null, 2),
    query: "{encoded: (.text | @base64), decoded: (.text | @base64 | @base64d)}"
  },
  {
    id: "advanced-082-uri-encoding",
    title: "Encoding: URI",
    category: " Data Transformation",
    description: "Use `@uri` to percent-encode a string for use in a URL.",
    narrative: "Crucial for safely building URLs with query parameters.",
    hint: "Pipe the string to `@uri`.",
    input: JSON.stringify({ "query": "jq examples & tricks" }, null, 2),
    query: "\"https://google.com/search?q=\\(.query | @uri)\""
  },
  {
    id: "advanced-078-datetime-formatting",
    title: "Date/Time Formatting",
    category: " Data Transformation",
    description: "Format a UNIX timestamp into a human-readable string using `strftime`.",
    narrative: "After converting a numeric timestamp with `todate`, you can format it using `strftime` directives.",
    hint: "Convert with `todate`, then `strftime(\"%Y-%m-%d %H:%M:%S\")`.",
    input: JSON.stringify({ "ts": 1672531200 }, null, 2),
    query: ".ts | todate | strftime(\"%Y-%m-%d %H:%M:%S\")"
  },

  // ==========================================
  // 7. AGGREGATION & SUMMARY
  // Focus: Grouping, Counting, Summing
  // ==========================================
  {
    id: "foundational-017-add-values",
    title: "Summing with `add`",
    category: " Aggregation & Summary",
    description: "`add` takes an array of numbers and returns their sum.",
    narrative: "A common aggregation task. Create an array of numbers, then pipe to `add`.",
    hint: "Create array `[.users[] | .id]`, then `add`.",
    input: JSON.stringify(API_DATA, null, 2),
    query: "[.users[] | .id] | add"
  },
  {
    id: "intermediate-024-group-by",
    title: "Grouping with `group_by`",
    category: " Aggregation & Summary",
    description: "`group_by` groups array elements into sub-arrays based on a shared property.",
    narrative: "Collects objects with the same value for a key into new arrays.",
    hint: "Use `group_by(.context.region)`.",
    input: JSON.stringify(LOG_DATA, null, 2),
    query: "group_by(.context.region)"
  },
  {
    id: "intermediate-025-group-and-count",
    title: "Group By and Count",
    category: " Aggregation & Summary",
    description: "Combine `group_by` with `map` to create a summary report.",
    narrative: "After grouping, map over the groups to count them using `length`.",
    hint: "After `group_by`, pipe to `map({region: .[0].context.region, count: length})`",
    input: JSON.stringify(LOG_DATA, null, 2),
    query: "group_by(.context.region) | map({region: .[0].context.region, count: length})"
  },
  {
    id: "advanced-095-reduce",
    title: "Advanced Aggregation with `reduce`",
    category: " Aggregation & Summary",
    description: "`reduce` aggregates a stream of values into a single complex answer.",
    narrative: "More powerful than `add` or `group_by`, `reduce` lets you build any data structure from a stream of inputs.",
    hint: "Start with `{}`, iterate users, and build a map of ID to Name.",
    input: JSON.stringify(API_DATA.users, null, 2),
    query: "reduce .[] as $user ({}; . + {($user.id | tostring): $user.name})"
  },

  // ==========================================
  // 8. SCENARIO: CLOUD & DEVOPS
  // Focus: Infrastructure, Logs, Configs, AWS/K8s
  // ==========================================
  {
    id: "real-world-logs-069-filter-by-timestamp",
    title: "Logs: Filter by Timestamp",
    category: " Scenario: Cloud & DevOps",
    description: "Filter log entries that fall within a specific time window.",
    narrative: "Common task: select logs where timestamp is `>=` start and `<` end.",
    hint: "Use `select` with numeric comparison on `.ts`.",
    input: JSON.stringify(LOG_DATA, null, 2),
    query: ".[] | select(.ts >= 1610000050 and .ts < 1610000100)"
  },
  {
    id: "real-world-logs-070-log-level-counts",
    title: "Logs: Count by Level",
    category: " Scenario: Cloud & DevOps",
    description: "Create a report showing how many logs of each severity level exist.",
    narrative: "Use `group_by` on the `.level` field to summarize log noise.",
    hint: "`group_by(.level)` and `map` length.",
    input: JSON.stringify(LOG_DATA, null, 2),
    query: "group_by(.level) | map({level: .[0].level, count: length})"
  },
  {
    id: "aws-053-ec2-instance-ips",
    title: "AWS: Get EC2 IPs",
    category: " Scenario: Cloud & DevOps",
    description: "Navigate nested AWS CLI output to find public IPs.",
    narrative: "Drill down through `.Reservations` and `.Instances`.",
    hint: "Path: `.Reservations[].Instances[] | .PublicIpAddress`",
    input: JSON.stringify(AWS_EC2_JSON, null, 2),
    query: ".Reservations[].Instances[] | .PublicIpAddress | select(. != null)"
  },
  {
    id: "aws-054-flatten-ec2-tags",
    title: "AWS: Flatten Tags",
    category: " Scenario: Cloud & DevOps",
    description: "Convert AWS `[{Key, Value}]` tags into a simple object.",
    narrative: "Use `map` to rename Key/Value to key/value, then `from_entries`.",
    hint: "Pipe `.Tags` to `map({key: .Key, value: .Value}) | from_entries`.",
    input: JSON.stringify(AWS_EC2_JSON.Reservations[0].Instances[0], null, 2),
    query: "{InstanceId, Tags: (.Tags | map({key: .Key, value: .Value}) | from_entries)}"
  },
  {
    id: "aws-055-find-instance-by-tag",
    title: "AWS: Find Instance by Tag",
    category: " Scenario: Cloud & DevOps",
    description: "Filter instances based on a specific tag value.",
    narrative: "Flatten the tags first, then use `select` to check the tag value.",
    hint: "Flatten tags, then check `.Env == \"prod\"`.",
    input: JSON.stringify(AWS_EC2_JSON, null, 2),
    query: ".Reservations[].Instances[] | select((.Tags | map({key: .Key, value: .Value}) | from_entries).Env == \"prod\") | .InstanceId"
  },
  {
    id: "docker-058-parse-env-vars",
    title: "Docker: Parse Env Vars",
    category: " Scenario: Cloud & DevOps",
    description: "Convert `[\"KEY=VAL\"]` strings into a JSON object.",
    narrative: "Split each string by `=`, map to `{key, value}`, then `from_entries`.",
    hint: "`map(split(\"=\") | {key: .[0], value: .[1]}) | from_entries`",
    input: JSON.stringify(DOCKER_INSPECT_JSON[0], null, 2),
    query: ".Config.Env | map(split(\"=\") | {key: .[0], value: .[1]}) | from_entries"
  },
  {
    id: "k8s-059-pod-status",
    title: "K8s: Get Pod Status",
    category: " Scenario: Cloud & DevOps",
    description: "Create a simple report of pod names and phases from kubectl output.",
    narrative: "Iterate `.items[]` and extract `.metadata.name` and `.status.phase`.",
    hint: "Construct `{name, status}` objects.",
    input: JSON.stringify(K8S_PODS_JSON, null, 2),
    query: ".items[] | {name: .metadata.name, status: .status.phase}"
  },
  {
    id: "k8s-060-find-crashing-pods",
    title: "K8s: Find Crashing Pods",
    category: " Scenario: Cloud & DevOps",
    description: "Find pods with high restart counts.",
    narrative: "Inspect `status.containerStatuses` for high `restartCount`.",
    hint: "Select pods where `any` container has restarts > 5.",
    input: JSON.stringify(K8S_PODS_JSON, null, 2),
    query: ".items[] | select(.status.containerStatuses | any(.restartCount > 5)) | .metadata.name"
  },
  {
    id: "real-world-genai-074-token-cost",
    title: "GenAI: Calculate Token Cost",
    category: " Scenario: Cloud & DevOps",
    description: "Extract token usage and calculate estimated cost.",
    narrative: "LLMs are expensive! Calculate the cost by multiplying tokens by rate.",
    hint: "Multiply `.attributes[\"llm.usage.total_tokens\"] * 0.00003`.",
    input: JSON.stringify(GENAI_TRACE_JSON, null, 2),
    query: ".spans[] | select(.attributes.\"llm.usage.total_tokens\") | {model: .attributes.\"llm.request.model\", cost: (.attributes.\"llm.usage.total_tokens\" * 0.00003)}"
  },
  {
    id: "real-world-genai-075-parse-tool-args",
    title: "GenAI: Parse Tool Arguments",
    category: " Scenario: Cloud & DevOps",
    description: "Extract and parse nested JSON strings in tool calls.",
    narrative: "The tool arguments are stored as a *JSON string*. Use `fromjson` to parse it.",
    hint: "Use `fromjson` on the `tool.args` attribute string.",
    input: JSON.stringify(GENAI_TRACE_JSON, null, 2),
    query: ".spans[] | select(.name == \"tool_execution\") | .attributes.\"tool.args\" | fromjson"
  },
  {
    id: "advanced-097-env-var-export",
    title: "Generate .env File",
    category: " Scenario: Cloud & DevOps",
    description: "Convert a JSON object into `KEY=VALUE` format.",
    narrative: "Use `to_entries` and string interpolation to generate config files.",
    hint: "Format: `\"\\(.key)=\\(.value)\"`.",
    input: JSON.stringify({ "DB_HOST": "localhost", "DB_PORT": 5432 }, null, 2),
    query: "to_entries[] | \"\\(.key|ascii_upcase)=\\(.value)\""
  },

  // ==========================================
  // 9. SCENARIO: APIS & DATA ENGINEERING
  // Focus: Web APIs, SQL, CSV, GeoJSON
  // ==========================================
  {
    id: "github-041-list-repo-names",
    title: "GitHub: List Names",
    category: " Scenario: APIs & Data",
    description: "Extract just the `name` from a list of repos.",
    narrative: "Simple extraction from an array of objects.",
    hint: "Iterate and pipe to `.name`.",
    input: JSON.stringify(GITHUB_REPOS_JSON, null, 2),
    query: ".[] | .name"
  },
  {
    id: "github-042-find-forked-repos",
    title: "GitHub: Find Forks",
    category: " Scenario: APIs & Data",
    description: "Filter for forked repositories.",
    narrative: "Use `select` on the boolean `.fork` field.",
    hint: "Use `select(.fork == true)`.",
    input: JSON.stringify(GITHUB_REPOS_JSON, null, 2),
    query: ".[] | select(.fork == true)"
  },
  {
    id: "github-043-count-stargazers",
    title: "GitHub: Star Count Report",
    category: " Scenario: APIs & Data",
    description: "Create a simplified object showing each repository's name and its star count.",
    narrative: "We want to create a clean report. Iterate through the repos and for each one, construct a new object.",
    hint: "Iterate and pipe to `{name, stars: .stargazers_count}`.",
    input: JSON.stringify(GITHUB_REPOS_JSON, null, 2),
    query: ".[] | {name, stars: .stargazers_count}"
  },
  {
    id: "github-044-sort-by-stars",
    title: "GitHub: Sort Repos by Stars",
    category: " Scenario: APIs & Data",
    description: "Sort the list of repositories from most to least popular using `sort_by`.",
    narrative: "`sort_by` allows you to sort an array of objects based on a property. Pipe to `reverse` for descending.",
    hint: "`sort_by(.stargazers_count) | reverse`",
    input: JSON.stringify(GITHUB_REPOS_JSON, null, 2),
    query: "sort_by(.stargazers_count) | reverse | .[] | {name, stars: .stargazers_count}"
  },
  {
    id: "github-045-list-languages",
    title: "GitHub: Get Unique Languages",
    category: " Scenario: APIs & Data",
    description: "Compile a unique, sorted list of all programming languages used.",
    narrative: "Create an array of all languages, then use `unique` to get the distinct set.",
    hint: "Combine `[.[] | .language]` and `unique`.",
    input: JSON.stringify(GITHUB_REPOS_JSON, null, 2),
    query: "[.[] | .language] | unique"
  },
  {
    id: "github-046-find-issues-by-label",
    title: "GitHub: Find Issues by Label",
    category: " Scenario: APIs & Data",
    description: "Find all issues that have a specific label, like 'bug'.",
    narrative: "The `labels` field is an array of objects. Use `any()` to check the label names.",
    hint: "Use `select(.labels | any(.name == \"bug\"))`.",
    input: JSON.stringify(GITHUB_ISSUES_JSON, null, 2),
    query: ".[] | select(.labels | any(.name == \"bug\"))"
  },
  {
    id: "stripe-048-list-charge-amounts",
    title: "Stripe: List Amounts",
    category: " Scenario: APIs & Data",
    description: "Access the `data` array in a wrapper object.",
    narrative: "Drill into `.data[]` before processing items.",
    hint: "Access `.data[]`, then extract `.amount`.",
    input: JSON.stringify(STRIPE_CHARGES_JSON, null, 2),
    query: ".data[] | .amount"
  },
  {
    id: "stripe-049-successful-charges",
    title: "Stripe: Filter Successful Charges",
    category: " Scenario: APIs & Data",
    description: "Filter the list of charges to find only those with a `status` of `succeeded`.",
    narrative: "Access the data array, iterate it, and then use `select`.",
    hint: "Use `select(.status == \"succeeded\")`.",
    input: JSON.stringify(STRIPE_CHARGES_JSON, null, 2),
    query: ".data[] | select(.status == \"succeeded\")"
  },
  {
    id: "stripe-050-normalize-currency",
    title: "Stripe: Normalize Currency",
    category: " Scenario: APIs & Data",
    description: "Convert cents to dollars.",
    narrative: "Divide `.amount` by 100.",
    hint: "Calculate `.amount / 100`.",
    input: JSON.stringify(STRIPE_CHARGES_JSON, null, 2),
    query: ".data[] | {id, amount_dollars: (.amount / 100)}"
  },
  {
    id: "stripe-051-sum-by-currency",
    title: "Stripe: Sum Revenue by Currency",
    category: " Scenario: APIs & Data",
    description: "Group charges by currency and then sum the total amount for each currency.",
    narrative: "First `group_by(.currency)`, then `map` to construct a summary object summing amounts.",
    hint: "Combine `group_by`, `map`, and `add`.",
    input: JSON.stringify(STRIPE_CHARGES_JSON, null, 2),
    query: ".data | group_by(.currency) | map({currency: .[0].currency, total: (map(.amount) | add)})"
  },
  {
    id: "stripe-052-flatten-metadata",
    title: "Stripe: Flatten Metadata",
    category: " Scenario: APIs & Data",
    description: "Merge nested `metadata` fields into the parent object.",
    narrative: "Use `+` to merge `.metadata` into `.`.",
    hint: "`. + .metadata | del(.metadata)`",
    input: JSON.stringify(STRIPE_CHARGES_JSON.data[0], null, 2),
    query: ". + .metadata | del(.metadata)"
  },
  {
    id: "real-world-geojson-071-feature-coordinates",
    title: "GeoJSON: Get Coordinates",
    category: " Scenario: APIs & Data",
    description: "Extract coordinates from a FeatureCollection.",
    narrative: "Iterate `features` and access `geometry.coordinates`.",
    hint: "`.features[] | .geometry.coordinates`",
    input: JSON.stringify(GEOJSON_FEATURE_JSON, null, 2),
    query: ".features[] | .geometry.coordinates"
  },
  {
    id: "real-world-geojson-072-feature-properties",
    title: "GeoJSON: Get Properties",
    category: " Scenario: APIs & Data",
    description: "Extract the metadata (properties) associated with each feature.",
    narrative: "Each GeoJSON feature has a `properties` object containing metadata.",
    hint: "The path is `.features[] | .properties`.",
    input: JSON.stringify(GEOJSON_FEATURE_JSON, null, 2),
    query: ".features[] | .properties"
  },
  {
    id: "real-world-bq-073-pivot-attributes",
    title: "BigQuery: Pivot Attributes",
    category: " Scenario: APIs & Data",
    description: "Parse JSON string column and flatten it.",
    narrative: "Parse the string col with `fromjson`, then `from_entries`.",
    hint: "`fromjson | from_entries`",
    input: JSON.stringify(BQ_JSON_EXPORT, null, 2),
    query: ".[] | {row_id} + (.custom_attributes | fromjson | from_entries)"
  },
  {
    id: "advanced-069-generate-sql",
    title: "Generate SQL Statements",
    category: " Scenario: APIs & Data",
    description: "Format JSON data into SQL INSERT statements.",
    narrative: "Use string interpolation to create SQL queries from data.",
    hint: "Construct `INSERT INTO ... VALUES ...` string.",
    input: JSON.stringify(API_DATA.users, null, 2),
    query: ".[] | \"INSERT INTO users (id, name, email) VALUES (\\(.id), '\\(.name)', '\\(.email)');\""
  },
  {
    id: "advanced-064-from-to-json",
    title: "Parsing JSON within JSON",
    category: " Scenario: APIs & Data",
    description: "Use `fromjson` to parse a string field that contains JSON.",
    narrative: "Common when logs or DBs embed JSON as a string. Parse it to work with nested data.",
    hint: "Pipe `.custom_attributes` to `fromjson`.",
    input: JSON.stringify(BQ_JSON_EXPORT[0], null, 2),
    query: ".custom_attributes | fromjson"
  },

  // ==========================================
  // 10. ADVANCED CONCEPTS & CLI
  // Focus: Power user features, flags, scripting
  // ==========================================
  {
    id: "intermediate-023-variables",
    title: "Using Variables `as`",
    category: " Advanced Concepts & CLI",
    description: "Store a value in a variable with `as $name`.",
    narrative: "Useful for retaining values from a higher scope during iteration.",
    hint: "Store `.meta.total as $total` before iterating users.",
    input: JSON.stringify(API_DATA, null, 2),
    query: ".meta.total as $total | .users[] | \"User \\(.name) is one of \\($total) total users.\""
  },
  {
    id: "advanced-067-arg-variables",
    title: "CLI Arguments (`--arg`)",
    category: " Advanced Concepts & CLI",
    description: "Pass values from shell to jq using `--arg name value`.",
    narrative: "Inject external variables (like environment names) into your query as `$name`.",
    hint: "Simulate passing `--arg role admin`.",
    input: JSON.stringify(API_DATA, null, 2),
    query: ".users[] | select(.roles | contains([$role]))"
  },
  {
    id: "advanced-097-cli-raw-output-flag",
    title: "Raw Output Flag (`-r`)",
    category: " Advanced Concepts & CLI",
    description: "The `-r` flag outputs strings directly without JSON quotes.",
    narrative: "Essential for generating scripts or config files.",
    hint: "Requires `jq -r`.",
    input: JSON.stringify(API_DATA.users, null, 2),
    query: ".[] | \"\\(.id), \\(.name)\""
  },
  {
    id: "advanced-098-cli-compact-output-flag",
    title: "Compact Output Flag (`-c`)",
    category: " Advanced Concepts & CLI",
    description: "The `-c` flag prints each JSON output on a single line.",
    narrative: "Use this for NDJSON (newline delimited JSON) processing.",
    hint: "Requires `jq -c`.",
    input: JSON.stringify(API_DATA.users, null, 2),
    query: ".[] | {id, name}"
  },
  {
    id: "advanced-096-cli-slurp-flag",
    title: "Slurp Flag (`-s`)",
    category: " Advanced Concepts & CLI",
    description: "The `-s` flag reads a stream of JSON objects into a single array.",
    narrative: "Essential when processing log files where every line is a separate JSON object.",
    hint: "Requires `jq -s`.",
    input: "{\"level\": \"info\"}\n{\"level\": \"error\"}\n{\"level\": \"info\"}",
    query: "{count: length, error_count: (map(select(.level==\"error\")) | length)}"
  },
  {
    id: "intermediate-030-error-suppression",
    title: "Error Suppression `?`",
    category: " Advanced Concepts & CLI",
    description: "Appending `?` prevents errors if the key/index doesn't exist.",
    narrative: "Vital for processing inconsistent data streams.",
    hint: "Use `.context.latency_ms?`.",
    input: JSON.stringify(LOG_DATA, null, 2),
    query: "[.[] | .context.latency_ms?]"
  },
  {
    id: "intermediate-093-fromjson-safe",
    title: "Safe Parsing (`try-catch`)",
    category: " Advanced Concepts & CLI",
    description: "Use `try-catch` to handle strings that might not be valid JSON.",
    narrative: "Prevents scripts from crashing on bad data.",
    hint: "Use `try fromjson catch .`.",
    input: JSON.stringify(["{\"a\": 1}", "bad json"], null, 2),
    query: ".[] | try fromjson catch ."
  },
  {
    id: "advanced-061-recursive-descent",
    title: "Recursive Descent `..`",
    category: " Advanced Concepts & CLI",
    description: "Recursively outputs every value in the JSON structure.",
    narrative: "Use this to find a key anywhere in a deep hierarchy.",
    hint: "`.. | .IPAddress?` finds IPs anywhere.",
    input: JSON.stringify(DOCKER_INSPECT_JSON[0], null, 2),
    query: ".. | .IPAddress? | select(. != null)"
  },
  {
    id: "advanced-066-walk",
    title: "Recursive Modification (`walk`)",
    category: " Advanced Concepts & CLI",
    description: "Recursively applies a filter to every value in the input.",
    narrative: "Perfect for redacting sensitive keys anywhere in a document.",
    hint: "Use `walk` to redact API keys.",
    input: JSON.stringify(DOCKER_INSPECT_JSON[0], null, 2),
    query: "walk(if type == \"object\" and has(\"API_KEY\") then .API_KEY |= \"REDACTED\" else . end)"
  },
  {
    id: "advanced-062-defining-functions",
    title: "Defining Functions `def`",
    category: " Advanced Concepts & CLI",
    description: "Define reusable functions using `def name: ...;`.",
    narrative: "Modularize complex logic.",
    hint: "Define `def to_dollars: . / 100;`.",
    input: JSON.stringify({ "amount": 2599 }, null, 2),
    query: "def to_dollars: . / 100; {amount: (.amount | to_dollars)}"
  },
  {
    id: "advanced-084-slurpfile-join",
    title: "Joining Two Data Sources",
    category: " Advanced Concepts & CLI",
    description: "Using `--slurpfile`, load a lookup table and enrich another data source.",
    narrative: "Load a secondary JSON file as a variable to perform joins.",
    hint: "Requires CLI: `jq --slurpfile users users.json`.",
    input: JSON.stringify({
      "$users_file": [{ "id": 1, "name": "Alice" }, { "id": 2, "name": "Bob" }],
      "logs": [{ "user_id": 1, "action": "login" }, { "user_id": 2, "action": "logout" }]
    }, null, 2),
    query: "($users_file | map({(.id|tostring): .name}) | add) as $lookup | .logs[] | . + {user_name: $lookup[(.user_id|tostring)]}"
  },
  {
    id: "advanced-085-comments",
    title: "Using Comments",
    category: " Advanced Concepts & CLI",
    description: "jq filters can be commented using `#`.",
    narrative: "Anything from a `#` to the end of the line is ignored by jq.",
    hint: "Add a comment before the `select`.",
    input: JSON.stringify(LOG_DATA, null, 2),
    query: ".[] # Iterate over all log entries\n| select(.level == \"ERROR\") # Find only the errors"
  },

  // ==========================================
  // 11. ALGORITHMS & FUN
  // Focus: Logic puzzles, recursion, and CS concepts
  // ==========================================
  {
    id: "fun-086-word-count",
    title: "Word Count",
    category: " Algorithms & Fun",
    description: "Count occurrences of each word in a text.",
    narrative: "Split text, group by word, and count.",
    hint: "Split by space, group_by `.`, map count.",
    input: JSON.stringify({ "text": "hello world hello" }, null, 2),
    query: ".text | split(\" \") | group_by(.) | map({word: .[0], count: length})"
  },
  {
    id: "fun-089-fizzbuzz",
    title: "FizzBuzz",
    category: " Algorithms & Fun",
    description: "The classic FizzBuzz test.",
    narrative: "Showcases `range`, modulo `%`, and `if/elif`.",
    hint: "Generate range, then check modulo 15, 3, 5.",
    input: JSON.stringify(null, null, 2),
    query: "[range(1; 16) | if . % 15 == 0 then \"FizzBuzz\" elif . % 3 == 0 then \"Fizz\" elif . % 5 == 0 then \"Buzz\" else . end]"
  },
  {
    id: "fun-090-fibonacci",
    title: "Fibonacci Sequence",
    category: " Algorithms & Fun",
    description: "Generate Fibonacci numbers using `recurse`.",
    narrative: "Demonstrates generating sequences recursively.",
    hint: "Use `recurse` on a pair `[0,1]`.",
    input: JSON.stringify({ "n": 10 }, null, 2),
    query: "[0,1] | recurse( (.[0] + .[1]) as $sum | [.[1], $sum] ) | .[0] | limit(10; .)"
  },
  {
    id: "fun-087-ascii-bar-chart",
    title: "ASCII Bar Chart",
    category: " Algorithms & Fun",
    description: "Generate a visual chart using string multiplication.",
    narrative: "Multiplying a string repeats it.",
    hint: "Output `\"=\" * .value`.",
    input: JSON.stringify([{ "label": "A", "value": 5 }, { "label": "B", "value": 10 }, { "label": "C", "value": 7 }], null, 2),
    query: ".[] | \"\\(.label) | \\(\"=\" * .value)\""
  },
  {
    id: "fun-088-permutations",
    title: "Array Permutations",
    category: " Algorithms & Fun",
    description: "Generate all possible orderings of an array's elements.",
    narrative: "A recursive jq function can generate all permutations.",
    hint: "This requires a recursive function definition.",
    input: JSON.stringify([1, 2, 3], null, 2),
    query: "def permutations: if length == 0 then [[]] else . as $in | reduce .[] as $x ([]; . + ($in - [$x] | permutations | map([$x] + .))) end; permutations"
  },
  {
    id: "fun-091-pascals-triangle",
    title: "Pascal's Triangle",
    category: " Algorithms & Fun",
    description: "Generate N rows of Pascal's Triangle.",
    narrative: "Another algorithmic example showing how `recurse` can be used to build up a structure row by row.",
    hint: "The next row is generated by adding pairs of numbers from the current row.",
    input: JSON.stringify({ "n": 5 }, null, 2),
    query: "def next_row: [0] + . as $row | . + [0] | [range(length + 1) | $row[.] + .[.]]; [1] | recurse(next_row) | limit(5; .)"
  },
  {
    id: "advanced-094-transpose-matrix",
    title: "Transposing a Matrix",
    category: " Algorithms & Fun",
    description: "Transpose a matrix (swap its rows and columns).",
    narrative: "Showcases complex data manipulation using `range` and indexing.",
    hint: "Requires `range`, `map`, and indexing.",
    input: JSON.stringify([[1, 2, 3], [4, 5, 6]], null, 2),
    query: "if . == [] then [] else . as $in | (map(length) | max) as $max | range($max) | map(range($in | length) | $in[.] | .[.]) end"
  }
];