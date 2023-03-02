import React from "react";
import { useSelector } from "react-redux";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import { themeSelector } from "services/Themes/themes.selectors";
import { Metadatas } from "components/Pages/dispositif";

const Dispositif = () => {
  const dispositif = useSelector(selectedDispositifSelector);
  const theme = useSelector(themeSelector(dispositif?.theme));
  const color100 = theme?.colors.color100 || "#000";

  return (
    <Metadatas
      metadatas={dispositif?.metadatas}
      titreMarque={dispositif?.titreMarque}
      mainSponsor={dispositif?.mainSponsor}
      color={color100}
    />
  );
};

export default Dispositif;
