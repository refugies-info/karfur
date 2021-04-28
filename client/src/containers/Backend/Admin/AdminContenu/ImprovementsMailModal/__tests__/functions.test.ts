// @ts-nocheck
import { getUsersToSendMail } from "../functions";

describe("getUsersToSendMail", () => {
  it("should return correct data when not en attente, en attente admin and accepté", () => {
    const res = getUsersToSendMail(
      "Brouillon",
      "creatorId",
      null,
      [{ _id: "userId1" }],
      [{ _id: "structure1" }]
    );

    expect(res).toEqual([]);
  });

  it("should return correct data when en attente and no creatorId", () => {
    const res = getUsersToSendMail(
      "En attente",
      "",
      null,
      [{ _id: "userId1" }],
      [{ _id: "structure1" }]
    );

    expect(res).toEqual([]);
  });

  it("should return correct data when en attente and creatorId", () => {
    const res = getUsersToSendMail(
      "En attente",
      { _id: "creatorId" },
      null,
      [{ _id: "userId1" }],
      [{ _id: "structure1" }]
    );

    expect(res).toEqual([{ _id: "creatorId" }]);
  });

  it("should return correct data when en attente admin and no sponsor", () => {
    const res = getUsersToSendMail(
      "En attente admin",
      { _id: "creatorId" },
      null,
      [{ _id: "userId1" }],
      [{ _id: "structure1" }]
    );
    expect(res).toEqual([]);
  });

  it("should return correct data when en attente admin and sponsor not in structures", () => {
    const res = getUsersToSendMail(
      "En attente admin",
      { _id: "creatorId" },
      { _id: "mainSponsorId" },
      [{ _id: "userId1" }],
      [{ _id: "structure1" }]
    );
    expect(res).toEqual([]);
  });

  it("should return correct data when en attente admin and sponsor in structures but no members", () => {
    const res = getUsersToSendMail(
      "En attente admin",
      { _id: "creatorId" },
      { _id: "mainSponsorId" },
      [{ _id: "userId1" }],
      [{ _id: "structure1" }, { _id: "mainSponsorId" }]
    );
    expect(res).toEqual([]);
  });

  it("should return correct data when en attente admin and sponsor in structures but members not in user", () => {
    const res = getUsersToSendMail(
      "En attente admin",
      { _id: "creatorId" },
      { _id: "mainSponsorId" },
      [{ _id: "userId1" }],
      [
        { _id: "structure1" },
        {
          _id: "mainSponsorId",
          membres: [{ userId: "userId2" }, { userId: "userId3" }],
        },
      ]
    );
    expect(res).toEqual([]);
  });

  it("should return correct data when en attente admin and sponsor in structures and members in user", () => {
    const res = getUsersToSendMail(
      "En attente admin",
      { _id: "creatorId" },
      { _id: "mainSponsorId" },
      [
        {
          _id: "userId1",
          username: "user1",
          email: "",
          picture: "picture",
          test: "test",
        },
        {
          _id: "userId2",
          username: "user2",
          email: "email2",
          picture: "picture2",
        },
      ],
      [
        { _id: "structure1" },
        {
          _id: "mainSponsorId",
          membres: [{ userId: "userId2" }, { userId: "userId1" }],
        },
      ]
    );
    expect(res).toEqual([
      {
        _id: "userId2",
        username: "user2",
        email: "email2",
        picture: "picture2",
      },
      { _id: "userId1", username: "user1", email: "", picture: "picture" },
    ]);
  });
});
