import Alert from "@codegouvfr/react-dsfr/Alert";
import { useTranslation } from "next-i18next";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Container } from "reactstrap";
import { useWindowSize } from "@refugies-info/ui";
import useIsSticky from "~/hooks/useIsSticky";
import { cls } from "~/lib/classname";
import { getDepartmentsNotDeployed } from "~/lib/recherche/functions";
import { SearchCountsResponse } from "~/pages/api/search/counts";
import { activeDispositifsSelector } from "~/services/ActiveDispositifs/activeDispositifs.selector";
import { searchQuerySelector } from "~/services/SearchResults/searchResults.selector";
import { SearchCountsContext } from "../SearchCountsContext";
import Filters from "./Filters";
import styles from "./SearchHeader.module.scss";

const HIDDEN_DEPS_KEY = "hideBannerDepartments";

interface Props {
  nbResults: number;
  counts: SearchCountsResponse | null;
}

const SearchHeader = (props: Props) => {
  const { t } = useTranslation();
  const stickyBarRef = useRef<HTMLDivElement>(null);
  const query = useSelector(searchQuerySelector);
  const dispositifs = useSelector(activeDispositifsSelector);

  const { isMobile } = useWindowSize();
  const isSticky = useIsSticky(stickyBarRef);

  const [departmentsMessageHidden, setDepartmentsMessageHidden] = useState<string[]>([]);

  const [departmentsNotDeployed, setDepartmentsNotDeployed] = useState<string[]>(
    getDepartmentsNotDeployed(query.departments, dispositifs),
  );

  useEffect(() => {
    setDepartmentsNotDeployed(getDepartmentsNotDeployed(query.departments, dispositifs));
  }, [query.departments, dispositifs]);

  useEffect(() => {
    const savedDepartments = localStorage.getItem(HIDDEN_DEPS_KEY);
    if (savedDepartments) setDepartmentsMessageHidden(JSON.parse(savedDepartments));
  }, []);

  // Banner
  const hideBanner = () => {
    localStorage.setItem(HIDDEN_DEPS_KEY, JSON.stringify(departmentsNotDeployed));
    setDepartmentsMessageHidden(departmentsNotDeployed);
  };

  const showNotDeployedMessage =
    departmentsNotDeployed.length > 0 && departmentsNotDeployed.find((dep) => !departmentsMessageHidden.includes(dep));

  return (
    <header role="banner" aria-labelledby="search-title">
      <div className={styles.title}>
        <Container>
          <h1 id="search-title">{t("Recherche.title")}</h1>
          <p ref={stickyBarRef}>{t("Recherche.subtitle", { count: props.nbResults })}</p>
        </Container>
      </div>
      <div className={cls(styles.stickybar, isSticky && styles.sticky)}>
        <SearchCountsContext.Provider value={props.counts}>
          <Filters isSticky={isSticky} />
        </SearchCountsContext.Provider>
        {isMobile && !isSticky && showNotDeployedMessage && (
          <div className={styles.notDeployedAlert}>
            <Alert
              closable
              description={t("Recherche.notDeployedText", { department: departmentsNotDeployed.join(", ") })}
              onClose={hideBanner}
              severity="warning"
              small
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default SearchHeader;
