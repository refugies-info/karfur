import Airtable from "airtable";

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_TOKEN
});

const airtableContentBase = Airtable.base(process.env.NODE_ENV === "production" ? process.env.AIRTABLE_BASE_TRAD : process.env.AIRTABLE_BASE_DIAIR_TEST);
const airtableUserBase = Airtable.base(process.env.AIRTABLE_BASE_USERS);

export { airtableContentBase, airtableUserBase }
