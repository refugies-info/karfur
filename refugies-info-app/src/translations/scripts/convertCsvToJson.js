const csv = require("csvtojson");
const fs = require("fs");

const convertCsvToJson = async (language) => {
  console.log("test", "./csvAfterTrad/" + language + " - " + language + ".csv");
  const jsonArray = await csv().fromFile(
    "./csvAfterTrad/" + language + " - " + language + ".csv"
  );
  // eslint-disable-next-line no-console
  console.log(
    `Nombre de lignes pour la langue ${language} :`,
    jsonArray.length
  );
  const finalJson = {};
  jsonArray.forEach((trad) => {
    if (!trad[language]) return;
    if (!trad.key) {
      finalJson[trad.title] = trad[language];
      return;
    }
    finalJson[trad.title] = {
      ...finalJson[trad.title],
      [trad.key]: trad[language],
    };
  });

  const stringify = JSON.stringify(finalJson);
  fs.writeFileSync("../" + language + ".json", stringify);
};

const main = async () => {
  // langues : en, ar, fa, ps, ru, ti-ER
  // await convertCsvToJson("ar");
  // await convertCsvToJson("ru");
  await convertCsvToJson("en");
  // await convertCsvToJson("ti-ER");
  // await convertCsvToJson("ps");
  // await convertCsvToJson("fa");
};

main();
