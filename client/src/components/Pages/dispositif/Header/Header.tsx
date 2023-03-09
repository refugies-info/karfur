import React, { useEffect } from "react";
import moment from "moment";
// TODO import all locales
import "moment/locale/fr";
import { Badge } from "@dataesr/react-dsfr";
import { useLocale } from "hooks";
import { GetDispositifResponse } from "api-types";
import Button from "components/UI/Button";
import { sharingOptions } from "../function";
import TextInput from "../TextInput";
import Breadcrumb from "../Breadcrumb";
import SectionButtons from "../SectionButtons";
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

  return (
    <header className={styles.container}>
      <Breadcrumb dispositif={props.dispositif} />
      <div className="position-relative">
        <h1 className={styles.title}>
          <TextInput id="titreInformatif" value={props.dispositif?.titreInformatif || ""} />
        </h1>
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
        <SectionButtons id="titreInformatif" content={props.dispositif?.titreInformatif || ""} />
      </div>
    </header>
  );
};

export default Header;
