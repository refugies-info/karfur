import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Modal, Spinner } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { SimplifiedStructureForAdmin, Structure } from "types/interface";
import { colors } from "colors";
import FButton from "components/UI/FButton/FButton";
import API from "utils/API";
import { ObjectId } from "mongodb";
import Swal from "sweetalert2";
import { fetchAllDispositifsActionsCreator } from "services/AllDispositifs/allDispositifs.actions";
import styles from "./ChangeStructureModale.module.scss";
import useToggle from "react-use/lib/useToggle";
import { NewStructureModal } from "../../AdminStructures/NewStructureModal";
import { allStructuresSelector } from "services/AllStructures/allStructures.selector";
import { fetchAllStructuresActionsCreator } from "services/AllStructures/allStructures.actions";
import { SearchStructures } from "components";

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
  font-weight: 600;
  font-size: 32px;
  line-height: 40px;
  margin-bottom: 24px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 8px;
`;

const Warning = styled.div`
  background: ${colors.erreur};
  width: 100%;
  padding: 8px;
  border-radius: 12px;
  margin-bottom: 8px;
  margin-top: 8px;
`;

export const ChangeStructureModal = (props: Props) => {
  const [showNewStructureModal, toggleNewStructureModal] = useToggle(false);
  const [selectedStructure, setSelectedStructure] = useState<SimplifiedStructureForAdmin | Structure | null>(null);
  const dispatch = useDispatch();
  const structures = useSelector(allStructuresSelector).filter(
    (structure) => structure.status === "Actif" || structure.status === "En attente"
  );
  useEffect(() => {
    const loadStructures = () => {
      dispatch(fetchAllStructuresActionsCreator());
    };
    if (props.show && structures.length === 0) loadStructures();
  }, [dispatch, structures, props.show]);
  const isLoading = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_STRUCTURES));
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
          status: props.dispositifStatus
        }
      })
        .then(() => {
          Swal.fire({
            title: "Yay...",
            text: "Structure modifiée",
            icon: "success",
            timer: 1500
          });
          toggleModal();
          dispatch(fetchAllDispositifsActionsCreator());
        })
        .catch(() => {
          Swal.fire({
            title: "Oh non",
            text: "Erreur lors de la modification",
            icon: "error",
            timer: 1500
          });
        });
    }
  };

  if (isLoading)
    return (
      <Modal
        className={styles.modal}
        contentClassName={styles.modal_content}
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
    <>
      <Modal
        className={styles.modal}
        contentClassName={styles.modal_content}
        isOpen={props.show}
        size="lg"
        toggle={toggleModal}
      >
        <Content>
          <div>
            <Title>Modifier la structure</Title>
            <SearchStructures
              onChange={setSelectedStructure}
              onClickCreateStructure={toggleNewStructureModal}
              selectedStructure={selectedStructure}
              structures={structures}
            />
          </div>
          <div>
            {selectedStructure && (
              <Warning>Au clic sur Valider, la structure sera modifiée dans le dispositif ou la démarche.</Warning>
            )}
            <ButtonContainer>
              <FButton type="dark" name="plus-circle-outline" onClick={toggleNewStructureModal}>
                Créer une nouvelle structure
              </FButton>
              <FButton type="light-action" name="close-outline" onClick={toggleModal}>
                Annuler
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
      <NewStructureModal
        defaults={{ status: "actif" }}
        show={showNewStructureModal}
        toggleModal={toggleNewStructureModal}
      />
    </>
  );
};
