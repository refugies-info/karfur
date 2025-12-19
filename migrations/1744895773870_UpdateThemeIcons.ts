import type { MigrationInterface } from "mongo-migrate-ts";
import { type Db, ObjectId } from "mongodb";
import logger from "../apps/server/src/logger";

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

export class UpdateThemeIcons1744895773870 implements MigrationInterface {
  public async up(db: Db): Promise<void | never> {
    const themeCollection = db.collection("themes");

    for (const [id, filename] of Object.entries(imageNameMap)) {
      logger.info(`Updating theme ${id} with icon /images/themes/icon_${filename}.svg`);
      await themeCollection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            icon: {
              secure_url: `/images/themes/icon_${filename}.svg`,
              public_id: "",
              imgId: "",
            },
          },
        },
      );
      logger.info(`Updated theme ${id} with icon /images/themes/icon_${filename}.svg`);
    }
  }

  public async down(db: Db): Promise<void | never> {
    const themeCollection = db.collection("themes");

    for (const [id, filename] of Object.entries(imageNameMap)) {
      await themeCollection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            icon: undefined,
          },
        },
      );
    }
  }
}
