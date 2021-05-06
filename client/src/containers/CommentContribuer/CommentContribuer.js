import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { Progress } from "reactstrap";
import AnchorLink from "react-anchor-link-smooth-scroll";
import { connect } from "react-redux";

import API from "../../utils/API";
import EVAIcon from "../../components/UI/EVAIcon/EVAIcon";
import SVGIcon from "../../components/UI/SVGIcon/SVGIcon";
import styled from "styled-components";
import HeaderBackgroungImage from "../../assets/comment-contribuer/CommentContribuer-header.svg";
import BackgroundDispositif from "../../assets/comment-contribuer/CommentContribuer-background_orange.svg";
import { assetsOnServer } from "../../assets/assetsOnServer";
import BackgroundDemarche from "../../assets/comment-contribuer/CommentContribuer-background_rouge.svg";
import BackgroundStructure from "../../assets/comment-contribuer/CommentContribuer-background_violet.svg";
import BackgroundLexique from "../../assets/comment-contribuer/CommentContribuer-background_bleu.svg";
import BackgroundTraduction from "../../assets/comment-contribuer/CommentContribuer_backgroundTraduction.svg";
import { colorAvancement } from "../../components/Functions/ColorFunctions";
import { ReactComponent as PapillonViolet } from "../../assets/comment-contribuer/CommentContribuer-papillon_violet.svg";
import { ReactComponent as PapillonRose } from "../../assets/comment-contribuer/CommentContribuer-papillon_rose.svg";
import gif from "../../assets/comment-contribuer/GIF-corriger.gif";
import i18n from "../../i18n";
import "./CommentContribuer.scss";

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

const CardContainer = styled.div`
  width: 200px;
  height: 200px;
  background-color: #ffffff;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 20px;
  padding-right: 20px;
  padding-left: 20px;
  padding-top: 10px;
  font-weight: bold;
  font-size: 40px;
  line-height: 51px;
  cursor: pointer;
  border: 4px solid #ffffff;

  &:hover {
    border: 4px solid #212121;
  }
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

const IconContainer = styled.div`
  align-self: flex-end;
  margin: 0px;
  padding: 0px;
`;

const RedactionCardsContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 48px;
  justify-content: space-between;
`;

const HeaderCard = (props) => (
  <CardContainer>
    <IconContainer>
      {props.eva ? (
        <EVAIcon name={props.iconName} size="xlarge" fill="#212121" />
      ) : (
        <SVGIcon name="translate" fill="#212121" width="40px" height="40px" />
      )}
    </IconContainer>
    {props.title}
  </CardContainer>
);

const HeaderCardsContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const DispoCardContainer = styled.div`
  background-image: url(${BackgroundDispositif});
  background-repeat: no-repeat;
  height: 480px;
  width: 283px;
  border-radius: 12px;
  padding: 24px;
  padding-bottom: 12px;
  border: 4px solid #ffffff;
  cursor: pointer;
  &:hover {
    border: 4px solid #f9aa75;
  }
  position: relative;
`;

const DemarcheCardContainer = styled.div`
  background-image: url(${BackgroundDemarche});
  background-repeat: no-repeat;
  height: 480px;
  width: 283px;
  border-radius: 12px;
  padding: 24px;
  padding-bottom: 12px;

  border: 4px solid #ffffff;
  cursor: pointer;
  &:hover {
    border: 4px solid #de6b8a;
  }
  position: relative;
`;

const StructureCardContainer = styled.div`
  background-image: url(${BackgroundStructure});
  background-repeat: no-repeat;
  height: 480px;
  width: 283px;
  border-radius: 12px;
  padding: 24px;
  padding-bottom: 12px;

  border: 4px solid #ffffff;
  cursor: not-allowed;
  position: relative;
`;

const LexiqueCardContainer = styled.div`
  background-image: url(${BackgroundLexique});
  background-repeat: no-repeat;
  height: 480px;
  width: 283px;
  border-radius: 12px;
  padding: 24px;
  padding-bottom: 12px;

  border: 4px solid #ffffff;
  cursor: not-allowed;
  position: relative;
`;

const TitleContainer = styled.div`
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  margin-top: 16px;
`;

const TitleFramed = styled.div`
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  color: #fbfbfb;
  background: #212121;
  padding: 4px 8px;
  width: ${(props) => props.width};
  margin-top: 4px;
`;
const DescriptionText = styled.div`
  font-size: 18px;
  line-height: 23px;
  margin-top: 16px;
`;

const TimeContainer = styled.div`
  display: flex;
  flex-direction: row;
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  position: absolute;
  bottom: 12px;
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

const DispositifCard = (props) => (
  <DispoCardContainer>
    <img src={assetsOnServer.commentContribuer.dispositif} alt="dispositif" />
    <div
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <TitleContainer>
          {props.t("CommentContribuer.Rédiger une fiche", "Rédiger une fiche")}
        </TitleContainer>
        <TitleFramed width={"113px"}>
          {props.t("CommentContribuer.Dispositif", "Dispositif")}
        </TitleFramed>
        <DescriptionText>
          {props.t(
            "CommentContribuer.DispositifDescription",
            `Programme, atelier, formation, cours en ligne, permanence d’accueil ou
      tout autre dispositif directement accessible par les personnes réfugiées.`
          )}
        </DescriptionText>
      </div>
      <TimeContainer>
        <EVAIcon
          name="clock-outline"
          fill="#000000"
          size="10"
          className="mr-10"
        />
        {"~ 20 "}
        {props.t("CommentContribuer.minutes", "minutes")}
      </TimeContainer>
    </div>
  </DispoCardContainer>
);

const StructureCard = (props) => (
  <StructureCardContainer>
    <img src={assetsOnServer.commentContribuer.structure} alt="structure" />
    <div
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <TitleContainer>
          {props.t("CommentContribuer.Recenser", "Recenser une")}
        </TitleContainer>
        <TitleFramed width={"148px"}>
          {props.t("CommentContribuer.Organisation", "Organisation")}
        </TitleFramed>
        <DescriptionText>
          {props.t(
            "CommentContribuer.StructureDescription",
            "Complétez l’annuaire de l’intégration pour faciliter la prise de contact entre acteurs et l’accès aux interlocuteurs pour les personnes réfugiées."
          )}
        </DescriptionText>
      </div>
      <TimeContainer>
        <EVAIcon
          name="sun-outline"
          fill="#000000"
          size="10"
          className="mr-10"
        />
        {props.t("Bientôt disponible", "Bientôt disponible")}
      </TimeContainer>
    </div>
  </StructureCardContainer>
);

const DemarcheCard = (props) => (
  <DemarcheCardContainer>
    <img src={assetsOnServer.commentContribuer.demarche} alt="demarche" />
    <div
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <TitleContainer>
          {props.t("CommentContribuer.Rédiger une fiche", "Rédiger une fiche")}
        </TitleContainer>
        <TitleFramed width={"122px"}>
          {props.t("CommentContribuer.Démarche", "Démarche")}
        </TitleFramed>
        <DescriptionText>
          {props.t(
            "CommentContribuer.DemarcheDescription",
            "Expliquez une démarche administrative étape par étape pour faciliter son accès et sa compréhension par les personnes réfugiées."
          )}
        </DescriptionText>
      </div>
      <TimeContainer>
        <EVAIcon
          name="clock-outline"
          fill="#000000"
          size="10"
          className="mr-10"
        />
        {"~ 40 "}
        {props.t("CommentContribuer.minutes", "minutes")}
      </TimeContainer>
    </div>
  </DemarcheCardContainer>
);

const LexiqueCard = (props) => (
  <LexiqueCardContainer>
    <img src={assetsOnServer.commentContribuer.lexique} alt="lexique" />
    <div
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <TitleContainer>
          {props.t("CommentContribuer.Ajouter un mot au", "Ajouter un mot au")}
        </TitleContainer>
        <TitleFramed width={"97px"}>
          {props.t("CommentContribuer.Lexique", "Lexique")}
        </TitleFramed>
        <DescriptionText>
          {props.t(
            "CommentContribuer.LexiqueDescription",
            "Expliquez les mots difficiles de l’administration et de l’intégration pour faciliter la compréhension pour les personnes réfugiées."
          )}
        </DescriptionText>
      </div>

      <TimeContainer>
        <EVAIcon
          name="calendar-outline"
          fill="#000000"
          size="10"
          className="mr-10"
        />
        {props.t("CommentContribuer.Prochainement", "Prochainement")}
      </TimeContainer>
    </div>
  </LexiqueCardContainer>
);

class CommentContribuer extends Component {
  state = {
    showModals: { checkDemarche: false },
    nbTraductors: 0,
    nbExperts: 0,
  };
  _isMounted = false;

  componentDidMount() {
    this._isMounted = true;
    API.getFiguresOnUsers().then((data) =>
      this.setState({
        nbExperts: this._isMounted && data.data.data.nbExperts,
        nbTraductors: this._isMounted && data.data.data.nbTraductors,
      })
    );
    window.scrollTo(0, 0);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  toggleModal = (show, name) =>
    this.setState((prevState) => ({
      showModals: { ...prevState.showModals, [name]: show },
    }));

  getActiveLangues = () =>
    this.props.langues.filter(
      (langue) => langue.avancement > 0 && langue.langueCode !== "fr"
    );

  render() {
    const { t } = this.props;

    const activeLangues = this.getActiveLangues();
    const isRTL = ["ar", "ps", "fa"].includes(i18n.language);
    return (
      <MainContainer className="commentContribuer">
        <HeaderContainer>
          <HeaderText>
            {t("CommentContribuer.Comment contribuer", "Comment contribuer ?")}
          </HeaderText>
          <HeaderCardsContainer>
            <div style={{ marginRight: isRTL ? "0px" : "48px" }}>
              <AnchorLink offset="60" href="#ecrire-card">
                <HeaderCard
                  title={t("CommentContribuer.écrire", "écrire")}
                  iconName="edit-outline"
                  eva={true}
                />
              </AnchorLink>
            </div>
            <div style={{ marginRight: "48px" }}>
              <AnchorLink offset="60" href="#traduire-card">
                <HeaderCard
                  title={t("CommentContribuer.traduire", "traduire")}
                  iconName="edit-outline"
                />
              </AnchorLink>
            </div>
            <AnchorLink offset="60" href="#corriger">
              <div style={{ marginRight: isRTL ? "48px" : "0px" }}>
                <HeaderCard
                  title={t("CommentContribuer.corriger", "corriger")}
                  iconName="done-all-outline"
                  eva={true}
                />
              </div>
            </AnchorLink>
          </HeaderCardsContainer>
          <EcrireAnchor id="ecrire" />
        </HeaderContainer>
        <RedactionContainer id="ecrire-card">
          {t("CommentContribuer.Redaction", "Rédiger de nouveaux contenus")}
          <RedactionCardsContainer>
            <NavLink to="/dispositif" className="no-decoration">
              <DispositifCard t={t} />
            </NavLink>
            <NavLink to="/demarche" className="no-decoration">
              <DemarcheCard t={t} />
            </NavLink>

            <StructureCard t={t} />
            <LexiqueCard t={t} />
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
            {t(
              "CommentContribuer.Traduction",
              "Traduire pour rendre accessible"
            )}
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
                <NavLink to="/backend/user-dashboard">
                  <NumberTraduction
                    amount={this.state.nbTraductors}
                    text={t(
                      "CommentContribuer.traducteurs actifs",
                      "traducteurs actifs"
                    )}
                    isRTL={isRTL}
                    width={181}
                  />
                </NavLink>
                <NavLink to="/backend/user-dashboard">
                  <NumberTraduction
                    amount={this.state.nbExperts}
                    text={t(
                      "CommentContribuer.experts en traduction",
                      "experts en traduction"
                    )}
                    width={326}
                    isRTL={isRTL}
                  />
                </NavLink>
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
        <CorrectionContainer id="corriger">
          <CorrectionHeader>
            {t(
              "CommentContribuer.Corriger",
              "Corriger et enrichir l'information"
            )}
          </CorrectionHeader>
          <CorrectionContentContainer>
            <RoundIcon
              iconName={"message-circle-outline"}
              iconColor="#212121"
            />
            <div
              style={{
                fontWeight: "bold",
                fontSize: "22px",
                lineHeight: "28px",
                marginTop: "16px",
                marginBottom: "16px",
              }}
            >
              {t(
                "CommentContribuer.Commentaires ciblés",
                "Commentaires ciblés"
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
                "CommentContribuer.Commentaires ciblés explications",
                "Un paragraphe est erroné ? Réagissez directement au niveau du paragraphe. Pas besoin de compte. Cherchez l’icône ci-dessus en passant votre souris sur le paragraphe à corriger."
              )}
            </div>
            <RoundIcon iconName={"edit-outline"} iconColor="#828282" />
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
              right: isRTL && "992px",
              top: "328px",
              left: !isRTL && "992px",
            }}
          >
            <PapillonRose />
          </div>
          <div
            style={{
              position: "absolute",
              right: isRTL && "676px",
              top: "268px",
              left: !isRTL && "676px",
              zIndex: 3,
            }}
          >
            <img src={gif} alt="loading..." className="gif" />
          </div>
          <div
            style={{
              position: "absolute",
              left: !isRTL && "556px",
              top: "0px",
              right: isRTL && "556px",
            }}
          >
            <PapillonViolet />
          </div>
        </CorrectionContainer>
      </MainContainer>
    );
  }
}
const NumberTraductionContainer = styled.div`
  background: #ffffff;
  border-radius: 12px;
  display: flex;
  flex-direction: row;
  padding: 8px;
  align-items: center;
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  width: ${(props) => props.width};
  margin-right: 32px;
`;

const NumberContainer = styled.div`
  background: #212121;
  border-radius: 12px;
  color: #ffffff;
  font-weight: bold;
  font-size: 40px;
  line-height: 51px;
  padding: 8px 16px;
  margin-right: ${(props) => (props.isRTL ? "0px" : "8px")};
  margin-left: ${(props) => (props.isRTL ? "8px" : "0px")};
`;

const NumberTraduction = (props) => (
  <NumberTraductionContainer width={props.width}>
    <NumberContainer isRTL={props.isRTL}>{props.amount}</NumberContainer>
    {props.text}
  </NumberTraductionContainer>
);

const LangueContainer = styled.div`
  background: #fbfbfb;
  border-radius: 12px;
  display: flex;
  flex-direction: row;
  padding: 24px;
  margin-right: 32px;
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  align-items: center;
  width: 340px;
  border: 2px solid #fbfbfb;

  &:hover {
    border: 2px solid #212121;
  }
`;

const ProgressContainer = styled.div`
  width: 100px;
  margin-left: ${(props) => (props.isRTL ? "8px" : "24px")};
  margin-right: ${(props) => (props.isRTL ? "24px" : "8px")};
`;
const AvancementContainer = styled.div`
  color: ${(props) => props.color};
`;
const Langue = (props) => (
  <NavLink to="/backend/user-dashboard">
    <LangueContainer>
      <div
        style={{
          marginRight: props.isRTL ? "0px" : "16px",
          marginLeft: props.isRTL ? "16px" : "0px",
        }}
      >
        <i
          title={props.langue.langueCode}
          className={" flag-icon flag-icon-" + props.langue.langueCode}
        />
      </div>
      {props.langue.langueFr === "Persan"
        ? "Persan/Dari"
        : props.langue.langueFr}
      <ProgressContainer isRTL={props.isRTL}>
        <Progress
          color={colorAvancement(props.langue.avancementTrad)}
          value={props.langue.avancementTrad * 100}
        />
      </ProgressContainer>
      <AvancementContainer
        className={"text-" + colorAvancement(props.langue.avancementTrad)}
      >
        {Math.round((props.langue.avancementTrad || 0) * 100)}%
      </AvancementContainer>
    </LangueContainer>
  </NavLink>
);

const RoundIconContainer = styled.div`
  width: 60px;
  height: 60px;
  background: #f2f2f2;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RoundIcon = (props) => (
  <RoundIconContainer>
    <EVAIcon name={props.iconName} fill={props.iconColor} size="xlarge" />
  </RoundIconContainer>
);
const mapStateToProps = (state) => {
  return {
    langues: state.langue.langues,
  };
};

export default connect(mapStateToProps)(withTranslation()(CommentContribuer));
