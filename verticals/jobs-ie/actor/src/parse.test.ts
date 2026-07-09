import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseSalary, extractJobKey } from './parse.js';

test('parseSalary: annual EUR range', () => {
    const s = parseSalary('€40,000 - €50,000 per year');
    assert.equal(s?.currency, 'EUR');
    assert.equal(s?.min, 40000);
    assert.equal(s?.max, 50000);
    assert.equal(s?.period, 'YEAR');
});

test('parseSalary: hourly rate', () => {
    const s = parseSalary('€22.50 per hour');
    assert.equal(s?.currency, 'EUR');
    assert.equal(s?.min, 22.5);
    assert.equal(s?.period, 'HOUR');
});

test('parseSalary: empty is null', () => {
    assert.equal(parseSalary(''), null);
    assert.equal(parseSalary(null), null);
});

test('extractJobKey: from jobs.ie url', () => {
    assert.equal(extractJobKey('https://www.jobs.ie/job/developer/acme-job106979362'), '106979362');
    assert.equal(extractJobKey(null), null);
});
