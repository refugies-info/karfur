import type { GetDispositifResponse } from "@refugies-info/api-types";
import { ContentType, DispositifStatus } from "@refugies-info/api-types";
// ... imports ...
import crypto from "crypto";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { END } from "redux-saga";
import Dispositif from "~/components/Content/Dispositif";
import { getLanguageFromLocale } from "~/lib/getLanguageFromLocale";
import { wrapper } from "~/services/configureStore";
import { fetchNeedsActionCreator } from "~/services/Needs/needs.actions";
import { setSelectedDispositifActionCreator } from "~/services/SelectedDispositif/selectedDispositif.actions";
import { fetchThemesActionCreator } from "~/services/Themes/themes.actions";
import { fetchUserActionCreator } from "~/services/User/user.actions";
import PageContext from "~/utils/pageContext";

const PreviewPage = () => {
  return (
    <PageContext.Provider value={{ mode: "view" }}>
      <Dispositif />
    </PageContext.Provider>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req, locale }) => {
  if (req.method !== "POST") {
    console.log("[Preview] Method not allowed:", req.method);
    return {
      notFound: true,
    };
  }

  // Verify Webhook Secret
  const secret = req.headers["webhook-secret"];
  const expectedSecret = process.env.WEBHOOK_SECRET;

  if (!secret || !expectedSecret || typeof secret !== "string") {
    console.log("[Preview] Unauthorized: Missing or invalid secret");
    return {
      notFound: true, // Hide the existence of the page or return 401 via props if preferred
    };
  }

  const secretBuffer = Buffer.from(secret);
  const expectedBuffer = Buffer.from(expectedSecret);

  if (
    secretBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(secretBuffer, expectedBuffer)
  ) {
    console.log("[Preview] Unauthorized: Invalid secret");
    return {
      notFound: true,
    };
  }

  try {
    // Parse the request body
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    }
    const bodyContent = Buffer.concat(chunks).toString("utf-8");

    let payload;
    try {
      payload = JSON.parse(bodyContent);
    } catch (e) {
      // Attempt to parse as form-urlencoded if raw JSON failed
      try {
        // We can use URLSearchParams to parse form data
        const params = new URLSearchParams(bodyContent);
        const jsonParam = params.get("json");
        if (jsonParam) {
          payload = JSON.parse(jsonParam);
        } else {
          throw new Error("No 'json' parameter found in form data");
        }
      } catch (formError) {
        console.error("[Preview] Failed to parse body as JSON or form-encoded 'json':", e);
        throw new Error("Invalid structure: Expected JSON body or form-data with 'json' key");
      }
    }

    const { dispositif } = payload;

    if (!dispositif) {
      console.error("[Preview] Missing dispositif in payload");
      throw new Error("Missing dispositif data");
    }

    // Construct the preview dispositif object
    // Use a temporary ID and default fields similar to how we create it
    // Construct the preview dispositif object
    // We cast to GetDispositifResponse and provide defaults for required fields
    const previewDispositif: GetDispositifResponse = {
      ...dispositif,
      _id: "preview-id",
      status: DispositifStatus.DRAFT,
      typeContenu: dispositif.typeContenu || ContentType.DISPOSITIF,
      created_at: new Date().toISOString() as unknown as Date,
      lastModificationDate: new Date().toISOString() as unknown as Date,
      date: new Date().toISOString() as unknown as Date,
      needs: dispositif.needs || [],
      secondaryThemes: dispositif.secondaryThemes || [],
      metadatas: dispositif.metadatas || {},
      avis: [],
      availableLanguages: [],
      creatorId: { _id: "preview-creator", username: "Preview User" },
      // Ensure we don't overwrite if not present, but mock if needed
      translations: {
        ...dispositif.translations,
        fr: {
          content: dispositif.translations?.fr?.content || {},
          created_at: new Date().toISOString(),
        },
      },
    } as unknown as GetDispositifResponse;

    // Populate the Redux store with the preview data
    store.dispatch(setSelectedDispositifActionCreator(previewDispositif));

    // Fetch necessary supporting data
    store.dispatch(fetchThemesActionCreator());
    store.dispatch(fetchNeedsActionCreator());
    if (req.headers.cookie && req.headers.cookie.includes("authorization")) {
      // simplified cookie check or just pass token if extracted
      // We can access req.cookies directly if we use the proper type or middleware,
      // but here we just rely on what is available.
      // wrapper's getServerSideProps usually has req.cookies populated by next.js
      const token = (req as any).cookies?.authorization;
      if (token) {
        store.dispatch(fetchUserActionCreator({ token }));
      }
    }

    // Wait for sagas to complete
    store.dispatch(END);
    await store.sagaTask?.toPromise();
  } catch (error) {
    console.error("[Preview] Error handling preview request:", error);
    // We throw to see the 500 error stack trace in server logs,
    // OR we could return props with an error.
    // Returning 404 might hide the real issue.
    // Let's rethrow to generate a 500 so we can see it in logs if the user checks.
    throw error;
  }

  return {
    props: {
      ...(await serverSideTranslations(getLanguageFromLocale(locale), ["common"])),
    },
  };
});

export default PreviewPage;
