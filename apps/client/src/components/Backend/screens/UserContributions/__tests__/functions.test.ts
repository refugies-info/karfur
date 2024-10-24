import {
  ContentType,
  DispositifStatus,
  GetStructureDispositifResponse,
  GetUserContributionsResponse,
} from "@refugies-info/api-types";
import { formatContributions } from "../functions";
import { FormattedUserContribution } from "../types";

const userContrib1: GetUserContributionsResponse = {
  _id: "id1",
  typeContenu: ContentType.DISPOSITIF,
  titreInformatif: "ti1",
  titreMarque: "tm1",
  mainSponsor: { _id: "s1", nom: "" },
  nbMercis: 0,
  nbVues: 0,
  status: DispositifStatus.DRAFT,
  hasDraftVersion: false,
};

const formattedUserContrib1: FormattedUserContribution = {
  _id: "id1",
  typeContenu: ContentType.DISPOSITIF,
  titreInformatif: "ti1",
  titreMarque: "tm1",
  mainSponsor: { _id: "s1", nom: "" },
  nbMercis: 0,
  nbVues: 0,
  status: DispositifStatus.DRAFT,
  responsabilite: "Moi",
  isAuthorizedToDelete: true,
  hasDraftVersion: false,
};

const userContrib2: GetUserContributionsResponse = {
  _id: "id2",
  typeContenu: ContentType.DEMARCHE,
  titreInformatif: "ti2",
  titreMarque: "marque",
  mainSponsor: { _id: "s1", nom: "sponsor2" },
  nbMercis: 0,
  nbVues: 0,
  status: DispositifStatus.ACTIVE,
  hasDraftVersion: false,
};
const formattedUserContrib2: FormattedUserContribution = {
  _id: "id2",
  typeContenu: ContentType.DEMARCHE,
  titreInformatif: "ti2",
  mainSponsor: { _id: "s1", nom: "sponsor2" },
  nbMercis: 0,
  nbVues: 0,
  status: DispositifStatus.ACTIVE,
  responsabilite: "sponsor2",
  isAuthorizedToDelete: true,
  titreMarque: "marque",
  hasDraftVersion: false,
};

const userContrib3: GetUserContributionsResponse = {
  _id: "id3",
  typeContenu: ContentType.DISPOSITIF,
  titreInformatif: "ti3",
  titreMarque: "tm3",
  mainSponsor: { _id: "s1", nom: "structure" },
  nbMercis: 0,
  nbVues: 0,
  status: DispositifStatus.WAITING_ADMIN,
  hasDraftVersion: false,
};
const formattedUserContrib3: FormattedUserContribution = {
  _id: "id3",
  typeContenu: ContentType.DISPOSITIF,
  titreInformatif: "ti3",
  titreMarque: "tm3",
  mainSponsor: { _id: "s1", nom: "structure" },
  nbMercis: 0,
  nbVues: 0,
  status: DispositifStatus.WAITING_ADMIN,
  responsabilite: "structure",
  isAuthorizedToDelete: true,
  hasDraftVersion: false,
};

const userContrib4: GetUserContributionsResponse = {
  _id: "id4",
  typeContenu: ContentType.DISPOSITIF,
  titreInformatif: "ti4",
  titreMarque: "tm4",
  mainSponsor: { _id: "s1", nom: "structure" },
  nbMercis: 0,
  nbVues: 0,
  status: DispositifStatus.KO_STRUCTURE,
  hasDraftVersion: false,
};
const formattedUserContrib4: FormattedUserContribution = {
  _id: "id4",
  typeContenu: ContentType.DISPOSITIF,
  titreInformatif: "ti4",
  titreMarque: "tm4",
  mainSponsor: { _id: "s1", nom: "structure" },
  nbMercis: 0,
  nbVues: 0,
  status: DispositifStatus.KO_STRUCTURE,
  responsabilite: "Moi",
  isAuthorizedToDelete: true,
  hasDraftVersion: false,
};

const userContrib5: GetUserContributionsResponse = {
  _id: "id5",
  typeContenu: ContentType.DISPOSITIF,
  titreInformatif: "ti5",
  titreMarque: "tm5",
  mainSponsor: { _id: "s1", nom: "structure" },
  nbMercis: 0,
  nbVues: 0,
  status: DispositifStatus.WAITING_STRUCTURE,
  hasDraftVersion: false,
};
const formattedUserContrib5: FormattedUserContribution = {
  _id: "id5",
  typeContenu: ContentType.DISPOSITIF,
  titreInformatif: "ti5",
  titreMarque: "tm5",
  mainSponsor: { _id: "s1", nom: "structure" },
  nbMercis: 0,
  nbVues: 0,
  status: DispositifStatus.WAITING_STRUCTURE,
  responsabilite: "Moi",
  isAuthorizedToDelete: true,
  hasDraftVersion: false,
};

const userContrib6: GetUserContributionsResponse = {
  _id: "id6",
  typeContenu: ContentType.DISPOSITIF,
  titreInformatif: "ti6",
  titreMarque: "tm6",
  mainSponsor: { _id: "s2", nom: "structure" },
  nbMercis: 0,
  nbVues: 0,
  status: DispositifStatus.ACTIVE,
  hasDraftVersion: false,
};
const formattedUserContrib6: FormattedUserContribution = {
  _id: "id6",
  typeContenu: ContentType.DISPOSITIF,
  titreInformatif: "ti6",
  titreMarque: "tm6",
  mainSponsor: { _id: "s2", nom: "structure" },
  nbMercis: 0,
  nbVues: 0,
  status: DispositifStatus.ACTIVE,
  responsabilite: "structure",
  isAuthorizedToDelete: false,
  hasDraftVersion: false,
};

const userContribs = [userContrib1, userContrib2, userContrib3, userContrib4, userContrib5, userContrib6];

const userStructureContrib1: GetStructureDispositifResponse = {
  _id: "id1s",
  typeContenu: ContentType.DISPOSITIF,
  titreInformatif: "ti1s",
  titreMarque: "tm1s",
  sponsor: {
    nom: "",
    picture: { imgId: "", public_id: "", secure_url: "" },
  },
  nbMercis: 0,
  nbVues: 0,
  status: DispositifStatus.DRAFT,
  needs: [],
  metadatas: {},
  nbMots: 0,
  nbVuesMobile: 0,
  availableLanguages: [],
  hasDraftVersion: false,
  themeSortIndex: 0,
};

const formattedUserStructureContrib1: FormattedUserContribution = {
  _id: "id1s",
  typeContenu: ContentType.DISPOSITIF,
  titreInformatif: "ti1s",
  titreMarque: "tm1s",
  mainSponsor: { _id: "s1", nom: "structure" },
  nbMercis: 0,
  nbVues: 0,
  status: DispositifStatus.DRAFT,
  responsabilite: "structure",
  isAuthorizedToDelete: true,
  hasDraftVersion: false,
};

const userStructureContrib2: GetStructureDispositifResponse = {
  _id: "id2s",
  typeContenu: ContentType.DISPOSITIF,
  titreInformatif: "ti2s",
  titreMarque: "tm2s",
  sponsor: { nom: "", picture: { imgId: "", public_id: "", secure_url: "" } },
  nbMercis: 0,
  nbVues: 0,
  status: DispositifStatus.DELETED,
  needs: [],
  metadatas: {},
  nbMots: 0,
  nbVuesMobile: 0,
  availableLanguages: [],
  hasDraftVersion: false,
  themeSortIndex: 0,
};

const userStructureContrib3: GetStructureDispositifResponse = {
  _id: "id3s",
  typeContenu: ContentType.DISPOSITIF,
  titreInformatif: "ti3s",
  titreMarque: "tm3s",
  sponsor: { nom: "", picture: { imgId: "", public_id: "", secure_url: "" } },
  nbMercis: 0,
  nbVues: 0,
  status: DispositifStatus.KO_STRUCTURE,
  needs: [],
  metadatas: {},
  nbMots: 0,
  nbVuesMobile: 0,
  availableLanguages: [],
  hasDraftVersion: false,
  themeSortIndex: 0,
};

const userStructureContrib4: GetStructureDispositifResponse = {
  _id: "id4s",
  typeContenu: ContentType.DISPOSITIF,
  titreInformatif: "ti4s",
  titreMarque: "tm4s",
  sponsor: { nom: "structure", picture: { imgId: "", public_id: "", secure_url: "" } },
  nbMercis: 0,
  nbVues: 0,
  status: DispositifStatus.ACTIVE,
  needs: [],
  metadatas: {},
  nbMots: 0,
  nbVuesMobile: 0,
  availableLanguages: [],
  hasDraftVersion: false,
  themeSortIndex: 0,
};

const formattedUserStructureContrib4: FormattedUserContribution = {
  _id: "id4s",
  typeContenu: ContentType.DISPOSITIF,
  titreInformatif: "ti4s",
  titreMarque: "tm4s",
  mainSponsor: { _id: "s1", nom: "structure" },
  nbMercis: 0,
  nbVues: 0,
  status: DispositifStatus.ACTIVE,
  responsabilite: "structure",
  isAuthorizedToDelete: true,
  hasDraftVersion: false,
};

const userStructureContrib5: GetStructureDispositifResponse = {
  _id: "id3",
  typeContenu: ContentType.DISPOSITIF,
  titreInformatif: "ti4s",
  titreMarque: "tm4s",
  sponsor: { nom: "structure", picture: { imgId: "", public_id: "", secure_url: "" } },
  nbMercis: 0,
  nbVues: 0,
  status: DispositifStatus.WAITING_ADMIN,
  needs: [],
  metadatas: {},
  nbMots: 0,
  nbVuesMobile: 0,
  availableLanguages: [],
  hasDraftVersion: false,
  themeSortIndex: 0,
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
      {
        _id: "s1",
        createur: "",
        adminPercentageProgressionStatus: "",
        dispositifsAssocies: [],
        nom: "structure",
        membres: [
          {
            userId: "userId",
            username: "user",
            picture: { secure_url: "", imgId: "", public_id: "" },
            last_connected: new Date(),
            added_at: new Date(),
          },
        ],
      },
      "userId",
      false,
    );
    expect(result).toEqual([
      formattedUserContrib1,
      formattedUserContrib2,
      formattedUserContrib3,
      formattedUserContrib4,
      formattedUserContrib5,
      { ...formattedUserStructureContrib1, isAuthorizedToDelete: true },
      { ...formattedUserStructureContrib4, isAuthorizedToDelete: true },
    ]);
  });

  it("should format correctly contrib if user is administrateur", () => {
    const result = formatContributions(
      userContribs,
      userStructureContrib,
      {
        _id: "s1",
        createur: "",
        adminPercentageProgressionStatus: "",
        dispositifsAssocies: [],
        nom: "structure",
        membres: [
          {
            userId: "userId",
            username: "user",
            picture: { secure_url: "", imgId: "", public_id: "" },
            last_connected: new Date(),
            added_at: new Date(),
          },
        ],
      },
      "userId",
      true,
    );
    expect(result).toEqual([
      formattedUserContrib1,
      formattedUserContrib2,
      formattedUserContrib3,
      formattedUserContrib4,
      formattedUserContrib5,
      { ...formattedUserContrib6, isAuthorizedToDelete: true },
      { ...formattedUserStructureContrib1, isAuthorizedToDelete: true },
      { ...formattedUserStructureContrib4, isAuthorizedToDelete: true },
    ]);
  });
});
