import * as Airtable from 'airtable';

import { AppConfig } from '@/config/config';

const { AirtableApiKey, AirtableRequestTimeoutInMs, AirtableBaseId } = AppConfig;

if (!AirtableApiKey) {
    throw new Error("Missing AIRTABLE_API_KEY environment variable in your .env.local file!");
}

if (!AirtableBaseId) {
    throw new Error("Missing AIRTABLE_BASE_ID environment variable in your .env.local file!");
}

Airtable.configure({
    apiKey: AirtableApiKey,
    requestTimeout: AirtableRequestTimeoutInMs
})

const AirtableBase = Airtable.base(AirtableBaseId);


export default AirtableBase;