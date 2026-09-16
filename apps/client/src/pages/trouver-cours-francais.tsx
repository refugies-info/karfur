import Button from "@codegouvfr/react-dsfr/Button";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { END } from "redux-saga";
import type { CourseTab, FiltersState, HowToLearnFrenchCard } from "~/components/Pages/learnFrench";
import {
  CourseTabs,
  CourseTab as CourseTabValues,
  FiltersSidebar,
  Hero,
  HowToLearnFrench,
  SearchBar,
} from "~/components/Pages/learnFrench";
import { Anchor } from "~/components/Pages/staticPages/common/Anchor";
import SEO from "~/components/Seo";
import { HOW_TO_LEARN_FRENCH_CARD_IDS, LEARN_FRENCH_THEME_ID } from "~/data/learnFrench";
import { getLanguageFromLocale } from "~/lib/getLanguageFromLocale";
import { logger } from "~/logger";
import { getPath } from "~/routes";
import { wrapper } from "~/services/configureStore";
import { fetchNeedsActionCreator } from "~/services/Needs/needs.actions";
import { needsSelector } from "~/services/Needs/needs.selectors";
import { fetchThemesActionCreator } from "~/services/Themes/themes.actions";
import API from "~/utils/API";
import HeroIllu from "../assets/staticPages/learn-french/hero-illu.png";

interface Props {
  howToCards: HowToLearnFrenchCard[];
}

const EMPTY_FILTERS: FiltersState = {
  departments: [],
  cities: [],
  frenchLevel: [],
  categories: [],
  publicFilter: [],
};

const LearnFrench = (props: Props) => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<FiltersState>(EMPTY_FILTERS);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<CourseTab>(CourseTabValues.UPCOMING);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const allNeeds = useSelector(needsSelector);
  const categoryOptions = useMemo(
    () =>
      allNeeds
        .filter((need) => String(need.theme._id) === LEARN_FRENCH_THEME_ID)
        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0)),
    [allNeeds],
  );

  return (
    <div className="w-full">
      <SEO title={t("LearnFrench.seoTitle", "Trouvez le cours de français adapté !")} />

      <Hero
        title={t("LearnFrench.hero_title")}
        subtitle={t("LearnFrench.hero_subtitle")}
        searchCtaText={t("LearnFrench.hero_search_cta")}
        searchCtaHref="#find-a-class"
        learnMoreCtaText={t("LearnFrench.hero_learn_more_cta")}
        learnMoreCtaHref="#how-to-learn-french"
        rcoDisclaimer={t("LearnFrench.hero_rco_disclaimer")}
        image={HeroIllu}
      />

      <div className="relative">
        <Anchor id="how-to-learn-french" />
        <HowToLearnFrench cards={props.howToCards} />
      </div>

      <div className="bg-alt-blue-france relative">
        <Anchor id="find-a-class" />
        <SearchBar
          departments={filters.departments}
          cities={filters.cities}
          onLocationsChange={(departments, cities) =>
            setFilters({ ...filters, departments, cities })
          }
          search={search}
          onSearchChange={setSearch}
        />
        <div className="container flex flex-col gap-10 py-6 lg:flex-row lg:items-start">
          <Button
            priority="secondary"
            iconId="fr-icon-equalizer-line"
            className="lg:hidden"
            onClick={() => setShowMobileFilters(true)}
          >
            {t("LearnFrench.filters_title", "Filtrer")}
          </Button>

          <aside className="hidden shrink-0 lg:block lg:w-72">
            <FiltersSidebar
              filters={filters}
              categoryOptions={categoryOptions}
              onChange={setFilters}
              onReset={() => setFilters(EMPTY_FILTERS)}
            />
          </aside>

          {showMobileFilters && (
            <div className="bg-alt-blue-france fixed inset-0 z-50 overflow-y-auto p-4 lg:hidden">
              <button
                type="button"
                className="absolute top-4 right-4"
                onClick={() => setShowMobileFilters(false)}
              >
                <i className="fr-icon-close-line" aria-hidden="true" />
                <span className="sr-only">{t("LearnFrench.filters_close", "Fermer")}</span>
              </button>
              <FiltersSidebar
                filters={filters}
                categoryOptions={categoryOptions}
                onChange={setFilters}
                onReset={() => setFilters(EMPTY_FILTERS)}
              />
              <Button
                className="mt-6 w-full justify-center"
                onClick={() => setShowMobileFilters(false)}
              >
                {t("LearnFrench.filters_apply", "Voir les résultats")}
              </Button>
            </div>
          )}

          <div className="min-w-0 flex-1">
            <CourseTabs activeTab={activeTab} onChange={setActiveTab} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps = wrapper.getStaticProps((store) => async ({ locale }) => {
  store.dispatch(fetchThemesActionCreator());
  store.dispatch(fetchNeedsActionCreator());
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

  const settledCards = await Promise.allSettled(
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
  );

  const howToCards: HowToLearnFrenchCard[] = [];
  settledCards.forEach((result, index) => {
    if (result.status === "fulfilled" && result.value.title) {
      howToCards.push(result.value);
    } else if (result.status === "rejected") {
      logger.error("[trouver-cours-francais] fetching card failed", {
        id: cardConfig[index].id,
        error: result.reason,
      });
    }
  });

  return {
    props: {
      ...(await serverSideTranslations(getLanguageFromLocale(locale), ["common"])),
      howToCards,
    },
    revalidate: 60 * 10,
  };
});

export default LearnFrench;
