import type { IRequest } from "~/types/interface";
import { UserController } from "../userController";

jest.mock("../../logger");
// login.ts instantiates an msal ConfidentialClientApplication at module load,
// which throws without the Microsoft credentials.
jest.mock("~/workflows/users/login", () => ({ login: jest.fn() }));

const buildRequest = (user: Record<string, unknown>): IRequest =>
  ({
    user: {
      ...user,
      toObject: () => user,
    },
  }) as unknown as IRequest;

describe("UserController.getUserInfo", () => {
  it("returns the structures of the user", async () => {
    const controller = new UserController();

    const res = await controller.getUserInfo(
      buildRequest({
        _id: "userObjectId",
        email: "with-structure@refugies.info",
        structures: ["structureObjectId"],
        password: "hashed",
      }),
    );

    expect(res.data.structures).toEqual(["structureObjectId"]);
    expect(res.data.sso).toEqual(false);
  });

  it("returns an empty structures array when the user document has no structures field", async () => {
    const controller = new UserController();

    const res = await controller.getUserInfo(
      buildRequest({
        _id: "userObjectId",
        email: "no-structure@refugies.info",
      }),
    );

    expect(res.data.structures).toEqual([]);
  });
});
