import _ from "lodash";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { memo, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchQuerySelector, searchResultsSelector } from "services/SearchResults/searchResults.selector";
import noResultsImage from "~/assets/no_results_alt.svg";
import ResultsFilter from "~/components/Pages/recherche/ResultsFilter";
import DispositifCard from "~/components/UI/DispositifCard";
import FButton from "~/components/UI/FButton";
import { useWindowSize } from "~/hooks";
import { resetQueryActionCreator } from "~/services/SearchResults/searchResults.actions";
import NotDeployedBanner from "../NotDeployedBanner";
import styles from "./SearchResults.module.css";

export const MAX_SHOWN_DISPOSITIFS = 24;
const HIDDEN_DEPS_KEY = "hideBannerDepartments";

interface Props {
  departmentsNotDeployed: string[];
  targetBlank?: boolean;
}

const SearchResults = (props: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const query = useSelector(searchQuerySelector);
  const filteredResult = useSelector(searchResultsSelector);

  const [departmentsMessageHidden, setDepartmentsMessageHidden] = useState<string[]>([]);

  useEffect(() => {
    const savedDepartments = localStorage.getItem(HIDDEN_DEPS_KEY);
    if (savedDepartments) setDepartmentsMessageHidden(JSON.parse(savedDepartments));
  }, []);

  const { isMobile } = useWindowSize();
  const dispositifs = !isMobile ? filteredResult.matches.slice(0, MAX_SHOWN_DISPOSITIFS) : filteredResult.matches;

  const selectedDepartment = query.departments.length === 1 ? query.departments[0] : undefined;
  const noResults = filteredResult.matches.length === 0;

  // Banner
  const hideBanner = () => {
    localStorage.setItem(HIDDEN_DEPS_KEY, JSON.stringify(props.departmentsNotDeployed));
    setDepartmentsMessageHidden(props.departmentsNotDeployed);
  };
  const isBannerVisible =
    props.departmentsNotDeployed.length > 0 &&
    props.departmentsNotDeployed.find((dep) => !departmentsMessageHidden.includes(dep));

  const [cardsPerRow, setCardsPerRow] = useState(6);
  const ref = useRef<HTMLDivElement | null>(null);
  const boundingRect = ref?.current?.getBoundingClientRect();
  useLayoutEffect(() => {
    if (boundingRect) {
      const count = _.floor((boundingRect.width + 24) / (282 + 24));
      setCardsPerRow(count);
    }
  }, [boundingRect]);

  if (noResults) {
    return (
      <div className={styles.no_results}>
        <h2>{t("Recherche.noResultTitle", "Oups, aucun résultat")}</h2>
        <p>{t("Recherche.noResultText", "Utilisez moins de filtres ou vérifiez l’orthographe du mot-clé.")}</p>

        <FButton type="login" name="refresh-outline" onClick={() => dispatch(resetQueryActionCreator())}>
          {t("Recherche.resetFilters", "Effacer tous les filtres")}
        </FButton>

        <div className={styles.image}>
          <Image src={noResultsImage} width={420} height={280} alt="No results" />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <ResultsFilter cardsPerRow={cardsPerRow} />

      {isBannerVisible && <NotDeployedBanner departments={props.departmentsNotDeployed} hideBanner={hideBanner} />}

      <div className={styles.results} ref={ref}>
        {dispositifs.length > 0 &&
          dispositifs.map((d) =>
            typeof d === "string" ? null : (
              <DispositifCard
                key={d._id.toString()}
                dispositif={d}
                selectedDepartment={selectedDepartment}
                targetBlank
              />
            ),
          )}
      </div>
    </div>
  );
};

export default memo(SearchResults);
