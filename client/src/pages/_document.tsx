import { Html, Head, Main, NextScript, DocumentProps } from "next/document";
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
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

augmentDocumentForDsfr(Document);
