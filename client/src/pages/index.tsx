import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import Image from "next/image";
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
import { Accordion, Card, InlineLink } from "components/Pages/staticPages/common";
import WhyImage1 from "assets/staticPages/publier/why-image-1.png";
import WhyImage4 from "assets/staticPages/publier/why-image-4.png";
import RequiredIcon1 from "assets/staticPages/publier/required-icon-1.png";
import CommunityRedacteurs from "assets/homepage/community-redacteurs.png";
import CommunityStructures from "assets/homepage/community-structures.png";
import CommunityCda from "assets/homepage/community-cda.png";
import CommunityTraducteurs from "assets/homepage/community-traducteurs.png";
import CommunityExperts from "assets/homepage/community-experts.png";
import CommunityAmbassadeurs from "assets/homepage/community-ambassadeurs.png";
import CommunityInfluenceurs from "assets/homepage/community-influenceurs.png";
import CommunityTesteurs from "assets/homepage/community-testeurs.png";
import CommunityEquipe from "assets/homepage/community-equipe.png";
import FreeResources from "assets/homepage/free-resources.png";
import { CountUpFigure } from "components/Pages/staticPages/publier";
import CommunityCard from "components/Pages/homepage/CommunityCard";
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
          <h1>{t("Homepage.title")}</h1>
        </Container>
      </div>

      <div className={cls(commonStyles.section, commonStyles.bg_grey)}>
        <ThemesGrid className={commonStyles.container} onClickTheme={(themeId) => navigateTheme(themeId)} />
      </div>

      <MobileAppSection />

      <div className={cls(commonStyles.section, commonStyles.bg_grey, styles.content_sliders)}>
        <Container className={commonStyles.container}>
          <h2 className={cls(commonStyles.title2, "text-center")}>{t("Homepage.infoTypeTitle")}</h2>
          <div className={styles.title_line}>
            <h2 className="h4">{t("Homepage.infoTypeDemarche", { count: 12 })}</h2>
            <Button onClick={() => navigateType("demarche")}>{t("Recherche.seeAllButton", "Voir tout")}</Button>
          </div>
          <CardSlider cards={demarches} type="demarche" />
          <div className={styles.title_line}>
            <h2 className="h4">{t("Homepage.infoTypeDispositif", { countDispositifs: 12, countStructures: 12 })}</h2>
            <Button onClick={() => navigateType("dispositif")}>{t("Recherche.seeAllButton", "Voir tout")}</Button>
          </div>
          <CardSlider cards={dispositifs} type="dispositif" />
        </Container>
      </div>

      <div className={cls(commonStyles.section)}>
        <Container className={commonStyles.container}>
          <h2 className={commonStyles.title2}>{t("Homepage.whyTitle")}</h2>
          <Accordion
            items={[
              { title: t("Homepage.whyAccordionTitle1"), text: t("Homepage.whyAccordionText1"), image: WhyImage1 },
              { title: t("Homepage.whyAccordionTitle2"), text: t("Homepage.whyAccordionText2"), image: WhyImage1 },
              { title: t("Homepage.whyAccordionTitle3"), text: t("Homepage.whyAccordionText3"), image: WhyImage4 },
              { title: t("Homepage.whyAccordionTitle4"), text: t("Homepage.whyAccordionText4"), image: WhyImage4 }
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
            <Col sm="12" lg={{ size: "6", order: 1 }}>
              <h2 className={cls(commonStyles.title2, "text-white mb-0")}>{t("Homepage.resourcesTitle")}</h2>
              <p className={cls(commonStyles.subtitle, commonStyles.bottom_space)}>{t("Homepage.resourcesText")}</p>
              <div className={commonStyles.bottom_space}>
                <InlineLink text={t("Homepage.resourcesCTA")} link="#" color="white" />
              </div>
            </Col>
            <Col sm="12" lg={{ size: "6", order: 0 }}>
              <Image
                src={FreeResources}
                alt={t("Homepage.resourcesTitle")}
                width={500}
                height={272}
                className={commonStyles.bottom_space}
              />
            </Col>
          </Row>
        </Container>
      </div>

      <div className={cls(commonStyles.section, commonStyles.bg_grey)}>
        <Container className={commonStyles.container}>
          <h2 className={cls(commonStyles.title2, commonStyles.center)}>{t("Homepage.helpUsTitle")}</h2>
          <p>{t("Homepage.helpUsSubtitle")}</p>
          <Row>
            <Col sm="12" lg="4" className="mb-lg-0 mb-5">
              <Card image={RequiredIcon1} title={t("Homepage.helpUsCardTitle1")}>
                <p className="mb-0">{t("Homepage.helpUsCardHelp1")}</p>
                <p className="mb-0">{t("Homepage.helpUsCardText1")}</p>
                <p className="mb-0">{t("Homepage.helpUsCardCTA1")}</p>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <div className={cls(commonStyles.section, commonStyles.bg_green)}>
        <Container className={cls(commonStyles.container, "text-center")}>
          <h2 className={cls(commonStyles.title2, "text-center text-white")}>{t("Homepage.figuresTitle")}</h2>
          <Row>
            <Col sm="12" lg="4">
              <CountUpFigure number={12} text={t("Homepage.figuresSubtitle1")} />
            </Col>
            <Col sm="12" lg="4">
              <CountUpFigure number={12} text={t("Homepage.figuresSubtitle2")} />
            </Col>
            <Col sm="12" lg="4">
              <CountUpFigure number={12} text={t("Homepage.figuresSubtitle3")} />
            </Col>
          </Row>
        </Container>
      </div>

      <div className={cls(commonStyles.section)}>
        <Container className={cls(commonStyles.container, "text-center")}>
          <h2 className={cls(commonStyles.title2, "text-center")}>{t("Homepage.communityTitle")}</h2>

          <div className={styles.row}>
            <CommunityCard
              title={t("Homepage.communityCardTitle1")}
              subtitle={t("Homepage.communityCardSubtitle1")}
              badge={t("Homepage.communityCardBadge1")}
              image={CommunityRedacteurs}
              color="red"
              countImage={7}
            />
            <CommunityCard
              title={t("Homepage.communityCardTitle2")}
              subtitle={t("Homepage.communityCardSubtitle2")}
              cta={t("Homepage.communityCardCTA2")}
              image={CommunityStructures}
              color="red"
              countImage={7}
            />
            <CommunityCard
              title={t("Homepage.communityCardTitle3")}
              subtitle={t("Homepage.communityCardSubtitle3")}
              badge={t("Homepage.communityCardBadge3")}
              image={CommunityCda}
              color="red"
              countImage={7}
            />
            <CommunityCard
              title={t("Homepage.communityCardTitle4")}
              subtitle={t("Homepage.communityCardSubtitle4")}
              badge={t("Homepage.communityCardBadge4")}
              image={CommunityTraducteurs}
              color="green"
              countImage={7}
            />
            <CommunityCard
              title={t("Homepage.communityCardTitle5")}
              subtitle={t("Homepage.communityCardSubtitle5")}
              badge={t("Homepage.communityCardBadge5")}
              image={CommunityExperts}
              color="green"
              countImage={7}
            />
            <CommunityCard
              title={t("Homepage.communityCardTitle6")}
              subtitle={t("Homepage.communityCardSubtitle6")}
              badge={t("Homepage.communityCardBadge6")}
              image={CommunityAmbassadeurs}
              color="purple"
              countImage={7}
            />
            <CommunityCard
              title={t("Homepage.communityCardTitle7")}
              subtitle={t("Homepage.communityCardSubtitle7")}
              badge={t("Homepage.communityCardBadge7")}
              image={CommunityInfluenceurs}
              color="purple"
              countImage={7}
            />
            <CommunityCard
              title={t("Homepage.communityCardTitle8")}
              subtitle={t("Homepage.communityCardSubtitle8")}
              badge={t("Homepage.communityCardBadge8")}
              image={CommunityTesteurs}
              color="brown"
              countImage={7}
            />
            <CommunityCard
              title={t("Homepage.communityCardTitle9")}
              subtitle={t("Homepage.communityCardSubtitle9")}
              badge={t("Homepage.communityCardBadge9")}
              image={CommunityEquipe}
              color="blue"
              countImage={7}
            />
          </div>
        </Container>
      </div>

      <div className={cls(commonStyles.section)}>
        <Container fluid className={cls(commonStyles.container, "text-center")}>
          <Row>
            <Col className={commonStyles.bg_blue}>
              <h2 className={cls(commonStyles.title2, "text-center text-white")}>{t("Homepage.newsletterTitle")}</h2>
              <p>{t("Homepage.newsletterSubtitle")}</p>
            </Col>
            <Col className={commonStyles.bg_grey}>
              <h2 className={cls(commonStyles.title2, "text-center")}>{t("Homepage.trainingTitle")}</h2>
              <p>{t("Homepage.trainingSubtitle")}</p>
              <p>{t("Homepage.trainingCTA")}</p>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export const getStaticProps = defaultStaticPropsWithThemes;

export default Homepage;
