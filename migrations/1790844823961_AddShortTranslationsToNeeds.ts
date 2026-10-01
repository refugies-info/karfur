import type { MigrationInterface } from "mongo-migrate-ts";
import { type Db, ObjectId } from "mongodb";

type ShortTranslations = Record<"ru" | "ps" | "ar" | "fa" | "en" | "uk" | "ti", string>;

// Translations of the "Apprendre le français" short names added by AddShortToNeeds1790330000000
const needShortTranslationsMap: Record<string, ShortTranslations> = {
  // Français pour l'université
  "613721a409c5190dfa70d060": {
    ru: "Французский для университета",
    ps: "د پوهنتون لپاره فرانسوي ژبه",
    ar: "الفرنسية للجامعة",
    fa: "زبان فرانسوی برای تحصیل در دانشگاه",
    en: "French for university",
    uk: "Французька для університету",
    ti: "ቋንቋ ፈረንሳ ንዩኒቨርሲቲ ዝኸውን",
  },
  // Tester mon niveau
  "613721a409c5190dfa70d05d": {
    ru: "Узнать мой уровень",
    ps: "زما د ژبې کچه معلومول",
    ar: "اختبر مستواي",
    fa: "تعیین سطح زبانم",
    en: "Test my language level",
    uk: "Тест на рівень",
    ti: "ናይ ብቅዓት ፈተና",
  },
  // Français pour le travail
  "613721a409c5190dfa70d058": {
    ru: "Французский для работы",
    ps: "د کار لپاره فرانسوي ژبه",
    ar: "الفرنسية للعمل",
    fa: "زبان فرانسوی برای کار",
    en: "French for work",
    uk: "Французька для роботи",
    ti: "ቋንቋ ፈረንሳ ንስራሕ ቅቧቑጥ",
  },
};

const toShortPaths = (translations: ShortTranslations): Record<string, string> =>
  Object.fromEntries(Object.entries(translations).map(([ln, short]) => [`${ln}.short`, short]));

export class AddShortTranslationsToNeeds1790844823961 implements MigrationInterface {
  public async up(db: Db): Promise<void | never> {
    const needCollection = db.collection("needs");

    for (const [id, translations] of Object.entries(needShortTranslationsMap)) {
      const result = await needCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: toShortPaths(translations) },
      );
      if (result.matchedCount === 0) console.warn(`Need ${id} not found`);
    }
  }

  public async down(db: Db): Promise<void | never> {
    const needCollection = db.collection("needs");

    for (const [id, translations] of Object.entries(needShortTranslationsMap)) {
      const unsetPaths = Object.fromEntries(
        Object.keys(toShortPaths(translations)).map((path) => [path, ""]),
      );
      await needCollection.updateOne({ _id: new ObjectId(id) }, { $unset: unsetPaths });
    }
  }
}
