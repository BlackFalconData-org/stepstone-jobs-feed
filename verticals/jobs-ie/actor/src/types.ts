export interface Input {
    query?: string;
    location?: string;
    radius?: string;
    age?: number;
    remote?: boolean;
    contractType?: string;
    startUrls?: Array<{ url: string } | string>;
    includeDetails?: boolean;
    descriptionFormat?: 'html' | 'text' | 'markdown';
    mode?: 'full' | 'incremental';
    stateStoreName?: string;
    compact?: boolean;
    descriptionMaxLength?: number;
    outputFields?: string[];
    maxResults?: number;
    maxPages?: number;
    proxyConfiguration?: Record<string, unknown>;
    maxConcurrency?: number;
    maxRequestRetries?: number;
}

/**
 * Normalised, structured salary. `null` fields when jobs.ie does not publish
 * that part — never guessed.
 */
export interface UnifiedSalary {
    min: number | null;
    max: number | null;
    currency: string | null;
    period: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'YEAR' | null;
    raw: string | null;
}

/**
 * The full jobs.ie output record. Field names mirror the StepStone Jobs
 * Scraper schema so downstream consumers can treat all Stepstone Group
 * portals uniformly. Missing values are `null`, never omitted.
 */
export interface JobRecord {
    jobKey: string | null;
    title: string | null;
    company: string | null;
    location: string | null;
    postCode: string | null;
    url: string | null;
    datePosted: string | null;
    postedDaysAgo: number | null;
    workFromHome: string | null;
    workFromHomeLabel: string | null;
    isSponsored: boolean | null;
    isTopJob: boolean | null;
    companyId: string | null;
    companyUrl: string | null;
    companyLogoUrl: string | null;
    textSnippet: string | null;
    textSnippetCleaned: string | null;
    labels: string[] | null;
    topLabels: string[] | null;
    skills: string[] | null;
    harmonisedId: string | null;
    unifiedSalary: UnifiedSalary | null;
    hasFuturePosting: boolean | null;
    partnership: string | null;
    metaData: Record<string, unknown> | null;
    publishFromDate: string | null;
    publishToDate: string | null;
    isAnonymous: boolean | null;
    isHighlighted: boolean | null;
    section: string | null;
    travelTime: string | null;
    geo: string | null;
    query: string | null;
    scrapedAt: string | null;
    portalUrl: string | null;
    detailsFetched: boolean | null;
    description: string | null;
    employmentType: string | null;
    validThrough: string | null;
    locationDetail: Record<string, unknown> | null;
    salaryDetail: Record<string, unknown> | null;
    ceSalary: UnifiedSalary | null;
    directApply: boolean | null;
    industry: string | null;
    companyRating: number | null;
    benefits: string[] | null;
    companyWebsite: string | null;
}
