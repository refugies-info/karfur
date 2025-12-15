import "css/index.css";
import "leaflet/dist/leaflet.css";
import "scss/index.scss";

import { createNextDsfrIntegrationApi } from "@codegouvfr/react-dsfr/next-pagesdir";
import { DirectionProvider } from "@radix-ui/react-direction";
import { ToastProvider, ToastViewport } from "@radix-ui/react-toast";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { Caveat } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/router";
import Script from "next/script";
import { appWithTranslation } from "next-i18next";
import { type ReactElement, type ReactNode, useCallback, useEffect, useState } from "react";
import { Provider } from "react-redux";
import { useEffectOnce } from "react-use";
import toastStyles from "scss/components/toast.module.scss";
import { ScreenReaderAnnouncerProvider } from "~/components/Accessibility/ScreenReaderAnnouncer";
import Layout from "~/components/Layout/Layout";
import { useRTL, useScrollToAnchor } from "~/hooks";
import { useConsent } from "~/hooks/useConsentContext";
import { isContentPage } from "~/lib/isContentPage";
import { Event, initGA } from "~/lib/tracking";
import { wrapper } from "~/services/configureStore";
import type { PageOptions } from "~/types/interface";

const { withDsfr, dsfrDocumentApi } = createNextDsfrIntegrationApi({
  defaultColorScheme: "light",
  Link,
});

export { dsfrDocumentApi };

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
  options: PageOptions;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export const caveat = Caveat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-caveat",
  weight: "700",
});

const App = ({ Component, ...pageProps }: AppPropsWithLayout) => {
  const [history, setHistory] = useState<string[]>([]);
  const { store, props } = wrapper.useWrappedStore(pageProps);
  const defaultLayout = (page: ReactElement) => <Layout history={history}>{page}</Layout>;
  const getLayout = Component.getLayout ?? defaultLayout;
  const router = useRouter();

  useScrollToAnchor();

  const options: PageOptions = Component.options || {
    cookiesModule: true,
    supportModule: true,
  };

  const handleRouteChange = useCallback((url: string, { shallow }: { shallow: boolean }) => {
    setHistory((prevHistory) => {
      // add to history if url is new
      if (prevHistory[0] !== url) return [url, ...prevHistory];
      return prevHistory;
    });
  }, []);

  // ANALYTICS
  useEffect(() => {
    handleRouteChange(router.asPath, { shallow: false }); // initial route

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
    // Bug router: https://github.com/vercel/next.js/issues/18127#issuecomment-950907739
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // load analytics without cookies if user has not clicked on cookie banner yet
  const { finalityConsent } = useConsent();
  useEffectOnce(() => {
    initGA(!!finalityConsent?.analytics);
    if (finalityConsent === undefined) Event("SESSION", "count", "first");
  });

  // CRISP
  useEffect(() => {
    const toggleDataPageAttribute = (url: string) => {
      if (isContentPage(url)) document.body.setAttribute("data-page", "content");
      else document.body.setAttribute("data-page", "");
    };

    toggleDataPageAttribute(document.location.href);
    router.events.on("routeChangeComplete", toggleDataPageAttribute);
    return () => {
      router.events.off("routeChangeComplete", toggleDataPageAttribute);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isRTL = useRTL();

  return (
    <DirectionProvider dir={isRTL ? "rtl" : "ltr"}>
      <ToastProvider swipeDirection="down">
        <TooltipProvider delayDuration={250}>
          <ScreenReaderAnnouncerProvider>
            <Provider store={store}>
              {getLayout(<Component history={history} {...props.pageProps} />)}
            </Provider>

            {options.supportModule && (
              <Script
                id="crisp-widget"
                strategy="lazyOnload"
                dangerouslySetInnerHTML={{
                  __html: `
        window.$crisp=[["safe", true]];
        window.CRISP_WEBSITE_ID="74e04b98-ef6b-4cb0-9daf-f8a2b643e121";
        (function(){
          const d = document;
          const s = d.createElement("script");
          s.src = "https://client.crisp.chat/l.js";
          s.async = 1;
          d.getElementsByTagName("head")[0].appendChild(s);
        })();`,
                }}
              />
            )}
          </ScreenReaderAnnouncerProvider>
        </TooltipProvider>
        <ToastViewport className={toastStyles.viewport} dir={isRTL ? "rtl" : "ltr"} />
      </ToastProvider>
    </DirectionProvider>
  );
};

export default withDsfr(appWithTranslation(App));
