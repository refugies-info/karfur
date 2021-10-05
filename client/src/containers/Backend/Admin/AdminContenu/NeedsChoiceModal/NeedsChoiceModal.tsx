import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Modal, Spinner, Table } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { isLoadingSelector } from "../../../../../services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "../../../../../services/LoadingStatus/loadingStatus.actions";
import FButton from "../../../../../components/FigmaUI/FButton/FButton";
import { ObjectId } from "mongodb";
import { dispositifSelector } from "../../../../../services/AllDispositifs/allDispositifs.selector";
import "./NeedsChoiceModal.scss";
import { TagButton } from "../../Needs/TagButton";
import { getTagColor, getTag } from "../../Needs/lib";
import { jsUcfirst, removeAccents } from "../../../../../lib";
import FInput from "../../../../../components/FigmaUI/FInput/FInput";
import { needsSelector } from "../../../../../services/Needs/needs.selectors";
import { DeleteButton } from "../../sharedComponents/SubComponents";
import { colors } from "../../../../../colors";
import API from "../../../../../utils/API";
import { fetchAllDispositifsActionsCreator } from "../../../../../services/AllDispositifs/allDispositifs.actions";

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
  background-color: ${colors.grey};
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
        dispositif.tags.forEach((tag) => {
          if (tag && tag.name === need.tagName) {
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
        titreInformatif: dispositif ? dispositif.titreInformatif : "",
        titreMarque: dispositif ? dispositif.titreMarque : "",
        typeContenu: dispositif ? dispositif.typeContenu : "",
        status: dispositif ? dispositif.status : "",
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
      <Modal isOpen={props.show} toggle={props.toggle} className="needs-modal">
        <Spinner />
      </Modal>
    );
  }

  if (!dispositif) {
    return (
      <Modal isOpen={props.show} toggle={props.toggle} className="needs-modal">
        <div>Erreur</div>
      </Modal>
    );
  }
  return (
    <Modal
      className="needs-modal"
      isOpen={props.show}
      size="lg"
      toggle={props.toggle}
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
              dispositif.tags &&
              dispositif.tags.map((tag, index) => {
                if (tag && tag.name) {
                  const tagColor = getTagColor(tag.name);
                  return (
                    <TagButton
                      name={jsUcfirst(tag.short) || ""}
                      icon={tag.icon}
                      isSelected={true}
                      color={tagColor}
                    />
                  );
                }
                return <div key={index} />;
              })}
          </TagsContainer>

          <SubTitle>Ajouter un besoin</SubTitle>
          <FInput
            autoFocus={false}
            value={value}
            onChange={onValueChange}
            newSize={true}
          />

          <PossibleNeedsContainer>
            {filteredPossibleNeeds.map((possibleNeed) => {
              const needTag = getTag(possibleNeed.tagName);

              if (!needTag) return;
              return (
                <PossibleNeedContainer
                  key={possibleNeed.fr.text}
                  onClick={() => onSelectNeed(possibleNeed._id)}
                >
                  <div>{possibleNeed.fr.text}</div>
                  <TagButton
                    name={jsUcfirst(needTag.short) || ""}
                    icon={needTag.icon}
                    isSelected={true}
                    color={needTag.darkColor}
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
                const needTag = needPopulate
                  ? getTag(needPopulate.tagName)
                  : null;
                if (!needTag || !needPopulate) return;
                return (
                  <tr key={key}>
                    <td className="align-middle">{needPopulate.fr.text}</td>
                    <td className="align-middle">
                      <div style={{ marginLeft: -4 }}>
                        <TagButton
                          name={jsUcfirst(needTag.short) || ""}
                          icon={needTag.icon}
                          isSelected={true}
                          color={needTag.darkColor}
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
