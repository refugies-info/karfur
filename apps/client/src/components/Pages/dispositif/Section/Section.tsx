import { ContentType, type InfoSections, type Languages } from "@refugies-info/api-types";
import { useWindowSize } from "@refugies-info/ui";
import { useTranslation } from "next-i18next";
import type React from "react";
import { useContext, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";
import remarkGfm from "remark-gfm";
import { Header, Metadatas } from "~/components/Pages/dispositif";
import { cn } from "~/lib/classname";
import type { RootState } from "~/services/rootReducer";
import { selectedDispositifSelector } from "~/services/SelectedDispositif/selectedDispositif.selector";
import { makeThemeSelector } from "~/services/Themes/themes.selectors";
import PageContext from "~/utils/pageContext";
import Accordions from "../Accordions";
import RichText from "../RichText";
import SectionButtons from "../SectionButtons";
import SectionTitle from "../SectionTitle";

interface Props {
  sectionKey: "what" | "why" | "how" | "next";
  contentType?: ContentType;
  className?: string;
}

const DEFAULT_COLOR_100 = "#000";
const DEFAULT_COLOR_30 = "#ccc";

/**
 * Shows a section of a dispositif. Can display a rich text or InfoSections. Can be used in VIEW or EDIT mode.
 */
const Section = ({ sectionKey, contentType, className }: Props) => {
  const { t, i18n } = useTranslation();
  const dispositif = useSelector(selectedDispositifSelector);
  const pageContext = useContext(PageContext);
  const isViewMode = useMemo(() => pageContext.mode === "view", [pageContext.mode]);
  const { isMobile, isTablet, zoomLevel } = useWindowSize();

  // content
  const contentHtml: string | undefined = useMemo(
    () => (sectionKey === "what" ? dispositif?.[sectionKey] || "" : undefined),
    [sectionKey, dispositif],
  );

  const markdown = useMemo(() => {
    if (sectionKey !== "what") return null;
    if (!dispositif?.origin || dispositif.origin === "RI") return null;
    const translationContent = dispositif.translations?.[i18n.language as Languages]?.content;
    return (
      dispositif.markdown ||
      (translationContent && "markdown" in translationContent
        ? translationContent.markdown
        : undefined)
    );
  }, [sectionKey, dispositif, i18n.language]);

  const contentAccordions: InfoSections | undefined = useMemo(
    () => (sectionKey !== "what" ? dispositif?.[sectionKey] : undefined),
    [sectionKey, dispositif],
  );

  if (
    sectionKey !== "what" &&
    (!contentAccordions || Object.keys(contentAccordions).length === 0)
  ) {
    return null;
  }

  // colors
  const selectTheme = useMemo(makeThemeSelector, []);
  const theme = useSelector((state: RootState) => selectTheme(state, dispositif?.theme));
  const colors = useMemo(
    () => ({
      color100: theme?.colors.color100 || DEFAULT_COLOR_100,
      color30: theme?.colors.color30 || DEFAULT_COLOR_30,
    }),
    [theme],
  );

  return (
    <>
      <section
        id={`anchor-${sectionKey}`}
        className={cn(
          "lg:shadow-ri relative bg-white p-4 lg:p-14 print:shadow-none",
          sectionKey === "what" && "max-lg:bg-transparent",
          className,
        )}
        style={{ "--theme-color": colors.color100 } as React.CSSProperties}
      >
        {sectionKey === "what" ? (
          <>
            <Header typeContenu={contentType || ContentType.DISPOSITIF} />
            {contentHtml && isViewMode && !markdown && (
              <SectionButtons id={sectionKey} className="mb-6 md:hidden" content={contentHtml} />
            )}
            {markdown ? (
              <div className="prose no-dsfr">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
              </div>
            ) : (
              <RichText id={sectionKey} value={contentHtml} />
            )}
          </>
        ) : (
          <>
            <SectionTitle titleKey={sectionKey} className="mb-8" />
            <Accordions
              content={contentAccordions}
              sectionKey={sectionKey as "why" | "how" | "next"}
              contentType={contentType || ContentType.DISPOSITIF}
            />
          </>
        )}
      </section>

      {(isMobile || isTablet || zoomLevel >= 175) && sectionKey === "what" && (
        <Metadatas className="bg-white px-4 py-8 print:hidden" />
      )}
    </>
  );
};

export default Section;
