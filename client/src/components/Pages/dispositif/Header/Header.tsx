import React, { useContext, useEffect } from "react";
import moment from "moment";
// TODO import all locales
import "moment/locale/fr";
import { Badge } from "@dataesr/react-dsfr";
import { GetDispositifResponse } from "api-types";
import { useLocale } from "hooks";
import PageContext from "utils/pageContext";
import Button from "components/UI/Button";
import { sharingOptions } from "../function";
import Breadcrumb from "../Breadcrumb";
import SectionButtons from "../SectionButtons";
import Title from "../Title";
import styles from "./Header.module.scss";

interface Props {
  dispositif: GetDispositifResponse | null;
  typeContenu: string;
}

const Header = (props: Props) => {
  const locale = useLocale();
  useEffect(() => {
    moment.locale(locale);
  }, [locale]);

  const pageContext = useContext(PageContext);
  const isViewMode = pageContext.mode === "view";
  return (
    <header className={styles.container}>
      <Breadcrumb dispositif={props.dispositif} />
      <div className="position-relative">
        <Title id="titreInformatif">{props.dispositif?.titreInformatif || ""}</Title>
        {props.dispositif?.date && (
          <Badge text={`Mise à jour ${moment(props.dispositif.date).fromNow()}`} type="success" isSmall hasIcon />
        )}

        <Button
          className={styles.share}
          tertiary
          icon="share-outline"
          onClick={() =>
            sharingOptions(
              props.typeContenu,
              props.dispositif?.titreInformatif || "",
              props.dispositif?.titreMarque || "",
            )
          }
        >
          Partager la fiche
        </Button>
        {isViewMode && <SectionButtons id="titreInformatif" content={props.dispositif?.titreInformatif || ""} />}
      </div>
    </header>
  );
};

export default Header;
