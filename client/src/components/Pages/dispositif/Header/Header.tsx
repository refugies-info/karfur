import React, { useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import moment from "moment";
import "moment/locale/ar";
import "moment/locale/en-gb";
import "moment/locale/fa";
import "moment/locale/fr";
import "moment/locale/ru";
import "moment/locale/uk";
import { Badge } from "@dataesr/react-dsfr";
import { useLocale } from "hooks";
import PageContext from "utils/pageContext";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import Button from "components/UI/Button";
import { sharingOptions } from "../function";
import Breadcrumb from "../Breadcrumb";
import SectionButtons from "../SectionButtons";
import Title from "../Title";
import styles from "./Header.module.scss";

interface Props {
  typeContenu: string;
}

const Header = (props: Props) => {
  const { t } = useTranslation();
  const dispositif = useSelector(selectedDispositifSelector);
  const locale = useLocale();
  useEffect(() => {
    moment.locale(locale);
  }, [locale]);

  const pageContext = useContext(PageContext);
  return (
    <header className={styles.container}>
      {pageContext.mode !== "translate" && <Breadcrumb dispositif={dispositif} />}
      <div className="position-relative">
        <Title />
        {pageContext.mode === "view" && (
          <>
            {dispositif?.date && (
              <Badge
                text={`${t("Dispositif.updated")} ${moment(dispositif.date).fromNow()}`}
                type="info"
                isSmall
                hasIcon
              />
            )}

            <Button
              className={styles.share}
              tertiary
              icon="share-outline"
              onClick={() =>
                sharingOptions(props.typeContenu, dispositif?.titreInformatif || "", dispositif?.titreMarque || "")
              }
            >
              {t("Dispositif.share")}
            </Button>

            <SectionButtons id="titreInformatif" content={dispositif?.titreInformatif || ""} />
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
