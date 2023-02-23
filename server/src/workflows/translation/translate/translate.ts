import { Translate } from "@google-cloud/translate";
import { isEmpty } from "lodash";
import { Languages } from "../../../typegoose";

const projectId = "traduction-1551702821050";

const translator = new Translate({
  projectId: projectId,
  credentials: {
    // @ts-ignore
    type: "service_account",
    project_id: "traduction-1551702821050",
    private_key_id: process.env.GCLOUD_PRIVATE_KEY_ID,
    private_key: process.env.GCLOUD_PKEY.replace(/\\n/g, "\n"),
    client_email: process.env.GCLOUD_CLIENT_EMAIL,
    client_id: process.env.GCLOUD_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.GCLOUD_CLIENT_X509,
  },
});

const translate = (q: string, language: Languages): Promise<string> =>
  translator.translate(q, language.toString()).then((results) => {
    if (isEmpty(results)) {
      throw new Error("Failed to translate");
    }
    return results[0];
  });

export default translate;
