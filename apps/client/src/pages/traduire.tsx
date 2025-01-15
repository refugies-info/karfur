import { RoleName, TranslationStatisticsResponse } from "@refugies-info/api-types";
import { logger } from "logger";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Col, Container, Row } from "reactstrap";
import WhoIcon1 from "~/assets/staticPages/common/card-icon-bubble.svg";
import CardIconCheck from "~/assets/staticPages/common/card-icon-check.svg";
import StepImage1 from "~/assets/staticPages/publier/step-image-1.png";
import StepImage4 from "~/assets/staticPages/publier/step-image-5.png";
import MockupRI from "~/assets/staticPages/traduire/mockup-ri.png";
import StepImage2 from "~/assets/staticPages/traduire/step-image-2.svg";
import StepImage3 from "~/assets/staticPages/traduire/step-image-3.png";
import WhoIcon3 from "~/assets/staticPages/traduire/who-icon-3.svg";
import {
  Accordion,
  Anchor,
  AutoplayVideo,
  Card,
  Hero,
  Register,
  RowCards,
  SecondaryNavbar,
  Section,
  SectionHead,
  StepContent,
  Title2,
} from "~/components/Pages/staticPages/common";
import LanguageCard from "~/components/Pages/staticPages/traduire/LanguageCard";
import SEO from "~/components/Seo";
import { cls } from "~/lib/classname";
import { getLanguageFromLocale } from "~/lib/getLanguageFromLocale";
import styles from "~/scss/components/staticPages.module.scss";
import { wrapper } from "~/services/configureStore";
import API from "~/utils/API";

export type View = "who" | "steps" | "next" | "faq" | "register";
export type NeedKey = "strong" | "medium" | "weak";
interface Props {
  translationStatistics: TranslationStatisticsResponse;
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
      { inView: inViewRegister, id: "register" },
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
      weak: props.translationStatistics?.nbActiveTranslators?.filter((item) => item.count > 5) || [],
    }),
    [props],
  );

  const navigateToTranslations = useCallback(() => {
    router.push("/backend/user-translation");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full">
      <SEO title={t("Translate.title")} />

      {/* HERO */}
      <Hero
        ref={refHero}
        title={t("Translate.title")}
        subtitle={t("Translate.subtitle", {
          nbBenevoles: props.translationStatistics?.nbTranslators || 0,
          nbMots: new Intl.NumberFormat().format(props.translationStatistics?.nbWordsTranslated || 0),
        })}
        buttonTitle={t("Translate.navbarItem5")}
        image={MockupRI}
        imageWidth={448}
      />

      <SecondaryNavbar
        leftLinks={[
          { id: "who", color: "green", text: t("Translate.navbarItem1") },
          { id: "steps", color: "orange", text: t("Translate.navbarItem2") },
          { id: "next", color: "purple", text: t("Translate.navbarItem3") },
          { id: "faq", color: "red", text: t("Translate.navbarItem4") },
        ]}
        rightLink={{
          id: "register",
          color: "blue",
          text: t("Translate.navbarItem5"),
        }}
        activeView={activeView}
        isSticky={!inViewHero}
      />

      {/* WHO */}
      <div ref={refWho} className="relative">
        <Section>
          <Anchor id="who" />
          <div className="fr-container">
            <SectionHead title={t("Translate.whoTitle")} subtitle={t("Translate.whoSubtitle")} />
            <RowCards>
              <Card image={WhoIcon1} title={t("Translate.whoCardTitle1")}>
                <p className="!mb-0">{t("Translate.whoCardText1")}</p>
              </Card>

              <Card image={CardIconCheck} title={t("Translate.whoCardTitle2")}>
                <p className="!mb-0">{t("Translate.whoCardText2")}</p>
              </Card>

              <Card image={WhoIcon3} title={t("Translate.whoCardTitle3")}>
                <p className="!mb-0">{t("Translate.whoCardText3")}</p>
              </Card>
            </RowCards>
          </div>
        </Section>

        {/* NEED */}
        <div className={cls(styles.section, styles.bg_green)}>
          <Container className={cls(styles.container, styles.needs)}>
            <h2 className={cls(styles.title2, styles.white, "text-center")}>{t("Translate.needTitle")}</h2>
            <Row>
              {needKeys.map((needKey, i) => (
                <Col key={i} sm="12" lg="4">
                  {translationNeeds[needKey].map((item, i) => (
                    <LanguageCard href="#register" key={i} languageId={item.languageId} need={needKey} />
                  ))}
                </Col>
              ))}
            </Row>
          </Container>
        </div>
      </div>

      {/* STEPS */}
      <div ref={refSteps} className="relative">
        <Anchor id="steps" />
        <Section className="bg-beige">
          <div className="fr-container">
            <Title2>{t("Translate.stepsTitle")}</Title2>
            <StepContent
              step={1}
              title={t("Translate.stepsSubtitle1")}
              texts={[t("Translate.stepsText1")]}
              cta={{ text: t("Translate.stepsCTA1"), link: "#register" }}
              image={StepImage1}
              width={440}
            />
            <StepContent
              step={2}
              title={t("Translate.stepsSubtitle2")}
              texts={[t("Translate.stepsText2")]}
              image={StepImage2}
              width={480}
            />
            <StepContent
              step={3}
              title={t("Translate.stepsSubtitle3")}
              texts={[
                t("Translate.stepsText3"),
                [t("Translate.stepsList3Item1"), t("Translate.stepsList3Item2"), t("Translate.stepsList3Item3")],
              ]}
              image={StepImage3}
              width={440}
            />
            <StepContent
              step={4}
              title={t("Translate.stepsSubtitle4")}
              texts={[t("Translate.stepsText4a"), t("Translate.stepsText4b")]}
              image={StepImage4}
              width={440}
              buttonStep={t("Translate.stepsButton")}
              buttonStepEnd
            />
          </div>
        </Section>
      </div>

      {/* NEXT */}
      <div ref={refNext} className="relative">
        <div className={cls(styles.section, styles.bg_purple)}>
          <span id="next" className={styles.anchor}></span>
          <Container className={cls(styles.container)}>
            <Row>
              <Col lg="6" sm="12">
                <h2 className={cls(styles.title2, styles.bottom_space, styles.white, "mb-0")}>
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
        <Section>
          <div className="fr-container">
            <SectionHead title={t("StaticPages.helpTitle")} subtitle={t("Translate.helpSubtitle")} />
            <RowCards>
              <Card
                image={CardIconCheck}
                title={t("Translate.helpTileTitle1")}
                link="https://help.refugies.info/fr/category/traduire-1dvep4w/"
              >
                <p>{t("Translate.helpTileText1")}</p>
              </Card>

              <Card
                image={CardIconCheck}
                title={t("StaticPages.helpTileTitle3")}
                onClick={() => window.$crisp.push(["do", "chat:open"])}
              >
                <p>{t("StaticPages.helpTileText3")}</p>
              </Card>
            </RowCards>
          </div>
        </Section>
      </div>

      {/* FAQ */}
      <Section ref={refFaq} className="relative">
        <Anchor id="faq" />
        <div className="fr-container">
          <Title2 className="text-center">{t("StaticPages.faqTitle")}</Title2>
          <div className="max-w-[720px] mx-auto">
            <Accordion
              items={[
                { title: t("Translate.faqAccordionTitle1"), text: t("Translate.faqAccordionText1") },
                { title: t("Translate.faqAccordionTitle2"), text: t("Translate.faqAccordionText2") },
                { title: t("Translate.faqAccordionTitle3"), text: t("Translate.faqAccordionText3") },
                { title: t("Translate.faqAccordionTitle4"), text: t("Translate.faqAccordionText4") },
                {
                  title: t("Translate.faqAccordionTitle5"),
                  text: t("Translate.faqAccordionText5"),
                  cta: { text: t("Translate.faqAccordionCTA5"), link: "https://airtable.com/shrQxPHedgZ5PuXot" },
                },
              ]}
              multiOpen
            />
          </div>
        </div>
      </Section>

      {/* REGISTER */}
      <div ref={refRegister} className={cls(styles.section, styles.bg_grey)}>
        <span id="register" className={styles.anchor}></span>
        <Register
          onClickLoggedIn={navigateToTranslations}
          subtitleForm={t("Translate.registerSubtitle")}
          subtitleLoggedIn={t("Translate.registerLoggedIn")}
          btnLoggedIn={t("Translate.registerBtnLoggedIn")}
          subtitleMobile={t("Translate.registerMobile")}
          associatedRole={RoleName.TRAD}
        />
      </div>
    </div>
  );
};

export const getStaticProps = wrapper.getStaticProps((store) => async ({ locale }) => {
  let translationStatistics: TranslationStatisticsResponse = {};

  try {
    translationStatistics = await API.getTranslationStatistics({
      facets: ["nbTranslators", "nbWordsTranslated", "nbActiveTranslators"],
    });
  } catch (e) {
    logger.error("[traduire] error while generating page", e);
  }

  return {
    props: {
      ...(await serverSideTranslations(getLanguageFromLocale(locale), ["common"])),
      translationStatistics,
    },
    revalidate: 60,
  };
});

export default RecensezVotreAction;
