import type { MigrationInterface } from "mongo-migrate-ts";
import { type Db, ObjectId } from "mongodb";

// Needs of the "Apprendre le français" theme
const needShortNamesMap: Record<string, string> = {
  // Prendre des cours
  "613721a409c5190dfa70d057": "Prendre des cours",
  // Apprendre le français pour le travail
  "613721a409c5190dfa70d058": "Français pour le travail",
  // Passer un diplôme officiel
  "613721a409c5190dfa70d05e": "Passer un diplôme officiel",
  // Faire des activités en français
  "613721a409c5190dfa70d084": "Faire des activités en français",
  // Apprendre la culture française
  "613721a409c5190dfa70d06f": "Apprendre la culture française",
  // Apprendre le français pour l'université
  "613721a409c5190dfa70d060": "Français pour l'université",
  // Tester mon niveau pour trouver un cours
  "613721a409c5190dfa70d05d": "Tester mon niveau",
};

const needIds = Object.keys(needShortNamesMap).map((id) => new ObjectId(id));

export class AddShortToNeeds1790330000000 implements MigrationInterface {
  public async up(db: Db): Promise<void | never> {
    const needCollection = db.collection("needs");

    for (const [id, short] of Object.entries(needShortNamesMap)) {
      const result = await needCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { "fr.short": short } },
      );
      if (result.matchedCount === 0) console.warn(`Need ${id} not found`);
    }
  }

  public async down(db: Db): Promise<void | never> {
    await db
      .collection("needs")
      .updateMany({ _id: { $in: needIds } }, { $unset: { "fr.short": "" } });
  }
}
