import { GetAllStructuresResponse, Id, StructureStatus } from "@refugies-info/api-types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useToggle from "react-use/lib/useToggle";
import { Modal, Spinner } from "reactstrap";
import styled from "styled-components";
import Swal from "sweetalert2";
import { SearchStructures } from "~/components";
import FButton from "~/components/UI/FButton/FButton";
import { handleApiError } from "~/lib/handleApiErrors";
import { fetchAllDispositifsActionsCreator } from "~/services/AllDispositifs/allDispositifs.actions";
import { fetchAllStructuresActionsCreator } from "~/services/AllStructures/allStructures.actions";
import { allStructuresSelector } from "~/services/AllStructures/allStructures.selector";
import { LoadingStatusKey } from "~/services/LoadingStatus/loadingStatus.actions";
import { isLoadingSelector } from "~/services/LoadingStatus/loadingStatus.selectors";
import API from "~/utils/API";
import { colors } from "~/utils/colors";
import { NewStructureModal } from "../../AdminStructures/NewStructureModal";
import styles from "./ChangeStructureModale.module.scss";

interface Props {
  show: boolean;
  toggle: () => void;
  dispositifId: Id | null;
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
  const [selectedStructure, setSelectedStructure] = useState<GetAllStructuresResponse | null>(null);
  const dispatch = useDispatch();
  const structures = useSelector(allStructuresSelector).filter(
    (structure) => structure.status === "Actif" || structure.status === "En attente",
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
      API.updateDispositifMainSponsor(props.dispositifId.toString(), {
        sponsorId: selectedStructure._id.toString(),
      })
        .then(() => {
          Swal.fire({
            title: "Yay...",
            text: "Structure modifiée",
            icon: "success",
            timer: 1500,
          });
          toggleModal();
          dispatch(fetchAllDispositifsActionsCreator());
        })
        .catch(() => {
          handleApiError({ text: "Erreur lors de la modification" });
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
        defaultStatus={StructureStatus.ACTIVE}
        show={showNewStructureModal}
        toggleModal={toggleNewStructureModal}
      />
    </>
  );
};
