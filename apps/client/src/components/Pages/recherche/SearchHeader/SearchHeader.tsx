import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { Container } from "reactstrap";
import { useScrollDirection } from "~/hooks/useScrollDirection";
import useWindowSize from "~/hooks/useWindowSize";
import { cls } from "~/lib/classname";
import ResultsFilter from "../ResultsFilter";
import Filters from "./Filters";
import styles from "./SearchHeader.module.scss";

const SCROLL_LIMIT = 500;

interface Props {
  nbResults: number;
}

const SearchHeader = (props: Props) => {
  const { t } = useTranslation();
  const { isMobile } = useWindowSize();

  // SCROLL
  const [scrolled, setScrolled] = useState(true);
  const [_scrollDirection, overScrollLimit] = useScrollDirection(SCROLL_LIMIT);
  useEffect(() => {
    if (!isMobile) {
      setScrolled(!!overScrollLimit);
    }
  }, [overScrollLimit, isMobile]);

  return (
    <>
      <div className={styles.title}>
        <Container>
          <h1>{t("Recherche.title")}</h1>
          <p>{t("Recherche.subtitle", { count: props.nbResults })}</p>
        </Container>
      </div>
      <div className={styles.filters}>
        <div className={cls(styles.stickybar, scrolled && styles.scrolled)}>
          <Filters isSmall={scrolled} />
        </div>
      </div>

      <ResultsFilter />
    </>
  );
};

export default SearchHeader;
