import { GetServerSideProps } from "next";

const PROD_ROBOTS_TXT = [
  "User-agent : *",
  "Disallow: /*/login",
  "Disallow: /*/register",
  "Disallow: /*/reset",
  "Disallow: /*/backend",
  "Disallow: /*/directory-create",
  "Disallow: /*/annuaire-creation",
  `Sitemap: ${process.env.NEXT_PUBLIC_REACT_APP_SITE_URL}/sitemap-index.xml`
];

const STG_ROBOTS_TXT = ["User-agent : *", "Disallow: /"];

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const content = process.env.NEXT_PUBLIC_REACT_APP_ENV === "production" ? PROD_ROBOTS_TXT : STG_ROBOTS_TXT;

  res.write(content.join("\n"));
  res.end();
  return {
    // This is unnecessary but Next.js requires it to be here
    props: {}
  };
};

// Default export to prevent next.js errors
export default function SitemapIndex() {}
