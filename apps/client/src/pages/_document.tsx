import { DocumentProps, Head, Html, Main, NextScript } from "next/document";
import SkipLinksNavigation from "~/components/UI/SkipLinksNavigation/SkipLinksNavigation";
import { caveat, dsfrDocumentApi } from "./_app";

const { getColorSchemeHtmlAttributes, augmentDocumentForDsfr } = dsfrDocumentApi;

export default function Document(props: DocumentProps) {
  return (
    <Html {...getColorSchemeHtmlAttributes(props)} className={caveat.variable}>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        {process.env.NEXT_PUBLIC_REACT_APP_ENV !== "production" && <meta name="robots" content="noindex, nofollow" />}
      </Head>
      <body>
        <SkipLinksNavigation />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

augmentDocumentForDsfr(Document);
