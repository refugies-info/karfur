import Alert from "@codegouvfr/react-dsfr/Alert";
import { useTranslation } from "next-i18next";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Container } from "reactstrap";
import { useWindowSize } from "~/hooks";
import useIsSticky from "~/hooks/useIsSticky";
import { cls } from "~/lib/classname";
import { searchQuerySelector } from "~/services/SearchResults/searchResults.selector";
import Filters from "./Filters";
import styles from "./SearchHeader.module.scss";

const HIDDEN_DEPS_KEY = "hideBannerDepartments";

interface Props {
  nbResults: number;
  departmentsNotDeployed: string[];
}

const SearchHeader = (props: Props) => {
  const { t } = useTranslation();
  const stickyBarRef = useRef<HTMLDivElement>(null);
  const query = useSelector(searchQuerySelector);
  const { isMobile } = useWindowSize();
  const isSticky = useIsSticky(stickyBarRef);

  const selectedDepartment = query.departments.length === 1 ? query.departments[0] : undefined;
  const [departmentsMessageHidden, setDepartmentsMessageHidden] = useState<string[]>([]);

  console.log(query.departments);

  useEffect(() => {
    const savedDepartments = localStorage.getItem(HIDDEN_DEPS_KEY);
    if (savedDepartments) setDepartmentsMessageHidden(JSON.parse(savedDepartments));
  }, []);
  // Banner
  const hideBanner = () => {
    localStorage.setItem(HIDDEN_DEPS_KEY, JSON.stringify(props.departmentsNotDeployed));
    setDepartmentsMessageHidden(props.departmentsNotDeployed);
  };
  const isBannerVisible =
    props.departmentsNotDeployed.length > 0 &&
    props.departmentsNotDeployed.find((dep) => !departmentsMessageHidden.includes(dep));

  return (
    <>
      <div className={styles.title}>
        <Container>
          <h1>{t("Recherche.title")}</h1>
          <p ref={stickyBarRef}>{t("Recherche.subtitle", { count: props.nbResults })}</p>
        </Container>
      </div>
      <div className={cls(styles.stickybar, isSticky && styles.sticky)}>
        <Filters isSticky={isSticky} />
        {isMobile && !isSticky && isBannerVisible && selectedDepartment && (
          <div className={styles.notDeployedAlert}>
            <Alert
              closable
              description={t("Recherche.notDeployedText", { department: selectedDepartment })}
              onClose={hideBanner}
              severity="warning"
              small
            />
          </div>
        )}
      </div>
    </>
  );
};

export default SearchHeader;
