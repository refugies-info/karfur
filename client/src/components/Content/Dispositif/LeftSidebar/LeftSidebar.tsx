import React from "react";
import { useSelector } from "react-redux";
import { ContentType } from "api-types";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import { themeSelector } from "services/Themes/themes.selectors";
import { Metadatas } from "components/Pages/dispositif";
import Summary from "components/Pages/dispositif/Summary";

const Dispositif = () => {
  const dispositif = useSelector(selectedDispositifSelector);
  const theme = useSelector(themeSelector(dispositif?.theme));
  const color100 = theme?.colors.color100 || "#000";

  return (
    <>
      <Summary />
      <Metadatas
        metadatas={dispositif?.metadatas}
        titreMarque={dispositif?.titreMarque}
        mainSponsor={dispositif?.mainSponsor}
        color={color100}
        typeContenu={dispositif?.typeContenu || ContentType.DISPOSITIF}
      />
    </>
  );
};

export default Dispositif;
