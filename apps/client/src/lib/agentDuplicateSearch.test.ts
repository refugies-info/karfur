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
      expect(pipeline).toContainEqual({ $limit: 40 });
    });
  });

  describe("scoreDuplicateCandidates", () => {
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
