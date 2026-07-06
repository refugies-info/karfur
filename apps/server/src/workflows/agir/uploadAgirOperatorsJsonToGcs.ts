import { Auth, google } from "googleapis";
import { InternalError, ServiceUnavailableError } from "~/errors";
import logger from "~/logger";

interface UploadAgirOperatorsJsonToGcsParams {
  objectName: string;
  payload: unknown;
}

const getRequiredEnv = (
  key:
    | "AGIR_OPERATORS_GCS_BUCKET"
    | "GCLOUD_CLIENT_EMAIL"
    | "GCLOUD_PKEY"
    | "GCLOUD_PRIVATE_KEY_ID",
): string => {
  const value = process.env[key];

  if (!value) {
    throw new InternalError(`[agirOperators] Missing ${key} environment variable`);
  }

  return value;
};

const getGoogleStorageAuth = () => {
  const clientEmail = getRequiredEnv("GCLOUD_CLIENT_EMAIL");
  const privateKey = getRequiredEnv("GCLOUD_PKEY").replace(/\\n/g, "\n");

  return new Auth.GoogleAuth({
    credentials: {
      type: "service_account",
      private_key_id: getRequiredEnv("GCLOUD_PRIVATE_KEY_ID"),
      private_key: privateKey,
      client_email: clientEmail,
    },
    scopes: ["https://www.googleapis.com/auth/devstorage.read_write"],
  });
};

export const uploadAgirOperatorsJsonToGcs = async ({
  objectName,
  payload,
}: UploadAgirOperatorsJsonToGcsParams): Promise<void> => {
  const bucketName = getRequiredEnv("AGIR_OPERATORS_GCS_BUCKET");
  const auth = getGoogleStorageAuth();
  const storage = google.storage({ version: "v1", auth });
  const body = `${JSON.stringify(payload, null, 2)}\n`;

  try {
    await storage.objects.insert({
      bucket: bucketName,
      name: objectName,
      media: {
        mimeType: "application/json; charset=utf-8",
        body,
      },
      requestBody: {
        cacheControl: "no-cache",
        contentType: "application/json; charset=utf-8",
        name: objectName,
      },
    });

    logger.info("[agirOperators] JSON uploaded to GCS", {
      bucketName,
      objectName,
    });
  } catch (error) {
    logger.error("[agirOperators] GCS upload failed", {
      bucketName,
      objectName,
      error: error instanceof Error ? error.message : error,
    });

    throw new ServiceUnavailableError(
      "[agirOperators] Unable to upload AGIR operators JSON to GCS",
    );
  }
};
