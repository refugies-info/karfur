import {
  DispositifStatus,
  type GetDispositifResponse,
  type GetUserInfoResponse,
  RoleName,
} from "@refugies-info/api-types";
import { testUser, testUserWithRoles } from "~/__fixtures__/user";
import { canEdit } from "./canEdit";

const publishedDispositif = {
  _id: "dispositifObjectId",
  status: DispositifStatus.ACTIVE,
  mainSponsor: { _id: "structureObjectId" },
  creatorId: { _id: "otherUserObjectId" },
} as unknown as GetDispositifResponse;

describe("canEdit", () => {
  it("should return false if no user", () => {
    expect(canEdit(publishedDispositif, null)).toEqual(false);
  });

  it("should return false if no dispositif", () => {
    expect(canEdit(null, testUser)).toEqual(false);
  });

  it("should return true for an admin", () => {
    expect(canEdit(publishedDispositif, testUserWithRoles)).toEqual(true);
  });

  it("should return true if user belongs to the mainSponsor structure", () => {
    const user: GetUserInfoResponse = {
      ...testUser,
      structures: ["structureObjectId"],
    };
    expect(canEdit(publishedDispositif, user)).toEqual(true);
  });

  it("should return false if user belongs to another structure", () => {
    const user: GetUserInfoResponse = {
      ...testUser,
      structures: ["anotherStructureObjectId"],
    };
    expect(canEdit(publishedDispositif, user)).toEqual(false);
  });

  it("should return true if author edits a never published draft", () => {
    const draft = {
      ...publishedDispositif,
      status: DispositifStatus.DRAFT,
      creatorId: { _id: testUser._id },
      mainSponsor: undefined,
    } as unknown as GetDispositifResponse;
    expect(canEdit(draft, testUser)).toEqual(true);
  });

  it("should return false without crashing if user has no structures property", () => {
    const { structures: _structures, ...userWithoutStructures } = testUser;
    const user = userWithoutStructures as GetUserInfoResponse;

    expect(canEdit(publishedDispositif, user)).toEqual(false);
  });

  it("should return false without crashing if a non-admin role user has no structures property", () => {
    const { structures: _structures, ...userWithoutStructures } = testUser;
    const user = {
      ...userWithoutStructures,
      roles: [{ nom: RoleName.CONTRIB, _id: "roleObjectId", nomPublique: "Contrib" }],
    } as GetUserInfoResponse;

    expect(canEdit(publishedDispositif, user)).toEqual(false);
  });
});
