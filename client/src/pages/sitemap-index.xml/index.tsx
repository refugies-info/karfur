import { getServerSideSitemapIndex } from "next-sitemap";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const siteUrl = process.env.NEXT_PUBLIC_REACT_APP_SITE_URL;
  const locales = (ctx.locales || []).filter((ln) => ln !== "default");

  return getServerSideSitemapIndex(
    ctx,
    locales.map((ln) => `${siteUrl}/sitemap-index/sitemap-index-${ln}.xml`)
  );
};

// Default export to prevent next.js errors
export default function SitemapIndex() {}
