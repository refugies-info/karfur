import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { END } from "redux-saga";
import type { HowToLearnFrenchCard } from "~/components/Pages/learnFrench";
import {
  CourseResults,
  CourseTab,
  CourseTabs,
  FiltersSidebar,
  FullScreenPanel,
  Hero,
  HowToLearnFrench,
  LocationPanel,
  MobileToolbar,
  SearchBar,
} from "~/components/Pages/learnFrench";
import { Anchor } from "~/components/Pages/staticPages/common/Anchor";
import SEO from "~/components/Seo";
import { HOW_TO_LEARN_FRENCH_CARDS_CONFIG, LEARN_FRENCH_THEME_ID } from "~/data/learnFrench";
import { useActiveFilters } from "~/hooks/learnFrench/useActiveFilters";
import { useAutoSwitchToOnDemandTab } from "~/hooks/learnFrench/useAutoSwitchToOnDemandTab";
import { useCourseSearch } from "~/hooks/learnFrench/useCourseSearch";
import { useFrenchCourseFilters } from "~/hooks/learnFrench/useFrenchCourseFilters";
import useLocale from "~/hooks/useLocale";
import { getLanguageFromLocale } from "~/lib/getLanguageFromLocale";
import { buildNeedLabels } from "~/lib/learnFrench/needLabels";
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

const LearnFrench = (props: Props) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const { filters, setFilters, search, setSearch, activeTab, setActiveTab, isReady } =
    useFrenchCourseFilters();
  const courseSearch = useCourseSearch(filters, search, activeTab, isReady);
  useAutoSwitchToOnDemandTab({
    filters,
    activeTab,
    setActiveTab,
    total: courseSearch.total,
    isSettled: courseSearch.isSettled,
  });
  const [isFiltersPanelOpen, setIsFiltersPanelOpen] = useState(false);
  const [isLocationPanelOpen, setIsLocationPanelOpen] = useState(false);

  const allNeeds = useSelector(needsSelector);
  const categoryOptions = useMemo(
    () =>
      allNeeds
        .filter((need) => String(need.theme._id) === LEARN_FRENCH_THEME_ID)
        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0)),
    [allNeeds],
  );
  const needLabels = useMemo(() => buildNeedLabels(allNeeds, locale), [allNeeds, locale]);

  const { badges, filterGroupCount } = useActiveFilters({
    filters,
    onFiltersChange: setFilters,
    needLabels,
    search,
    onSearchChange: setSearch,
  });

  const resetFilters = () =>
    setFilters({ departments: [], cities: [], frenchLevel: [], categories: [], publicFilter: [] });

  return (
    <div className="w-full">
      <SEO title={t("LearnFrench.seoTitle", "Trouvez le cours de français adapté !")} />

      <Hero
        title={t("LearnFrench.hero_title")}
        mobileTitle={t("LearnFrench.hero_title_mobile")}
        subtitle={t("LearnFrench.hero_subtitle")}
        mobileSubtitle={t("LearnFrench.hero_subtitle_mobile")}
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
          onOpenLocationPanel={() => setIsLocationPanelOpen(true)}
          search={search}
          onSearchChange={setSearch}
        />
        <div className="container flex flex-col gap-10 py-6 lg:flex-row lg:items-start">
          <aside className="hidden shrink-0 lg:block lg:w-72">
            <FiltersSidebar
              filters={filters}
              categoryOptions={categoryOptions}
              onChange={setFilters}
              onReset={resetFilters}
            />
          </aside>

          <div className="min-w-0 flex-1">
            <CourseTabs activeTab={activeTab} onChange={setActiveTab} />
            <div className="mt-4 lg:hidden">
              <MobileToolbar
                total={courseSearch.total}
                filterGroupCount={filterGroupCount}
                badges={badges}
                search={search}
                onSearchSubmit={setSearch}
                onOpenFilters={() => setIsFiltersPanelOpen(true)}
              />
            </div>
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
                onSeeOtherCourses={
                  activeTab === CourseTab.UPCOMING
                    ? () => setActiveTab(CourseTab.ON_DEMAND)
                    : undefined
                }
                needLabels={needLabels}
              />
            </div>
          </div>
        </div>

        <FullScreenPanel
          open={isFiltersPanelOpen}
          title={t("LearnFrench.filters_title", "Filtrer")}
          resultCount={courseSearch.total}
          onClose={() => setIsFiltersPanelOpen(false)}
          onReset={resetFilters}
        >
          <FiltersSidebar
            filters={filters}
            categoryOptions={categoryOptions}
            onChange={setFilters}
            onReset={resetFilters}
            showHeader={false}
            compactLevelLabels
          />
        </FullScreenPanel>
        <LocationPanel
          open={isLocationPanelOpen}
          departments={filters.departments}
          cities={filters.cities}
          resultCount={courseSearch.total}
          onChange={(departments, cities) => setFilters({ ...filters, departments, cities })}
          onClose={() => setIsLocationPanelOpen(false)}
        />
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
