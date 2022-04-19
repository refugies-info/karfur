import React from "react";
import Link from "next/link";
import styles from "scss/pages/legal-pages.module.scss";
import SEO from "components/Seo";
import { defaultStaticProps } from "lib/getDefaultStaticProps";
import { getPath } from "routes";
import { useRouter } from "next/router";

const MentionsLegales = () => {
  const router = useRouter();

  return (
    <div className={styles.legal_pages + " animated fadeIn texte-small"}>
      <SEO title="Mentions légales" />
      <h1>Mentions légales</h1>
      <h2>Site édité par</h2>
      <strong>Refugies.info</strong>
      <p>Place Beauvau 75800 Paris Cedex 08</p>

      <h2>Directeur de la publication</h2>

      <strong>Nour Allazkani</strong>

      <h2>Droit d’accès</h2>

      <p>
        En application de la loi Informatique et liberté, vous disposez d’un
        droit d’accès, de rectification, de modification et de suppression
        concernant des données qui vous concernent personnellement. Ce droit
        peut être exercé par voie électronique à l’adresse email suivante :{" "}
        <a title="Email" href="mailto:contact@email.refugies.info">
          contact@email.refugies.info
        </a>
        .
        <p>
          Ou par courrier postal, daté et signé, accompagné d&apos;une copie d’un
          titre d’identité, à l&apos;adresse suivante :
        </p>
        <p>
          <strong>
            Le délégué interministériel chargé de l&apos;accueil et de l&apos;intégration
            des réfugiés
          </strong>
          <br />
          18 rue des Pyrénées
          <br />
          75020 Paris
        </p>
      </p>

      <h2>Politique de confidentialité</h2>

      <p>
        Les informations personnelles collectées ne sont en aucun cas confiées à
        des tiers. Pour plus d&apos;information consultez la page relative à{" "}
        <Link href={getPath("/politique-de-confidentialite", router.locale)}>
          <a>
            <strong>notre politique de confidentialité</strong>
          </a>
        </Link>
        .
      </p>

      <h2>Propriété intellectuelle</h2>

      <p>
        Tout le contenu de notre site, incluant, de façon non limitative, les
        graphismes, images, textes, vidéos, animations, sons, logos et icônes,
        sont la propriété exclusive de l&apos;éditeur du site, à l’exception des
        marques, logos ou contenus appartenant à d’autres organisations. Pour
        toute demande d’autorisation ou d’information, veuillez nous contacter
        par email :{" "}
        <a title="Email" href="mailto:contact@email.refugies.info">
          contact@email.refugies.info
        </a>
        . Des conditions spécifiques sont prévues pour la presse.
      </p>

      <h2>Hébergeur</h2>

      <p>
        Le site Refugies.info est hébergé par la société
        <Link href="https://www.ovh.com"><a>OVH</a></Link>. 2 rue Kellermann – 59100 Roubaix
        – France Téléphone : 08 90 39 09 75 (France)
      </p>
    </div>
  );
};

export const getStaticProps = defaultStaticProps;

export default MentionsLegales;
