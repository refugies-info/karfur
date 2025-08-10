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
    return {
      locations: locationEnums,
      statuses: statusEnums,
      types: typeEnums,
      frenchLevels: levelEnums,
      publics: publicEnums,
    } as const;
  } catch {
    return {
      locations: ["75 - Paris", "92 - Hauts-de-Seine", "france", "online"],
      statuses: ["Actif", "Archivé"],
      types: ["dispositif", "online"],
      frenchLevels: ["A1", "A2", "B1", "B2", "C1", "C2"],
      publics: ["family", "women", "youths", "senior", "gender"],
    } as const;
  }
}

const uniq = <T,>(arr: T[]) => Array.from(new Set(arr));

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
  thematiques: mongoose.Types.ObjectId[];
  besoins: mongoose.Types.ObjectId[];
  metadatas: {
    location: string;
    frenchLevel: string[];
    public: string[];
    age: { type: "between" | "moreThan" | "lessThan"; ages: number[] };
  };
  availableLanguages: string[];
  status: string;
  typeContenu: string;
};

export const makeDispositifArb = (conn: Connection, ids: SeedIds) => {
  const enums = getEnumValues(conn);
  const frenchLevelArb = fc
    .array(fc.constantFrom(...enums.frenchLevels), { minLength: 1, maxLength: 3 })
    .map(uniq);
  const publicArb = fc.array(fc.constantFrom(...enums.publics), { minLength: 1, maxLength: 2 }).map(uniq);

  const themeArb = fc.constantFrom(ids.themeA, ids.themeB);

  return themeArb.chain((themeId) => {
    const themeIdStr = String(themeId);
    const allowedNeeds = themeIdStr === String(ids.themeA) ? [ids.needA1, ids.needA2] : [ids.needB1];

    return fc.record<InsertableDispositif>({
      thematiques: fc.constant([themeId]),
      besoins: fc
        .array(fc.constantFrom(...allowedNeeds), {
          minLength: 1,
          maxLength: Math.min(2, allowedNeeds.length),
        })
        .map(uniq),
      metadatas: fc.record({
        location: fc.constantFrom(...enums.locations),
        frenchLevel: frenchLevelArb,
        public: publicArb,
        age: ageArb,
      }),
      availableLanguages: fc.array(fc.constantFrom("fr", "en"), { minLength: 1, maxLength: 2 }).map(uniq),
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
