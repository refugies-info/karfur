import { RoleName } from "@refugies-info/api-types";
import { testUserWithRoles } from "__fixtures__/user";
import { hasRole } from "./hasRole";

describe("hasRole", () => {
  it("should return true if has role", () => {
    const res = hasRole(testUserWithRoles, RoleName.TRAD);
    expect(res).toEqual(true);
  });
  it("should return false if not has role", () => {
    const res = hasRole(testUserWithRoles, RoleName.CAREGIVER);
    expect(res).toEqual(false);
  });
  it("should return false if no user", () => {
    const res = hasRole(null, RoleName.CAREGIVER);
    expect(res).toEqual(false);
  });
});
