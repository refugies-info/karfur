import logger from "../../../logger";
import { getNbMercis, getNbVues } from "../../../modules/dispositif/dispositif.repository";
import { Res, RequestFromClient } from "../../../types/interface";
import { checkIfUserIsAdmin } from "../../../libs/checkAuthorizations";

interface Query {}

type Mercis = {mercis: number}
type Vues = {nbVues: number, nbVuesMobile: number}

export const getStatistics = async (req: RequestFromClient<Query>, res: Res) => {
  try {
    logger.info("[getStatistics]");

    // @ts-ignore : populate roles
    checkIfUserIsAdmin(req.user.roles)

    const resMercis: Mercis[] = await getNbMercis();
    const resVues: Vues[] = await getNbVues();

    return res
      .status(200)
      .json({
        text: "OK",
        data: {
          nbMercis: resMercis[0].mercis,
          nbVues: resVues[0].nbVues,
          nbVuesMobile: resVues[0].nbVuesMobile
        }
      });
  } catch (error) {
    logger.error("[getStatistics] error", { error: error.message });
    return res.status(500).json({ text: "Erreur" });
  }
};
