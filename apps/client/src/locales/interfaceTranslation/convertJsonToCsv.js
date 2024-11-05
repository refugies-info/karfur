/* eslint-disable no-console */
const fs = require("fs");
const Papa = require("papaparse");

const PLURAL_LN_RULE = ["ar"];
const PLURAL_AR_KEYS = ["_zero", "_two", "_few", "_many"];
const PLURAL_KEY = "_other";

/**
 * Checks if the element is a plural form of a translation
 * @param {string} key
 * @returns {boolean}
 */
const hasPlurals = (key) => key.endsWith(PLURAL_KEY);

/**
 * Return a translation key of arabic plurals
 * @param {string | undefined} key
 * @param {string} keySuffix
 * @returns {string}
 */
const getNewKey = (key, keySuffix) => (key || "").replace(PLURAL_KEY, keySuffix);

/**
 * Returns the elements to push to localized translation CSV file
 * @param {string} title
 * @param {string} langue
 * @param {string | null} key
 * @param {string | object} elementFrench
 * @param {string | object} elementLangue
 * @returns {object}
 */
const getElementsToPush = (title, langue, key, elementFrench, elementLangue, jsonLangue) => {
  let arabicPlurals = [];
  if (PLURAL_LN_RULE.includes(langue) && hasPlurals(key || title)) {
    arabicPlurals = PLURAL_AR_KEYS.map((arKey) => {
      const newTitleArKey = getNewKey(title, arKey);
      const newKeyArKey = getNewKey(key, arKey);
      return {
        title: key ? title : newTitleArKey, // if key, title cannot have plural
        key: key ? newKeyArKey : "", // if key, get new arKey
        français: "", // no translation available as it's language specific
        [langue]: key ? elementLangue[newKeyArKey] : jsonLangue[newTitleArKey], // get translation at object level or root level
      };
    });
  }

  return [
    {
      title,
      key: key || "",
      français: key ? elementFrench[key] : elementFrench,
      [langue]: (key ? elementLangue?.[key] : elementLangue) || "",
    },
    ...arabicPlurals,
  ];
};

const convertJsonToCsv = (langue) => {
  // import french
  const jsonFrench = JSON.parse(fs.readFileSync("../fr/common.json").toString());
  const jsonLangue = JSON.parse(fs.readFileSync("../" + langue + "/common.json").toString());
  const titleArrayFrench = Object.keys(jsonFrench);

  const output = [];
  titleArrayFrench.forEach((title) => {
    const elementsLangue = jsonLangue[title];
    const elementsFrench = jsonFrench[title];

    if (typeof elementsFrench !== "string") {
      const keysFrench = Object.keys(elementsFrench);
      keysFrench.forEach((key) =>
        output.push(...getElementsToPush(title, langue, key, elementsFrench, elementsLangue, jsonLangue)),
      );
    }

    if (typeof elementsFrench === "string") {
      output.push(...getElementsToPush(title, langue, null, elementsFrench, elementsLangue, jsonLangue));
    }
  });
  console.log(
    `Nombre de traductions en fr -> ${langue}: ${output.length} -> ${output.filter((trad) => trad[langue]).length}`,
  );
  const csv = Papa.unparse(output);
  const path = "./csvBeforeTrad/traductions" + langue + ".csv";
  fs.writeFileSync(path, csv);
};

const main = () => {
  convertJsonToCsv("ar");
  convertJsonToCsv("en");
  convertJsonToCsv("fa");
  convertJsonToCsv("ps");
  convertJsonToCsv("ru");
  convertJsonToCsv("ti");
  convertJsonToCsv("uk");
};

main();
