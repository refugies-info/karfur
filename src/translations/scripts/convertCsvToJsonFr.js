const csv = require("csvtojson");
const fs = require("fs");

const convertCsvToJsonFr = async () => {
  const jsonArray = await csv().fromFile("./csvAfterTrad/fr.csv");
  // eslint-disable-next-line no-console
  console.log("Nombre de lignes pour la langue fr :", jsonArray.length);
  const finalJson = {};

  jsonArray.forEach((trad) => {
    if (trad["nouvelle version du texte"]) {
      if (!trad.key) {
        finalJson[trad.title] = trad["nouvelle version du texte"];
        return;
      }
      finalJson[trad.title] = {
        ...finalJson[trad.title],
        [trad.key]: trad["nouvelle version du texte"],
      };
      return;
    }
    if (!trad.key) {
      finalJson[trad.title] = trad["texte actuel"];
      return;
    }
    finalJson[trad.title] = {
      ...finalJson[trad.title],
      [trad.key]: trad["texte actuel"],
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
