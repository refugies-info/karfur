import Head from "next/head";

interface Props {
  description?: string;
  title?: string;
}
const SEO = (props: Props) => (
  <Head>
    <title>{"Réfugiés.info"}</title>
    {props.description && <meta name="description" content={props.description} />}
    <meta property="og:type" content="website" />
    {props.title && <meta property="og:title" content={props.title} />}
    {props.description && <meta property="og:description" content={props.description} />}
    <meta property="og:site_name" content="Réfugiés.info" />
    <meta property="twitter:card" content="summary" />
    <meta property="twitter:creator" content="@refugies_info" />
    {props.title && <meta property="twitter:title" content={props.title} />}
    {props.description && <meta property="twitter:description" content={props.description} />}
  </Head>
);

export default SEO;
