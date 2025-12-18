import { addLog } from "~/modules/logs/logs.service";
import type { DispositifId, UserId } from "~/typegoose";

export interface LogOptions {
  message: string;
  sections: string[];
  userEmails: string[];
}

export const log = async (dispositifId: DispositifId, authorId: UserId, options?: LogOptions) => {
  const { message, sections, userEmails } = options;

  const text = `Envoyé à : ${userEmails.join(", ")}<br/>
    <br/>
    ${sections.length} section(s) à revoir : <br/>
    <ul>${sections.map((s) => `<li>${s}</li>`).join("")}</ul>
    Message personnalisé : ${message}<br/>`;

  await addLog(dispositifId, "Dispositif", text, {
    link: {
      id: dispositifId,
      model_link: "Dispositif",
      next: "ModalImprovements",
    },
    author: authorId,
  });
};
