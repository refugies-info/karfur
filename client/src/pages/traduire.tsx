import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Col, Container, Row } from "reactstrap";
import { useInView, InView } from "react-intersection-observer";
import { colors } from "colors";
import { wrapper } from "services/configureStore";
import { getLanguageFromLocale } from "lib/getLanguageFromLocale";
import { cls } from "lib/classname";
import useWindowSize from "hooks/useWindowSize";
import API from "utils/API";
import { getPath } from "routes";
import SEO from "components/Seo";
import SecondaryNavbar from "components/Pages/publier/SecondaryNavbar";
import Card from "components/Pages/publier/Card";
import StepContent from "components/Pages/publier/StepContent";
import Accordion from "components/Pages/publier/Accordion";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import InlineLink from "components/Pages/publier/InlineLink";
import Register from "components/Pages/publier/Register";
import WriteContentModal from "components/Modals/WriteContentModal/WriteContentModal";
import WhoIcon3 from "assets/staticPages/traduire/who-icon-3.svg";
import HelpIcon1 from "assets/staticPages/traduire/help-icon-tutoriel.svg";
import HelpIcon2 from "assets/staticPages/publier/help-icon-crisp.svg";
import StepImage5 from "assets/staticPages/publier/step-image-5.png";
import MockupsRIMobile from "assets/staticPages/traduire/mockupMobileRI.png";
import commonStyles from "scss/components/staticPages.module.scss";
import styles from "scss/pages/traduire.module.scss";
import { size } from "lodash";
import LanguageIcon from "components/Pages/traduire/LanguageIcon";
import AutoplayVideo from "components/Pages/staticPages/AutoplayVideo";

export type View = "who" | "steps" | "next" | "faq" | "register";

interface Props {}

const RecensezVotreAction = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { isTablet } = useWindowSize();

  // write modal
  const [showWriteModal, setShowWriteModal] = useState(false);

  const toggleWriteModal = useCallback(() => {
    setShowWriteModal((o) => !o);
    if (router.query.write === "show") {
      router.replace({ pathname: getPath("/publier", router.locale) }, undefined, { shallow: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setShowWriteModal, router.query.write]);

  useEffect(() => {
    if (router.query.write === "show" && !showWriteModal) {
      setShowWriteModal(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.write]);

  // active links
  const [activeView, setActiveView] = useState<View | null>(null);
  const [refHero, inViewHero] = useInView({ threshold: 0 });
  const [refWho, inViewWho] = useInView({ threshold: 0.5 });
  const [refSteps, inViewSteps] = useInView();
  const [refNext, inViewNext] = useInView({ threshold: 0.5 });
  const [refFaq, inViewFaq] = useInView({ threshold: 0.5 });
  const [refRegister, inViewRegister] = useInView({ threshold: 0.5 });

  useEffect(() => {
    const views: { inView: boolean; id: View }[] = [
      { inView: inViewWho, id: "who" },
      { inView: inViewNext, id: "next" },
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
  }, [inViewWho, inViewNext, inViewSteps, inViewFaq, inViewRegister]);

  return (
    <div className={commonStyles.main}>
      <SEO title={t("Translate.title")} />

      <div ref={refHero} className={cls(commonStyles.section, commonStyles.bg_blue)}>
        <Container className={commonStyles.container}>
          <Row className={styles.hero}>
            <Col sm="12" lg="6" className={styles.hero_title}>
              <h1>{t("Translate.title")}</h1>
              <p className={commonStyles.subtitle}>{t("Translate.subtitle")}</p>

              <div className={styles.arrow}>
                <Link href="#who">
                  <a className={styles.arrow_btn}>
                    <EVAIcon name="arrow-downward-outline" size={24} fill={colors.bleuCharte} />
                  </a>
                </Link>
              </div>
            </Col>
            <Col sm="12" lg="6">
              <Image src={MockupsRIMobile} alt="" />
            </Col>
          </Row>
        </Container>
      </div>

      <SecondaryNavbar
        leftLinks={[
          { id: "who", color: "green", text: t("Translate.navbarItem1") },
          { id: "steps", color: "purple", text: t("Translate.navbarItem2") },
          { id: "next", color: "orange", text: t("Translate.navbarItem3") },
          { id: "faq", color: "red", text: t("Translate.navbarItem4") }
        ]}
        rightLink={{
          id: "register",
          color: "blue",
          text: t("Translate.navbarItem5")
        }}
        activeView={activeView}
        isSticky={!inViewHero}
      />

      <div ref={refWho} className={cls(commonStyles.section)}>
        <span id="why" className={commonStyles.anchor}></span>
        <Container className={commonStyles.container}>
          <h2 className={cls(commonStyles.title2, "mb-0")}>{t("Translate.whoTitle")}</h2>
          <p className={commonStyles.subtitle}>{t("Translate.whoSubtitle")}</p>

          <Row className={styles.who}>
            <Col sm="12" lg="4" className="mb-lg-0 mb-5">
              <Card
                header={
                  <>
                    <LanguageIcon language="ua" size={40} />
                    <LanguageIcon language="ir" size={40} />
                    <LanguageIcon language="sa" size={40} />
                    <LanguageIcon language="gb" size={40} />
                    <LanguageIcon language="af" size={40} />
                    <LanguageIcon language="ru" size={40} />
                    <LanguageIcon language="er" size={40} />
                  </>
                }
                title={t("Translate.whoCardTitle1")}
                greyBackground
              >
                <p className="mb-0">{t("Translate.whoCardText1")}</p>
              </Card>
            </Col>
            <Col sm="12" lg="4" className="mb-lg-0 mb-5">
              <Card
                header={<LanguageIcon language="fr" size={56} />}
                title={t("Translate.whoCardTitle2")}
                greyBackground
              >
                <p className="mb-0">{t("Translate.whoCardText2")}</p>
              </Card>
            </Col>
            <Col sm="12" lg="4" className="mb-lg-0 mb-5">
              <Card image={WhoIcon3} title={t("Translate.whoCardTitle3")} greyBackground>
                <p className="mb-0">{t("Translate.whoCardText3")}</p>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <div className={cls(commonStyles.section, commonStyles.bg_green)}>
        <Container className={commonStyles.container}>
          <h2 className={cls(commonStyles.title2, "text-center")}>{t("Translate.needTitle")}</h2>
        </Container>
      </div>

      <div ref={refSteps} className={cls(commonStyles.section)}>
        <span id="steps" className={commonStyles.anchor}></span>
        <Container className={commonStyles.container}>
          <h2 className={commonStyles.title2}>{t("Translate.stepsTitle")}</h2>
          <div className={styles.warning_mobile}>
            <EVAIcon name="alert-circle-outline" size={24} fill="black" />
            <p>{t("Translate.stepsWarningMobile")}</p>
          </div>
          <StepContent
            step={1}
            color="purple"
            title={t("Translate.stepsSubtitle1")}
            texts={[t("Translate.stepsText1")]}
            cta={{ text: t("Translate.stepsCTA1"), link: "#register" }}
            video="/video/publier-video-step1.mp4"
          />
          <StepContent
            step={2}
            color="purple"
            title={t("Translate.stepsSubtitle2")}
            texts={[t("Translate.stepsText2")]}
            video="/video/translate-video-step2.mp4"
          />
          <StepContent
            step={3}
            color="purple"
            title={t("Translate.stepsSubtitle3")}
            texts={[t("Translate.stepsText3")]}
            video="/video/translate-video-step3.mp4"
            footer={
              <div className={styles.warning}>
                <ul className="mb-0">
                  <li className="mb-2">{t("Translate.stepsList3Item1")}</li>
                  <li className="mb-2">{t("Translate.stepsList3Item2")}</li>
                  <li>{t("Translate.stepsList3Item3")}</li>
                </ul>
              </div>
            }
          />
          <StepContent
            step={4}
            color="purple"
            title={t("Translate.stepsSubtitle4")}
            texts={[t("Translate.stepsText4a"), t("Translate.stepsText4b")]}
            image={StepImage5}
            buttonStep={t("Translate.stepsButton")}
            buttonStepEnd
          />
        </Container>
      </div>

      <div ref={refNext} className={cls(commonStyles.section, commonStyles.bg_orange)}>
        <span id="next" className={commonStyles.anchor}></span>
        <Container className={cls(commonStyles.container, styles.next)}>
          <Row>
            <Col lg="6" sm="12">
              <h2 className={cls(commonStyles.title2)}>{t("Translate.nextTitle")}</h2>
              <p>{t("Translate.nextText1")}</p>
              <p>{t("Translate.nextText2")}</p>
            </Col>
            <Col lg="6" sm="12" className="text-right">
              <AutoplayVideo src="/video/translate-video-next.mp4" height={320} />
            </Col>
          </Row>
        </Container>
      </div>

      <div className={cls(commonStyles.section, commonStyles.bg_grey)}>
        <Container className={commonStyles.container}>
          <h2 className={cls(commonStyles.title2, commonStyles.center, "mb-0")}>{t("StaticPages.helpTitle")}</h2>
          <Row className={styles.help}>
            <Col sm="12" lg={{ size: "4", offset: "2" }} className="mb-lg-0 mb-5">
              <Card
                image={HelpIcon1}
                title={t("Translate.helpTileTitle1")}
                footer={
                  <InlineLink link="https://help.refugies.info/fr/" text={t("Translate.helpTileCTA1")} color="red" />
                }
              >
                <p>{t("Translate.helpTileText1")}</p>
              </Card>
            </Col>
            <Col sm="12" lg={{ size: "4" }} className="mb-lg-0 mb-5">
              <Card
                image={HelpIcon2}
                title={t("StaticPages.helpTileTitle3")}
                footer={
                  <InlineLink
                    link="#"
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

      <div ref={refFaq} className={cls(commonStyles.section)}>
        <span id="faq" className={commonStyles.anchor}></span>
        <Container className={cls(commonStyles.container, styles.faq)}>
          <h2 className={cls(commonStyles.title2, "text-center")}>{t("StaticPages.faqTitle")}</h2>

          <Accordion
            items={[
              { title: t("Translate.faqAccordionTitle1"), text: t("Translate.faqAccordionText1") },
              { title: t("Translate.faqAccordionTitle2"), text: t("Translate.faqAccordionText2") },
              { title: t("Translate.faqAccordionTitle3"), text: t("Translate.faqAccordionText3") },
              {
                title: t("Translate.faqAccordionTitle4"),
                text: t("Translate.faqAccordionText4"),
                cta: { text: t("Translate.faqAccordionCTA4"), link: "https://airtable.com/shrQxPHedgZ5PuXot" }
              }
            ]}
            multiOpen
          />
        </Container>
      </div>

      <div ref={refRegister} className={cls(commonStyles.section, commonStyles.bg_grey)}>
        <span id="register" className={commonStyles.anchor}></span>
        <Register
          toggleWriteModal={toggleWriteModal}
          subtitleForm={t("Translate.registerSubtitle")}
          subtitleLoggedIn={t("Translate.registerLoggedIn")}
          subtitleMobile={t("Translate.registerMobile")}
        />
      </div>

      <WriteContentModal show={showWriteModal} toggle={toggleWriteModal} />
    </div>
  );
};

export const getStaticProps = wrapper.getStaticProps((store) => async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(getLanguageFromLocale(locale), ["common"]))
    },
    revalidate: 60
  };
});

export default RecensezVotreAction;
