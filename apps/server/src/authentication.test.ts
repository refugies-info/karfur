import { UserStatus } from "@refugies-info/api-types";
import { UserModel } from "@refugies-info/mongo";
import type { Request } from "express";
import jwt from "jwt-simple";
import { expressAuthentication } from "./authentication";

process.env.SECRET = "test-secret";
const USER_ID = "5f2a1b3c4d5e6f7a8b9c0d1e";
const now = () => Math.floor(Date.now() / 1000);

const mockUser = (fields: Record<string, unknown> = {}) =>
  jest.spyOn(UserModel, "findById").mockReturnValue({
    populate: jest.fn().mockResolvedValue({ _id: USER_ID, ...fields }),
  } as any);

const requestWith = (token: string) =>
  ({ headers: { "x-access-token": token } }) as unknown as Request;
const authenticate = (token: string) => expressAuthentication(requestWith(token), "jwt", []);
const sign = (payload: object, secret = process.env.SECRET) => jwt.encode(payload, secret, "HS256");

describe("expressAuthentication jwt", () => {
  afterEach(() => jest.restoreAllMocks());

  it("accepts a token issued by getToken", async () => {
    mockUser();
    const token = new UserModel({ _id: USER_ID, email: "a@b.fr" }).getToken();
    await expect(authenticate(token)).resolves.toMatchObject({ _id: USER_ID });
  });

  it.each([
    ["legacy token without exp", sign({ _id: USER_ID })],
    ["expired token", sign({ _id: USER_ID, exp: now() - 1 })],
    ["token signed with another secret", sign({ _id: USER_ID, exp: now() + 60 }, "other")],
    ["garbage", "not-a-jwt"],
  ])("rejects a %s", async (_, token) => {
    mockUser();
    await expect(authenticate(token)).rejects.toThrow("Invalid token");
  });

  it("rejects a revoked token (tokenVersion bumped)", async () => {
    mockUser({ tokenVersion: 1 });
    await expect(
      authenticate(sign({ _id: USER_ID, tokenVersion: 0, exp: now() + 60 })),
    ).rejects.toThrow("Invalid token");
  });

  it("rejects a deleted account", async () => {
    mockUser({ status: UserStatus.DELETED });
    await expect(authenticate(sign({ _id: USER_ID, exp: now() + 60 }))).rejects.toThrow(
      "Invalid token",
    );
  });

  it("treats an invalid token as anonymous when authentication is optional", async () => {
    mockUser();
    await expect(
      expressAuthentication(requestWith(sign({ _id: USER_ID })), "jwt", ["optional"]),
    ).resolves.toBeNull();
  });
});
