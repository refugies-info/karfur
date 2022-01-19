import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Modal, Spinner } from "reactstrap";
import "./ChangeStructureModale.scss";
import SearchBar from "components/UI/SearchBar/SearchBar";
import { useSelector, useDispatch } from "react-redux";
import { fetchActiveStructuresActionCreator } from "../../../../../services/ActiveStructures/activeStructures.actions";
import { activeStructuresSelector } from "../../../../../services/ActiveStructures/activeStructures.selector";
import { isLoadingSelector } from "../../../../../services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "../../../../../services/LoadingStatus/loadingStatus.actions";
import { SimplifiedStructure } from "../../../../../types/interface";
import { colors } from "colors";
import FButton from "../../../../../components/FigmaUI/FButton/FButton";
import API from "../../../../../utils/API";
import { ObjectId } from "mongodb";
import Swal from "sweetalert2";
import { fetchAllDispositifsActionsCreator } from "../../../../../services/AllDispositifs/allDispositifs.actions";

interface Props {
  show: boolean;
  toggle: () => void;
  dispositifId: ObjectId | null;
  dispositifStatus: string | null;
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
  font-weight: 500;
  font-size: 32px;
  line-height: 40px;
  margin-bottom: 24px;
`;

const SelectedStructure = styled.div`
  background: ${colors.blancSimple};
  width: 100%;
  padding: 8px;
  border-radius: 12px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const ModifyLink = styled.div`
  font-weight: bold;
  margin-top: 12px;
  cursor: pointer;
`;

const Warning = styled.div`
  background: ${colors.erreur};
  width: 100%;
  padding: 8px;
  border-radius: 12px;
  margin-bottom: 8px;
`;
export const ChangeStructureModal = (props: Props) => {
  const [
    selectedStructure,
    setSelectedStructure,
  ] = useState<SimplifiedStructure | null>(null);
  const dispatch = useDispatch();
  useEffect(() => {
    const loadStructures = () => {
      dispatch(fetchActiveStructuresActionCreator());
    };
    loadStructures();
  }, [dispatch]);
  const isLoading = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_STRUCTURES)
  );
  const structures = useSelector(activeStructuresSelector);
  const selectItem = (item: any) => setSelectedStructure(item);
  const toggleModal = () => {
    setSelectedStructure(null);
    props.toggle();
  };
  const validateStructureChange = () => {
    if (selectedStructure && props.dispositifId) {
      API.modifyDispositifMainSponsor({
        query: {
          dispositifId: props.dispositifId,
          sponsorId: selectedStructure._id,
          status: props.dispositifStatus,
        },
      })
        .then(() => {
          Swal.fire({
            title: "Yay...",
            text: "Structure modifiée",
            type: "success",
            timer: 1500,
          });
          toggleModal();
          dispatch(fetchAllDispositifsActionsCreator());
        })
        .catch(() => {
          Swal.fire({
            title: "Oh non",
            text: "Erreur lors de la modification",
            type: "error",
            timer: 1500,
          });
        });
    }
  };

  if (isLoading)
    return (
      <Modal
        className="change-structure-modal"
        isOpen={props.show}
        size="lg"
        toggle={toggleModal}
      >
        <Content>
          <Spinner />
        </Content>
      </Modal>
    );
  return (
    <Modal
      className="change-structure-modal"
      isOpen={props.show}
      size="lg"
      toggle={toggleModal}
    >
      <Content>
        <div>
          <Title>Choisissez la structure du contenu :</Title>
          {!selectedStructure && (
            <SearchBar
              structures
              className="search-bar inner-addon right-addon"
              placeholder="Chercher"
              array={structures}
              selectItem={selectItem}
            />
          )}
          {selectedStructure && (
            <div>
              <SelectedStructure>{selectedStructure.nom}</SelectedStructure>
              <ModifyLink onClick={() => setSelectedStructure(null)}>
                <u>Modifier</u>
              </ModifyLink>
            </div>
          )}
        </div>
        <div>
          {selectedStructure && (
            <Warning>
              Au clic sur Valider, la structure sera modifiée dans le dispositif
              ou la démarche.
            </Warning>
          )}
          <ButtonContainer>
            <FButton
              type="light-action"
              name="arrow-back-outline"
              onClick={toggleModal}
            >
              Retour
            </FButton>
            <FButton
              type="validate"
              name="checkmark-outline"
              disabled={!selectedStructure}
              onClick={validateStructureChange}
            >
              Valider
            </FButton>
          </ButtonContainer>
        </div>
      </Content>
    </Modal>
  );
};
