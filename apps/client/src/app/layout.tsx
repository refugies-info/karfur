import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import React from "react";
import StoreProvider from "~/app/storeProvider";
import Footer from "~/components/Layout/Footer";
import Navbar from "~/components/Navigation/Navbar";

import "scss/index.css";
import "scss/index.scss";

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <StoreProvider>
          <NextIntlClientProvider messages={messages}>
            <Navbar />

            {children}
            <Footer />
          </NextIntlClientProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
