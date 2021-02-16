import logger from "../logger";

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const testCron = async () => {
  try {
    logger.info("[sendMail] send mail received", {
      email: "test",
    });
    const msg = {
      to: "agkieny@gmail.com",
      from: "nour@refugies.info",
      templateId: "d-8d24f015c9f24e388f2735d37222db22",
      dynamicTemplateData: {
        first_name: "test",
      },
    };
    sgMail.send(msg);
  } catch (error) {
    logger.error("[sendMail] error", { error });
  }
};
