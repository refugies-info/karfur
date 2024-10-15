import { useTranslation } from "next-i18next";
import { useRef } from "react";
import { Container } from "reactstrap";
import useIsSticky from "~/hooks/useIsSticky";
import { cls } from "~/lib/classname";
import Filters from "./Filters";
import styles from "./SearchHeader.module.scss";

interface Props {
  nbResults: number;
}

const SearchHeader = (props: Props) => {
  const { t } = useTranslation();
  const stickyBarRef = useRef<HTMLDivElement>(null);

  const isSticky = useIsSticky(stickyBarRef);

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
      </div>
    </>
  );
};

export default SearchHeader;
