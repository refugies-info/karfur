import { getBaseUrl } from "lib/getBaseUrl";
import Head from "next/head";
import { useRouter } from "next/router";

interface Props {
  description?: string;
  title?: string;
}

const defaultTitle = "Réfugiés.info";

const getAlternateLocales = (locales: string[] | undefined, currentLocale: string|undefined) => {
  if (!locales || locales.length === 0) return [];
  return locales.filter(locale => locale !== (currentLocale || "fr"));
}

const getPath = (path: string) => {
  return path.split("?")[0];
}

const SEO = (props: Props) => {
  const prefixTitle = props.title ? `${props.title} - ` : "";
  const router = useRouter();

  return (
    <Head>
      <title>{prefixTitle + defaultTitle}</title>
      {props.description && <meta name="description" content={props.description} />}
      <meta property="og:type" content="website" />
      {props.title && <meta property="og:title" content={props.title} />}
      {props.description && <meta property="og:description" content={props.description} />}
      <meta property="og:site_name" content={defaultTitle} />
      <meta property="twitter:card" content="summary" />
      <meta property="twitter:creator" content="@refugies_info" />
      {props.title && <meta property="twitter:title" content={props.title} />}
      {props.description && <meta property="twitter:description" content={props.description} />}

      {getAlternateLocales(router.locales, router.locale).map((ln: string, i: number) => (
        <link
          key={i}
          hrefLang={ln}
          href={getBaseUrl() + ln + getPath(router.asPath)}
        ></link>
      ))}
    </Head>
  )
}

export default SEO;
