import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import API from "utils/API";
import { allLanguesSelector } from "services/Langue/langue.selectors";
import { userSelector } from "services/User/user.selectors";
import FButton from "components/FigmaUI/FButton/FButton";
import { CompleteProfilModal } from "components/Modals/CompleteProfilModal/CompleteProfilModal";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { assetsOnServer } from "assets/assetsOnServer";
import DispositifCard from "components/Pages/comment-contribuer/DispositifCard";
import LexiqueCard from "components/Pages/comment-contribuer/LexiqueCard";
import StructureCard from "components/Pages/comment-contribuer/StructureCard";
import DemarcheCard from "components/Pages/comment-contribuer/DemarcheCard";
import HeaderCard from "components/Pages/comment-contribuer/HeaderCard";
import Langue from "components/Pages/comment-contribuer/Langue";
import NumberTraduction from "components/Pages/comment-contribuer/NumberTraduction";
import PapillonViolet from "assets/comment-contribuer/CommentContribuer-papillon_violet.svg";
import PapillonRose from "assets/comment-contribuer/CommentContribuer-papillon_rose.svg";
import gif from "assets/comment-contribuer/GIF-corriger.gif";
import Nour from "assets/qui-sommes-nous/Nour-big.png";
import styles from "scss/pages/comment-contribuer.module.scss";
import SEO from "components/Seo";
import { wrapper } from "services/configureStore";
import { END } from "redux-saga";
import { fetchLanguesActionCreator } from "services/Langue/langue.actions";
import useRTL from "hooks/useRTL";

interface Props {
  nbExperts: number
  nbTraductors: number
}

const CommentContribuer = (props: Props) => {
  const [showCompleteProfilModal, setShowCompleteProfilModal] = useState(false);
  const [typeModal, setTypeModal] = useState("");

  const { t } = useTranslation();
  const langues = useSelector(allLanguesSelector);
  const user = useSelector(userSelector);

  const toggleCompleteProfilModal = (type = "") => {
    setShowCompleteProfilModal(!showCompleteProfilModal);
    setTypeModal(type);
  };

  const getActiveLangues = () => {
    return langues.filter(
      (langue) => langue.avancement > 0 && langue.langueCode !== "fr"
    );
  };
  const activeLangues = getActiveLangues();
  const isRTL = useRTL();

  return (
    <div className={styles.container}>
      <SEO />
      <div className={styles.header}>
        <h1>
          {t("CommentContribuer.Comment contribuer", "Comment contribuer ?")}
        </h1>
        <div className={styles.row}>
          <div
            className={styles.col}
            style={isRTL ? { marginRight: 0 } : {}}
          >
            <a href="#ecrire-card">
              <HeaderCard
                title={t("CommentContribuer.écrire", "écrire")}
                iconName="edit-outline"
                eva={true}
              />
            </a>
          </div>
          <div className={styles.col}>
            <a href="#traduire-card">
              <HeaderCard
                title={t("CommentContribuer.traduire", "traduire")}
                iconName="edit-outline"
              />
            </a>
          </div>
          <a href="#corriger">
            <div className={styles.col}>
              <HeaderCard
                title={t("CommentContribuer.corriger", "corriger")}
                iconName="done-all-outline"
                eva={true}
              />
            </div>
          </a>
          <div
            className={styles.col}
            style={!isRTL ? { marginRight: 0 } : {}}
          >
            <a href="#deployer-card">
              <HeaderCard
                title={t("CommentContribuer.déployer", "déployer")}
                iconName="icon_France"
              />
            </a>
          </div>
        </div>
        <div id="ecrire" style={{marginTop: 150}} />
      </div>
      <div id="ecrire-card" className={styles.redaction}>
        {t("CommentContribuer.Redaction", "Rédiger de nouveaux contenus")}
        <div className={styles.redaction_cards}>
          <DispositifCard
            user={user.user}
            toggleModal={toggleCompleteProfilModal}
          />

          <DemarcheCard
            user={user.user}
            toggleModal={toggleCompleteProfilModal}
          />

          <StructureCard />
          <LexiqueCard />
        </div>
        <div id="traduire" style={{marginTop: 50}} />
      </div>
      <div
        id="traduire-card"
        className={styles.traduction}
        style={{
          paddingRight: isRTL ? 0 : 120,
          paddingLeft: isRTL ? 120 : 0,
        }}
      >
        <div
          style={{
            marginLeft: isRTL ? 0 : 120,
            marginRight: isRTL ? 120 : 0,
          }}
        >
          {t("CommentContribuer.Traduction", "Traduire pour rendre accessible")}
        </div>
        <div className={styles.row}>
          <Image
            src={assetsOnServer.commentContribuer.traduction}
            alt="traduction"
            width={590}
            height={562}
          />
          <div className={styles.column}>
            <h2 className={styles.trad_header}>
              {t(
                "CommentContribuer.TraductionReseau",
                "Vous parlez une autre langue ? Rejoignez un réseau de :"
              )}
            </h2>
            <div className={styles.row}>
              <Link href="/backend/user-translation" passHref>
                <NumberTraduction
                  amount={props.nbTraductors}
                  text={t(
                    "CommentContribuer.traducteurs actifs",
                    "traducteurs actifs"
                  )}
                  isRTL={isRTL}
                  width={181}
                />
              </Link>
              <Link href="/backend/user-translation" passHref>
                <NumberTraduction
                  amount={props.nbExperts}
                  text={t(
                    "CommentContribuer.experts en traduction",
                    "experts en traduction"
                  )}
                  width={326}
                  isRTL={isRTL}
                />
              </Link>
            </div>
            <div className={styles.langues_cards}>
              <Langue
                langue={activeLangues[0] || {}}
                key={activeLangues[0] && activeLangues[0].i18nCode}
                isRTL={isRTL}
              />
              <Langue
                langue={activeLangues[1] || {}}
                key={activeLangues[1] && activeLangues[1].i18nCode}
                isRTL={isRTL}
              />
            </div>
            <div className={styles.langues_cards}>
              <Langue
                langue={activeLangues[2] || {}}
                key={activeLangues[2] && activeLangues[2].i18nCode}
                isRTL={isRTL}
              />
              <Langue
                langue={activeLangues[3] || {}}
                key={activeLangues[3] ? activeLangues[3].i18nCode : ""}
                isRTL={isRTL}
              />
            </div>
            <div className={styles.langues_cards}>
              <Langue
                langue={activeLangues[4] || {}}
                key={activeLangues[4] && activeLangues[4].i18nCode}
                isRTL={isRTL}
              />
              <Langue
                langue={activeLangues[5] || {}}
                key={activeLangues[5] ? activeLangues[5].i18nCode : ""}
                isRTL={isRTL}
              />
            </div>
          </div>
        </div>
      </div>
      <div id="deployer-card" className={styles.deployons}>
        <br />
        <h2 className={styles.deployons_header}>
          {t(
            "CommentContribuer.Déployons ensemble",
            "Déployons ensemble la plateforme sur votre territoire"
          )}
        </h2>
        <div className={styles.section}>
          <div className={styles.text}>
            <p className={styles.main_text}>
              {t(
                "CommentContribuer.obtenir une cartographie",
                "Réfugiés.info aide à obtenir une cartographie des dispositifs mise à jour par les acteurs."
              )}
            </p>
            <p className={styles.sub_text}>
              {t(
                "CommentContribuer.fonctionnalités collaboratives",
                "Grâce à nos fonctionnalités collaboratives, les acteurs recensent et valorisent leurs actions en autonomie. Notre équipe les accompagne en cas de besoin via notre livechat."
              )}
            </p>
          </div>
          <div className={styles.text}>
            <p className={styles.main_text}>
              {t(
                "CommentContribuer.traduit les informations",
                "Réfugiés.info traduit les informations pour vous avec de vrais traducteurs humains."
              )}
            </p>
            <p className={styles.sub_text}>
              {t(
                "CommentContribuer.La plateforme s’appuie",
                "La plateforme s’appuie sur un réseau de bénévole et d’experts en traduction pour traduire et vulgariser l’information dans un langage adaptée aux personnes réfugiées."
              )}
            </p>
          </div>
          <div className={styles.text}>
            <p className={styles.main_text}>
              {t(
                "CommentContribuer.permet d’orienter vos bénéficiaires",
                "Réfugiés.info permet d’orienter vos bénéficiaires au sein de votre territoire et au-delà."
              )}
            </p>
            <p className={styles.sub_text}>
              {t(
                "CommentContribuer.Grâce à la couverture nationale",
                "Grâce à la couverture nationale de Réfugiés.info, les bénéficiaires trouvent plus d’information : à la fois des dispositifs près de chez eux et aussi des démarches et initiatives présentes dans toute la France. "
              )}
            </p>
          </div>
          <div className={styles.text}>
            <p className={styles.main_text}>
              {t(
                "CommentContribuer.propose un accompagnement",
                "L’équipe de Réfugiés.info vous propose un accompagnement sur-mesure."
              )}
            </p>
            <p className={styles.sub_text}>
              {t(
                "CommentContribuer.Nous définissons ensemble",
                "Nous définissons ensemble vos objectifs de déploiement en prenant en compte les moyens humains mobilisables sur votre territoire. Notre équipe se déplace au besoin pour former et outiller les ambassadeurs."
              )}
            </p>
          </div>
        </div>
        <div className={styles.rdv}>
          <div className={styles.inner}>
            <p>{t("CommentContribuer.Convaincu ?", "Convaincu ?")}</p>
            <p>
              {t(
                "CommentContribuer.Prenons rendez-vous !",
                "Prenons rendez-vous !"
              )}
            </p>
          </div>
          <div className={styles.contact}>
            <Image
              src={Nour}
              alt="Photo Nour"
              width={190}
              height={190}
            />
            <div className={styles.infos}>
              <p style={{ fontWeight: "bold" }}>
                Nour Allazkani
              </p>
              <p>
                {t("CommentContribuer.Ambassadeur", "Ambassadeur")}
              </p>
              <FButton
                name="calendar-outline"
                target="_blank"
                href="https://calendly.com/nour-refugies-info/rdv-ambassadeur-de-refugies-info?month=2021-05"
                type="validate"
              >
                {t(
                  "CommentContribuer.Prendre rendez-vous",
                  "Prendre rendez-vous"
                )}
              </FButton>
              <div className={styles.dispo}>
                {t(
                  "CommentContribuer.Selon vos disponibilités",
                  "Selon vos disponibilités"
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.correction} id="corriger">
        <h2>
          {t(
            "CommentContribuer.Corriger",
            "Corriger et enrichir l'information"
          )}
        </h2>
        <div className={styles.inner}>
          <div className={styles.icon}>
            <EVAIcon
              name="message-circle-outline"
              fill="#212121"
              size="xlarge"
            />
          </div>
          <div className={styles.title}>
            {t("CommentContribuer.Commentaires ciblés", "Commentaires ciblés")}
          </div>
          <div className={styles.description}>
            {t(
              "CommentContribuer.Commentaires ciblés explications",
              "Un paragraphe est erroné ? Réagissez directement au niveau du paragraphe. Pas besoin de compte. Cherchez l’icône ci-dessus en passant votre souris sur le paragraphe à corriger."
            )}
          </div>
          <div className={styles.icon}>
            <EVAIcon name="edit-outline" fill="#828282" size="xlarge" />
          </div>
          <div
            className={styles.title}
            style={{ color: "#828282" }}
          >
            {t(
              "CommentContribuer.Suggestion",
              "Suggestion de modification (prochainement)"
            )}
          </div>
          <div className={styles.description}>
            {t(
              "CommentContribuer.Suggestion explications",
              "Proposez une nouvelle formulation d’un paragraphe pour faciliter la tâche des responsables de la fiche. Les fiches seront ainsi écrites à plusieurs mains !"
            )}
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            top: 328,
            right: (isRTL ? 992 : "inherit"),
            left: (!isRTL ? 992 : "inherit"),
          }}
        >
          <Image
            src={PapillonRose}
            alt=""
            width={410}
            height={410}
          />
        </div>
        <div
          style={{
            position: "absolute",
            top: 268,
            right: (isRTL ? 676 : "inherit"),
            left: (!isRTL ? 676 : "inherit"),
            zIndex: 3,
          }}
        >
          <Image
            src={gif}
            alt="loading..."
            width={600}
            height={350}
          />
        </div>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: (!isRTL ? 556 : "inherit"),
            right: (isRTL ? 556 : "inherit"),
          }}
        >
          <Image
            src={PapillonViolet}
            alt=""
            width={485}
            height={492}
          />
        </div>
      </div>
      <CompleteProfilModal
        show={showCompleteProfilModal}
        toggle={toggleCompleteProfilModal}
        user={user.user}
        type={typeModal}
      />
    </div>
  )
};

export const getStaticProps = wrapper.getStaticProps(store => async ({locale}) => {
  store.dispatch(fetchLanguesActionCreator());
  store.dispatch(END);
  await store.sagaTask?.toPromise();

  let nbExperts = 0;
  let nbTraductors = 0;
  try {
    const usersStats = await API.getFiguresOnUsers();
    nbExperts = usersStats.data.data.nbExperts;
    nbTraductors = usersStats.data.data.nbTraductors;
  } catch (e) { }

  return {
    props: {
      nbExperts,
      nbTraductors,
      ...(await serverSideTranslations(locale || "fr", ["common"])),
    },
    revalidate: 60
  };
});

export default CommentContribuer;
