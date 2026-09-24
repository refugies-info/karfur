import Button from "@codegouvfr/react-dsfr/Button";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { useIsModalOpen } from "@codegouvfr/react-dsfr/Modal/useIsModalOpen";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { END } from "redux-saga";
import type { HowToLearnFrenchCard } from "~/components/Pages/learnFrench";
import {
  CourseResults,
  CourseTabs,
  FiltersSidebar,
  Hero,
  HowToLearnFrench,
  SearchBar,
} from "~/components/Pages/learnFrench";
import { Anchor } from "~/components/Pages/staticPages/common/Anchor";
import SEO from "~/components/Seo";
import { HOW_TO_LEARN_FRENCH_CARDS_CONFIG, LEARN_FRENCH_THEME_ID } from "~/data/learnFrench";
import { useCourseSearch } from "~/hooks/learnFrench/useCourseSearch";
import { useFrenchCourseFilters } from "~/hooks/learnFrench/useFrenchCourseFilters";
import useLocale from "~/hooks/useLocale";
import { getLanguageFromLocale } from "~/lib/getLanguageFromLocale";
import { logger } from "~/logger";
import { getPath } from "~/routes";
import { wrapper } from "~/services/configureStore";
import { fetchNeedsActionCreator } from "~/services/Needs/needs.actions";
import { needsSelector } from "~/services/Needs/needs.selectors";
import { fetchThemesActionCreator } from "~/services/Themes/themes.actions";
import API from "~/utils/API";
import HeroIllu from "../assets/staticPages/learn-french/hero-illu.svg";

interface Props {
  howToCards: HowToLearnFrenchCard[];
}

const mobileFiltersModal = createModal({
  id: "learn-french-mobile-filters-modal",
  isOpenedByDefault: false,
});

const LearnFrench = (props: Props) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const { filters, setFilters, search, setSearch, activeTab, setActiveTab, isReady } =
    useFrenchCourseFilters();
  const courseSearch = useCourseSearch(filters, search, activeTab, isReady);
  const mobileFiltersButtonRef = useRef<HTMLButtonElement>(null);
  useIsModalOpen(mobileFiltersModal, {
    onConceal: () => mobileFiltersButtonRef.current?.focus(),
  });

  const allNeeds = useSelector(needsSelector);
  const categoryOptions = useMemo(
    () =>
      allNeeds
        .filter((need) => String(need.theme._id) === LEARN_FRENCH_THEME_ID)
        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0)),
    [allNeeds],
  );
  const needLabels = useMemo(
    () => new Map(allNeeds.map((need) => [String(need._id), need[locale]?.text || need.fr.text])),
    [allNeeds, locale],
  );

  const resetFilters = () =>
    setFilters({ departments: [], cities: [], frenchLevel: [], categories: [], publicFilter: [] });

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
        rcoLinkText={t("LearnFrench.hero_rco_link_text")}
        rcoLinkHref="https://www.intercariforef.org/"
        image={HeroIllu}
      />

      <div className="relative">
        <Anchor id="how-to-learn-french" />
        <HowToLearnFrench cards={props.howToCards} />
      </div>

      <div className="bg-alt-blue-france relative">
        <Anchor id="find-a-class" />
        <SearchBar
          filters={filters}
          onLocationsChange={(departments, cities) =>
            setFilters({ ...filters, departments, cities })
          }
          onReset={resetFilters}
          search={search}
          onSearchChange={setSearch}
        />
        <div className="container flex flex-col gap-10 py-6 lg:flex-row lg:items-start">
          <Button
            ref={mobileFiltersButtonRef}
            priority="secondary"
            iconId="fr-icon-equalizer-line"
            className="lg:hidden"
            onClick={() => mobileFiltersModal.open()}
          >
            {t("LearnFrench.filters_title", "Filtrer")}
          </Button>

          <aside className="hidden shrink-0 lg:block lg:w-72">
            <FiltersSidebar
              filters={filters}
              categoryOptions={categoryOptions}
              onChange={setFilters}
              onReset={resetFilters}
            />
          </aside>

          <mobileFiltersModal.Component
            title={t("LearnFrench.filters_title", "Filtrer")}
            className="lg:hidden"
            buttons={{ children: t("LearnFrench.filters_apply", "Voir les résultats") }}
          >
            <FiltersSidebar
              filters={filters}
              categoryOptions={categoryOptions}
              onChange={setFilters}
              onReset={resetFilters}
              showTitle={false}
            />
          </mobileFiltersModal.Component>

          <div className="min-w-0 flex-1">
            <CourseTabs activeTab={activeTab} onChange={setActiveTab} />
            <div className="mt-6">
              <CourseResults
                results={courseSearch.results}
                total={courseSearch.total}
                page={courseSearch.page}
                loading={courseSearch.loading}
                loadingMore={courseSearch.loadingMore}
                hasMore={courseSearch.page < courseSearch.pageCount}
                onLoadMore={courseSearch.loadMore}
                onResetFilters={resetFilters}
                needLabels={needLabels}
              />
            </div>
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

  const settledCards = await Promise.allSettled(
    HOW_TO_LEARN_FRENCH_CARDS_CONFIG.map(async ({ id, tagKey, icon }) => {
      const dispositif = await API.getDispositif(id, locale || "fr");
      return {
        icon,
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
        id: HOW_TO_LEARN_FRENCH_CARDS_CONFIG[index].id,
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
