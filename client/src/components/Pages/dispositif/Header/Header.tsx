import React, { useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
// TODO import all locales
import "moment/locale/fr";
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
  const dispositif = useSelector(selectedDispositifSelector);
  const locale = useLocale();
  useEffect(() => {
    moment.locale(locale);
  }, [locale]);

  const pageContext = useContext(PageContext);
  return (
    <header className={styles.container}>
      <Breadcrumb dispositif={dispositif} />
      <div className="position-relative">
        <Title />
        {pageContext.mode === "view" && (
          <>
            {dispositif?.date && (
              <Badge text={`Mise à jour ${moment(dispositif.date).fromNow()}`} type="info" isSmall hasIcon />
            )}

            <Button
              className={styles.share}
              tertiary
              icon="share-outline"
              onClick={() =>
                sharingOptions(props.typeContenu, dispositif?.titreInformatif || "", dispositif?.titreMarque || "")
              }
            >
              Partager la fiche
            </Button>

            <SectionButtons id="titreInformatif" content={dispositif?.titreInformatif || ""} />
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
