import { isUserAllowedToModify } from "../functions";

describe("isUserAllowedToModify", () => {
  const isMembre = { membres: [{ userId: 1, roles: ["contributeur"] }] };
  const isNotMembre = { membres: [{ userId: 2, roles: ["contributeur"] }] };
  test.each([
    {isAdmin: false,  user: {_id: 1}, selectedDispositif: {creatorId: {_id:2}, mainSponsor: isNotMembre,  status:  null}, expected: false},
    {isAdmin: true,   user: {_id: 1}, selectedDispositif: {creatorId: {_id:2}, mainSponsor: isNotMembre,  status: "Actif"}, expected: true},
    {isAdmin: false,  user: {_id: 1}, selectedDispositif: {creatorId: {_id:1}, mainSponsor: isNotMembre,  status: "Brouillon"}, expected: true},
    {isAdmin: false,  user: {_id: 1}, selectedDispositif: {creatorId: {_id:1}, mainSponsor: isNotMembre,  status: "En attente"}, expected: true},
    {isAdmin: false,  user: {_id: 1}, selectedDispositif: {creatorId: {_id:1}, mainSponsor: isNotMembre,  status: "Rejeté structure"}, expected: true},
    {isAdmin: false,  user: {_id: 1}, selectedDispositif: {creatorId: {_id:1}, mainSponsor: isNotMembre,  status: "En attente non prioritaire"}, expected: true},
    {isAdmin: false,  user: {_id: 1}, selectedDispositif: {creatorId: {_id:1}, mainSponsor: isNotMembre,  status: "Accepté structure"}, expected: false},
    {isAdmin: false,  user: {_id: 1}, selectedDispositif: {creatorId: {_id:1}, mainSponsor: isNotMembre,  status: "En attente admin"}, expected: false},
    {isAdmin: false,  user: {_id: 1}, selectedDispositif: {creatorId: {_id:1}, mainSponsor: isNotMembre,  status: "Publié"}, expected: false},
    {isAdmin: false,  user: {_id: 1}, selectedDispositif: {creatorId: {_id:2}, mainSponsor: isNotMembre,  status: "Brouillon"}, expected: false},
    {isAdmin: false,  user: {_id: 1}, selectedDispositif: {creatorId: {_id:2}, mainSponsor: isNotMembre,  status: "En attente"}, expected: false},
    {isAdmin: false,  user: {_id: 1}, selectedDispositif: {creatorId: {_id:2}, mainSponsor: isNotMembre,  status: "Rejeté structure"}, expected: false},
    {isAdmin: false,  user: {_id: 1}, selectedDispositif: {creatorId: {_id:2}, mainSponsor: isNotMembre,  status: "En attente non prioritaire"}, expected: false},
    {isAdmin: false,  user: {_id: 1}, selectedDispositif: {creatorId: {_id:2}, mainSponsor: isMembre,     status: "Accepté structure"}, expected: true},
    {isAdmin: false,  user: {_id: 1}, selectedDispositif: {creatorId: {_id:2}, mainSponsor: isMembre,     status: "En attente admin"}, expected: true},
    {isAdmin: false,  user: {_id: 1}, selectedDispositif: {creatorId: {_id:2}, mainSponsor: isMembre,     status: "Publié"}, expected: true},
  ])(
    "should return $expectedResult ",

    ({ isAdmin, user, selectedDispositif, expected }) => {
      const result = isUserAllowedToModify(
        isAdmin,
        //@ts-ignore
        user,
        selectedDispositif
      );
      expect(result).toEqual(expected);
    }
  );
});
