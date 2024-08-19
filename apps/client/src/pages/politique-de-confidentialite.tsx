import React from "react";
import Link from "next/link";
import styles from "scss/pages/legal-pages.module.scss";
import SEO from "components/Seo";
import { defaultStaticProps } from "lib/getDefaultStaticProps";
import { getPath } from "routes";
import { useRouter } from "next/router";

const PolitiqueConfidentialite = () => {
  const router = useRouter();

  return (
    <div className={styles.legal_pages + " animated fadeIn texte-small"}>
      <SEO title="Politique de confidentialité" />
      <h1>Politique de confidentialité</h1>
      <h2>Qui sommes-nous ?</h2>
      <p>
        Ce site est édité par <strong>Refugies.info</strong>. Visitez la page{" "}
        <Link legacyBehavior href={getPath("/mentions-legales", router.locale)} prefetch={false}>
          <a>Mentions légales</a>
        </Link>{" "}
        pour plus d&apos;informations.
      </p>

      <h2>Utilisation des données personnelles collectées</h2>
      <h3>Contribution</h3>
      <p>
        Si vous vous connectez à notre site web pour contribuer au contenu, vos données de connexion, telle que votre
        pseudo, votre adresse IP et les informations de l’agent utilisateur de votre navigateur sont collectés pour nous
        aider à la détection des connexions indésirables. Vous n&apos;avez pas besoin de communiquer votre email pour
        créer un compte utilisateur. Toutefois, une fois connecté, vous pourrez renseigner votre e-mail dans votre
        profil utilisateur. En ce cas, nous conservons également votre e-mail. Votre mot de passe de connexion au site
        est stocké sur nos serveurs sous forme cryptée. Nous n&apos;y avons pas accès en clair.
      </p>

      <h3>Médias</h3>
      <p>
        Si vous êtes un utilisateur ou une utilisatrice enregistré·e et que vous téléversez des images sur le site web,
        nous vous conseillons d’éviter de téléverser des images contenant des données EXIF de coordonnées GPS. Les
        visiteurs de votre site web peuvent télécharger et extraire des données de localisation depuis ces images.
      </p>

      <h3>Formulaire de contact</h3>
      <p>
        Les informations transmises via le formulaire de contact de ce site sont transmises à notre service de
        communication et ne sont en aucun cas communiquées à des tiers. En application de la loi Informatique et
        liberté, vous disposez d’un droit d’accès, de rectification, de modification et de suppression concernant des
        données qui vous concernent personnellement. Ce droit peut être exercé par voie électronique à l’adresse email
        suivante : <a href="mailto:contact@refugies.info">contact@refugies.info</a>.
      </p>

      <h3>Contenu embarqué depuis d’autres sites</h3>
      <p>
        Les articles de ce site peuvent inclure des contenus intégrés (par exemple des vidéos, images, articles…). Le
        contenu intégré depuis d’autres sites se comporte de la même manière que si le visiteur se rendait sur cet autre
        site.Ces sites web pourraient collecter des données sur vous, utiliser des cookies, embarquer des outils de
        suivis tiers, suivre vos interactions avec ces contenus embarqués si vous disposez d’un compte connecté sur leur
        site web.
      </p>

      <h3>Durée de stockage de vos données</h3>
      <p>
        Si vous publiez des contenus sur ce site, ces contenus et leurs métadonnées sont conservés indéfiniment. Pour
        les utilisateurs et utilisatrices qui s’enregistrent sur notre site, nous stockons également les données
        personnelles indiquées dans leur profil. Tous les utilisateurs et utilisatrices peuvent voir, modifier ou
        supprimer leurs informations personnelles à tout moment (pseudonyme, e-mail, mini-biographie, avatar). Les
        gestionnaires du site peuvent aussi voir et modifier ces informations.
      </p>

      <h2>Droits d&apos;accès à vos données</h2>
      <p>
        Si vous avez un compte ou si vous avez laissé des commentaires sur le site, vous pouvez demander à recevoir un
        fichier contenant toutes les données personnelles que nous possédons à votre sujet, incluant celles que vous
        nous avez fournies. Vous pouvez également demander la suppression des données personnelles vous concernant. Cela
        ne prend pas en compte les données stockées à des fins administratives, légales ou pour des raisons de sécurité.
      </p>

      <h2>Transmission de vos données personnelles</h2>
      <p>
        Les contributions publiées sur notre site ainsi que les informations contenues dans les profils des utilisateurs
        identifiés peuvent être vérifiés par nos équipes, ou à l’aide de systèmes automatisés de détection de contenus
        indésirables. A tout moment nous nous réservons la possibilité de supprimer ces informations et de supprimer les
        données d&apos;un profil utilisateur.
      </p>

      <h3>Procédures mises en œuvre en cas de fuite de données</h3>
      <p>
        En cas de fuite de données personnelles vous concernant, nous nous engageons à vous en informer dans les
        meilleurs délais. Et de vous transmettre les procédures mises en place par nos services en cas de fuite de ces
        données.
      </p>

      <h3>Les services tiers qui nous transmettent des données</h3>
      <p>
        Dans le cadre d&apos;opérations événementielles ou de communication menées avec des partenaires associatifs ou
        institutionnels, nous pouvons être amenés à recevoir des données personnelles vous concernant. Telles que votre
        nom, votre e-mail ou votre fonction. Nous nous engageons à n&apos;utiliser ces données que dans le cadre limité
        à l&apos;opération menée en commun avec ces partenaires.
      </p>
    </div>
  );
};

export const getStaticProps = defaultStaticProps;

export default PolitiqueConfidentialite;
