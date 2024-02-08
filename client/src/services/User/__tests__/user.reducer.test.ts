import { userReducer, initialUserState } from "../user.reducer";
import { setUserActionCreator } from "../user.actions";
import { testUser, testUserWithRoles } from "../../../__fixtures__/user";
import { RoleName } from "@refugies-info/api-types";

describe("[Reducer] user", () => {
  const expectedResult = {
    user: testUser,
    userId: testUser._id,
    admin: false,
    traducteur: false,
    expertTrad: false,
    contributeur: false,
    caregiver: false,
    hasStructure: false,
    rolesInStructure: []
  };
  it("should set user in store when action SET_USER is received with payload user without role", () => {
    expect(userReducer(initialUserState, setUserActionCreator(testUser))).toEqual(expectedResult);
  });

  it("should set user in store when action SET_USER is received with payload null user", () => {
    expect(userReducer(initialUserState, setUserActionCreator(null))).toEqual({
      user: null,
      userId: null,
      admin: false,
      traducteur: false,
      expertTrad: false,
      contributeur: false,
      caregiver: false,
      hasStructure: false,
      rolesInStructure: []
    });
  });

  it("should set user in store when action SET_USER is received with payload user with all roles", () => {
    expect(userReducer(initialUserState, setUserActionCreator(testUserWithRoles))).toEqual({
      user: testUserWithRoles,
      userId: testUserWithRoles._id,
      admin: true,
      traducteur: true,
      expertTrad: true,
      contributeur: true,
      caregiver: false,
      hasStructure: true,
      rolesInStructure: []
    });
  })

  it("should set user in store when action SET_USER is received with payload new user ", () => {
    const newUser = {
      ...testUserWithRoles,
      _id: "55153a8014829a865bbf700d"
    };
    expect(userReducer(initialUserState, setUserActionCreator(newUser))).toEqual({
      userId: newUser._id,
      admin: true,
      traducteur: true,
      expertTrad: true,
      contributeur: true,
      caregiver: false,
      hasStructure: true,
      rolesInStructure: [],
      user: newUser
    });
  });

  it("should set user in store when action SET_USER is received with payload new user ", () => {
    const newUser = {
      ...testUser,
      _id: "55153a8014829a865bbf700d",
      roles: [
        {
          nom: RoleName.STRUCTURE,
          _id: "testObjectId",
          nomPublic: "hasStructure"
        }
      ]
    };
    expect(userReducer(initialUserState, setUserActionCreator(newUser))).toEqual({
      userId: newUser._id,
      admin: false,
      traducteur: false,
      expertTrad: false,
      contributeur: false,
      caregiver: false,
      hasStructure: false,
      rolesInStructure: [],
      user: newUser
    });
  });

  it("should set user in store when action SET_USER is received with payload new user ", () => {
    const newUser = {
      ...testUser,
      _id: "55153a8014829a865bbf700d",
      roles: [],
      structures: ["id1"]
    };
    expect(
      // @ts-ignore
      userReducer(initialUserState, setUserActionCreator(newUser))
    ).toEqual({
      userId: newUser._id,
      admin: false,
      traducteur: false,
      expertTrad: false,
      contributeur: false,
      caregiver: false,
      hasStructure: true,
      rolesInStructure: [],
      user: newUser
    });
  });
});
