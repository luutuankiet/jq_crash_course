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

export const RECIPES: Recipe[] = [
  // --- Data Extraction ---
  {
    id: "extract-basic",
    title: "Basic Field Extraction",
    category: "Data Extraction",
    description: "Extract specific fields from an array of objects.",
    narrative: "Let's start with the basics. We have a list of books in `.store.book`. How do we get just the titles? \n\nFirst, we need to 'explode' the array into a stream of objects using `.[]`. Once we have a stream of book objects, we can pipe `|` each one to `.title`.",
    hint: "Use .store.book[] to get the objects, then pipe to .title",
    input: JSON.stringify(SAMPLE_JSON, null, 2),
    query: ".store.book[] | .title"
  },
  {
    id: "extract-nested",
    title: "Deeply Nested Access",
    category: "Data Extraction",
    description: "Access a single value deep within a structure.",
    narrative: "Sometimes data is buried deep. We want the price of the bicycle. \n\nYou can chain dot notation like a path: `.store` -> `.bicycle` -> `.price`. Think of it as navigating a folder structure.",
    hint: "Follow the path: store -> bicycle -> price",
    input: JSON.stringify(SAMPLE_JSON, null, 2),
    query: ".store.bicycle.price"
  },
  {
    id: "extract-keys-with-spaces",
    title: "Keys with Special Characters",
    category: "Data Extraction",
    description: "Access keys that have spaces or special characters.",
    narrative: "Uh oh, this key has a space in it: \"First Name\". Standard dot notation `.First Name` won't work because jq thinks the space ends the key name. \n\nTo fix this, we wrap the key in quotes and brackets, like `[\"Key Name\"]`.",
    hint: "Use quotes and brackets: .[\"Key Name\"]",
    input: JSON.stringify({ "First Name": "John", "Last Name": "Doe", "@version": 1 }, null, 2),
    query: ".\"First Name\""
  },

  // --- Filtering & Validation ---
  {
    id: "filter-select",
    title: "Filter by Numeric Condition",
    category: "Filtering",
    description: "Select items where a number meets a condition (e.g., price < 10).",
    narrative: "We have a stream of books, but we only want the cheap ones. \n\nThe `select()` function is your best friend here. It acts like a gatekeeper: if the condition inside is true, the data passes through. If false, it's discarded.",
    hint: "Iterate books first, then pipe to select(.price < 10)",
    input: JSON.stringify(SAMPLE_JSON, null, 2),
    query: ".store.book[] | select(.price < 10)"
  },
  {
    id: "filter-string-contains",
    title: "Filter by String Content",
    category: "Filtering",
    description: "Find items where a string field contains a specific word.",
    narrative: "What if we want books by Tolkien? We can't use `==` because we might not know the full string. \n\nInstead, we use `contains(\"Text\")`. Note that it is case-sensitive!",
    hint: "Use select(.author | contains(\"Tolkien\"))",
    input: JSON.stringify(SAMPLE_JSON, null, 2),
    query: ".store.book[] | select(.author | contains(\"Tolkien\"))"
  },
  {
    id: "filter-complex-logic",
    title: "Complex Boolean Logic",
    category: "Filtering",
    description: "Filter using AND/OR logic with multiple conditions.",
    narrative: "Real life queries are rarely simple. Let's find books that are EITHER 'fiction' OR cheap (< 10). \n\nWe can combine conditions with `and` / `or`. Don't forget parentheses `()` to group logic correctly!",
    hint: "select(.category == \"fiction\" or .price < 10)",
    input: JSON.stringify(SAMPLE_JSON, null, 2),
    query: ".store.book[] | select(.category == \"fiction\" or .price < 10)"
  },

  // --- Data Transformation ---
  {
    id: "transform-new-object",
    title: "Construct New Objects",
    category: "Transformation",
    description: "Create a new, simplified object structure from the input.",
    narrative: "The raw data has too many fields. Let's build a clean report with just `Title` and `Cost`. \n\nWe can construct a new JSON object on the fly using `{ Key: Value }`. We map the old keys (`.title`) to our new keys.",
    hint: "Create a new object structure: {Title: .title, Cost: .price}",
    input: JSON.stringify(SAMPLE_JSON, null, 2),
    query: "[.store.book[] | {Title: .title, Cost: .price}]"
  },
  {
    id: "transform-masking",
    title: "Data Masking (PII)",
    category: "Transformation",
    description: "Update specific fields to mask sensitive data while keeping the structure.",
    narrative: "Security alert! We need to hide user emails. \n\nThe update operator `|=` is perfect for this. It modifies a specific part of the JSON tree *in place* without breaking the rest of the structure.",
    hint: "Target .email and update it: .email |= \"******\"",
    input: JSON.stringify(API_DATA, null, 2),
    query: ".users[] | .email |= \"******\""
  },
  {
    id: "transform-add-field",
    title: "Adding Conditional Fields",
    category: "Transformation",
    description: "Add a new field to objects based on existing data.",
    narrative: "Let's flag our admin users. We want to add a new field `is_admin: true` to the object. \n\nWe can use `+` to merge a new object `{is_admin: ...}` into the existing one.",
    hint: "Use . + {is_admin: ...}",
    input: JSON.stringify(API_DATA, null, 2),
    query: ".users[] | . + {is_admin: (.roles | contains([\"admin\"]))}"
  },

  // --- Aggregation & Stats ---
  {
    id: "stats-sum",
    title: "Summing Values",
    category: "Aggregation",
    description: "Calculate the total cost of all items.",
    narrative: "How much would it cost to buy everything? \n\nFirst, we need to extract all the prices into a single array `[...]`. Then, we simply pipe that array to the `add` function.",
    hint: "Collect prices into an array first: [.store.book[].price]",
    input: JSON.stringify(SAMPLE_JSON, null, 2),
    query: "[.store.book[].price] | add"
  },
  {
    id: "stats-group-count",
    title: "Group By & Count",
    category: "Aggregation",
    description: "Group items by category and count how many are in each.",
    narrative: "This is a classic 'Group By' operation. \n\n1. `group_by(.category)` buckets the items.\n2. We then `map` over these buckets.\n3. For each bucket, we grab the category name from the first item `.[0]` and calculate the size with `length`.",
    hint: "group_by(.category) | map({category: .[0].category, count: length})",
    input: JSON.stringify(SAMPLE_JSON, null, 2),
    query: ".store.book | group_by(.category) | map({category: .[0].category, count: length})"
  },

  // --- Real World: Log Processing ---
  {
    id: "logs-errors",
    title: "Extract Error Logs",
    category: "Log Processing",
    description: "Find all logs with level ERROR and output just the message and timestamp.",
    narrative: "Production is down! We need to find the errors fast. \n\nFilter the stream for `level == \"ERROR\"`, then pick out just the `msg` and `ts` fields to cut through the noise.",
    hint: "select(.level == \"ERROR\") | {msg, ts}",
    input: JSON.stringify(LOG_DATA, null, 2),
    query: ".[] | select(.level == \"ERROR\") | {msg, ts}"
  },
  {
    id: "logs-context",
    title: "Flatten Log Context",
    category: "Log Processing",
    description: "Promote nested context fields to the top level.",
    narrative: "The `context` object is annoying; we want those fields at the top level. \n\nWe can merge `.context` into the main object using `+`, and then delete the original `.context` key to avoid duplication.",
    hint: ". + .context | del(.context)",
    input: JSON.stringify(LOG_DATA, null, 2),
    query: ".[] | . + .context | del(.context)"
  },

  // --- Real World: AWS / Cloud ---
  {
    id: "aws-tags-to-object",
    title: "Flatten AWS Tags",
    category: "Cloud Ops",
    description: "Convert AWS 'Key/Value' tag arrays into a simple dictionary object.",
    narrative: "AWS returns tags in a weird format: `[{Key: 'Name', Value: 'Web'}]`. This is hard to query. \n\n`from_entries` is the magic wand here. It turns that list into a clean object `{\"Name\": \"Web\"}`.",
    hint: "Pipe the Tags array to from_entries",
    input: JSON.stringify(AWS_TAGS_DATA, null, 2),
    query: ".[] | {InstanceId, Tags: (.Tags | from_entries)}"
  },
  {
    id: "aws-find-by-tag",
    title: "Find Instance by Tag",
    category: "Cloud Ops",
    description: "Find instances belonging to the 'Production' environment.",
    narrative: "Now that we know how to flatten tags, let's use it to find our Production servers. \n\nWe transform the tags first, then check if `.Environment == \"Production\"`.",
    hint: "Flatten tags first, then select based on the new object",
    input: JSON.stringify(AWS_TAGS_DATA, null, 2),
    query: ".[] | select((.Tags | from_entries | .Environment) == \"Production\") | .InstanceId"
  },

  // --- Advanced Array Manipulation ---
  {
    id: "array-unique",
    title: "Unique Values",
    category: "Arrays",
    description: "Get a sorted list of all unique roles across all users.",
    narrative: "We have a list of users, each with multiple roles. We want a master list of all unique roles. \n\n1. Explode all roles: `.users[].roles[]`\n2. Collect them back into one big array: `[...]`\n3. Use `unique` to deduplicate and sort.",
    hint: "Explode roles, collect to array, then unique",
    input: JSON.stringify(API_DATA, null, 2),
    query: "[.users[].roles[]] | unique"
  },
  {
    id: "array-to-csv",
    title: "Export to CSV",
    category: "Arrays",
    description: "Convert a list of objects into CSV format.",
    narrative: "Management wants a CSV report. \n\njq has a built-in `@csv` filter! But first, we must convert our objects into an array of values (rows), like `[.id, .name, .email]`.",
    hint: "Map objects to arrays of values, then pipe to @csv",
    input: JSON.stringify(API_DATA, null, 2),
    query: ".users | map([.id, .name, .email])[] | @csv"
  },

  // ==========================================
  // TOPIC 1: DOCKER & INFRASTRUCTURE INSPECTION
  // ==========================================
  {
    id: "docker-env-vars",
    title: "Extract Environment Variables",
    category: "Docker/Infra",
    description: "Convert a container's environment list into a key-value object.",
    narrative: "Docker gives us Env vars as strings: `[\"KEY=VAL\"]`. We want a real object. \n\nWe need to `split` each string by the `=` character. Then we can map them to `{key, value}` pairs and use `from_entries` to build our object.",
    hint: "map(split(\"=\") | {key: .[0], value: .[1]}) | from_entries",
    input: JSON.stringify(DOCKER_INSPECT_JSON, null, 2),
    query: ".[] | .Config.Env | map(split(\"=\") | {key: .[0], value: .[1]}) | from_entries"
  },
  {
    id: "docker-bind-mounts",
    title: "Audit Host Bind Mounts",
    category: "Docker/Infra",
    description: "Find which files on the host machine are mapped into containers.",
    narrative: "Security audit time! We need to see what host files are exposed. \n\nLook inside `.Mounts`. We only care about the ones where `Type == \"bind\"`. Let's format a nice string showing Source -> Dest.",
    hint: "Filter .Mounts[] for Type == \"bind\"",
    input: JSON.stringify(DOCKER_INSPECT_JSON, null, 2),
    query: ".[] | .Mounts[] | select(.Type == \"bind\") | \"\\(.Source) -> \\(.Destination)\""
  },
  {
    id: "docker-health-check",
    title: "Container Health Status",
    category: "Docker/Infra",
    description: "Quickly check if containers are healthy and running.",
    narrative: "Is the system healthy? The status is buried deep in `.State.Health`. \n\nLet's pull it out along with the container Name to create a simple dashboard view.",
    hint: "Access .State.Health.Status",
    input: JSON.stringify(DOCKER_INSPECT_JSON, null, 2),
    query: ".[] | {Name, Status: .State.Health.Status, Restarting: .State.Restarting}"
  },
  {
    id: "docker-network-ip",
    title: "Get Container IP",
    category: "Docker/Infra",
    description: "Extract the IP address from the specific network bridge.",
    narrative: "We need the IP address. The tricky part is that the network name (like `app_net`) might change. \n\nInstead of hardcoding the network name, we can iterate over `.NetworkSettings.Networks[]` to get *whatever* network is there.",
    hint: "Iterate .NetworkSettings.Networks[]",
    input: JSON.stringify(DOCKER_INSPECT_JSON, null, 2),
    query: ".[] | .NetworkSettings.Networks[] | .IPAddress"
  },
  {
    id: "docker-labels-lookup",
    title: "Find Service by Label",
    category: "Docker/Infra",
    description: "Select containers based on Docker Compose labels.",
    narrative: "Docker Compose adds labels to everything. Let's find the container that corresponds to the `web` service. \n\nWe can look up the label `com.docker.compose.service` directly in our `select` filter.",
    hint: "select(.Config.Labels[\"com.docker.compose.service\"] == \"web\")",
    input: JSON.stringify(DOCKER_INSPECT_JSON, null, 2),
    query: ".[] | select(.Config.Labels[\"com.docker.compose.service\"] == \"web\") | .Id"
  },

  // ==========================================
  // TOPIC 2: LOOKER API & BI DATA MANIPULATION
  // ==========================================
  {
    id: "looker-vis-types",
    title: "Audit Visualization Types",
    category: "Looker/BI",
    description: "List every type of chart used in a dashboard.",
    narrative: "We're auditing our dashboard. What kind of charts are we using? \n\nDive into `dashboard_elements`. The visualization config is nested inside `.query.vis_config`. We just want the `type`.",
    hint: "Path: .dashboard_elements[] -> .query -> .vis_config -> .type",
    input: JSON.stringify(LOOKER_DASHBOARD_JSON, null, 2),
    query: ".dashboard_elements[] | .query.vis_config.type"
  },
  {
    id: "looker-broken-filters",
    title: "Find Hardcoded Filters",
    category: "Looker/BI",
    description: "Identify tiles that have hardcoded filters applied.",
    narrative: "Hardcoded filters can hide data. Let's find them. \n\nThe `filters` field is a key-value object. We can use `to_entries` to turn it into a list so we can see exactly what's being filtered.",
    hint: "Use to_entries on the filters object",
    input: JSON.stringify(LOOKER_DASHBOARD_JSON, null, 2),
    query: ".dashboard_elements[] | select(.query.filters != null) | {Title: .title, Filters: .query.filters}"
  },
  {
    id: "looker-field-usage",
    title: "Extract Used Fields",
    category: "Looker/BI",
    description: "Get a unique list of all fields (dimensions/measures) used in a dashboard.",
    narrative: "The DBA wants to know which columns we are actually querying. \n\nWe need to grab `.query.fields` from *every* element, flatten them into one big list, and then find the `unique` ones.",
    hint: "Collect all fields into one array, then unique",
    input: JSON.stringify(LOOKER_DASHBOARD_JSON, null, 2),
    query: "[.dashboard_elements[].query.fields[]] | unique"
  },
  {
    id: "looker-missing-titles",
    title: "Validation: Missing Titles",
    category: "Looker/BI",
    description: "Find dashboard elements that have no title set.",
    narrative: "Quality Control! Every chart needs a title. \n\nFind elements where `.title` is either `null` OR an empty string `\"\"`.",
    hint: "select(.title == null or .title == \"\")",
    input: JSON.stringify(LOOKER_DASHBOARD_JSON, null, 2),
    query: ".dashboard_elements[] | select(.title == null or .title == \"\") | .id"
  },
  {
    id: "looker-config-migration",
    title: "Batch Update Vis Config",
    category: "Looker/BI",
    description: "Simulate a migration by modifying a nested config value.",
    narrative: "We need to enable 'View Names' on all our grid charts. \n\nUse the update operator `|=` to drill down to `show_view_names` and set it to `true`. Make sure to only select the grids first!",
    hint: "select type == looker_grid, then update |= true",
    input: JSON.stringify(LOOKER_DASHBOARD_JSON, null, 2),
    query: ".dashboard_elements[] | select(.query.vis_config.type == \"looker_grid\") | .query.vis_config.show_view_names |= true"
  },

  // ==========================================
  // TOPIC 3: GENAI & OPENTELEMETRY LOGS
  // ==========================================
  {
    id: "genai-token-cost",
    title: "Calculate Token Cost",
    category: "GenAI/Logs",
    description: "Extract token usage and calculate estimated cost.",
    narrative: "LLMs are expensive! Let's calculate the cost of this trace. \n\nWe can do math directly in jq. Multiply the `total_tokens` by our cost per token (e.g., 0.00003).",
    hint: "Multiply .attributes[\"llm.usage.total_tokens\"] * 0.00003",
    input: JSON.stringify(GENAI_TRACE_JSON, null, 2),
    query: ".spans[] | select(.attributes[\"llm.usage.total_tokens\"]) | {model: .attributes[\"llm.request.model\"], cost: (.attributes[\"llm.usage.total_tokens\"] * 0.00003)}"
  },
  {
    id: "genai-prompt-extract",
    title: "Extract Prompts",
    category: "GenAI/Logs",
    description: "Retrieve the raw prompt text sent to the LLM.",
    narrative: "What did the user actually ask? \n\nThe prompt is hidden in the attributes with a weird key: `gen_ai.prompt.0.content`. Let's extract it.",
    hint: "Access the key .attributes[\"gen_ai.prompt.0.content\"]",
    input: JSON.stringify(GENAI_TRACE_JSON, null, 2),
    query: ".spans[] | .attributes[\"gen_ai.prompt.0.content\"] // empty"
  },
  {
    id: "genai-latency-check",
    title: "High Latency Spans",
    category: "GenAI/Logs",
    description: "Find LLM calls that took longer than 1 second.",
    narrative: "Performance check. We have start and end times in *nanoseconds*. \n\nWe need to subtract them, divide by 1,000,000,000 to get seconds, and then check if it's > 1.0.",
    hint: "(end - start) / 1000000000",
    input: JSON.stringify(GENAI_TRACE_JSON, null, 2),
    query: ".spans[] | select((.end_time_unix_nano - .start_time_unix_nano) / 1000000000 > 1) | {name, duration_sec: ((.end_time_unix_nano - .start_time_unix_nano) / 1000000000)}"
  },
  {
    id: "genai-tool-args",
    title: "Parse Tool Arguments",
    category: "GenAI/Logs",
    description: "Extract and parse nested JSON strings in tool calls.",
    narrative: "Inception time! The tool arguments are stored as a *JSON string* inside the JSON. \n\nWe need to use `fromjson` to parse that string into a real object so we can read the values inside.",
    hint: "Use fromjson on the tool.args string",
    input: JSON.stringify(GENAI_TRACE_JSON, null, 2),
    query: ".spans[] | select(.name == \"tool_execution\") | .attributes[\"tool.args\"] | fromjson | .x"
  },
  {
    id: "genai-error-rate",
    title: "Filter Failed Spans",
    category: "GenAI/Logs",
    description: "Find any span where the status code is not OK.",
    narrative: "Did anything fail? \n\nCheck the `.status.code`. If it's not \"OK\", we want to see it.",
    hint: "select(.status.code != \"OK\")",
    input: JSON.stringify(GENAI_TRACE_JSON, null, 2),
    query: ".spans[] | select(.status.code != \"OK\") | {span: .name, error: .status.description}"
  },

  // ==========================================
  // TOPIC 4: INGESTION PIPELINES (STRIPE/SAAS)
  // ==========================================
  {
    id: "ingest-flatten-lines",
    title: "Flatten Invoice Lines",
    category: "Ingestion",
    description: "Unnest line items to create a flat CSV-ready structure.",
    narrative: "We have invoices with nested line items. We want a flat table. \n\nWe need to iterate the lines, but we also want to keep the Invoice ID from the parent. We can save the parent to a variable `as $parent` before we dive into the lines.",
    hint: "Use . as $parent to save context",
    input: JSON.stringify(STRIPE_INVOICE_JSON, null, 2),
    query: ".data[] | . as $parent | .lines.data[] | {InvoiceID: $parent.id, Status: $parent.status, Item: .description, Amount: .amount}"
  },
  {
    id: "ingest-sum-metadata",
    title: "Sum by Region Metadata",
    category: "Ingestion",
    description: "Aggregate amounts based on a nested metadata field.",
    narrative: "Let's calculate revenue by Region. \n\n1. Drill down to the line items.\n2. `group_by` the region metadata.\n3. Sum the amounts in each group.",
    hint: "group_by(.metadata.region) | map(... add)",
    input: JSON.stringify(STRIPE_INVOICE_JSON, null, 2),
    query: ".data[].lines.data | group_by(.metadata.region) | map({region: .[0].metadata.region, total: (map(.amount) | add)})"
  },
  {
    id: "ingest-schema-validation",
    title: "Detect Missing Fields",
    category: "Ingestion",
    description: "Identify records that are missing critical keys.",
    narrative: "Bad data check. Does every record have a currency? \n\nWe can select records where `.currency` is null to find the broken ones.",
    hint: "select(.currency == null)",
    input: JSON.stringify(STRIPE_INVOICE_JSON, null, 2),
    query: ".data[] | select(.currency == null) | .id"
  },
  {
    id: "ingest-currency-norm",
    title: "Normalize Currency",
    category: "Ingestion",
    description: "Convert cents to dollars during extraction.",
    narrative: "Stripe gives us amounts in cents (2500). We want dollars (25.00). \n\nSimple math: just divide by 100.",
    hint: ".amount_due / 100",
    input: JSON.stringify(STRIPE_INVOICE_JSON, null, 2),
    query: ".data[] | {id, amount_dollars: (.amount_due / 100)}"
  },

  // ==========================================
  // TOPIC 5: BIGQUERY & ADVANCED NESTED DATA
  // ==========================================
  {
    id: "bq-parse-nested-string",
    title: "Parse JSON String Column",
    category: "BigQuery",
    description: "Parse a JSON string stored inside a JSON column.",
    narrative: "BigQuery often stores flexible data as a JSON string. \n\nWe need to parse `.custom_attributes` with `fromjson` to turn it into a real array we can work with.",
    hint: ".custom_attributes | fromjson",
    input: JSON.stringify(BQ_JSON_EXPORT, null, 2),
    query: ".[] | {id: .row_id, attributes: (.custom_attributes | fromjson)}"
  },
  {
    id: "bq-pivot-attributes",
    title: "Pivot Key-Value Array",
    category: "BigQuery",
    description: "Transform an array of {key, value} into a flat object.",
    narrative: "We have an array like `[{key: \"tier\", value: \"gold\"}]`. We want `{\"tier\": \"gold\"}`. \n\n`from_entries` expects exactly this format (keys named `key` and `value`). It does the pivot for us automatically!",
    hint: "Pipe the array to from_entries",
    input: JSON.stringify(BQ_JSON_EXPORT, null, 2),
    query: ".[] | {id: .row_id} + (.custom_attributes | fromjson | map({key: .key, value: .value}) | from_entries)"
  },
  {
    id: "bq-deep-pluck",
    title: "Deep Coordinate Extraction",
    category: "BigQuery",
    description: "Extract values from a fixed array index deep in the structure.",
    narrative: "We just want the Latitude. \n\nNavigate down to `.coords` and pick the first element `[0]`.",
    hint: ".user_info.geo.coords[0]",
    input: JSON.stringify(BQ_JSON_EXPORT, null, 2),
    query: ".[] | {id: .user_info.id, lat: .user_info.geo.coords[0]}"
  },
  {
    id: "bq-conditional-flatten",
    title: "Conditional Flattening",
    category: "BigQuery",
    description: "Only extract attributes if they exist.",
    narrative: "Not everyone has a 'tier'. \n\nWe can parse the attributes and try to find the one where `.key == \"tier\"`. If it's not there, we just get nothing (or null), which is safe.",
    hint: "select(.key == \"tier\")",
    input: JSON.stringify(BQ_JSON_EXPORT, null, 2),
    query: ".[] | .custom_attributes | fromjson | .[] | select(.key == \"tier\") | .value"
  },

  // ==========================================
  // TOPIC 6: ADVANCED / UTILITY RECIPES
  // ==========================================
  {
    id: "adv-recursive-search",
    title: "Recursive Key Search",
    category: "Advanced",
    description: "Find the value of a key anywhere in the JSON, no matter how deep.",
    narrative: "Where is the IP Address? It could be anywhere. \n\nThe `..` operator recursively descends the entire tree. We can pipe everything to `.IPAddress?` to see if it exists.",
    hint: ".. | .IPAddress?",
    input: JSON.stringify(DOCKER_INSPECT_JSON, null, 2),
    query: ".. | .IPAddress? | select(. != null)"
  },
  {
    id: "adv-diff-objects",
    title: "Diffing Objects",
    category: "Advanced",
    description: "Compare values between elements to find changes.",
    narrative: "What changed? \n\njq supports subtraction on objects! `Object A - Object B` removes keys from A that are identical in B, leaving only the differences.",
    hint: ".[1] - .[0]",
    input: JSON.stringify([{ "a": 1, "b": 2 }, { "a": 1, "b": 3 }], null, 2),
    query: ".[1] - .[0]"
  },
  {
    id: "adv-generate-sql",
    title: "Generate SQL Inserts",
    category: "Advanced",
    description: "Turn JSON data into SQL INSERT statements.",
    narrative: "Let's generate some SQL. \n\nWe can build a string using string interpolation `\"\\(...)\"`. We just plug in the values we need.",
    hint: "Construct a string: \"INSERT INTO ... values (\\(.id))\"",
    input: JSON.stringify(BQ_JSON_EXPORT, null, 2),
    query: ".[] | \"INSERT INTO users (id, city) VALUES (\\\\(.user_info.id), '\\\\(.user_info.geo.city)');\""
  },
  {
    id: "adv-mask-recursive",
    title: "Recursive PII Masking",
    category: "Advanced",
    description: "Mask a specific key name anywhere it appears in the structure.",
    narrative: "We need to redact 'secret' keys *everywhere*. \n\n`walk` lets us visit every node in the tree. We check `if` it's an object `and` has a \"secret\" key, then we redact it.",
    hint: "walk(if type == \"object\" ...)",
    input: JSON.stringify({ user: { secret: "abc" }, meta: { secret: "xyz" } }, null, 2),
    query: "walk(if type == \"object\" and has(\"secret\") then .secret = \"***\" else . end)"
  },
  {
    id: "adv-env-vars-export",
    title: "Generate .env File",
    category: "Advanced",
    description: "Convert a JSON key-value object into a .env file format.",
    narrative: "We want a `.env` file. \n\n`to_entries` gives us key/value pairs. We can then format them as `KEY=VALUE` strings.",
    hint: "to_entries | \"\\(.key)=\\(.value)\"",
    input: JSON.stringify({ DB_HOST: "localhost", DB_PORT: 5432 }, null, 2),
    query: "to_entries[] | \"\\(.key)=\\(.value)\""
  }
];
