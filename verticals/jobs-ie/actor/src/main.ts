import { Actor } from 'apify';
import { CheerioCrawler, Dataset, log, type RequestOptions } from 'crawlee';
import type { CheerioAPI } from 'cheerio';
import type { Input, JobRecord } from './types.js';
import { blankRecord, shapeOutput } from './schema.js';
import { buildSearchUrl, isDetailUrl } from './urls.js';
import { parseSearchCards, parseDetail } from './parse.js';
import { DedupStore } from './dedup.js';

await Actor.init();

const input = (await Actor.getInput<Input>()) ?? {};

const {
    query = null,
    includeDetails = true,
    descriptionFormat = 'html',
    mode = 'full',
    stateStoreName = 'jobs-ie-state',
    compact = false,
    descriptionMaxLength = 0,
    outputFields = [],
    maxResults = 25,
    maxPages = 10,
    maxConcurrency = 5,
    maxRequestRetries = 3,
} = input;

const proxyConfiguration = await Actor.createProxyConfiguration(input.proxyConfiguration);

const dedup = new DedupStore(stateStoreName, mode === 'incremental');
await dedup.init();

// Seed requests: explicit startUrls, or a built search URL.
const startRequests: RequestOptions[] = [];
if (input.startUrls?.length) {
    for (const item of input.startUrls) {
        const url = typeof item === 'string' ? item : item.url;
        startRequests.push({ url, userData: { label: isDetailUrl(url) ? 'DETAIL' : 'LIST', page: 1 } });
    }
} else {
    startRequests.push({ url: buildSearchUrl(input, 1), userData: { label: 'LIST', page: 1 } });
}

let pushed = 0;
const limitReached = () => maxResults > 0 && pushed >= maxResults;

const crawler = new CheerioCrawler({
    proxyConfiguration,
    maxConcurrency,
    maxRequestRetries,
    requestHandler: async ({ $, request, addRequests }) => {
        const { label, page } = request.userData as { label: string; page: number };
        // Bridge the ESM/CJS cheerio type identities (dual-package hazard).
        const $$ = $ as unknown as CheerioAPI;

        if (label === 'LIST') {
            const cards = parseSearchCards($$, query);
            log.info(`LIST page ${page}: found ${cards.length} cards`, { url: request.url });

            for (const card of cards) {
                if (limitReached()) break;

                if (includeDetails && card.url) {
                    await addRequests([{ url: card.url, userData: { label: 'DETAIL', record: card } }]);
                } else {
                    await emit(card);
                }
            }

            // Pagination.
            if (!limitReached() && page < maxPages && !input.startUrls?.length) {
                const nextUrl = buildSearchUrl(input, page + 1);
                await addRequests([{ url: nextUrl, userData: { label: 'LIST', page: page + 1 } }]);
            }
            return;
        }

        // DETAIL
        if (limitReached()) return;
        const base = ((request.userData as { record?: JobRecord }).record ?? withUrl(request.url));
        const record = parseDetail($$, base, descriptionFormat);
        await emit(record);
    },
    failedRequestHandler: ({ request }, error) => {
        log.warning(`Request failed: ${request.url} — ${error.message}`);
    },
});

async function emit(record: JobRecord): Promise<void> {
    if (limitReached()) return;
    record.scrapedAt = new Date().toISOString();
    record.geo = record.geo ?? 'IE';

    if (!dedup.isNew(record)) {
        log.debug(`Skipping unchanged listing ${record.jobKey}`);
        return;
    }

    await Dataset.pushData(shapeOutput(record, { compact, descriptionMaxLength, outputFields }));
    pushed += 1;
}

function withUrl(url: string): JobRecord {
    const rec = blankRecord();
    rec.url = url;
    rec.portalUrl = url;
    rec.query = query;
    return rec;
}

await crawler.run(startRequests);
await dedup.persist();

log.info(`Done. Pushed ${pushed} listing(s) to the dataset.`);
await Actor.exit();
