import { Languages } from "@refugies-info/api-types";
import { MigrationInterface } from "mongo-migrate-ts";
import { Db, ObjectId } from "mongodb";

const themeShortNamesMap: Record<string, Record<Languages, string>> = {
  // Apprendre un métier
  "63286a015d31b2c0cad99610": {
    ar: "تدريب",
    en: "Training",
    fa: "آموزش",
    fr: "Formation",
    ps: "روزنه",
    ru: "Обучение",
    ti: "ምምሕዳር",
    uk: "Навчання",
  },
  // Trouver un travail
  "63286a015d31b2c0cad9960e": {
    ar: "عمل",
    en: "Work",
    fa: "کار",
    fr: "Travail",
    ps: "کار",
    ru: "Работа",
    ti: "ስራሕ",
    uk: "Робота",
  },
};

export class ThemesUpdateShortNames1724681728662 implements MigrationInterface {
  public async up(db: Db): Promise<void | never> {
    const themeCollection = db.collection("themes");

    for (const [id, short] of Object.entries(themeShortNamesMap)) {
      await themeCollection.updateOne({ _id: new ObjectId(id) }, { $set: { short } });
    }
  }

  public async down(db: Db): Promise<void | never> {}
}
