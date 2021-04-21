import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Event, Indicators } from "types/interface";
import { Modal, Spinner } from "reactstrap";
import "./UserDetailsModal.scss";
import moment from "moment/min/moment-with-locales";
import { useSelector, useDispatch } from "react-redux";
import marioProfile from "assets/mario-profile.jpg";
import { userSelector } from "../../../../../services/AllUsers/allUsers.selector";
import FInput from "../../../../../components/FigmaUI/FInput/FInput";
import { RowContainer } from "../../AdminStructures/components/AdminStructureComponents";
import {
  Structure,
  RoleCheckBox,
  LangueDetail,
} from "../ components/AdminUsersComponents";
import FButton from "../../../../../components/FigmaUI/FButton/FButton";
import { ObjectId } from "mongodb";
import API from "../../../../../utils/API";
import { fetchAllUsersActionsCreator } from "../../../../../services/AllUsers/allUsers.actions";
import Swal from "sweetalert2";
import { isLoadingSelector } from "../../../../../services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "../../../../../services/LoadingStatus/loadingStatus.actions";

moment.locale("fr");

const StructureName = styled.div`
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  margin: 4px 0px 8px 0px;
`;

const RowContainerWrap = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 8px;
`;

const IndicatorContainer = styled.div`
  display: flex;
  flex-direction: row;
`;
const IndicatorColumn = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 32px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 16px;
  justify-content: space-between;
`;
interface Props {
  show: boolean;
  toggleModal: () => void;
  selectedUserId: ObjectId | null;
}

export const UserDetailsModal: React.FunctionComponent<Props> = (
  props: Props
) => {
  // const [user, setUser] = useState<SimplifiedUser | null>(null);
  const [email, setEmail] = useState<string>("");
  const [roles, setRoles] = useState<string[]>([]);
  const [indicators, setIndicators] = useState<null | Indicators>(null);

  const userFromStore = useSelector(userSelector(props.selectedUserId));
  const dispatch = useDispatch();
  useEffect(() => {
    const loadIndicators = async () => {
      if (userFromStore) {
        const data = await API.get_progression({
          userId: userFromStore._id,
        });
        setIndicators(data.data);
      }
    };
    setEmail(userFromStore && userFromStore.email ? userFromStore.email : "");
    const roles =
      userFromStore && userFromStore.roles
        ? userFromStore.roles.filter(
            (role: string) => role === "Admin" || role === "ExpertTrad"
          )
        : [];
    setRoles(roles);
    loadIndicators();
  }, [userFromStore]);

  const onChange = (e: Event) => {
    setEmail(e.target.value);
  };

  const handleCheckBoxChange = (name: string) => {
    if (!roles) return;
    const mappedName = name === "Expert en traduction" ? "ExpertTrad" : "Admin";
    const hasAlreadyRole = roles.includes(mappedName);

    if (hasAlreadyRole) {
      const newRolesFiltered = roles.filter(
        (role: string) => role !== mappedName
      );
      // remove role
      return setRoles(newRolesFiltered);
    }

    const newRoles = roles.concat([mappedName]);
    // add role
    return setRoles(newRoles);
  };
  const onSaveClick = async () => {
    try {
      if (userFromStore) {
        await API.updateUser({
          query: {
            user: { _id: userFromStore._id, roles, email },
            action: "modify-with-roles",
          },
        });
        Swal.fire({
          title: "Yay...",
          text: "Utilisateur modifié",
          type: "success",
          timer: 1500,
        });
        dispatch(fetchAllUsersActionsCreator());
        props.toggleModal();
      }
    } catch (error) {
      Swal.fire({
        title: "Oh non",
        text: "Erreur lors de la modification",
        type: "error",
        timer: 1500,
      });
      dispatch(fetchAllUsersActionsCreator());
      props.toggleModal();
    }
  };

  const onDeleteClick = async () => {
    try {
      if (userFromStore) {
        await API.updateUser({
          query: {
            user: { _id: userFromStore._id, roles, email },
            action: "delete",
          },
        });
        Swal.fire({
          title: "Yay...",
          text: "Utilisateur supprimé",
          type: "success",
          timer: 1500,
        });
        dispatch(fetchAllUsersActionsCreator());
        props.toggleModal();
      }
    } catch (error) {
      Swal.fire({
        title: "Oh non",
        text: "Erreur lors de la suppression",
        type: "error",
        timer: 1500,
      });
      dispatch(fetchAllUsersActionsCreator());
      props.toggleModal();
    }
  };

  const secureUrl =
    userFromStore && userFromStore.picture && userFromStore.picture.secure_url
      ? userFromStore.picture.secure_url
      : marioProfile;

  const isLoading = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_ALL_USERS)
  );

  if (isLoading) {
    return (
      <Modal
        isOpen={props.show}
        toggle={props.toggleModal}
        className="user-details-modal"
      >
        <Spinner />
      </Modal>
    );
  }
  if (!userFromStore)
    return (
      <Modal
        isOpen={props.show}
        toggle={props.toggleModal}
        className="user-details-modal"
        size="large"
      >
        Erreur
      </Modal>
    );

  const hasStructure = userFromStore.structures.length > 0;
  return (
    <Modal
      isOpen={props.show}
      toggle={props.toggleModal}
      className="user-details-modal"
      size="lg"
    >
      <RowContainer>
        <img className="user-img mr-8" src={secureUrl} />
        <StructureName>{userFromStore.username}</StructureName>
      </RowContainer>
      <Title>Email</Title>
      <div style={{ marginTop: "4px", marginRight: "32px" }}>
        <FInput
          id="email"
          value={email}
          onChange={onChange}
          newSize={true}
          autoFocus={false}
        />
      </div>
      <Title>Structure</Title>
      {!hasStructure && <span>Pas de structure</span>}
      {hasStructure &&
        userFromStore.structures.map((structure) => (
          <Structure
            // @ts-ignore : objectId not a string
            key={structure._id}
            nom={structure.nom}
            picture={structure.picture}
            role={structure.role ? structure.role[0] : null}
          />
        ))}
      <Title>Rôles</Title>
      <RowContainer>
        <RoleCheckBox
          name="Expert en traduction"
          isSelected={roles.includes("ExpertTrad")}
          handleCheckBoxChange={handleCheckBoxChange}
        />
        <RoleCheckBox
          name="Administrateur"
          isSelected={roles.includes("Admin")}
          handleCheckBoxChange={handleCheckBoxChange}
        />
      </RowContainer>
      <Title>Langues</Title>
      <RowContainerWrap>
        {userFromStore.langues.map((langue) => (
          <LangueDetail key={langue.langueCode} langue={langue} />
        ))}
      </RowContainerWrap>
      <Title>Date de création</Title>
      <div style={{ marginBottom: "8px" }}>
        {userFromStore.created_at
          ? moment(userFromStore.created_at).format("LLL")
          : "Non connue"}
      </div>
      <IndicatorContainer>
        <IndicatorColumn>
          <Title>Temps passé en minutes</Title>
          {indicators ? (
            <>
              <span>
                {`3 derniers mois : ${
                  indicators.threeMonthsIndicator &&
                  indicators.threeMonthsIndicator[0] &&
                  indicators.threeMonthsIndicator[0].timeSpent
                    ? Math.floor(
                        indicators.threeMonthsIndicator[0].timeSpent / 1000 / 60
                      )
                    : 0
                }`}
              </span>
              <span>
                {`6 derniers mois : ${
                  indicators.sixMonthsIndicator &&
                  indicators.sixMonthsIndicator[0] &&
                  indicators.sixMonthsIndicator[0].timeSpent
                    ? Math.floor(
                        indicators.sixMonthsIndicator[0].timeSpent / 1000 / 60
                      )
                    : 0
                }`}
              </span>
              <span>
                {`12 derniers mois : ${
                  indicators.twelveMonthsIndicator &&
                  indicators.twelveMonthsIndicator[0] &&
                  indicators.twelveMonthsIndicator[0].timeSpent
                    ? Math.floor(
                        indicators.twelveMonthsIndicator[0].timeSpent /
                          1000 /
                          60
                      )
                    : 0
                }`}
              </span>
              <span>
                {`Toujours : ${
                  indicators.totalIndicator &&
                  indicators.totalIndicator[0] &&
                  indicators.totalIndicator[0].timeSpent
                    ? Math.floor(
                        indicators.totalIndicator[0].timeSpent / 1000 / 60
                      )
                    : 0
                }`}
              </span>
            </>
          ) : (
            <Spinner />
          )}
        </IndicatorColumn>
        <IndicatorColumn>
          <Title>Nombre de mots traduits</Title>
          {indicators ? (
            <>
              <span>
                {`3 derniers mois : ${
                  indicators.threeMonthsIndicator &&
                  indicators.threeMonthsIndicator[0] &&
                  indicators.threeMonthsIndicator[0].wordsCount
                    ? indicators.threeMonthsIndicator[0].wordsCount
                    : 0
                }`}
              </span>
              <span>
                {`6 derniers mois : ${
                  indicators.sixMonthsIndicator &&
                  indicators.sixMonthsIndicator[0] &&
                  indicators.sixMonthsIndicator[0].wordsCount
                    ? indicators.sixMonthsIndicator[0].wordsCount
                    : 0
                }`}
              </span>
              <span>
                {`12 derniers mois : ${
                  indicators.twelveMonthsIndicator &&
                  indicators.twelveMonthsIndicator[0] &&
                  indicators.twelveMonthsIndicator[0].wordsCount
                    ? indicators.twelveMonthsIndicator[0].wordsCount
                    : 0
                }`}
              </span>
              <span>
                {`Toujours : ${
                  indicators.totalIndicator &&
                  indicators.totalIndicator[0] &&
                  indicators.totalIndicator[0].wordsCount
                    ? indicators.totalIndicator[0].wordsCount
                    : 0
                }`}
              </span>
            </>
          ) : (
            <Spinner />
          )}
        </IndicatorColumn>
      </IndicatorContainer>
      <ButtonContainer>
        <FButton type="error" onClick={onDeleteClick} name="trash-2">
          Supprimer
        </FButton>
        <div>
          <FButton
            className="mr-8"
            type="white"
            onClick={props.toggleModal}
            name="close-outline"
          >
            Annuler
          </FButton>
          <FButton
            type="validate"
            name="checkmark-outline"
            onClick={() => onSaveClick()}
          >
            Enregistrer
          </FButton>
        </div>
      </ButtonContainer>
    </Modal>
  );
};
