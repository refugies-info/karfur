import { console } from "node:console";
import fs from "fs";
import Papa from "papaparse";

const convertJsonToCsvFr = () => {
  // import french
  const jsonFrench = JSON.parse(fs.readFileSync("../fr/common.json").toString());

  const titleArrayFrench = Object.keys(jsonFrench);

  const output = [];
  titleArrayFrench.forEach((title) => {
    const elementsFrench = jsonFrench[title];

    if (typeof elementsFrench !== "string") {
      const keysFrench = Object.keys(elementsFrench);
      keysFrench.forEach((key) =>
        output.push({
          title,
          key,
          français: elementsFrench[key],
        }),
      );
    }

    if (typeof elementsFrench === "string") {
      output.push({
        title,
        key: "",
        français: elementsFrench,
      });
    }
  });
  console.log("Nombre de traductions en francais", output.length);

  const csv = Papa.unparse(output);
  const path = "./csvBeforeTrad/fr.csv";
  fs.writeFileSync(path, csv);
};

const main = () => {
  convertJsonToCsvFr();
};

main();
