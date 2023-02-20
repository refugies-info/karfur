import React from "react";
import { useSelector } from "react-redux";
import { Container } from "reactstrap";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import { secondaryThemesSelector, themeSelector } from "services/Themes/themes.selectors";
import SEO from "components/Seo";
import { Metadatas, Accordions, Map, Header, Sponsors, Contributors } from "components/Pages/dispositif";
import RichTextInput from "components/Pages/dispositif/RichTextInput";

interface Props {}

const Dispositif = (props: Props) => {
  const dispositif = useSelector(selectedDispositifSelector);
  const theme = useSelector(themeSelector(dispositif?.theme));
  const secondaryThemes = useSelector(secondaryThemesSelector(dispositif?.secondaryThemes));

  if (!dispositif) return <p>Erreur</p>;

  return (
    <Container className="mx-auto">
      <SEO
        title={dispositif.titreMarque || dispositif.titreInformatif || ""}
        description={dispositif.abstract || ""}
        image={theme?.shareImage.secure_url}
      />
      <Header dispositif={dispositif} theme={theme} secondaryThemes={secondaryThemes} />
      <RichTextInput id="what" value={dispositif.what} />
      <Metadatas metadatas={dispositif.metadatas} />
      {dispositif.typeContenu === "dispositif" ? (
        <div>
          <Accordions content={dispositif.why} sectionKey="why" />
          <Accordions content={dispositif.how} sectionKey="how" />
        </div>
      ) : (
        <div>
          <Accordions content={dispositif.how} sectionKey="how" />
          <Accordions content={dispositif.next} sectionKey="next" />
        </div>
      )}
      <Map markers={dispositif.map} />
      Mercis: {dispositif.merci.length}
      <Contributors contributors={dispositif.participants} />
      <Sponsors mainSponsor={dispositif.mainSponsor} sponsors={dispositif.sponsors} />
    </Container>
  );
};

export default Dispositif;
