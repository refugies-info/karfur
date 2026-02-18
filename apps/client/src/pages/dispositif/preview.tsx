import type { GetDispositifResponse } from "@refugies-info/api-types";
import { ContentType, DispositifStatus } from "@refugies-info/api-types";
// ... imports ...
import crypto from "crypto";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { END } from "redux-saga";
import Dispositif from "~/components/Content/Dispositif";
import { wrapper } from "~/services/configureStore";
import { toggleLangueActionCreator } from "~/services/Langue/langue.actions";
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

  let payload;
  let bodySecret: string | undefined;

  try {
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    }
    const bodyContent = Buffer.concat(chunks).toString("utf-8");

    try {
      // Try parsing as raw JSON
      const jsonBody = JSON.parse(bodyContent);
      payload = jsonBody;
      if (jsonBody["webhook-secret"]) {
        bodySecret = jsonBody["webhook-secret"];
      }
    } catch (e) {
      try {
        // Try parsing as Form Data
        const params = new URLSearchParams(bodyContent);
        const jsonParam = params.get("json");
        const secretParam = params.get("webhook-secret");

        if (jsonParam) {
          payload = JSON.parse(jsonParam);
        } else {
          throw new Error("No 'json' parameter found in form data");
        }

        if (secretParam) {
          bodySecret = secretParam;
        }
      } catch (formError) {
        console.error("[Preview] Failed to parse body as JSON or form-encoded 'json':", e);
        throw new Error("Invalid structure: Expected JSON body or form-data with 'json' key");
      }
    }
  } catch (error) {
    console.error("[Preview] Error reading/parsing body:", error);
    return { notFound: true };
  }

  let secret = req.headers["webhook-secret"];
  const expectedSecret = process.env.WEBHOOK_SECRET;

  // Priority: Header > Separate Body Param > Payload Field
  if (!secret && bodySecret) {
    secret = bodySecret;
  }
  if (!secret && payload && payload["webhook-secret"]) {
    secret = payload["webhook-secret"];
  }

  if (!secret || !expectedSecret || typeof secret !== "string") {
    console.log("[Preview] Unauthorized: Missing or invalid secret");
    return {
      notFound: true,
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
    const { dispositif } = payload;

    if (!dispositif) {
      console.error("[Preview] Missing dispositif in payload");
      throw new Error("Missing dispositif data");
    }

    // La locale vient de l'URL (Next.js i18n routing)
    const previewLocale = locale || "fr";

    // Vérifier si la traduction demandée existe
    const hasTranslation =
      previewLocale !== "fr" && !!dispositif.translations?.[previewLocale]?.content;

    // Construire availableLanguages pour useContentLocale
    const availableLanguages = hasTranslation ? ["fr", previewLocale] : ["fr"];

    // Récupérer le contenu traduit ou fallback FR
    const translationContent = dispositif.translations?.[previewLocale]?.content;
    const frenchContent = dispositif.translations?.fr?.content;

    // Construire le dispositif preview avec support des traductions
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
      availableLanguages,
      creatorId: { _id: "preview-creator", username: "Preview User" },
      // Titres: utiliser traduction si disponible, sinon fallback
      titreInformatif:
        translationContent?.titreInformatif ||
        frenchContent?.titreInformatif ||
        dispositif.titreInformatif,
      titreMarque:
        translationContent?.titreMarque || frenchContent?.titreMarque || dispositif.titreMarque,
      abstract: translationContent?.abstract || frenchContent?.abstract || dispositif.abstract,
      // Pour RCO: stocker le markdown traduit
      markdown:
        hasTranslation && translationContent?.markdown
          ? translationContent.markdown
          : frenchContent?.markdown,
      // Inclure toutes les traductions pour que Section.tsx fonctionne
      translations: {
        ...dispositif.translations,
        fr: {
          content: frenchContent || {},
          created_at: new Date().toISOString() as unknown as Date,
        },
      },
    } as unknown as GetDispositifResponse;

    store.dispatch(setSelectedDispositifActionCreator(previewDispositif));
    store.dispatch(toggleLangueActionCreator(previewLocale));

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
      ...(await serverSideTranslations(locale || "fr", ["common"])),
    },
  };
});

export default PreviewPage;
