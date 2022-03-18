import React, { useEffect, useState } from "react";
import { BandeauEditionWithoutVariante } from "./BandeauEditionWithoutVariante";

interface Props {
  typeContenu: "dispositif" | "demarche";
  toggleTutoriel: () => void;
  displayTuto: boolean;
  toggleDispositifValidateModal: () => void;
  toggleDraftModal: () => void;
  tKeyValue: number;
  toggleDispositifCreateModal: () => void;
  isModified: boolean;
  isSaved: boolean;
}
const BandeauEdition = (props: Props) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const visible = currentScrollPos < 70;
      setVisible(visible);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  return (
    <BandeauEditionWithoutVariante
      visible={visible}
      typeContenu={props.typeContenu}
      toggleTutoriel={props.toggleTutoriel}
      isModified={props.isModified}
      isSaved={props.isSaved}
      displayTuto={props.displayTuto}
      toggleDispositifValidateModal={props.toggleDispositifValidateModal}
      toggleDraftModal={props.toggleDraftModal}
      tKeyValue={props.tKeyValue}
      toggleDispositifCreateModal={props.toggleDispositifCreateModal}
    />
  );
};

export default BandeauEdition;
