import Airtable from "airtable";

for (const [key, value] of Object.entries(process.env)) {
  // eslint-disable-next-line no-console
  console.log(`${key}: ${value}`);
}

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_TOKEN,
});

export const airtableContentBase = Airtable.base(process.env.AIRTABLE_BASE_CONTENU);
export const airtableTranslationBase = Airtable.base(process.env.AIRTABLE_BASE_TRAD);
export const airtableUserBase = Airtable.base(process.env.AIRTABLE_BASE_USERS);
