const csv = require("csvtojson");
const fs = require("fs");
const prettier = require("prettier");
const csvPath = "./translations/";

const existsCsvUpdates = (language) => fs.existsSync(csvPath + language + ".csv");

const readCsvUpdates = async (language) => {
  const jsonArray = await csv().fromFile(csvPath + language + ".csv");
  // eslint-disable-next-line no-console
  console.log(`Nombre de lignes pour la langue ${language} :`, jsonArray.length);
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

  return finalJson;
};

const writeCommonJson = async (language, json) => {
  // Format with prettier
  const formatted = await prettier.format(JSON.stringify(json), { parser: "json" });
  // Write file
  await fs.promises.writeFile("./public/locales/" + language + "/common.json", formatted);
};

const main = async () => {
  for (const language of ["ar", "ru", "en", "ti", "ps", "fa", "uk"]) {
    if (!existsCsvUpdates(language)) continue;
    const updates = await readCsvUpdates(language);
    await writeCommonJson(language, updates);
  }
};

main();
