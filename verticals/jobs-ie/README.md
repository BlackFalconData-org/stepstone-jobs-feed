# Jobs.ie Scraper — Irish Job Listings, Salary & Skills

Extract structured job data from **[jobs.ie](https://www.jobs.ie)**, Ireland's leading e-recruitment platform. Title, company, salary, location, contract type, full description, skills, and employer profiles — 47 fields per listing, incremental mode, and a compact AI/MCP output. A dedicated Irish scraper built on a proven StepStone Group engine.

**[Jobs.ie Scraper on Apify →](https://apify.com/blackfalcondata/jobs-ie-scraper?fpr=1h3gvi)**

> jobs.ie is part of **The Stepstone Group** (the same family as Totaljobs, StepStone, IrishJobs and NIJobs). This scraper runs on our production StepStone engine — the same one already trusted across 18 European portals — tuned specifically for the Irish market.

---

## 🚀 How to use this actor

> ### 💚 $5 free Apify credits — every month. No credit card required.

### 👉 [Sign up free on Apify →](https://console.apify.com/sign-up?fpr=1h3gvi)

1. **Sign up** — GitHub, Google, or email; ~30 seconds
2. **Open the actor** — input is pre-filled with a working Irish example
3. **Click Start** — export as JSON, CSV, or Excel

Your **$5 monthly platform credit** covers several thousand Irish listings per run.

---

## Why this over a generic scraper

Competing jobs.ie scrapers stop at ~30 fields and offer no enrichment. This one is built on an engine that already powers salary parsing, skills extraction, and company enrichment across the whole StepStone Group — so the Irish vertical inherits all of it.

| Capability | Typical jobs.ie scraper | This scraper |
|---|---|---|
| Fields per listing | ~30 | **47** |
| Skills extraction | ❌ | ✅ `skills` |
| Company enrichment | Published data only | ✅ rating, benefits, website, contact |
| Structured salary (min/max/currency/period) | ✅ | ✅ `ceSalary`, `unifiedSalary` |
| Incremental / new-jobs-only mode | Repost flag | ✅ `incremental` + cross-run dedup |
| Compact / MCP mode for AI agents | ❌ | ✅ `compact`, `descriptionMaxLength` |
| Description formats | HTML / text / markdown | HTML / text / markdown |
| Always-present schema (null, never omitted) | ⚠️ | ✅ |

---

## Key features

- **Ireland-focused** — jobs.ie search, Irish locations, EUR salaries. Not a global tool with a country dropdown.
- **Search with filters** — keyword, location, contract type, radius, posted-within-N-days, remote.
- **Detail enrichment** — full descriptions, salary, employer profile, and contact details per listing.
- **Incremental mode** — return only new or changed listings across scheduled runs via a stable state store.
- **Compact output** — core fields only for AI-agent / MCP workflows; cap description length to control tokens.
- **Structured salary** — parsed min/max, currency, and period; `null` when unpublished, never guessed.
- **Export anywhere** — JSON, CSV, Excel; stream via Apify API, webhooks, Make, Zapier, Airbyte, Keboola.

---

## Quick start

```json
{
  "query": "software developer",
  "location": "Dublin",
  "maxResults": 50,
  "includeDetails": true
}
```

---

## Core input parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | string | — | Job keyword (e.g. 'software developer', 'nurse') |
| `location` | string | `"Dublin"` | Irish city or county |
| `radius` | enum | — | Search radius around location (km) |
| `age` | integer | — | Only jobs posted within this many days |
| `remote` | boolean | — | Remote / work-from-home only |
| `contractType` | enum | — | Filter by employment type |
| `includeDetails` | boolean | `true` | Fetch full description, salary, ISO dates, geo |
| `mode` | enum | `"full"` | `full` = all jobs; `incremental` = new/changed only |
| `compact` | boolean | `false` | Emit only the essential fields (AI/MCP-friendly) |
| `descriptionMaxLength` | integer | `0` | Truncate description to N chars (0 = no limit) |
| `maxResults` | integer | `25` | Cap on listings returned (0 = unlimited) |
| `proxyConfiguration` | object | Apify Proxy | Route through Apify or your own proxy |

Full parameter reference: see the [main StepStone actor docs](https://apify.com/blackfalcondata/stepstone-jobs-feed?fpr=1h3gvi).

---

## Output fields

Every listing returns the same 47-field schema; missing values are `null`, never omitted. Highlights:

`jobKey` · `title` · `company` · `location` · `postCode` · `url` · `datePosted` · `postedDaysAgo` · `workFromHome` · `companyId` · `companyUrl` · `companyLogoUrl` · `skills` · `unifiedSalary` · `ceSalary` · `salaryDetail` · `employmentType` · `validThrough` · `locationDetail` · `directApply` · `industry` · `companyRating` · `benefits` · `companyWebsite` · `description` · `geo` · `scrapedAt` — and more.

---

## Pricing

Pay only for what you extract. No subscription. Apify's free $5 monthly credit covers thousands of Irish listings.

| Event | Price (USD) |
| --- | --- |
| Actor Start | $0.00005 |
| result | (see actor page) |

See the [actor on Apify](https://apify.com/blackfalcondata/jobs-ie-scraper?fpr=1h3gvi) for current per-result pricing.

---

## FAQ

**Is jobs.ie the same as irishjobs.ie?**
No — both are Irish brands of The Stepstone Group, but different sites with different listings. We offer a dedicated scraper for each: [Jobs.ie Scraper](https://apify.com/blackfalcondata/jobs-ie-scraper?fpr=1h3gvi) and [IrishJobs.ie Scraper](https://apify.com/blackfalcondata/irishjobs-scraper?fpr=1h3gvi). Run both to cover the full Irish StepStone ecosystem.

**Is it legal to scrape jobs.ie?**
Scraping publicly available data is generally legal. This actor accesses only publicly visible information. Review jobs.ie's terms and applicable law (incl. GDPR) for your use case.

**Do I need an API key?**
No. Sign up for Apify, paste your input, click Start.

---

## Related products by Black Falcon Data

- [IrishJobs.ie Scraper](https://apify.com/blackfalcondata/irishjobs-scraper?fpr=1h3gvi) — the sister Irish brand
- [StepStone Jobs Scraper — 18 Portals](https://apify.com/blackfalcondata/stepstone-jobs-feed?fpr=1h3gvi) — the multi-portal engine
- [Indeed Job Scraper](https://apify.com/blackfalcondata/indeed-job-scraper?fpr=1h3gvi)
- [LinkedIn Jobs Scraper](https://apify.com/blackfalcondata/linkedin-jobs-scraper?fpr=1h3gvi)

---

*Built and maintained by [Black Falcon Data](https://www.blackfalcondata.com).*
