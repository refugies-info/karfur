import React, { useContext, useMemo } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { ContentType, InfoSections } from "api-types";
import { getDispositifSectionTitle } from "lib/getDispositifSectionTitle";
import PageContext from "utils/pageContext";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import { themeSelector } from "services/Themes/themes.selectors";
import Accordions from "../Accordions";
import RichText from "../RichText";
import SectionButtons from "../SectionButtons";
import SectionTitle from "../SectionTitle";
import styles from "./Section.module.scss";

interface Props {
  sectionKey: "what" | "why" | "how" | "next";
  contentType?: ContentType;
}

const DEFAULT_COLOR_100 = "#000";
const DEFAULT_COLOR_30 = "#ccc";

/**
 * Shows a section of a dispositif. Can display a rich text or InfoSections. Can be used in VIEW or EDIT mode.
 */
const Section = ({ sectionKey, contentType }: Props) => {
  const { t } = useTranslation();
  const dispositif = useSelector(selectedDispositifSelector);
  const pageContext = useContext(PageContext);
  const isViewMode = useMemo(() => pageContext.mode === "view", [pageContext.mode]);

  // content
  const contentHtml: string | undefined = useMemo(
    () => (sectionKey === "what" ? dispositif?.[sectionKey] || "" : undefined),
    [sectionKey, dispositif],
  );
  const contentAccordions: InfoSections | undefined = useMemo(
    () => (sectionKey !== "what" ? dispositif?.[sectionKey] : undefined),
    [sectionKey, dispositif],
  );

  // colors
  const theme = useSelector(themeSelector(dispositif?.theme));
  const colors = useMemo(
    () => ({
      color100: theme?.colors.color100 || DEFAULT_COLOR_100,
      color30: theme?.colors.color30 || DEFAULT_COLOR_30,
    }),
    [theme],
  );

  return (
    <section className={styles.container} id={`anchor-${sectionKey}`}>
      <SectionTitle titleKey={sectionKey} />
      {contentHtml !== undefined ? (
        <>
          <RichText id={sectionKey} value={contentHtml} />
          {contentHtml && isViewMode && (
            <SectionButtons
              id={sectionKey}
              content={{ title: t(getDispositifSectionTitle(sectionKey)), text: contentHtml }}
            />
          )}
        </>
      ) : (
        <Accordions
          content={contentAccordions}
          sectionKey={sectionKey as "why" | "how" | "next"}
          color100={colors.color100}
          color30={colors.color30}
          contentType={contentType || ContentType.DISPOSITIF}
        />
      )}
    </section>
  );
};

export default Section;
