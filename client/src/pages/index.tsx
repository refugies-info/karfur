import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { Button, Col, Container, Row } from "reactstrap";
import { cls } from "lib/classname";
import { defaultStaticPropsWithThemes } from "lib/getDefaultStaticProps";
import isInBrowser from "lib/isInBrowser";
import { themesSelector } from "services/Themes/themes.selectors";
import SEO from "components/Seo";
import { useRTL, useWindowSize } from "hooks";
import { toggleNewsletterModalAction } from "services/Miscellaneous/miscellaneous.actions";
import MobileAppSection from "components/Pages/homepage/MobileAppSection";
import commonStyles from "scss/components/staticPages.module.scss";
import styles from "scss/pages/homepage.module.scss";
import ThemesGrid from "components/Content/ThemesGrid/ThemesGrid";
import { ObjectId } from "mongodb";
import { activeDispositifsSelector } from "services/ActiveDispositifs/activeDispositifs.selector";
import CardSlider from "components/Pages/recherche/CardSlider";
import { Accordion, Card } from "components/Pages/staticPages/common";
import WhyImage1 from "assets/staticPages/publier/why-image-1.png";
import WhyImage2 from "assets/staticPages/publier/why-image-2.png";
import WhyImage3 from "assets/staticPages/publier/why-image-3.png";
import WhyImage4 from "assets/staticPages/publier/why-image-4.png";
import RequiredIcon1 from "assets/staticPages/publier/required-icon-1.png";
import RequiredIcon2 from "assets/staticPages/publier/required-icon-2.png";
import RequiredIcon3 from "assets/staticPages/publier/required-icon-3.png";
import { CountUpFigure } from "components/Pages/staticPages/publier";
interface Props {}

const Homepage = (props: Props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const router = useRouter();
  const themes = useSelector(themesSelector);
  const { isTablet } = useWindowSize();
  const allDispositifs = useSelector(activeDispositifsSelector);
  const isRTL = useRTL();

  useEffect(() => {
    if (isInBrowser() && new URLSearchParams(window.location.search).get("newsletter") === "") {
      dispatch(toggleNewsletterModalAction(true));
    }
  }, []);

  const navigateTheme = (themeId: ObjectId) => {};
  const navigateType = (type: string) => {};

  const demarches = useMemo(() => allDispositifs.slice(0, 15), [allDispositifs]);
  const dispositifs = useMemo(() => allDispositifs.slice(0, 15), [allDispositifs]);

  return (
    <div className={commonStyles.main}>
      <SEO title="Accueil" description={t("Homepage.title")} />

      <div className={styles.hero}>
        <Container className={cls(commonStyles.container)}>
          <h1>Titre</h1>
        </Container>
      </div>

      <div className={cls(commonStyles.section, commonStyles.bg_grey)}>
        <ThemesGrid className={commonStyles.container} onClickTheme={(themeId) => navigateTheme(themeId)} />
      </div>

      <MobileAppSection />

      <div className={cls(commonStyles.section)}>
        <Container className={commonStyles.container}>
          <div className={styles.title_line}>
            <h2 className="h3">{t("Recherche.titleNewDemarches", "Nouveautés dans les fiches démarches")}</h2>
            <Button onClick={() => navigateType("demarche")}>{t("Recherche.seeAllButton", "Voir tout")}</Button>
          </div>
          <CardSlider cards={demarches} type="demarche" />
          <div className={styles.title_line}>
            <h2 className="h3">{t("Recherche.titleNewDispositifs", "Nouveautés dans les fiches dispositifs")}</h2>
            <Button onClick={() => navigateType("dispositif")}>{t("Recherche.seeAllButton", "Voir tout")}</Button>
          </div>
          <CardSlider cards={dispositifs} type="dispositif" />
        </Container>
      </div>

      <div className={cls(commonStyles.section)}>
        <Container className={commonStyles.container}>
          <h2 className={styles.title2}>Utilisation</h2>
          <Accordion
            items={[
              { title: t("Publish.whyAccordionTitle1"), text: t("Publish.whyAccordionText1"), image: WhyImage1 },
              { title: t("Publish.whyAccordionTitle2"), text: t("Publish.whyAccordionText2"), image: WhyImage2 },
              { title: t("Publish.whyAccordionTitle3"), text: t("Publish.whyAccordionText3"), image: WhyImage3 },
              { title: t("Publish.whyAccordionTitle4"), text: t("Publish.whyAccordionText4"), image: WhyImage4 }
            ]}
            withImages
            initOpen
            multiOpen={!!isTablet}
          />
        </Container>
      </div>

      <div className={cls(commonStyles.section, commonStyles.bg_red)}>
        <Container className={commonStyles.container}>
          <Row>
            <Col></Col>
            <Col>
              <h2 className={styles.title2}>Utilisation</h2>
            </Col>
          </Row>
        </Container>
      </div>

      <div className={cls(commonStyles.section, commonStyles.bg_grey)}>
        <Container className={commonStyles.container}>
          <h2 className={cls(commonStyles.title2, commonStyles.center)}>{t("Publish.requiredTitle")}</h2>
          <Row>
            <Col sm="12" lg="4" className="mb-lg-0 mb-5">
              <Card image={RequiredIcon1} title={t("Publish.requiredSubtitle1")}>
                <p className="mb-0">{t("Publish.requiredText1")}</p>
              </Card>
            </Col>
            <Col sm="12" lg="4" className="mb-lg-0 mb-5">
              <Card image={RequiredIcon2} title={t("Publish.requiredSubtitle2")}>
                <p className="mb-0">{t("Publish.requiredText2")}</p>
              </Card>
            </Col>
            <Col sm="12" lg="4" className="mb-lg-0 mb-5">
              <Card image={RequiredIcon3} title={t("Publish.requiredSubtitle3")}>
                <p className="mb-0">{t("Publish.requiredText3")}</p>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <div className={cls(commonStyles.section, commonStyles.bg_green)}>
        <Container className={cls(commonStyles.container, "text-center")}>
          <h2 className={cls(commonStyles.title2, "text-center text-white")}>{t("Publish.figuresTitle")}</h2>
          <Row>
            <Col sm="12" lg="4">
              <CountUpFigure number={12} text={t("Publish.figuresSubtitle1")} />
            </Col>
            <Col sm="12" lg="4">
              <CountUpFigure number={12} text={t("Publish.figuresSubtitle2")} />
            </Col>
            <Col sm="12" lg="4">
              <CountUpFigure number={12} text={t("Publish.figuresSubtitle3")} />
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export const getStaticProps = defaultStaticPropsWithThemes;

export default Homepage;
