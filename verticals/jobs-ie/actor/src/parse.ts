import type { CheerioAPI } from 'cheerio';
import type { JobRecord, UnifiedSalary } from './types.js';
import { blankRecord } from './schema.js';
import { absoluteUrl } from './urls.js';

const PERIOD_MAP: Record<string, UnifiedSalary['period']> = {
    hour: 'HOUR',
    hourly: 'HOUR',
    day: 'DAY',
    daily: 'DAY',
    week: 'WEEK',
    weekly: 'WEEK',
    month: 'MONTH',
    monthly: 'MONTH',
    annum: 'YEAR',
    annual: 'YEAR',
    year: 'YEAR',
    yearly: 'YEAR',
};

/** Parse a free-text salary string into a normalised structure. */
export function parseSalary(raw: string | null | undefined): UnifiedSalary | null {
    if (!raw || !raw.trim()) return null;
    const text = raw.trim();

    let currency: string | null = null;
    if (/€|\beur\b/i.test(text)) currency = 'EUR';
    else if (/£|\bgbp\b/i.test(text)) currency = 'GBP';
    else if (/\$|\busd\b/i.test(text)) currency = 'USD';

    const numbers = (text.match(/\d[\d,.]*/g) ?? [])
        .map((n) => Number(n.replace(/,/g, '')))
        .filter((n) => Number.isFinite(n) && n > 0);

    let period: UnifiedSalary['period'] = null;
    const lower = text.toLowerCase();
    for (const [word, mapped] of Object.entries(PERIOD_MAP)) {
        if (lower.includes(word)) {
            period = mapped;
            break;
        }
    }

    return {
        min: numbers.length > 0 ? Math.min(...numbers) : null,
        max: numbers.length > 0 ? Math.max(...numbers) : null,
        currency,
        period,
        raw: text,
    };
}

/** Extract the first schema.org JobPosting JSON-LD block on the page. */
export function extractJobPostingJsonLd($: CheerioAPI): Record<string, any> | null {
    const blocks = $('script[type="application/ld+json"]').toArray();
    for (const el of blocks) {
        const txt = $(el).contents().text();
        if (!txt) continue;
        try {
            const parsed = JSON.parse(txt);
            const candidates = Array.isArray(parsed) ? parsed : [parsed, ...(parsed['@graph'] ?? [])];
            for (const c of candidates) {
                if (c && c['@type'] === 'JobPosting') return c;
            }
        } catch {
            // skip malformed block
        }
    }
    return null;
}

function daysAgo(iso: string | null): number | null {
    if (!iso) return null;
    const posted = Date.parse(iso);
    if (Number.isNaN(posted)) return null;
    return Math.max(0, Math.floor((Date.now() - posted) / 86_400_000));
}

/**
 * Parse the job cards on a search results page into partial records plus the
 * detail URL to enqueue.
 *
 * NOTE: the CSS selectors below reflect the Stepstone/Totaljobs card layout and
 * MUST be verified against live jobs.ie HTML. Keep every selector in this one
 * function so verification is a single, contained edit.
 */
export function parseSearchCards($: CheerioAPI, query: string | null): Array<JobRecord> {
    const cards = $('article[data-testid="job-item"], article.job, [data-at="job-item"]').toArray();
    const records: JobRecord[] = [];

    for (const el of cards) {
        const card = $(el);
        const link = card.find('a[data-at="job-item-title"], a.job-title, h2 a').first();
        const href = link.attr('href');
        if (!href) continue;

        const rec = blankRecord();
        rec.url = absoluteUrl(href);
        rec.portalUrl = rec.url;
        rec.title = link.text().trim() || null;
        rec.company = card.find('[data-at="job-item-company-name"], .company').first().text().trim() || null;
        rec.location = card.find('[data-at="job-item-location"], .location').first().text().trim() || null;
        rec.textSnippet = card.find('[data-at="jobcard-content"], .description').first().text().trim() || null;
        rec.textSnippetCleaned = rec.textSnippet;

        const salaryText = card.find('[data-at="job-item-salary-info"], .salary').first().text().trim();
        if (salaryText) rec.unifiedSalary = parseSalary(salaryText);

        rec.jobKey = extractJobKey(rec.url);
        rec.query = query;
        rec.isSponsored = card.attr('data-sponsored') === 'true' ? true : false;
        rec.detailsFetched = false;
        records.push(rec);
    }

    return records;
}

/** Pull a stable job id out of a jobs.ie job URL. */
export function extractJobKey(url: string | null): string | null {
    if (!url) return null;
    const m = url.match(/job(\d+)|\/(\d+)(?:$|[/?#])/i);
    return m ? m[1] ?? m[2] ?? null : null;
}

/** Enrich a record from a job detail page (JSON-LD first, DOM as fallback). */
export function parseDetail(
    $: CheerioAPI,
    base: JobRecord,
    descriptionFormat: 'html' | 'text' | 'markdown',
): JobRecord {
    const rec: JobRecord = { ...base };
    const ld = extractJobPostingJsonLd($);

    if (ld) {
        rec.title = rec.title ?? ld.title ?? null;
        rec.company = rec.company ?? ld.hiringOrganization?.name ?? null;
        rec.companyUrl = ld.hiringOrganization?.sameAs ?? rec.companyUrl;
        rec.companyLogoUrl = ld.hiringOrganization?.logo ?? rec.companyLogoUrl;
        rec.datePosted = ld.datePosted ?? rec.datePosted;
        rec.validThrough = ld.validThrough ?? null;
        rec.employmentType = normaliseEmploymentType(ld.employmentType) ?? rec.employmentType;
        rec.industry = ld.industry ?? rec.industry;
        rec.directApply = typeof ld.directApply === 'boolean' ? ld.directApply : rec.directApply;

        const loc = ld.jobLocation?.address ?? ld.jobLocation?.[0]?.address;
        if (loc) {
            rec.location = rec.location ?? ([loc.addressLocality, loc.addressRegion].filter(Boolean).join(', ') || null);
            rec.postCode = loc.postalCode ?? rec.postCode;
            rec.locationDetail = loc;
        }

        if (ld.baseSalary?.value) {
            const v = ld.baseSalary.value;
            const salary: UnifiedSalary = {
                min: numOrNull(v.minValue ?? v.value),
                max: numOrNull(v.maxValue ?? v.value),
                currency: ld.baseSalary.currency ?? null,
                period: mapUnitText(v.unitText),
                raw: null,
            };
            rec.unifiedSalary = rec.unifiedSalary ?? salary;
            rec.ceSalary = salary;
            rec.salaryDetail = ld.baseSalary;
        }

        rec.description = formatDescription(ld.description ?? null, $, descriptionFormat);
        rec.workFromHome = ld.jobLocationType === 'TELECOMMUTE' ? 'Yes' : rec.workFromHome;
    }

    if (!rec.description) {
        rec.description = formatDescription(null, $, descriptionFormat);
    }

    rec.skills = extractSkills($) ?? rec.skills;
    rec.benefits = extractBenefits($) ?? rec.benefits;
    rec.companyWebsite = $('a[data-at="company-website"]').attr('href') ?? rec.companyWebsite;
    rec.postedDaysAgo = daysAgo(rec.datePosted);
    rec.detailsFetched = true;
    return rec;
}

function extractSkills($: CheerioAPI): string[] | null {
    const skills = $('[data-at="job-skills"] li, .skills li')
        .toArray()
        .map((el) => $(el).text().trim())
        .filter(Boolean);
    return skills.length ? skills : null;
}

function extractBenefits($: CheerioAPI): string[] | null {
    const benefits = $('[data-at="job-benefits"] li, .benefits li')
        .toArray()
        .map((el) => $(el).text().trim())
        .filter(Boolean);
    return benefits.length ? benefits : null;
}

function formatDescription(
    ldHtml: string | null,
    $: CheerioAPI,
    format: 'html' | 'text' | 'markdown',
): string | null {
    const container = $('[data-at="job-ad-content"], .job-description').first();
    const html = ldHtml ?? (container.length ? container.html() : null);
    if (!html) return null;
    if (format === 'html') return html.trim();
    const text = (container.length ? container.text() : html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
    // Markdown output is left as plain text here; wire a real HTML→MD converter in production.
    return text || null;
}

function normaliseEmploymentType(type: unknown): string | null {
    if (!type) return null;
    return Array.isArray(type) ? type.join(', ') : String(type);
}

function mapUnitText(unit: unknown): UnifiedSalary['period'] {
    const u = String(unit ?? '').toUpperCase();
    if (u === 'HOUR') return 'HOUR';
    if (u === 'DAY') return 'DAY';
    if (u === 'WEEK') return 'WEEK';
    if (u === 'MONTH') return 'MONTH';
    if (u === 'YEAR') return 'YEAR';
    return null;
}

function numOrNull(v: unknown): number | null {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
}
