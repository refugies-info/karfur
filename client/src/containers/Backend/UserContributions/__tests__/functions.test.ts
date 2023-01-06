// @ts-nocheck
import { formatContributions } from "../functions";

const userContrib1 = {
  _id: "id1",
  typeContenu: "dispositif",
  titreInformatif: "ti1",
  titreMarque: "tm1",
  mainSponsor: null,
  nbMercis: 0,
  nbVues: 0,
  status: "Brouillon",
};

const formattedUserContrib1 = {
  _id: "id1",
  typeContenu: "dispositif",
  titreInformatif: "ti1",
  titreMarque: "tm1",
  mainSponsor: null,
  nbMercis: 0,
  nbVues: 0,
  status: "Brouillon",
  responsabilite: "Moi",
  isAuthorizedToDelete: true,
};

const userContrib2 = {
  _id: "id2",
  typeContenu: "demarche",
  titreInformatif: "ti2",
  mainSponsor: "sponsor2",
  nbMercis: 0,
  nbVues: 0,
  status: "Actif",
};
const formattedUserContrib2 = {
  _id: "id2",
  typeContenu: "demarche",
  titreInformatif: "ti2",
  mainSponsor: "sponsor2",
  nbMercis: 0,
  nbVues: 0,
  status: "Actif",
  responsabilite: "sponsor2",
  isAuthorizedToDelete: true,
};

const userContrib3 = {
  _id: "id3",
  typeContenu: "dispositif",
  titreInformatif: "ti3",
  titreMarque: "tm3",
  mainSponsor: "structure",
  nbMercis: 0,
  nbVues: 0,
  status: "En attente",
};
const formattedUserContrib3 = {
  _id: "id3",
  typeContenu: "dispositif",
  titreInformatif: "ti3",
  titreMarque: "tm3",
  mainSponsor: "structure",
  nbMercis: 0,
  nbVues: 0,
  status: "En attente",
  responsabilite: "Moi",
  isAuthorizedToDelete: true,
};

const userContrib4 = {
  _id: "id4",
  typeContenu: "dispositif",
  titreInformatif: "ti4",
  titreMarque: "tm4",
  mainSponsor: "structure",
  nbMercis: 0,
  nbVues: 0,
  status: "Rejeté structure",
};
const formattedUserContrib4 = {
  _id: "id4",
  typeContenu: "dispositif",
  titreInformatif: "ti4",
  titreMarque: "tm4",
  mainSponsor: "structure",
  nbMercis: 0,
  nbVues: 0,
  status: "Rejeté structure",
  responsabilite: "Moi",
  isAuthorizedToDelete: true,
};

const userContrib5 = {
  _id: "id5",
  typeContenu: "dispositif",
  titreInformatif: "ti5",
  titreMarque: "tm5",
  mainSponsor: "structure",
  nbMercis: 0,
  nbVues: 0,
  status: "En attente non prioritaire",
};
const formattedUserContrib5 = {
  _id: "id5",
  typeContenu: "dispositif",
  titreInformatif: "ti5",
  titreMarque: "tm5",
  mainSponsor: "structure",
  nbMercis: 0,
  nbVues: 0,
  status: "En attente non prioritaire",
  responsabilite: "Moi",
  isAuthorizedToDelete: true,
};

const userContribs = [
  userContrib1,
  userContrib2,
  userContrib3,
  userContrib4,
  userContrib5,
];

const userStructureContrib1 = {
  _id: "id1s",
  typeContenu: "dispositif",
  titreInformatif: "ti1s",
  titreMarque: "tm1s",
  mainSponsor: null,
  nbMercis: 0,
  nbVues: 0,
  status: "Brouillon",
};

const userStructureContrib2 = {
  _id: "id2s",
  typeContenu: "dispositif",
  titreInformatif: "ti2s",
  titreMarque: "tm2s",
  mainSponsor: null,
  nbMercis: 0,
  nbVues: 0,
  status: "Supprimé",
};

const userStructureContrib3 = {
  _id: "id3s",
  typeContenu: "dispositif",
  titreInformatif: "ti3s",
  titreMarque: "tm3s",
  mainSponsor: null,
  nbMercis: 0,
  nbVues: 0,
  status: "Rejeté structure",
};

const userStructureContrib4 = {
  _id: "id4s",
  typeContenu: "dispositif",
  titreInformatif: "ti4s",
  titreMarque: "tm4s",
  mainSponsor: "structure",
  nbMercis: 0,
  nbVues: 0,
  status: "Actif",
};

const formattedUserStructureContrib4 = {
  _id: "id4s",
  typeContenu: "dispositif",
  titreInformatif: "ti4s",
  titreMarque: "tm4s",
  nbMercis: 0,
  nbVues: 0,
  status: "Actif",
  responsabilite: "structure",
  isAuthorizedToDelete: true,
};

const userStructureContrib5 = {
  _id: "id3",
  typeContenu: "dispositif",
  titreInformatif: "ti4s",
  titreMarque: "tm4s",
  mainSponsor: "structure",
  nbMercis: 0,
  nbVues: 0,
  status: "En attente",
};

const userStructureContrib = [
  userStructureContrib1,
  userStructureContrib2,
  userStructureContrib3,
  userStructureContrib4,
  userStructureContrib5,
];
describe("formatContributions", () => {
  it("should format correctly contrib if user is member", () => {
    const result = formatContributions(
      userContribs,
      userStructureContrib,
      { nom: "structure", membres: [{ _id: "userId", roles: ["contributeur"] }] },
      "userId"
    );
    expect(result).toEqual([
      formattedUserContrib1,
      formattedUserContrib2,
      formattedUserContrib3,
      formattedUserContrib4,
      formattedUserContrib5,
      { ...formattedUserStructureContrib4, isAuthorizedToDelete: false },
    ]);
  });

  it("should format correctly contrib if user is administrateur", () => {
    const result = formatContributions(
      userContribs,
      userStructureContrib,
      { nom: "structure", membres: [{ _id: "userId", roles: ["contributeur", "administrateur"] }] },
      "userId"
    );
    expect(result).toEqual([
      formattedUserContrib1,
      formattedUserContrib2,
      formattedUserContrib3,
      formattedUserContrib4,
      formattedUserContrib5,
      { ...formattedUserStructureContrib4, isAuthorizedToDelete: true },
    ]);
  });
});
