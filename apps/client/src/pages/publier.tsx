import Button from "@codegouvfr/react-dsfr/Button";
import { RoleName } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Col, Container, Row } from "reactstrap";
import HelpIcon3 from "~/assets/staticPages/publier/help-icon-chat.svg";
import HelpIcon2 from "~/assets/staticPages/publier/help-icon-tutos.svg";
import HelpIcon1 from "~/assets/staticPages/publier/help-icon-webinar.svg";
import RequiredIcon1 from "~/assets/staticPages/publier/icon-calendar.svg";
import RequiredIcon3 from "~/assets/staticPages/publier/icon-hands.svg";
import RequiredIcon2 from "~/assets/staticPages/publier/icon-money.svg";
import MockupsRI from "~/assets/staticPages/publier/mockups-ri.png";
import StepImage1 from "~/assets/staticPages/publier/step-image-1.png";
import StepImage2 from "~/assets/staticPages/publier/step-image-2.png";
import StepImage3 from "~/assets/staticPages/publier/step-image-3.png";
import StepImage4 from "~/assets/staticPages/publier/step-image-4.png";
import StepImage5 from "~/assets/staticPages/publier/step-image-5.png";
import StepImage6 from "~/assets/staticPages/publier/step-image-6.png";
import WhyImage1 from "~/assets/staticPages/publier/why-image-1.png";
import WhyImage2 from "~/assets/staticPages/publier/why-image-2.png";
import WhyImage3 from "~/assets/staticPages/publier/why-image-3.png";
import WhyImage4 from "~/assets/staticPages/publier/why-image-4.png";
import WriteContentModal from "~/components/Modals/WriteContentModal/WriteContentModal";
import {
  Accordion,
  Card,
  CountUpFigure,
  Register,
  SecondaryNavbar,
  Section,
  StepContent,
  Title2,
} from "~/components/Pages/staticPages/common";
import { CardExample, TestimonySlider } from "~/components/Pages/staticPages/publier";
import SEO from "~/components/Seo";
import Image from "~/components/UI/Image";
import useWindowSize from "~/hooks/useWindowSize";
import { cls } from "~/lib/classname";
import { getLanguageFromLocale } from "~/lib/getLanguageFromLocale";
import styles from "~/scss/components/staticPages.module.scss";
import { wrapper } from "~/services/configureStore";
import API from "~/utils/API";

export type View = "why" | "required" | "steps" | "faq" | "register";

interface Props {
  nbVues: number;
  nbFiches: number;
  nbStructures: number;
}

const RecensezVotreAction = (props: Props) => {
  const { t } = useTranslation();
  const { isTablet } = useWindowSize();

  // write modal
  const [showWriteModal, setShowWriteModal] = useState(false);
  const toggleWriteModal = useCallback(() => {
    setShowWriteModal((o) => !o);
  }, [setShowWriteModal]);

  // active links
  const [activeView, setActiveView] = useState<View | null>(null);
  const [refHero, inViewHero] = useInView({ threshold: 0 });
  const [refWhy, inViewWhy] = useInView({ threshold: 0.1 });
  const [refRequired, inViewRequired] = useInView({ threshold: 0.5 });
  const [refSteps, inViewSteps] = useInView({ threshold: 0.05 });
  const [refFaq, inViewFaq] = useInView({ threshold: 0.1 });
  const [refRegister, inViewRegister] = useInView({ threshold: 0.5 });

  useEffect(() => {
    const views: { inView: boolean; id: View }[] = [
      { inView: inViewWhy, id: "why" },
      { inView: inViewRequired, id: "required" },
      { inView: inViewSteps, id: "steps" },
      { inView: inViewFaq, id: "faq" },
      { inView: inViewRegister, id: "register" },
    ];
    for (const view of views.reverse()) {
      if (view.inView) {
        setActiveView(view.id);
        return;
      }
    }
    setActiveView(null);
  }, [inViewWhy, inViewRequired, inViewSteps, inViewFaq, inViewRegister]);

  return (
    <div className={styles.main}>
      <SEO title={t("Publish.title")} />

      {/* HERO */}
      <Section ref={refHero} className="bg-blue-france mb-4">
        <div className="fr-container">
          <div className="flex flex-col md:flex-row md:items-center gap-10 lg:gap-20">
            <div className="flex-1 text-center md:text-left">
              <h1 className={cls(styles.title, "!text-white mb-6")}>{t("Publish.title")}</h1>
              <p className={cls(styles.title_sub, "text-white !mb-0")}>{t("Publish.subtitle")}</p>
              <Button
                iconId="fr-icon-arrow-right-line"
                iconPosition="right"
                className="mt-10 !w-full justify-center md:!w-auto fr-button-reverse"
                linkProps={{
                  href: "#register",
                }}
              >
                {t("Publish.navbarItem5")}
              </Button>
            </div>
            <div className="flex-1">
              <Image src={MockupsRI} alt="" style={{ maxWidth: "100%", height: "auto" }} />
            </div>
          </div>
        </div>
      </Section>

      <SecondaryNavbar
        leftLinks={[
          { id: "why", color: "green", text: t("Publish.navbarItem1") },
          { id: "required", color: "purple", text: t("Publish.navbarItem2") },
          { id: "steps", color: "orange", text: t("Publish.navbarItem3") },
          { id: "faq", color: "red", text: t("Publish.navbarItem4") },
        ]}
        rightLink={{
          id: "register",
          color: "blue",
          text: t("Publish.navbarItem5"),
        }}
        activeView={activeView}
        isSticky={!inViewHero}
      />

      <div ref={refWhy} className="relative">
        <span id="why" className={styles.anchor}></span>
        {/* WHY */}
        <div className={cls(styles.section)}>
          <Container className={styles.container}>
            <h2 className={styles.title2}>{t("Publish.whyTitle")}</h2>
            <Accordion
              items={[
                {
                  title: t("Publish.whyAccordionTitle1"),
                  text: t("Publish.whyAccordionText1"),
                  image: WhyImage1,
                  mediaWidth: 400,
                  mediaHeight: 320,
                },
                {
                  title: t("Publish.whyAccordionTitle2"),
                  text: t("Publish.whyAccordionText2"),
                  image: WhyImage2,
                  mediaWidth: 400,
                  mediaHeight: 320,
                },
                {
                  title: t("Publish.whyAccordionTitle3"),
                  text: t("Publish.whyAccordionText3"),
                  image: WhyImage3,
                  mediaWidth: 400,
                  mediaHeight: 320,
                },
                {
                  title: t("Publish.whyAccordionTitle4"),
                  text: t("Publish.whyAccordionText4"),
                  image: WhyImage4,
                  mediaWidth: 400,
                  mediaHeight: 320,
                },
              ]}
              withImages
              initOpen
              multiOpen={!!isTablet}
              mediaAlign="center"
            />
          </Container>
        </div>

        {/* TESTIMONY */}
        <Section className="bg-light-alt-blue">
          <div className="fr-container">
            <Title2>{t("Publish.testimonies_title")}</Title2>
            <TestimonySlider
              testimonies={[
                {
                  text: t("Publish.testimony1"),
                  name: "Vincent Le Lann",
                  position: "Compagnons du Tour de France à Nantes",
                },
                {
                  text: t("Publish.testimony2"),
                  name: "Rémi Crouzel",
                  position: "Mission Locale de Dijon & Conseiller IPeRACTIFS21",
                },
                {
                  text: t("Publish.testimony3"),
                  name: "Paola Salazar",
                  position: "Directrice adjointe UniR",
                },
              ]}
            />
          </div>
        </Section>
      </div>

      {/* REQUIRED */}
      <Section ref={refRequired} className="relative">
        <span id="required" className={styles.anchor}></span>
        <div className="fr-container">
          <Title2>{t("Publish.requiredTitle")}</Title2>
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-10">
            <Card
              image={RequiredIcon1}
              title={t("Publish.requiredSubtitle1")}
              footer={
                <CardExample
                  exampleKo={t("Publish.requiredTextExample1Ko")}
                  exampleOk={t("Publish.requiredTextExample1Ok")}
                />
              }
            >
              <p className="mb-0">{t("Publish.requiredText1")}</p>
            </Card>

            <Card
              image={RequiredIcon2}
              title={t("Publish.requiredSubtitle2")}
              footer={
                <CardExample
                  exampleKo={t("Publish.requiredTextExample2Ko")}
                  exampleOk={t("Publish.requiredTextExample2Ok")}
                />
              }
            >
              <p className="mb-0">{t("Publish.requiredText2")}</p>
            </Card>

            <Card
              image={RequiredIcon3}
              title={t("Publish.requiredSubtitle3")}
              footer={
                <CardExample
                  exampleKo={t("Publish.requiredTextExample3Ko")}
                  exampleOk={t("Publish.requiredTextExample3Ok")}
                />
              }
            >
              <p className="mb-0">{t("Publish.requiredText3")}</p>
            </Card>
          </div>
          <div className="mt-10 lg:mt-20 text-center">
            <Button
              priority="tertiary no outline"
              linkProps={{
                href: "https://help.refugies.info/fr/article/charte-editoriale-comment-bien-rediger-une-fiche-1twbzhu/",
              }}
              iconId="fr-icon-arrow-right-line"
              iconPosition="right"
              size="large"
            >
              {t("Publish.requiredCTA")}
            </Button>
          </div>
        </div>
      </Section>

      <div ref={refSteps} className={"relative"}>
        <span id="steps" className={styles.anchor}></span>
        {/* STEPS */}
        <Section className="bg-beige">
          <div className="fr-container">
            <Title2>{t("Publish.stepsTitle")}</Title2>
            <StepContent
              step={1}
              color="purple"
              title={t("Publish.stepsSubtitle1")}
              texts={[t("Publish.stepsText1")]}
              cta={{ text: t("Publish.stepsCTA1"), link: "#register" }}
              image={StepImage1}
              width={440}
            />
            <StepContent
              step={2}
              color="purple"
              title={t("Publish.stepsSubtitle2")}
              texts={[t("Publish.stepsText2a"), t("Publish.stepsText2b")]}
              cta={{
                text: t("Publish.stepsCTA2"),
                link: "https://help.refugies.info/fr/category/charte-editoriale-2fq3x7/",
              }}
              image={StepImage2}
              width={440}
            />
            <StepContent
              step={3}
              color="purple"
              title={t("Publish.stepsSubtitle3")}
              texts={[t("Publish.stepsText3")]}
              image={StepImage3}
              width={440}
            />
            <StepContent
              step={4}
              color="purple"
              title={t("Publish.stepsSubtitle4")}
              texts={[t("Publish.stepsText4a"), t("Publish.stepsText4b")]}
              image={StepImage4}
              buttonStep={t("Publish.stepsButton")}
              width={440}
            />
            <StepContent
              step={5}
              color="purple"
              title={t("Publish.stepsSubtitle5")}
              texts={[t("Publish.stepsText5a"), t("Publish.stepsText5b")]}
              image={StepImage5}
              width={440}
            />
            <StepContent
              step={6}
              color="purple"
              title={t("Publish.stepsSubtitle6")}
              texts={[t("Publish.stepsText6a"), t("Publish.stepsText6b")]}
              image={StepImage6}
              dottedLine
              width={336}
            />
          </div>
        </Section>
      </div>

      <div ref={refFaq} className="relative">
        {/* HELP */}
        <Section>
          <div className="fr-container">
            <div className="max-w-[720px] mb-10 lg:mb-20 mx-auto">
              <Title2 smallMb>{t("StaticPages.helpTitle")}</Title2>
              <p className="!text-chapo md:text-center !mb-0">{t("Publish.helpSubtitle")}</p>
            </div>
            <div className="flex flex-col lg:flex-row lg:items-stretch gap-4 lg:gap-10">
              <Card
                image={HelpIcon1}
                title={t("Publish.helpTileTitle1")}
                link="https://airtable.com/apprWwZNoI1g4g6W4/shrrkFuyeG0BpKKT7?&prefill_Provenance=page-r%C3%A9dac&hide_Provenance=true"
              >
                <p className="!mb-0">{t("Publish.helpTileText1")}</p>
              </Card>

              <Card image={HelpIcon2} title={t("Publish.helpTileTitle2")} link="https://help.refugies.info/fr/">
                <p className="!mb-0">{t("Publish.helpTileText2")}</p>
              </Card>

              <Card
                image={HelpIcon3}
                title={t("StaticPages.helpTileTitle3")}
                onClick={() => window.$crisp.push(["do", "chat:open"])}
              >
                <p className="!mb-0">{t("StaticPages.helpTileText3")}</p>
              </Card>
            </div>
          </div>
        </Section>

        {/* FIGURES */}
        <div className={cls(styles.section, styles.bg_red)}>
          <Container className={cls(styles.container, "text-center")}>
            <h2 className={cls(styles.title2, styles.white, "text-center")}>{t("Publish.figuresTitle")}</h2>
            <Row>
              <Col sm="12" lg="4">
                <CountUpFigure number={props.nbFiches} text={t("Publish.figuresSubtitle1")} />
              </Col>
              <Col sm="12" lg="4">
                <CountUpFigure number={props.nbStructures} text={t("Publish.figuresSubtitle2")} />
              </Col>
              <Col sm="12" lg="4">
                <CountUpFigure number={props.nbVues} text={t("Publish.figuresSubtitle3")} />
              </Col>
            </Row>
          </Container>
        </div>

        {/* FAQ */}
        <Section className="relative">
          <span id="faq" className={styles.anchor}></span>
          <div className="fr-container max-w-">
            <Title2>{t("StaticPages.faqTitle")}</Title2>
            <div className="max-w-[720px] mx-auto">
              <Accordion
                items={[
                  { title: t("Publish.faqAccordionTitle1"), text: t("Publish.faqAccordionText1") },
                  { title: t("Publish.faqAccordionTitle2"), text: t("Publish.faqAccordionText2") },
                  { title: t("Publish.faqAccordionTitle3"), text: t("Publish.faqAccordionText3") },
                  { title: t("Publish.faqAccordionTitle4"), text: t("Publish.faqAccordionText4") },
                  { title: t("Publish.faqAccordionTitle5"), text: t("Publish.faqAccordionText5") },
                ]}
                multiOpen
              />
            </div>
            <div className="mt-10 lg:mt-20 text-center">
              <Button
                priority="tertiary no outline"
                linkProps={{
                  href: "https://help.refugies.info/fr/",
                }}
                iconId="fr-icon-arrow-right-line"
                iconPosition="right"
                size="large"
              >
                {t("Publish.faqCTA")}
              </Button>
            </div>
          </div>
        </Section>
      </div>

      {/* REGISTER */}
      <div ref={refRegister} className={cls(styles.section, styles.bg_grey)}>
        <span id="register" className={styles.anchor}></span>
        <Register
          onClickLoggedIn={toggleWriteModal}
          subtitleForm={t("Publish.registerSubtitle")}
          subtitleLoggedIn={t("Publish.registerLoggedIn")}
          btnLoggedIn={t("Publish.navbarItem5")}
          subtitleMobile={t("Publish.registerMobile")}
          associatedRole={RoleName.CONTRIB}
        />
      </div>

      <WriteContentModal show={showWriteModal} close={() => setShowWriteModal(false)} />
    </div>
  );
};

export const getStaticProps = wrapper.getStaticProps((store) => async ({ locale }) => {
  const dispStatistics = await API.getDispositifsStatistics({
    facets: ["nbVues", "nbVuesMobile", "nbDispositifs", "nbDemarches"],
  });
  const structStatistics = await API.getStructuresStatistics({ facets: ["nbStructures"] });

  return {
    props: {
      ...(await serverSideTranslations(getLanguageFromLocale(locale), ["common"])),
      nbVues: (dispStatistics.nbVues || 0) + (dispStatistics.nbVuesMobile || 0),
      nbFiches: (dispStatistics.nbDispositifs || 0) + (dispStatistics.nbDemarches || 0),
      nbStructures: structStatistics.nbStructures,
    },
    revalidate: 60,
  };
});

export default RecensezVotreAction;
