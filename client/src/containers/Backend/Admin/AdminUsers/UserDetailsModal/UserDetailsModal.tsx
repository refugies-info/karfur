import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { SimplifiedUser, Event } from "types/interface";
import { Modal } from "reactstrap";
import "./UserDetailsModal.scss";
import moment from "moment/min/moment-with-locales";
import { useSelector } from "react-redux";
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
const Indicator = styled.div`
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
  fetchUsers: () => void;
  selectedUserId: ObjectId | null;
}

export const UserDetailsModal: React.FunctionComponent<Props> = (
  props: Props
) => {
  const [user, setUser] = useState<SimplifiedUser | null>(null);

  const userFromStore = useSelector(userSelector(props.selectedUserId));
  useEffect(() => {
    setUser(userFromStore);
  }, [userFromStore]);

  const onChange = (e: Event) => {
    if (!user) return;
    setUser({ ...user, [e.target.id]: e.target.value });
  };

  const handleCheckBoxChange = (name: string) => {
    if (!user || !user.roles) return;
    const mappedName = name === "Expert en traduction" ? "ExpertTrad" : "Admin";
    const hasAlreadyRole = user.roles.includes(mappedName);

    if (hasAlreadyRole) {
      const newRolesFiltered = user.roles.filter((role) => role !== mappedName);
      // remove role
      return setUser({ ...user, roles: newRolesFiltered });
    }

    const newRoles = user.roles.concat([mappedName]);
    // add role
    return setUser({ ...user, roles: newRoles });
  };

  //   const onSave = async () => {
  //     try {
  //       await API.updateStructure({ query: structure });
  //       Swal.fire({
  //         title: "Yay...",
  //         text: "Structure modifiée",
  //         type: "success",
  //         timer: 1500,
  //       });
  //       props.fetchStructures();
  //       props.toggleModal();
  //     } catch (error) {
  //       Swal.fire({
  //         title: "Oh non",
  //         text: "Erreur lors de la modification",
  //         type: "error",
  //         timer: 1500,
  //       });
  //       props.fetchStructures();
  //       props.toggleModal();
  //     }
  //   };

  const secureUrl =
    user && user.picture && user.picture.secure_url
      ? user.picture.secure_url
      : marioProfile;

  if (!user)
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

  const hasStructure = user.structures.length > 0;
  return (
    <Modal
      isOpen={props.show}
      toggle={props.toggleModal}
      className="user-details-modal"
      size="lg"
    >
      <RowContainer>
        <img className="user-img mr-8" src={secureUrl} />
        <StructureName>{user.username}</StructureName>
      </RowContainer>
      <Title>Email</Title>
      <div style={{ marginTop: "4px", width: "500px" }}>
        <FInput
          id="email"
          value={user.email}
          onChange={onChange}
          newSize={true}
          autoFocus={false}
        />
      </div>
      <Title>Structure</Title>
      {!hasStructure && <span>Pas de structure</span>}
      {hasStructure &&
        user.structures.map((structure) => (
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
          isSelected={user.roles.includes("ExpertTrad")}
          handleCheckBoxChange={handleCheckBoxChange}
        />
        <RoleCheckBox
          name="Administrateur"
          isSelected={user.roles.includes("Admin")}
          handleCheckBoxChange={handleCheckBoxChange}
        />
      </RowContainer>
      <Title>Langues</Title>
      <RowContainerWrap>
        {user.langues.map((langue) => (
          <LangueDetail key={langue.langueCode} langue={langue} />
        ))}
      </RowContainerWrap>
      <Title>Date de création</Title>
      <div style={{ marginBottom: "8px" }}>
        {user.created_at ? moment(user.created_at).format("LLL") : "Non connue"}
      </div>
      <IndicatorContainer>
        <Indicator>
          <Title>Temps passé en minutes</Title>
          <span>
            {`3 derniers mois : ${
              user.threeMonthsIndicator && user.threeMonthsIndicator.timeSpent
                ? Math.floor(user.threeMonthsIndicator.timeSpent / 1000 / 60)
                : 0
            }`}
          </span>
          <span>
            {`6 derniers mois : ${
              user.sixMonthsIndicator && user.sixMonthsIndicator.timeSpent
                ? Math.floor(user.sixMonthsIndicator.timeSpent / 1000 / 60)
                : 0
            }`}
          </span>
          <span>
            {`12 derniers mois : ${
              user.twelveMonthsIndicator && user.twelveMonthsIndicator.timeSpent
                ? Math.floor(user.twelveMonthsIndicator.timeSpent / 1000 / 60)
                : 0
            }`}
          </span>
          <span>
            {`Toujours : ${
              user.totalIndicator && user.totalIndicator.timeSpent
                ? Math.floor(user.totalIndicator.timeSpent / 1000 / 60)
                : 0
            }`}
          </span>
        </Indicator>
        <Indicator>
          <Title>Nombre de mots traduits</Title>
          <span>
            {`3 derniers mois : ${
              user.threeMonthsIndicator && user.threeMonthsIndicator.wordsCount
                ? user.threeMonthsIndicator.wordsCount
                : 0
            }`}
          </span>
          <span>
            {`6 derniers mois : ${
              user.sixMonthsIndicator && user.sixMonthsIndicator.wordsCount
                ? user.sixMonthsIndicator.wordsCount
                : 0
            }`}
          </span>
          <span>
            {`12 derniers mois : ${
              user.twelveMonthsIndicator &&
              user.twelveMonthsIndicator.wordsCount
                ? user.twelveMonthsIndicator.wordsCount
                : 0
            }`}
          </span>
          <span>
            {`Toujours : ${
              user.totalIndicator && user.totalIndicator.wordsCount
                ? user.totalIndicator.wordsCount
                : 0
            }`}
          </span>
        </Indicator>
      </IndicatorContainer>
      <ButtonContainer>
        <FButton
          type="error"
          // onClick={props.onDeleteClick}
          name="trash-2"
        >
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
            // onClick={() => onSaveClick(dispositif)}
          >
            Enregistrer
          </FButton>
        </div>
      </ButtonContainer>
    </Modal>
  );
};
