import { RequestFromClientWithBody, Res } from "../../../types/interface";
import logger from "../../../logger";
import { sendEnabled2FaEmailMailService } from "../../../modules/mail/mail.service";
import { getStructuresFromDB } from "../../../modules/structure/structure.repository";
import { getUserById } from "../../../modules/users/users.repository";
import { asyncForEach } from "../../../libs/asyncForEach";
import { StructureDoc } from "src/schema/schemaStructure";
import {
  checkIfUserIsAdmin,
} from "../../../libs/checkAuthorizations";

/* TODO: delete once sent */
interface Query {
}
export const sendEnabled2FaEmail = async (
  req: RequestFromClientWithBody<Query>,
  res: Res
) => {
  try {
    logger.info("[sendEnabled2FaEmail] received");
    // @ts-ignore : populate roles
    checkIfUserIsAdmin(req.user.roles)

    const structures = await getStructuresFromDB(
      { status: "Actif" },
      { nom: 1, membres: 1, status: 1 },
      false
    );

    const structureMembres: StructureDoc["membres"] = [];
    for (const structure of structures) {
      if (structure.membres) {
        structureMembres.push(...(structure.membres.map(m => ({...m, structureName: structure.nom}))));
      }
    }

    const admins = structureMembres
      .filter(m => !!m)
      .filter(m => m.roles.includes("administrateur"))
      .reduce((acc, current) => { // remove duplicates
        const x = acc.find(item => item.userId === current.userId);
        if (!x) return acc.concat([current]);
        return acc;
      }, []);

    logger.info(`[sendEnabled2FaEmail] mail sent to ${admins.length} admins`);

    await asyncForEach(admins, async (admin) => {
      const user = await getUserById(admin.userId, { username: 1, email: 1, status: 1 })
      await sendEnabled2FaEmailMailService({
        userId: user._id,
        email: user.email,
        pseudonyme: user.username,
        structurename: admin.structureName,
      });
    });

    return res.status(200).json({ text: "OK" });
  } catch (error) {
    logger.error("[sendEnabled2FaEmail] error", { error: error.message });

    switch (error.message) {
      case "NOT_AUTHORIZED":
        return res.status(400).json({ text: "Requête invalide" });
      default:
        return res.status(500).json({ text: "Erreur interne" });
    }
  }
};
