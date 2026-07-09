import { Actor } from 'apify';
import type { JobRecord } from './types.js';

/**
 * Incremental / cross-run dedup backed by a named key-value store.
 *
 * State shape: { [jobKey]: contentHash }. A job is "new or changed" when its
 * key is absent or its content hash differs from the stored one. This powers
 * `mode: "incremental"` — only genuinely new/updated listings are pushed.
 */
export class DedupStore {
    private seen: Record<string, string> = {};
    private storeName: string;
    private enabled: boolean;
    private store: Awaited<ReturnType<typeof Actor.openKeyValueStore>> | null = null;

    constructor(storeName: string, enabled: boolean) {
        this.storeName = storeName;
        this.enabled = enabled;
    }

    async init(): Promise<void> {
        if (!this.enabled) return;
        this.store = await Actor.openKeyValueStore(this.storeName);
        this.seen = ((await this.store.getValue('seen')) as Record<string, string>) ?? {};
    }

    /** True when the record is new or its content changed since last run. */
    isNew(record: JobRecord): boolean {
        if (!this.enabled) return true;
        const key = record.jobKey;
        if (!key) return true;
        const hash = contentHash(record);
        const prev = this.seen[key];
        this.seen[key] = hash;
        return prev !== hash;
    }

    async persist(): Promise<void> {
        if (!this.enabled || !this.store) return;
        await this.store.setValue('seen', this.seen);
    }
}

/** Cheap, dependency-free content hash over the fields that define a listing. */
export function contentHash(record: JobRecord): string {
    const parts = [
        record.title,
        record.company,
        record.location,
        record.description,
        JSON.stringify(record.unifiedSalary),
    ].join('|');
    let h = 5381;
    for (let i = 0; i < parts.length; i++) {
        h = ((h << 5) + h) ^ parts.charCodeAt(i);
    }
    return (h >>> 0).toString(16);
}
