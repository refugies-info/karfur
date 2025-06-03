import { ContentType } from "@refugies-info/api-types";
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
  const { isTablet, isMobile, isDesktop, isLargeDesktop } = useWindowSize();
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
    <div className={cn("w-full", isEditMode && "edit")} id="top">
      <SEO
        title={dispositif?.titreMarque || dispositif?.titreInformatif || ""}
        description={dispositif?.abstract || ""}
        image={theme?.shareImage?.secure_url}
      />
      <div
        className={cn("relative pb-8")}
        style={{
          background: `linear-gradient(to bottom, ${theme?.gradientColors?.colorTop}, ${theme?.gradientColors?.colorBottom})`,
        }}
        id="top"
      >
        {isEditMode && <CustomNavbar typeContenu={typeContenu} />}
        {isViewMode && <Breadcrumb dispositif={dispositif} />}
        {isViewMode ? <Banner themeId={dispositif?.theme} /> : <BannerEdition />}
        <div className={cn("z-10 container flex gap-10 max-lg:flex-col max-sm:!px-0")}>
          {(isDesktop || isLargeDesktop) && (
            <>
              {isViewMode ? (
                <LeftSidebar className="z-10 lg:w-[20%] lg:pt-[371px]" />
              ) : (
                <LeftSidebarEdition className="z-10 lg:mt-[196px] lg:w-[20%]" typeContenu={typeContenu} />
              )}
            </>
          )}

          <article
            className="z-10 flex flex-col pt-[240px] lg:gap-10 lg:pt-[196px] xl:w-[60%]"
            dir={isRTL ? undefined : "ltr"}
          >
            {CONTENT_STRUCTURES[typeContenu].map((section, i) => (
              <Section key={i} sectionKey={section} contentType={typeContenu} className={cn(i === 0 && "z-10")} />
            ))}
            {isViewMode ? (dispositif?.map || []).length > 0 && <Map /> : <MapEdit />}

            {isViewMode && <Contributors />}
          </article>

          {isLargeDesktop && (
            <>
              {isViewMode ? (
                <RightSidebar className="z-10 lg:w-[20%] lg:pt-[371px]" />
              ) : (
                <RightSidebarEdition className="z-10 lg:w-[20%] lg:pt-[371px]" />
              )}
            </>
          )}
        </div>
        {(isMobile || isTablet || isDesktop) && <NorthStar />}
      </div>
    </div>
  );
};

export default Dispositif;
