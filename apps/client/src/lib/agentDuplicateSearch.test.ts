import {
  buildDuplicateSearchPipeline,
  parseDuplicateSearchRequest,
  scoreDuplicateCandidates,
} from "./agentDuplicateSearch";

describe("agentDuplicateSearch", () => {
  describe("parseDuplicateSearchRequest", () => {
    it("normalizes valid requests and caps the limit", () => {
      expect(
        parseDuplicateSearchRequest({
          title: "  Cours FLE  ",
          structureName: "  FTDA ",
          commune: "Paris",
          departments: ["75", "invalid"],
          limit: 100,
        }),
      ).toEqual({
        title: "Cours FLE",
        structureName: "FTDA",
        commune: "Paris",
        departments: ["75", "invalid"],
        limit: 30,
      });
    });

    it("requires a title", () => {
      expect(() => parseDuplicateSearchRequest({ structureName: "FTDA" })).toThrow(
        "Field 'title' is required",
      );
    });
  });

  describe("buildDuplicateSearchPipeline", () => {
    it("filters on title and location before looking up sponsors when structure is absent", () => {
      const pipeline = buildDuplicateSearchPipeline({
        title: "Cours FLE",
        commune: "Paris",
        departments: ["75"],
        limit: 10,
      });

      expect(pipeline[0]).toEqual({
        $match: { status: "Actif", typeContenu: "dispositif" },
      });
      expect(pipeline[1]).toMatchObject({
        $match: {
          $and: [
            {
              $or: expect.arrayContaining([
                {
                  "translations.fr.content.titreInformatif": { $regex: "Cours FLE", $options: "i" },
                },
                { "translations.fr.content.titreMarque": { $regex: "Cours FLE", $options: "i" } },
              ]),
            },
            {
              $or: expect.arrayContaining([
                { "metadatas.location": { $regex: "^75\\s+-", $options: "i" } },
                { "map.city": { $regex: "Paris", $options: "i" } },
              ]),
            },
          ],
        },
      });
      expect(pipeline[2]).toEqual({
        $lookup: {
          from: "structures",
          localField: "mainSponsor",
          foreignField: "_id",
          as: "mainSponsorInfo",
        },
      });
      expect(pipeline).toContainEqual({
        $sort: { duplicateSearchScore: -1, publishedAt: -1, updatedAt: -1 },
      });
      expect(pipeline).toContainEqual({ $limit: 40 });
    });

    it("matches sponsor fields after lookup when structure is provided", () => {
      const pipeline = buildDuplicateSearchPipeline({
        title: "Cours FLE",
        structureName: "FTDA",
        commune: "Paris",
        departments: ["75"],
        limit: 10,
      });

      expect(pipeline[1]).toEqual({
        $lookup: {
          from: "structures",
          localField: "mainSponsor",
          foreignField: "_id",
          as: "mainSponsorInfo",
        },
      });
      expect(pipeline[2]).toEqual({
        $unwind: {
          path: "$mainSponsorInfo",
          preserveNullAndEmptyArrays: true,
        },
      });
      expect(pipeline[3]).toMatchObject({
        $match: {
          $and: [
            {
              $or: expect.arrayContaining([
                {
                  "translations.fr.content.titreInformatif": { $regex: "Cours FLE", $options: "i" },
                },
                { "mainSponsorInfo.nom": { $regex: "FTDA", $options: "i" } },
                { "mainSponsorInfo.acronyme": { $regex: "FTDA", $options: "i" } },
              ]),
            },
            {
              $or: expect.arrayContaining([
                { "metadatas.location": { $regex: "^75\\s+-", $options: "i" } },
                { "map.city": { $regex: "Paris", $options: "i" } },
              ]),
            },
          ],
        },
      });
      expect(pipeline).toContainEqual({
        $addFields: { duplicateSearchScore: expect.any(Object) },
      });
      expect(pipeline).toContainEqual({
        $sort: { duplicateSearchScore: -1, publishedAt: -1, updatedAt: -1 },
      });
      expect(pipeline).toContainEqual({ $limit: 40 });
    });

    it("keeps normalized sponsor fallback for accented names", () => {
      const pipeline = buildDuplicateSearchPipeline({
        title: "Atelier cuisine",
        structureName: "Café",
        departments: [],
        limit: 10,
      });

      const serializedPipeline = JSON.stringify(pipeline);
      expect(serializedPipeline).toContain('"regex":"Café"');
      expect(serializedPipeline).toContain('"regex":"cafe"');
    });

    it("does not duplicate single-word title score expressions", () => {
      const pipeline = buildDuplicateSearchPipeline({
        title: "FLE",
        departments: [],
        limit: 10,
      });
      const addFieldsStage = pipeline.find((stage) => "$addFields" in stage);

      const serializedScore = JSON.stringify(addFieldsStage);
      expect(serializedScore).toContain('"regex":"FLE"');
      expect(serializedScore).not.toContain('"regex":"fle"');
    });

    it("includes sponsor and location signals in the pre-limit score", () => {
      const pipeline = buildDuplicateSearchPipeline({
        title: "Cours FLE",
        structureName: "FTDA",
        commune: "Paris",
        departments: ["75"],
        limit: 10,
      });
      const addFieldsStage = pipeline.find((stage) => "$addFields" in stage);

      const serializedScore = JSON.stringify(addFieldsStage);
      expect(serializedScore).toContain("$mainSponsorInfo.nom");
      expect(serializedScore).toContain("$map.city");
      expect(serializedScore).toContain("$metadatas.location");
    });
  });

  describe("scoreDuplicateCandidates", () => {
    it("does not match numeric department codes by substring", () => {
      const [candidate] = scoreDuplicateCandidates(
        [
          {
            id: "marseille",
            titreInformatif: "Cours FLE",
            titreMarque: "Français",
            location: ["13 - Bouches-du-Rhône"],
            city: ["Marseille"],
            mainSponsorNom: "France Terre d'Asile",
            mainSponsorAcronyme: "FTDA",
          },
        ],
        {
          title: "Cours FLE",
          structureName: "France Terre d'Asile",
          commune: "",
          departments: ["3"],
          limit: 10,
        },
      );

      expect(candidate.reasons).not.toContain("same department/location");
    });

    it("matches one-digit department codes against zero-padded locations", () => {
      const [candidate] = scoreDuplicateCandidates(
        [
          {
            id: "allier",
            titreInformatif: "Cours FLE",
            titreMarque: "Français",
            location: ["03 - Allier"],
            city: ["Vichy"],
            mainSponsorNom: "France Terre d'Asile",
            mainSponsorAcronyme: "FTDA",
          },
        ],
        {
          title: "Cours FLE",
          structureName: "France Terre d'Asile",
          commune: "",
          departments: ["3"],
          limit: 10,
        },
      );

      expect(candidate.reasons).toContain("same department/location");
    });

    it("scores location, sponsor and content similarities", () => {
      const [candidate] = scoreDuplicateCandidates(
        [
          {
            id: "abc123",
            titreInformatif: "Apprendre le français pour le travail",
            titreMarque: "Cours FLE",
            location: ["75 - Paris"],
            city: ["Paris"],
            mainSponsorNom: "France Terre d'Asile",
            mainSponsorAcronyme: "FTDA",
          },
        ],
        {
          title: "Cours FLE",
          structureName: "France Terre d'Asile",
          commune: "Paris",
          departments: ["75"],
          limit: 10,
        },
      );

      expect(candidate).toMatchObject({
        id: "abc123",
        url: "https://refugies.info/dispositif/abc123",
      });
      expect(candidate.score).toBeGreaterThanOrEqual(18);
      expect(candidate.reasons).toEqual(
        expect.arrayContaining(["same city", "same department/location", "similar sponsor"]),
      );
    });
  });
});
