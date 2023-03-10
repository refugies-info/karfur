import React, { useContext, useMemo } from "react";
import { useSelector } from "react-redux";
import { ContentType } from "api-types";
import { useWindowSize } from "hooks";
import PageContext from "utils/pageContext";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import { secondaryThemesSelector, themeSelector } from "services/Themes/themes.selectors";
import { dispositifNeedsSelector } from "services/Needs/needs.selectors";
import SEO from "components/Seo";
import {
  Header,
  Sponsors,
  Contributors,
  Section,
  Feedback,
  LinkedThemes,
  ActionButtons,
} from "components/Pages/dispositif";
import { RightSidebarEdition, LeftSidebarEdition, MetaDescription } from "components/Pages/dispositif/Edition";
import FRLink from "components/UI/FRLink";
import RightSidebar from "./RightSidebar";
import LeftSidebar from "./LeftSidebar";
import styles from "./Dispositif.module.scss";

interface Props {
  typeContenu?: ContentType;
}

const Dispositif = (props: Props) => {
  const { isTablet } = useWindowSize();
  const pageContext = useContext(PageContext);
  const dispositif = useSelector(selectedDispositifSelector);
  const theme = useSelector(themeSelector(dispositif?.theme));
  const secondaryThemes = useSelector(secondaryThemesSelector(dispositif?.secondaryThemes));
  const needs = useSelector(dispositifNeedsSelector(dispositif?.needs));

  const typeContenu = useMemo(
    () => props.typeContenu || dispositif?.typeContenu || ContentType.DISPOSITIF,
    [props.typeContenu, dispositif],
  );
  const sectionCommonProps = useMemo(
    () => ({
      color100: theme?.colors.color100 || "#000",
      color30: theme?.colors.color30 || "#ddd",
      contentType: typeContenu,
    }),
    [typeContenu, theme],
  );

  const isViewMode = pageContext.mode === "view";
  const isEditMode = pageContext.mode === "edit";
  return (
    <div className={styles.container} id="top">
      <SEO
        title={dispositif?.titreMarque || dispositif?.titreInformatif || ""}
        description={dispositif?.abstract || ""}
        image={theme?.shareImage.secure_url}
      />
      <div
        className={styles.banner}
        style={theme?.banner.secure_url ? { backgroundImage: `url(${theme?.banner.secure_url})` } : {}}
      ></div>

      <div className={styles.content}>
        <div className={styles.left}>
          {isTablet && <Header dispositif={dispositif} typeContenu={typeContenu} />}
          {isViewMode ? <LeftSidebar /> : <LeftSidebarEdition />}
        </div>
        <div className={styles.main} id="anchor-what">
          {!isTablet && <Header dispositif={dispositif} typeContenu={typeContenu} />}
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

          {isViewMode && (
            <>
              <Feedback mercis={dispositif?.merci || []} />
              <span className={styles.divider} />
              <LinkedThemes theme={theme} secondaryThemes={secondaryThemes} needs={needs} />

              <FRLink href="#top" icon="arrow-upward" className={styles.top}>
                Haut de page
              </FRLink>
            </>
          )}

          {isEditMode && <MetaDescription color={sectionCommonProps.color100} content={dispositif?.abstract} />}
          <span className={styles.divider} />
          <Sponsors sponsors={dispositif?.sponsors || []} />
        </div>
        <div className={styles.right}>{isViewMode ? <RightSidebar /> : <RightSidebarEdition />}</div>
      </div>

      {isTablet && <ActionButtons />}

      {dispositif && <Contributors contributors={dispositif.participants} />}
    </div>
  );
};

export default Dispositif;
