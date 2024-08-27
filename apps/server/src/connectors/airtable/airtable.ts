import Airtable from "airtable";

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_TOKEN,
});

const airtableContentBase = Airtable.base(process.env.AIRTABLE_BASE_TRAD);
const airtableUserBase = Airtable.base(process.env.AIRTABLE_BASE_USERS);

export { airtableContentBase, airtableUserBase };
