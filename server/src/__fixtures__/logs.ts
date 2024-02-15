import { GetLogResponse } from "@refugies-info/api-types";

export const logs: GetLogResponse[] = [
  {
    _id: "1",
    objectId: "obj_1",
    model_object: "Dispositif",
    text: "Contenu modifié",
    author: { username: "user_1", email: "user_1@example.com" },
    created_at: new Date("2023-04-05T10:24:00")
  },
  {
    _id: "2",
    objectId: "obj_1",
    model_object: "Dispositif",
    text: "Thèmes modifiés",
    author: { username: "user_1", email: "user_1@example.com" },
    created_at: new Date("2023-04-05T11:24:00")
  },
  {
    _id: "3",
    objectId: "obj_1",
    model_object: "Dispositif",
    text: "Contenu modifié",
    author: { username: "user_1", email: "user_1@example.com" },
    created_at: new Date("2023-04-05T12:24:00")
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
]
