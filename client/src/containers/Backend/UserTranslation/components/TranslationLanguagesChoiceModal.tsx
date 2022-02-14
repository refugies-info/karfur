import React, { useState, useEffect } from "react";
import { Modal } from "reactstrap";
import FButton from "components/FigmaUI/FButton/FButton";
import { useSelector, useDispatch } from "react-redux";
import { allLanguesSelector } from "services/Langue/langue.selectors";
import { userSelector } from "services/User/user.selectors";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { Language, UserLanguage } from "types/interface";
import { saveUserActionCreator } from "services/User/user.actions";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import { colors } from "colors";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { withRouter, RouteComponentProps } from "react-router-dom";
// import { ObjectId } from "mongodb";
import styles from "./TranslationLanguagesChoiceModal.module.scss";

const Header = styled.div`
  font-weight: bold;
  font-size: 40px;
  line-height: 51px;
  margin: 0px 50px 0px 50px;
`;

const SubTitle = styled.div`
  font-weight: normal;
  font-size: 16px;
  line-height: 20px;
  margin: 45px 50px 15px 50px;
`;

const LangueItemContainer = styled.div`
  background: ${(props) =>
    props.isSelected ? colors.validation : colors.gris};
  border-radius: 12px;
  display: flex;
  flex-direction: row;
  width: 185px;
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  padding: 20px;
  margin: 5px;
  justify-content: space-between;
  cursor: pointer;
  align-items: center;
`;

const LanguesContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0px 45px 0px 45px;
`;

const CheckBoxContainer = styled.div`
  background: ${(props) =>
    props.isSelected ? colors.validationDefault : colors.blancSimple};
  border: ${(props) =>
    props.isSelected
      ? `1px solid ${colors.validationDefault}`
      : `1px solid ${colors.noirCD}`};

  box-sizing: border-box;
  border-radius: 3px;
  width: 20px;
  height: 20px;
  position: relative;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 0px 50px 0px 50px;
  margin-top: 70px;
`;
interface Props extends RouteComponentProps {
  show: boolean;
  toggle: () => void;
}

const LangueItem = (props: {
  langue: Language;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <LangueItemContainer isSelected={props.isSelected} onClick={props.onClick}>
    <div
      style={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <div
        style={{
          marginRight: "10px",
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
    </div>
    <CheckBoxContainer isSelected={props.isSelected}>
      <div style={{ position: "absolute", bottom: "-2px" }}>
        <EVAIcon name="checkmark-outline" />
      </div>
    </CheckBoxContainer>
  </LangueItemContainer>
);

const TranslationLanguagesChoiceModalComponent = (props: Props) => {
  const [selectedLangues, setSelectedLangues] = useState<UserLanguage[]>([]);

  const langues = useSelector(allLanguesSelector);
  const user = useSelector(userSelector);
  const isLoadingLangues = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_LANGUES)
  );
  const isLoadingUser = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_USER)
  );

  const isLoading = isLoadingLangues || isLoadingUser;
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      user &&
      user.user &&
      user.user.selectedLanguages &&
      user.user.selectedLanguages.length > 0
    ) {
      setSelectedLangues(user.user.selectedLanguages);
    }
  }, [isLoading, user]);

  if (isLoading)
    return (
      <Modal
        isOpen={props.show}
        toggle={props.toggle}
        className={styles.modal}
        contentClassName={styles.modal_content}
      >
        <Header>Choix de vos langues</Header>
        <SubTitle>Cochez les langues que vous souhaitez utiliser : </SubTitle>
        <div style={{ marginRight: "50px", marginLeft: "50px" }}>
          <Skeleton count={3} />
        </div>

        <ButtonsContainer>
          <FButton type="outline-black" name="refresh" disabled={true}>
            Réinitialiser
          </FButton>
          <div>
            <FButton
              type="outline-black"
              name="close-outline"
              onClick={props.toggle}
            >
              Annuler
            </FButton>
            <FButton
              type="validate"
              name="checkmark-outline"
              onClick={() => {}}
              className="ml-10"
              disabled={true}
            >
              Valider
            </FButton>
          </div>
        </ButtonsContainer>
      </Modal>
    );

  const handleCheck = (langue: Language) => {
    const isLangueSelected = !!selectedLangues.find(
      (selectedLangue) => selectedLangue._id === langue._id
    );

    if (isLangueSelected) {
      return setSelectedLangues(
        selectedLangues.filter(
          (selectedLangue) => selectedLangue._id !== langue._id
        )
      );
    }

    if (!isLangueSelected) {
      const newSelectedLangues: UserLanguage[] = []; /* selectedLangues.concat({
        //@ts-ignore
        _id: langue._id,
        i18nCode: langue.i18nCode,
        langueCode: langue.langueCode,
        langueFr: langue.langueFr,
        langueLoc: langue.langueLoc,
      }); */
      setSelectedLangues(newSelectedLangues);
    }
  };

  const onReinitClick = () => setSelectedLangues([]);


  const onValidate = () => {
    if (!user || !user.user) return;
    dispatch(
      saveUserActionCreator({
        user: {
          selectedLanguages: selectedLangues,
          _id: user.user._id,
        },
        type: "modify-my-details",
      })
    );

    props.toggle();
    return props.history.push(
      "/backend/user-translation/" + selectedLangues[0].i18nCode
    );
  };
  return (
    <Modal
      isOpen={props.show}
      toggle={props.toggle}
      className={styles.modal}
      contentClassName={styles.modal_content}
      size="md"
    >
      <Header>Choix de vos langues</Header>
      <SubTitle>Cochez les langues que vous souhaitez utiliser : </SubTitle>
      <LanguesContainer>
        {langues
          .filter(
            // @ts-ignore
            (langue) => langue.avancement > 0.8 && langue.i18nCode !== "fr"
          )
          .map((langue) => {
            const isLangueSelected =
              selectedLangues.filter(
                (selectedLangue) => selectedLangue._id === langue._id
              ).length > 0;
            return (
              <LangueItem
                langue={langue}
                key={langue.i18nCode}
                isSelected={isLangueSelected}
                onClick={() => handleCheck(langue)}
              />
            );
          })}
      </LanguesContainer>
      <ButtonsContainer>
        <FButton type="outline-black" name="refresh" onClick={onReinitClick}>
          Réinitialiser
        </FButton>
        <div>
          <FButton
            type="outline-black"
            name="close-outline"
            onClick={props.toggle}
          >
            Annuler
          </FButton>
          <FButton
            type="validate"
            name="checkmark-outline"
            disabled={selectedLangues.length === 0}
            onClick={onValidate}
            className="ml-10"
          >
            Valider
          </FButton>
        </div>
      </ButtonsContainer>
    </Modal>
  );
};

export const TranslationLanguagesChoiceModal = withRouter(
  TranslationLanguagesChoiceModalComponent
);
