import { CreateDispositifRequest } from "@refugies-info/api-types";
import { DispositifId, StructureId, UserId } from "../../typegoose";
import { addLog } from "../logs/logs.service";

export const log = async (structureId: StructureId, authorId: UserId) => {
  await addLog(structureId, "Structure", "La structure est créée", { author: authorId });
};

export const logContact = async (dispositifId: DispositifId, authorId: UserId, contact: CreateDispositifRequest["contact"]) => {
  await addLog(
    dispositifId,
    "Dispositif",
    `Coordonnées ajoutées<br/>
    ${contact.isMe ? "Coordonnées directes de l'utilisateur" : "Coordonnées d'un tiers"}<br/>
    Membre de la structure : ${contact.isMember ? "Oui" : "Non"}<br/>
    ${contact.name}<br/>
    ${contact.email}<br/>
    ${contact.phone}<br/>
    ${contact.comments}
    `,
    { author: authorId }
  );
};
