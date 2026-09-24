import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type { ReactElement } from "react";
import { useEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { END } from "redux-saga";
import { PrintableCourseList } from "~/components/Pages/learnFrench/CourseResults/PrintableCourseList";
import { useCourseSearch } from "~/hooks/learnFrench/useCourseSearch";
import { useFrenchCourseFilters } from "~/hooks/learnFrench/useFrenchCourseFilters";
import useLocale from "~/hooks/useLocale";
import { getLanguageFromLocale } from "~/lib/getLanguageFromLocale";
import { wrapper } from "~/services/configureStore";
import { fetchNeedsActionCreator } from "~/services/Needs/needs.actions";
import { needsSelector } from "~/services/Needs/needs.selectors";
import type { PageOptions } from "~/types/interface";

const PRINT_RESULTS_LIMIT = 500;

/**
 * Dedicated print view for the Espace FR course results
 */
const PrintCourseList = () => {
  const { t } = useTranslation();
  const locale = useLocale();
  const { filters, search, activeTab, isReady } = useFrenchCourseFilters();
  const courseSearch = useCourseSearch(filters, search, activeTab, isReady, PRINT_RESULTS_LIMIT);

  const allNeeds = useSelector(needsSelector);
  const needLabels = useMemo(
    () => new Map(allNeeds.map((need) => [String(need._id), need[locale]?.text || need.fr.text])),
    [allNeeds, locale],
  );

  // The effect re-runs whenever the results change: open the print dialog only once
  const hasPrinted = useRef(false);
  useEffect(() => {
    if (hasPrinted.current || !isReady || courseSearch.loading) return;
    hasPrinted.current = true;
    window.print();
  }, [isReady, courseSearch.loading]);

  return (
    <div className="mx-auto max-w-[1000px] px-8 py-10">
      {!isReady || courseSearch.loading ? (
        <p className="text-default-grey">{t("Recherche.loading", "Chargement...")}</p>
      ) : (
        <PrintableCourseList
          results={courseSearch.results}
          needLabels={needLabels}
          filters={filters}
        />
      )}
    </div>
  );
};

PrintCourseList.getLayout = (page: ReactElement) => page;
PrintCourseList.options = {
  cookiesModule: false,
  supportModule: false,
} satisfies PageOptions;

export const getStaticProps = wrapper.getStaticProps((store) => async ({ locale }) => {
  store.dispatch(fetchNeedsActionCreator());
  store.dispatch(END);
  await store.sagaTask?.toPromise();

  return {
    props: {
      ...(await serverSideTranslations(getLanguageFromLocale(locale), ["common"])),
    },
  };
});

export default PrintCourseList;
