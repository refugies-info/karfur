import fc from "fast-check";
import type { Connection } from "mongoose";
import mongoose from "mongoose";
import type { NeedSeedIds, ThemeSeedIds } from "~/__fixtures__/seed-data";
import { getNeedSeedIds, getThemeSeedIds, seedNeeds, seedThemes } from "~/__fixtures__/seed-data";

// Dynamically read enum values from the registered Dispositif schema on the provided connection.
// Falls back to a minimal hardcoded list if schema is unavailable (e.g., misuse).
function getEnumValues(conn: Connection) {
  try {
    const schema = conn.model("Dispositif").schema as any;
    const locationEnums = schema.path("metadatas.location").enumValues as string[];
    const statusEnums = schema.path("status").enumValues as string[];
    const typeEnums = schema.path("typeContenu").enumValues as string[];
    const levelEnums = schema.path("metadatas.frenchLevel").caster.enumValues as string[];
    const publicEnums = schema.path("metadatas.public").caster.enumValues as string[];
    const refugeeStatusEnums = schema.path("metadatas.publicStatus").caster.enumValues as string[];
    return {
      locations: locationEnums,
      statuses: statusEnums,
      types: typeEnums,
      frenchLevels: levelEnums,
      publics: publicEnums,
      refugeeStatuses: refugeeStatusEnums,
      languages: ["ar", "en", "fa", "fr", "ps", "ru", "ti", "uk"],
    } as const;
  } catch {
    return {
      locations: ["75 - Paris", "92 - Hauts-de-Seine", "france", "online"],
      statuses: ["Actif", "Archivé"],
      types: ["dispositif", "online"],
      frenchLevels: ["alpha", "A1", "A2", "B1", "B2", "C1", "C2"],
      publics: ["family", "women", "youths", "senior", "gender"],
      refugeeStatuses: ["apatride", "asile", "refugie", "subsidiaire", "temporaire", "french"],
      languages: ["ar", "en", "fa", "fr", "ps", "ru", "ti", "uk"],
    } as const;
  }
}

const uniq = <T>(arr: T[]) => Array.from(new Set(arr));

// Small vocabulary to build deterministic phrases that tests can target
const vocab = [
  "alpha",
  "beta",
  "gamma",
  "delta",
  "epsilon",
  "zeta",
  "paris",
  "families",
  "youths",
  "seniors",
  "french",
  "course",
  "support",
  "digital",
  "atelier",
  "language",
  "admin",
  "help",
  "program",
  "center",
];

const wordArb = fc.constantFrom(...vocab);
const wordsArb = (min: number, max: number) =>
  fc.array(wordArb, { minLength: min, maxLength: max });
const phraseArb = (min: number, max: number) =>
  wordsArb(min, max).map((ws) => ws.join(" ").replace(/^\s+|\s+$/g, ""));

// Arbitrary for the "age" field structure in metadatas
const ageBetweenArb = fc
  .tuple(fc.integer({ min: 0, max: 90 }), fc.integer({ min: 1, max: 100 }))
  .filter(([a, b]) => a < b)
  .map(([min, max]) => ({ type: "between" as const, ages: [min, max] }));

const ageThresholdArb = fc.oneof(
  fc.integer({ min: 0, max: 100 }).map((n) => ({ type: "moreThan" as const, ages: [n] })),
  fc.integer({ min: 0, max: 100 }).map((n) => ({ type: "lessThan" as const, ages: [n] })),
);

const ageArb = fc.oneof(ageBetweenArb, ageThresholdArb);

export type InsertableDispositif = {
  // Production-shaped fields used by API
  theme: mongoose.Types.ObjectId;
  secondaryThemes: mongoose.Types.ObjectId[];
  needs: mongoose.Types.ObjectId[];
  translations: Record<string, { title?: string; abstract?: string }>;
  title: string;
  name: string;
  titreMarque: string;
  abstract: string;
  sponsorName: string;
  metadatas: {
    location: string;
    frenchLevel: string[];
    public: string[];
    publicStatus: string[];
    age: { type: "between" | "moreThan" | "lessThan"; ages: number[] };
  };
  status: string;
  typeContenu: string;
};

export const makeDispositifArb = (
  conn: Connection,
  themeIds: ThemeSeedIds,
  needIds: NeedSeedIds,
) => {
  const enums = getEnumValues(conn);
  const frenchLevelArb = fc
    .array(fc.constantFrom(...enums.frenchLevels), { minLength: 1, maxLength: 3 })
    .map(uniq);
  const publicArb = fc
    .array(fc.constantFrom(...enums.publics), { minLength: 1, maxLength: 2 })
    .map(uniq);
  const refugeeStatusArb = fc
    .array(fc.constantFrom(...enums.refugeeStatuses), { minLength: 1, maxLength: 3 })
    .map(uniq);

  const themeArb = fc.constantFrom(themeIds.TA, themeIds.TB);

  return themeArb.chain((themeId) => {
    const themeIdStr = String(themeId);

    // Secondary themes: choose 0–2 themes explicitly excluding the primary `theme`
    const allThemes = [themeIds.TA, themeIds.TB, themeIds.TC];
    const otherThemes = allThemes.filter((t) => String(t) !== themeIdStr);
    const secondaryThemesArb = fc
      .array(fc.constantFrom(...otherThemes), {
        minLength: 0,
        maxLength: Math.min(2, otherThemes.length),
      })
      .map(uniq);

    // Needs must be related to the primary theme or any of the secondaryThemes
    const needsArb = secondaryThemesArb.chain((secs) => {
      const inScope = new Set([themeIdStr, ...secs.map((t) => String(t))]);
      const allowed: mongoose.Types.ObjectId[] = [];
      if (inScope.has(String(themeIds.TA))) allowed.push(needIds.NA1, needIds.NA2);
      if (inScope.has(String(themeIds.TB))) allowed.push(needIds.NB1);
      return fc
        .array(fc.constantFrom(...allowed), {
          minLength: 1,
          maxLength: Math.min(2, allowed.length),
        })
        .map(uniq);
    });

    // Pick 1–3 languages and build translations with title/abstract per lang
    const languagesArb = fc
      .array(fc.constantFrom(...enums.languages), { minLength: 1, maxLength: 3 })
      .map(uniq);

    const recordArb = fc.record<InsertableDispositif>({
      theme: fc.constant(themeId),
      secondaryThemes: secondaryThemesArb as any,
      needs: needsArb as any,
      // Generate simple phrases for Algolia-like fields
      title: phraseArb(2, 6),
      name: phraseArb(2, 4),
      titreMarque: phraseArb(1, 3),
      abstract: phraseArb(6, 14),
      sponsorName: fc.constantFrom(
        "Ville de Paris",
        "Département des Hauts-de-Seine",
        "Fondation Bien Vieillir",
        "Association Locale",
        "Ministère de l’Intégration",
      ),
      metadatas: fc.record({
        location: fc.constantFrom(...enums.locations),
        frenchLevel: frenchLevelArb,
        public: publicArb,
        publicStatus: refugeeStatusArb,
        age: ageArb,
      }),
      translations: languagesArb.chain((langs) =>
        fc.record(
          Object.fromEntries(
            langs.map((l) => [
              l,
              fc.record({ title: phraseArb(2, 6), abstract: phraseArb(6, 14) }),
            ]),
          ) as any,
        ),
      ),
      status: fc.constantFrom(...enums.statuses),
      // Force 'dispositif' to align with tests and API expectations
      typeContenu: fc.constant("dispositif"),
    });

    // Normalize: ensure each need's parent theme is in primary theme or secondaryThemes
    return recordArb.map((doc) => {
      const primary = String(doc.theme);
      const secs = (doc.secondaryThemes || []).map((t) => String(t));
      const inScope = new Set([primary, ...secs]);

      const needToTheme = (nid: mongoose.Types.ObjectId): string | null => {
        const s = String(nid);
        if (s === String(needIds.NA1) || s === String(needIds.NA2)) return String(themeIds.TA);
        if (s === String(needIds.NB1)) return String(themeIds.TB);
        return null;
      };

      const requiredThemes = new Set<string>();
      for (const n of doc.needs || []) {
        const t = needToTheme(n);
        if (t && !inScope.has(t)) requiredThemes.add(t);
      }

      if (requiredThemes.size > 0) {
        const toAdd = Array.from(requiredThemes).map((t) => new mongoose.Types.ObjectId(t));
        const merged = Array.from(new Set([...(doc.secondaryThemes || []), ...toAdd]));
        return { ...doc, secondaryThemes: merged };
      }
      return doc;
    });
  });
};

export async function seedRandomDispositifs(
  conn: Connection,
  count: number,
  seed?: number,
): Promise<number> {
  const themeIds = getThemeSeedIds();
  const needIds = getNeedSeedIds();
  const Dispositif = conn.model("Dispositif");
  await seedThemes(conn, themeIds);
  await seedNeeds(conn, needIds, themeIds);
  const arb = makeDispositifArb(conn, themeIds, needIds);
  const docs = fc.sample(arb, { seed, numRuns: count });
  await Dispositif.insertMany(docs);
  return docs.length;
}
