/* eslint-disable no-console */
import Airtable from "airtable";

console.log("ENV VARS");
console.log("===============");
for (const [key, value] of Object.entries(process.env)) {
  console.log(`${key}: ${value}`);
}
console.log("===============");

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_TOKEN,
});

export const airtableContentBase = Airtable.base(process.env.AIRTABLE_BASE_CONTENU);
export const airtableTranslationBase = Airtable.base(process.env.AIRTABLE_BASE_TRAD);
export const airtableUserBase = Airtable.base(process.env.AIRTABLE_BASE_USERS);
