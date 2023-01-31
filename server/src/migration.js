/* eslint-disable no-console */
const { MongoClient } = require("mongodb");
const dbPath = "mongodb://127.0.0.1:27017/heroku_wbj38s57?serverSelectionTimeoutMS=60000";
const client = new MongoClient(dbPath);
const dbName = "heroku_wbj38s57";

/* List all fields to remove from a dispositif */
const removeOldFields = async (dispositifsColl) => {
  await dispositifsColl.updateMany(
    { status: { $ne: "Supprimé" } },
    {
      $unset: {
        abstract: "",
        audience: "",
        audienceAge: "",
        autoSave: "",
        avancement: "",
        demarcheId: "",
        niveauFrancais: "",
        questions: "",
        responsable: "",
        tags: "",
        timeSpent: "",
        pasMerci: "",
        localisation: "",
        bravo: "",
        signalements: "",
        variantes: "",
        titreInformatif: "",
        titreMarque: ""
      }
    }
  );
};

/* Add new fields to dispositif */
const getNewFields = (dispositif) => {
  if (!dispositif.status) return null; // some dispositifs seems not complete and not displayed
  const newDispositif = {
    translations: {
      fr: {
        titreInformatif: dispositif.titreInformatif?.fr || dispositif.titreInformatif || "",
        titreMarque: dispositif.titreMarque?.fr || dispositif.titreMarque || "",
        abstract: dispositif.abstract?.fr || dispositif.abstract || ""
      }
    },
    needs: dispositif.needs || [],
    notificationsSent: dispositif.notificationsSent || {},
    participants: dispositif.participants || [],
    secondaryThemes: dispositif.secondaryThemes || [],
    themesSelectedByAuthor: dispositif.themesSelectedByAuthor || false
  };
  return { ...dispositif, ...newDispositif };
};

/* Start script */
async function main() {
  await client.connect();
  console.log("Connected successfully to server");
  const db = client.db(dbName);

  const dispositifsColl = db.collection("dispositifs");
  const dispositifs = await dispositifsColl.find({ status: { $ne: "Supprimé" } }).toArray();

  // update dispositifs one by one
  for (const dispositif of dispositifs) {
    const newDispositif = getNewFields(dispositif);
    if (newDispositif) {
      await dispositifsColl.replaceOne({ _id: dispositif._id }, newDispositif);
    }
  }

  // and remove all unused fields
  await removeOldFields(dispositifsColl);
}

main()
  .catch(console.error)
  .finally(() => client.close());
