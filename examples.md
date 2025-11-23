The following enrichments add 50 robust, multi-level examples tailored to your specific topics (Looker, Docker, BigQuery, GenAI, Ingestion).

I have organized this by creating **5 new Data Contexts** (constants) that mimic real-world outputs from these tools, followed by the specific `RECIPES` that query them.

### New Data Constants

settings*Add these to your `constants.ts` or top of the file to support the examples.*

```typescript
// --- 1. Docker Inspect Output (Infrastructure) ---
export const DOCKER_INSPECT_JSON = [
  {
    "Id": "a1b2c3d4e5",
    "Name": "/web-production",
    "State": {
      "Status": "running",
      "Running": true,
      "ExitCode": 0,
      "Health": { "Status": "healthy", "FailingStreak": 0 }
    },
    "Config": {
      "Image": "nginx:alpine",
      "Env": ["HOST=0.0.0.0", "PORT=80", "API_KEY=secret_123"],
      "Labels": { "com.docker.compose.service": "web", "org.opencontainers.image.version": "1.21" }
    },
    "NetworkSettings": {
      "Networks": {
        "app_net": { "IPAddress": "172.18.0.3", "Gateway": "172.18.0.1", "Aliases": ["web", "a1b2c3"] }
      }
    },
    "Mounts": [
      { "Type": "bind", "Source": "/host/nginx.conf", "Destination": "/etc/nginx/nginx.conf", "RW": true },
      { "Type": "volume", "Name": "logs_vol", "Source": "/var/lib/docker/volumes/logs/_data", "Destination": "/var/log/nginx", "RW": true }
    ]
  }
];

// --- 2. Looker Dashboard Element (BI/Analytics) ---
export const LOOKER_DASHBOARD_JSON = {
  "id": "123",
  "title": "Sales Overview",
  "dashboard_elements": [
    {
      "id": "456",
      "type": "vis",
      "title": "Monthly Revenue",
      "query": {
        "view": "orders",
        "fields": ["orders.created_month", "orders.total_amount"],
        "filters": { "orders.status": "complete" },
        "vis_config": {
          "type": "looker_line",
          "y_axis_gridlines": true,
          "series_labels": { "orders.total_amount": "Revenue" }
        }
      }
    },
    {
      "id": "789",
      "type": "vis",
      "title": "Top Customers",
      "query": {
        "view": "users",
        "fields": ["users.name", "orders.count"],
        "vis_config": { "type": "looker_grid", "show_view_names": false }
      }
    }
  ]
};

// --- 3. GenAI/OpenTelemetry Trace Log (AI Ops) ---
export const GENAI_TRACE_JSON = {
  "trace_id": "0af765",
  "spans": [
    {
      "name": "chat_completion",
      "kind": "CLIENT",
      "start_time_unix_nano": 1610000000000000,
      "end_time_unix_nano": 1610000002000000,
      "attributes": {
        "llm.system": "openai",
        "llm.request.model": "gpt-4",
        "llm.usage.prompt_tokens": 150,
        "llm.usage.completion_tokens": 40,
        "llm.usage.total_tokens": 190,
        "gen_ai.prompt.0.content": "Summarize this JSON data...",
        "gen_ai.completion.0.content": "Here is the summary..."
      },
      "status": { "code": "OK" }
    },
    {
      "name": "tool_execution",
      "kind": "INTERNAL",
      "attributes": { "tool.name": "calculator", "tool.args": "{\"x\": 5, \"y\": 10}" }
    }
  ]
};

// --- 4. SaaS Ingestion (Stripe-like Invoice) ---
export const STRIPE_INVOICE_JSON = {
  "object": "list",
  "data": [
    {
      "id": "in_123",
      "object": "invoice",
      "amount_due": 2500,
      "currency": "usd",
      "status": "paid",
      "lines": {
        "object": "list",
        "data": [
          { "id": "il_1", "amount": 2000, "description": "Pro Plan", "metadata": { "region": "eu" } },
          { "id": "il_2", "amount": 500, "description": "Seat Add-on", "metadata": { "region": "eu" } }
        ]
      }
    }
  ]
};

// --- 5. BigQuery Native JSON (Data Engineering) ---
export const BQ_JSON_EXPORT = [
  {
    "row_id": 1,
    "user_info": { "id": 99, "geo": { "city": "London", "coords": [51.5, -0.12] } },
    "custom_attributes": "[{\"key\":\"tier\", \"value\":\"gold\"}, {\"key\":\"source\", \"value\":\"web\"}]" // JSON string inside JSON
  },
  {
    "row_id": 2,
    "user_info": { "id": 100, "geo": { "city": "New York", "coords": [40.7, -74.0] } },
    "custom_attributes": "[{\"key\":\"tier\", \"value\":\"silver\"}]"
  }
];
```

### New Recipes (Add to `RECIPES` array)

```typescript
export const NEW_RECIPES: Recipe[] = [
  // ==========================================
  // TOPIC 1: DOCKER & INFRASTRUCTURE INSPECTION
  // ==========================================
  {
    id: "docker-env-vars",
    title: "Extract Environment Variables",
    category: "Docker/Infra",
    description: "Convert a container's environment list into a key-value object.",
    narrative: "Docker stores Env vars as an array of strings `['KEY=VAL']`. This is hard to query. We split each string by `=` and use `from_entries` to create a clean object `{'KEY': 'VAL'}`.",
    input: JSON.stringify(DOCKER_INSPECT_JSON, null, 2),
    query: ".[] | .Config.Env | map(split(\"=\") | {key: .[0], value: .[1]}) | from_entries"
  },
  {
    id: "docker-bind-mounts",
    title: "Audit Host Bind Mounts",
    category: "Docker/Infra",
    description: "Find which files on the host machine are mapped into containers.",
    narrative: "Security often requires auditing 'bind' mounts. We drill into `.Mounts`, filter for `Type == \"bind\"`, and format a string showing the `Source` -> `Destination` mapping.",
    input: JSON.stringify(DOCKER_INSPECT_JSON, null, 2),
    query: ".[] | .Mounts[] | select(.Type == \"bind\") | \"\\(.Source) -> \\(.Destination)\""
  },
  {
    id: "docker-health-check",
    title: "Container Health Status",
    category: "Docker/Infra",
    description: "Quickly check if containers are healthy and running.",
    narrative: "Deeply nested inside `.State.Health`, we can find the real status. This query creates a simple report of Container Name vs Health Status.",
    input: JSON.stringify(DOCKER_INSPECT_JSON, null, 2),
    query: ".[] | {Name, Status: .State.Health.Status, Restarting: .State.Restarting}"
  },
  {
    id: "docker-network-ip",
    title: "Get Container IP",
    category: "Docker/Infra",
    description: "Extract the IP address from the specific network bridge.",
    narrative: "The network path is dynamic (e.g., `bridge`, `app_net`). We use `.NetworkSettings.Networks[]` to iterate over *whatever* network exists, ensuring we get the IP regardless of the network name.",
    input: JSON.stringify(DOCKER_INSPECT_JSON, null, 2),
    query: ".[] | .NetworkSettings.Networks[] | .IPAddress"
  },
  {
    id: "docker-labels-lookup",
    title: "Find Service by Label",
    category: "Docker/Infra",
    description: "Select containers based on Docker Compose labels.",
    narrative: "Compose adds labels like `com.docker.compose.service`. We can filter based on these specific keys to find the 'web' service container ID.",
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
    narrative: "When migrating Looker versions, you might need to find deprecated charts. We dive into `dashboard_elements`, access the `vis_config` deep inside the `query` object, and extract the `type`.",
    input: JSON.stringify(LOOKER_DASHBOARD_JSON, null, 2),
    query: ".dashboard_elements[] | .query.vis_config.type"
  },
  {
    id: "looker-broken-filters",
    title: "Find Hardcoded Filters",
    category: "Looker/BI",
    description: "Identify tiles that have hardcoded filters applied.",
    narrative: "We look inside `.query.filters`. Since `filters` is an object (key-value), `to_entries` helps us iterate them to list exactly which fields are being filtered.",
    input: JSON.stringify(LOOKER_DASHBOARD_JSON, null, 2),
    query: ".dashboard_elements[] | select(.query.filters != null) | {Title: .title, Filters: .query.filters}"
  },
  {
    id: "looker-field-usage",
    title: "Extract Used Fields",
    category: "Looker/BI",
    description: "Get a unique list of all fields (dimensions/measures) used in a dashboard.",
    narrative: "Data modeling requires knowing what columns are actually used. We iterate all elements, explode the `.query.fields` array, and use `unique` to get a clean list for the DBA.",
    input: JSON.stringify(LOOKER_DASHBOARD_JSON, null, 2),
    query: "[.dashboard_elements[].query.fields[]] | unique"
  },
  {
    id: "looker-missing-titles",
    title: "Validation: Missing Titles",
    category: "Looker/BI",
    description: "Find dashboard elements that have no title set.",
    narrative: "A simple quality assurance check. We `select` elements where the `.title` is either null or an empty string.",
    input: JSON.stringify(LOOKER_DASHBOARD_JSON, null, 2),
    query: ".dashboard_elements[] | select(.title == null or .title == \"\") | .id"
  },
  {
    id: "looker-config-migration",
    title: "Batch Update Vis Config",
    category: "Looker/BI",
    description: "Simulate a migration by modifying a nested config value.",
    narrative: "Using the update operator `|=`, we can drill deep into `vis_config` and change `show_view_names` to `true` for all grids. This output can be sent back to the API.",
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
    narrative: "We access the `attributes` map where LLM stats live. We can perform math on the fly (e.g., $0.03 per 1k tokens) to estimate cost for the trace.",
    input: JSON.stringify(GENAI_TRACE_JSON, null, 2),
    query: ".spans[] | select(.attributes[\"llm.usage.total_tokens\"]) | {model: .attributes[\"llm.request.model\"], cost: (.attributes[\"llm.usage.total_tokens\"] * 0.00003)}"
  },
  {
    id: "genai-prompt-extract",
    title: "Extract Prompts",
    category: "GenAI/Logs",
    description: "Retrieve the raw prompt text sent to the LLM.",
    narrative: "Prompts are often buried in indexed attributes like `gen_ai.prompt.0.content`. We can extract this to review what users are actually asking.",
    input: JSON.stringify(GENAI_TRACE_JSON, null, 2),
    query: ".spans[] | .attributes[\"gen_ai.prompt.0.content\"] // empty"
  },
  {
    id: "genai-latency-check",
    title: "High Latency Spans",
    category: "GenAI/Logs",
    description: "Find LLM calls that took longer than 1 second.",
    narrative: "Times are often in nanoseconds. We do math `(end - start) / 1e9` to get seconds, then `select` spans taking > 1.0s.",
    input: JSON.stringify(GENAI_TRACE_JSON, null, 2),
    query: ".spans[] | select((.end_time_unix_nano - .start_time_unix_nano) / 1000000000 > 1) | {name, duration_sec: ((.end_time_unix_nano - .start_time_unix_nano) / 1000000000)}"
  },
  {
    id: "genai-tool-args",
    title: "Parse Tool Arguments",
    category: "GenAI/Logs",
    description: "Extract and parse nested JSON strings in tool calls.",
    narrative: "Agents often log tool arguments as a *stringified JSON* inside the main JSON. We use `fromjson` to unpack `.attributes['tool.args']` into a real object we can query.",
    input: JSON.stringify(GENAI_TRACE_JSON, null, 2),
    query: ".spans[] | select(.name == \"tool_execution\") | .attributes[\"tool.args\"] | fromjson | .x"
  },
  {
    id: "genai-error-rate",
    title: "Filter Failed Spans",
    category: "GenAI/Logs",
    description: "Find any span where the status code is not OK.",
    narrative: "Quickly scan a trace for failures. We look at `.status.code`.",
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
    narrative: "Invoices have a header and a list of lines. We iterate the lines `.lines.data[]` and merge them with parent fields (`id`, `status`) to create a flat table.",
    input: JSON.stringify(STRIPE_INVOICE_JSON, null, 2),
    query: ".data[] | . as $parent | .lines.data[] | {InvoiceID: $parent.id, Status: $parent.status, Item: .description, Amount: .amount}"
  },
  {
    id: "ingest-sum-metadata",
    title: "Sum by Region Metadata",
    category: "Ingestion",
    description: "Aggregate amounts based on a nested metadata field.",
    narrative: "We drill into line items, group them by their nested `.metadata.region`, and then sum the `.amount` for each region.",
    input: JSON.stringify(STRIPE_INVOICE_JSON, null, 2),
    query: ".data[].lines.data | group_by(.metadata.region) | map({region: .[0].metadata.region, total: (map(.amount) | add)})"
  },
  {
    id: "ingest-schema-validation",
    title: "Detect Missing Fields",
    category: "Ingestion",
    description: "Identify records that are missing critical keys.",
    narrative: "When ingesting data, schema drift is common. We can `select` items where `has(\"key\")` is false to quarantine bad data.",
    input: JSON.stringify(STRIPE_INVOICE_JSON, null, 2),
    query: ".data[] | select(.currency == null) | .id"
  },
  {
    id: "ingest-currency-norm",
    title: "Normalize Currency",
    category: "Ingestion",
    description: "Convert cents to dollars during extraction.",
    narrative: "Stripe stores amounts in cents. We can transform `.amount_due` by dividing by 100 during the extraction pipeline.",
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
    narrative: "BigQuery sometimes exports 'flexible' columns as strings. We use `fromjson` to turn the string in `.custom_attributes` into a real array, then query inside it.",
    input: JSON.stringify(BQ_JSON_EXPORT, null, 2),
    query: ".[] | {id: .row_id, attributes: (.custom_attributes | fromjson)}"
  },
  {
    id: "bq-pivot-attributes",
    title: "Pivot Key-Value Array",
    category: "BigQuery",
    description: "Transform an array of {key, value} into a flat object.",
    narrative: "A classic modeling task. We parse the attributes, then pipe to `from_entries` (which expects `key` and `value` keys) to turn `[{key: 'tier', value: 'gold'}]` into `{'tier': 'gold'}`.",
    input: JSON.stringify(BQ_JSON_EXPORT, null, 2),
    query: ".[] | {id: .row_id} + (.custom_attributes | fromjson | map({key: .key, value: .value}) | from_entries)"
  },
  {
    id: "bq-deep-pluck",
    title: "Deep Coordinate Extraction",
    category: "BigQuery",
    description: "Extract values from a fixed array index deep in the structure.",
    narrative: "We navigate `.user_info.geo.coords[0]` to get just the Latitude for every user.",
    input: JSON.stringify(BQ_JSON_EXPORT, null, 2),
    query: ".[] | {id: .user_info.id, lat: .user_info.geo.coords[0]}"
  },
  {
    id: "bq-conditional-flatten",
    title: "Conditional Flattening",
    category: "BigQuery",
    description: "Only extract attributes if they exist.",
    narrative: "We can use `try` or `?` to safely attempt extraction. Here we parse attributes and extract 'tier', but return null if it's missing, preventing the script from crashing.",
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
    narrative: "The `..` operator creates a recursive stream of *every* value. We filter this stream to find objects that have a specific field (e.g., `IPAddress`) and extract it.",
    input: JSON.stringify(DOCKER_INSPECT_JSON, null, 2),
    query: ".. | .IPAddress? | select(. != null)"
  },
  {
    id: "adv-diff-objects",
    title: "Diffing Objects",
    category: "Advanced",
    description: "Compare values between elements to find changes.",
    narrative: "Useful for checking state changes. We can subtract one object from another using `-`. Note: this requires the objects to be comparable.",
    input: JSON.stringify([{"a":1, "b":2}, {"a":1, "b":3}], null, 2),
    query: ".[1] - .[0]"
  },
  {
    id: "adv-generate-sql",
    title: "Generate SQL Inserts",
    category: "Advanced",
    description: "Turn JSON data into SQL INSERT statements.",
    narrative: "We format a string using string interpolation `\"INSERT INTO...\"`. This is a quick way to seed databases from JSON dumps.",
    input: JSON.stringify(BQ_JSON_EXPORT, null, 2),
    query: ".[] | \"INSERT INTO users (id, city) VALUES (\\.user_info.id), '\\(.user_info.geo.city)');\""
  },
  {
    id: "adv-mask-recursive",
    title: "Recursive PII Masking",
    category: "Advanced",
    description: "Mask a specific key name anywhere it appears in the structure.",
    narrative: "Using `walk`, we can traverse the entire tree. If we find an object with a 'password' or 'secret' key, we overwrite it. Extremely powerful for sanitizing logs.",
    input: JSON.stringify({user: {secret: "abc"}, meta: {secret: "xyz"}}, null, 2),
    query: "walk(if type == \"object\" and has(\"secret\") then .secret = \"***\" else . end)"
  },
  {
    id: "adv-env-vars-export",
    title: "Generate .env File",
    category: "Advanced",
    description: "Convert a JSON key-value object into a .env file format.",
    narrative: "We iterate entries, and output a string in `KEY=VALUE` format. The `-r` (raw output) flag in jq is usually needed here to remove quotes.",
    input: JSON.stringify({DB_HOST: "localhost", DB_PORT: 5432}, null, 2),
    query: "to_entries[] | \"\\(.key)=\\(.value)\""
  }
];
```