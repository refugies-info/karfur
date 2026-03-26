import { ContentType } from "@refugies-info/api-types";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import type { ReactElement } from "react";
import { getPath } from "routes";
import API from "~/utils/API";

interface SitemapProps {
  urls: string[];
}

type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactElement;
};

// This page is designed to be consumed by crawlers, not humans.
const Sitemap: NextPageWithLayout<SitemapProps> = ({ urls }) => {
  return (
    <>
      <Head>
        <title>Sitemap - Réfugiés.info</title>
        <meta name="robots" content="noindex, follow" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      </Head>
      {urls.map((url, index) => (
        <div key={index}>
          <a href={url}>{url}</a>
        </div>
      ))}
    </>
  );
};

// Disable layout for this page
Sitemap.getLayout = (page: ReactElement) => page;

export const getServerSideProps: GetServerSideProps = async ({ res, locales = [] }) => {
  const availableLocales = locales.filter((ln) => ln !== "default");

  // Fetch URLs for each locale sequentially to avoid backend overload
  // Previously used Promise.all which fired 16 requests (8 locales × 2 types) simultaneously
  const allUrls: string[] = [];
  for (const loc of availableLocales) {
    // Process dispositifs and demarches for this locale (2 concurrent requests max)
    const [dispositifs, demarches] = await Promise.all([
      API.getDispositifs({ type: ContentType.DISPOSITIF, locale: loc }),
      API.getDispositifs({ type: ContentType.DEMARCHE, locale: loc }),
    ]);

    allUrls.push(
      ...dispositifs.map(
        (d) =>
          `${process.env.NEXT_PUBLIC_REACT_APP_SITE_URL}/${loc}${getPath("/dispositif/[id]", loc).replace("[id]", d._id.toString())}`,
      ),
      ...demarches.map(
        (d) =>
          `${process.env.NEXT_PUBLIC_REACT_APP_SITE_URL}/${loc}${getPath("/demarche/[id]", loc).replace("[id]", d._id.toString())}`,
      ),
    );
  }

  // Set cache headers - cache for 1 day, revalidate after 1 hour
  res?.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res?.setHeader("Content-Type", "text/html; charset=utf-8");

  // Prevent Next.js from using the default layout
  res?.setHeader("X-Content-Type-Options", "nosniff");
  res?.setHeader("X-Frame-Options", "DENY");
  res?.setHeader("X-XSS-Protection", "1; mode=block");

  return {
    props: {
      urls: allUrls,
    },
  };
};

export default Sitemap;
