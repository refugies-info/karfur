import ConformiteResults from "~/assets/declaration-accessibilite/conformite-results.svg";
import { HelpNotice } from "~/components/Pages/recherche/HelpNotice";
import SEO from "~/components/Seo";
import EVAIcon from "~/components/UI/EVAIcon/EVAIcon";
import FButton from "~/components/UI/FButton/FButton";
import Image from "~/components/UI/Image";
import { defaultStaticProps } from "~/lib/getDefaultStaticProps";
import styles from "~/scss/pages/declaration-accessibilite.module.scss";

const DeclarationAccessibilite = () => {
  return (
    <div className="w-full">
      <HelpNotice />
      <div className={styles.container + " animated fadeIn"}>
        <SEO title="Déclaration d'accessibilité" />
        <h1>Déclaration d’accessibilité</h1>
        <p className={styles.text_muted}>
          <EVAIcon name="clock-outline" fill="#5E5E5E" className={styles.icon} />
          Temps de lecture : <span className="text-default-success">5 à 10 minutes</span>
        </p>
        <p>
          Sur cette page, vous trouverez les informations obligatoires concernant l’accessibilité de
          la plateforme Réfugiés.info.
        </p>
        <p>
          L’accessibilité permet à tous les publics, sans discrimination, d’accéder aux contenus et
          aux services numériques. Pour cela, il faut respecter des règles émises par le World Wide
          Web Consortium et pensées par des ergonomes pour chaque type de handicap.
        </p>
        <p>
          La Délégation interministérielle à l'accueil et à l'intégration des réfugiés s'engage à
          rendre son application mobile accessible conformément à l’article 47 de la loi n° 2005-102
          du 11 février 2005 ;
        </p>
        <p>
          À cette fin, elle met en œuvre la stratégie et les actions détaillées dans son plan
          pluriannuel en cours d'élaboration. Cette déclaration d’accessibilité s’applique au site
          web Réfugiés.info
        </p>

        <h2 className={styles.h4}>État de conformité : non conforme</h2>
        <p>
          Le site Réfugiés.info est non conforme avec le RGAA 4.1 de niveau Double-A (AA) en raison
          des non-conformités et des dérogations énumérées ci-dessous.
        </p>
        <p>
          L'équipe du projet Réfugiés.info réalise actuellement des améliorations techniques dans le
          but d'entrer en conformité avec les normes d'accessibilité d'ici juin 2024.
        </p>
        <h3 className={styles.h4}>Résultats des tests</h3>
        <p>
          L’audit de conformité réalisé par la société Ipedis révèle que le taux moyen de conformité
          est de 37.25% :
        </p>
        <ul>
          <li>✅ 19 critères sont respectés</li>
          <li>❌ 32 critères ne sont pas respectés</li>
          <li>🚫 55 critères ne sont pas applicables</li>
        </ul>

        <div className={styles.box}>
          <p className={styles.box_title}>Résultat de conformité des critères au RGAA 4.1</p>
          <Image
            src={ConformiteResults}
            alt="Schéma conformité"
            width={278}
            height={228}
            style={{ objectFit: "contain" }}
          />
          <div className={styles.box_legend}>
            <p>
              <span className={`${styles.box_color} ${styles.box_color_valid}`}></span>
              critères conformes
            </p>
            <p>
              <span className={`${styles.box_color} ${styles.box_color_invalid}`}></span>
              critères non conformes
            </p>
          </div>
        </div>

        <h3 className={styles.h4}>Contenus non accessibles</h3>
        <p>Les contenus listés ci-dessous ne sont pas accessibles pour les raisons suivantes.</p>
        <h4 className={styles.h5}>Non-conformité</h4>
        <ul>
          <li>
            Plusieurs éléments de non-conformité sont décrits dans ce document, dont certains
            récurrents sur plusieurs pages :
          </li>
          <li>Certaines alternatives d'images ne sont pas totalement explicites </li>
          <li>Les images décoratives ne sont pas ignorées par le lecteur d'écran</li>
          <li>Certaines alternatives d'images ne sont pas totalement explicites </li>
          <li>Certaines informations sont données que par la couleur </li>
          <li>
            Le contraste de certains composants d'interface est insuffisant par rapport au fond{" "}
          </li>
          <li>
            Le contraste entre la couleur de fond et les textes de certains composants d’interface
            n'est pas suffisant
          </li>
          <li>Certains intitulés de liens ne sont pas explicites </li>
          <li>Certains changement de contexte ne sont pas vocalisés </li>
          <li>Le code langue de toutes les pages n'est pas correct </li>
          <li>Certains titres de page ne sont pas totalement explicite </li>
          <li>Le code source n'est pas toujours valide </li>
          <li>Certaines listes d'éléments ne sont pas définies de manière accessible</li>
          <li>Certaines zones de la page ne sont pas correctement définies </li>
          <li>Du contenu devient illisible lorsqu'on zoom à 200%</li>
          <li>Le focus clavier n'est parfois pas visible</li>
          <li>Certains champs de formulaire n'ont pas d'étiquette </li>
          <li>Certains boutons n'ont pas d'intitulé</li>
          <li>Plusieurs pages ne possèdent qu'un système de navigation </li>
          <li>Il n'y a pas de lien d'évitement </li>
          <li>L'ordre de tabulation est parfois incohérent </li>
          <li>Plusieurs composants ne sont pas accessibles au clavier </li>
          <li>Certaines animations ne sont pas contrôlables</li>
          <li>Les documents PDF ne sont pas accessibles</li>
        </ul>

        <h4 className={styles.h5}>Dérogations pour charge disproportionnée</h4>
        <p>Pas de dérogation identifiée</p>

        <h4 className={styles.h5}>Contenus non soumis à l’obligation d’accessibilité</h4>
        <p>Pas de contenus non soumis à l'obligation d'accessibilité</p>

        <h2 className={styles.h4}>Établissement de cette déclaration d’accessibilité</h2>
        <p>Cette déclaration a été établie le 25 novembre 2021.</p>

        <p className="mb-0">Technologies utilisées pour la réalisation du site web :</p>
        <ul>
          <li>HTML5</li>
          <li>CSS</li>
          <li>JavaScript</li>
        </ul>

        <p className="mb-0">
          Les tests des pages web ont été effectués avec les combinaisons d'agents utilisateurs et
          de lecteurs d’écran suivants :
        </p>
        <ul>
          <li>NVDA avec Firefox</li>
          <li>JAWS avec Microsoft Edge</li>
        </ul>

        <p className="mb-0">Les outils suivants ont été utilisés lors de l’évaluation :</p>
        <ul>
          <li>Web Developer Toolbar</li>
          <li>Focus</li>
          <li>Contrast Color checker WCAG</li>
          <li>Accessibility insights for web</li>
          <li>Axe dev tool</li>
        </ul>

        <p className="mb-0">Pages du site ayant fait l’objet de la vérification de conformité :</p>
        <ul>
          <li>Accueil</li>
          <li>Mentions légales</li>
          <li>Connexion</li>
          <li>Qui sommes nous</li>
          <li>Dispositif</li>
          <li>Démarche</li>
          <li>Comment contribuer </li>
        </ul>

        <h2 className={styles.h4}>Retour d’information et contact</h2>
        <p>
          Si vous n’arrivez pas à accéder à un contenu ou à un service, vous pouvez contacter le
          responsable du site web pour être orienté vers une alternative accessible ou obtenir le
          contenu sous une autre forme.
        </p>
        <p>Contacter la direction de communication Réfugiés.info à l'adresse mail suivante :</p>
        <FButton type="dark" tag="a" href="mailto:contact@refugies.info" name="email-outline">
          contact@refugies.info
        </FButton>

        <h2 className={styles.h4}>Voies de recours</h2>
        <p>Cette procédure est à utiliser dans le cas suivant :</p>
        <p>
          Vous avez signalé au responsable du site internet un défaut d’accessibilité qui vous
          empêche d’accéder à un contenu ou à un des services du portail et vous n’avez pas obtenu
          de réponse satisfaisante.
        </p>
        <ul>
          <li>
            Écrire un message au{" "}
            <a
              href="https://formulaire.defenseurdesdroits.fr/code/afficher.php?ETAPE=accueil_2016"
              target="_blank"
              rel="noreferrer noopener"
            >
              Défenseur des droits
            </a>
          </li>
          <li>
            Contacter le délégué du{" "}
            <a
              href="https://www.defenseurdesdroits.fr/saisir/delegues"
              target="_blank"
              rel="noreferrer noopener"
            >
              Défenseur des droits de ta région
            </a>
          </li>
          <li>
            Envoyer un courrier par la poste (gratuit, ne pas mettre de timbre) à l’adresse suivante
            :
          </li>
        </ul>

        <div className={styles.address}>
          <EVAIcon name="pin-outline" fill="#212121" size="large" />
          <p>
            Défenseur des droits
            <br />
            Libre réponse 71120 <br />
            75342 Paris CEDEX 07
          </p>
        </div>

        <p className={styles.text_muted}>
          <EVAIcon name="refresh-outline" fill="#5E5E5E" className={styles.icon} />
          Mise à jour : <span className="text-default-success">6 janvier 2022</span>
        </p>
      </div>
    </div>
  );
};

export const getStaticProps = defaultStaticProps;

export default DeclarationAccessibilite;
