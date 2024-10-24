import Head from "next/head";
import { NextRouter, useRouter } from "next/router";
import { getPath, PathNames } from "routes";
import { getBaseUrl } from "~/lib/getBaseUrl";

interface Props {
  description?: string;
  title?: string;
  image?: string | null;
}

const defaultTitle = "Réfugiés.info";
const defaultImage = "/images/og-image-refugies.jpg";

const getAlternateLocales = (locales: string[] | undefined, currentLocale: string | undefined) => {
  if (!locales || locales.length === 0) return [];
  return locales.filter((locale) => locale !== "default" && locale !== (currentLocale || "fr"));
};

const getFullPath = (router: NextRouter, ln: string) => {
  let path = getPath(router.pathname as PathNames, ln).replace("[id]", (router.query.id as string) || ""); // replace id params
  if (path.endsWith("/")) path = path.slice(0, -1);
  return getBaseUrl() + ln + path;
};

const getImagePath = (imagePath: string) => {
  if (imagePath.startsWith("/")) return getBaseUrl().slice(0, -1) + imagePath;
  return imagePath;
};

const SEO = (props: Props) => {
  const prefixTitle = props.title ? `${props.title} - ` : "";
  const router = useRouter();

  return (
    <Head>
      <meta name="viewport" content="width=device-width" />
      <title>{prefixTitle + defaultTitle}</title>
      {props.description && <meta name="description" content={props.description} />}
      <link rel="canonical" href={getFullPath(router, router.locale || "fr")} />

      {/* OPENGRAPH */}
      <meta property="og:url" content={getFullPath(router, router.locale || "fr")} />
      <meta property="og:type" content="website" />
      {props.title && <meta property="og:title" content={props.title} />}
      {props.description && <meta property="og:description" content={props.description} />}
      <meta property="og:site_name" content={defaultTitle} />
      <meta property="og:image" content={getImagePath(props.image || defaultImage)} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* TWITTER */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:creator" content="@refugies_info" />
      {props.title && <meta property="twitter:title" content={props.title} />}
      {props.description && <meta property="twitter:description" content={props.description} />}
      <meta property="twitter:image" content={getImagePath(props.image || defaultImage)} />

      {getAlternateLocales(router.locales, router.locale).map((ln: string, i: number) => (
        <link key={i} hrefLang={ln} href={getFullPath(router, ln)} rel="alternate"></link>
      ))}
    </Head>
  );
};

export default SEO;
