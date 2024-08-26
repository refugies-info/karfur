import { GetLanguagesResponse } from "@refugies-info/api-types";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import FButton from "components/UI/FButton/FButton";
import { useLanguages } from "hooks";
import useRouterLocale from "hooks/useRouterLocale";
import isUndefined from "lodash/isUndefined";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Modal } from "reactstrap";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { saveUserActionCreator } from "services/User/user.actions";
import { userSelector } from "services/User/user.selectors";
import styled from "styled-components";
import { colors } from "utils/colors";
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

const LangueItemContainer = styled.div<{ isSelected: boolean }>`
  background: ${(props: { isSelected: boolean }) => (props.isSelected ? colors.validation : colors.gray20)};
  border-radius: 12px;
  display: flex;
  flex-direction: row;
  width: 48%;
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

const CheckBoxContainer = styled.div<{ isSelected: boolean }>`
  background: ${(props: { isSelected: boolean }) => (props.isSelected ? colors.validationDefault : colors.white)};
  border: ${(props: { isSelected: boolean }) =>
    props.isSelected ? `1px solid ${colors.validationDefault}` : `1px solid ${colors.gray50}`};

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
interface Props {
  show: boolean;
  toggle: () => void;
}

interface LangueItemProps {
  langue: GetLanguagesResponse;
  isSelected: boolean;
  onClick: () => void;
}

const LangueItem = ({ langue, isSelected, onClick }: LangueItemProps) => (
  <LangueItemContainer isSelected={isSelected} onClick={onClick}>
    <div
      style={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <div className="me-2">
        <span title={langue.langueCode} className={" fi fi-" + langue.langueCode} />
      </div>
      {langue.langueFr === "Persan" ? "Persan/Dari" : langue.langueFr}
    </div>
    <CheckBoxContainer isSelected={isSelected}>
      <div style={{ position: "absolute", bottom: "-2px" }}>
        <EVAIcon name="checkmark-outline" />
      </div>
    </CheckBoxContainer>
  </LangueItemContainer>
);

const TranslationLanguagesChoiceModal = (props: Props) => {
  const history = useHistory();
  const [selectedLangues, setSelectedLangues] = useState<string[]>([]);

  const { langues, userTradLanguages } = useLanguages();
  const user = useSelector(userSelector);
  const isLoadingLangues = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_LANGUES));
  const isLoadingUser = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_USER));

  const isLoading = isLoadingLangues || isLoadingUser;
  const dispatch = useDispatch();
  const routerLocale = useRouterLocale();

  useEffect(() => {
    setSelectedLangues(userTradLanguages.map((t) => t.toString()));
  }, [userTradLanguages]);

  if (isLoading)
    return (
      <Modal isOpen={props.show} toggle={props.toggle} className={styles.modal} contentClassName={styles.modal_content}>
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
            <FButton type="outline-black" name="close-outline" onClick={props.toggle}>
              Annuler
            </FButton>
            <FButton type="validate" name="checkmark-outline" onClick={() => {}} className="ms-2" disabled={true}>
              Valider
            </FButton>
          </div>
        </ButtonsContainer>
      </Modal>
    );

  const handleCheck = (langue: GetLanguagesResponse) => {
    const isLangueSelected = !!selectedLangues.find((selectedLangue) => selectedLangue === langue._id);

    if (isLangueSelected) {
      return setSelectedLangues(selectedLangues.filter((selectedLangue) => selectedLangue !== langue._id));
    }

    if (!isLangueSelected) {
      setSelectedLangues([...selectedLangues, langue._id]);
    }
  };

  const onReinitClick = () => setSelectedLangues([]);

  const onValidate = () => {
    if (!user || !user.user) return;
    dispatch(
      saveUserActionCreator(user.user._id, {
        user: {
          selectedLanguages: selectedLangues,
        },
        action: "modify-my-details",
      }),
    );

    props.toggle();
    const firstLangue = langues.find((langue) => langue._id === selectedLangues[0]);
    return history.push(routerLocale + "/backend/user-translation/" + firstLangue?.i18nCode);
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
          .filter((langue) => langue.i18nCode !== "fr")
          .map((langue) => {
            const isLangueSelected = !isUndefined(
              selectedLangues.find((selectedLangue) => selectedLangue === langue._id),
            );
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
        <FButton type="outline-black" name="close-outline" onClick={props.toggle}>
          Annuler
        </FButton>
        <FButton type="validate" name="checkmark-outline" disabled={selectedLangues.length === 0} onClick={onValidate}>
          Valider
        </FButton>
      </ButtonsContainer>
    </Modal>
  );
};

export default TranslationLanguagesChoiceModal;
