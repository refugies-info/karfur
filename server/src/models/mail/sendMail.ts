import logger from "../../logger";
import { Res, RequestFromClient } from "../../types/interface";

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

interface User {
  email: string;
  pseudo: string | null;
}
export const sendMail = async (req: RequestFromClient<User>, res: Res) => {
  try {
    console.log("send mail log", req);
    logger.info("send mail", {
      req,
    });
    const { email, pseudo } = req.body.query;
    logger.info("[sendMail] send mail received", {
      email,
    });
    const msg = {
      to: email,
      from: { email: "agathe@refugies.info", name: "Agathe de Réfugiés.info" },
      cc: "agkieny+1@gmail.com",
      reply_to: "agathe.kieny@lamednum.coop",
      templateId: "d-8d24f015c9f24e388f2735d37222db22",
      dynamicTemplateData: {
        first_name: pseudo || "test",
      },
    };
    sgMail.send(msg);

    return res.status(200).json({ text: "OK" });
  } catch (error) {
    logger.error("[sendMail] error", { error });
    return res.status(500).json({ text: "K0" });
  }
};

export const sendMailTest = async (_: any, res: Res) => {
  try {
    const email = "agkieny@gmail.com";
    logger.info("[sendMail] send mail received", {
      email,
    });
    const msg = {
      to: email,
      from: { email: "agathe@refugies.info", name: "Agathe de Réfugiés.info" },
      cc: "agkieny+1@gmail.com",
      reply_to: "agathe.kieny@lamednum.coop",
      templateId: "d-8d24f015c9f24e388f2735d37222db22",
      dynamicTemplateData: {
        first_name: "test",
      },
    };
    sgMail.send(msg);

    return res.status(200).json({ text: "OK" });
  } catch (error) {
    logger.error("[sendMail] error", { error });
    return res.status(500).json({ text: "K0" });
  }
};
