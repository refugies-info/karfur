import React from "react";
import { useSelector } from "react-redux";
import { Container } from "reactstrap";
import SEO from "components/Seo";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import { secondaryThemesSelector, themeSelector } from "services/Themes/themes.selectors";
import { Metadatas, Accordions, Map, Header, Sponsors } from "components/Pages/dispositif";

interface Props {}

const NewDispositif = (props: Props) => {
  const dispositif = useSelector(selectedDispositifSelector);
  const theme = useSelector(themeSelector(dispositif?.theme));
  const secondaryThemes = useSelector(secondaryThemesSelector(dispositif?.secondaryThemes));

  if (!dispositif) return <p>Erreur</p>;

  return (
    <Container>
      <SEO
        title={dispositif.titreMarque || dispositif.titreInformatif || ""}
        description={dispositif.abstract || ""}
        image={theme?.shareImage.secure_url}
      />
      <Header dispositif={dispositif} theme={theme} secondaryThemes={secondaryThemes} />
      <div dangerouslySetInnerHTML={{ __html: dispositif.what }}></div>
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
      Participants: {dispositif.participants.length}
      <Sponsors mainSponsor={dispositif.mainSponsor} sponsors={dispositif.sponsors} />
    </Container>
  );
};

export default NewDispositif;
