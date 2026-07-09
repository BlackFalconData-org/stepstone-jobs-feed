# Jobs.ie Vertical — Feasibility & Competitive Analysis

**Date:** 2026-07-09
**Question:** Can we build a dedicated jobs.ie vertical and surpass [`unfenced-group/jobs-ie-scraper`](https://apify.com/unfenced-group/jobs-ie-scraper)?
**Verdict:** **Yes — high feasibility, strong data advantage. The one gap to close is price.**

---

## 1. Feasibility

**jobs.ie runs on The Stepstone Group / Totaljobs platform** — the exact stack our production engine already scrapes ([jobs.ie about page](https://www.jobs.ie/about/about-us); [Stepstone acquired Saongroup's Irish assets](https://www.staffingindustry.com/news/global-daily-news/ireland-stepstone-buys-saongroup-assets)).

Three independent proofs the engine already works here:

1. **jobs.ie is already a listed supported portal** in `stepstone-jobs-api` (README line 53).
2. **We already ship `blackfalcondata/irishjobs-scraper`** — irishjobs.ie is the sister brand on the same stack.
3. The core engine already handles StepStone/Totaljobs salary parsing, skills, and company enrichment across 18 portals.

→ A dedicated jobs.ie vertical is a **repackaging + positioning** exercise, not new scraping R&D.

---

## 2. Competitor: unfenced-group/jobs-ie-scraper

- **Positioning:** "A dedicated Irish scraper, not a global tool with a country dropdown." (A direct jab at multi-portal tools like ours.)
- **Pricing:** $1.20–$1.50 per 1,000 results (down to $0.90 at premium tiers).
- **Output:** ~30 fields — URL, ID, title, company, company URL/logo, apply URL, city/location/country, contract type, remote flag, raw + parsed salary (min/max/currency/period), description (HTML/text/markdown), publish date, days-ago, `isRepost`, content hash, scrape timestamp.
- **Portfolio play:** they also run `irishjobs-ie-scraper` and `publicjobs-ie-scraper` — covering the Irish market brand-by-brand.
- **Stated limitations:** many `null` salaries; no enrichment beyond published data; URLs expire quickly; pagination bounded by jobs.ie.

---

## 3. Head-to-head

| Dimension | unfenced-group | Our engine | Winner |
|---|---|---|---|
| Fields per listing | ~30 | **47** | **Us** |
| Skills extraction | ❌ | ✅ | **Us** |
| Company enrichment (rating, benefits, website) | ❌ | ✅ | **Us** |
| Contact data for lead-gen | ❌ | ✅ | **Us** |
| Compact / MCP mode for AI agents | ❌ | ✅ | **Us** |
| Description length capping (token control) | ❌ | ✅ | **Us** |
| Structured salary (min/max/currency/period) | ✅ | ✅ | Tie |
| Description formats (HTML/text/md) | ✅ | ✅ | Tie |
| Incremental / dedup across runs | Repost flag, 90-day window | `incremental` + cross-run dedup store | Tie |
| Content-hash change tracking | ✅ | Partial (`harmonisedId`) | Slight edge them |
| **Price per 1k** | **$1.20–1.50** | **~$5** (0.005/result) | **Them ⚠️** |
| Dedicated Irish positioning | ✅ | ❌ (today) | **Them (today)** |

---

## 4. How we surpass them

1. **Close the price gap — the only real weakness.** Our multi-portal actor prices at ~$5/1k; the competitor is ~$1.49/1k. Set a **jobs.ie-specific price of ~$1.00–1.20/1k** to undercut them directly. Margin holds because it's the same engine at scale.
2. **Win on data depth.** Lead with 47 fields, skills, and company enrichment vs their ~30 published-only fields. This is a durable advantage they can't match without building enrichment.
3. **Own the AI/MCP niche.** `compact` + `descriptionMaxLength` + MCP support is a segment they don't serve at all.
4. **Neutralize their core message.** A dedicated `blackfalcondata/jobs-ie-scraper` (hardcoded Irish defaults) removes the "just a country dropdown" objection entirely.
5. **Portfolio coverage.** We already have irishjobs.ie; adding jobs.ie (and later nijobs) lets us pitch "full Irish StepStone ecosystem, one vendor" — matching and extending their portfolio play.

---

## 5. Recommended execution

1. Publish dedicated Apify actor `blackfalcondata/jobs-ie-scraper` — engine reused, `geo`/base URL pinned to jobs.ie, defaults tuned for Ireland (Dublin, EUR).
2. Price at **$1.00–1.20/1k** to undercut unfenced-group.
3. Ship the SEO landing page (see `README.md` in this folder) with the head-to-head table and jobs.ie keywords.
4. Cross-link from the existing irishjobs and StepStone actors.
5. Add `isRepost` / content-hash change tracking to reach full parity on dedup, then lead marketing on depth + price.

---

## 6. Risks (all low)

| Risk | Mitigation |
|---|---|
| Short-lived job URLs | Same limitation competitor discloses; scrape-timestamp + incremental mode handle it |
| Many `null` salaries | Source-driven; we report `null` honestly (same as competitor) |
| Anti-bot / rate limits | Existing proxy support already handles StepStone-family portals |
| Cannibalizing our multi-portal actor | Vertical targets a different buyer (Ireland-only); net-new users |

**Bottom line:** the engine already exists and already beats them on data. Ship a dedicated actor, undercut on price, and lead on depth + AI-mode.
