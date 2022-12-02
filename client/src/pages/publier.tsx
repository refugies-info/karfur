import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import Image from "next/image";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Col, Container, Row } from "reactstrap";
import CountUp from "react-countup";
import { useInView, InView } from "react-intersection-observer";
import { colors } from "colors";
import { wrapper } from "services/configureStore";
import { getLanguageFromLocale } from "lib/getLanguageFromLocale";
import { cls } from "lib/classname";
import useWindowSize from "hooks/useWindowSize";
import API from "utils/API";
import SEO from "components/Seo";
import SecondaryNavbar from "components/Pages/publier/SecondaryNavbar";
import TestimonyAuthor from "components/Pages/publier/TestimonyAuthor";
import Card from "components/Pages/publier/Card";
import StepContent from "components/Pages/publier/StepContent";
import Accordion from "components/Pages/publier/Accordion";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import CardExample from "components/Pages/publier/CardExample";
import InlineLink from "components/Pages/publier/InlineLink";
import Register from "components/Pages/publier/Register";
import WhyImage1 from "assets/publier/why-image-1.png";
import WhyImage2 from "assets/publier/why-image-2.png";
import WhyImage3 from "assets/publier/why-image-3.png";
import WhyImage4 from "assets/publier/why-image-4.png";
import TestimonyLogo1 from "assets/publier/testimony-icon-1.png";
import TestimonyLogo2 from "assets/publier/testimony-icon-2.png";
import TestimonyLogo3 from "assets/publier/testimony-icon-3.png";
import HelpIcon1 from "assets/publier/help-icon-visio.svg";
import HelpIcon2 from "assets/publier/help-icon-tutoriel.svg";
import HelpIcon3 from "assets/publier/help-icon-crisp.svg";
import RequiredIcon1 from "assets/publier/required-icon-1.png";
import RequiredIcon2 from "assets/publier/required-icon-2.png";
import RequiredIcon3 from "assets/publier/required-icon-3.png";
import StepImage4 from "assets/publier/step-image-4.svg";
import StepImage5 from "assets/publier/step-image-5.png";
import StepImage6 from "assets/publier/step-image-6.svg";
import MockupsRI from "assets/publier/mockups-ri.png";
import MockupsRIMobile from "assets/publier/mockups-ri-mobile.png";
import commonStyles from "scss/components/staticPages.module.scss";
import styles from "scss/pages/publier.module.scss";

export type View = "why" | "required" | "steps" | "faq" | "register";

interface Props {
  nbVues: number;
  nbFiches: number;
  nbStructures: number;
}

const RecensezVotreAction = (props: Props) => {
  const { t } = useTranslation();
  const { isTablet } = useWindowSize();

  const [activeView, setActiveView] = useState<View | null>(null);
  const [refWhy, inViewWhy] = useInView();
  const [refRequired, inViewRequired] = useInView();
  const [refSteps, inViewSteps] = useInView();
  const [refFaq, inViewFaq] = useInView();
  const [refRegister, inViewRegister] = useInView();

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
    <div className={commonStyles.main}>
      <SEO title="Recensez votre action" />

      <div className={cls(commonStyles.section, commonStyles.bg_blue)}>
        <Container className={commonStyles.container}>
          <Row className={styles.hero}>
            <Col sm="12" lg="6" className={styles.hero_title}>
              <h1>{t("Publish.title")}</h1>
              <p className={commonStyles.subtitle}>{t("Publish.subtitle")}</p>

              <div className={styles.arrow}>
                <Link href="#why">
                  <a className={styles.arrow_btn}>
                    <EVAIcon name="arrow-downward-outline" size={24} fill={colors.bleuCharte} />
                  </a>
                </Link>
              </div>
            </Col>
            {!isTablet && (
              <Col sm="12" lg="6">
                <Image src={MockupsRI} alt="" />
              </Col>
            )}
          </Row>
        </Container>
        {isTablet && (
          <div className={styles.hero_image}>
            <Image src={MockupsRIMobile} alt="" />
          </div>
        )}
      </div>

      <SecondaryNavbar activeView={activeView} />

      <div id="why" ref={refWhy} className={cls(commonStyles.section)}>
        <Container className={commonStyles.container}>
          <h2 className={commonStyles.title2}>{t("Publish.whyYitle")}</h2>

          <Accordion
            items={[
              { title: t("Publish.whyAccordionTitle1"), text: t("Publish.whyAccordionText1"), image: WhyImage1 },
              { title: t("Publish.whyAccordionTitle2"), text: t("Publish.whyAccordionText2"), image: WhyImage2 },
              { title: t("Publish.whyAccordionTitle3"), text: t("Publish.whyAccordionText3"), image: WhyImage3 },
              { title: t("Publish.whyAccordionTitle4"), text: t("Publish.whyAccordionText4"), image: WhyImage4 }
            ]}
            withImages
            initOpen
            multiOpen={!!isTablet}
          />
        </Container>
      </div>

      <div className={cls(commonStyles.section, commonStyles.bg_green)}>
        <Container className={commonStyles.container}>
          <Row>
            <Col className={styles.testimony}>
              <p>{t("Publish.testimony1")}</p>
              <TestimonyAuthor
                image={TestimonyLogo1}
                name="Vincent Le Lann"
                position="Compagnons du Tour de France à Nantes"
              />
            </Col>
            <Col className={styles.testimony}>
              <p>{t("Publish.testimony2")}</p>
              <TestimonyAuthor
                image={TestimonyLogo2}
                name="Rémi Crouzel"
                position="Mission Locale de Dijon & Conseiller IPeRACTIFS21"
              />
            </Col>
            <Col className={styles.testimony}>
              <p>{t("Publish.testimony3")}</p>
              <TestimonyAuthor image={TestimonyLogo3} name="??" position="Responsable de la structure Uni’R" />
            </Col>
          </Row>
        </Container>
      </div>

      <div id="required" ref={refRequired} className={cls(commonStyles.section, commonStyles.bg_grey)}>
        <Container className={commonStyles.container}>
          <h2 className={cls(commonStyles.title2, commonStyles.center)}>{t("Publish.requiredTitle")}</h2>
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
          <div className={commonStyles.link}>
            <InlineLink
              link="https://help.refugies.info/fr/article/charte-editoriale-comment-bien-rediger-une-fiche-1twbzhu/"
              text={t("Publish.requiredCTA")}
              color="purple"
            />
          </div>
        </Container>
      </div>

      <div id="steps" ref={refSteps} className={cls(commonStyles.section)}>
        <Container className={commonStyles.container}>
          <h2 className={commonStyles.title2}>{t("Publish.stepsTitle")}</h2>
          <div className={styles.warning}>
            <EVAIcon name="alert-circle-outline" size={24} fill="black" />
            <p>{t("Publish.stepsWarningMobile")}</p>
          </div>
          <StepContent
            step={1}
            title={t("Publish.stepsSubtitle1")}
            texts={[t("Publish.stepsText1")]}
            cta={{ text: t("Publish.stepsCTA1"), link: "#register" }}
            video="/video/video-1.mp4"
          />
          <StepContent
            step={2}
            title={t("Publish.stepsSubtitle2")}
            texts={[t("Publish.stepsText2a"), t("Publish.stepsText2b")]}
            cta={{ text: t("Publish.stepsCTA2"), link: "#" }}
            video="/video/video-2.mp4"
          />
          <StepContent
            step={3}
            title={t("Publish.stepsSubtitle3")}
            texts={[t("Publish.stepsText3")]}
            video="/video/video-3.mp4"
          />
          <StepContent
            step={4}
            title={t("Publish.stepsSubtitle4")}
            texts={[t("Publish.stepsText4a"), t("Publish.stepsText4b")]}
            image={StepImage4}
            buttonStep={t("Publish.stepsButton")}
          />
          <StepContent
            step={5}
            title={t("Publish.stepsSubtitle5")}
            texts={[t("Publish.stepsText5a"), t("Publish.stepsText5b")]}
            image={StepImage5}
            height={415}
          />
          <StepContent
            step={6}
            title={t("Publish.stepsSubtitle6")}
            texts={[t("Publish.stepsText6a"), t("Publish.stepsText6b"), t("Publish.stepsText6c")]}
            image={StepImage6}
            dottedLine
          />
        </Container>
      </div>

      <div className={cls(commonStyles.section, commonStyles.bg_grey)}>
        <Container className={commonStyles.container}>
          <h2 className={cls(commonStyles.title2, commonStyles.center, "mb-0")}>{t("Publish.helpTitle")}</h2>
          <p className={cls(commonStyles.subtitle, commonStyles.center)}>{t("Publish.helpSubtitle")}</p>
          <Row className={styles.help}>
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
                  <InlineLink link="https://help.refugies.info/fr/" text={t("Publish.helpTileCTA1")} color="red" />
                }
              >
                <p>{t("Publish.helpTileText2")}</p>
              </Card>
            </Col>
            <Col sm="12" lg="4" className="mb-lg-0 mb-5">
              <Card
                image={HelpIcon3}
                title={t("Publish.helpTileTitle3")}
                footer={<InlineLink link="#" text={t("Publish.helpTileCTA1")} color="red" />}
              >
                <p>{t("Publish.helpTileText3")}</p>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <div className={cls(commonStyles.section, commonStyles.bg_red)}>
        <Container className={cls(commonStyles.container, styles.figures)}>
          <h2 className={cls(commonStyles.title2, "text-center")}>{t("Publish.figuresTitle")}</h2>
          <Row>
            <Col sm="12" lg="4">
              <p className={styles.figure}>
                <InView>
                  {({ inView, ref }) => (
                    <div ref={ref}>{inView ? <CountUp end={props.nbFiches} separator=" " /> : 0}</div>
                  )}
                </InView>
              </p>
              <p className={styles.figure_label}>{t("Publish.figuresSubtitle1")}</p>
            </Col>
            <Col sm="12" lg="4">
              <p className={styles.figure}>
                <InView>
                  {({ inView, ref }) => (
                    <div ref={ref}>{inView ? <CountUp end={props.nbStructures} separator=" " /> : 0}</div>
                  )}
                </InView>
              </p>
              <p className={styles.figure_label}>{t("Publish.figuresSubtitle2")}</p>
            </Col>
            <Col sm="12" lg="4">
              <p className={styles.figure}>
                <InView>
                  {({ inView, ref }) => (
                    <div ref={ref}>{inView ? <CountUp end={props.nbVues} separator=" " /> : 0}</div>
                  )}
                </InView>
              </p>
              <p className={styles.figure_label}>{t("Publish.figuresSubtitle3")}</p>
            </Col>
          </Row>
        </Container>
      </div>

      <div id="faq" ref={refFaq} className={cls(commonStyles.section)}>
        <Container className={cls(commonStyles.container, styles.faq)}>
          <h2 className={cls(commonStyles.title2, "text-center")}>{t("Publish.faqTitle")}</h2>

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
          <div className={commonStyles.link}>
            <InlineLink link="https://help.refugies.info/fr/" text={t("Publish.faqCTA")} color="red" />
          </div>
        </Container>
      </div>

      <div id="register" ref={refRegister} className={cls(commonStyles.section, commonStyles.bg_grey)}>
        <Register />
      </div>
    </div>
  );
};

export const getStaticProps = wrapper.getStaticProps((store) => async ({ locale }) => {
  const dispStatistics = await API.getDispositifsStatistics().then((data) => data.data.data);
  const structStatistics = await API.getStructuresStatistics().then((data) => data.data.data);

  return {
    props: {
      ...(await serverSideTranslations(getLanguageFromLocale(locale), ["common"])),
      nbVues: dispStatistics.nbVues + dispStatistics.nbVuesMobile,
      nbFiches: dispStatistics.nbFiches,
      nbStructures: structStatistics.nbStructures
    },
    revalidate: 60
  };
});

export default RecensezVotreAction;
