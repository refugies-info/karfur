import { ObjectId } from "mongoose";
import { addLog } from "../../../modules/logs/logs.service";

export interface LogOptions {
  message: string;
  sections: string[];
  users: {
    username: string;
    _id: ObjectId;
    email: string;
  }[];
}

export const log = async (
  dispositifId: ObjectId,
  authorId: ObjectId,
  options?: LogOptions
) => {
  const { message, sections, users } = options;

  const recipients = users.map((user) => { return user.username; });

  const text = `Envoyé à : ${recipients.join(", ")}<br/>
    <br/>
    ${sections.length} section(s) à revoir : <br/>
    <ul>${sections.map(s => `<li>${s}</li>`).join("")}</ul>
    Message personnalisé : ${message}<br/>`;

  await addLog(
    dispositifId,
    "Dispositif",
    text,
    {
      link: {
        id: dispositifId,
        model_link: "Dispositif",
        next: "ModalImprovements"
      },
      author: authorId
    }
  );
}
