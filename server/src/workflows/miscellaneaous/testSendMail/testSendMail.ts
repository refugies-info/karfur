/* NOT USED
import { RequestFromClient, Res } from "../../../types/interface";
import logger from "../../../logger";

export const testSendMail = (req: RequestFromClient<{}>, res: Res) => {
  try {
    logger.info("[testSendMail] received");
    // sendPublishedFicheMail();
    // sendReviewFicheMail();
    return res.status(200).json({ text: "OK" });
  } catch (error) {
    logger.error("[testSendMail] error", { error: error.message });
    return res.status(500).json({ text: "K0" });
  }
};
*/
