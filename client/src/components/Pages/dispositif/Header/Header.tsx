import React from "react";
import { GetDispositifResponse } from "api-types";
import TextInput from "../TextInput";
import Breadcrumb from "../Breadcrumb";
import styles from "./Header.module.scss";
import SectionButtons from "../SectionButtons";
import Button from "components/UI/Button";
import { sharingOptions } from "../function";

interface Props {
  dispositif: GetDispositifResponse | null;
  typeContenu: string;
}

const Header = (props: Props) => {
  return (
    <header className={styles.container}>
      <Breadcrumb dispositif={props.dispositif} />
      <div className="position-relative">
        <h1 className={styles.title}>
          <TextInput id="titreInformatif" value={props.dispositif?.titreInformatif || ""} />
        </h1>
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
        <SectionButtons id="titreInformatif" />
      </div>
    </header>
  );
};

export default Header;
