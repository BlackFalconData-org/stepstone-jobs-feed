import type { JobRecord } from './types.js';

/** The 11 essential fields emitted in compact mode. */
export const COMPACT_FIELDS: Array<keyof JobRecord> = [
    'jobKey',
    'title',
    'company',
    'location',
    'url',
    'portalUrl',
    'datePosted',
    'workFromHome',
    'unifiedSalary',
    'geo',
    'description',
];

/** A fresh record with every field present and defaulted to `null`. */
export function blankRecord(): JobRecord {
    return {
        jobKey: null,
        title: null,
        company: null,
        location: null,
        postCode: null,
        url: null,
        datePosted: null,
        postedDaysAgo: null,
        workFromHome: null,
        workFromHomeLabel: null,
        isSponsored: null,
        isTopJob: null,
        companyId: null,
        companyUrl: null,
        companyLogoUrl: null,
        textSnippet: null,
        textSnippetCleaned: null,
        labels: null,
        topLabels: null,
        skills: null,
        harmonisedId: null,
        unifiedSalary: null,
        hasFuturePosting: null,
        partnership: null,
        metaData: null,
        publishFromDate: null,
        publishToDate: null,
        isAnonymous: null,
        isHighlighted: null,
        section: null,
        travelTime: null,
        geo: 'IE',
        query: null,
        scrapedAt: null,
        portalUrl: null,
        detailsFetched: null,
        description: null,
        employmentType: null,
        validThrough: null,
        locationDetail: null,
        salaryDetail: null,
        ceSalary: null,
        directApply: null,
        industry: null,
        companyRating: null,
        benefits: null,
        companyWebsite: null,
    };
}

export interface OutputOptions {
    compact: boolean;
    descriptionMaxLength: number;
    outputFields: string[];
}

/** Apply compact mode, description truncation, and field selection. */
export function shapeOutput(record: JobRecord, opts: OutputOptions): Record<string, unknown> {
    let out: Record<string, unknown> = { ...record };

    if (opts.descriptionMaxLength > 0 && typeof out.description === 'string') {
        const desc = out.description as string;
        if (desc.length > opts.descriptionMaxLength) {
            out.description = `${desc.slice(0, opts.descriptionMaxLength)}…`;
        }
    }

    if (opts.compact) {
        const compact: Record<string, unknown> = {};
        for (const key of COMPACT_FIELDS) compact[key] = out[key];
        out = compact;
    }

    if (opts.outputFields.length > 0) {
        const selected: Record<string, unknown> = {};
        for (const key of opts.outputFields) selected[key] = out[key];
        out = selected;
    }

    return out;
}
