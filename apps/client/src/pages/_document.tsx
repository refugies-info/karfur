import { type DocumentProps, Head, Html, Main, NextScript } from "next/document";
import SkipLinksNavigation from "~/components/UI/SkipLinksNavigation/SkipLinksNavigation";
import { ROUTE_ANNOUNCER_ID } from "~/hooks/useRouteAnnouncement";
import { caveat, dsfrDocumentApi } from "./_app";

const { getColorSchemeHtmlAttributes, augmentDocumentForDsfr } = dsfrDocumentApi;

// Le <title> produit par next/head est disponible dans props.head : on le
// recopie pour que le paragraphe d'annonce porte le titre dès le HTML source,
// comme le demande l'audit Ideance (RGAA 12.8).
const getServerTitle = (props: DocumentProps): string => {
  const titleElement = props.head?.find((element) => element?.type === "title");
  const children = titleElement?.props?.children;
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.join("");
  return "";
};

export default function Document(props: DocumentProps) {
  return (
    <Html {...getColorSchemeHtmlAttributes(props)} className={caveat.variable}>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        {process.env.NEXT_PUBLIC_REACT_APP_ENV !== "production" && (
          <meta name="robots" content="noindex, nofollow" />
        )}
      </Head>
      <body>
        {/* Annonce de changement de page (RGAA 12.8) : paragraphe sr-only
            synchronisé avec le <title> et focalisé à chaque navigation client
            par useRouteAnnouncement, posé avant les liens d'évitement. */}
        <p id={ROUTE_ANNOUNCER_ID} tabIndex={-1} className="sr-only">
          {getServerTitle(props)}
        </p>
        <SkipLinksNavigation />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

augmentDocumentForDsfr(Document);
