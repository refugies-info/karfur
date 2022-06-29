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

  const text = `Envoyé à : ${recipients.join(", ")}
    \n3 sections à revoir : ${sections.join(", ")}
    \nMessage personnalisé : ${message}
    \npar ${authorId}
  `;

  await addLog(
    dispositifId,
    "Dispositif",
    text,
    // "Demande de changements envoyée",
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
