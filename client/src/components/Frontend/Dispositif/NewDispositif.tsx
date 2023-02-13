import React from "react";
import { useSelector } from "react-redux";
import { Container } from "reactstrap";
import moment from "moment";
import SEO from "components/Seo";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import { secondaryThemesSelector, themeSelector } from "services/Themes/themes.selectors";
moment.locale("fr");

interface Props {}

const NewDispositif = (props: Props) => {
  const dispositif = useSelector(selectedDispositifSelector);
  const theme = useSelector(themeSelector(dispositif?.theme));
  const secondaryThemes = useSelector(secondaryThemesSelector(dispositif?.secondaryThemes));

  if (!dispositif) return <p>Vide</p>;

  return (
    <Container>
      <SEO
        title={dispositif.titreMarque || dispositif.titreInformatif || ""}
        description={dispositif.abstract || ""}
        image={theme?.shareImage.secure_url}
      />
      <h1>
        <span>{dispositif.titreInformatif}</span>
        <span>{dispositif.titreMarque}</span>
      </h1>
      <p>Theme: {theme?.name.fr}</p>
      <p>
        Secondary Themes:
        {secondaryThemes.map((theme) => (
          <span key={theme._id.toString()}>{theme?.name.fr} /</span>
        ))}
      </p>
      <div dangerouslySetInnerHTML={{ __html: dispositif.what }}></div>
      {/* METADATAS */}
      {dispositif.metadatas.location && (
        <div>
          {dispositif.metadatas.location.map((loc) => (
            <span key={loc}>{loc}</span>
          ))}
        </div>
      )}
      {dispositif.metadatas.frenchLevel && (
        <div>
          {dispositif.metadatas.frenchLevel.map((level) => (
            <span key={level}>{level}</span>
          ))}
        </div>
      )}
      {dispositif.metadatas.important && <div>{dispositif.metadatas.important}</div>}
      {/* {dispositif.metadatas.age && <div>{dispositif.metadatas.important}</div>} */}
      {dispositif.metadatas.price && <div>{dispositif.metadatas.price.value}</div>}
      {dispositif.metadatas.public && <div>{dispositif.metadatas.public}</div>}
      {dispositif.metadatas.duration && <div>{dispositif.metadatas.duration}</div>}
      {dispositif.why &&
        Object.values(dispositif.why).map((section: any, i) => (
          <div key={i}>
            <h2>{section.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: section.text }}></div>
          </div>
        ))}
      {dispositif.how &&
        Object.values(dispositif.how).map((section, i) => (
          <div key={i}>
            <h2>{section.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: section.text }}></div>
          </div>
        ))}
      {dispositif.next &&
        Object.values(dispositif.next).map((section, i) => (
          <div key={i}>
            <h2>{section.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: section.text }}></div>
          </div>
        ))}
      {dispositif.map &&
        dispositif.map.map((poi, i) => (
          <div key={i}>
            {poi.lat}, {poi.lng}
          </div>
        ))}
      Mercis: {dispositif.merci.length}
      Participants: {dispositif.participants.length}
      <h2>Proposé par</h2>
      <div>{dispositif.mainSponsor?.nom}</div>
    </Container>
  );
};

export default NewDispositif;
