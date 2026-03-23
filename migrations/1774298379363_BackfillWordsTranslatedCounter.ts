import type { MigrationInterface } from "mongo-migrate-ts";
import type { Db } from "mongodb";

/**
 * Backfill migration: compute nbWordsTranslated from existing dispositif translations
 * and store it as a counter in the adminoptions collection.
 *
 * The counter is subsequently kept in sync by hooks in:
 * - validateTranslation (increment on publish)
 * - deleteTranslations (decrement on removal)
 */

/** Basic word counter — mirrors traductions.business.ts logic */
const countWords = (str?: unknown): number => {
  if (typeof str !== "string" || !str) return 0;
  return str
    .replace(/<\/?[^>]+(>|$)/g, "")
    .split(/\s+/)
    .filter((w) => !!w).length;
};

const countInfoSections = (sections?: Record<string, { title?: string; text?: string }>): number =>
  Object.values(sections || {}).reduce(
    (acc, { title, text }) => acc + countWords(title) + countWords(text),
    0,
  );

const countTranslationContent = (content?: Record<string, unknown>): number => {
  if (!content) return 0;
  // Markdown content
  if (content.markdown) {
    return (
      countWords(content.titreInformatif) +
      countWords(content.titreMarque) +
      countWords(content.abstract) +
      countWords(content.markdown)
    );
  }
  // Structured content
  return (
    countWords(content.titreInformatif) +
    countWords(content.titreMarque) +
    countWords(content.abstract) +
    countWords(content.what) +
    countInfoSections(content.how as any) +
    countInfoSections((content as any).next) +
    countInfoSections((content as any).why)
  );
};

const WORDS_TRANSLATED_KEY = "nbWordsTranslated";
const ACTIVE_STATUSES = ["Actif", "En attente admin"];

export class Migration1774298379363 implements MigrationInterface {
  public async up(db: Db): Promise<void> {
    const dispositifs = db.collection("dispositifs");

    // Load all active dispositifs, projecting only translations
    const docs = await dispositifs
      .find({ status: { $in: ACTIVE_STATUSES } }, { projection: { translations: 1 } })
      .toArray();

    let total = 0;
    for (const doc of docs) {
      const translations = (doc.translations ?? {}) as Record<
        string,
        { content?: Record<string, unknown> }
      >;
      for (const [lang, translation] of Object.entries(translations)) {
        if (lang === "fr") continue; // only count non-French translations
        total += countTranslationContent(translation?.content);
      }
    }

    await db
      .collection("adminoptions")
      .updateOne(
        { key: WORDS_TRANSLATED_KEY },
        { $set: { key: WORDS_TRANSLATED_KEY, value: total } },
        { upsert: true },
      );

    console.log(
      `[Migration1774298379363] Backfilled nbWordsTranslated = ${total} from ${docs.length} active dispositifs.`,
    );
  }

  public async down(db: Db): Promise<void> {
    await db.collection("adminoptions").deleteOne({ key: WORDS_TRANSLATED_KEY });
    console.log("[Migration1774298379363] Removed nbWordsTranslated counter from adminoptions.");
  }
}
