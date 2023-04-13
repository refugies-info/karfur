/* eslint-disable no-console */
const { MongoClient, ObjectId } = require("mongodb");
const fs = require("fs");

const dbPath = "mongodb://127.0.0.1:27017/heroku_wbj38s57?serverSelectionTimeoutMS=60000";
const client = new MongoClient(dbPath);
const dbName = "heroku_wbj38s57";

const getCommitmentAmountDetails = (data, id) => {
  if (data === "") return null;
  switch (data) {
    case "Environ":
      return "approximately";
    case "Exactement":
      return "exactly";
    case "Minimum":
      return "minimum";
    case "Maximum":
      return "maximum";
    case "Entre":
      return "between";
    default:
      console.log(id, "getCommitmentAmountDetails - not found: ", data);
      return;
  }
};
const getCommitmentHours = (data) => {
  if (data === "") return null;
  return data.split(" - ").map((i) => parseInt(i));
};
const getCommitmentTimeUnit = (data, id) => {
  if (data === "") return null;
  switch (data) {
    case "séances":
      return "sessions";
    case "heures":
      return "hours";
    case "demi-journées":
      return "half-days";
    case "journées":
      return "days";
    case "semaines":
      return "weeks";
    case "mois":
      return "months";
    case "trimestres":
      return "trimesters";
    case "semestres":
      return "semesters";
    case "années":
      return "years";
    default:
      console.log(id, "getCommitmentTimeUnit - not found: ", data);
      return;
  }
};
const getFrequencyAmountDetails = (data, id) => {
  if (data === "") return null;
  switch (data) {
    case "Environ":
      return "approximately";
    case "Exactement":
      return "exactly";
    case "Minimum":
      return "minimum";
    case "Maximum":
      return "maximum";
    case "Entre":
      return "between";
    default:
      console.log(id, "getFrequencyAmountDetails - not found: ", data);
      return;
  }
};
const getFrequencyHours = (data) => {
  if (data === "") return null;
  return data.split(" - ").map((i) => parseInt(i));
};
const getFrequencyTimeUnit = (data, id) => {
  if (data === "") return null;
  switch (data) {
    case "séances":
      return "sessions";
    case "heures":
      return "hours";
    case "demi-journées":
      return "half-days";
    case "journées":
      return "days";
    case "semaines":
      return "weeks";
    case "mois":
      return "months";
    case "trimestres":
      return "trimesters";
    case "semestres":
      return "semesters";
    case "années":
      return "years";
    default:
      console.log(id, "getFrequencyTimeUnit - not found: ", data);
      return;
  }
};
const getFrequencyUnit = (data, id) => {
  if (data === "") return null;
  switch (data) {
    case "séance":
      return "session";
    case "jour":
      return "day";
    case "semaine":
      return "week";
    case "mois":
      return "month";
    case "trimestre":
      return "trimester";
    case "semestre":
      return "semester";
    case "an":
      return "year";
    default:
      console.log(id, "getFrequencyUnit - not found: ", data);
      return;
  }
};
const getTimeSlots = (data) => {
  if (data === "") return null;
  return data
    .replace("Lundi", "monday")
    .replace("Mardi", "tuesday")
    .replace("Mercredi", "wednesday")
    .replace("Jeudi", "thursday")
    .replace("Vendredi", "friday")
    .replace("Samedi", "saturday")
    .replace("Dimanche", "sunday")
    .split(", ");
};
const getConditions = (data) => {
  if (data === "") return null;
  data
    .replace("Avoir l’acte de naissance donné par l’OFPRA", "acte naissance")
    .replace("Avoir son titre de séjour ou son récépissé", "titre sejour")
    .replace("Avoir signé le CIR et terminé les cours OFII", "cir")
    .replace("Avoir un compte bancaire", "bank account")
    .replace("Être inscrit à Pôle Emploi", "pole emploi")
    .replace("Avoir son permis B", "driver license")
    .replace("Avoir le niveau de fin de lycée", "school")
    .split(", ");
};
const getPublicStatus = (data) => {
  if (data === "") return null;
  data
    .replace("Tous les publics", "asile, refugie, subsidiaire, temporaire, apatride, french")
    .replace("Primo-arrivants", "asile, refugie, subsidiaire, temporaire, apatride")
    .replace("Demandeurs d'asile", "asile")
    .replace("Réfugiés statutaires", "refugie")
    .replace("Bénéficiaires de la protection subsidiaire", "subsidiaire")
    .replace("Bénéficiaires de la protection temporaire", "temporaire")
    .replace("Apatrides", "apatride")
    .replace("Citoyens français", "french")
    .split(", ");
};
const getPublic = (data) => {
  if (data === "") return null;
  data
    .replace("Familles et enfants", "family")
    .replace("Femmes", "women")
    .replace("Jeunes (de 16 à 25 ans)", "youths")
    .replace("Séniors", "senior")
    .split(", ");
};

const importData = async (line) => {
  const id = line[0].replace("https://refugies.info/fr/dispositif/", "");
  if (line.length < 14) return;
  const commitmentAmountDetails = getCommitmentAmountDetails(line[3], id);
  const commitmentHours = getCommitmentHours(line[4]);
  const commitmentTimeUnit = getCommitmentTimeUnit(line[5], id);
  const frequencyAmountDetails = getFrequencyAmountDetails(line[6], id);
  const frequencyHours = getFrequencyHours(line[7]);
  const frequencyTimeUnit = getFrequencyTimeUnit(line[8], id);
  const frequencUnit = getFrequencyUnit(line[9], id);
  const timeSlots = getTimeSlots(line[10]);
  const conditions = getConditions(line[11]);
  const publicStatus = getPublicStatus(line[12]);
  const public = getPublic(line[13]);

  let metadatas = {};
  if (commitmentAmountDetails || commitmentHours || commitmentTimeUnit) {
    if (commitmentAmountDetails && commitmentHours && commitmentTimeUnit) {
      metadatas["metadatas.commitment"] = { commitmentAmountDetails, commitmentHours, commitmentTimeUnit };
      if (commitmentAmountDetails === "between" && commitmentHours.length !== 2) {
        console.log(id, "commitment between error", commitmentHours);
      }
      if (commitmentAmountDetails !== "between" && commitmentHours.length > 1) {
        console.log(id, "commitment hours error", commitmentAmountDetails, commitmentHours);
      }
    } else {
      console.log(id, "commitment error, missing props", commitmentAmountDetails, commitmentHours, commitmentTimeUnit);
    }
  }

  if (frequencyAmountDetails || frequencyHours || frequencyTimeUnit || frequencUnit) {
    if (frequencyAmountDetails && frequencyHours && frequencyTimeUnit && frequencUnit) {
      metadatas["metadatas.frequency"] = {
        frequencyAmountDetails,
        frequencyHours,
        frequencyTimeUnit,
        frequencUnit,
      };
    } else {
      console.log(
        id,
        "frequency error, missing props",
        frequencyAmountDetails,
        frequencyHours,
        frequencyTimeUnit,
        frequencUnit,
      );
    }
  }
  if (timeSlots) {
    metadatas["metadatas.timeSlots"] = timeSlots;
  }
  if (conditions) {
    metadatas["metadatas.conditions"] = conditions;
  }
  if (publicStatus) {
    metadatas["metadatas.publicStatus"] = publicStatus;
  }
  if (public) {
    metadatas["metadatas.public"] = public;
  }

  return { id, metadatas };
};

/* Start script */
async function main() {
  await client.connect();
  console.log("Démarrage de l'import...");
  const db = client.db(dbName);

  const dispositifsColl = db.collection("dispositifs");
  const data = fs.readFileSync("./temp/import.csv", "utf-8");
  const lines = data.split(/\n/);
  const datas = await Promise.all(lines.map((line) => importData(line.split(";"))));

  let edited = 0;
  let generated = 0;
  for (const importedData of datas) {
    if (!importedData) continue;
    if (Object.keys(importedData.metadatas).length > 0) {
      generated += 1;
      const res = await dispositifsColl.updateOne(
        { _id: new ObjectId(importedData.id) },
        { $set: importedData.metadatas },
      );
      edited += res.modifiedCount;
    }
  }

  console.log(generated, "metadatas générées, ", edited, "dispositif modifiés");
}

main()
  .catch(console.error)
  .finally(() => client.close());
