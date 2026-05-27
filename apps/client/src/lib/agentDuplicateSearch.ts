import type { PipelineStage } from "mongoose";

export interface DuplicateSearchRequest {
  title: string;
  description?: string;
  structureName?: string;
  commune?: string;
  departments?: string[];
  limit?: number;
}

export interface DuplicateSearchCandidate {
  id: string;
  url: string;
  titreInformatif?: string;
  titreMarque?: string;
  location?: string | string[];
  city: string[];
  mainSponsorNom?: string;
  mainSponsorAcronyme?: string;
  score: number;
  reasons: string[];
}

export interface DuplicateSearchQuery {
  title: string;
  description?: string;
  structureName?: string;
  commune?: string;
  departments: string[];
  limit: number;
}

type RawDuplicateCandidate = Omit<DuplicateSearchCandidate, "url" | "score" | "reasons">;

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 30;
const MAX_DB_CANDIDATES = 100;

const STOP_WORDS = new Set([
  "avec",
  "dans",
  "des",
  "les",
  "pour",
  "une",
  "aux",
  "sur",
  "par",
  "sans",
  "formation",
  "dispositif",
  "itineraire",
  "langue",
  "etrangere",
  "francais",
  "française",
]);

const normalizeText = (value: string | undefined | null) =>
  (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const parseLimit = (value: unknown): number => {
  const limit = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(limit) || limit <= 0) return DEFAULT_LIMIT;
  return Math.min(Math.trunc(limit), MAX_LIMIT);
};

export const parseDuplicateSearchRequest = (body: unknown): DuplicateSearchQuery => {
  if (!isObject(body)) {
    throw new Error("Request body must be an object");
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : undefined;
  const structureName =
    typeof body.structureName === "string" ? body.structureName.trim() : undefined;
  const commune = typeof body.commune === "string" ? body.commune.trim() : undefined;
  const departments = toStringArray(body.departments).map((department) => department.trim());
  const limit = parseLimit(body.limit);

  if (!title) {
    throw new Error("Field 'title' is required");
  }

  if (!title && !description && !structureName && !commune && departments.length === 0) {
    throw new Error("At least one search criterion is required");
  }

  return {
    title,
    ...(description ? { description } : {}),
    ...(structureName ? { structureName } : {}),
    ...(commune ? { commune } : {}),
    departments,
    limit,
  };
};

const tokenize = (value: string | undefined): string[] => {
  if (!value) return [];

  const originalTokens = value.match(/[\p{L}\p{N}]+/gu) || [];
  return Array.from(
    new Set(
      originalTokens
        .filter((token) => token.length >= 4 || /^[A-Z0-9]{2,}$/.test(token))
        .map((token) => normalizeText(token))
        .filter((token) => token.length >= 3 && !STOP_WORDS.has(token)),
    ),
  ).slice(0, 8);
};

const buildStringRegexCondition = (field: string, value: string): Record<string, unknown> => ({
  [field]: { $regex: escapeRegExp(value), $options: "i" },
});

const departmentToRegex = (department: string) => {
  const trimmed = department.trim();
  if (/^\d{2,3}$/.test(trimmed) || /^(2A|2B)$/i.test(trimmed)) {
    return `^${escapeRegExp(trimmed)}\\s+-`;
  }
  return escapeRegExp(trimmed);
};

const getSearchConditions = (query: DuplicateSearchQuery): Record<string, unknown>[] => {
  const conditions: Record<string, unknown>[] = [];

  for (const department of query.departments) {
    conditions.push({
      "metadatas.location": { $regex: departmentToRegex(department), $options: "i" },
    });
  }

  if (query.commune) {
    conditions.push({ "map.city": { $regex: escapeRegExp(query.commune), $options: "i" } });
  }

  if (query.structureName) {
    conditions.push(buildStringRegexCondition("mainSponsorInfo.nom", query.structureName));
    conditions.push(buildStringRegexCondition("mainSponsorInfo.acronyme", query.structureName));
    for (const token of tokenize(query.structureName).slice(0, 4)) {
      conditions.push(buildStringRegexCondition("mainSponsorInfo.nom", token));
      conditions.push(buildStringRegexCondition("mainSponsorInfo.acronyme", token));
    }
  }

  conditions.push(
    buildStringRegexCondition("translations.fr.content.titreInformatif", query.title),
  );
  conditions.push(buildStringRegexCondition("translations.fr.content.titreMarque", query.title));
  for (const token of tokenize(query.title)) {
    conditions.push(buildStringRegexCondition("translations.fr.content.titreInformatif", token));
    conditions.push(buildStringRegexCondition("translations.fr.content.titreMarque", token));
  }

  for (const token of tokenize(query.description).slice(0, 4)) {
    conditions.push(buildStringRegexCondition("translations.fr.content.titreInformatif", token));
    conditions.push(buildStringRegexCondition("translations.fr.content.titreMarque", token));
  }

  return conditions;
};

export const buildDuplicateSearchPipeline = (query: DuplicateSearchQuery): PipelineStage[] => {
  const conditions = getSearchConditions(query);
  const dbLimit = Math.min(query.limit * 4, MAX_DB_CANDIDATES);

  return [
    {
      $match: {
        status: "Actif",
        typeContenu: "dispositif",
      },
    },
    {
      $lookup: {
        from: "structures",
        let: { sponsorId: "$mainSponsor" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$sponsorId"],
              },
            },
          },
          { $limit: 1 },
          { $project: { nom: 1, acronyme: 1, _id: 0 } },
        ],
        as: "mainSponsorInfo",
      },
    },
    {
      $unwind: {
        path: "$mainSponsorInfo",
        preserveNullAndEmptyArrays: true,
      },
    },
    ...(conditions.length > 0 ? [{ $match: { $or: conditions } }] : []),
    { $sort: { publishedAt: -1, updatedAt: -1 } },
    { $limit: dbLimit },
    {
      $project: {
        _id: 0,
        id: { $toString: "$_id" },
        titreInformatif: "$translations.fr.content.titreInformatif",
        titreMarque: "$translations.fr.content.titreMarque",
        location: "$metadatas.location",
        city: {
          $filter: {
            input: { $ifNull: ["$map.city", []] },
            as: "item",
            cond: {
              $and: [{ $ne: ["$$item", null] }, { $ne: ["$$item", ""] }],
            },
          },
        },
        mainSponsorNom: "$mainSponsorInfo.nom",
        mainSponsorAcronyme: "$mainSponsorInfo.acronyme",
      },
    },
  ];
};

const getInitials = (value: string | undefined) =>
  (value || "")
    .match(/[\p{L}\p{N}]+/gu)
    ?.map((word) => word[0])
    .join("")
    .toLowerCase() || "";

const includesEitherWay = (a: string, b: string) =>
  a.length > 0 && b.length > 0 && (a.includes(b) || b.includes(a));

const candidateLocations = (candidate: RawDuplicateCandidate) =>
  Array.isArray(candidate.location)
    ? candidate.location
    : candidate.location
      ? [candidate.location]
      : [];

export const scoreDuplicateCandidates = (
  candidates: RawDuplicateCandidate[],
  query: DuplicateSearchQuery,
): DuplicateSearchCandidate[] => {
  const titleTokens = tokenize(query.title);
  const descriptionTokens = tokenize(query.description);
  const normalizedTitle = normalizeText(query.title);
  const normalizedStructure = normalizeText(query.structureName);
  const normalizedCommune = normalizeText(query.commune);
  const normalizedDepartments = query.departments.map(normalizeText);
  const structureInitials = getInitials(query.structureName);

  return candidates
    .map((candidate) => {
      let score = 0;
      const reasons: string[] = [];
      const candidateTitle = normalizeText(
        [candidate.titreInformatif, candidate.titreMarque].filter(Boolean).join(" "),
      );
      const candidateSponsor = normalizeText(
        [candidate.mainSponsorNom, candidate.mainSponsorAcronyme].filter(Boolean).join(" "),
      );
      const candidateCities = candidate.city.map(normalizeText);
      const locations = candidateLocations(candidate).map(normalizeText);

      if (
        normalizedCommune &&
        candidateCities.some((city) => includesEitherWay(city, normalizedCommune))
      ) {
        score += 5;
        reasons.push("same city");
      }

      if (
        normalizedDepartments.length > 0 &&
        normalizedDepartments.some((department) =>
          locations.some(
            (location) =>
              includesEitherWay(location, department) || location.startsWith(`${department} `),
          ),
        )
      ) {
        score += 4;
        reasons.push("same department/location");
      }

      if (normalizedStructure && includesEitherWay(candidateSponsor, normalizedStructure)) {
        score += 5;
        reasons.push("similar sponsor");
      } else if (
        structureInitials.length >= 2 &&
        normalizeText(candidate.mainSponsorAcronyme).includes(structureInitials)
      ) {
        score += 4;
        reasons.push("sponsor acronym match");
      }

      if (includesEitherWay(candidateTitle, normalizedTitle)) {
        score += 4;
        reasons.push("similar title");
      } else {
        const overlap = titleTokens.filter((token) => candidateTitle.includes(token)).length;
        if (overlap > 0) {
          score += Math.min(overlap, 3);
          reasons.push("shared title keywords");
        }
      }

      const descriptionOverlap = descriptionTokens.filter((token) =>
        candidateTitle.includes(token),
      ).length;
      if (descriptionOverlap > 0) {
        score += Math.min(descriptionOverlap, 2);
        reasons.push("shared description keywords");
      }

      return {
        ...candidate,
        url: `https://refugies.info/dispositif/${candidate.id}`,
        score,
        reasons,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, query.limit);
};
