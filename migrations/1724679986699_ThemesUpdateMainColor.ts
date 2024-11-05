import { MigrationInterface } from "mongo-migrate-ts";
import { Db, ObjectId } from "mongodb";

const themeColorsMap: Record<string, string> = {
  // Faire mes papiers
  "63286a015d31b2c0cad9960b": "#EAC7B2",
  // Apprendre le français
  "63286a015d31b2c0cad9960a": "#BFCCFB",
  // Trouver un logement
  "63286a015d31b2c0cad9960c": "#B6CFFB",
  // Santé
  "63286a015d31b2c0cad9960f": "#FCC0B4",
  // Apprendre un métier
  "63286a015d31b2c0cad99610": "#E2CF58",
  // Trouver un travail
  "63286a015d31b2c0cad9960e": "#60E0EB",
  // Transports
  "63286a015d31b2c0cad9960d": "#FCC0B0",
  // Famille
  "63450dd43e23cd7181ba0b26": "#FBB8F6",
  // Faire des études
  "63286a015d31b2c0cad99611": "#95E257",
  // Activités et culture
  "63286a015d31b2c0cad99615": "#FCBFB7",
};

export class ThemesUpdateMainColor1724679986699 implements MigrationInterface {
  public async up(db: Db): Promise<void | never> {
    const themeCollection = db.collection("themes");

    for (const [id, mainColor] of Object.entries(themeColorsMap)) {
      await themeCollection.updateOne({ _id: new ObjectId(id) }, { $set: { mainColor } });
    }
  }

  public async down(db: Db): Promise<void | never> {
    const themeCollection = db.collection("themes");

    for (const [themeObjectId, mainColor] of Object.entries(themeColorsMap)) {
      await themeCollection.updateOne({ _id: new ObjectId(themeObjectId) }, { $set: { mainColor: "#FFFFFF" } });
    }
  }
}
