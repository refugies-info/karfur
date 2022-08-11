import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Modal, Spinner, Table } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import FButton from "components/UI/FButton/FButton";
import { ObjectId } from "mongodb";
import { dispositifSelector } from "services/AllDispositifs/allDispositifs.selector";
import { TagButton } from "../../Needs/TagButton";
import { jsUcfirst, removeAccents } from "lib";
import FInput from "components/UI/FInput/FInput";
import { needsSelector } from "services/Needs/needs.selectors";
import { DeleteButton } from "../../sharedComponents/SubComponents";
import { colors } from "colors";
import API from "utils/API";
import { fetchAllDispositifsActionsCreator } from "services/AllDispositifs/allDispositifs.actions";
import styles from "./NeedsChoiceModal.module.scss";

interface Props {
  show: boolean;
  toggle: () => void;
  dispositifId: ObjectId | null;
}

const Content = styled.div`
  padding: 24px;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

const Title = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 32px;
  line-height: 40px;
  margin-bottom: 8px;
  margin-right: 8px;
`;

const TitreInfo = styled.div`
  font-style: normal;
  font-size: 28px;
  line-height: 40px;
  margin-bottom: 8px;
`;
const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
`;
const ButtonContainer = styled(RowContainer)`
  justify-content: space-between;
`;

const PossibleNeedContainer = styled(RowContainer)`
  justify-content: space-between;
  align-items: center;
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 4px;
  padding-bottom: 4px;
  cursor: pointer;
`;

const TagsContainer = styled(RowContainer)`
  margin-bottom: 12px;
  margin-left: -4px;
`;

const SubTitle = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  margin: 12px 0px 8px 0px;
`;

const PossibleNeedsContainer = styled.div`
  max-height: 350px;
  overflow-y: auto;
  background-color: ${colors.gray60};
  margin-top: -10px;
  border-radius: 12px;
`;

const TitleContainer = styled(RowContainer)`
  align-items: center;
`;

export const NeedsChoiceModal = (props: Props) => {
  const [value, setValue] = useState("");

  const isLoading = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_ALL_DISPOSITIFS)
  );

  const [selectedNeeds, setSelectedNeeds] = useState<ObjectId[]>([]);

  const dispatch = useDispatch();

  const dispositif = useSelector(dispositifSelector(props.dispositifId));

  useEffect(() => {
    if (dispositif && dispositif.needs && dispositif.needs.length > 0) {
      setSelectedNeeds(dispositif.needs);
    }
  }, []);

  const allNeeds = useSelector(needsSelector);
  const allPossibleNeeds = dispositif
    ? allNeeds.filter((need) => {
        let isPossible = false;
        [dispositif.theme, ...dispositif.secondaryThemes].forEach((theme) => {
          if (theme._id === need.theme._id) {
            isPossible = true;
            return;
          }
        });
        if (selectedNeeds.includes(need._id)) {
          isPossible = false;
        }
        return isPossible;
      })
    : [];

  const onValueChange = (e: any) => setValue(e.target.value);

  const onSelectNeed = (needId: ObjectId) => {
    if (selectedNeeds.includes(needId)) {
      return;
    }
    setSelectedNeeds(selectedNeeds.concat([needId]));
    setValue("");
  };

  const onRemoveNeed = (needId: ObjectId) => {
    const newNeeds = selectedNeeds.filter((need) => need !== needId);
    setSelectedNeeds(newNeeds);
  };

  const onValidate = async () => {
    await API.updateDispositifTagsOrNeeds({
      query: {
        dispositifId: props.dispositifId,
        needs: selectedNeeds,
      },
    });
    dispatch(fetchAllDispositifsActionsCreator());
    props.toggle();
  };

  const filteredPossibleNeeds = value
    ? allPossibleNeeds.filter((possibleNeed) => {
        const normalizedNeed = removeAccents(possibleNeed.fr.text)
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase();

        const normalizedValue = removeAccents(value)
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase();
        if (normalizedNeed.includes(normalizedValue)) {
          return true;
        }
        return false;
      })
    : [];
  if (isLoading) {
    return (
      <Modal
        isOpen={props.show}
        toggle={props.toggle}
        className={styles.modal}
        contentClassName={styles.modal_content}
      >
        <Spinner />
      </Modal>
    );
  }

  if (!dispositif) {
    return (
      <Modal
        isOpen={props.show}
        toggle={props.toggle}
        className={styles.modal}
        contentClassName={styles.modal_content}
      >
        <div>Erreur</div>
      </Modal>
    );
  }
  return (
    <Modal
    isOpen={props.show}
    size="lg"
    toggle={props.toggle}
    className={styles.modal}
    contentClassName={styles.modal_content}
    >
      <Content>
        <div>
          <TitleContainer>
            <Title>Besoins de la fiche :</Title>
            <TitreInfo>{dispositif.titreInformatif}</TitreInfo>
          </TitleContainer>
          <SubTitle>Thème(s) de la fiche</SubTitle>
          <TagsContainer>
            {dispositif &&
              [dispositif.theme, ...(dispositif.secondaryThemes || [])].map((theme, index) => {
                return (
                  <TagButton
                    key={index}
                    name={jsUcfirst(theme.short.fr) || ""}
                    icon={theme.icon}
                    isSelected={true}
                    color={theme.colors.color100}
                  />
                );
              })}
          </TagsContainer>

          <SubTitle>Ajouter un besoin</SubTitle>
          <FInput
            id="need-input"
            autoFocus={false}
            value={value}
            onChange={onValueChange}
            newSize={true}
          />

          <PossibleNeedsContainer>
            {filteredPossibleNeeds.map((possibleNeed) => {
              if (!possibleNeed.theme) return;
              return (
                <PossibleNeedContainer
                  key={possibleNeed.fr.text}
                  onClick={() => onSelectNeed(possibleNeed._id)}
                >
                  <div>{possibleNeed.fr.text}</div>
                  <TagButton
                    name={jsUcfirst(possibleNeed.theme.short.fr) || ""}
                    icon={possibleNeed.theme.icon}
                    isSelected={true}
                    color={possibleNeed.theme.colors.color100}
                  />
                </PossibleNeedContainer>
              );
            })}
          </PossibleNeedsContainer>

          <Table responsive borderless>
            <thead>
              <tr>
                {["Nom", "Thème", ""].map((element, key) => (
                  <th key={key}>
                    <div>{element}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {selectedNeeds.map((need, key) => {
                const filteredNeeds = allNeeds.filter((el) => el._id === need);
                const needPopulate =
                  filteredNeeds.length > 0 ? filteredNeeds[0] : null;
                const needTheme = needPopulate
                  ? needPopulate.theme
                  : null;
                if (!needTheme || !needPopulate) return;
                return (
                  <tr key={key}>
                    <td className="align-middle">{needPopulate.fr.text}</td>
                    <td className="align-middle">
                      <div style={{ marginLeft: -4 }}>
                        <TagButton
                          name={jsUcfirst(needTheme.short.fr) || ""}
                          icon={needTheme.icon}
                          isSelected={true}
                          color={needTheme.colors.color100}
                        />
                      </div>
                    </td>
                    <td className="align-middle">
                      <DeleteButton
                        onClick={() => onRemoveNeed(need)}
                        disabled={false}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>

          <ButtonContainer>
            <FButton
              type="light-action"
              name="arrow-back-outline"
              onClick={props.toggle}
            >
              Retour
            </FButton>
            <FButton
              type="validate"
              name="checkmark-outline"
              onClick={onValidate}
            >
              Valider
            </FButton>
          </ButtonContainer>
        </div>
      </Content>
    </Modal>
  );
};
