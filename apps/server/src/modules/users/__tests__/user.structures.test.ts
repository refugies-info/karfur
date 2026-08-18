import { UserModel } from "@refugies-info/mongo";

jest.mock("../../../logger");

describe("User schema structures", () => {
  it("defaults structures to an empty array on a new user", () => {
    const user = new UserModel({ email: "no-structure@refugies.info" });

    expect(user.toObject().structures).toEqual([]);
  });

  it("reads structures as an empty array on a legacy user document without the field", async () => {
    const inserted = await UserModel.collection.insertOne({
      email: "legacy@refugies.info",
      username: "legacy",
    });

    const user = await UserModel.findById(inserted.insertedId);

    expect(user?.toObject().structures).toEqual([]);
  });
});
