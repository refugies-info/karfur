import { useTranslation } from "next-i18next";
import demarchesMobile from "~/assets/homepage/why-accordion/demarches-mobile.png";
import demarches from "~/assets/homepage/why-accordion/demarches.png";
import dispos from "~/assets/homepage/why-accordion/dispos-mobile.png";
import dispositif from "~/assets/homepage/why-accordion/dispositifs.png";
import partage from "~/assets/homepage/why-accordion/partage.png";
import { Accordion } from "~/components/Pages/staticPages/common";
import { useWindowSize } from "~/hooks";

interface Props {
  nbDemarches: number;
}

const WhyAccordions = (props: Props) => {
  const { t } = useTranslation();
  const { isTablet, isMobile } = useWindowSize();

  const accordionItemsDesktop = [
    {
      title: t(
        "Homepage.accordionItemsdesktopTitle1",
        "Pour avoir des explications sur toutes les démarches administratives",
      ),
      text: t("Homepage.accordionItemsdesktopText1", {
        count: props.nbDemarches,
        defaultValue:
          "Une fois la protection internationale obtenue, de nombreuses démarches administratives doivent être enclenchées. Réfugiés.info publie des fiches pratiques pour vulgariser ces démarches. Aujourd’hui, il en existe {{count}}, réparties sur l’ensemble des thématiques de la vie quotidienne.",
      }),
      alt: t(
        "Homepage.accordionItemsdesktopAlt1",
        "Capture d'écran du site Réfugiés.info présentant des fiches pratiques sur différentes démarches administratives en France. Chaque fiche contient un titre, une catégorie (administratif, logement, travail, etc.), une icône associée, une courte description et une date de mise à jour. Les fiches visibles concernent la création d'un compte ANEF, le renouvellement d'une carte de séjour, l'échange d'un permis de conduire, la demande de logement social, l'inscription à Pôle emploi, la gestion d'un budget logement, la déclaration des impôts et la compréhension du droit du travail.",
      ),

      image: demarches,
      mediaWidth: 400,
      mediaHeight: 327,
    },
    {
      title: t("Homepage.accordionItemsdesktopTitle2", "Découvrez les actions de votre territoire"),
      text: t("Homepage.accordionItemsdesktopText2", {
        count: props.nbDemarches,
        defaultValue:
          "Réfugiés.info permet d’orienter vos bénéficiaires au sein de votre territoire et au-delà. En renseignant votre département, vous trouverez la liste des actions présentes autour de vous pour accueillir et accompagner les personnes réfugiées. Attention, la plateforme est collaborative : certains territoires sont mieux cartographiés que d’autres.",
      }),
      alt: t(
        "Homepage.accordionItemsdesktopAlt2",
        "Capture d'écran du site Réfugiés.info affichant des fiches pratiques sur des formations, services et accompagnements accessibles aux réfugiés en France. Chaque fiche contient un titre, une catégorie (formation, travail, santé, logement, etc.), une icône associée, une courte description et des informations sur la gratuité et la durée. Les fiches visibles concernent : une formation pour devenir cuisinier, l’apprentissage du français pour le code de la route, un accompagnement pour trouver un travail, l’accès à un psychologue, la pratique du sport, l’apprentissage du français pour le travail, un accompagnement scolaire et la recherche d’un logement hors Île-de-France",
      ),
      image: dispositif,
      mediaWidth: 400,
      mediaHeight: 327,
    },
    {
      title: t("Homepage.accordionItemsdesktopTitle3", "Partagez facilement l’information à vos bénéficiaires"),
      text: t("Homepage.accordionItemsdesktopText3", {
        count: props.nbDemarches,
        defaultValue:
          "Lors d’un rendez-vous, vous pouvez envoyer une fiche intéressante directement sur le téléphone de la personne que vous accompagnez. Votre numéro personnel reste anonyme.",
      }),
      alt: t(
        "Homepage.accordionItemsdesktopAlt3",
        "Interface de partage d’une fiche via SMS sur le site Réfugiés.info. À gauche, une boîte contenant trois options : partager par SMS, copier le lien et imprimer. Une flèche bleue pointe vers une nouvelle fenêtre de dialogue affichant un formulaire avec un champ pour saisir un numéro de téléphone, un menu déroulant pour sélectionner la langue du SMS et un bouton bleu avec une icône d’envoi.",
      ),
      image: partage,
      mediaWidth: 400,
      mediaHeight: 188,
    },
    {
      title: t("Homepage.accordionItemsdesktopTitle4", "Bénéficiez d'un outil de médiation"),
      text: t("Homepage.accordionItemsdesktopText4", {
        count: props.nbDemarches,
        defaultValue:
          "Sur Réfugiés.info, l’information est simplifiée, traduite en 7 langues et écoutable. Les fiches peuvent servir de support pour communiquer ou expliquer une information. Cet outil peut ainsi faciliter le travail d’accompagnement social.",
      }),
      youtube: "https://www.youtube-nocookie.com/embed/QMRR2csgan0",
      mediaWidth: 442,
      mediaHeight: 320,
    },
  ];

  const accordionItemsMobile = [
    {
      title: t(
        "Homepage.accordionItemsmobileTitle1",
        "Pour avoir des explications sur toutes les démarches administratives",
      ),
      text: t("Homepage.accordionItemsmobileText1", {
        count: props.nbDemarches,
        defaultValue:
          "Après la réponse positive pour votre statut, il faut faire des démarches administratives dans plusieurs domaines (papiers, santé, travail, famille...). Réfugiés.info propose des textes en français facile et des traductions pour comprendre comment faire les démarches.",
      }),
      alt: t(
        "Homepage.accordionItemsmobileAlt1",
        "Illustration représentant quatre cartes empilées en éventail : une carte de séjour, un passeport, une carte bancaire et une carte Vitale. Chaque carte affiche une photo d'identité du même individu.",
      ),
      image: demarchesMobile,
      mediaWidth: 400,
      mediaHeight: 327,
    },
    {
      title: t(
        "Homepage.accordionItemsmobileTitle2",
        "Pour trouver des actions et un accompagnement à côté de chez vous",
      ),
      text: t("Homepage.accordionItemsmobileText2", {
        count: props.nbDemarches,
        defaultValue:
          "Réfugiés.info permet de trouver des associations, des centres de formation, des structures d'accompagnement dans votre département.",
      }),
      alt: t(
        "Homepage.accordionItemsmobileAlt2",
        "Illustration représentant deux mains tenant une carte avec un plan stylisé en bleu et un marqueur de localisation rouge. Cette image illustre la fonctionnalité de Réfugiés.info permettant d’orienter les bénéficiaires en fonction de leur territoire. En renseignant un département, les utilisateurs peuvent accéder à une liste d’actions locales pour accueillir et accompagner les personnes réfugiées.",
      ),
      image: dispos,
      mediaWidth: 400,
      mediaHeight: 327,
    },
  ];

  return (
    <div className="container md:py-20">
      <h2 className="mb-20">{t("Homepage.whyTitle", "Pourquoi et quand utiliser Réfugiés.info ?")}</h2>
      <Accordion
        items={isMobile ? accordionItemsMobile : accordionItemsDesktop}
        withImages
        initOpen
        multiOpen={!!isTablet}
      />
    </div>
  );
};

export default WhyAccordions;
