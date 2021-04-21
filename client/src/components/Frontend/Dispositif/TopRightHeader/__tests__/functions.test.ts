import { isUserAllowedToModify } from "../functions";

describe("isUserAllowedToModify", () => {
  test.each`
    isAdmin  | userIsSponsor | isAuthor | status                          | expectedResult
    ${false} | ${false}      | ${false} | ${null}                         | ${false}
    ${true}  | ${false}      | ${false} | ${"Actif"}                      | ${true}
    ${false} | ${false}      | ${true}  | ${"Brouillon"}                  | ${true}
    ${false} | ${false}      | ${true}  | ${"En attente"}                 | ${true}
    ${false} | ${false}      | ${true}  | ${"Rejeté structure"}           | ${true}
    ${false} | ${false}      | ${true}  | ${"En attente non prioritaire"} | ${true}
    ${false} | ${false}      | ${true}  | ${"Accepté structure"}          | ${false}
    ${false} | ${false}      | ${true}  | ${"En attente admin"}           | ${false}
    ${false} | ${false}      | ${true}  | ${"Publié"}                     | ${false}
    ${false} | ${false}      | ${false} | ${"Brouillon"}                  | ${false}
    ${false} | ${false}      | ${false} | ${"En attente"}                 | ${false}
    ${false} | ${false}      | ${false} | ${"Rejeté structure"}           | ${false}
    ${false} | ${false}      | ${false} | ${"En attente non prioritaire"} | ${false}
    ${false} | ${true}       | ${false} | ${"Accepté structure"}          | ${true}
    ${false} | ${true}       | ${false} | ${"En attente admin"}           | ${true}
    ${false} | ${true}       | ${false} | ${"Publié"}                     | ${true}
  `(
    "should return $expectedResult ",

    ({ isAdmin, userIsSponsor, isAuthor, status, expectedResult }) => {
      const result = isUserAllowedToModify(
        isAdmin,
        userIsSponsor,
        isAuthor,
        status
      );
      expect(result).toEqual(expectedResult);
    }
  );
});
