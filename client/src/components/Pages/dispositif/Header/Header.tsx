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
import { useEvent, useLocale } from "hooks";
import PageContext from "utils/pageContext";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import Button from "components/UI/Button";
import Badge from "components/UI/Badge";
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
  const { Event } = useEvent();
  const dispositif = useSelector(selectedDispositifSelector);
  const locale = useLocale();
  useEffect(() => {
    moment.locale(locale);
  }, [locale]);

  const pageContext = useContext(PageContext);
  return (
    <header className={styles.container}>
      {pageContext.mode === "view" && <Breadcrumb dispositif={dispositif} />}
      <div className="position-relative">
        <Title />
        {pageContext.mode === "view" && (
          <>
            {dispositif?.date && (
              <Badge severity="info" small icon="ri-information-fill">{`${t("Dispositif.updated")} ${moment(
                dispositif.date,
              ).fromNow()}`}</Badge>
            )}

            <Button
              className={styles.share}
              priority="tertiary"
              evaIcon="share-outline"
              onClick={() => {
                sharingOptions(props.typeContenu, dispositif?.titreInformatif || "", dispositif?.titreMarque || "");
                Event("Share", "mobile", "from dispositif header");
              }}
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
