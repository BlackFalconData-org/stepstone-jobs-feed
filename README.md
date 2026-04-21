# StepStone Jobs Scraper - 18 Portals, Salary & Incremental

Extract structured data from [stepstone.de](https://stepstone.de) — stepstone.de and 17 partner portals across DE, AT, BE, NL, and UK. Salary estimates, company profiles, contact details, and 29 search filters. Incremental mode detects new and changed listings. Compact output for AI agents and MCP workflows.

**[StepStone Jobs Scraper - 18 Portals, Salary & Incremental on Apify →](https://apify.com/blackfalcondata/stepstone-jobs-feed?fpr=1h3gvi)**

---

## Key features



**Search with filters** — Search by keyword and location. Filter by country / portal, sort by, radius (km), and more.

**Multiple input modes** — full (all jobs) or incremental (new jobs only). Switch modes without re-scraping.

**Detail enrichment** — Fetch full job descriptions, employer profiles for each listing.

**Compact output** — Emit core fields only (AI-agent / MCP-friendly). Keeps response size small for LLM workflows.

**Description truncation** — Cap description length per listing to control output size and cost.

**Result cap** — Stop after N listings. Set to 0 for the full catalog.

**Proxy support** — Route traffic through Apify Proxy or your own proxy group to avoid regional blocks and rate limits.

**Export anywhere** — Download as JSON, CSV, or Excel. Stream via Apify API, webhooks, or integrations with Make, Zapier, Airbyte, Keboola.

**Structured data** — Every listing returns the same schema with consistent field naming. All fields always present — `null` when unavailable, never omitted.

---

## Use cases



**Data pipeline automation**
Integrate with your ETL pipeline to collect structured listings from stepstone.de on a schedule. Export to CSV, JSON, or directly to your database. Use compact mode to control output size.

**Market research**
Monitor listings, track trends, and analyze market dynamics with structured, deduplicated data from stepstone.de.

**AI / LLM training data**
Structured JSON per listing is ready for RAG pipelines, embeddings, and agent workflows. Compact mode trims tokens for LLM context windows.

---

## Quick start

```json
{
  "query": "software-developer",
  "maxResults": 50,
  "includeDetails": true
}
```

---

## Input parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `startUrls` | array | — | Direct StepStone search URLs to scrape. If provided, query/location/geo are ignored for URL building. |
| `query` | string | — | Job search keyword (e.g., 'software-developer', 'data-analyst'). Not required when startUrls is provided. |
| `location` | string | — | Location filter (e.g., 'Berlin', 'München') |
| `geo` | enum | `"DE"` | Job portal to scrape. Some portals require a paid Apify plan with proxy access. |
| `sort` | enum | `"relevance"` | Sort order for results |
| `age` | integer | — | Only show jobs posted within this many days |
| `remote` | boolean | — | Only show remote/home office positions |
| `radius` | enum | — | Search radius around location in km (requires location) |
| `minSalary` | integer | — | Minimum annual salary filter (EUR) |
| `contractType` | enum | — | Filter by contract/employment type |
| `experience` | enum | — | Filter by experience level |
| `workType` | enum | — | Filter by work schedule (full-time / part-time) |
| `companyId` | integer | — | Filter by StepStone company ID (numeric) |
| `language` | string | — | Filter by job posting language (e.g., 'en', 'de') |
| `applicationMethod` | enum | — | Filter by how to apply (e.g., INTERNAL = apply on company site only) |
| `excludeSponsored` | boolean | `false` | Skip sponsored/promoted listings. Filters out items where isSponsored=true. |
| `includeDetails` | boolean | `true` | Fetch each job's detail page for full description, ISO dates, salary, and geo coordinates. Slower but much richer data. |
| `detailEngine` | enum | `"auto"` | Controls how job detail pages are fetched. Auto (recommended) lets the actor choose the best method automatically. Lightweight is faster but may fail on protected portals. Enhanced is heavier but more reliable. |
| `descriptionFormat` | enum | `"html"` | Format for job description text (requires Include Detail Pages) |
| `maxResults` | integer | `25` | Maximum number of job listings to return (0 = unlimited) |
| `maxPages` | integer | `10` | Maximum number of search result pages to scrape |
| `mode` | enum | `"full"` | full = return all jobs found. incremental = only return jobs not seen in previous runs (requires stateStoreName). |
| `stateStoreName` | string | `"stepstone-state"` | KV store name for incremental state. Use same name across scheduled runs. State is scoped per query+location+geo combination. |
| `dedupStoreName` | string | — | Named KV store for cross-run dedup. Same name across runs = only new jobs pushed. |
| `dedupKey` | string | `"jobKey"` | Field used as unique key for dedup (default: jobKey) |
| `datasetName` | string | — | Custom dataset name. Supports masks: {DATE} = YYYYMMDD, {TIME} = HHMMSS |
| `outputFields` | array | — | Select subset of output fields. Use dot notation for nested: 'ceSalary.min'. If empty: all fields returned. |
| `compact` | boolean | `false` | When true, each result contains only the 11 most essential fields: jobKey, title, company, location, url, portalUrl, datePosted, workFromHome, unifiedSalary, geo, and description. Use this in AI-agent and MCP workflows where token budgets matter. |
| `descriptionMaxLength` | integer | `0` | Truncate the description field to this many characters, appending '...' if truncated. 0 means no truncation. Use in AI-agent workflows to control context window usage. Pairs well with compact mode. |
| `proxyConfiguration` | object | `{"useApifyProxy":true}` | Proxy configuration. Some portals require enhanced proxy (handled automatically). Your Apify plan must include proxy access. |
| `maxConcurrency` | integer | `5` | Maximum number of concurrent requests |
| `maxRequestRetries` | integer | `3` | Maximum number of retries per request |
| `_benchDelayMs` | integer | — | Internal: override request delay for benchmarking. Not for production use. |
| `_benchFreshSession` | boolean | — | Internal: force fresh session per request for benchmarking. Not for production use. |

---

## Output fields

Every listing returns the same 47-field schema. Missing values are `null` — never omitted.

- `jobKey`
- `title`
- `company`
- `location`
- `postCode`
- `url`
- `datePosted`
- `postedDaysAgo`
- `workFromHome`
- `workFromHomeLabel`
- `isSponsored`
- `isTopJob`
- `companyId`
- `companyUrl`
- `companyLogoUrl`
- `textSnippet`
- `textSnippetCleaned`
- `labels`
- `topLabels`
- `skills`
- `harmonisedId`
- `unifiedSalary`
- `hasFuturePosting`
- `partnership`
- `metaData`
- `publishFromDate`
- `publishToDate`
- `isAnonymous`
- `isHighlighted`
- `section`
- `travelTime`
- `geo`
- `query`
- `scrapedAt`
- `portalUrl`
- `detailsFetched`
- `description`
- `employmentType`
- `validThrough`
- `locationDetail`
- `salaryDetail`
- `ceSalary`
- `directApply`
- `industry`
- `companyRating`
- `benefits`
- `companyWebsite`

---

## Sample output

One object per listing. Here is a real example from a production run:

```json
{
  "jobKey": "106979362",
  "title": "Codification Engineer",
  "company": "Morson Edge",
  "location": "Stevenage, Hertfordshire, SG1",
  "postCode": "SG1",
  "url": "https://www.totaljobs.com/job/codification-engineer/morson-edge-job106979362?src=search&page=1&position=1&WT.mc_id=A_PT_CrossBrand_CareerStructure",
  "datePosted": "2026-03-24T10:28:39.177Z",
  "postedDaysAgo": 13,
  "workFromHome": "",
  "workFromHomeLabel": "",
  "isSponsored": false,
  "isTopJob": false
}
```

*Truncated — full records contain 47 fields. See Output fields for the complete schema.*

**[Try StepStone Jobs Scraper - 18 Portals, Salary & Incremental now — $5 free credit, no credit card →](https://apify.com/blackfalcondata/stepstone-jobs-feed?fpr=1h3gvi)**

---

## Pricing

Pay only for what you extract. No subscription required — Apify's free $5 credit covers thousands of results.

| Event | Price (USD) |
| --- | --- |
| Actor Start | $0.00005 |
| result | $0.005 |

See the [actor on Apify](https://apify.com/blackfalcondata/stepstone-jobs-feed?fpr=1h3gvi) for current pricing.

---

## FAQ

**How do I scrape stepstone.de?**
Use this actor on Apify to extract structured data from stepstone.de. Configure your search query and filters in the input, then click Start — no coding required.

**How do I get stepstone.de data as JSON, CSV, or Excel?**
The actor writes each listing to Apify's dataset. Download as JSON, CSV, or Excel from the Console, stream via the API, or push to Make, Zapier, Airbyte, or Keboola.

**Is it legal to scrape stepstone.de?**
Web scraping of publicly available data is generally legal. This actor only accesses publicly visible information. Always check stepstone.de's terms of service for your specific use case.

**How much does it cost?**
Pay-per-event pricing — you only pay for listings extracted. Apify's free $5 credit is enough to run thousands of results before you pay anything.

**Do I need an API key or credentials?**
No. Just sign up for Apify, paste your input, and click Start. No credit card required.

---

## Related products by Black Falcon Data



- [StepStone Scraper](https://apify.com/blackfalcondata/stepstone-scraper?fpr=1h3gvi) — Job listings from 18 European portals
- [Indeed Job Scraper](https://apify.com/blackfalcondata/indeed-job-scraper?fpr=1h3gvi) — Indeed job listings with salary data
- [Glassdoor Job Scraper](https://apify.com/blackfalcondata/glassdoor-job-scraper?fpr=1h3gvi) — Glassdoor listings with company ratings
- [Arbeitsagentur Scraper](https://apify.com/blackfalcondata/arbeitsagentur-scraper?fpr=1h3gvi) — Germany's official job portal (1M+ listings)
- [SEEK Scraper](https://apify.com/blackfalcondata/seek-scraper?fpr=1h3gvi) — Australia & NZ's largest job board
- [Naukri Scraper](https://apify.com/blackfalcondata/naukri-scraper?fpr=1h3gvi) — India's largest job portal

---

## Getting started with Apify

New to Apify? [Create a free account with $5 credit](https://console.apify.com/sign-up?fpr=1h3gvi) — no credit card required.

1. Sign up — $5 platform credit included
2. Open [StepStone Jobs Scraper - 18 Portals, Salary & Incremental](https://apify.com/blackfalcondata/stepstone-jobs-feed?fpr=1h3gvi) and configure your input
3. Click **Start** — export results as JSON, CSV, or Excel

Need more later? [See Apify pricing](https://apify.com/pricing?fpr=1h3gvi).

---

## About Black Falcon Data

Black Falcon Data builds production-grade web scrapers for job boards and marketplace data. Browse our full actor catalog at [www.blackfalcondata.com](https://www.blackfalcondata.com).

---

*Last updated: 2026 04*
