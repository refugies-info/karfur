import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import Image from "next/image";
import { Button, Col, Container, Row } from "reactstrap";
import { cls } from "lib/classname";
import isInBrowser from "lib/isInBrowser";
import SEO from "components/Seo";
import { useWindowSize } from "hooks";
import { toggleNewsletterModalAction } from "services/Miscellaneous/miscellaneous.actions";
import MobileAppSection from "components/Pages/homepage/MobileAppSection";
import commonStyles from "scss/components/staticPages.module.scss";
import styles from "scss/pages/homepage.module.scss";
import ThemesGrid from "components/Content/ThemesGrid/ThemesGrid";
import Input from "components/UI/Input";
import { ObjectId } from "mongodb";
import { activeDispositifsSelector } from "services/ActiveDispositifs/activeDispositifs.selector";
import CardSlider from "components/Pages/recherche/CardSlider";
import { Accordion, Card, HeroArrow, InlineLink } from "components/Pages/staticPages/common";
import HelpUsIcon1 from "assets/homepage/helpus-icon-1.png";
import HelpUsIcon3 from "assets/homepage/helpus-icon-3.svg";
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
import NewsletterIllu from "assets/homepage/newsletter-illu.svg";
import FormationPhoto from "assets/homepage/photo-formation.jpg";
import { CountUpFigure } from "components/Pages/staticPages/publier";
import CommunityCard from "components/Pages/homepage/CommunityCard";
import Link from "next/link";
import Warning from "components/UI/Warning";
import LanguageIcon from "components/Pages/staticPages/traduire/LanguageIcon";
import { getPath } from "routes";
import FButton from "components/UI/FButton";
import API from "utils/API";
import Swal from "sweetalert2";
import { wrapper } from "services/configureStore";
import { fetchThemesActionCreator } from "services/Themes/themes.actions";
import { END } from "redux-saga";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getLanguageFromLocale } from "lib/getLanguageFromLocale";
import { DispositifStatistics, StructuresStatistics, TranslationStatistics } from "types/interface";
import { fetchNeedsActionCreator } from "services/Needs/needs.actions";
import HomeSearchHeader from "components/Pages/homepage/HomeSearchHeader";

interface Props {
  contentStatistics: DispositifStatistics;
  structuresStatistics: StructuresStatistics;
  translationStatistics: TranslationStatistics;
}

const Homepage = (props: Props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const router = useRouter();
  const { isTablet } = useWindowSize();
  const allDispositifs = useSelector(activeDispositifsSelector);

  useEffect(() => {
    dispatch(fetchNeedsActionCreator());
  }, [dispatch]);

  useEffect(() => {
    if (isInBrowser() && new URLSearchParams(window.location.search).get("newsletter") === "") {
      dispatch(toggleNewsletterModalAction(true));
    }
  }, [dispatch]);

  const navigateTheme = (themeId: ObjectId) => {
    router.push({
      pathname: getPath("/recherche", router.locale),
      query: {
        themes: themeId.toString()
      }
    });
  };
  const navigateType = (type: string) => {
    router.push({
      pathname: getPath("/recherche", router.locale),
      query: {
        type: type
      }
    });
  };

  // Newsletter
  const [email, setEmail] = useState("");
  const [newsletterError, setNewsletterError] = useState("");

  const sendMail = (e: any) => {
    setNewsletterError("");
    e.preventDefault();
    const regex = /^\S+@\S+\.\S+$/;
    const isEmail = !!email.match(regex);
    if (isEmail) {
      API.set_mail({ mail: email })
        .then(() => {
          Swal.fire({
            title: "Yay...",
            text: "Mail correctement enregistré !",
            type: "success",
            timer: 1500
          });
          setEmail("");
        })
        .catch((e) => {
          if (e.response?.data?.code === "CONTACT_ALREADY_EXIST")
            setNewsletterError(t("Footer.newsletter_contact_already_exist"));
          else setNewsletterError("Une erreur s'est produite");
        });
    } else {
      setNewsletterError(t("Register.Ceci n'est pas un email,") + " " + t("Register.vérifiez l'orthographe"));
    }
  };

  const demarches = useMemo(() => allDispositifs.slice(0, 15), [allDispositifs]);
  const dispositifs = useMemo(() => allDispositifs.slice(0, 15), [allDispositifs]);

  return (
    <div className={commonStyles.main}>
      <SEO title="Accueil" description={t("Homepage.title")} />

      <div className={styles.hero}>
        <Container className={cls(commonStyles.container)}>
          <h1>{t("Homepage.title")}</h1>
          <HomeSearchHeader />
          <HeroArrow center target="themes" />
        </Container>
      </div>

      <div id="themes" className={cls(commonStyles.section, styles.themes)}>
        <ThemesGrid className={commonStyles.container} onClickTheme={(themeId) => navigateTheme(themeId)} />
      </div>

      <MobileAppSection />

      <div className={cls(commonStyles.section, commonStyles.bg_grey, styles.content_sliders)}>
        <Container className={commonStyles.container}>
          <h2 className={cls(commonStyles.title2, "text-center")}>{t("Homepage.infoTypeTitle")}</h2>
          <div className={styles.title_line}>
            <h2 className="h4">{t("Homepage.infoTypeDemarche", { count: props.contentStatistics.nbDemarches })}</h2>
            <Button onClick={() => navigateType("demarche")}>{t("Recherche.seeAllButton", "Voir tout")}</Button>
          </div>
          <CardSlider cards={demarches} type="demarche" />
          <div className={styles.title_line}>
            <h2 className="h4">
              {t("Homepage.infoTypeDispositif", {
                countDispositifs: props.contentStatistics.nbDispositifs,
                countStructures: props.structuresStatistics.nbStructures
              })}
            </h2>
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
              {
                title: t("Homepage.whyAccordionTitle1"),
                text: t("Homepage.whyAccordionText1", { count: props.contentStatistics.nbDemarches }),
                video: "/video/home-video-1.mp4",
                mediaWidth: 450,
                mediaHeight: 320
              },
              {
                title: t("Homepage.whyAccordionTitle2"),
                text: t("Homepage.whyAccordionText2"),
                video: "/video/home-video-2.mp4",
                mediaWidth: 450,
                mediaHeight: 320
              },
              {
                title: t("Homepage.whyAccordionTitle3"),
                text: t("Homepage.whyAccordionText3"),
                video: "/video/home-video-3.mp4",
                mediaWidth: 450,
                mediaHeight: 320
              },
              {
                title: t("Homepage.whyAccordionTitle4"),
                text: t("Homepage.whyAccordionText4"),
                youtube: "https://www.youtube-nocookie.com/embed/QMRR2csgan0",
                mediaWidth: 450,
                mediaHeight: 320
              }
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
                <InlineLink text={t("Homepage.resourcesCTA")} link="https://kit.refugies.info/" color="white" />
              </div>
            </Col>
            <Col sm="12" lg={{ size: "6", order: 0 }}>
              <Link href="https://kit.refugies.info/" target="_blank" rel="noopener noreferrer">
                <Image
                  src={FreeResources}
                  alt={t("Homepage.resourcesTitle")}
                  width={500}
                  height={272}
                  className={cls(styles.resources_image, commonStyles.bottom_space)}
                />
              </Link>
            </Col>
          </Row>
        </Container>
      </div>

      <div className={cls(commonStyles.section, commonStyles.bg_grey)}>
        <Container className={commonStyles.container}>
          <h2 className={cls(commonStyles.title2, commonStyles.center, "mb-0")}>{t("Homepage.helpUsTitle")}</h2>
          <p className={cls(commonStyles.subtitle, commonStyles.center)}>{t("Homepage.helpUsSubtitle")}</p>
          <Row className={commonStyles.top_space}>
            <Col sm="12" lg="4" className="mb-lg-0 mb-5">
              <Link href={getPath("/publier", router.locale)}>
                <Card
                  image={HelpUsIcon1}
                  title={t("Homepage.helpUsCardTitle1")}
                  footer={<InlineLink link="#" text={t("Homepage.helpUsCardCTA1")} color="purple" type="span" />}
                  withShadow
                >
                  <Warning text={t("Homepage.helpUsCardHelp1")} color="purple" />
                  <p className={styles.help_text}>{t("Homepage.helpUsCardText1")}</p>
                </Card>
              </Link>
            </Col>

            <Col sm="12" lg="4" className="mb-lg-0 mb-5">
              <Link href={getPath("/traduire", router.locale)}>
                <Card
                  title={t("Homepage.helpUsCardTitle2")}
                  header={
                    <>
                      <LanguageIcon language="ua" size={40} color="red" />
                      <LanguageIcon language="ir" size={40} color="red" />
                      <LanguageIcon language="sa" size={40} color="red" />
                      <LanguageIcon language="gb" size={40} color="red" />
                      <LanguageIcon language="af" size={40} color="red" />
                      <LanguageIcon language="ru" size={40} color="red" />
                      <LanguageIcon language="er" size={40} color="red" />
                    </>
                  }
                  footer={<InlineLink link="#" text={t("Homepage.helpUsCardCTA2")} color="red" type="span" />}
                  withShadow
                >
                  <Warning text={t("Homepage.helpUsCardHelp2")} color="red" />
                  <p className={styles.help_text}>{t("Homepage.helpUsCardText2")}</p>
                </Card>
              </Link>
            </Col>

            <Col sm="12" lg="4" className="mb-lg-0 mb-5">
              <Link
                href="https://help.refugies.info/fr/article/commenter-une-fiche-rkuwpn/?bust=1670576881639"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Card
                  image={HelpUsIcon3}
                  title={t("Homepage.helpUsCardTitle3")}
                  footer={<InlineLink link="#" text={t("Homepage.helpUsCardCTA3")} color="orange" type="span" />}
                  withShadow
                >
                  <Warning text={t("Homepage.helpUsCardHelp3")} color="orange" />
                  <p className={styles.help_text}>{t("Homepage.helpUsCardText3")}</p>
                </Card>
              </Link>
            </Col>
          </Row>
        </Container>
      </div>

      <div className={cls(commonStyles.section, commonStyles.bg_green)}>
        <Container className={cls(commonStyles.container, "text-center")}>
          <h2 className={cls(commonStyles.title2, "text-center text-white")}>{t("Homepage.figuresTitle")}</h2>
          <Row>
            <Col sm="12" lg="4">
              <CountUpFigure
                number={props.contentStatistics.nbVues + props.contentStatistics.nbVuesMobile}
                text={t("Homepage.figuresSubtitle1")}
              />
            </Col>
            <Col sm="12" lg="4">
              <CountUpFigure number={props.contentStatistics.nbMercis} text={t("Homepage.figuresSubtitle2")} />
            </Col>
            <Col sm="12" lg="4">
              <CountUpFigure number={props.contentStatistics.nbUpdatedRecently} text={t("Homepage.figuresSubtitle3")} />
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
              countImage={props.translationStatistics.nbRedactors - 3}
              link={getPath("/publier", router.locale)}
            />
            <CommunityCard
              title={t("Homepage.communityCardTitle2")}
              subtitle={t("Homepage.communityCardSubtitle2")}
              cta={t("Homepage.communityCardCTA2")}
              image={CommunityStructures}
              color="red"
              countImage={props.structuresStatistics.nbStructureAdmins - 3}
              link={getPath("/publier", router.locale)}
            />
            <CommunityCard
              title={t("Homepage.communityCardTitle3")}
              subtitle={t("Homepage.communityCardSubtitle3")}
              badge={t("Homepage.communityCardBadge3")}
              image={CommunityCda}
              color="red"
              countImage={props.structuresStatistics.nbCDA - 3}
            />
            <CommunityCard
              title={t("Homepage.communityCardTitle4")}
              subtitle={t("Homepage.communityCardSubtitle4")}
              badge={t("Homepage.communityCardBadge4")}
              image={CommunityTraducteurs}
              color="green"
              countImage={props.translationStatistics.nbTranslators - 3}
              link={getPath("/traduire", router.locale)}
            />
            <CommunityCard
              title={t("Homepage.communityCardTitle5")}
              subtitle={t("Homepage.communityCardSubtitle5")}
              badge={t("Homepage.communityCardBadge5")}
              image={CommunityExperts}
              color="green"
              countImage={4}
            />
            <CommunityCard
              title={t("Homepage.communityCardTitle6")}
              subtitle={t("Homepage.communityCardSubtitle6")}
              badge={t("Homepage.communityCardBadge6")}
              image={CommunityAmbassadeurs}
              color="purple"
              countImage={20}
            />
            <CommunityCard
              title={t("Homepage.communityCardTitle7")}
              subtitle={t("Homepage.communityCardSubtitle7")}
              badge={t("Homepage.communityCardBadge7")}
              image={CommunityInfluenceurs}
              color="purple"
              countImage={1}
            />
            <CommunityCard
              title={t("Homepage.communityCardTitle8")}
              subtitle={t("Homepage.communityCardSubtitle8")}
              badge={t("Homepage.communityCardBadge8")}
              image={CommunityTesteurs}
              color="brown"
              countImage={80}
            />
            <CommunityCard
              title={t("Homepage.communityCardTitle9")}
              subtitle={t("Homepage.communityCardSubtitle9")}
              badge={t("Homepage.communityCardBadge9")}
              image={CommunityEquipe}
              color="blue"
              countImage={9}
            />
          </div>
        </Container>
      </div>

      <div className={cls(commonStyles.section, styles.infos, "pb-0")}>
        <Container fluid className={cls(commonStyles.container, "text-center")}>
          <Row>
            <Col className={commonStyles.bg_blue}>
              <div className={styles.infos_col}>
                <Image src={NewsletterIllu} alt="" width={416} className={styles.img} />
                <h2 className={cls(commonStyles.title2, commonStyles.top_space, "mb-0 text-center text-white")}>
                  {t("Homepage.newsletterTitle")}
                </h2>
                <p className={commonStyles.subtitle}>{t("Homepage.newsletterSubtitle")}</p>
                <div className={styles.action}>
                  <div className={styles.newsletter}>
                    <Input
                      type="email"
                      placeholder={t("Register.Votre email")}
                      icon="email-outline"
                      className={styles.newsletter_input}
                      value={email}
                      onChange={(e: any) => setEmail(e.target.value)}
                      error={newsletterError}
                    />
                    <FButton
                      type="validate"
                      className={styles.newsletter_submit}
                      name="checkmark-outline"
                      disabled={!email}
                      onClick={sendMail}
                    >
                      Envoyer
                    </FButton>
                  </div>
                </div>
              </div>
            </Col>
            <Col className={commonStyles.bg_grey}>
              <div className={styles.infos_col}>
                <Image src={FormationPhoto} alt="" width={416} className={styles.img} />
                <h2 className={cls(commonStyles.title2, commonStyles.top_space, "mb-0 text-center")}>
                  {t("Homepage.trainingTitle")}
                </h2>
                <p className={commonStyles.subtitle}>{t("Homepage.trainingSubtitle")}</p>
                <div className={styles.action}>
                  <InlineLink text={t("Homepage.trainingCTA")} link="#" color="blue" />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export const getStaticProps = wrapper.getStaticProps((store) => async ({ locale }) => {
  const action = fetchThemesActionCreator();
  store.dispatch(action);
  store.dispatch(END);
  await store.sagaTask?.toPromise();

  const contentStatistics = (await API.getDispositifsStatistics()).data.data;
  const structuresStatistics = (await API.getStructuresStatistics()).data.data;
  const translationStatistics = (await API.getTranslationStatistics()).data.data;

  return {
    props: {
      ...(await serverSideTranslations(getLanguageFromLocale(locale), ["common"])),
      contentStatistics,
      structuresStatistics,
      translationStatistics
    },
    revalidate: 60 * 10
  };
});

export default Homepage;
