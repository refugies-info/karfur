// @ts-nocheck
import { formatDispositifsByCreator } from "../dispositif.adapter";

describe("formatDispositifsByCreator", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should format data", () => {
    const creator1 = {
      _id: "creatorId1",
      email: "email1",
      username: "username1",
    };

    const creator2 = {
      _id: "creatorId2",
      email: "email2",
      username: "username2",
    };

    const creator3 = {
      _id: "creatorId3",
      email: "email3",
      username: "username3",
    };

    const dispositifs = [
      {
        _id: "dispoId1",
        titreInformatif: "t1",
        creatorId: creator1,
      },
      {
        _id: "dispoId2",
        titreInformatif: "t2",
        creatorId: creator2,
      },
      {
        _id: "dispoId3",
        titreInformatif: "t3",
        creatorId: creator1,
      },
      {
        _id: "dispoId4",
        titreInformatif: "t4",
        creatorId: creator2,
      },
      {
        _id: "dispoId5",
        titreInformatif: "t5",
        creatorId: creator3,
      },
    ];
    const expectedResult = [
      {
        creatorId: "creatorId1",
        username: "username1",
        email: "email1",
        dispositifs: [
          { _id: "dispoId1", titreInformatif: "t1" },
          { _id: "dispoId3", titreInformatif: "t3" },
        ],
      },
      {
        creatorId: "creatorId2",
        username: "username2",
        email: "email2",
        dispositifs: [
          { _id: "dispoId2", titreInformatif: "t2" },
          { _id: "dispoId4", titreInformatif: "t4" },
        ],
      },

      {
        creatorId: "creatorId3",
        username: "username3",
        email: "email3",
        dispositifs: [{ _id: "dispoId5", titreInformatif: "t5" }],
      },
    ];

    const res = formatDispositifsByCreator(dispositifs);

    expect(res).toEqual(expectedResult);
  });
});
