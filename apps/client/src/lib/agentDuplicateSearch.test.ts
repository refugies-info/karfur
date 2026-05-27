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
    it("filters active dispositifs and looks up sponsor with _id", () => {
      const pipeline = buildDuplicateSearchPipeline({
        title: "Cours FLE",
        structureName: "FTDA",
        commune: "Paris",
        departments: ["75"],
        limit: 10,
      });

      expect(pipeline[0]).toEqual({
        $match: { status: "Actif", typeContenu: "dispositif" },
      });
      expect(pipeline[1]).toMatchObject({
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
