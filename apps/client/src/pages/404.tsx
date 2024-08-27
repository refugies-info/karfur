import Link from "next/link";
import SEO from "~/components/Seo";
import FButton from "~/components/UI/FButton/FButton";
import { defaultStaticProps } from "~/lib/getDefaultStaticProps";
import styles from "~/scss/pages/404.module.scss";

const NotFound = () => {
  return (
    <div className={styles.container + " animated fadeIn texte-small"}>
      <SEO title="Page non trouvée" />
      <h1>Page non trouvée</h1>
      <Link legacyBehavior href="/" passHref>
        <FButton tag="a" type="dark">
          Retour à l'accueil
        </FButton>
      </Link>
    </div>
  );
};

export const getStaticProps = defaultStaticProps;

export default NotFound;
