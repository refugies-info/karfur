import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { END } from "redux-saga";
import type { HowToLearnFrenchCard } from "~/components/Pages/learnFrench";
import { Hero, HowToLearnFrench } from "~/components/Pages/learnFrench";
import { Anchor } from "~/components/Pages/staticPages/common/Anchor";
import SEO from "~/components/Seo";
import { HOW_TO_LEARN_FRENCH_CARD_IDS } from "~/data/learnFrench";
import { getLanguageFromLocale } from "~/lib/getLanguageFromLocale";
import { logger } from "~/logger";
import { getPath } from "~/routes";
import { wrapper } from "~/services/configureStore";
import { fetchThemesActionCreator } from "~/services/Themes/themes.actions";
import API from "~/utils/API";
import HeroIllu from "../assets/staticPages/learn-french/hero-illu.png";

interface Props {
  howToCards: HowToLearnFrenchCard[];
}

const LearnFrench = (props: Props) => {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      <SEO title={t("LearnFrench.seoTitle", "Apprendre le français - Réfugiés.info")} />

      <Hero
        title={t("LearnFrench.hero_title")}
        subtitle={t("LearnFrench.hero_subtitle")}
        searchCtaText={t("LearnFrench.hero_search_cta")}
        searchCtaHref="#find-a-class"
        learnMoreCtaText={t("LearnFrench.hero_learn_more_cta")}
        learnMoreCtaHref="#how-to-learn-french"
        image={HeroIllu}
      />

      <Anchor id="how-to-learn-french" />
      <HowToLearnFrench cards={props.howToCards} />

      {/* RI-1525 to RI-1528: search, filters, results lists (#find-a-class) */}
    </div>
  );
};

export const getStaticProps = wrapper.getStaticProps((store) => async ({ locale }) => {
  const action = fetchThemesActionCreator();
  store.dispatch(action);
  store.dispatch(END);
  await store.sagaTask?.toPromise();

  const cardConfig: { id: string; tagKey: string }[] = [
    { id: HOW_TO_LEARN_FRENCH_CARD_IDS.cir, tagKey: "LearnFrench.howTo_tag_arrival" },
    { id: HOW_TO_LEARN_FRENCH_CARD_IDS.civicExam, tagKey: "LearnFrench.howTo_tag_mandatory" },
    {
      id: HOW_TO_LEARN_FRENCH_CARD_IDS.certification,
      tagKey: "LearnFrench.howTo_tag_certification",
    },
  ];

  let howToCards: HowToLearnFrenchCard[] = [];
  try {
    howToCards = (
      await Promise.all(
        cardConfig.map(async ({ id, tagKey }) => {
          const dispositif = await API.getDispositif(id, locale || "fr");
          return {
            title: dispositif.titreInformatif,
            description: dispositif.abstract,
            tagKey,
            href: `${getPath(
              dispositif.typeContenu === "demarche" ? "/demarche/[id]" : "/dispositif/[id]",
              locale,
            ).replace("[id]", String(dispositif._id))}`,
          };
        }),
      )
    ).filter((card): card is HowToLearnFrenchCard => !!card.title);
  } catch (e) {
    logger.error("[trouver-cours-francais] build page", e);
  }

  return {
    props: {
      ...(await serverSideTranslations(getLanguageFromLocale(locale), ["common"])),
      howToCards,
    },
    revalidate: 60 * 10,
  };
});

export default LearnFrench;
