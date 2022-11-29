// @ts-nocheck
import { getContentsForApp } from "./getContentsForApp";
import { getActiveContentsFiltered } from "../../../modules/dispositif/dispositif.repository";

jest.mock("../../../modules/dispositif/dispositif.repository", () => ({
  getActiveContentsFiltered: jest.fn().mockResolvedValue([])
}));
type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("getContentsForApp", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const res = mockResponse();
  const neededFields = {
    titreInformatif: 1,
    titreMarque: 1,
    avancement: 1,
    contenu: 1,
    theme: 1,
    secondaryThemes: 1,
    needs: 1,
    typeContenu: 1,
    nbVues: 1,
    nbVuesMobile: 1
  };

  it("should return 405 if not from site", async () => {
    const req = { fromSite: false };
    await getContentsForApp(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });

  it("should return 400 if no query", async () => {
    const req = { fromSite: true };
    await getContentsForApp(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 400 if no locale in query", async () => {
    const req = { fromSite: true, query: {} };
    await getContentsForApp(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 200 when locale not fr", async () => {
    const content1 = {
      titreInformatif: "ti",
      titreMarque: "TM",
      _id: "_id",
      nbVues: 2,
      needs: [],
      theme: { _id: "theme1" },
      secondaryThemes: [],
      typeContenu: "dispositif"
    };
    const contents = [{ ...content1, mainSponsor: { picture: { secure_url: "url" } } }];
    getActiveContentsFiltered.mockResolvedValueOnce(contents);
    const req = { fromSite: true, query: { locale: "ar" } };
    await getContentsForApp(req, res);
    expect(getActiveContentsFiltered).toHaveBeenCalledWith(neededFields, {
      status: "Actif"
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      text: "Succès",
      data: [{ ...content1, sponsorUrl: "url" }],
      dataFr: [{ ...content1, sponsorUrl: "url" }]
    });
  });

  const contentsInput = [
    {
      titreInformatif: { ar: "tI_ar", fr: "ti" },
      titreMarque: { ar: "TM_ar", fr: "tm" },
      nbVues: 2,
      needs: [],
      theme: { _id: "theme1" },
      secondaryThemes: [],
      typeContenu: "dispositif",
      mainSponsor: { picture: { secure_url: "url" } }
    }
  ];
  it("should return 200 when locale is ar", async () => {
    getActiveContentsFiltered.mockResolvedValueOnce(contentsInput);
    const req = { fromSite: true, query: { locale: "ar" } };
    await getContentsForApp(req, res);
    expect(getActiveContentsFiltered).toHaveBeenCalledWith(neededFields, {
      status: "Actif"
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      text: "Succès",
      data: [
        {
          titreInformatif: "tI_ar",
          titreMarque: "TM_ar",
          nbVues: 2,
          needs: [],
          theme: { _id: "theme1" },
          secondaryThemes: [],
          typeContenu: "dispositif",
          sponsorUrl: "url"
        }
      ],
      dataFr: [
        {
          titreInformatif: "ti",
          titreMarque: "tm",
          nbVues: 2,
          needs: [],
          theme: { _id: "theme1" },
          secondaryThemes: [],
          typeContenu: "dispositif",
          sponsorUrl: "url"
        }
      ]
    });
  });

  it("should return 200 when locale is fr", async () => {
    getActiveContentsFiltered.mockResolvedValueOnce(contentsInput);
    const req = { fromSite: true, query: { locale: "fr" } };
    await getContentsForApp(req, res);
    expect(getActiveContentsFiltered).toHaveBeenCalledWith(neededFields, {
      status: "Actif"
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      text: "Succès",
      dataFr: [
        {
          titreInformatif: "ti",
          titreMarque: "tm",
          nbVues: 2,
          needs: [],
          theme: { _id: "theme1" },
          secondaryThemes: [],
          typeContenu: "dispositif",
          sponsorUrl: "url"
        }
      ]
    });
  });

  it("should return 500 if getActiveContentsFiltered throw", async () => {
    getActiveContentsFiltered.mockRejectedValueOnce(new Error("erreur"));
    const req = { fromSite: true, query: { locale: "ar" } };
    await getContentsForApp(req, res);
    expect(getActiveContentsFiltered).toHaveBeenCalledWith(neededFields, {
      status: "Actif"
    });
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("should call getActiveContentsFiltered with correct data", async () => {
    const req = {
      fromSite: true,
      query: {
        locale: "fr",
        age: "0 à 17 ans",
        frenchLevel: "Je parle un peu"
      }
    };
    const query = {
      "status": "Actif",
      "audienceAge.bottomValue": { $lte: 17 },
      "$and": [{ niveauFrancais: { $ne: ["Avancé"] } }, { niveauFrancais: { $ne: ["Intermédiaire"] } }]
    };
    await getContentsForApp(req, res);
    expect(getActiveContentsFiltered).toHaveBeenCalledWith(neededFields, query);
  });

  it("should call getActiveContentsFiltered with correct data", async () => {
    const req = {
      fromSite: true,
      query: {
        locale: "fr",
        age: "18 à 25 ans",
        frenchLevel: "Je parle un peu"
      }
    };
    const query = {
      "status": "Actif",
      "audienceAge.bottomValue": { $lte: 25 },
      "audienceAge.topValue": { $gte: 18 },
      "$and": [{ niveauFrancais: { $ne: ["Avancé"] } }, { niveauFrancais: { $ne: ["Intermédiaire"] } }]
    };
    await getContentsForApp(req, res);
    expect(getActiveContentsFiltered).toHaveBeenCalledWith(neededFields, query);
  });

  it("should call getActiveContentsFiltered with correct data", async () => {
    const req = {
      fromSite: true,
      query: {
        locale: "fr",
        age: "26 ans et plus",
        frenchLevel: "Je parle bien"
      }
    };
    const query = {
      "status": "Actif",
      "audienceAge.topValue": { $gte: 26 },
      "niveauFrancais": { $ne: ["Avancé"] }
    };
    await getContentsForApp(req, res);
    expect(getActiveContentsFiltered).toHaveBeenCalledWith(neededFields, query);
  });

  it("should call getActiveContentsFiltered and filter geoloc", async () => {
    const data = [
      {
        _id: "id1",
        titreInformatif: "TI1",
        contenu: [
          {},
          {
            children: [
              {
                type: "card",
                isFakeContent: false,
                title: "Zone d'action",
                titleIcon: "pin-outline",
                typeIcon: "eva",
                departments: ["38 - Isère"],
                free: true,
                contentTitle: "Sélectionner",
                editable: false
              }
            ]
          }
        ],
        nbVues: 2,
        needs: [],
        mainSponsor: { picture: { secure_url: "url" } },

        theme: { _id: "theme1" },
        secondaryThemes: [],
        typeContenu: "dispositif"
      },

      {
        _id: "id3",
        titreInformatif: "TI3",
        contenu: [
          {},
          {
            children: [
              {
                type: "card",
                isFakeContent: false,
                title: "Zone d'action",
                titleIcon: "pin-outline",
                typeIcon: "eva",
                departments: ["All"],
                free: true,
                contentTitle: "Sélectionner",
                editable: false
              }
            ]
          }
        ],
        nbVues: 2,
        needs: [],
        mainSponsor: { picture: { secure_url: "url" } },

        theme: { _id: "theme1" },
        secondaryThemes: [],
        typeContenu: "dispositif"
      },
      {
        _id: "id4",
        titreInformatif: "TI4",
        contenu: [
          {},
          {
            children: [
              {
                type: "card",
                isFakeContent: false,
                title: "Zone d'action",
                titleIcon: "pin-outline",
                typeIcon: "eva",
                departments: ["75 - Paris"],
                free: true,
                contentTitle: "Sélectionner",
                editable: false
              }
            ]
          }
        ],
        nbVues: 2,
        needs: [],
        mainSponsor: { picture: { secure_url: "url" } },

        theme: { _id: "theme1" },
        secondaryThemes: [],
        typeContenu: "dispositif"
      }
    ];
    getActiveContentsFiltered.mockResolvedValueOnce(data);
    const req = {
      fromSite: true,
      query: {
        locale: "fr",
        department: "Paris"
      }
    };
    const query = {
      status: "Actif"
    };
    await getContentsForApp(req, res);
    expect(getActiveContentsFiltered).toHaveBeenCalledWith(neededFields, query);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      text: "Succès",
      dataFr: [
        {
          _id: "id3",
          titreInformatif: "TI3",
          titreMarque: "",
          nbVues: 2,
          needs: [],
          sponsorUrl: "url",
          theme: { _id: "theme1" },
          secondaryThemes: [],
          typeContenu: "dispositif"
        },
        {
          _id: "id4",
          titreInformatif: "TI4",
          titreMarque: "",
          nbVues: 2,
          needs: [],
          sponsorUrl: "url",
          theme: { _id: "theme1" },
          secondaryThemes: [],
          typeContenu: "dispositif"
        }
      ]
    });
  });

  it("should call getContentsForApp and filter geoloc (strict)", async () => {
    const data = [
      {
        _id: "id1",
        titreInformatif: "TI1",
        contenu: [
          {},
          {
            children: [
              {
                type: "card",
                isFakeContent: false,
                title: "Zone d'action",
                titleIcon: "pin-outline",
                typeIcon: "eva",
                departments: ["38 - Isère"],
                free: true,
                contentTitle: "Sélectionner",
                editable: false
              }
            ]
          }
        ],
        nbVues: 2,
        needs: [],
        mainSponsor: { picture: { secure_url: "url" } },

        theme: { _id: "theme1" },
        secondaryThemes: [],
        typeContenu: "dispositif"
      },

      {
        _id: "id3",
        titreInformatif: "TI3",
        contenu: [
          {},
          {
            children: [
              {
                type: "card",
                isFakeContent: false,
                title: "Zone d'action",
                titleIcon: "pin-outline",
                typeIcon: "eva",
                departments: ["All"],
                free: true,
                contentTitle: "Sélectionner",
                editable: false
              }
            ]
          }
        ],
        nbVues: 2,
        needs: [],
        mainSponsor: { picture: { secure_url: "url" } },

        theme: { _id: "theme1" },
        secondaryThemes: [],
        typeContenu: "dispositif"
      },
      {
        _id: "id4",
        titreInformatif: "TI4",
        contenu: [
          {},
          {
            children: [
              {
                type: "card",
                isFakeContent: false,
                title: "Zone d'action",
                titleIcon: "pin-outline",
                typeIcon: "eva",
                departments: ["75 - Paris"],
                free: true,
                contentTitle: "Sélectionner",
                editable: false
              }
            ]
          }
        ],
        nbVues: 2,
        nbVuesMobile: 5,
        needs: [],
        mainSponsor: { picture: { secure_url: "url" } },

        theme: { _id: "theme1" },
        secondaryThemes: [],
        typeContenu: "dispositif"
      }
    ];
    getActiveContentsFiltered.mockResolvedValueOnce(data);
    const req = {
      fromSite: true,
      query: {
        locale: "fr",
        department: "Paris",
        strictLocation: "1"
      }
    };
    const query = {
      status: "Actif"
    };
    await getContentsForApp(req, res);
    expect(getActiveContentsFiltered).toHaveBeenCalledWith(neededFields, query);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      text: "Succès",
      dataFr: [
        {
          _id: "id4",
          avancement: undefined,
          titreInformatif: "TI4",
          titreMarque: "",
          nbVues: 2,
          nbVuesMobile: 5,
          needs: [],
          sponsorUrl: "url",
          theme: { _id: "theme1" },
          secondaryThemes: [],
          typeContenu: "dispositif"
        }
      ]
    });
  });
});
