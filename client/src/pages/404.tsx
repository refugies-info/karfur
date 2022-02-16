import React from "react";
import Link from "next/link";
import SEO from "components/Seo";
import { defaultStaticProps } from "lib/getDefaultStaticProps";

const NotFound = () => {
  return (
    <div className={"animated fadeIn texte-small"}>
      <SEO />
      <h1>Page non trouvée</h1>
      <Link href="/">
        <a>Retour à l'accueil</a>
      </Link>
    </div>
  );
};

export const getStaticProps = defaultStaticProps;

export default NotFound;
