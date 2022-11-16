import { extractIndexFromUrl } from "lib/sitemap/extractIndexFromUrl";
import { getAllUrls } from "lib/sitemap/getAllUrls";
import { GetServerSideProps } from "next";
import { getServerSideSitemap, getServerSideSitemapIndex } from "next-sitemap";

const SITE_URL = process.env.NEXT_PUBLIC_REACT_APP_SITE_URL;
const TYPES = ["dispositifs", "demarches", "structures", "pages"];

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const index = ctx.query.index as string[];
  const locales = (ctx.locales || []).filter((ln) => ln !== "default");
  const locale = extractIndexFromUrl(index[0]);

  // 404 wrong locale
  if (!locales.find((ln) => ln === locale)) return { notFound: true };

  // /sitemap-index/sitemap-index-LN
  if (index.length === 1) {
    return getServerSideSitemapIndex(
      ctx,
      TYPES.map((type) => `${SITE_URL}/sitemap-index/sitemap-index-${locale}/sitemap-index-${type}.xml`)
    );
  }

  // /sitemap-index/sitemap-index-LN/sitemap-index-TYPE
  if (index.length === 2) {
    const type = extractIndexFromUrl(index[1]);

    // 404 wrong type
    if (!TYPES.includes(type)) return { notFound: true };

    const urls = await getAllUrls(type, locale);
    const fields = urls.map((url) => ({
      loc: url,
      lastmod: new Date().toISOString()
    }));

    return getServerSideSitemap(ctx, fields);
  }

  // 404 wrong path
  return { notFound: true };
};

// Default export to prevent next.js errors
export default function SitemapIndex() {}
