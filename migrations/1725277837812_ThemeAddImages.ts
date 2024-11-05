import { MigrationInterface } from "mongo-migrate-ts";
import { Db, ObjectId } from "mongodb";

const imageNameMap: Record<string, string> = {
  // Faire mes papiers
  "63286a015d31b2c0cad9960b": "administratif",
  // Apprendre le français
  "63286a015d31b2c0cad9960a": "français",
  // Trouver un logement
  "63286a015d31b2c0cad9960c": "logement",
  // Santé
  "63286a015d31b2c0cad9960f": "santé",
  // Apprendre un métier
  "63286a015d31b2c0cad99610": "formation",
  // Trouver un travail
  "63286a015d31b2c0cad9960e": "travail",
  // Transports
  "63286a015d31b2c0cad9960d": "mobilité",
  // Famille
  "63450dd43e23cd7181ba0b26": "famille",
  // Faire des études
  "63286a015d31b2c0cad99611": "études",
  // Activités et culture
  "63286a015d31b2c0cad99615": "loisirs",
};

export class ThemeAddImages1725277837812 implements MigrationInterface {
  public async up(db: Db): Promise<void | never> {
    const themeCollection = db.collection("themes");

    for (const [id, filename] of Object.entries(imageNameMap)) {
      await themeCollection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            dispositifImage: {
              secure_url: `/images/cards/dispositif/${filename}.svg`,
              public_id: "",
              imgId: "",
            },
            demarcheImage: {
              secure_url: `/images/cards/demarche/${filename}.svg`,
              public_id: "",
              imgId: "",
            },
          },
        },
      );
    }
  }

  public async down(db: Db): Promise<void | never> {
    const themeCollection = db.collection("themes");

    for (const [themeObjectId, filename] of Object.entries(imageNameMap)) {
      await themeCollection.updateOne(
        { _id: new ObjectId(themeObjectId) },
        { $set: { dispositifImage: undefined, demarcheImage: undefined } },
      );
    }
  }
}
