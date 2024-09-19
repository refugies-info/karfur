import { ContentType } from "@refugies-info/api-types";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Metadatas, Summary } from "~/components/Pages/dispositif";
import { selectedDispositifSelector } from "~/services/SelectedDispositif/selectedDispositif.selector";
import { themeSelector } from "~/services/Themes/themes.selectors";

const Dispositif = () => {
  const dispositif = useSelector(selectedDispositifSelector);
  const theme = useSelector(themeSelector(dispositif?.theme));
  const color100 = useMemo(() => theme?.colors.color100 || "#000", [theme]);

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
