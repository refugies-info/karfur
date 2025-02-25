import { RoleName, TranslationStatisticsResponse } from "@refugies-info/api-types";
import { logger } from "logger";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import WhoIcon1 from "~/assets/staticPages/common/card-icon-bubble.svg";
import CardIconCheck from "~/assets/staticPages/common/card-icon-check.svg";
import StepImage1 from "~/assets/staticPages/publier/step-image-1.png";
import StepImage4 from "~/assets/staticPages/publier/step-image-5.png";
import MockupRI from "~/assets/staticPages/traduire/mockup-ri.png";
import ShareImage from "~/assets/staticPages/traduire/share-image.svg";
import StepImage2 from "~/assets/staticPages/traduire/step-image-2.svg";
import StepImage3 from "~/assets/staticPages/traduire/step-image-3.png";
import WhoIcon3 from "~/assets/staticPages/traduire/who-icon-3.svg";
import {
  Accordion,
  Anchor,
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
import { getLanguageFromLocale } from "~/lib/getLanguageFromLocale";
import { wrapper } from "~/services/configureStore";
import API from "~/utils/API";

export type View = "who" | "steps" | "next" | "faq" | "register";
export type NeedKey = "strong" | "medium" | "weak";
const NEED_ORDER: Record<NeedKey, number> = { strong: 0, medium: 1, weak: 2 };

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
  const translationNeeds: { languageId: string; count: number; need: NeedKey }[] = useMemo(
    () =>
      (props.translationStatistics?.nbActiveTranslators || [])
        .map((stat) => {
          if (stat.count <= 2) return { ...stat, need: "strong" as NeedKey };
          if (stat.count > 2 && stat.count <= 5) return { ...stat, need: "medium" as NeedKey };
          return { ...stat, need: "weak" as NeedKey };
        })
        .sort((a, b) => NEED_ORDER[a.need] - NEED_ORDER[b.need]),
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
          { id: "who", text: t("Translate.navbarItem1") },
          { id: "steps", text: t("Translate.navbarItem2") },
          { id: "next", text: t("Translate.navbarItem3") },
          { id: "faq", text: t("Translate.navbarItem4") },
        ]}
        rightLink={{
          id: "register",
          text: t("Translate.navbarItem5"),
        }}
        activeView={activeView}
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
        <Section className="bg-action-low-blue-france">
          <div className="fr-container">
            <Title2>{t("Translate.needTitle")}</Title2>
            <div className="flex flex-wrap gap-6 md:justify-center">
              {translationNeeds.map((item, i) => (
                <LanguageCard href="#register" key={i} languageId={item.languageId} need={item.need} />
              ))}
            </div>
          </div>
        </Section>
      </div>

      {/* STEPS */}
      <div ref={refSteps} className="relative">
        <Anchor id="steps" />
        <Section className="bg-alt-beige-gris-galet">
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
        <Section className="bg-action-low-blue-france">
          <Anchor id="next" />
          <div className="fr-container">
            <div className="flex flex-col items-center gap-10 md:flex-row lg:gap-20">
              <div className="flex-1">
                <Title2 className="!text-left" smallMb>
                  {t("Translate.nextTitle")}
                </Title2>
                <p>{t("Translate.nextText1")}</p>
                <p className="!mb-0">{t("Translate.nextText2")}</p>
              </div>
              <div className="flex-1">
                <Image src={ShareImage} alt="" width={440} height={287} className="mx-auto object-contain" />
              </div>
            </div>
          </div>
        </Section>

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
          <div className="mx-auto max-w-[720px]">
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
      <Section ref={refRegister} className="bg-alt-beige-gris-galet relative">
        <Anchor id="register" />
        <div className="fr-container">
          <Register
            onClickLoggedIn={navigateToTranslations}
            subtitleForm={t("Translate.registerSubtitle")}
            subtitleLoggedIn={t("Translate.registerLoggedIn")}
            btnLoggedIn={t("Translate.registerBtnLoggedIn")}
            subtitleMobile={t("Translate.registerMobile")}
            associatedRole={RoleName.TRAD}
          />
        </div>
      </Section>
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
