import { v2 } from "@google-cloud/translate";
import { Languages } from "@refugies-info/api-types";
import { isEmpty } from "lodash";

const { Translate } = v2;

const translator = new Translate({
  projectId: process.env.GCLOUD_PROJECT_ID,
  credentials: {
    type: "service_account",
    project_id: process.env.GCLOUD_PROJECT_ID,
    private_key_id: process.env.GCLOUD_PRIVATE_KEY_ID,
    private_key: process.env.GCLOUD_PKEY?.replace(/\\n/g, "\n"),
    client_email: process.env.GCLOUD_CLIENT_EMAIL,
    client_id: process.env.GCLOUD_CLIENT_ID,
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
