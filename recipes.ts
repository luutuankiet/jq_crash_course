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
    description: "Problem: How would you output the entire input JSON document without any changes?",
    narrative: "Let's start with the simplest possible operation. The `.` filter is the identity operator. It takes the input and produces it exactly as it was, with no modifications.",
    hint: "The query is simply `.`",
    input: JSON.stringify({ "message": "Hello, jq!" }, null, 2),
    query: "."
  },
  {
    id: "foundational-002-basic-field-access",
    title: "Basic Field Access",
    category: " Basics: Navigation & Extraction",
    description: "Problem: How would you access the value of the `users` key from the top-level object?",
    narrative: "Most of the time, you'll want to access a specific piece of data. Use the dot notation `.key` to access the value associated with that key in an object.",
    hint: "Use `.users` to get the array of users.",
    input: JSON.stringify(API_DATA, null, 2),
    query: ".users"
  },
  {
    id: "foundational-003-array-indexing",
    title: "Array Indexing",
    category: " Basics: Navigation & Extraction",
    description: "Problem: How would you retrieve only the first element from the `users` array?",
    narrative: "To get a specific item from a list (an array), you use square brackets `[index]`. Remember that arrays are zero-indexed.",
    hint: "To get the first user, access the `users` array and then use index `[0]`.",
    input: JSON.stringify(API_DATA, null, 2),
    query: ".users[0]"
  },
  {
    id: "foundational-004-nested-access",
    title: "Nested Field Access",
    category: " Basics: Navigation & Extraction",
    description: "Problem: How would you extract the `name` of the first user in the `users` array?",
    narrative: "Real-world data is often nested. You can chain dot and bracket accessors together to navigate deep into the JSON structure.",
    hint: "First get the first user with `.users[0]`, then get their name with `.name`.",
    input: JSON.stringify(API_DATA, null, 2),
    query: ".users[0].name"
  },
  {
    id: "foundational-005-array-iteration",
    title: "Array Iteration with .[]",
    category: " Basics: Navigation & Extraction",
    description: "Problem: How would you take an array of users and output each user object as a separate item in a stream?",
    narrative: "To perform an operation on *every* element in an array, you need to 'unwind' or 'explode' it. The `.[]` syntax iterates over an array.",
    hint: "`.users[]` will output each user object one by one.",
    input: JSON.stringify(API_DATA, null, 2),
    query: ".users[]"
  },
  {
    id: "foundational-006-pipe-operator",
    title: "The Pipe Operator |",
    category: " Basics: Navigation & Extraction",
    description: "Problem: How would you produce a stream of just the `name` for each user in the `users` array?",
    narrative: "The pipe `|` is the most powerful feature in jq. It lets you take the output of one filter and use it as the input for the next.",
    hint: "First iterate with `.users[]`, then pipe `|` the result to `.name`.",
    input: JSON.stringify(API_DATA, null, 2),
    query: ".users[] | .name"
  },
  {
    id: "foundational-010-length",
    title: "Get Length",
    category: " Basics: Navigation & Extraction",
    description: "Problem: How would you find the number of users in the array and the character length of the first user's name?",
    narrative: "The `length` function is versatile. When used on an array, it returns the number of elements. On a string, the number of characters.",
    hint: "Pipe the `users` array to the `length` function.",
    input: JSON.stringify(API_DATA, null, 2),
    query: "{user_count: .users | length, first_name_length: .users[0].name | length}"
  },
  {
    id: "foundational-011-keys",
    title: "Get Object Keys",
    category: " Basics: Navigation & Extraction",
    description: "Problem: How would you get a list of all the keys present in the first user object?",
    narrative: "Sometimes you need to know what keys are available in an object before you process it. `keys` gives you a sorted array of all the key names.",
    hint: "Select the first user, then pipe it to `keys`.",
    input: JSON.stringify(API_DATA, null, 2),
    query: ".users[0] | keys"
  },
  {
    id: "intermediate-060-array-slicing",
    title: "Array Slicing",
    category: " Basics: Navigation & Extraction",
    description: "Problem: How would you extract specific subsets of an array, such as the first three elements, a middle section, and the last two elements?",
    narrative: "You can select a sub-section of an array. The slice `[start:end]` includes the element at `start` and goes up to, but does not include, the element at `end`.",
    hint: "To get the 2nd and 3rd elements (indices 1 and 2), use `[1:3]`.",
    input: JSON.stringify(["a", "b", "c", "d", "e"], null, 2),
    query: "{ first_three: .[:3], middle_three: .[1:4], last_two: .[-2:] }"
  },
  {
    id: "advanced-076-path",
    title: "Finding Paths with `path`",
    category: " Basics: Navigation & Extraction",
    description: "Problem: How would you find the exact JSON path to every value that is equal to the string 'admin'?",
    narrative: "Sometimes you need to know *where* a piece of data is located, not just what it is. `path` gives you an array representing the path, e.g., `[\"users\", 0, \"name\"]`.",
    hint: "Find the path to any value that equals `\"admin\"`.",
    input: JSON.stringify(API_DATA, null, 2),
    query: "path(.users[].roles[] == \"admin\")"
  },
  {
    id: "advanced-099-get-paths",
    title: "Get Paths of Values",
    category: " Basics: Navigation & Extraction",
    description: "Problem: How would you generate a list of all possible navigation paths for a given JSON object?",
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
    description: "Problem: How would you construct a new object with a custom key `first_user_name` containing the first user's name, and `total_users` containing the total count from the metadata?",
    narrative: "You're not limited to just extracting data; you can create new objects. The syntax `{ \"new_key\": .old.path }` creates a new object mapping.",
    hint: "Use curly braces `{}` to define the new object.",
    input: JSON.stringify(API_DATA, null, 2),
    query: "{ first_user_name: .users[0].name, total_users: .meta.total }"
  },
  {
    id: "foundational-008-object-shorthand",
    title: "Object Construction Shorthand",
    category: " Basics: Construction & Output",
    description: "Problem: For each user, how would you create a new, simpler object containing only their `id` and `name`?",
    narrative: "Instead of `{\"name\": .name, \"id\": .id}`, you can just write `{name, id}`.",
    hint: "Iterate the users, then pipe each to `{id, name}`.",
    input: JSON.stringify(API_DATA, null, 2),
    query: ".users[] | {id, name}"
  },
  {
    id: "foundational-009-array-construction",
    title: "Array Construction with []",
    category: " Basics: Construction & Output",
    description: "Problem: How would you produce a single JSON array containing just the names of all users?",
    narrative: "If you wrap a filter that produces a stream in square brackets `[...]`, it will collect all the outputs into a single array.",
    hint: "The expression `.users[] | .name` produces a stream of names. Wrap it in `[]`.",
    input: JSON.stringify(API_DATA, null, 2),
    query: "[.users[] | .name]"
  },
  {
    id: "intermediate-066-string-interpolation",
    title: "String Interpolation",
    category: " Basics: Construction & Output",
    description: "Problem: How would you create a formatted string like 'User Alice has ID 1.' by embedding values from the input object?",
    narrative: "Often the goal is to produce a human-readable string. You can embed the result of any jq filter directly into a string using the `\\(...)` syntax.",
    hint: "The string will be `\"User \\(.name) has ID \\(.id).\"`",
    input: JSON.stringify({ "id": 1, "name": "Alice" }, null, 2),
    query: "\"User \\(.name) has ID \\(.id).\""
  },
  {
    id: "advanced-080-conditional-object-fields",
    title: "Conditional Object Fields",
    category: " Basics: Construction & Output",
    description: "Problem: How would you transform an array of objects, adding a new key `opt_key` only if the original object contains an 'optional' field?",
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
    description: "Problem: How would you transform an array of user objects into a new array where each object only contains the `name` and `id`?",
    narrative: "When you want to transform every item in an array without changing the number of items, `map` is the right tool.",
    hint: "Use `map` to apply the transformation `{name, id}` to each user.",
    input: JSON.stringify(API_DATA, null, 2),
    query: ".users | map({name, id})"
  },
  {
    id: "foundational-018-unique",
    title: "Get Unique Array Values",
    category: " Arrays & Iteration",
    description: "Problem: How would you compile a list of all user roles from all users, and then produce a final, sorted list with no duplicates?",
    narrative: "To get a distinct list of values, such as all the unique roles users have, use `unique`.",
    hint: "First, create an array of all roles: `[.users[].roles[]]`. Then pipe it to `unique`.",
    input: JSON.stringify(API_DATA, null, 2),
    query: "[.users[].roles[]] | unique"
  },
  {
    id: "foundational-019-sort",
    title: "Sorting an Array",
    category: " Arrays & Iteration",
    description: "Problem: How would you produce a new array containing all user names, sorted alphabetically?",
    narrative: "The `sort` filter sorts an array in ascending order. If it's an array of strings, it sorts alphabetically.",
    hint: "Create an array of names `[.users[] | .name]` and pipe it to `sort`.",
    input: JSON.stringify(API_DATA, null, 2),
    query: "[.users[] | .name] | sort"
  },
  {
    id: "advanced-079-sort-by-multiple-keys",
    title: "Sort by Multiple Keys",
    category: " Arrays & Iteration",
    description: "Problem: How would you sort a list of log entries first by message alphabetically, and then by log level?",
    narrative: "jq's `sort` is stable. To sort by `region` then `level`, you sort by `level` first, then `region`.",
    hint: "Sort by msg, then sort by level.",
    input: JSON.stringify(LOG_DATA, null, 2),
    query: "sort_by(.msg) | sort_by(.level)"
  },
  {
    id: "intermediate-068-flatten",
    title: "Flattening Nested Arrays",
    category: " Arrays & Iteration",
    description: "Problem: How would you take a nested array (an array of arrays) and combine all its elements into a single, one-dimensional array?",
    narrative: "Sometimes you end up with nested arrays. `flatten` will 'unpack' these nested arrays by one level.",
    hint: "Pipe the nested array to `flatten`.",
    input: JSON.stringify([[1, 2], [3, 4, 5], [], [6]], null, 2),
    query: "flatten"
  },
  {
    id: "advanced-068-join",
    title: "Joining Array Elements",
    category: " Arrays & Iteration",
    description: "Problem: How would you take an array of roles and combine them into a single, comma-separated string?",
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
    description: "Problem: How would you filter a list of log entries to show only those where the `level` is 'ERROR'?",
    narrative: "`select()` is the primary way to filter data in jq. You provide it with a condition that evaluates to true or false.",
    hint: "Iterate the array, then pipe each object to `select()` with the condition inside.",
    input: JSON.stringify(LOG_DATA, null, 2),
    query: ".[] | select(.level == \"ERROR\")"
  },
  {
    id: "foundational-013-select-numeric",
    title: "Filtering by Numeric Condition",
    category: " Filtering & Logic",
    description: "Problem: How would you filter a list of log entries to find only those with a latency greater than or equal to 500?",
    narrative: "You can use any boolean expression inside `select`. This is useful for finding data that falls within a certain numeric range.",
    hint: "The condition is `.context.latency_ms >= 500`.",
    input: JSON.stringify(LOG_DATA, null, 2),
    query: ".[] | select(.context.latency_ms >= 500)"
  },
  {
    id: "foundational-014-has",
    title: "Check if Key Exists with `has`",
    category: " Filtering & Logic",
    description: "Problem: How would you filter a list of log entries to find only the ones that contain a `latency_ms` key?",
    narrative: "Sometimes you need to find objects that contain an optional field. The `has()` function checks for the presence of a key.",
    hint: "We want to find the log entry that `has` the `latency_ms` key in its context.",
    input: JSON.stringify(LOG_DATA, null, 2),
    query: ".[] | select(.context | has(\"latency_ms\"))"
  },
  {
    id: "foundational-016-boolean-logic",
    title: "Boolean Logic `and`/`or`",
    category: " Filtering & Logic",
    description: "Problem: How would you filter log entries to find those that are both an 'ERROR' level and occurred in the 'us-east-1' region?",
    narrative: "Real-world filtering often requires multiple criteria. You can combine checks using `and` and `or`.",
    hint: "The condition is `(.level == \"ERROR\") and (.context.region == \"us-east-1\")`.",
    input: JSON.stringify(LOG_DATA, null, 2),
    query: ".[] | select((.level == \"ERROR\") and (.context.region == \"us-east-1\"))"
  },
  {
    id: "intermediate-029-alternative-operator",
    title: "Default Values with `//`",
    category: " Filtering & Logic",
    description: "Problem: How would you process a list of logs, ensuring that if a log's `context.service` field is missing, it defaults to the string 'unknown'?",
    narrative: "Dealing with missing data is common. The `//` operator lets you gracefully handle this by substituting a default value.",
    hint: "Try to access `.context.service`, which is sometimes missing, and provide a default.",
    input: JSON.stringify(LOG_DATA, null, 2),
    query: ".[] | {msg, service: (.context.service // \"unknown\")}"
  },
  {
    id: "intermediate-022-if-then-else",
    title: "Conditional Logic `if-then-else`",
    category: " Filtering & Logic",
    description: "Problem: How would you add a new field `type` to each user object, setting its value to 'Admin User' if they have the 'admin' role, and 'Regular User' otherwise?",
    narrative: "jq supports standard `if-then-else` expressions. This is powerful for transforming data conditionally.",
    hint: "Check `if (.roles | contains([\"admin\"])) then \"Admin User\" else \"Regular User\" end`.",
    input: JSON.stringify(API_DATA, null, 2),
    query: ".users[] | . + {type: (if .roles | contains([\"admin\"]) then \"Admin User\" else \"Regular User\" end)}"
  },
  {
    id: "intermediate-067-any-all",
    title: "Boolean Aggregation `any`/`all`",
    category: " Filtering & Logic",
    description: "Problem: For each user, how would you add a boolean field `is_admin` that is true if any of their roles is 'admin'?",
    narrative: "These are useful for validating data. Does this user have *any* admin roles? Do *all* the items in this order have a price?",
    hint: "Check if `any` role is equal to `\"admin\"`.",
    input: JSON.stringify(API_DATA.users, null, 2),
    query: ".[] | {name, is_admin: (.roles | any(. == \"admin\"))}"
  },
  {
    id: "intermediate-061-type-checking",
    title: "Checking Data Types",
    category: " Filtering & Logic",
    description: "Problem: How would you inspect an array of mixed data types and output a list of objects, each showing the original value and its corresponding JSON type?",
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
    description: "Problem: How would you remove the `email` field from every user object in the list?",
    narrative: "Sometimes you want to remove sensitive or unnecessary data. The `del()` function removes a field.",
    hint: "Iterate the users and pipe each one to `del(.email)`.",
    input: JSON.stringify(API_DATA, null, 2),
    query: ".users[] | del(.email)"
  },
  {
    id: "intermediate-021-update-assignment",
    title: "Update Assignment `|=`",
    category: " Object Manipulation",
    description: "Problem: How would you update the `name` of the first user to be all uppercase, without changing any other data?",
    narrative: "Instead of just replacing a value, `|=` lets you take the current value, run a filter on it, and replace the original value with the result.",
    hint: "The path is `.users[0].name`. The filter to apply is `ascii_upcase`.",
    input: JSON.stringify(API_DATA, null, 2),
    query: ".users[0].name |= ascii_upcase"
  },
  {
    id: "foundational-092-addition-merging",
    title: "Merging Objects",
    category: " Object Manipulation",
    description: "Problem: How would you combine two objects into one, where keys from the second object overwrite keys from the first in case of a conflict?",
    narrative: "On objects, `+` performs a shallow merge. If a key exists in both, the value from the right-hand object is used.",
    hint: "Combine the objects with `+`.",
    input: JSON.stringify({ "o1": { "a": 1, "b": 2 }, "o2": { "b": 3, "c": 4 } }, null, 2),
    query: ".o1 + .o2"
  },
  {
    id: "advanced-094-deep-merging-objects",
    title: "Deep (Recursive) Merging",
    category: " Object Manipulation",
    description: "Problem: How would you merge two configuration objects, where nested objects are also merged recursively instead of being replaced?",
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
    description: "Problem: How would you compare two objects and produce a new object that shows only the key-value pairs that have changed?",
    narrative: "If you subtract one object from another, jq will remove all key-value pairs from the first object that are also present in the second.",
    hint: "The query is `.[1] - .[0]`",
    input: JSON.stringify([{ "a": 1, "b": 2, "c": 3 }, { "a": 1, "b": 99, "c": 3 }], null, 2),
    query: ".[1] - .[0]"
  },
  {
    id: "intermediate-027-to-entries",
    title: "Object to Array (`to_entries`)",
    category: " Object Manipulation",
    description: "Problem: How would you convert an object into an array of key-value pairs, where each element is an object like `{\"key\": \"some_key\", \"value\": \"some_value\"}`?",
    narrative: "Sometimes it's easier to process data as a list rather than an object, especially if you need to filter by key names.",
    hint: "Pipe the `meta` object to `to_entries`.",
    input: JSON.stringify(API_DATA, null, 2),
    query: ".meta | to_entries"
  },
  {
    id: "intermediate-028-from-entries",
    title: "Array to Object (`from_entries`)",
    category: " Object Manipulation",
    description: "Problem: How would you take an array of `{\"key\": ..., \"value\": ...}` objects and convert it back into a standard JSON object?",
    narrative: "This is useful for pivoting data or reconstructing an object after filtering via `to_entries`.",
    hint: "This structure is already perfect for `from_entries`.",
    input: JSON.stringify([{ "key": "Name", "value": "web-server-01" }, { "key": "Environment", "value": "Production" }], null, 2),
    query: "from_entries"
  },
  {
    id: "advanced-077-map-values",
    title: "Transform Object Values",
    category: " Object Manipulation",
    description: "Problem: How would you apply a transformation to every value in an object, such as doubling all numeric values while leaving others unchanged?",
    narrative: "This is a convenient way to apply a transformation to all values in an object without changing the keys.",
    hint: "Use `map_values(tostring)`.",
    input: JSON.stringify({ "id": 123, "count": 45, "name": "item" }, null, 2),
    query: "map_values(if type==\"number\" then . * 2 else . end)"
  },
  {
    id: "advanced-100-get-set-path",
    title: "Get and Set by Path",
    category: " Object Manipulation",
    description: "Problem: How would you programmatically update a deeply nested value in an object using a path that is defined in an array (e.g., `[\"a\", \"b\", 1]`)?",
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
    description: "Problem: How would you calculate a `total_cost` by multiplying the `quantity` by the `price_per_item`?",
    narrative: "Standard arithmetic operators are available for numeric calculations.",
    hint: "Calculate total price with `*`.",
    input: JSON.stringify({ "quantity": 10, "price_per_item": 2.50 }, null, 2),
    query: "{ total_cost: (.quantity * .price_per_item) }"
  },
  {
    id: "intermediate-058-subtraction",
    title: "Math: Subtraction & Sets",
    category: " Data Transformation",
    description: "Problem: How would you calculate a final price by subtracting a discount, and also find the missing items in a user's permissions array compared to all permissions?",
    narrative: "The `-` operator is context-aware. On numbers, it subtracts. On arrays, it removes elements found in the second array from the first.",
    hint: "Calculate `.price - .discount` and `.all_permissions - .user_permissions`",
    input: JSON.stringify({ "price": 100, "discount": 15, "all": ["a", "b"], "user": ["a"] }, null, 2),
    query: "{ final_price: (.price - .discount), missing: (.all - .user) }"
  },
  {
    id: "advanced-083-handling-nulls-in-arithmetic",
    title: "Math: Handling Nulls",
    category: " Data Transformation",
    description: "Problem: How would you safely perform a subtraction where the price or discount might be `null`, treating any `null` value as zero?",
    narrative: "Math on `null` produces `null`. A common pattern is `(.field // 0)` to ensure you are always working with a number.",
    hint: "Calculate `(.price // 0) - (.discount // 0)`.",
    input: JSON.stringify([{ "price": null, "discount": null }], null, 2),
    query: ".[] | {final_price: ((.price // 0) - (.discount // 0))}"
  },
  {
    id: "foundational-015-string-contains",
    title: "String: Contains",
    category: " Data Transformation",
    description: "Problem: How would you filter a list of log entries to find only those whose message contains the word 'Database'?",
    narrative: "`contains` is useful for simple keyword searching within text fields.",
    hint: "Use `select` with the condition `.msg | contains(\"database\")`.",
    input: JSON.stringify(LOG_DATA, null, 2),
    query: ".[] | select(.msg | contains(\"Database\"))"
  },
  {
    id: "intermediate-063-startswith-endswith",
    title: "String: Starts/Ends With",
    category: " Data Transformation",
    description: "Problem: How would you filter a list of filenames to select only the ones that end with the '.log' extension?",
    narrative: "Perfect for filtering filenames or prefixes without complex regex.",
    hint: "Select files where the name `endswith(\".log\")`.",
    input: JSON.stringify(["app.log", "config.json"], null, 2),
    query: ".[] | select(endswith(\".log\"))"
  },
  {
    id: "intermediate-062-string-splitting",
    title: "String: Splitting",
    category: " Data Transformation",
    description: "Problem: How would you take a single comma-separated string of tags and convert it into a JSON array of individual tag strings?",
    narrative: "Useful for parsing structured strings like CSV lines or tags.",
    hint: "Pipe the string to `split(\",\")`.",
    input: JSON.stringify({ "tags": "go,docker,linux" }, null, 2),
    query: ".tags | split(\",\")"
  },
  {
    id: "intermediate-064-regex-test",
    title: "Regex: Test",
    category: " Data Transformation",
    description: "Problem: How would you filter a list of users to find only those whose email address ends in '@gmail.com' or '@outlook.com'?",
    narrative: "For complex string matching, use regular expressions within `test()`.",
    hint: "The regex for a gmail/outlook is `\"@(gmail|outlook)\\\\.com$\"`.",
    input: JSON.stringify([{ "email": "test@gmail.com" }], null, 2),
    query: ".[] | select(.email | test(\"@(gmail|outlook)\\\\.com$\"))"
  },
  {
    id: "intermediate-065-regex-capture",
    title: "Regex: Capture",
    category: " Data Transformation",
    description: "Problem: How would you parse an email address to extract the username and the domain into a new object with `user` and `domain` keys?",
    narrative: "When you need to extract specific parts of a string (like a user and domain from an email).",
    hint: "The regex is `\"^(?<user>[^@]+)@(?<domain>.+)\"`.",
    input: JSON.stringify({ "email": "alice@example.com" }, null, 2),
    query: ".email | capture(\"^(?<user>[^@]+)@(?<domain>.+)\")"
  },
  {
    id: "advanced-081-base64-encoding",
    title: "Encoding: Base64",
    category: " Data Transformation",
    description: "Problem: How would you take a string, encode it into Base64, and then decode it back to the original string?",
    narrative: "Common in Kubernetes Secrets and web APIs.",
    hint: "Pipe to `@base64` then `@base64d`.",
    input: JSON.stringify({ "text": "hello jq" }, null, 2),
    query: "{encoded: (.text | @base64), decoded: (.text | @base64 | @base64d)}"
  },
  {
    id: "advanced-082-uri-encoding",
    title: "Encoding: URI",
    category: " Data Transformation",
    description: "Problem: How would you safely construct a URL by taking a query string with special characters (like '&') and properly percent-encoding it?",
    narrative: "Crucial for safely building URLs with query parameters.",
    hint: "Pipe the string to `@uri`.",
    input: JSON.stringify({ "query": "jq examples & tricks" }, null, 2),
    query: "\"https://google.com/search?q=\\(.query | @uri)\""
  },
  {
    id: "advanced-078-datetime-formatting",
    title: "Date/Time Formatting",
    category: " Data Transformation",
    description: "Problem: How would you convert a Unix timestamp (a number) into a human-readable date string formatted as 'YYYY-MM-DD HH:MM:SS'?",
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
    description: "Problem: How would you calculate the sum of all user IDs?",
    narrative: "A common aggregation task. Create an array of numbers, then pipe to `add`.",
    hint: "Create array `[.users[] | .id]`, then `add`.",
    input: JSON.stringify(API_DATA, null, 2),
    query: "[.users[] | .id] | add"
  },
  {
    id: "intermediate-024-group-by",
    title: "Grouping with `group_by`",
    category: " Aggregation & Summary",
    description: "Problem: How would you take a flat list of log entries and group them into separate arrays based on the region they came from?",
    narrative: "Collects objects with the same value for a key into new arrays.",
    hint: "Use `group_by(.context.region)`.",
    input: JSON.stringify(LOG_DATA, null, 2),
    query: "group_by(.context.region)"
  },
  {
    id: "intermediate-025-group-and-count",
    title: "Group By and Count",
    category: " Aggregation & Summary",
    description: "Problem: How would you create a summary report showing each region and the total number of log entries for that region?",
    narrative: "After grouping, map over the groups to count them using `length`.",
    hint: "After `group_by`, pipe to `map({region: .[0].context.region, count: length})`",
    input: JSON.stringify(LOG_DATA, null, 2),
    query: "group_by(.context.region) | map({region: .[0].context.region, count: length})"
  },
  {
    id: "advanced-095-reduce",
    title: "Advanced Aggregation with `reduce`",
    category: " Aggregation & Summary",
    description: "Problem: How would you transform an array of user objects into a single lookup object (a map) where keys are user IDs and values are user names?",
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
    description: "Problem: How would you filter a stream of log entries to find only those that occurred within a specific time window (e.g., between two timestamps)?",
    narrative: "Common task: select logs where timestamp is `>=` start and `<` end.",
    hint: "Use `select` with numeric comparison on `.ts`.",
    input: JSON.stringify(LOG_DATA, null, 2),
    query: ".[] | select(.ts >= 1610000050 and .ts < 1610000100)"
  },
  {
    id: "real-world-logs-070-log-level-counts",
    title: "Logs: Count by Level",
    category: " Scenario: Cloud & DevOps",
    description: "Problem: How would you create a summary report showing the count of log entries for each severity level (e.g., INFO, ERROR, WARN)?",
    narrative: "Use `group_by` on the `.level` field to summarize log noise.",
    hint: "`group_by(.level)` and `map` length.",
    input: JSON.stringify(LOG_DATA, null, 2),
    query: "group_by(.level) | map({level: .[0].level, count: length})"
  },
  {
    id: "aws-053-ec2-instance-ips",
    title: "AWS: Get EC2 IPs",
    category: " Scenario: Cloud & DevOps",
    description: "Problem: How would you parse the JSON output from an AWS CLI command to extract a list of all non-null Public IP addresses for your EC2 instances?",
    narrative: "Drill down through `.Reservations` and `.Instances`.",
    hint: "Path: `.Reservations[].Instances[] | .PublicIpAddress`",
    input: JSON.stringify(AWS_EC2_JSON, null, 2),
    query: ".Reservations[].Instances[] | .PublicIpAddress | select(. != null)"
  },
  {
    id: "aws-054-flatten-ec2-tags",
    title: "AWS: Flatten Tags",
    category: " Scenario: Cloud & DevOps",
    description: "Problem: How would you convert the AWS tag format, an array of `{\"Key\": ..., \"Value\": ...}` objects, into a simple, flat JSON object of key-value pairs?",
    narrative: "Use `map` to rename Key/Value to key/value, then `from_entries`.",
    hint: "Pipe `.Tags` to `map({key: .Key, value: .Value}) | from_entries`.",
    input: JSON.stringify(AWS_EC2_JSON.Reservations[0].Instances[0], null, 2),
    query: "{InstanceId, Tags: (.Tags | map({key: .Key, value: .Value}) | from_entries)}"
  },
  {
    id: "aws-055-find-instance-by-tag",
    title: "AWS: Find Instance by Tag",
    category: " Scenario: Cloud & DevOps",
    description: "Problem: How would you find the Instance ID of all EC2 instances that have a tag 'Env' with the value 'prod'?",
    narrative: "Flatten the tags first, then use `select` to check the tag value.",
    hint: "Flatten tags, then check `.Env == \"prod\"`.",
    input: JSON.stringify(AWS_EC2_JSON, null, 2),
    query: ".Reservations[].Instances[] | select((.Tags | map({key: .Key, value: .Value}) | from_entries).Env == \"prod\") | .InstanceId"
  },
  {
    id: "docker-058-parse-env-vars",
    title: "Docker: Parse Env Vars",
    category: " Scenario: Cloud & DevOps",
    description: "Problem: How would you parse a Docker container's environment variables, which are given as an array of 'KEY=VALUE' strings, into a single JSON object?",
    narrative: "Split each string by `=`, map to `{key, value}`, then `from_entries`.",
    hint: "`map(split(\"=\") | {key: .[0], value: .[1]}) | from_entries`",
    input: JSON.stringify(DOCKER_INSPECT_JSON[0], null, 2),
    query: ".Config.Env | map(split(\"=\") | {key: .[0], value: .[1]}) | from_entries"
  },
  {
    id: "k8s-059-pod-status",
    title: "K8s: Get Pod Status",
    category: " Scenario: Cloud & DevOps",
    description: "Problem: How would you process the JSON output from `kubectl get pods` to create a simple report showing each pod's name and its current phase (e.g., 'Running', 'Pending')?",
    narrative: "Iterate `.items[]` and extract `.metadata.name` and `.status.phase`.",
    hint: "Construct `{name, status}` objects.",
    input: JSON.stringify(K8S_PODS_JSON, null, 2),
    query: ".items[] | {name: .metadata.name, status: .status.phase}"
  },
  {
    id: "k8s-060-find-crashing-pods",
    title: "K8s: Find Crashing Pods",
    category: " Scenario: Cloud & DevOps",
    description: "Problem: How would you find the names of all Kubernetes pods that have a container with a restart count greater than 5?",
    narrative: "Inspect `status.containerStatuses` for high `restartCount`.",
    hint: "Select pods where `any` container has restarts > 5.",
    input: JSON.stringify(K8S_PODS_JSON, null, 2),
    query: ".items[] | select(.status.containerStatuses | any(.restartCount > 5)) | .metadata.name"
  },
  {
    id: "real-world-genai-074-token-cost",
    title: "GenAI: Calculate Token Cost",
    category: " Scenario: Cloud & DevOps",
    description: "Problem: From a GenAI trace, how would you calculate the estimated cost of an LLM call by multiplying the total tokens used by a fixed rate per token?",
    narrative: "LLMs are expensive! Calculate the cost by multiplying tokens by rate.",
    hint: "Multiply `.attributes[\"llm.usage.total_tokens\"] * 0.00003`.",
    input: JSON.stringify(GENAI_TRACE_JSON, null, 2),
    query: ".spans[] | select(.attributes.\"llm.usage.total_tokens\") | {model: .attributes.\"llm.request.model\", cost: (.attributes.\"llm.usage.total_tokens\" * 0.00003)}"
  },
  {
    id: "real-world-genai-075-parse-tool-args",
    title: "GenAI: Parse Tool Arguments",
    category: " Scenario: Cloud & DevOps",
    description: "Problem: In a GenAI trace, the arguments for a tool call are stored as a JSON string inside another JSON object. How would you parse this nested string into a usable JSON object?",
    narrative: "The tool arguments are stored as a *JSON string*. Use `fromjson` to parse it.",
    hint: "Use `fromjson` on the `tool.args` attribute string.",
    input: JSON.stringify(GENAI_TRACE_JSON, null, 2),
    query: ".spans[] | select(.name == \"tool_execution\") | .attributes.\"tool.args\" | fromjson"
  },
  {
    id: "advanced-097-env-var-export",
    title: "Generate .env File",
    category: " Scenario: Cloud & DevOps",
    description: "Problem: How would you convert a JSON object of key-value pairs into a series of 'KEY=VALUE' strings suitable for a .env file?",
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
    description: "Problem: From a GitHub API response listing repositories, how would you extract just the name of each repository?",
    narrative: "Simple extraction from an array of objects.",
    hint: "Iterate and pipe to `.name`.",
    input: JSON.stringify(GITHUB_REPOS_JSON, null, 2),
    query: ".[] | .name"
  },
  {
    id: "github-042-find-forked-repos",
    title: "GitHub: Find Forks",
    category: " Scenario: APIs & Data",
    description: "Problem: How would you filter a list of GitHub repositories to find only the ones that are forks?",
    narrative: "Use `select` on the boolean `.fork` field.",
    hint: "Use `select(.fork == true)`.",
    input: JSON.stringify(GITHUB_REPOS_JSON, null, 2),
    query: ".[] | select(.fork == true)"
  },
  {
    id: "github-043-count-stargazers",
    title: "GitHub: Star Count Report",
    category: " Scenario: APIs & Data",
    description: "Problem: How would you transform a list of GitHub repositories into a simplified list of objects, where each object contains only the repo's name and its star count (renamed to `stars`)?",
    narrative: "We want to create a clean report. Iterate through the repos and for each one, construct a new object.",
    hint: "Iterate and pipe to `{name, stars: .stargazers_count}`.",
    input: JSON.stringify(GITHUB_REPOS_JSON, null, 2),
    query: ".[] | {name, stars: .stargazers_count}"
  },
  {
    id: "github-044-sort-by-stars",
    title: "GitHub: Sort Repos by Stars",
    category: " Scenario: APIs & Data",
    description: "Problem: How would you sort a list of GitHub repositories by their star count in descending order (most popular first)?",
    narrative: "`sort_by` allows you to sort an array of objects based on a property. Pipe to `reverse` for descending.",
    hint: "`sort_by(.stargazers_count) | reverse`",
    input: JSON.stringify(GITHUB_REPOS_JSON, null, 2),
    query: "sort_by(.stargazers_count) | reverse | .[] | {name, stars: .stargazers_count}"
  },
  {
    id: "github-045-list-languages",
    title: "GitHub: Get Unique Languages",
    category: " Scenario: APIs & Data",
    description: "Problem: How would you scan a list of repositories and produce a single, sorted array of all unique programming languages used across them?",
    narrative: "Create an array of all languages, then use `unique` to get the distinct set.",
    hint: "Combine `[.[] | .language]` and `unique`.",
    input: JSON.stringify(GITHUB_REPOS_JSON, null, 2),
    query: "[.[] | .language] | unique"
  },
  {
    id: "github-046-find-issues-by-label",
    title: "GitHub: Find Issues by Label",
    category: " Scenario: APIs & Data",
    description: "Problem: How would you filter a list of GitHub issues to find only those that have the 'bug' label?",
    narrative: "The `labels` field is an array of objects. Use `any()` to check the label names.",
    hint: "Use `select(.labels | any(.name == \"bug\"))`.",
    input: JSON.stringify(GITHUB_ISSUES_JSON, null, 2),
    query: ".[] | select(.labels | any(.name == \"bug\"))"
  },
  {
    id: "stripe-048-list-charge-amounts",
    title: "Stripe: List Amounts",
    category: " Scenario: APIs & Data",
    description: "Problem: Given a paginated API response from Stripe, how would you extract the `amount` from each charge object within the `data` array?",
    narrative: "Drill into `.data[]` before processing items.",
    hint: "Access `.data[]`, then extract `.amount`.",
    input: JSON.stringify(STRIPE_CHARGES_JSON, null, 2),
    query: ".data[] | .amount"
  },
  {
    id: "stripe-049-successful-charges",
    title: "Stripe: Filter Successful Charges",
    category: " Scenario: APIs & Data",
    description: "Problem: How would you filter a list of Stripe charges to find only the ones with a `status` of 'succeeded'?",
    narrative: "Access the data array, iterate it, and then use `select`.",
    hint: "Use `select(.status == \"succeeded\")`.",
    input: JSON.stringify(STRIPE_CHARGES_JSON, null, 2),
    query: ".data[] | select(.status == \"succeeded\")"
  },
  {
    id: "stripe-050-normalize-currency",
    title: "Stripe: Normalize Currency",
    category: " Scenario: APIs & Data",
    description: "Problem: Given that Stripe amounts are in cents, how would you convert the amount for each charge into dollars by dividing by 100?",
    narrative: "Divide `.amount` by 100.",
    hint: "Calculate `.amount / 100`.",
    input: JSON.stringify(STRIPE_CHARGES_JSON, null, 2),
    query: ".data[] | {id, amount_dollars: (.amount / 100)}"
  },
  {
    id: "stripe-051-sum-by-currency",
    title: "Stripe: Sum Revenue by Currency",
    category: " Scenario: APIs & Data",
    description: "Problem: How would you calculate the total revenue (sum of amounts) for each currency (e.g., 'usd', 'eur') from a list of charges?",
    narrative: "First `group_by(.currency)`, then `map` to construct a summary object summing amounts.",
    hint: "Combine `group_by`, `map`, and `add`.",
    input: JSON.stringify(STRIPE_CHARGES_JSON, null, 2),
    query: ".data | group_by(.currency) | map({currency: .[0].currency, total: (map(.amount) | add)})"
  },
  {
    id: "stripe-052-flatten-metadata",
    title: "Stripe: Flatten Metadata",
    category: " Scenario: APIs & Data",
    description: "Problem: How would you take a Stripe charge object and merge the fields from its nested `metadata` object into the top level of the charge object?",
    narrative: "Use `+` to merge `.metadata` into `.`.",
    hint: "`. + .metadata | del(.metadata)`",
    input: JSON.stringify(STRIPE_CHARGES_JSON.data[0], null, 2),
    query: ". + .metadata | del(.metadata)"
  },
  {
    id: "real-world-geojson-071-feature-coordinates",
    title: "GeoJSON: Get Coordinates",
    category: " Scenario: APIs & Data",
    description: "Problem: How would you extract a list of all coordinate pairs from a GeoJSON FeatureCollection object?",
    narrative: "Iterate `features` and access `geometry.coordinates`.",
    hint: "`.features[] | .geometry.coordinates`",
    input: JSON.stringify(GEOJSON_FEATURE_JSON, null, 2),
    query: ".features[] | .geometry.coordinates"
  },
  {
    id: "real-world-geojson-072-feature-properties",
    title: "GeoJSON: Get Properties",
    category: " Scenario: APIs & Data",
    description: "Problem: From a GeoJSON FeatureCollection, how would you extract the `properties` object (containing metadata like the name) for each feature?",
    narrative: "Each GeoJSON feature has a `properties` object containing metadata.",
    hint: "The path is `.features[] | .properties`.",
    input: JSON.stringify(GEOJSON_FEATURE_JSON, null, 2),
    query: ".features[] | .properties"
  },
  {
    id: "real-world-bq-073-pivot-attributes",
    title: "BigQuery: Pivot Attributes",
    category: " Scenario: APIs & Data",
    description: "Problem: From a BigQuery export where custom attributes are stored in a single JSON string, how would you parse that string and flatten its contents into the parent object?",
    narrative: "Parse the string col with `fromjson`, then `from_entries`.",
    hint: "`fromjson | from_entries`",
    input: JSON.stringify(BQ_JSON_EXPORT, null, 2),
    query: ".[] | {row_id} + (.custom_attributes | fromjson | from_entries)"
  },
  {
    id: "advanced-069-generate-sql",
    title: "Generate SQL Statements",
    category: " Scenario: APIs & Data",
    description: "Problem: How would you convert an array of user objects into a series of SQL `INSERT` statements?",
    narrative: "Use string interpolation to create SQL queries from data.",
    hint: "Construct `INSERT INTO ... VALUES ...` string.",
    input: JSON.stringify(API_DATA.users, null, 2),
    query: ".[] | \"INSERT INTO users (id, name, email) VALUES (\\(.id), '\\(.name)', '\\(.email)');\""
  },
  {
    id: "advanced-064-from-to-json",
    title: "Parsing JSON within JSON",
    category: " Scenario: APIs & Data",
    description: "Problem: How would you parse a field that is a string, but its content is itself a valid JSON object, turning it into a queryable object?",
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
    description: "Problem: How would you use a value from the top-level of a document (like total user count) inside a filter that is iterating over an inner array (like the users array)?",
    narrative: "Useful for retaining values from a higher scope during iteration.",
    hint: "Store `.meta.total as $total` before iterating users.",
    input: JSON.stringify(API_DATA, null, 2),
    query: ".meta.total as $total | .users[] | \"User \\(.name) is one of \\($total) total users.\""
  },
  {
    id: "advanced-067-arg-variables",
    title: "CLI Arguments (`--arg`)",
    category: " Advanced Concepts & CLI",
    description: "Problem: How would you write a generic query to filter users by a role, where the specific role ('admin', 'editor', etc.) is passed in as a command-line argument?",
    narrative: "Inject external variables (like environment names) into your query as `$name`.",
    hint: "Simulate passing `--arg role admin`.",
    input: JSON.stringify(API_DATA, null, 2),
    query: ".users[] | select(.roles | contains([$role]))"
  },
  {
    id: "advanced-097-cli-raw-output-flag",
    title: "Raw Output Flag (`-r`)",
    category: " Advanced Concepts & CLI",
    description: "Problem: How would you output a stream of strings, but without the surrounding JSON quotes, so they can be piped to other shell commands?",
    narrative: "Essential for generating scripts or config files.",
    hint: "Requires `jq -r`.",
    input: JSON.stringify(API_DATA.users, null, 2),
    query: ".[] | \"\\(.id), \\(.name)\""
  },
  {
    id: "advanced-098-cli-compact-output-flag",
    title: "Compact Output Flag (`-c`)",
    category: " Advanced Concepts & CLI",
    description: "Problem: How would you process an array of objects so that each resulting JSON object is printed on a single line, creating a Newline Delimited JSON (NDJSON) stream?",
    narrative: "Use this for NDJSON (newline delimited JSON) processing.",
    hint: "Requires `jq -c`.",
    input: JSON.stringify(API_DATA.users, null, 2),
    query: ".[] | {id, name}"
  },
  {
    id: "advanced-096-cli-slurp-flag",
    title: "Slurp Flag (`-s`)",
    category: " Advanced Concepts & CLI",
    description: "Problem: How would you process a file where each line is a separate JSON object (like a log file), by first reading all of them into a single JSON array?",
    narrative: "Essential when processing log files where every line is a separate JSON object.",
    hint: "Requires `jq -s`.",
    input: "{\"level\": \"info\"}\n{\"level\": \"error\"}\n{\"level\": \"info\"}",
    query: "{count: length, error_count: (map(select(.level==\"error\")) | length)}"
  },
  {
    id: "intermediate-030-error-suppression",
    title: "Error Suppression `?`",
    category: " Advanced Concepts & CLI",
    description: "Problem: How would you access a potentially missing field (like `.context.latency_ms`) across many objects without causing an error, outputting `null` if it's not found?",
    narrative: "Vital for processing inconsistent data streams.",
    hint: "Use `.context.latency_ms?`.",
    input: JSON.stringify(LOG_DATA, null, 2),
    query: "[.[] | .context.latency_ms?]"
  },
  {
    id: "intermediate-093-fromjson-safe",
    title: "Safe Parsing (`try-catch`)",
    category: " Advanced Concepts & CLI",
    description: "Problem: How would you attempt to parse a list of strings as JSON, but if a string is invalid JSON, you output the original string instead of erroring out?",
    narrative: "Prevents scripts from crashing on bad data.",
    hint: "Use `try fromjson catch .`.",
    input: JSON.stringify(["{\"a\": 1}", "bad json"], null, 2),
    query: ".[] | try fromjson catch ."
  },
  {
    id: "advanced-061-recursive-descent",
    title: "Recursive Descent `..`",
    category: " Advanced Concepts & CLI",
    description: "Problem: How would you find all values associated with a specific key (e.g., `IPAddress`) no matter how deeply nested they are within a complex JSON document?",
    narrative: "Use this to find a key anywhere in a deep hierarchy.",
    hint: "`.. | .IPAddress?` finds IPs anywhere.",
    input: JSON.stringify(DOCKER_INSPECT_JSON[0], null, 2),
    query: ".. | .IPAddress? | select(. != null)"
  },
  {
    id: "advanced-066-walk",
    title: "Recursive Modification (`walk`)",
    category: " Advanced Concepts & CLI",
    description: "Problem: How would you recursively traverse an entire JSON document and redact the value of any key named `API_KEY`, regardless of its location?",
    narrative: "Perfect for redacting sensitive keys anywhere in a document.",
    hint: "Use `walk` to redact API keys.",
    input: JSON.stringify(DOCKER_INSPECT_JSON[0], null, 2),
    query: "walk(if type == \"object\" and has(\"API_KEY\") then .API_KEY |= \"REDACTED\" else . end)"
  },
  {
    id: "advanced-062-defining-functions",
    title: "Defining Functions `def`",
    category: " Advanced Concepts & CLI",
    description: "Problem: How would you define a reusable function, `to_dollars`, that divides a number by 100, and then apply it to a field in your JSON?",
    narrative: "Modularize complex logic.",
    hint: "Define `def to_dollars: . / 100;`.",
    input: JSON.stringify({ "amount": 2599 }, null, 2),
    query: "def to_dollars: . / 100; {amount: (.amount | to_dollars)}"
  },
  {
    id: "advanced-084-slurpfile-join",
    title: "Joining Two Data Sources",
    category: " Advanced Concepts & CLI",
    description: "Problem: How would you enrich a log file containing user IDs by joining it with a second JSON file (a user lookup table) to add the corresponding user name to each log entry?",
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
    description: "Problem: How would you add comments to a jq script to explain the purpose of different parts of the filter?",
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
    description: "Problem: How would you take a sentence, split it into words, and produce a summary of how many times each word appears?",
    narrative: "Split text, group by word, and count.",
    hint: "Split by space, group_by `.`, map count.",
    input: JSON.stringify({ "text": "hello world hello" }, null, 2),
    query: ".text | split(\" \") | group_by(.) | map({word: .[0], count: length})"
  },
  {
    id: "fun-089-fizzbuzz",
    title: "FizzBuzz",
    category: " Algorithms & Fun",
    description: "Problem: How would you generate numbers from 1 to 15, replacing multiples of 3 with 'Fizz', multiples of 5 with 'Buzz', and multiples of both with 'FizzBuzz'?",
    narrative: "Showcases `range`, modulo `%`, and `if/elif`.",
    hint: "Generate range, then check modulo 15, 3, 5.",
    input: JSON.stringify(null, null, 2),
    query: "[range(1; 16) | if . % 15 == 0 then \"FizzBuzz\" elif . % 3 == 0 then \"Fizz\" elif . % 5 == 0 then \"Buzz\" else . end]"
  },
  {
    id: "fun-090-fibonacci",
    title: "Fibonacci Sequence",
    category: " Algorithms & Fun",
    description: "Problem: How would you generate the first 10 numbers of the Fibonacci sequence?",
    narrative: "Demonstrates generating sequences recursively.",
    hint: "Use `recurse` on a pair `[0,1]`.",
    input: JSON.stringify({ "n": 10 }, null, 2),
    query: "[0,1] | recurse( (.[0] + .[1]) as $sum | [.[1], $sum] ) | .[0] | limit(10; .)"
  },
  {
    id: "fun-087-ascii-bar-chart",
    title: "ASCII Bar Chart",
    category: " Algorithms & Fun",
    description: "Problem: How would you transform an array of labeled data points into a simple text-based bar chart using the '=' character for visualization?",
    narrative: "Multiplying a string repeats it.",
    hint: "Output `\"=\" * .value`.",
    input: JSON.stringify([{ "label": "A", "value": 5 }, { "label": "B", "value": 10 }, { "label": "C", "value": 7 }], null, 2),
    query: ".[] | \"\\(.label) | \\(\"=\" * .value)\""
  },
  {
    id: "fun-088-permutations",
    title: "Array Permutations",
    category: " Algorithms & Fun",
    description: "Problem: How would you generate all possible orderings (permutations) of the elements in a given array?",
    narrative: "A recursive jq function can generate all permutations.",
    hint: "This requires a recursive function definition.",
    input: JSON.stringify([1, 2, 3], null, 2),
    query: "def permutations: if length == 0 then [[]] else . as $in | reduce .[] as $x ([]; . + ($in - [$x] | permutations | map([$x] + .))) end; permutations"
  },
  {
    id: "fun-091-pascals-triangle",
    title: "Pascal's Triangle",
    category: " Algorithms & Fun",
    description: "Problem: How would you algorithmically generate the first 5 rows of Pascal's Triangle?",
    narrative: "Another algorithmic example showing how `recurse` can be used to build up a structure row by row.",
    hint: "The next row is generated by adding pairs of numbers from the current row.",
    input: JSON.stringify({ "n": 5 }, null, 2),
    query: "def next_row: [0] + . as $row | . + [0] | [range(length + 1) | $row[.] + .[.]]; [1] | recurse(next_row) | limit(5; .)"
  },
  {
    id: "advanced-094-transpose-matrix",
    title: "Transposing a Matrix",
    category: " Algorithms & Fun",
    description: "Problem: How would you transpose a matrix represented as an array of arrays (swapping its rows and columns)?",
    narrative: "Showcases complex data manipulation using `range` and indexing.",
    hint: "Requires `range`, `map`, and indexing.",
    input: JSON.stringify([[1, 2, 3], [4, 5, 6]], null, 2),
    query: "if . == [] then [] else . as $in | (map(length) | max) as $max | range($max) | map(range($in | length) | $in[.] | .[.]) end"
  }
];