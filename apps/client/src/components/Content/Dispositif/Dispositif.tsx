import { ContentType } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import { useContext, useMemo } from "react";

import { useSelector } from "react-redux";
import { Banner, Breadcrumb, Contributors, Map, Section } from "~/components/Pages/dispositif";
import {
  BannerEdition,
  CustomNavbar,
  LeftSidebarEdition,
  MapEdit,
  RightSidebarEdition,
} from "~/components/Pages/dispositif/Edition";
import NorthStar from "~/components/Pages/dispositif/NorthStar";
import SEO from "~/components/Seo";
import { useContentLocale, useScrolledBottomEvent, useWindowSize } from "~/hooks";
import { cn } from "~/lib/classname";
import { selectedDispositifSelector } from "~/services/SelectedDispositif/selectedDispositif.selector";
import { themeSelector } from "~/services/Themes/themes.selectors";
import PageContext from "~/utils/pageContext";
import styles from "./Dispositif.module.scss";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";

interface Props {
  typeContenu?: ContentType;
}

const CONTENT_STRUCTURES: Record<ContentType, ("what" | "how" | "why" | "next")[]> = {
  [ContentType.DISPOSITIF]: ["what", "why", "how"],
  [ContentType.DEMARCHE]: ["what", "how", "next"],
};

const Dispositif = (props: Props) => {
  const { t } = useTranslation();
  const { isTablet, isMobile } = useWindowSize();
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
    <div className={cn("w-full", styles.container, isEditMode && styles.edit)} id="top">
      <SEO
        title={dispositif?.titreMarque || dispositif?.titreInformatif || ""}
        description={dispositif?.abstract || ""}
        image={theme?.shareImage?.secure_url}
      />
      <div
        className={cn("pb-8", styles.container, isEditMode && styles.edit, "relative")}
        style={{
          background: `linear-gradient(to bottom, ${theme?.gradientColors?.colorTop}, ${theme?.gradientColors?.colorBottom})`,
        }}
        id="top"
      >
        {isEditMode && <CustomNavbar typeContenu={typeContenu} />}
        {isViewMode && <Breadcrumb dispositif={dispositif} />}
        {isViewMode ? <Banner themeId={dispositif?.theme} /> : <BannerEdition />}
        <div className={cn("z-10 container flex gap-10 max-sm:flex-col max-sm:!px-0")}>
          {isViewMode ? (
            <LeftSidebar className="z-10 md:w-[20%] md:pt-[371px]" />
          ) : (
            <LeftSidebarEdition className="z-10 md:mt-[196px] md:w-[20%]" typeContenu={typeContenu} />
          )}

          <article className="z-10 flex flex-col md:w-[60%] md:gap-10 md:pt-[196px]" dir={isRTL ? undefined : "ltr"}>
            {CONTENT_STRUCTURES[typeContenu].map((section, i) => (
              <Section key={i} sectionKey={section} contentType={typeContenu} className={cn(i === 0 && "z-10")} />
            ))}
            {isViewMode ? (dispositif?.map || []).length > 0 && <Map /> : <MapEdit />}

            {isViewMode && <Contributors />}
          </article>

          {isViewMode ? (
            <RightSidebar className="z-10 md:w-[20%] md:pt-[371px]" />
          ) : (
            <RightSidebarEdition className="z-10 md:w-[20%] md:pt-[371px]" />
          )}
        </div>
        {isTablet && <NorthStar />}
      </div>
    </div>
  );
};

export default Dispositif;
