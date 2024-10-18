import Airtable from "airtable";

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_TOKEN,
});

export const airtableContentBase = Airtable.base(process.env.AIRTABLE_BASE_CONTENU);
export const airtableTranslationBase = Airtable.base(process.env.AIRTABLE_BASE_TRAD);
export const airtableUserBase = Airtable.base(process.env.AIRTABLE_BASE_USERS);
