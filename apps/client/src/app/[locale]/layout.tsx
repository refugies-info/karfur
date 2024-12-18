import { DsfrHead } from "@codegouvfr/react-dsfr/next-appdir/DsfrHead";
import { DsfrProvider } from "@codegouvfr/react-dsfr/next-appdir/DsfrProvider";
import { getHtmlAttributes } from "@codegouvfr/react-dsfr/next-appdir/getHtmlAttributes";
import Link from "next/link";
import React from "react";
import StartDsfr from "~/app/StartDsfr";
import StoreProvider from "~/app/storeProvider";
import Footer from "~/components/Layout/Footer";
import styles from "~/components/Layout/Layout.module.scss";
import Navbar from "~/components/Navigation/Navbar";
import { locales } from "~/lib/i18nConfig";

import "scss/index.css";
import "scss/index.scss";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function RootLayout({
  children,
  params: { locale },
}: Readonly<{ children: React.ReactNode; params: { locale: string } }>) {
  return (
    <html {...getHtmlAttributes({ defaultColorScheme: "light", lang: locale })}>
      <head>
        <StartDsfr />
        <DsfrHead Link={Link} />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        {process.env.NEXT_PUBLIC_REACT_APP_ENV !== "production" && <meta name="robots" content="noindex, nofollow" />}
        <script defer data-domain="refugies.info" src="https://plausible.io/js/script.tagged-events.js"></script>
      </head>

      <body dir={/* isRTL */ false ? "rtl" : "ltr"}>
        <StoreProvider>
          <DsfrProvider lang={locale}>
            <Navbar />
            <div id="contenu" className={styles.main}>
              <main className={styles.content}>{children}</main>
            </div>
            <Footer />
          </DsfrProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
