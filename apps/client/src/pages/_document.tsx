import { type DocumentProps, Head, Html, Main, NextScript } from "next/document";
import SkipLinksNavigation from "~/components/UI/SkipLinksNavigation/SkipLinksNavigation";
import { ROUTE_ANNOUNCER_ID } from "~/hooks/useRouteAnnouncement";
import { caveat, dsfrDocumentApi } from "./_app";

const { getColorSchemeHtmlAttributes, augmentDocumentForDsfr } = dsfrDocumentApi;

// The <title> produced by next/head is available in props.head: copying it here
// gives the announcer paragraph its title straight from the source HTML
// (RGAA 12.8).
const getServerTitle = (props: DocumentProps): string => {
  const titleElement = props.head?.find((element) => element?.type === "title");
  const children = titleElement?.props?.children;
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.join("");
  return "";
};

export default function Document(props: DocumentProps) {
  // The auth tunnel renders neither the main navigation nor the footer (RGAA 6.1).
  const hasNavigationAndFooter = !(props.__NEXT_DATA__?.page ?? "").startsWith("/auth");
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
        {/* Route change announcement (RGAA 12.8): sr-only paragraph synced with
            the <title> and focused on every client navigation by
            useRouteAnnouncement, placed before the skip links. */}
        <p id={ROUTE_ANNOUNCER_ID} tabIndex={-1} className="sr-only">
          {getServerTitle(props)}
        </p>
        <SkipLinksNavigation hasNavigationAndFooter={hasNavigationAndFooter} />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

augmentDocumentForDsfr(Document);
