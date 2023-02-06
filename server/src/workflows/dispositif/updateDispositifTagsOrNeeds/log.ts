import { DispositifId, UserId } from "src/typegoose";
import { addLog } from "../../../modules/logs/logs.service";

export const log = async (dispositifId: DispositifId, themes: boolean, authorId: UserId) => {
  await addLog(dispositifId, "Dispositif", themes ? "Thèmes modifiés" : "Besoins modifiés", {
    link: {
      id: dispositifId,
      model_link: "Dispositif",
      next: "ModalNeeds"
    },
    author: authorId
  });
};
