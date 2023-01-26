import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Col, Container, Row } from "reactstrap";
import { useInView } from "react-intersection-observer";
import { wrapper } from "services/configureStore";
import { getLanguageFromLocale } from "lib/getLanguageFromLocale";
import { cls } from "lib/classname";
import useWindowSize from "hooks/useWindowSize";
import API from "utils/API";
import SEO from "components/Seo";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import {
  Accordion,
  SecondaryNavbar,
  Card,
  StepContent,
  InlineLink,
  Register,
  HeroArrow,
  CountUpFigure
} from "components/Pages/staticPages/common";
import { TestimonySlider, CardExample } from "components/Pages/staticPages/publier";
import WriteContentModal from "components/Modals/WriteContentModal/WriteContentModal";
import WhyImage1 from "assets/staticPages/publier/why-image-1.png";
import WhyImage4 from "assets/staticPages/publier/why-image-4.png";
import HelpIcon1 from "assets/staticPages/publier/help-icon-visio.svg";
import HelpIcon2 from "assets/staticPages/publier/help-icon-tutoriel.svg";
import HelpIcon3 from "assets/staticPages/publier/help-icon-crisp.svg";
import TestimonyLogo1 from "assets/staticPages/publier/testimony-icon-1.png";
import TestimonyLogo2 from "assets/staticPages/publier/testimony-icon-2.png";
import TestimonyLogo3 from "assets/staticPages/publier/testimony-icon-3.png";
import RequiredIcon1 from "assets/staticPages/publier/required-icon-1.png";
import RequiredIcon2 from "assets/staticPages/publier/required-icon-2.png";
import RequiredIcon3 from "assets/staticPages/publier/required-icon-3.png";
import StepImage4 from "assets/staticPages/publier/step-image-4.svg";
import StepImage5 from "assets/staticPages/publier/step-image-5.png";
import StepImage6 from "assets/staticPages/publier/step-image-6.svg";
import MockupsRI from "assets/staticPages/publier/mockups-ri.png";
import MockupsRIMobile from "assets/staticPages/publier/mockups-ri-mobile.png";
import styles from "scss/components/staticPages.module.scss";

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
      { inView: inViewRegister, id: "register" }
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
      <div ref={refHero} className={cls(styles.section, styles.bg_blue, "mb-4")}>
        <Container className={styles.container}>
          <Row className={styles.hero}>
            <Col sm="12" lg="6" className={styles.hero_title}>
              <h1 className="text-white">{t("Publish.title")}</h1>
              <p className={styles.subtitle}>{t("Publish.subtitle")}</p>
              <HeroArrow target="why" />
            </Col>
            {!isTablet && (
              <Col sm="12" lg="6">
                <Image src={MockupsRI} alt="" style={{ maxWidth: "100%", height: "auto" }} />
              </Col>
            )}
          </Row>
        </Container>
        {isTablet && (
          <div className={styles.hero_image}>
            <Image src={MockupsRIMobile} alt="" style={{ maxWidth: "100%", height: "auto" }} />
          </div>
        )}
      </div>

      <SecondaryNavbar
        leftLinks={[
          { id: "why", color: "green", text: t("Publish.navbarItem1") },
          { id: "required", color: "purple", text: t("Publish.navbarItem2") },
          { id: "steps", color: "orange", text: t("Publish.navbarItem3") },
          { id: "faq", color: "red", text: t("Publish.navbarItem4") }
        ]}
        rightLink={{
          id: "register",
          color: "blue",
          text: t("Publish.navbarItem5")
        }}
        activeView={activeView}
        isSticky={!inViewHero}
      />

      <div ref={refWhy} className={styles.scrollspy_section}>
        <span id="why" className={styles.anchor}></span>
        {/* WHY */}
        <div className={cls(styles.section)}>
          <Container className={styles.container}>
            <h2 className={styles.title2}>{t("Publish.whyTitle")}</h2>
            <Accordion
              items={[
                { title: t("Publish.whyAccordionTitle1"), text: t("Publish.whyAccordionText1"), image: WhyImage1 },
                {
                  title: t("Publish.whyAccordionTitle2"),
                  text: t("Publish.whyAccordionText2"),
                  video: "/video/publier-video-why2.mp4",
                  mediaWidth: 217,
                  mediaHeight: 442,
                  className: styles.video2
                },
                {
                  title: t("Publish.whyAccordionTitle3"),
                  text: t("Publish.whyAccordionText3"),
                  video: "/video/publier-video-why3.mp4",
                  mediaWidth: 350,
                  noShadow: true
                },
                { title: t("Publish.whyAccordionTitle4"), text: t("Publish.whyAccordionText4"), image: WhyImage4 }
              ]}
              withImages
              initOpen
              multiOpen={!!isTablet}
              mediaAlign="center"
            />
          </Container>
        </div>

        {/* TESTIMONY */}
        <div className={cls(styles.section, styles.bg_green)}>
          <Container className={styles.container}>
            <TestimonySlider
              testimonies={[
                {
                  text: t("Publish.testimony1"),
                  image: TestimonyLogo1,
                  name: "Vincent Le Lann",
                  position: "Compagnons du Tour de France à Nantes"
                },
                {
                  text: t("Publish.testimony2"),
                  image: TestimonyLogo2,
                  name: "Rémi Crouzel",
                  position: "Mission Locale de Dijon & Conseiller IPeRACTIFS21"
                },
                {
                  text: t("Publish.testimony3"),
                  image: TestimonyLogo3,
                  name: "Paola Salazar",
                  position: "Directrice adjointe UniR"
                }
              ]}
            />
          </Container>
        </div>
      </div>

      {/* REQUIRED */}
      <div ref={refRequired} className={cls(styles.section, styles.bg_grey, styles.scrollspy_section)}>
        <span id="required" className={styles.anchor}></span>
        <Container className={styles.container}>
          <h2 className={cls(styles.title2, styles.center)}>{t("Publish.requiredTitle")}</h2>
          <Row>
            <Col sm="12" lg="4" className="mb-lg-0 mb-5">
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
            </Col>
            <Col sm="12" lg="4" className="mb-lg-0 mb-5">
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
            </Col>
            <Col sm="12" lg="4" className="mb-lg-0 mb-5">
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
            </Col>
          </Row>
          <div className={styles.link}>
            <InlineLink
              link="https://help.refugies.info/fr/article/charte-editoriale-comment-bien-rediger-une-fiche-1twbzhu/"
              text={t("Publish.requiredCTA")}
              color="purple"
            />
          </div>
        </Container>
      </div>

      <div ref={refSteps} className={styles.scrollspy_section}>
        <span id="steps" className={styles.anchor}></span>
        {/* STEPS */}
        <div className={cls(styles.section)}>
          <Container className={styles.container}>
            <h2 className={styles.title2}>{t("Publish.stepsTitle")}</h2>
            <div className={styles.warning_mobile}>
              <EVAIcon name="alert-circle-outline" size={24} fill="black" />
              <p>{t("Publish.stepsWarningMobile")}</p>
            </div>
            <StepContent
              step={1}
              color="orange"
              title={t("Publish.stepsSubtitle1")}
              texts={[t("Publish.stepsText1")]}
              cta={{ text: t("Publish.stepsCTA1"), link: "#register" }}
              video="/video/publier-video-step1.mp4"
            />
            <StepContent
              step={2}
              color="orange"
              title={t("Publish.stepsSubtitle2")}
              texts={[t("Publish.stepsText2a"), t("Publish.stepsText2b")]}
              cta={{
                text: t("Publish.stepsCTA2"),
                link: "https://help.refugies.info/fr/category/charte-editoriale-2fq3x7/"
              }}
              video="/video/publier-video-step2.mp4"
            />
            <StepContent
              step={3}
              color="orange"
              title={t("Publish.stepsSubtitle3")}
              texts={[t("Publish.stepsText3")]}
              video="/video/publier-video-step3.mp4"
              width={340}
              height={320}
            />
            <StepContent
              step={4}
              color="orange"
              title={t("Publish.stepsSubtitle4")}
              texts={[t("Publish.stepsText4a"), t("Publish.stepsText4b")]}
              image={StepImage4}
              buttonStep={t("Publish.stepsButton")}
            />
            <StepContent
              step={5}
              color="orange"
              title={t("Publish.stepsSubtitle5")}
              texts={[t("Publish.stepsText5a"), t("Publish.stepsText5b")]}
              image={StepImage5}
              height={415}
            />
            <StepContent
              step={6}
              color="orange"
              title={t("Publish.stepsSubtitle6")}
              texts={[t("Publish.stepsText6a"), t("Publish.stepsText6b")]}
              image={StepImage6}
              dottedLine
            />
          </Container>
        </div>
      </div>

      <div ref={refFaq} className={styles.scrollspy_section}>
        {/* HELP */}
        <div className={cls(styles.section, styles.bg_grey)}>
          <Container className={styles.container}>
            <h2 className={cls(styles.title2, styles.center, "mb-0")}>{t("StaticPages.helpTitle")}</h2>
            <p className={cls(styles.subtitle, styles.center)}>{t("Publish.helpSubtitle")}</p>
            <Row className={styles.top_space}>
              <Col sm="12" lg="4" className="mb-lg-0 mb-5">
                <Card
                  image={HelpIcon1}
                  title={t("Publish.helpTileTitle1")}
                  footer={
                    <InlineLink
                      link="https://airtable.com/shrrkFuyeG0BpKKT7"
                      text={t("Publish.helpTileCTA1")}
                      color="red"
                    />
                  }
                >
                  <p>{t("Publish.helpTileText1")}</p>
                </Card>
              </Col>
              <Col sm="12" lg="4" className="mb-lg-0 mb-5">
                <Card
                  image={HelpIcon2}
                  title={t("Publish.helpTileTitle2")}
                  footer={
                    <InlineLink link="https://help.refugies.info/fr/" text={t("Publish.helpTileCTA2")} color="red" />
                  }
                >
                  <p>{t("Publish.helpTileText2")}</p>
                </Card>
              </Col>
              <Col sm="12" lg="4" className="mb-lg-0 mb-5">
                <Card
                  image={HelpIcon3}
                  title={t("StaticPages.helpTileTitle3")}
                  footer={
                    <InlineLink
                      link="#"
                      type="button"
                      onClick={() => window.$crisp.push(["do", "chat:open"])}
                      text={t("StaticPages.helpTileCTA3")}
                      color="red"
                    />
                  }
                >
                  <p>{t("StaticPages.helpTileText3")}</p>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>

        {/* FIGURES */}
        <div className={cls(styles.section, styles.bg_red)}>
          <Container className={cls(styles.container, "text-center")}>
            <h2 className={cls(styles.title2, "text-center text-white")}>{t("Publish.figuresTitle")}</h2>
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
        <div className={cls(styles.section)}>
          <span id="faq" className={styles.anchor}></span>
          <Container className={cls(styles.container, styles.faq)}>
            <h2 className={cls(styles.title2, "text-center")}>{t("StaticPages.faqTitle")}</h2>
            <Accordion
              items={[
                { title: t("Publish.faqAccordionTitle1"), text: t("Publish.faqAccordionText1") },
                { title: t("Publish.faqAccordionTitle2"), text: t("Publish.faqAccordionText2") },
                { title: t("Publish.faqAccordionTitle3"), text: t("Publish.faqAccordionText3") },
                { title: t("Publish.faqAccordionTitle4"), text: t("Publish.faqAccordionText4") },
                { title: t("Publish.faqAccordionTitle5"), text: t("Publish.faqAccordionText5") }
              ]}
              multiOpen
            />
            <div className={styles.link}>
              <InlineLink link="https://help.refugies.info/fr/" text={t("Publish.faqCTA")} color="red" />
            </div>
          </Container>
        </div>
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
        />
      </div>

      <WriteContentModal show={showWriteModal} close={() => setShowWriteModal(false)} />
    </div>
  );
};

export const getStaticProps = wrapper.getStaticProps((store) => async ({ locale }) => {
  const dispStatistics = (
    await API.getDispositifsStatistics(["nbVues", "nbVuesMobile", "nbDispositifs", "nbDemarches"])
  ).data.data;
  const structStatistics = (await API.getStructuresStatistics(["nbStructures"])).data.data;

  return {
    props: {
      ...(await serverSideTranslations(getLanguageFromLocale(locale), ["common"])),
      nbVues: (dispStatistics.nbVues || 0) + (dispStatistics.nbVuesMobile || 0),
      nbFiches: (dispStatistics.nbDispositifs || 0) + (dispStatistics.nbDemarches || 0),
      nbStructures: structStatistics.nbStructures
    },
    revalidate: 60
  };
});

export default RecensezVotreAction;
