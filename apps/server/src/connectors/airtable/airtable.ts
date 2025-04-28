import Airtable from "airtable";

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_TOKEN,
});

export const getAirtableContentTable = (tableName: string) =>
  Airtable.base(process.env.AIRTABLE_BASE_CONTENU).table(tableName);
export const getAirtableTranslationTable = (tableName: string) =>
  Airtable.base(process.env.AIRTABLE_BASE_TRAD).table(tableName);
export const getAirtableUserTable = (tableName: string) =>
  Airtable.base(process.env.AIRTABLE_BASE_USERS).table(tableName);
