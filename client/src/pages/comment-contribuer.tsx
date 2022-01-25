import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import styled from "styled-components";
import i18n from "i18n";
import { colors } from "colors";
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
import HeaderBackgroungImage from "assets/comment-contribuer/CommentContribuer-header.svg";
import BackgroundTraduction from "assets/comment-contribuer/CommentContribuer_backgroundTraduction.svg";
import PapillonViolet from "assets/comment-contribuer/CommentContribuer-papillon_violet.svg";
import PapillonRose from "assets/comment-contribuer/CommentContribuer-papillon_rose.svg";
import gif from "assets/comment-contribuer/GIF-corriger.gif";
import Nour from "assets/qui-sommes-nous/Nour-big.png";
// import styles from "scss/pages/comment-contribuer.module.scss";

const MainContainer = styled.div`
  flex: 1;
  background: #ffffff;
`;
const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: url(${HeaderBackgroungImage});
  margin-top: -75px;
  width: 100%;
  height: 720px;
`;

const HeaderText = styled.div`
  font-weight: bold;
  font-size: 52px;
  line-height: 66px;
  color: #ffffff;
  margin-top: 191px;
  margin-bottom: 72px;
`;

const RedactionContainer = styled.div`
  padding-top: 48px;
  font-weight: 500;
  font-size: 32px;
  line-height: 40px;
  padding-left: 120px;
  padding-right: 120px;
  background: #ffffff;
  padding-bottom: 106px;
  height: 720px;
`;

const TraductionContainer = styled.div`
  height: 720px;
  background-image: url(${BackgroundTraduction});
  padding-top: 48px;
  font-weight: 500;
  font-size: 32px;
  line-height: 40px;
  padding-right: ${(props) => (props.isRTL ? "0px" : "120px")};
  padding-left: ${(props) => (props.isRTL ? "120px" : "0px")};
  display: flex;
  flex-direction: column;
`;

const RedactionCardsContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 48px;
  justify-content: space-between;
`;

const HeaderCardsContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const TradContentContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const LanguagesContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const TradHeaderContainer = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  margin-top: 62px;
  margin-bottom: 16px;
`;

const NumbersContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const LanguesCardsContainer = styled.div`
  display: flex;
  flex-direction: row;

  margin-top: 32px;
`;

const CorrectionContainer = styled.div`
  height: 880px;
  padding-left: 120px;
  padding-right: 120px;
  background: #ffffff;
  padding-top: 48px;
  position: relative;
`;

const DeployonsContainer = styled.div`
  padding-left: 120px;
  padding-right: 120px;
  background: #ffffff;
  padding-top: 48px;
  position: relative;
`;

const DeployonsTextContainer = styled.div`
  padding-left: 25px;
  padding-right: 25px;
  width: 25%;
`;

const DeployonSectionTextContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 50px;
  margin-bottom: 20px;
`;

const RdvTextContainer = styled.div`
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  padding: 50px;
`;

const DeployonsRdvContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: 60px;
`;

const RdvContactContainer = styled.div`
  width: 458px;
  background-color: ${colors.bleuCharte};
  border-radius: 12px;
  padding: 20px;
  display: flex;
`;

const ContactInfoContainer = styled.div`
  padding-left: 20px;
  padding-right: 20px;
`;

const MainTextContainer = styled.div`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
`;

const SubTextContainer = styled.div`
  font-size: 18px;
  font-weight: 400;
`;
const DeployonsHeader = styled.p`
  font-size: 40px;
  font-weight: 700;
  text-align: center;
`;
const CorrectionHeader = styled.div`
  font-weight: 500;
  font-size: 32px;
  line-height: 40px;
`;

const CorrectionContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 80px;
  width: 380px;
`;

const EcrireAnchor = styled.div`
  margin-top: 150px;
`;

const TraduireAnchor = styled.div`
  margin-top: 50px;
`;

const ContactInfoTextContainer = styled.p`
  background-color: ${colors.blancSimple};
  font-size: 18px;
  width:fit-content;
  font-weight: ${(props) => (props.type === "main" ? "700" : "400")};
  padding : 5px; 10px;
`;

const DispoContainer = styled.div`
  color: ${colors.blancSimple};
  font-size: 16px;
  padding: 12px 10px 0 10px;
  font-weight: 700;
`;

const RoundIconContainer = styled.div`
  width: 60px;
  height: 60px;
  background: #f2f2f2;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CommentContribuer = (props: any) => {
  const [showModals, setShowModals] = useState({ checkDemarche: false });
  const [nbTraductors, setNbTraductors] = useState(0);
  const [nbExperts, setNbExperts] = useState(0);
  const [showCompleteProfilModal, setShowCompleteProfilModal] = useState(false);
  const [typeModal, setTypeModal] = useState("");

  const { t } = useTranslation();
  const langues = useSelector(allLanguesSelector);
  const user = useSelector(userSelector);

  useEffect(() => {
    API.getFiguresOnUsers().then((data) => {
      setNbExperts(data.data.data.nbExperts);
      setNbTraductors(data.data.data.nbTraductors);
    });
    // window.scrollTo(0, 0);
  }, []);

  const toggleCompleteProfilModal = (type = "") => {
    setShowCompleteProfilModal(!showCompleteProfilModal);
    setTypeModal(type);
  };

  const toggleModal = (show: boolean, name: string) => {
    setShowModals({ ...showModals, [name]: show });
  };

  const getActiveLangues = () => {
    return langues.filter(
      (langue) => langue.avancement > 0 && langue.langueCode !== "fr"
    );
  };
  const activeLangues = getActiveLangues();
  const isRTL = ["ar", "ps", "fa"].includes(i18n.language);

  return (
    <MainContainer>
      <HeaderContainer>
        <HeaderText>
          {t("CommentContribuer.Comment contribuer", "Comment contribuer ?")}
        </HeaderText>
        <HeaderCardsContainer>
          <div style={{ marginRight: isRTL ? "0px" : "48px" }}>
            <a href="#ecrire-card">
              <HeaderCard
                title={t("CommentContribuer.écrire", "écrire")}
                iconName="edit-outline"
                eva={true}
              />
            </a>
          </div>
          <div style={{ marginRight: "48px" }}>
            <a href="#traduire-card">
              <HeaderCard
                title={t("CommentContribuer.traduire", "traduire")}
                iconName="edit-outline"
              />
            </a>
          </div>
          <a href="#corriger">
            <div style={{ marginRight: "48px" }}>
              <HeaderCard
                title={t("CommentContribuer.corriger", "corriger")}
                iconName="done-all-outline"
                eva={true}
              />
            </div>
          </a>
          <div style={{ marginRight: isRTL ? "48px" : "0px" }}>
            <a href="#deployer-card">
              <HeaderCard
                title={t("CommentContribuer.déployer", "déployer")}
                iconName="icon_France"
              />
            </a>
          </div>
        </HeaderCardsContainer>
        <EcrireAnchor id="ecrire" />
      </HeaderContainer>
      <RedactionContainer id="ecrire-card">
        {t("CommentContribuer.Redaction", "Rédiger de nouveaux contenus")}
        <RedactionCardsContainer>
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
        </RedactionCardsContainer>
        <TraduireAnchor id="traduire" />
      </RedactionContainer>
      <TraductionContainer id="traduire-card" isRTL={isRTL}>
        <div
          style={{
            marginLeft: isRTL ? "0px" : "120px",
            marginRight: isRTL ? "120px" : "0px",
          }}
        >
          {t("CommentContribuer.Traduction", "Traduire pour rendre accessible")}
        </div>
        <TradContentContainer>
          <img
            src={assetsOnServer.commentContribuer.traduction}
            alt="traduction"
          />
          <LanguagesContainer>
            <TradHeaderContainer>
              {t(
                "CommentContribuer.TraductionReseau",
                "Vous parlez une autre langue ? Rejoignez un réseau de :"
              )}
            </TradHeaderContainer>
            <NumbersContainer>
              <Link href="/backend/user-translation">
                <NumberTraduction
                  amount={nbTraductors}
                  text={t(
                    "CommentContribuer.traducteurs actifs",
                    "traducteurs actifs"
                  )}
                  isRTL={isRTL}
                  width={181}
                />
              </Link>
              <Link href="/backend/user-translation">
                <NumberTraduction
                  amount={nbExperts}
                  text={t(
                    "CommentContribuer.experts en traduction",
                    "experts en traduction"
                  )}
                  width={326}
                  isRTL={isRTL}
                />
              </Link>
            </NumbersContainer>
            <LanguesCardsContainer>
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
            </LanguesCardsContainer>
            <LanguesCardsContainer>
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
            </LanguesCardsContainer>
            <LanguesCardsContainer>
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
            </LanguesCardsContainer>
          </LanguagesContainer>
        </TradContentContainer>
      </TraductionContainer>
      <DeployonsContainer id="deployer-card">
        <br />
        <DeployonsHeader>
          {t(
            "CommentContribuer.Déployons ensemble",
            "Déployons ensemble la plateforme sur votre territoire"
          )}
        </DeployonsHeader>
        <DeployonSectionTextContainer>
          <DeployonsTextContainer>
            <MainTextContainer>
              {t(
                "CommentContribuer.obtenir une cartographie",
                "Réfugiés.info aide à obtenir une cartographie des dispositifs mise à jour par les acteurs."
              )}
            </MainTextContainer>
            <SubTextContainer>
              {t(
                "CommentContribuer.fonctionnalités collaboratives",
                "Grâce à nos fonctionnalités collaboratives, les acteurs recensent et valorisent leurs actions en autonomie. Notre équipe les accompagne en cas de besoin via notre livechat."
              )}
            </SubTextContainer>
          </DeployonsTextContainer>
          <DeployonsTextContainer>
            <MainTextContainer>
              {t(
                "CommentContribuer.traduit les informations",
                "Réfugiés.info traduit les informations pour vous avec de vrais traducteurs humains."
              )}
            </MainTextContainer>
            <SubTextContainer>
              {t(
                "CommentContribuer.La plateforme s’appuie",
                "La plateforme s’appuie sur un réseau de bénévole et d’experts en traduction pour traduire et vulgariser l’information dans un langage adaptée aux personnes réfugiées."
              )}
            </SubTextContainer>
          </DeployonsTextContainer>
          <DeployonsTextContainer>
            <MainTextContainer>
              {t(
                "CommentContribuer.permet d’orienter vos bénéficiaires",
                "Réfugiés.info permet d’orienter vos bénéficiaires au sein de votre territoire et au-delà."
              )}
            </MainTextContainer>
            <SubTextContainer>
              {t(
                "CommentContribuer.Grâce à la couverture nationale",
                "Grâce à la couverture nationale de Réfugiés.info, les bénéficiaires trouvent plus d’information : à la fois des dispositifs près de chez eux et aussi des démarches et initiatives présentes dans toute la France. "
              )}
            </SubTextContainer>
          </DeployonsTextContainer>
          <DeployonsTextContainer>
            <MainTextContainer>
              {t(
                "CommentContribuer.propose un accompagnement",
                "L’équipe de Réfugiés.info vous propose un accompagnement sur-mesure."
              )}
            </MainTextContainer>
            <SubTextContainer>
              {t(
                "CommentContribuer.Nous définissons ensemble",
                "Nous définissons ensemble vos objectifs de déploiement en prenant en compte les moyens humains mobilisables sur votre territoire. Notre équipe se déplace au besoin pour former et outiller les ambassadeurs."
              )}
            </SubTextContainer>
          </DeployonsTextContainer>
        </DeployonSectionTextContainer>
        <DeployonsRdvContainer>
          <RdvTextContainer>
            <p>{t("CommentContribuer.Convaincu ?", "Convaincu ?")}</p>
            <p>
              {t(
                "CommentContribuer.Prenons rendez-vous !",
                "Prenons rendez-vous !"
              )}
            </p>
          </RdvTextContainer>
          <RdvContactContainer>
            <Image
              src={Nour}
              alt="Photo Nour"
              width={190}
              height={190}
            />
            <ContactInfoContainer>
              <ContactInfoTextContainer type="main">
                Nour Allazkani
              </ContactInfoTextContainer>
              <ContactInfoTextContainer
                sytle={{ backgroundColor: colors.blancSimple }}
              >
                {t("CommentContribuer.Ambassadeur", "Ambassadeur")}
              </ContactInfoTextContainer>
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
              <DispoContainer>
                {t(
                  "CommentContribuer.Selon vos disponibilités",
                  "Selon vos disponibilités"
                )}
              </DispoContainer>
            </ContactInfoContainer>
          </RdvContactContainer>
        </DeployonsRdvContainer>
      </DeployonsContainer>
      <CorrectionContainer id="corriger">
        <CorrectionHeader>
          {t(
            "CommentContribuer.Corriger",
            "Corriger et enrichir l'information"
          )}
        </CorrectionHeader>
        <CorrectionContentContainer>
          <RoundIconContainer>
            <EVAIcon
              name="message-circle-outline"
              fill="#212121"
              size="xlarge"
            />
          </RoundIconContainer>
          <div
            style={{
              fontWeight: "bold",
              fontSize: "22px",
              lineHeight: "28px",
              marginTop: "16px",
              marginBottom: "16px",
            }}
          >
            {t("CommentContribuer.Commentaires ciblés", "Commentaires ciblés")}
          </div>
          <div
            style={{
              fontWeight: "normal",
              fontSize: "16px",
              lineHeight: "20px",
              marginBottom: "32px",
            }}
          >
            {t(
              "CommentContribuer.Commentaires ciblés explications",
              "Un paragraphe est erroné ? Réagissez directement au niveau du paragraphe. Pas besoin de compte. Cherchez l’icône ci-dessus en passant votre souris sur le paragraphe à corriger."
            )}
          </div>
          <RoundIconContainer>
            <EVAIcon name="edit-outline" fill="#828282" size="xlarge" />
          </RoundIconContainer>
          <div
            style={{
              fontWeight: "bold",
              fontSize: "22px",
              lineHeight: "28px",
              marginTop: "16px",
              marginBottom: "16px",
              color: "#828282",
            }}
          >
            {t(
              "CommentContribuer.Suggestion",
              "Suggestion de modification (prochainement)"
            )}
          </div>
          <div
            style={{
              fontWeight: "normal",
              fontSize: "16px",
              lineHeight: "20px",
              marginBottom: "32px",
            }}
          >
            {t(
              "CommentContribuer.Suggestion explications",
              "Proposez une nouvelle formulation d’un paragraphe pour faciliter la tâche des responsables de la fiche. Les fiches seront ainsi écrites à plusieurs mains !"
            )}
          </div>
        </CorrectionContentContainer>
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
          />
        </div>
      </CorrectionContainer>
      <CompleteProfilModal
        show={showCompleteProfilModal}
        toggle={toggleCompleteProfilModal}
        user={user.user}
        type={typeModal}
      />
    </MainContainer>
  )
};

export default CommentContribuer;