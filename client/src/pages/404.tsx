import React from "react";
import Link from "next/link";
import SEO from "components/Seo";
import { defaultStaticProps } from "lib/getDefaultStaticProps";
import styles from "scss/pages/404.module.scss";
import FButton from "components/FigmaUI/FButton/FButton";

const NotFound = () => {
  return (
    <div className={styles.container + " animated fadeIn texte-small"}>
      <SEO />
      <h1>Page non trouvée</h1>
      <Link href="/" passHref>
        <FButton
          tag="a"
          type="dark"
        >
          Retour à l'accueil
        </FButton>
      </Link>
    </div>
  );
};

export const getStaticProps = defaultStaticProps;

export default NotFound;
