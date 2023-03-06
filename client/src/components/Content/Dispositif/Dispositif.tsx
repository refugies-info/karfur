import React from "react";
import { useSelector } from "react-redux";
import { ContentType } from "api-types";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import { secondaryThemesSelector, themeSelector } from "services/Themes/themes.selectors";
import SEO from "components/Seo";
import { Header, Sponsors, Contributors } from "components/Pages/dispositif";
import styles from "./Dispositif.module.scss";
import Section from "components/Pages/dispositif/Section";
import Feedback from "components/Pages/dispositif/Feedback";
import LinkedThemes from "components/Pages/dispositif/LinkedThemes";
import { dispositifNeedsSelector } from "services/Needs/needs.selectors";
import FRLink from "components/UI/FRLink";
import RightSidebar from "./RightSidebar";
import LeftSidebar from "./LeftSidebar";

interface Props {
  typeContenu?: ContentType;
}

const Dispositif = (props: Props) => {
  const dispositif = useSelector(selectedDispositifSelector);
  const theme = useSelector(themeSelector(dispositif?.theme));
  const secondaryThemes = useSelector(secondaryThemesSelector(dispositif?.secondaryThemes));
  const needs = useSelector(dispositifNeedsSelector(dispositif?.needs));

  const typeContenu = props.typeContenu || dispositif?.typeContenu || ContentType.DISPOSITIF;
  const color100 = theme?.colors.color100 || "#000";
  const color30 = theme?.colors.color30 || "#ddd";

  return (
    <div className={styles.container} id="top">
      <SEO
        title={dispositif?.titreMarque || dispositif?.titreInformatif || ""}
        description={dispositif?.abstract || ""}
        image={theme?.shareImage.secure_url}
      />
      <div className={styles.banner} style={{ backgroundImage: `url(${theme?.banner.secure_url})` }}></div>

      <div className={styles.content}>
        <div className={styles.left}>
          <LeftSidebar />
        </div>
        <div className={styles.main}>
          <Header dispositif={dispositif} typeContenu={typeContenu} />
          <Section sectionKey="what" content={dispositif?.what} color100={color100} color30={color30} />
          {typeContenu === ContentType.DISPOSITIF ? (
            <div>
              <Section accordions={dispositif?.why} sectionKey="why" color100={color100} color30={color30} />
              <Section accordions={dispositif?.how} sectionKey="how" color100={color100} color30={color30} />
            </div>
          ) : (
            <div>
              <Section accordions={dispositif?.how} sectionKey="how" color100={color100} color30={color30} />
              <Section accordions={dispositif?.next} sectionKey="next" color100={color100} color30={color30} />
            </div>
          )}
          <Feedback mercis={dispositif.merci} />
          <LinkedThemes theme={theme} secondaryThemes={secondaryThemes} needs={needs} />
          <Sponsors sponsors={dispositif.sponsors} />

          <FRLink href="#top" icon="arrow-upward">
            Haut de page
          </FRLink>
        </div>
        <div className={styles.right}>
          <RightSidebar />
        </div>
      </div>

      {dispositif && <Contributors contributors={dispositif.participants} />}
    </div>
  );
};

export default Dispositif;
