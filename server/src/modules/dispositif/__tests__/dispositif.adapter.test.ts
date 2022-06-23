// @ts-nocheck
import {
  formatDispositifsByCreator,
  getTitreInfoOrMarque,
  countDispositifMercis,
  filterContentsOnGeoloc
} from "../dispositif.adapter";

describe("formatDispositifsByCreator", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should format data", () => {
    const creator1 = {
      _id: "creatorId1",
      email: "email1",
      username: "username1",
    };

    const creator2 = {
      _id: "creatorId2",
      email: "email2",
      username: "username2",
    };

    const creator3 = {
      _id: "creatorId3",
      email: "email3",
      username: "username3",
    };

    const dispositifs = [
      {
        _id: "dispoId1",
        titreInformatif: "t1",
        creatorId: creator1,
      },
      {
        _id: "dispoId2",
        titreInformatif: "t2",
        creatorId: creator2,
      },
      {
        _id: "dispoId3",
        titreInformatif: "t3",
        creatorId: creator1,
      },
      {
        _id: "dispoId4",
        titreInformatif: "t4",
        creatorId: creator2,
      },
      {
        _id: "dispoId5",
        titreInformatif: "t5",
        creatorId: creator3,
      },
    ];
    const expectedResult = [
      {
        creatorId: "creatorId1",
        username: "username1",
        email: "email1",
        dispositifs: [
          { _id: "dispoId1", titreInformatif: "t1" },
          { _id: "dispoId3", titreInformatif: "t3" },
        ],
      },
      {
        creatorId: "creatorId2",
        username: "username2",
        email: "email2",
        dispositifs: [
          { _id: "dispoId2", titreInformatif: "t2" },
          { _id: "dispoId4", titreInformatif: "t4" },
        ],
      },

      {
        creatorId: "creatorId3",
        username: "username3",
        email: "email3",
        dispositifs: [{ _id: "dispoId5", titreInformatif: "t5" }],
      },
    ];

    const res = formatDispositifsByCreator(dispositifs);

    expect(res).toEqual(expectedResult);
  });
});

describe("getTitreInfoOrMarque", () => {
  it("should return empty string if no title", () => {
    const res = getTitreInfoOrMarque(undefined);
    expect(res).toEqual("");
  });

  it("should return string if title string", () => {
    const res = getTitreInfoOrMarque("titre");
    expect(res).toEqual("titre");
  });

  it("should return string if title object", () => {
    const res = getTitreInfoOrMarque({ fr: "titre object", en: "title" });
    expect(res).toEqual("titre object");
  });
});

describe("countDispositifMercis", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should format data", () => {
    const dispositifs = [
      {
        _id: "dispoId1",
        titreInformatif: "t1",
        merci: [{added_at: "x"}]
      },
      {
        _id: "dispoId2",
        titreInformatif: "t2",
        merci: [{added_at: "x"}, {added_at: "x"}]
      },
      {
        _id: "dispoId3",
        titreInformatif: "t3",
        merci: []
      },
      {
        _id: "dispoId4",
        titreInformatif: "t4",
      }
    ];
    const expectedResult = [
      {
        _id: "dispoId1",
        titreInformatif: "t1",
        nbMercis: 1
      },
      {
        _id: "dispoId2",
        titreInformatif: "t2",
        nbMercis: 2
      },
      {
        _id: "dispoId3",
        titreInformatif: "t3",
        nbMercis: 0
      },
      {
        _id: "dispoId4",
        titreInformatif: "t4",
        nbMercis: 0
      }
    ]

    const res = countDispositifMercis(dispositifs);

    expect(res).toEqual(expectedResult);
  });

  const contents = [
    {
      contenu: [
        {},
        {
          children: [
            {
              title: "Zone d'action",
              departments: ["All"]
            }
          ]
        }
      ]
    },
    {
      contenu: [
        {},
        {
          children: [
            {
              title: "Zone d'action",
              departments: ["63 - Puy-de-Dôme"]
            }
          ]
        }
      ]
    },
  ]

  describe("filterContentsOnGeoloc", () => {
    it("should return 1 content", () => {
      const res1 = filterContentsOnGeoloc(contents, "Puy-de-Dôme", true);
      expect(res1).toEqual([{
        contenu: [
          {},
          {
            children: [
              {
                title: "Zone d'action",
                departments: ["63 - Puy-de-Dôme"]
              }
            ]
          }
        ]
      }]);

      const res2 = filterContentsOnGeoloc(contents, "Puy-de-Dome", true);
      expect(res2).toEqual([{
        contenu: [
          {},
          {
            children: [
              {
                title: "Zone d'action",
                departments: ["63 - Puy-de-Dôme"]
              }
            ]
          }
        ]
      }]);
    });

    it("should return 2 content", () => {
      const res = filterContentsOnGeoloc(contents, "Puy-de-Dôme", false);
      expect(res).toEqual([
        {
          contenu: [
            {},
            {
              children: [
                {
                  title: "Zone d'action",
                  departments: ["All"]
                }
              ]
            }
          ]
        },
        {
          contenu: [
            {},
            {
              children: [
                {
                  title: "Zone d'action",
                  departments: ["63 - Puy-de-Dôme"]
                }
              ]
            }
          ]
        }]);
    });
  });
});
