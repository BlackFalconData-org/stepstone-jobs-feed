# Jobs.ie Scraper (Apify actor)

Apify actor that extracts structured job listings from **[jobs.ie](https://www.jobs.ie)** (The Stepstone Group). Marketing / landing copy lives in [`../README.md`](../README.md); the competitive analysis is in [`../COMPETITIVE.md`](../COMPETITIVE.md).

> **Status: scaffold.** The crawler flow, output schema, dedup/incremental mode, compact/MCP output, and proxy handling are complete. The CSS selectors in `src/parse.ts` and the search query-parameter names in `src/urls.ts` are placeholders that **must be verified against live jobs.ie HTML** (jobs.ie is bot-protected and returned 503 to unauthenticated fetches during scaffolding). JSON-LD `JobPosting` parsing is the robust primary path and needs no selector tuning.

## Layout

```
.actor/
  actor.json           Actor metadata
  input_schema.json    Apify input form
  dataset_schema.json  Dataset "overview" table view
  Dockerfile           Build image (apify/actor-node:20)
src/
  main.ts              Entry point + CheerioCrawler flow (LIST → DETAIL)
  types.ts             Input + 47-field JobRecord types
  schema.ts            blankRecord(), compact mode, description truncation, field selection
  urls.ts              jobs.ie search-URL builder  ← verify query params
  parse.ts             Search-card + JSON-LD detail parsing, salary normaliser  ← verify selectors
  dedup.ts             Incremental / cross-run dedup via named KV store
  parse.test.ts        Unit tests for salary + job-key parsing
storage/                Local INPUT.json example
```

## Run locally

```bash
npm install
npm run build
npm test            # unit tests (no network)
npm start           # runs against storage/.../INPUT.json (needs proxy for jobs.ie)
```

Or with the Apify CLI: `apify run` (after `apify login`).

## Going to production — checklist

1. Open a live jobs.ie search, apply each filter, and copy the resulting URLs → fix the query-param names in `src/urls.ts`.
2. Inspect a search page and a detail page → confirm/replace the card selectors in `parse.ts` (`parseSearchCards`, `extractSkills`, `extractBenefits`, `formatDescription`).
3. Prefer wiring the shared Black Falcon Data StepStone engine here instead of bespoke selectors — jobs.ie is the same Totaljobs stack already handled there.
4. Set pricing to **~$1.00–1.20 per 1k results** to undercut `unfenced-group/jobs-ie-scraper` (see `../COMPETITIVE.md`).
5. Publish as `blackfalcondata/jobs-ie-scraper`; cross-link from the IrishJobs and StepStone actors.
