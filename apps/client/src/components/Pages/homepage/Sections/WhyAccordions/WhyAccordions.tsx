import { useTranslation } from "next-i18next";
import demarchesMobile from "~/assets/homepage/why-accordion/demarches-mobile.png";
import demarches from "~/assets/homepage/why-accordion/demarches.png";
import dispos from "~/assets/homepage/why-accordion/dispos-mobile.png";
import dispositif from "~/assets/homepage/why-accordion/dispositifs.png";
import partage from "~/assets/homepage/why-accordion/partage.png";
import { Accordion } from "~/components/Pages/staticPages/common";
import { useWindowSize } from "@refugies-info/ui";

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
      alt: "",

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
      alt: "",
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
      alt: "",
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
      alt: "",
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
      alt: "",
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
