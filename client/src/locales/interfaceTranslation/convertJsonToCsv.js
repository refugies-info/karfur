const fs = require("fs");
const Papa = require("papaparse");
import logger from "../../logger";

const convertJsonToCsv = (langue) => {
  // import french
  const jsonFrench = JSON.parse(
    fs.readFileSync("../fr/translation.json").toString()
  );
  const jsonLangue = JSON.parse(
    fs.readFileSync("../" + langue + "/translation.json").toString()
  );
  const titleArrayFrench = Object.keys(jsonFrench);

  const output = [];
  titleArrayFrench.forEach((title) => {
    const elementsLangue = jsonLangue[title];
    const elementsFrench = jsonFrench[title];

    if (typeof elementsFrench !== "string") {
      const keysFrench = Object.keys(elementsFrench);
      keysFrench.forEach((key) =>
        output.push({
          title,
          key,
          français: elementsFrench[key],
          [langue]: (elementsLangue && elementsLangue[key]) || "",
        })
      );
    }

    if (typeof elementsFrench === "string") {
      output.push({
        title,
        key: "",
        français: elementsFrench,
        [langue]: elementsLangue || "",
      });
    }
  });
  logger.info("Nombre de traductions en francais", output.length);
  logger.info(
    `Nombre de traductions en ${langue}`,
    output.filter((trad) => trad[langue]).length
  );
  const csv = Papa.unparse(output);
  const path = "./csvBeforeTrad/traductions" + langue + ".csv";
  fs.writeFileSync(path, csv);
};

const main = () => {
  // langues : en, ar, fa, ps, ru, ti-ER
  convertJsonToCsv("ar");
  convertJsonToCsv("en");
  convertJsonToCsv("fa");
  convertJsonToCsv("ps");
  convertJsonToCsv("ru");
  convertJsonToCsv("ti-ER");
};

main();
