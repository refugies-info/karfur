// @ts-nocheck
import { filterData } from "../functions";
const data1 = {
  tradStatus: "À traduire",
  typeContenu: "dispositif",
  _id: "id1",
  titreInformatif: "titreInformatif1",
  titreMarque: "titreMarque1",
  nbMots: 1,
};

const data2 = {
  tradStatus: "À traduire",
  typeContenu: "demarche",
  _id: "id2",
  titreInformatif: "titreInformatif2",
  nbMots: 2,
};
const data3 = {
  tradStatus: "À revoir",
  typeContenu: "dispositif",
  _id: "id3",
  titreInformatif: "titreInformatif3",
  titreMarque: "titreMarque3",
  nbMots: 3,
};

const data4 = {
  tradStatus: "À revoir",
  typeContenu: "demarche",
  _id: "id4",
  titreInformatif: "titreInformatif4",
  nbMots: 4,
};

const data8 = {
  tradStatus: "En attente",
  typeContenu: "dispositif",
  _id: "id8",
  titreInformatif: "titreInformatif8",
  titreMarque: "titreMarqué8",
  nbMots: 8,
};

const data5 = {
  tradStatus: "En attente",
  typeContenu: "demarche",
  _id: "id5",
  titreInformatif: "titreInformatif5",
  nbMots: 5,
};

const data6 = {
  tradStatus: "Validée",
  typeContenu: "dispositif",
  _id: "id6",
  titreInformatif: "titreInformatif6",
  titreMarque: "titreMarqué6",
  nbMots: 6,
};

const data7 = {
  tradStatus: "Validée",
  typeContenu: "demarche",
  _id: "id7",
  titreInformatif: "titreInformatif7",
  nbMots: 7,
};

const data = [data1, data2, data3, data4, data5, data6, data7, data8];
describe("filter data", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return correct data ", () => {
    const result = filterData(data, "all", true, "all", "");
    expect(result).toEqual({
      dataToDisplay: data,
      nbARevoir: 2,
      nbATraduire: 2,
      nbAValider: 2,
      nbPubliees: 2,
      nbDispositifs: 4,
      nbDemarches: 4,
    });
  });

  it("should return correct data ", () => {
    const result = filterData(data, "all", false, "all", "");
    expect(result).toEqual({
      dataToDisplay: [data1, data2, data6, data7],
      nbARevoir: 0,
      nbATraduire: 2,
      nbAValider: 0,
      nbPubliees: 2,
      nbDispositifs: 2,
      nbDemarches: 2,
    });
  });

  it("should return correct data ", () => {
    const result = filterData(data, "À revoir", true, "all", "");
    expect(result).toEqual({
      dataToDisplay: [data3, data4],
      nbARevoir: 2,
      nbATraduire: 2,
      nbAValider: 2,
      nbPubliees: 2,
      nbDispositifs: 1,
      nbDemarches: 1,
    });
  });

  it("should return correct data ", () => {
    const result = filterData(data, "Validée", false, "dispositif", "");
    expect(result).toEqual({
      dataToDisplay: [data6],
      nbARevoir: 0,
      nbATraduire: 2,
      nbAValider: 0,
      nbPubliees: 2,
      nbDispositifs: 1,
      nbDemarches: 1,
    });
  });

  it("should return correct data ", () => {
    const result = filterData(data, "all", false, "dispositif", "tif6");
    expect(result).toEqual({
      dataToDisplay: [data6],
      nbARevoir: 0,
      nbATraduire: 0,
      nbAValider: 0,
      nbPubliees: 1,
      nbDispositifs: 1,
      nbDemarches: 0,
    });
  });

  it("should return correct data ", () => {
    const result = filterData(data, "all", true, "dispositif", "Marqué");
    expect(result).toEqual({
      dataToDisplay: [data1, data3, data6, data8],
      nbARevoir: 1,
      nbATraduire: 1,
      nbAValider: 1,
      nbPubliees: 1,
      nbDispositifs: 4,
      nbDemarches: 0,
    });
  });
});
