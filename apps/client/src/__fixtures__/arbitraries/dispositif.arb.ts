import fc from "fast-check";
import type { Connection } from "mongoose";
import mongoose from "mongoose";

import type { SeedIds } from "~/__fixtures__/seedDispositifs";

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

const uniq = <T,>(arr: T[]) => Array.from(new Set(arr));

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
const wordsArb = (min: number, max: number) => fc.array(wordArb, { minLength: min, maxLength: max });
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

export const makeDispositifArb = (conn: Connection, ids: SeedIds) => {
  const enums = getEnumValues(conn);
  const frenchLevelArb = fc
    .array(fc.constantFrom(...enums.frenchLevels), { minLength: 1, maxLength: 3 })
    .map(uniq);
  const publicArb = fc.array(fc.constantFrom(...enums.publics), { minLength: 1, maxLength: 2 }).map(uniq);
  const refugeeStatusArb = fc
    .array(fc.constantFrom(...enums.refugeeStatuses), { minLength: 1, maxLength: 3 })
    .map(uniq);

  const themeArb = fc.constantFrom(ids.themeA, ids.themeB);

  return themeArb.chain((themeId) => {
    const themeIdStr = String(themeId);
    const allowedNeeds = themeIdStr === String(ids.themeA) ? [ids.needA1, ids.needA2] : [ids.needB1];

    // Secondary themes: 0–2 from the other theme(s)
    const secondaryThemesArb = fc.constantFrom(
      [],
      [ids.themeA === themeId ? ids.themeB : ids.themeA],
    ).chain((arr) =>
      // Optionally add none or one extra (we only have two themes in SeedIds)
      fc.constant(arr),
    );

    // Pick 1–3 languages and build translations with title/abstract per lang
    const languagesArb = fc.array(fc.constantFrom(...enums.languages), { minLength: 1, maxLength: 3 }).map(uniq);

    return fc.record<InsertableDispositif>({
      theme: fc.constant(themeId),
      secondaryThemes: secondaryThemesArb as any,
      needs: fc
        .array(fc.constantFrom(...allowedNeeds), {
          minLength: 1,
          maxLength: Math.min(2, allowedNeeds.length),
        })
        .map(uniq),
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
            langs.map((l) => [l, fc.record({ title: phraseArb(2, 6), abstract: phraseArb(6, 14) })]),
          ) as any,
        ),
      ),
      status: fc.constantFrom(...enums.statuses),
      // Force 'dispositif' to align with tests and API expectations
      typeContenu: fc.constant("dispositif"),
    });
  });
};

export async function seedRandomDispositifs(
  conn: Connection,
  ids: SeedIds,
  count: number,
  seed?: number,
): Promise<number> {
  const Dispositif = conn.model("Dispositif");
  const arb = makeDispositifArb(conn, ids);
  const docs = fc.sample(arb, { seed, numRuns: count });
  await Dispositif.insertMany(docs);
  return docs.length;
}
