import { addLog } from "~/modules/logs/logs.service";
import { DispositifId, UserId } from "~/typegoose";

export const log = async (dispositifId: DispositifId, themes: boolean, authorId: UserId) => {
  await addLog(dispositifId, "Dispositif", themes ? "Thèmes modifiés" : "Besoins modifiés", {
    link: {
      id: dispositifId,
      model_link: "Dispositif",
      next: "ModalNeeds",
    },
    author: authorId,
  });
};
