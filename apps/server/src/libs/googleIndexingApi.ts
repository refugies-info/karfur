import { Auth, google } from "googleapis";
import logger from "~/logger";

/**
 * Get auth client for Google Indexing API
 * Uses same credentials as Google Cloud Translation service
 */
const getGoogleAuth = () => {
  const credentials = {
    type: "service_account",
    project_id: process.env.GCLOUD_PROJECT_ID,
    private_key_id: process.env.GCLOUD_PRIVATE_KEY_ID,
    private_key: process.env.GCLOUD_PKEY?.replace(/\\n/g, "\n"),
    client_email: process.env.GCLOUD_CLIENT_EMAIL,
    client_id: process.env.GCLOUD_CLIENT_ID,
  };

  return new Auth.GoogleAuth({
    credentials: credentials as Record<string, string | undefined>,
    scopes: ["https://www.googleapis.com/auth/indexing"],
  });
};

/**
 * Notify Google to remove a URL from the index
 * @param url The URL to remove from Google index
 */
export const notifyGoogleUrlDeleted = async (url: string): Promise<boolean> => {
  try {
    // Skip if credentials not configured
    if (
      !process.env.GCLOUD_CLIENT_EMAIL ||
      !process.env.GCLOUD_PROJECT_ID ||
      !process.env.GCLOUD_PRIVATE_KEY_ID ||
      !process.env.GCLOUD_PKEY
    ) {
      logger.warn(
        "[notifyGoogleUrlDeleted] Google Cloud credentials not fully configured, skipping",
        { url },
      );
      return false;
    }

    const auth = getGoogleAuth();

    const indexing = google.indexing({
      version: "v3",
      auth,
    });

    const response = await indexing.urlNotifications.publish({
      requestBody: {
        url,
        type: "URL_DELETED",
      },
    });

    if (response.status === 200) {
      logger.info("[notifyGoogleUrlDeleted] Successfully notified Google", { url });
      return true;
    }

    logger.error("[notifyGoogleUrlDeleted] Unexpected response status", {
      url,
      status: response.status,
    });
    return false;
  } catch (error) {
    logger.error("[notifyGoogleUrlDeleted] Error notifying Google", {
      url,
      error: error instanceof Error ? error.message : String(error),
      ...(process.env.NODE_ENV !== "production" &&
        process.env.NODE_ENV !== "staging" &&
        error instanceof Error && { stack: error.stack }),
    });
    return false;
  }
};

/**
 * Notify Google to remove multiple URLs from the index
 * @param urls Array of URLs to remove from Google index
 */
export const notifyGoogleUrlsDeleted = async (urls: string[]): Promise<number> => {
  let successCount = 0;

  for (const url of urls) {
    const success = await notifyGoogleUrlDeleted(url);
    if (success) successCount++;
    // Add small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  logger.info("[notifyGoogleUrlsDeleted] Batch notification complete", {
    total: urls.length,
    successful: successCount,
  });

  return successCount;
};
