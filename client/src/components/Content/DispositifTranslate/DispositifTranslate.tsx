import React, { useMemo, useCallback, useContext, useEffect, useRef } from "react";
import { Col, Row } from "reactstrap";
import { useSelector } from "react-redux";
import get from "lodash/get";
import { ContentType, GetTraductionsForReviewResponse, TranslationContent } from "api-types";
import { useContentLocale } from "hooks";
import { useDispositifTranslation } from "hooks/dispositif";
import PageContext from "utils/pageContext";
import { cls } from "lib/classname";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import { themeSelector } from "services/Themes/themes.selectors";
import { TranslationInput } from "components/Pages/dispositif/Translation";
import SEO from "components/Seo";
import { Header, Section, Banner, SectionTitle } from "components/Pages/dispositif";
import { CustomNavbar } from "components/Pages/dispositif/Edition";
import FRLink from "components/UI/FRLink";
import { filterAndTransformTranslations, keys, transformOneTranslation } from "./functions";
import styles from "./DispositifTranslate.module.scss";

interface Props {
  typeContenu?: ContentType;
  traductions: GetTraductionsForReviewResponse;
  defaultTraduction: TranslationContent;
}

const CONTENT_STRUCTURES: Record<ContentType, ("what" | "how" | "why" | "next")[]> = {
  [ContentType.DISPOSITIF]: ["what", "why", "how"],
  [ContentType.DEMARCHE]: ["what", "how", "next"],
};

const Dispositif = (props: Props) => {
  const { defaultTraduction, traductions } = props;
  const dispositifSections = useMemo(() => keys(defaultTraduction), [defaultTraduction]);
  const dispositif = useSelector(selectedDispositifSelector);
  const theme = useSelector(themeSelector(dispositif?.theme));
  const { isRTL } = useContentLocale();
  const { locale, myTranslation, translations, validate } = useDispositifTranslation(traductions);
  const pageContext = useContext(PageContext);

  const typeContenu = useMemo(
    () => props.typeContenu || dispositif?.typeContenu || ContentType.DISPOSITIF,
    [props.typeContenu, dispositif],
  );

  const getInputProps = useCallback(
    (section: string) => {
      return {
        section: section,
        initialText: get(defaultTraduction, section),
        mySuggestion: transformOneTranslation(section, myTranslation),
        suggestions: filterAndTransformTranslations(section, translations),
        locale: locale,
        validate: validate,
      };
    },
    [defaultTraduction, translations, locale, validate, myTranslation],
  );

  // Scroll when section active
  const refContent = useRef<any>(null);
  useEffect(() => {
    if (pageContext.activeSection) {
      refContent.current?.querySelector(`[data-section="${pageContext.activeSection}"]`)?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [pageContext.activeSection]);

  return (
    <div className={cls(styles.container)} id="top">
      <SEO
        title={dispositif?.titreMarque || dispositif?.titreInformatif || ""}
        description={dispositif?.abstract || ""}
        image={theme?.shareImage?.secure_url}
      />
      <CustomNavbar typeContenu={typeContenu} />
      <Row className="gx-0">
        <Col xs="6" className={cls(styles.col, "bg-white")}>
          <div>
            <Banner themeId={dispositif?.theme} />
            <div className={styles.main} dir={isRTL ? undefined : "ltr"}>
              <TranslationInput {...getInputProps("content.titreInformatif")} />
              {CONTENT_STRUCTURES[typeContenu].map((section, i) => (
                <section key={i}>
                  <SectionTitle titleKey={section} />
                  {section === "what" ? (
                    <TranslationInput {...getInputProps("content.what")} />
                  ) : (
                    dispositifSections
                      .filter((s) => s.startsWith(`content.${section}`))
                      .map((s) => <TranslationInput {...getInputProps(s)} key={s} />)
                  )}
                </section>
              ))}

              <TranslationInput {...getInputProps("content.abstract")} />

              <FRLink href="#top" icon="arrow-upward" className={styles.top}>
                Haut de page
              </FRLink>
            </div>
          </div>
        </Col>

        <Col xs="6" className={styles.col}>
          <div ref={refContent}>
            <Banner themeId={dispositif?.theme} />

            <div className={styles.main} id="anchor-what" dir={isRTL ? undefined : "ltr"}>
              <Header typeContenu={typeContenu} />
              {CONTENT_STRUCTURES[typeContenu].map((section, i) => (
                <Section key={i} sectionKey={section} contentType={typeContenu} />
              ))}

              <p>{dispositif?.abstract}</p>

              <FRLink href="#top" icon="arrow-upward" className={styles.top}>
                Haut de page
              </FRLink>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Dispositif;
