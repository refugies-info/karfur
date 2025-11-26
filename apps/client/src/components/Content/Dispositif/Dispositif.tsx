import { ContentType } from "@refugies-info/api-types";
import { useContext, useMemo, useRef } from "react";

import Button from "@codegouvfr/react-dsfr/Button";
import { useWindowSize } from "@refugies-info/ui";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import { Banner, Breadcrumb, Contributors, Section } from "~/components/Pages/dispositif";
import {
  BannerEdition,
  CustomNavbar,
  LeftSidebarEdition,
  MapEdit,
  RightSidebarEdition,
} from "~/components/Pages/dispositif/Edition";
import MapNew from "~/components/Pages/dispositif/MapNew";
import NorthStar from "~/components/Pages/dispositif/NorthStar";
import SEO from "~/components/Seo";
import { useContentLocale, useRtriLinks, useScrolledBottomEvent } from "~/hooks";
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
  const dispositifRef = useRef<HTMLDivElement>(null);
  // Use the hook to ensure all rtri-link class links open in a new tab
  useRtriLinks(dispositifRef);
  const { isTablet, isMobile, isDesktop, isLargeDesktop } = useWindowSize();
  const pageContext = useContext(PageContext);
  const dispositif = useSelector(selectedDispositifSelector);
  const theme = useSelector(themeSelector(dispositif?.theme));
  const { isRTL } = useContentLocale();
  useScrolledBottomEvent(pageContext.mode === "view");
  const { t } = useTranslation();

  const typeContenu = useMemo(
    () => props.typeContenu || dispositif?.typeContenu || ContentType.DISPOSITIF,
    [props.typeContenu, dispositif],
  );

  const isViewMode = useMemo(() => pageContext.mode === "view", [pageContext.mode]);
  const isEditMode = useMemo(() => pageContext.mode === "edit", [pageContext.mode]);
  return (
    <div ref={dispositifRef} className={cn("w-full", isEditMode && "edit")} id="top">
      <SEO
        title={dispositif?.titreMarque || dispositif?.titreInformatif || ""}
        description={dispositif?.abstract || ""}
        image={theme?.shareImage?.secure_url}
      />
      <div
        className={cn("relative pb-8 print:!bg-none")}
        style={{
          background: `linear-gradient(to bottom, ${theme?.gradientColors?.colorTop}, ${theme?.gradientColors?.colorBottom})`,
        }}
        id="top"
      >
        {isEditMode && <CustomNavbar typeContenu={typeContenu} />}
        {isViewMode && <Breadcrumb dispositif={dispositif} />}
        {isViewMode ? <Banner themeId={dispositif?.theme} /> : <BannerEdition />}
        <div className={cn("z-10 container flex gap-10 max-lg:flex-col max-sm:!px-0")}>
          <article
            className="z-10 order-2 flex flex-col pt-[240px] lg:gap-10 lg:pt-[196px] xl:w-[60%] print:w-full print:pt-0"
            dir={isRTL ? undefined : "ltr"}
            aria-labelledby="main-title"
          >
            {dispositif?.origin === "RCO" ? (
              <div className="fr-callout fr-callout--info">
                <p className="fr-callout__text">
                  Ce contenu est généré par intelligence artificielle et est actuellement en cours de validation. Les
                  informations présentées sont fournies à titre indicatif et peuvent ne pas refléter la situation
                  actuelle des dispositifs d'aide.
                </p>
              </div>
            ) : (
              CONTENT_STRUCTURES[typeContenu].map((section, i) => (
                <Section key={i} sectionKey={section} contentType={typeContenu} className={cn(i === 0 && "z-10")} />
              ))
            )}
            {/* TODO: adapt the Map component to be used in edit mode */}
            {isViewMode ? (dispositif?.map || []).length > 0 && <MapNew data={dispositif?.map || []} /> : <MapEdit />}
            {isViewMode && isMobile && (
              <Button
                linkProps={{ href: "#top" }}
                iconId="fr-icon-arrow-up-line"
                priority="tertiary no outline"
                className="w-full bg-white py-8 underline print:!hidden"
              >
                {t("topLink")}
              </Button>
            )}
            {isViewMode && <Contributors />}
          </article>

          {(isDesktop || isLargeDesktop) && (
            <>
              {isViewMode ? (
                <LeftSidebar className="z-10 order-1 max-lg:hidden lg:w-[20%] lg:pt-[371px] print:pt-0" />
              ) : (
                <LeftSidebarEdition className="z-10 order-1 lg:mt-[196px] lg:w-[20%]" typeContenu={typeContenu} />
              )}
            </>
          )}

          {isLargeDesktop && (
            <>
              {isViewMode ? (
                <RightSidebar className="z-10 order-3 lg:w-[20%] lg:pt-[371px] print:hidden" />
              ) : (
                <RightSidebarEdition className="z-10 order-3 lg:w-[20%] lg:pt-[371px]" />
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
