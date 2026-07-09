import type { Input } from './types.js';

export const BASE = 'https://www.jobs.ie';

/**
 * Build the jobs.ie search URL from the actor input.
 *
 * NOTE: jobs.ie runs on The Stepstone Group / Totaljobs unified platform. The
 * public search path is keyword/location based; the exact query-parameter names
 * for radius / age / contract type should be confirmed against a live search
 * (open jobs.ie, apply a filter, and copy the resulting URL) before production.
 * They are centralised here so that verification touches one file only.
 */
export function buildSearchUrl(input: Input, page = 1): string {
    const slug = (s: string) =>
        s
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

    const keyword = input.query ? slug(input.query) : 'jobs';
    let path = `/jobs/${keyword}`;
    if (input.location) path += `/in-${slug(input.location)}`;

    const params = new URLSearchParams();
    if (page > 1) params.set('page', String(page));
    if (input.radius) params.set('radius', input.radius);
    if (input.age) params.set('postedwithin', String(input.age));
    if (input.remote) params.set('workfromhome', '1');
    if (input.contractType) params.set('contracttype', input.contractType);

    const qs = params.toString();
    return `${BASE}${path}${qs ? `?${qs}` : ''}`;
}

/** Resolve a possibly-relative jobs.ie href to an absolute URL. */
export function absoluteUrl(href: string): string {
    try {
        return new URL(href, BASE).toString();
    } catch {
        return href;
    }
}

/** Heuristic: does this URL look like a single job detail page? */
export function isDetailUrl(url: string): boolean {
    return /\/job\//i.test(url) && !/\/jobs\//i.test(url);
}
