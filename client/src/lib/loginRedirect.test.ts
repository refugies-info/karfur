import { GetUserInfoResponse, RoleName } from "@refugies-info/api-types";
import { getLoginRedirect, setLoginRedirect } from "./loginRedirect";

const roleAdmin: GetUserInfoResponse["roles"] = [{
  _id: "id",
  nom: RoleName.ADMIN,
  nomPublic: ""
}];
const roleExpert: GetUserInfoResponse["roles"] = [{
  _id: "id",
  nom: RoleName.EXPERT_TRAD,
  nomPublic: ""
}];
const roleTrad: GetUserInfoResponse["roles"] = [{
  _id: "id",
  nom: RoleName.TRAD,
  nomPublic: ""
}];
const roleAidant: GetUserInfoResponse["roles"] = [{
  _id: "id",
  nom: RoleName.CAREGIVER,
  nomPublic: ""
}];
const roleContrib: GetUserInfoResponse["roles"] = [{
  _id: "id",
  nom: RoleName.CONTRIB,
  nomPublic: ""
}];
const roleUser: GetUserInfoResponse["roles"] = [{
  _id: "id",
  nom: RoleName.USER,
  nomPublic: ""
}];

describe("setLoginRedirect", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    //@ts-ignore
    delete window.location;
  });

  it("should set path in storage", () => {
    //@ts-ignore
    window.location = new URL("https://www.example.com/recherche?theme=mobilite")

    const setItemSpy: jest.SpyInstance = jest.spyOn(Object.getPrototypeOf(sessionStorage), "setItem");
    setLoginRedirect(null);
    expect(setItemSpy).toHaveBeenCalledWith("login_redirect", "/recherche?theme=mobilite")
  });
  it("should set path in storage and add param", () => {
    //@ts-ignore
    window.location = new URL("https://www.example.com/recherche")

    const setItemSpy: jest.SpyInstance = jest.spyOn(Object.getPrototypeOf(sessionStorage), "setItem");
    setLoginRedirect({ addFavorite: "id" });
    expect(setItemSpy).toHaveBeenCalledWith("login_redirect", "/recherche?addFavorite=id")
  });
  it("should set path in storage and add param to list", () => {
    //@ts-ignore
    window.location = new URL("https://www.example.com/recherche?theme=mobilite")

    const setItemSpy: jest.SpyInstance = jest.spyOn(Object.getPrototypeOf(sessionStorage), "setItem");
    setLoginRedirect({ addFavorite: "id" });
    expect(setItemSpy).toHaveBeenCalledWith("login_redirect", "/recherche?theme=mobilite&addFavorite=id")
  });
  it("should set path in storage and add anchor", () => {
    //@ts-ignore
    window.location = new URL("https://www.example.com/recherche")

    const setItemSpy: jest.SpyInstance = jest.spyOn(Object.getPrototypeOf(sessionStorage), "setItem");
    setLoginRedirect("#anchor");
    expect(setItemSpy).toHaveBeenCalledWith("login_redirect", "/recherche#anchor")
  });
  it("should set path in storage and add anchor after params", () => {
    //@ts-ignore
    window.location = new URL("https://www.example.com/recherche?theme=mobilite")

    const setItemSpy: jest.SpyInstance = jest.spyOn(Object.getPrototypeOf(sessionStorage), "setItem");
    setLoginRedirect("#anchor");
    expect(setItemSpy).toHaveBeenCalledWith("login_redirect", "/recherche?theme=mobilite#anchor")
  });
});

describe("getLoginRedirect", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it("should return stored page", () => {
    window.sessionStorage.setItem("login_redirect", "/recherche?addFavorite=id");

    const getItemSpy: jest.SpyInstance = jest.spyOn(Object.getPrototypeOf(sessionStorage), "getItem");
    const removeItemSpy: jest.SpyInstance = jest.spyOn(Object.getPrototypeOf(sessionStorage), "removeItem");
    const res = getLoginRedirect(undefined);
    expect(getItemSpy).toHaveBeenCalledWith("login_redirect")
    expect(removeItemSpy).toHaveBeenCalledWith("login_redirect")
    expect(removeItemSpy).toHaveBeenCalledWith("register_infos")
    expect(res).toEqual("/recherche?addFavorite=id")
  });

  it("should return home if role undefined", () => {
    const getItemSpy: jest.SpyInstance = jest.spyOn(Object.getPrototypeOf(sessionStorage), "getItem");
    const removeItemSpy: jest.SpyInstance = jest.spyOn(Object.getPrototypeOf(sessionStorage), "removeItem");
    const res = getLoginRedirect(undefined);
    expect(getItemSpy).toHaveBeenCalledWith("login_redirect")
    expect(removeItemSpy).toHaveBeenCalledWith("login_redirect")
    expect(removeItemSpy).toHaveBeenCalledWith("register_infos")
    expect(res).toEqual("/")
  });
  it("should return home if no role in array", () => {
    const getItemSpy: jest.SpyInstance = jest.spyOn(Object.getPrototypeOf(sessionStorage), "getItem");
    const removeItemSpy: jest.SpyInstance = jest.spyOn(Object.getPrototypeOf(sessionStorage), "removeItem");
    const res = getLoginRedirect([]);
    expect(getItemSpy).toHaveBeenCalledWith("login_redirect")
    expect(removeItemSpy).toHaveBeenCalledWith("login_redirect")
    expect(removeItemSpy).toHaveBeenCalledWith("register_infos")
    expect(res).toEqual("/")
  });

  //todo
  it("should return backend if role admin", () => {
    const getItemSpy: jest.SpyInstance = jest.spyOn(Object.getPrototypeOf(sessionStorage), "getItem");
    const removeItemSpy: jest.SpyInstance = jest.spyOn(Object.getPrototypeOf(sessionStorage), "removeItem");
    const res = getLoginRedirect([...roleAdmin, ...roleUser]);
    expect(getItemSpy).toHaveBeenCalledWith("login_redirect")
    expect(removeItemSpy).toHaveBeenCalledWith("login_redirect")
    expect(removeItemSpy).toHaveBeenCalledWith("register_infos")
    expect(res).toEqual("/backend/admin")
  });
  it("should return recherche if role caregiver", () => {
    const getItemSpy: jest.SpyInstance = jest.spyOn(Object.getPrototypeOf(sessionStorage), "getItem");
    const removeItemSpy: jest.SpyInstance = jest.spyOn(Object.getPrototypeOf(sessionStorage), "removeItem");
    const res = getLoginRedirect([...roleAidant, ...roleUser]);
    expect(getItemSpy).toHaveBeenCalledWith("login_redirect")
    expect(removeItemSpy).toHaveBeenCalledWith("login_redirect")
    expect(removeItemSpy).toHaveBeenCalledWith("register_infos")
    expect(res).toEqual("/recherche")
  });
  it("should return traduire if role expert trad", () => {
    const getItemSpy: jest.SpyInstance = jest.spyOn(Object.getPrototypeOf(sessionStorage), "getItem");
    const removeItemSpy: jest.SpyInstance = jest.spyOn(Object.getPrototypeOf(sessionStorage), "removeItem");
    const res = getLoginRedirect([...roleExpert, ...roleUser]);
    expect(getItemSpy).toHaveBeenCalledWith("login_redirect")
    expect(removeItemSpy).toHaveBeenCalledWith("login_redirect")
    expect(removeItemSpy).toHaveBeenCalledWith("register_infos")
    expect(res).toEqual("/traduire")
  });
  it("should return traduire if role trad", () => {
    const getItemSpy: jest.SpyInstance = jest.spyOn(Object.getPrototypeOf(sessionStorage), "getItem");
    const removeItemSpy: jest.SpyInstance = jest.spyOn(Object.getPrototypeOf(sessionStorage), "removeItem");
    const res = getLoginRedirect([...roleTrad, ...roleUser]);
    expect(getItemSpy).toHaveBeenCalledWith("login_redirect")
    expect(removeItemSpy).toHaveBeenCalledWith("login_redirect")
    expect(removeItemSpy).toHaveBeenCalledWith("register_infos")
    expect(res).toEqual("/traduire")
  });
  it("should return publier if role contrib", () => {
    const getItemSpy: jest.SpyInstance = jest.spyOn(Object.getPrototypeOf(sessionStorage), "getItem");
    const removeItemSpy: jest.SpyInstance = jest.spyOn(Object.getPrototypeOf(sessionStorage), "removeItem");
    const res = getLoginRedirect([...roleContrib, ...roleUser]);
    expect(getItemSpy).toHaveBeenCalledWith("login_redirect")
    expect(removeItemSpy).toHaveBeenCalledWith("login_redirect")
    expect(removeItemSpy).toHaveBeenCalledWith("register_infos")
    expect(res).toEqual("/publier")
  });
  it("should return recherche if role user", () => {
    const getItemSpy: jest.SpyInstance = jest.spyOn(Object.getPrototypeOf(sessionStorage), "getItem");
    const removeItemSpy: jest.SpyInstance = jest.spyOn(Object.getPrototypeOf(sessionStorage), "removeItem");
    const res = getLoginRedirect([...roleUser]);
    expect(getItemSpy).toHaveBeenCalledWith("login_redirect")
    expect(removeItemSpy).toHaveBeenCalledWith("login_redirect")
    expect(removeItemSpy).toHaveBeenCalledWith("register_infos")
    expect(res).toEqual("/recherche")
  });
});
