/**
 * Section — Renders one section of a dispositif detail page (web client).
 *
 * A dispositif page is divided into 4 possible sections:
 *   - **what** : "C'est quoi ?" — main content (rich text or markdown)
 *   - **why**  : "Pourquoi c'est intéressant ?" — accordions (RI only)
 *   - **how**  : "Comment j'y accède ?" — step-by-step accordions (RI only)
 *   - **next** : "Et après ?" — engagement accordions (RI only)
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                     RENDERING BY CONTENT ORIGIN                        │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │                                                                         │
 * │  RI (structured content):                                               │
 * │    "what"           → RichText (dangerouslySetInnerHTML)                │
 * │    "how/why/next"   → Accordions (collapsible InfoSections)             │
 * │                                                                         │
 * │  RCO (markdown content):                                                │
 * │    "what"           → ReactMarkdown with remark plugins                 │
 * │                        remarkGfm        → tables, strikethrough, etc.   │
 * │                        remarkDirective  → :::toggle, :::important, etc. │
 * │                        remarkRestoreHierarchy → fixes flat AST nesting  │
 * │                        remarkDirectiveToComponent → React components    │
 * │    "how/why/next"   → null (RCO has no structured sections)             │
 * │                                                                         │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * The "what" section also includes:
 * - Header (dispositif title, abstract, badges)
 * - SectionButtons (mobile share/listen buttons)
 * - Metadatas sidebar (displayed inline on mobile/tablet or zoom >= 175%)
 */

import { ContentType, type InfoSections } from "@refugies-info/api-types";
import { markdownToReadableText, remarkRestoreHierarchy } from "@refugies-info/markdown-utils";
import { useWindowSize } from "@refugies-info/ui";
import { useTranslation } from "next-i18next";
import type React from "react";
import { useContext, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";
import { Header, Metadatas } from "~/components/Pages/dispositif";
import { cn } from "~/lib/classname";
import { getDispositifMarkdown } from "~/lib/dispositif";
import {
  getDirectiveComponents,
  remarkDirectiveToComponent,
} from "~/lib/markdown/directive-to-component";
import type { RootState } from "~/services/rootReducer";
import { selectedDispositifSelector } from "~/services/SelectedDispositif/selectedDispositif.selector";
import { makeThemeSelector } from "~/services/Themes/themes.selectors";
import PageContext from "~/utils/pageContext";
import Accordions from "../Accordions";
import RichText from "../RichText";
import SectionButtons from "../SectionButtons";
import SectionTitle from "../SectionTitle";

interface Props {
  /** Which section to render. Determines content source and layout. */
  sectionKey: "what" | "why" | "how" | "next";
  /** Dispositif or demarche — affects step numbering in "how" accordions. */
  contentType?: ContentType;
  /** Additional CSS classes for the section wrapper. */
  className?: string;
}

/** Fallback theme colors when no theme is assigned to the dispositif. */
const DEFAULT_COLOR_100 = "#000";
const DEFAULT_COLOR_30 = "#ccc";

/**
 * Renders a single section of a dispositif detail page.
 *
 * Handles two distinct content pipelines:
 * 1. **RI** (Refugies.info origin): HTML string → RichText or structured InfoSections → Accordions
 * 2. **RCO** (Content Playground origin): Markdown string → ReactMarkdown with remark plugins
 */
const Section = ({ sectionKey, contentType, className }: Props) => {
  const { t, i18n } = useTranslation();
  const dispositif = useSelector(selectedDispositifSelector);
  const pageContext = useContext(PageContext);
  const isViewMode = useMemo(() => pageContext.mode === "view", [pageContext.mode]);
  const { isMobile, isTablet, zoomLevel } = useWindowSize();

  /**
   * HTML content for the "what" section (RI dispositifs only).
   * Undefined for other sections (they use contentAccordions instead).
   */
  const contentHtml: string | undefined = useMemo(
    () => (sectionKey === "what" ? dispositif?.[sectionKey] || "" : undefined),
    [sectionKey, dispositif],
  );

  /**
   * Raw markdown content for RCO dispositifs.
   *
   * Only used for the "what" section: RCO has no structured how/why/next.
   * Null for RI dispositifs, they use contentHtml instead.
   */
  const markdown = useMemo(
    () => (sectionKey === "what" ? getDispositifMarkdown(dispositif, i18n.language) : null),
    [sectionKey, dispositif, i18n.language],
  );

  const listenableContent = useMemo(
    () => (markdown ? markdownToReadableText(markdown) : contentHtml || ""),
    [markdown, contentHtml],
  );

  /**
   * Structured accordion content for how/why/next sections (RI only).
   * Each entry has a title and rich-text body.
   * Undefined for the "what" section.
   */
  const contentAccordions: InfoSections | undefined = useMemo(
    () => (sectionKey !== "what" ? dispositif?.[sectionKey] : undefined),
    [sectionKey, dispositif],
  );

  /** In view mode, hide empty accordion sections (no content = nothing to show). */
  if (
    isViewMode &&
    sectionKey !== "what" &&
    (!contentAccordions || Object.keys(contentAccordions).length === 0)
  ) {
    return null;
  }

  /** Resolve theme colors for headings, accordion borders, etc. */
  const selectTheme = useMemo(makeThemeSelector, []);
  const theme = useSelector((state: RootState) => selectTheme(state, dispositif?.theme));
  const colors = useMemo(
    () => ({
      color100: theme?.colors.color100 || DEFAULT_COLOR_100,
      color30: theme?.colors.color30 || DEFAULT_COLOR_30,
    }),
    [theme],
  );

  /*
   * Layout:
   *
   *  <section id="anchor-what|how|why|next">
   *
   *    sectionKey === "what":
   *    ├── Header (title, abstract, badges, source card)
   *    ├── SectionButtons (share/listen — mobile only)
   *    └── Content:
   *        ├── RCO → ReactMarkdown with remark plugin chain
   *        │         (remarkGfm → remarkDirective → remarkRestoreHierarchy
   *        │          → remarkDirectiveToComponent → getDirectiveComponents)
   *        └── RI  → RichText (dangerouslySetInnerHTML from server HTML)
   *
   *    sectionKey === "how|why|next":
   *    ├── SectionTitle ("Comment j'y accède ?", etc.)
   *    └── Accordions (InfoSections, RI only — RCO returns null earlier)
   *
   *  </section>
   *
   *  + Metadatas (inline below "what" on mobile/tablet/high-zoom)
   */
  return (
    <>
      {/* Anchor id for in-page navigation (sidebar links scroll to #anchor-what, etc.) */}
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
            {/* Dispositif header: title, abstract, badges (RI/RCO), source card */}
            <Header typeContenu={contentType || ContentType.DISPOSITIF} />

            {/* Mobile share/listen buttons. RCO reads its markdown as plain text. */}
            {isViewMode && listenableContent && (
              <SectionButtons
                id={sectionKey}
                className="mb-6 md:hidden"
                content={listenableContent}
              />
            )}

            {markdown ? (
              /*
               * RCO markdown pipeline:
               * remarkGfm                  → GFM extensions (tables, strikethrough)
               * remarkDirective             → parse :::toggle, :::important, :::good-to-know
               * remarkRestoreHierarchy      → fix flat AST: nest content inside directives
               * remarkDirectiveToComponent  → transform directives to hast (React-renderable)
               * getDirectiveComponents(t)   → React components (RIAccordion, CallOut, etc.)
               *
               * "prose no-dsfr" → Tailwind prose for typography, no-dsfr to avoid DSFR overrides
               * "section-markdown" → custom styles for RCO-specific spacing and layout
               */
              <div className="prose no-dsfr section-markdown">
                <ReactMarkdown
                  remarkPlugins={[
                    remarkGfm,
                    remarkDirective,
                    remarkRestoreHierarchy,
                    remarkDirectiveToComponent,
                  ]}
                  components={getDirectiveComponents(t)}
                >
                  {markdown}
                </ReactMarkdown>
              </div>
            ) : (
              /* RI HTML content: rendered as-is via dangerouslySetInnerHTML */
              <RichText id={sectionKey} value={contentHtml} />
            )}
          </>
        ) : (
          /* Non-"what" sections: title + collapsible accordions (RI only) */
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

      {/*
       * Metadatas sidebar: on desktop it's rendered in the page layout (aside).
       * On mobile/tablet (or high zoom ≥175%), it's shown inline below the "what" section.
       */}
      {(isMobile || isTablet || zoomLevel >= 175) && sectionKey === "what" && (
        <Metadatas className="bg-white px-4 py-8 print:hidden" />
      )}
    </>
  );
};

export default Section;
