import { getBaseUrl } from "lib/getBaseUrl";
import Head from "next/head";
import { NextRouter, useRouter } from "next/router";
import { getPath, PathNames } from "routes";

interface Props {
  description?: string;
  title?: string;
}

const defaultTitle = "Réfugiés.info";

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
      {/* <meta property="og:image" content="https://metatags.io/assets/meta-tags-16a33a6a8531e519cc0936fbba0ad904e52d35f34a46c97a2c9f6f7dd7d336f2.png"> */}

      {/* TWITTER */}
      <meta property="twitter:card" content="summary" />
      <meta property="twitter:creator" content="@refugies_info" />
      {props.title &&
        <meta property="twitter:title" content={props.title} />
      }
      {props.description &&
        <meta property="twitter:description" content={props.description} />
      }
      {/* <meta property="twitter:image" content="https://metatags.io/assets/meta-tags-16a33a6a8531e519cc0936fbba0ad904e52d35f34a46c97a2c9f6f7dd7d336f2.png"> */}


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
