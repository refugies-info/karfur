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

export type RawDuplicateCandidate = Omit<DuplicateSearchCandidate, "url" | "score" | "reasons">;

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
  if (/^\d$/.test(trimmed)) {
    return `^(?:0?${escapeRegExp(trimmed)})\\s+-`;
  }
  if (/^\d{2,3}$/.test(trimmed) || /^(2A|2B)$/i.test(trimmed)) {
    return `^${escapeRegExp(trimmed)}\\s+-`;
  }
  return escapeRegExp(trimmed);
};

const getLocationSearchConditions = (query: DuplicateSearchQuery): Record<string, unknown>[] => {
  const conditions: Record<string, unknown>[] = [];

  for (const department of query.departments) {
    conditions.push({
      "metadatas.location": { $regex: departmentToRegex(department), $options: "i" },
    });
  }

  if (query.commune) {
    conditions.push({ "map.city": { $regex: escapeRegExp(query.commune), $options: "i" } });
  }

  return conditions;
};

const getSponsorSearchConditions = (query: DuplicateSearchQuery): Record<string, unknown>[] => {
  const conditions: Record<string, unknown>[] = [];

  if (!query.structureName) return conditions;

  const rawSponsorRegex = query.structureName.toLowerCase();
  conditions.push(buildStringRegexCondition("mainSponsorInfo.nom", query.structureName));
  conditions.push(buildStringRegexCondition("mainSponsorInfo.acronyme", query.structureName));
  for (const token of tokenize(query.structureName).slice(0, 4)) {
    if (token === rawSponsorRegex) continue;
    conditions.push(buildStringRegexCondition("mainSponsorInfo.nom", token));
    conditions.push(buildStringRegexCondition("mainSponsorInfo.acronyme", token));
  }

  return conditions;
};

const getTextSearchConditions = (query: DuplicateSearchQuery): Record<string, unknown>[] => {
  const conditions: Record<string, unknown>[] = [
    buildStringRegexCondition("translations.fr.content.titreInformatif", query.title),
    buildStringRegexCondition("translations.fr.content.titreMarque", query.title),
  ];

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

const buildOrMatch = (conditions: Record<string, unknown>[]): Record<string, unknown> =>
  conditions.length === 1 ? conditions[0] : { $or: conditions };

const buildConstrainedMatchStage = (
  signalConditions: Record<string, unknown>[],
  locationConditions: Record<string, unknown>[],
): PipelineStage.Match | null => {
  if (signalConditions.length === 0) return null;

  const andConditions = [buildOrMatch(signalConditions)];
  if (locationConditions.length > 0) {
    andConditions.push(buildOrMatch(locationConditions));
  }

  return {
    $match: andConditions.length === 1 ? andConditions[0] : { $and: andConditions },
  };
};

const buildRegexScoreExpression = (
  fieldExpression: string | Record<string, unknown>,
  value: string,
  score: number,
  escapeValue = true,
): Record<string, unknown> => ({
  $cond: [
    {
      $regexMatch: {
        input:
          typeof fieldExpression === "string"
            ? { $ifNull: [fieldExpression, ""] }
            : fieldExpression,
        regex: escapeValue ? escapeRegExp(value) : value,
        options: "i",
      },
    },
    score,
    0,
  ],
});

const joinFieldValues = (fieldExpression: string): Record<string, unknown> => ({
  $cond: [
    { $isArray: fieldExpression },
    {
      $reduce: {
        input: { $ifNull: [fieldExpression, []] },
        initialValue: "",
        in: {
          $cond: [{ $eq: ["$$value", ""] }, "$$this", { $concat: ["$$value", " ", "$$this"] }],
        },
      },
    },
    { $ifNull: [fieldExpression, ""] },
  ],
});

const buildDuplicateSearchScoreExpression = (
  query: DuplicateSearchQuery,
): Record<string, unknown> => {
  const normalizedTitle = normalizeText(query.title);
  const rawTitleRegex = query.title.toLowerCase();
  const expressions: Record<string, unknown>[] = [
    buildRegexScoreExpression("$translations.fr.content.titreInformatif", query.title, 4),
    buildRegexScoreExpression("$translations.fr.content.titreMarque", query.title, 4),
  ];

  for (const token of tokenize(query.title)) {
    if (token === normalizedTitle && token === rawTitleRegex) continue;
    expressions.push(
      buildRegexScoreExpression("$translations.fr.content.titreInformatif", token, 1),
    );
    expressions.push(buildRegexScoreExpression("$translations.fr.content.titreMarque", token, 1));
  }

  for (const token of tokenize(query.description).slice(0, 4)) {
    expressions.push(
      buildRegexScoreExpression("$translations.fr.content.titreInformatif", token, 1),
    );
    expressions.push(buildRegexScoreExpression("$translations.fr.content.titreMarque", token, 1));
  }

  if (query.commune) {
    expressions.push(buildRegexScoreExpression(joinFieldValues("$map.city"), query.commune, 5));
  }

  for (const department of query.departments) {
    expressions.push(
      buildRegexScoreExpression(
        joinFieldValues("$metadatas.location"),
        departmentToRegex(department),
        4,
        false,
      ),
    );
  }

  if (query.structureName) {
    const rawSponsorRegex = query.structureName.toLowerCase();
    expressions.push(buildRegexScoreExpression("$mainSponsorInfo.nom", query.structureName, 7));
    expressions.push(
      buildRegexScoreExpression("$mainSponsorInfo.acronyme", query.structureName, 7),
    );

    for (const token of tokenize(query.structureName).slice(0, 4)) {
      if (token === rawSponsorRegex) continue;
      expressions.push(buildRegexScoreExpression("$mainSponsorInfo.nom", token, 2));
      expressions.push(buildRegexScoreExpression("$mainSponsorInfo.acronyme", token, 2));
    }
  }

  return { $add: expressions };
};

export const buildDuplicateSearchPipeline = (query: DuplicateSearchQuery): PipelineStage[] => {
  const textConditions = getTextSearchConditions(query);
  const locationConditions = getLocationSearchConditions(query);
  const sponsorConditions = getSponsorSearchConditions(query);
  const needsSponsorSearch = sponsorConditions.length > 0;
  const dbLimit = Math.min(query.limit * 4, MAX_DB_CANDIDATES);

  const pipeline: PipelineStage[] = [
    {
      $match: {
        status: "Actif",
        typeContenu: "dispositif",
      },
    },
  ];

  if (!needsSponsorSearch) {
    const preLookupMatch = buildConstrainedMatchStage(textConditions, locationConditions);
    if (preLookupMatch) pipeline.push(preLookupMatch);
  }

  pipeline.push(
    {
      $lookup: {
        from: "structures",
        localField: "mainSponsor",
        foreignField: "_id",
        as: "mainSponsorInfo",
      },
    },
    {
      $unwind: {
        path: "$mainSponsorInfo",
        preserveNullAndEmptyArrays: true,
      },
    },
  );

  if (needsSponsorSearch) {
    const postLookupMatch = buildConstrainedMatchStage(
      [...textConditions, ...sponsorConditions],
      locationConditions,
    );
    if (postLookupMatch) pipeline.push(postLookupMatch);
  }

  pipeline.push(
    { $addFields: { duplicateSearchScore: buildDuplicateSearchScoreExpression(query) } },
    { $sort: { duplicateSearchScore: -1, publishedAt: -1, updatedAt: -1 } },
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
  );

  return pipeline;
};

const getInitials = (value: string | undefined) =>
  (value || "")
    .match(/[\p{L}\p{N}]+/gu)
    ?.map((word) => word[0])
    .join("")
    .toLowerCase() || "";

const includesEitherWay = (a: string, b: string) =>
  a.length > 0 && b.length > 0 && (a.includes(b) || b.includes(a));

const isDepartmentCode = (department: string) =>
  /^\d+$/.test(department) || /^(2a|2b)$/.test(department);

const departmentCodeVariants = (department: string) =>
  /^\d$/.test(department) ? [department, `0${department}`] : [department];

const locationMatchesDepartment = (location: string, department: string) => {
  if (!department) return false;

  if (isDepartmentCode(department)) {
    return departmentCodeVariants(department).some(
      (code) => location === code || location.startsWith(`${code} `),
    );
  }

  return includesEitherWay(location, department);
};

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
          locations.some((location) => locationMatchesDepartment(location, department)),
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
