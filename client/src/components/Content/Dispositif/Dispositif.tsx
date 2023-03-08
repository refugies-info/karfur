import React from "react";
import { useSelector } from "react-redux";
import { ContentType } from "api-types";
import { useWindowSize } from "hooks";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import { secondaryThemesSelector, themeSelector } from "services/Themes/themes.selectors";
import SEO from "components/Seo";
import { Header, Sponsors, Contributors } from "components/Pages/dispositif";
import Section from "components/Pages/dispositif/Section";
import Feedback from "components/Pages/dispositif/Feedback";
import LinkedThemes from "components/Pages/dispositif/LinkedThemes";
import { dispositifNeedsSelector } from "services/Needs/needs.selectors";
import FRLink from "components/UI/FRLink";
import ActionButtons from "components/Pages/dispositif/ActionButtons";
import RightSidebar from "./RightSidebar";
import LeftSidebar from "./LeftSidebar";
import styles from "./Dispositif.module.scss";

interface Props {
  typeContenu?: ContentType;
}

const Dispositif = (props: Props) => {
  const { isTablet } = useWindowSize();
  const dispositif = useSelector(selectedDispositifSelector);
  const theme = useSelector(themeSelector(dispositif?.theme));
  const secondaryThemes = useSelector(secondaryThemesSelector(dispositif?.secondaryThemes));
  const needs = useSelector(dispositifNeedsSelector(dispositif?.needs));

  const typeContenu = props.typeContenu || dispositif?.typeContenu || ContentType.DISPOSITIF;
  const sectionCommonProps = {
    color100: theme?.colors.color100 || "#000",
    color30: theme?.colors.color30 || "#ddd",
    contentType: typeContenu,
  };

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
          {isTablet && <Header dispositif={dispositif} typeContenu={typeContenu} />}
          <LeftSidebar />
        </div>
        <div className={styles.main} id="anchor-what">
          {!isTablet && <Header dispositif={dispositif} typeContenu={typeContenu} />}
          <p>Mise à jour {new Date(dispositif.date).toLocaleDateString()}</p>
          <Section sectionKey="what" content={dispositif?.what} {...sectionCommonProps} />
          {typeContenu === ContentType.DISPOSITIF ? (
            <div>
              <Section accordions={dispositif?.why} sectionKey="why" {...sectionCommonProps} />
              <Section accordions={dispositif?.how} sectionKey="how" {...sectionCommonProps} />
            </div>
          ) : (
            <div>
              <Section accordions={dispositif?.how} sectionKey="how" {...sectionCommonProps} />
              <Section accordions={dispositif?.next} sectionKey="next" {...sectionCommonProps} />
            </div>
          )}
          <Feedback mercis={dispositif?.merci || []} />
          <LinkedThemes theme={theme} secondaryThemes={secondaryThemes} needs={needs} />
          <Sponsors sponsors={dispositif?.sponsors || []} />

          <FRLink href="#top" icon="arrow-upward">
            Haut de page
          </FRLink>
        </div>
        <div className={styles.right}>
          <RightSidebar />
        </div>
      </div>

      {isTablet && <ActionButtons />}

      {dispositif && <Contributors contributors={dispositif.participants} />}
    </div>
  );
};

export default Dispositif;
