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
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    }
    const bodyContent = Buffer.concat(chunks).toString("utf-8");

    let payload;
    try {
      payload = JSON.parse(bodyContent);
    } catch (e) {
      try {
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
          created_at: new Date().toISOString() as unknown as Date,
        },
      },
    } as unknown as GetDispositifResponse;

    store.dispatch(setSelectedDispositifActionCreator(previewDispositif));

    store.dispatch(fetchThemesActionCreator());
    store.dispatch(fetchNeedsActionCreator());
    if (req.headers.cookie && req.headers.cookie.includes("authorization")) {
      const token = (req as any).cookies?.authorization;
      if (token) {
        store.dispatch(fetchUserActionCreator({ token }));
      }
    }

    store.dispatch(END);
    await store.sagaTask?.toPromise();
  } catch (error) {
    console.error("[Preview] Error handling preview request:", error);
    throw error;
  }

  return {
    props: {
      ...(await serverSideTranslations(getLanguageFromLocale(locale), ["common"])),
    },
  };
});

export default PreviewPage;
