import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "next-i18next";
import Image from "next/legacy/image";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Col, Container, Row } from "reactstrap";
import { useInView } from "react-intersection-observer";
import { wrapper } from "services/configureStore";
import { getLanguageFromLocale } from "lib/getLanguageFromLocale";
import { cls } from "lib/classname";
import { TranslationStatistics } from "types/interface";
import API from "utils/API";
import SEO from "components/Seo";
import {
  Accordion,
  SecondaryNavbar,
  Card,
  StepContent,
  AutoplayVideo,
  InlineLink,
  Register,
  HeroArrow,
  LanguageIcon
} from "components/Pages/staticPages/common";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import LanguageCard from "components/Pages/staticPages/traduire/LanguageCard";
import WhoIcon3 from "assets/staticPages/traduire/who-icon-3.svg";
import HelpIcon1 from "assets/staticPages/traduire/help-icon-tutoriel.svg";
import HelpIcon2 from "assets/staticPages/publier/help-icon-crisp.svg";
import StepImage5 from "assets/staticPages/publier/step-image-5.png";
import MockupsRIMobile from "assets/staticPages/traduire/mockupMobileRI.png";
import styles from "scss/components/staticPages.module.scss";

export type View = "who" | "steps" | "next" | "faq" | "register";
export type NeedKey = "strong" | "medium" | "weak";
interface Props {
  translationStatistics: TranslationStatistics;
}

const RecensezVotreAction = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();

  // active links
  const [activeView, setActiveView] = useState<View | null>(null);
  const [refHero, inViewHero] = useInView({ threshold: 0 });
  const [refWho, inViewWho] = useInView({ threshold: 0.1 });
  const [refSteps, inViewSteps] = useInView({ threshold: 0.05 });
  const [refNext, inViewNext] = useInView({ threshold: 0.1 });
  const [refFaq, inViewFaq] = useInView({ threshold: 0.1 });
  const [refRegister, inViewRegister] = useInView({ threshold: 0.5 });

  useEffect(() => {
    const views: { inView: boolean; id: View }[] = [
      { inView: inViewWho, id: "who" },
      { inView: inViewSteps, id: "steps" },
      { inView: inViewNext, id: "next" },
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

  // stats
  const needKeys: NeedKey[] = ["strong", "medium", "weak"];
  const translationNeeds: Record<NeedKey, { languageId: string; count: number }[]> = useMemo(
    () => ({
      strong: props.translationStatistics?.nbActiveTranslators?.filter((item) => item.count <= 2) || [],
      medium:
        props.translationStatistics?.nbActiveTranslators?.filter((item) => item.count > 2 && item.count <= 5) || [],
      weak: props.translationStatistics?.nbActiveTranslators?.filter((item) => item.count > 5) || []
    }),
    [props]
  );

  const navigateToTranslations = useCallback(() => {
    router.push("/backend/user-translation");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.main}>
      <SEO title={t("Translate.title")} />

      {/* HERO */}
      <div ref={refHero} className={cls(styles.section, styles.bg_blue, "mb-4")}>
        <Container className={styles.container}>
          <Row className={styles.hero}>
            <Col sm="12" lg="6" className={styles.hero_title}>
              <h1 className="text-white">{t("Translate.title")}</h1>
              <p className={styles.subtitle}>
                {t("Translate.subtitle", {
                  nbBenevoles: props.translationStatistics?.nbTranslators || 0,
                  nbMots: new Intl.NumberFormat().format(props.translationStatistics?.nbWordsTranslated || 0)
                })}
              </p>
              <HeroArrow target="who" />
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
          { id: "steps", color: "orange", text: t("Translate.navbarItem2") },
          { id: "next", color: "purple", text: t("Translate.navbarItem3") },
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

      {/* WHO */}
      <div ref={refWho} className={styles.scrollspy_section}>
        <div className={cls(styles.section)}>
          <span id="who" className={styles.anchor}></span>
          <Container className={styles.container}>
            <h2 className={cls(styles.title2, "mb-0")}>{t("Translate.whoTitle")}</h2>
            <p className={styles.subtitle}>{t("Translate.whoSubtitle")}</p>
            <Row className={styles.top_space}>
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

        {/* NEED */}
        <div className={cls(styles.section, styles.bg_green)}>
          <Container className={cls(styles.container, styles.needs)}>
            <h2 className={cls(styles.title2, "text-center text-white")}>{t("Translate.needTitle")}</h2>
            <Row>
              {needKeys.map((needKey, i) => (
                <Col key={i} sm="12" lg="4">
                  {translationNeeds[needKey].map((item, i) => (
                    <LanguageCard key={i} languageId={item.languageId} need={needKey} />
                  ))}
                </Col>
              ))}
            </Row>
          </Container>
        </div>
      </div>

      {/* STEPS */}
      <div ref={refSteps} className={cls(styles.section)}>
        <span id="steps" className={styles.anchor}></span>
        <Container className={styles.container}>
          <h2 className={styles.title2}>{t("Translate.stepsTitle")}</h2>
          <div className={styles.warning_mobile}>
            <EVAIcon name="alert-circle-outline" size={24} fill="black" />
            <p>{t("Translate.stepsWarningMobile")}</p>
          </div>
          <StepContent
            step={1}
            color="orange"
            title={t("Translate.stepsSubtitle1")}
            texts={[t("Translate.stepsText1")]}
            cta={{ text: t("Translate.stepsCTA1"), link: "#register" }}
            video="/video/publier-video-step1.mp4"
          />
          <StepContent
            step={2}
            color="orange"
            title={t("Translate.stepsSubtitle2")}
            texts={[t("Translate.stepsText2")]}
            video="/video/translate-video-step2.mp4"
          />
          <StepContent
            step={3}
            color="orange"
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
            color="orange"
            title={t("Translate.stepsSubtitle4")}
            texts={[t("Translate.stepsText4a"), t("Translate.stepsText4b")]}
            image={StepImage5}
            height={415}
            buttonStep={t("Translate.stepsButton")}
            buttonStepEnd
          />
        </Container>
      </div>

      {/* NEXT */}
      <div ref={refNext} className={styles.scrollspy_section}>
        <div className={cls(styles.section, styles.bg_purple)}>
          <span id="next" className={styles.anchor}></span>
          <Container className={cls(styles.container)}>
            <Row>
              <Col lg="6" sm="12">
                <h2 className={cls(styles.title2, styles.bottom_space, "mb-0 text-white")}>
                  {t("Translate.nextTitle")}
                </h2>
                <p className={cls(styles.p, styles.bottom_space)}>{t("Translate.nextText1")}</p>
                <p className={styles.p}>{t("Translate.nextText2")}</p>
              </Col>
              <Col lg="6" sm="12" className="text-end">
                <AutoplayVideo src="/video/translate-video-next.mp4" height={320} />
              </Col>
            </Row>
          </Container>
        </div>

        {/* HELP */}
        <div className={cls(styles.section, styles.bg_grey)}>
          <Container className={styles.container}>
            <h2 className={cls(styles.title2, styles.center, "mb-0")}>{t("StaticPages.helpTitle")}</h2>
            <Row className={cls(styles.top_space, "justify-content-center")}>
              <Col sm="12" lg="4" className="mb-lg-0 mb-5">
                <Card
                  image={HelpIcon1}
                  title={t("Translate.helpTileTitle1")}
                  footer={
                    <InlineLink
                      link="https://help.refugies.info/fr/category/traduire-1dvep4w/"
                      text={t("Translate.helpTileCTA1")}
                      color="red"
                    />
                  }
                >
                  <p>{t("Translate.helpTileText1")}</p>
                </Card>
              </Col>
              <Col sm="12" lg="4" className="mb-lg-0 mb-5">
                <Card
                  image={HelpIcon2}
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
      </div>

      {/* FAQ */}
      <div ref={refFaq} className={cls(styles.section)}>
        <span id="faq" className={styles.anchor}></span>
        <Container className={cls(styles.container, styles.faq)}>
          <h2 className={cls(styles.title2, "text-center")}>{t("StaticPages.faqTitle")}</h2>
          <Accordion
            items={[
              { title: t("Translate.faqAccordionTitle1"), text: t("Translate.faqAccordionText1") },
              { title: t("Translate.faqAccordionTitle2"), text: t("Translate.faqAccordionText2") },
              { title: t("Translate.faqAccordionTitle3"), text: t("Translate.faqAccordionText3") },
              { title: t("Translate.faqAccordionTitle4"), text: t("Translate.faqAccordionText4") },
              {
                title: t("Translate.faqAccordionTitle5"),
                text: t("Translate.faqAccordionText5"),
                cta: { text: t("Translate.faqAccordionCTA5"), link: "https://airtable.com/shrQxPHedgZ5PuXot" }
              }
            ]}
            multiOpen
          />
        </Container>
      </div>

      {/* REGISTER */}
      <div ref={refRegister} className={cls(styles.section, styles.bg_grey)}>
        <span id="register" className={styles.anchor}></span>
        <Register
          onClickLoggedIn={navigateToTranslations}
          subtitleForm={t("Translate.registerSubtitle")}
          subtitleLoggedIn={t("Translate.registerLoggedIn")}
          btnLoggedIn={t("Translate.registerBtnLoggedIn")}
          subtitleMobile={t("Translate.registerMobile")}
        />
      </div>
    </div>
  );
};

export const getStaticProps = wrapper.getStaticProps((store) => async ({ locale }) => {
  const translationStatistics = (
    await API.getTranslationStatistics(["nbTranslators", "nbWordsTranslated", "nbActiveTranslators"])
  ).data.data;

  return {
    props: {
      ...(await serverSideTranslations(getLanguageFromLocale(locale), ["common"])),
      translationStatistics
    },
    revalidate: 60
  };
});

export default RecensezVotreAction;
