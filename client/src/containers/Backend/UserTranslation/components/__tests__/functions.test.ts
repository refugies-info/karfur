// @ts-nocheck
import { sortData } from "../functions";
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

describe("sortData", () => {
  it("should sort data", () => {
    const result = sortData(data, { name: "none", sens: "up" });
    expect(result).toEqual(data);
  });

  it("should sort data", () => {
    const result = sortData([data6, data7], {
      name: "typeContenu",
      order: "typeContenu",
      sens: "up",
    });
    expect(result).toEqual([data7, data6]);
  });

  it("should sort data", () => {
    const result = sortData([data1, data4], {
      name: "typeContenu",
      order: "typeContenu",
      sens: "down",
    });
    expect(result).toEqual([data1, data4]);
  });

  it("should sort data", () => {
    const result = sortData(data, {
      name: "nbMots",
      order: "nbMots",
      sens: "up",
    });
    expect(result).toEqual([
      data1,
      data2,
      data3,
      data4,
      data5,
      data6,
      data7,
      data8,
    ]);
  });

  it("should sort data", () => {
    const result = sortData(data, {
      name: "nbMots",
      order: "nbMots",
      sens: "down",
    });
    expect(result).toEqual([
      data8,
      data7,
      data6,
      data5,
      data4,
      data3,
      data2,
      data1,
    ]);
  });
});
