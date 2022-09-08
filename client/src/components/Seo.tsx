import { getBaseUrl } from "lib/getBaseUrl";
import Head from "next/head";
import { NextRouter, useRouter } from "next/router";
import { getPath, PathNames } from "routes";

interface Props {
  description?: string;
  title?: string;
  image?: string;
}

const defaultTitle = "Réfugiés.info";
const defaultImage = "/images/og-image-refugies.jpg";

const getAlternateLocales = (locales: string[] | undefined, currentLocale: string|undefined) => {
  if (!locales || locales.length === 0) return [];
  return locales.filter(locale => locale !== "default" && locale !== (currentLocale || "fr"));
}

const getFullPath = (router: NextRouter, ln: string) => {
  const path = getPath(router.pathname as PathNames, ln)
    .replace("[id]", router.query.id as string || ""); // replace id params
  return getBaseUrl() + ln + path;
}

const SEO = (props: Props) => {
  const prefixTitle = props.title ? `${props.title} - ` : "";
  const router = useRouter();

  return (
    <Head>
      <title>{prefixTitle + defaultTitle}</title>
      {props.description &&
        <meta name="description" content={props.description} />
      }

      {/* OPENGRAPH */}
      <meta property="og:type" content="website" />
      {props.title &&
        <meta property="og:title" content={props.title} />
      }
      {props.description &&
        <meta property="og:description" content={props.description} />
      }
      <meta property="og:site_name" content={defaultTitle} />
      <meta property="og:image" content={props.image || defaultImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* TWITTER */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:creator" content="@refugies_info" />
      {props.title &&
        <meta property="twitter:title" content={props.title} />
      }
      {props.description &&
        <meta property="twitter:description" content={props.description} />
      }
      <meta property="twitter:image" content={props.image || defaultImage} />


      {getAlternateLocales(router.locales, router.locale).map((ln: string, i: number) => (
        <link
          key={i}
          hrefLang={ln}
          href={getFullPath(router, ln)}
        ></link>
      ))}
    </Head>
  )
}

export default SEO;
