import { Toto } from "@refugies-info/ui";
import { DocumentProps, Head, Html, Main, NextScript } from "next/document";
import { dsfrDocumentApi } from "./_app";
const { getColorSchemeHtmlAttributes, augmentDocumentForDsfr } = dsfrDocumentApi;

export default function Document(props: DocumentProps) {
  return (
    <Html {...getColorSchemeHtmlAttributes(props)}>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        {process.env.NEXT_PUBLIC_REACT_APP_ENV !== "production" && <meta name="robots" content="noindex, nofollow" />}
        <script defer data-domain="refugies.info" src="https://plausible.io/js/script.tagged-events.js"></script>
      </Head>
      <body>
        <button className="p-20 bg-blue-france-75 hover:bg-blue-france-hover active:bg-blue-france-active">
          <Toto>huhu</Toto>
        </button>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

augmentDocumentForDsfr(Document);
