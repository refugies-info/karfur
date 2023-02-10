import React from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import SEO from "components/Seo";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import { themeSelector } from "services/Themes/themes.selectors";
moment.locale("fr");

interface Props {}

const NewDispositif = (props: Props) => {
  const dispositif = useSelector(selectedDispositifSelector) as any; // TODO: type
  const theme = useSelector(themeSelector(dispositif.theme));

  if (!dispositif) return <p>Vide</p>;

  return (
    <div>
      <SEO
        title={dispositif.titreMarque || dispositif.titreInformatif || ""}
        description={dispositif.abstract || ""}
        image={dispositif?.theme?.shareImage?.secure_url}
      />

      <h1>
        <span>{dispositif.titreInformatif}</span>
        <span>{dispositif.titreMarque}</span>
      </h1>

      <p>Theme: {theme?.name.fr}</p>

      <div dangerouslySetInnerHTML={{ __html: dispositif.what }}></div>

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
    </div>
  );
};

export default NewDispositif;
