/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
const axios = require("axios");

/**
 * Get your credentials on CRIPS Marketplace.
 * You can use a development token or ask Hugo its credentials to generate a production token.
 * More informations here: https://docs.crisp.chat/guides/rest-api/authentication/
 */
const crispId = "";
const crispKey = "";

const getSegments = (page) => {
  return axios
    .get(
      `https://api.crisp.chat/v1/website/74e04b98-ef6b-4cb0-9daf-f8a2b643e121/conversations/${page}?filter_date_start=2023-06-01T00:00:00.000Z&filter_date_end=2023-08-31T00:00:00.000Z`,
      {
        headers: { "X-Crisp-Tier": "plugin" },
        auth: {
          username: crispId,
          password: crispKey,
        },
      },
    )
    .then(async function (response) {
      for (const session of response.data.data) {
        console.log(`${session.session_id},${session.meta.segments}`);
      }
      return response.status === 200 ? true : false;
    })
    .catch(async function (error) {
      console.error(error.response);
      return true;
    });
};

/**
 * Run the script and copy content into a CSV file
 * node src/migration.js > segments.csv
 */
async function main() {
  let complete = false;
  let i = 1;
  while (!complete) {
    let complete = await getSegments(i);
    if (complete) return;
    i += 1;
  }
}

main().catch(console.error);
