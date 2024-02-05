import { groupLogs } from "../logs.service";
import { logs } from "../../../__fixtures__/logs";

describe("groupLogs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("group logs of same day", async () => {
    const groupedLogs = groupLogs(logs);

    expect(groupedLogs).toEqual([
      {
        _id: "2",
        objectId: "obj_1",
        model_object: "Dispositif",
        text: "Thèmes modifiés",
        author: { username: "user_1", email: "user_1@example.com" },
        created_at: new Date("2023-04-05T11:24:00")
      },
      {
        _id: "4",
        objectId: "obj_1",
        model_object: "Dispositif",
        text: "Contenu modifié",
        author: { username: "user_2", email: "user_2@example.com" },
        created_at: new Date("2023-04-05T13:24:00")
      },
      {
        _id: "5",
        objectId: "obj_1",
        model_object: "Dispositif",
        text: "Contenu modifié",
        author: { username: "user_1", email: "user_1@example.com" },
        created_at: new Date("2023-04-05T14:24:00")
      },
      {
        _id: "6",
        objectId: "obj_1",
        model_object: "Dispositif",
        text: "Contenu modifié",
        author: { username: "user_1", email: "user_1@example.com" },
        created_at: new Date("2023-04-06T10:24:00")
      },
    ]);
  });
});
