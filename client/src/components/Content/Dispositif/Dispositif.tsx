import React, { useContext, useMemo } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { ContentType } from "@refugies-info/api-types";
import { useContentLocale, useScrolledBottomEvent, useWindowSize } from "hooks";
import PageContext from "utils/pageContext";
import { cls } from "lib/classname";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import { themeSelector } from "services/Themes/themes.selectors";
import SEO from "components/Seo";
import {
  Header,
  Sponsors,
  Contributors,
  Section,
  Feedback,
  LinkedThemes,
  ActionButtons,
  Banner,
  Map,
} from "components/Pages/dispositif";
import {
  RightSidebarEdition,
  LeftSidebarEdition,
  CustomNavbar,
  BannerEdition,
  SponsorsEdit,
  MapEdit,
} from "components/Pages/dispositif/Edition";
import FRLink from "components/UI/FRLink";
import RightSidebar from "./RightSidebar";
import LeftSidebar from "./LeftSidebar";
import styles from "./Dispositif.module.scss";

interface Props {
  typeContenu?: ContentType;
}

const CONTENT_STRUCTURES: Record<ContentType, ("what" | "how" | "why" | "next")[]> = {
  [ContentType.DISPOSITIF]: ["what", "why", "how"],
  [ContentType.DEMARCHE]: ["what", "how", "next"],
};

const Dispositif = (props: Props) => {
  const { t } = useTranslation();
  const { isTablet } = useWindowSize();
  const pageContext = useContext(PageContext);
  const dispositif = useSelector(selectedDispositifSelector);
  const theme = useSelector(themeSelector(dispositif?.theme));
  const { isRTL } = useContentLocale();
  useScrolledBottomEvent(pageContext.mode === "view");

  const typeContenu = useMemo(
    () => props.typeContenu || dispositif?.typeContenu || ContentType.DISPOSITIF,
    [props.typeContenu, dispositif],
  );

  const isViewMode = useMemo(() => pageContext.mode === "view", [pageContext.mode]);
  const isEditMode = useMemo(() => pageContext.mode === "edit", [pageContext.mode]);
  return (
    <div className={cls(styles.container, isEditMode && styles.edit)} id="top">
      <SEO
        title={dispositif?.titreMarque || dispositif?.titreInformatif || ""}
        description={dispositif?.abstract || ""}
        image={theme?.shareImage?.secure_url}
      />
      {isEditMode && <CustomNavbar typeContenu={typeContenu} />}
      {isViewMode ? <Banner themeId={dispositif?.theme} /> : <BannerEdition />}
      <div className={styles.content}>
        <div className={styles.left}>
          {isTablet && <Header typeContenu={typeContenu} />}
          {isViewMode ? <LeftSidebar /> : <LeftSidebarEdition typeContenu={typeContenu} />}
        </div>

        <div className={styles.main} dir={isRTL ? undefined : "ltr"}>
          {!isTablet && <Header typeContenu={typeContenu} />}
          {CONTENT_STRUCTURES[typeContenu].map((section, i) => (
            <Section key={i} sectionKey={section} contentType={typeContenu} />
          ))}
          {isViewMode ? (dispositif?.map || []).length > 0 && <Map /> : <MapEdit />}
          {isViewMode && (
            <>
              <Feedback />
              <span className={styles.divider} />
              <LinkedThemes />

              <FRLink href="#top" icon="arrow-upward" className={styles.top}>
                {t("topLink")}
              </FRLink>
            </>
          )}

          <span className={styles.divider} />
          {isViewMode ? <Sponsors sponsors={dispositif?.sponsors} /> : <SponsorsEdit />}
        </div>

        <div className={styles.right}>{isViewMode ? <RightSidebar /> : <RightSidebarEdition />}</div>
      </div>

      {isTablet && <ActionButtons />}
      {isViewMode && <Contributors />}
    </div>
  );
};

export default Dispositif;
