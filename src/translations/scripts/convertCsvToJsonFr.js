const csv = require("csvtojson");
const fs = require("fs");

const convertCsvToJsonFr = async () => {
  const jsonArray = await csv().fromFile("./csvAfterTrad/fr.csv");
  // eslint-disable-next-line no-console
  console.log("Nombre de lignes pour la langue fr :", jsonArray.length);
  const finalJson = {};

  jsonArray.forEach((trad) => {
    if (trad["fr_nouveau"]) {
      if (!trad.key) {
        finalJson[trad.title] = trad["fr_nouveau"];
        return;
      }
      finalJson[trad.title] = {
        ...finalJson[trad.title],
        [trad.key]: trad["fr_nouveau"],
      };
      return;
    }
    if (!trad.key) {
      finalJson[trad.title] = trad["français"];
      return;
    }
    finalJson[trad.title] = {
      ...finalJson[trad.title],
      [trad.key]: trad["français"],
    };
    return;
  });

  const stringify = JSON.stringify(finalJson);
  fs.writeFileSync("../fr.json", stringify);
};

const main = async () => {
  await convertCsvToJsonFr();
};

main();
