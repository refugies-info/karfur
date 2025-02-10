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
      title: t("Homepage.accordionItems.desktop.title1"),
      text: t("Homepage.accordionItems.desktop.title1", { count: props.nbDemarches }),
      image: demarches,
      mediaWidth: 400,
      mediaHeight: 327,
    },
    {
      title: t("Homepage.accordionItems.desktop.title2"),
      text: t("Homepage.accordionItems.desktop.title2", { count: props.nbDemarches }),
      image: dispositif,
      mediaWidth: 400,
      mediaHeight: 327,
    },
    {
      title: t("Homepage.accordionItems.desktop.title3"),
      text: t("Homepage.accordionItems.desktop.title3", { count: props.nbDemarches }),
      image: partage,
      mediaWidth: 400,
      mediaHeight: 188,
    },
    {
      title: t("Homepage.accordionItems.desktop.title4"),
      text: t("Homepage.accordionItems.desktop.title4", { count: props.nbDemarches }),
      youtube: "https://www.youtube-nocookie.com/embed/QMRR2csgan0",
      mediaWidth: 442,
      mediaHeight: 320,
    },
  ];

  const accordionItemsMobile = [
    {
      // title: t("Homepage.accordionItems.mobile.title1"),
      title: t("Homepage.accordionItems.mobile.title1"),
      text: t("Homepage.accordionItems.mobile.text1", { count: props.nbDemarches }),
      image: demarchesMobile,
      mediaWidth: 400,
      mediaHeight: 327,
    },
    {
      title: t("Homepage.accordionItems.mobile.title2"),
      text: t("Homepage.accordionItems.mobile.text2", { count: props.nbDemarches }),
      image: dispos,
      mediaWidth: 400,
      mediaHeight: 327,
    },
  ];

  return (
    <div className="container md:py-20">
      <h2>{t("Homepage.whyTitle")}</h2>
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
