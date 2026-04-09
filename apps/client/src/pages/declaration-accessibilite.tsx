import { HelpNotice } from "~/components/Pages/recherche/HelpNotice";
import SEO from "~/components/Seo";
import EVAIcon from "~/components/UI/EVAIcon/EVAIcon";
import { defaultStaticProps } from "~/lib/getDefaultStaticProps";
import styles from "~/scss/pages/declaration-accessibilite.module.scss";

const DeclarationAccessibilite = () => {
  return (
    <div className="w-full">
      <HelpNotice />
      <div className={styles.container + " animated fadeIn prose no-dsfr"}>
        <SEO title="Accessibilité : partiellement conforme" />
        <h1>Déclaration d'accessibilité</h1>
        <p className={styles.text_muted}>
          <EVAIcon name="clock-outline" fill="#5E5E5E" className={styles.icon} aria-hidden="true" />
          Temps de lecture : <span className="text-default-success">5 à 10 minutes</span>
        </p>
        <p>
          Cette page présente nos engagements en matière d'accessibilité numérique puis définit le
          niveau de conformité de ce présent site à la réglementation et aux référentiels en
          vigueur.
        </p>

        <h2>Qu'est-ce que l'accessibilité numérique ?</h2>
        <p>
          L'accessibilité numérique est un ensemble de règles et de bonnes pratiques qui couvrent
          notamment les aspects fonctionnels, graphiques, techniques et éditoriaux.
        </p>
        <p>
          Le suivi de ces règles et bonnes pratiques permet de s'assurer que les supports numériques
          (sites web, applications mobiles, documents PDF, etc.) sont{" "}
          <strong>accessibles aux personnes handicapées</strong>.
        </p>
        <p>Un site accessible permet par exemple de :</p>
        <ul>
          <li>
            Personnaliser son affichage via le système d'exploitation et/ou le navigateur
            (agrandissement ou rétrécissement des caractères, changement de la typographie,
            modification des couleurs, arrêt des animations, etc.).
          </li>
          <li>
            Naviguer à l'aide de technologies d'assistance comme une synthèse vocale ou une plage
            braille.
          </li>
          <li>
            Naviguer sans utiliser la souris, avec le clavier uniquement, des contacteurs ou via un
            écran tactile.
          </li>
          <li>
            Consulter les vidéos et les contenus audio à l'aide de sous-titres et/ou de
            transcriptions.
          </li>
          <li>Etc.</li>
        </ul>

        <h2>Engagements d'accessibilité numérique</h2>
        <p>
          Réfugiés.info s'engage à rendre accessibles ses sites web (internet, intranet et
          extranet), ses applications mobiles, ses progiciels et son mobilier urbain numérique
          conformément à l'
          <a
            href="https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000037388867"
            target="_blank"
            rel="noopener noreferrer"
          >
            article 47 de la loi n°2005-102 du 11 février 2005
          </a>
          .
        </p>

        <h2>Déclaration de conformité partielle au RGAA</h2>
        <p>
          Cette déclaration s'applique au site{" "}
          <a href="https://refugies.info/" target="_blank" rel="noopener noreferrer">
            « refugies.info »
          </a>
          .
        </p>

        <h3>État de conformité</h3>
        <p>
          Ce présent site est partiellement conforme au{" "}
          <a
            href="https://accessibilite.numerique.gouv.fr/"
            target="_blank"
            rel="noopener noreferrer"
          >
            RGAA (Référentiel Général d'Amélioration de l'Accessibilité)
          </a>{" "}
          - version 4.1.2 en raison des non-conformités énumérées ci-après.
        </p>

        <h3>Résultats des tests</h3>
        <p>
          L'audit de conformité au RGAA version 4.1.2 réalisé en mars 2026 par la société{" "}
          <a href="https://ideance.net/" target="_blank" rel="noopener noreferrer">
            Ideance
          </a>{" "}
          révèle que sur l'échantillon :
        </p>
        <ul>
          <li>
            Le taux de conformité global est de 57 %. Ce taux est obtenu en divisant le nombre de
            critères conformes par le nombre de critères applicables.
          </li>
          <li>
            Le taux de conformité moyen est de 68,3 %. Ce taux est obtenu en faisant la moyenne des
            taux de conformité de chaque page.
          </li>
        </ul>

        <h3>Contenus non accessibles</h3>

        <h4>Non-conformités</h4>
        <p>Liste des critères non conformes :</p>
        <ul>
          <li>1.1 - Des images porteuses d'informations n'ont pas d'alternative textuelle.</li>
          <li>
            1.2 - Des images décoratives ne sont pas ignorées par les technologies d'assistance.
          </li>
          <li>
            1.3 - Des alternatives textuelles d'images porteuses d'informations ne sont pas
            pertinentes.
          </li>
          <li>2.2 - Des titres d'iframes ne sont pas pertinents.</li>
          <li>
            3.2 - Des contrastes entre couleur de texte et couleur d'arrière-plan ne sont pas
            suffisamment élevés.
          </li>
          <li>
            3.3 - Des contrastes entre couleur de composants d'interface ou éléments graphiques
            porteurs d'informations et couleur d'arrière-plan ne sont pas suffisamment élevés.
          </li>
          <li>
            4.1 - Des vidéos ne possèdent pas de transcription textuelle ou d'audiodescription.
          </li>
          <li>4.5 - Des vidéos ne possèdent pas d'audiodescription.</li>
          <li>4.7 - Des vidéos ne sont pas clairement identifiables.</li>
          <li>6.1 - Des liens ne sont pas explicites.</li>
          <li>7.1 - Des scripts ne sont pas compatibles avec les technologies d'assistance.</li>
          <li>
            7.5 - Des messages de statut ne sont pas correctement restitués par les technologies
            d'assistance.
          </li>
          <li>8.5 - Des pages ne possèdent pas de titre.</li>
          <li>8.6 - Des titres de page ne sont pas pertinents.</li>
          <li>8.7 - Des changements de langue ne sont pas indiqués.</li>
          <li>8.9 - Des balises sont utilisées uniquement à des fins de présentation.</li>
          <li>8.10 - Des changements de sens de lecture ne sont pas signalés.</li>
          <li>
            9.1 - Des informations ne sont pas structurées par l'utilisation appropriée de titres.
          </li>
          <li>9.3 - Des listes ne sont pas correctement structurées.</li>
          <li>9.4 - Des citations ne sont pas correctement indiquées.</li>
          <li>
            10.1 - Des feuilles de styles ne sont pas utilisées pour contrôler la présentation.
          </li>
          <li>
            10.2 - Des contenus visibles porteurs d'informations ne sont pas présents lorsque les
            feuilles de styles sont désactivées.
          </li>
          <li>
            10.4 - Des textes ne sont pas lisibles lorsque la taille des caractères est augmentée
            jusqu'à 200 %, au moins.
          </li>
          <li>
            10.6 - Des liens dont la nature n'est pas évidente ne sont pas visibles par rapport à
            leur texte environnant.
          </li>
          <li>
            10.8 - Des contenus cachés n'ont pas vocation à être ignorés par les technologies
            d'assistance.
          </li>
          <li>
            10.11 - Des contenus ne peuvent pas être présentés sans avoir recours à un défilement
            horizontal pour une fenêtre ayant une largeur de 320px.
          </li>
          <li>11.1 - Des champs de formulaire n'ont pas d'étiquette.</li>
          <li>11.6 - Des regroupements de champs de même nature n'ont pas de légende.</li>
          <li>11.10 - Des contrôles de saisie ne sont pas utilisés de manière pertinente.</li>
          <li>
            11.13 - La finalité de champs de saisie ne peut pas être déduite pour faciliter leur
            remplissage automatique avec les données de l'utilisateur ou de l'utilisatrice.
          </li>
          <li>
            12.7 - Un lien d'évitement ou d'accès rapide à la zone de contenu principal est absent.
          </li>
          <li>12.8 - L'ordre de tabulation n'est pas cohérent.</li>
          <li>
            13.3 - Des documents bureautiques en téléchargement ne possèdent pas de version
            accessible.
          </li>
          <li>
            13.5 - Des contenus cryptiques (art ASCII, émoticône, syntaxe cryptique) n'ont pas
            d'alternative.
          </li>
        </ul>

        <h4>Contenus non soumis à l'obligation d'accessibilité</h4>
        <p>
          La carte interactive « Leaflet », présente dans la section « Lieu d'accueil » de la page «
          <a
            href="https://refugies.info/dispositif/5df76ead21431b004e139a04"
            target="_blank"
            rel="noopener noreferrer"
          >
            Apprendre le français du code de la route
          </a>
          », a été exemptée.
        </p>
        <p>Elle n'a donc pas fait l'objet d'un audit complet et détaillé.</p>
        <p>
          Cette exemption est invocable car ses informations essentielles sont fournies sous une
          autre forme numérique accessible.
        </p>

        <h3>Remarques complémentaires</h3>

        <h4>Validité du code source généré</h4>
        <p>
          Le code source généré des pages du site n'est pas totalement valide selon le type de
          document spécifié.
        </p>
        <p>
          Toutefois, pour les raisons évoquées ci-après, le critère 8.2 du RGAA correspondant à ce
          point a été marqué comme conforme.
        </p>
        <p>
          Officiellement, le critère 4.1.1 des WCAG relatif à ce critère 8.2 du RGAA a été supprimé
          des WCAG 2.2 et doit être considéré comme toujours satisfait au regard des WCAG 2.1 ainsi
          que de la norme européenne EN 301 549.
        </p>
        <p>
          En pratique, ce critère n'a désormais plus aucun bénéfice pour l'accessibilité aux
          personnes handicapées. Les éventuels problèmes d'accessibilité émanant de la non validité
          du code source généré étant couverts par d'autres critères du RGAA.
        </p>

        <h4>Création de compte : critère 7.5</h4>
        <p>
          Au sein de la première étape «{" "}
          <a
            href="https://refugies.info/auth/inscription/partenaire"
            target="_blank"
            rel="noopener noreferrer"
          >
            Créez votre compte (étape "Choix du partenaire")
          </a>
          », le titre « Étape N sur X » est dynamiquement mis à jour selon la sélection du
          partenaire.
        </p>
        <p>
          Bien que cette mise à jour ne dispose pas d'une restitution automatique aux technologies
          d'assistance, le critère 7.5 a été considéré comme non applicable car sa prise en compte
          apporterait plus de confusion que d'amélioration.
        </p>

        <h4>Éléments de tiers non audités</h4>

        <h5>Lecteur vidéo</h5>
        <p>Le lecteur vidéo « YouTube » n'a pas fait l'objet d'un audit complet et détaillé.</p>
        <p>
          Il a toutefois été vérifié que son utilisation est bien possible avec différentes
          technologies d'assistance.
        </p>

        <h5>Chatbot</h5>
        <p>Le chatbot d'aide n'a pas fait l'objet d'un audit complet et détaillé.</p>
        <p>
          Il a toutefois été vérifié que son utilisation est bien possible avec différentes
          technologies d'assistance.
        </p>
        <p>
          Par ailleurs, d'autres moyens de contacter les responsables du site sont mis à
          disposition, notamment via la section « Retour d'information et contact » de la présente
          page, ainsi que le{" "}
          <a href="https://help.refugies.info/fr/" target="_blank" rel="noopener noreferrer">
            centre d'aide de Réfugiés.info
          </a>
          .
        </p>

        <h3>Établissement de cette déclaration</h3>
        <p>Cette déclaration a été établie le 16 mars 2026.</p>

        <h4>Technologies utilisées pour la réalisation du site</h4>
        <ul>
          <li>HTML5.</li>
          <li>ARIA.</li>
          <li>CSS.</li>
          <li>JavaScript.</li>
        </ul>

        <h4>Environnement de test</h4>
        <p>
          Les tests ont été effectués avec les combinaisons de navigateur web et lecteur d'écran
          suivantes :
        </p>
        <ul>
          <li>Firefox 147 et NVDA 2025.3.2 sous Windows 11.</li>
          <li>Firefox 147 et JAWS 2025 sous Windows 11.</li>
          <li>Safari et VoiceOver sous macOS 26.2.</li>
          <li>Safari et VoiceOver sous iOS 26.2.1.</li>
        </ul>

        <h4>Outils pour évaluer l'accessibilité</h4>
        <ul>
          <li>Colour Contrast Analyser.</li>
          <li>Outils de développement Firefox.</li>
          <li>Web Developer (extension Firefox).</li>
        </ul>

        <h4>Pages du site ayant fait l'objet de la vérification de conformité</h4>
        <ul>
          <li>
            <a href="https://refugies.info/" target="_blank" rel="noopener noreferrer">
              Accueil
            </a>
          </li>
          <li>
            <a
              href="https://refugies.info/mentions-legales"
              target="_blank"
              rel="noopener noreferrer"
            >
              Mentions légales
            </a>
          </li>
          <li>
            <a href="https://refugies.info/plan-du-site" target="_blank" rel="noopener noreferrer">
              Plan du site
            </a>
          </li>
          <li>
            <a href="https://refugies.info/fr/auth" target="_blank" rel="noopener noreferrer">
              Connexion
            </a>
          </li>
          <li>
            <a
              href="https://refugies.info/auth/inscription?email=mail@domaine.fr"
              target="_blank"
              rel="noopener noreferrer"
            >
              Créez votre compte
            </a>
          </li>
          <li>
            <a
              href="https://refugies.info/auth/inscription/partenaire"
              target="_blank"
              rel="noopener noreferrer"
            >
              Créez votre compte (étape « Partenaire »)
            </a>
          </li>
          <li>
            <a
              href="https://refugies.info/auth/inscription/territoire"
              target="_blank"
              rel="noopener noreferrer"
            >
              Créez votre compte (étape « Territoire »)
            </a>
          </li>
          <li>
            <a href="https://refugies.info/recherche" target="_blank" rel="noopener noreferrer">
              Trouver une fiche d'information
            </a>
          </li>
          <li>
            <a
              href="https://refugies.info/dispositif/5df76ead21431b004e139a04"
              target="_blank"
              rel="noopener noreferrer"
            >
              Apprendre le français du code de la route
            </a>
          </li>
          <li>
            <a
              href="https://refugies.info/demarche/5e189ed30742580052a332b6"
              target="_blank"
              rel="noopener noreferrer"
            >
              Demander la nationalité française
            </a>
          </li>
          <li>
            <a
              href="https://refugies.info/mission-et-impact"
              target="_blank"
              rel="noopener noreferrer"
            >
              Mission et impact
            </a>
          </li>
          <li>
            <a href="https://refugies.info/publier" target="_blank" rel="noopener noreferrer">
              Recensez vos actions !
            </a>
          </li>
          <li>
            <a href="https://refugies.info/traduire" target="_blank" rel="noopener noreferrer">
              Aidez-nous à traduire !
            </a>
          </li>
        </ul>

        <h3>Démarche d'amélioration</h3>
        <p>
          Réfugiés.info a engagé une démarche d'amélioration continue de l'accessibilité depuis
          2024. L'audit de mars 2026 a permis de mesurer les progrès réalisés et d'identifier les
          non-conformités restantes. Les corrections sont en cours de déploiement progressif.
        </p>

        <h3>Retour d'information et contact</h3>
        <p>
          Si vous n'arrivez pas à accéder à un contenu ou à un service de ce site, vous pouvez nous
          contacter via un des moyens ci-après en décrivant votre problème :
        </p>
        <p>
          Écrivez-nous à l'adresse email :{" "}
          <a href="mailto:contact@refugies.info">contact@refugies.info</a>.
        </p>
        <p>Nous nous engageons à vous répondre dans un délai de 2 jours ouvrés au plus tard.</p>

        <h3>Voies de recours</h3>
        <ol>
          <li>
            Vous avez identifié sur ce site web un ou plusieurs manquement(s) à la réglementation
            relative à l'accessibilité numérique (présence de défauts d'accessibilité, absence des
            obligations déclaratives, etc.).
          </li>
          <li>Vous nous avez contacté pour nous en informer.</li>
          <li>Vous n'avez pas reçu de réponse satisfaisante.</li>
        </ol>
        <p>Alors vous avez la possibilité de :</p>

        <h4>Contacter l'Arcom</h4>
        <p>
          Afin de signaler un ou plusieurs manquement(s) à la réglementation relative à
          l'accessibilité numérique, rendez-vous sur la page «{" "}
          <a
            href="https://www.arcom.fr/signaler-ou-alerter/probleme-accessibilite"
            target="_blank"
            rel="noopener noreferrer"
          >
            Signaler un problème d'accessibilité d'un service numérique
          </a>
          » du site web de l'Arcom.
        </p>

        <h4>Saisir le Défenseur des droits</h4>
        <p>
          Pour faire valoir vos droits relatifs à des défauts d'accessibilité que vous avez
          rencontrés :
        </p>
        <ul>
          <li>
            Soit contactez le délégué de votre région en passant par{" "}
            <a
              href="https://www.defenseurdesdroits.fr/carte-des-delegues"
              target="_blank"
              rel="noopener noreferrer"
            >
              l'annuaire des délégués du Défenseur des droits
            </a>
            .
          </li>
          <li>
            Soit remplissez le{" "}
            <a
              href="https://formulaire.defenseurdesdroits.fr/formulaire_saisine/"
              target="_blank"
              rel="noopener noreferrer"
            >
              formulaire de réclamation du Défenseur des droits
            </a>{" "}
            en choisissant les thématiques « Je suis victime de discrimination » puis « Biens et
            services privés » et enfin « Handicap ».
          </li>
          <li>
            Soit envoyer un courrier gratuit (sans mettre de timbre) par la poste à l'adresse
            suivante :
          </li>
        </ul>
        <div className={styles.address}>
          <EVAIcon name="pin-outline" fill="#212121" size="large" aria-hidden="true" />
          <p>
            Défenseur des droits
            <br />
            Libre réponse 71120
            <br />
            75342 Paris CEDEX 07
          </p>
        </div>

        <p className={styles.text_muted}>
          <EVAIcon
            name="refresh-outline"
            fill="#5E5E5E"
            className={styles.icon}
            aria-hidden="true"
          />
          Mise à jour : <span className="text-default-success">26 mars 2026</span>
        </p>
      </div>
    </div>
  );
};

export const getStaticProps = defaultStaticProps;

export default DeclarationAccessibilite;
