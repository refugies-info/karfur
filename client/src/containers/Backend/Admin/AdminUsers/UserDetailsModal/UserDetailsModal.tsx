import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import {
  Event,
  Indicators,
  SimplifiedStructureForAdmin,
} from "types/interface";
import Image from "next/image";
import { Modal, Spinner } from "reactstrap";
import moment from "moment/min/moment-with-locales";
import { useSelector, useDispatch } from "react-redux";
import marioProfile from "assets/mario-profile.jpg";
import { userSelector } from "services/AllUsers/allUsers.selector";
import FInput from "components/FigmaUI/FInput/FInput";
import { RowContainer } from "../../AdminStructures/components/AdminStructureComponents";
import {
  Structure,
  RoleCheckBox,
  LangueDetail,
} from "../ components/AdminUsersComponents";
import FButton from "components/FigmaUI/FButton/FButton";
import { ObjectId } from "mongodb";
import API from "utils/API";
import { fetchAllUsersActionsCreator } from "services/AllUsers/allUsers.actions";
import Swal from "sweetalert2";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { colors } from "colors";
import styles from "./UserDetailsModal.module.scss";

moment.locale("fr");

const StructureName = styled.div`
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
`;

const Label = styled.label`
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
  setSelectedStructureIdAndToggleModal: (
    element: SimplifiedStructureForAdmin | null
  ) => void;
}

export const UserDetailsModal: React.FunctionComponent<Props> = (
  props: Props
) => {
  // const [user, setUser] = useState<SimplifiedUser | null>(null);
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");
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
    setEmail(userFromStore?.email || "");
    setPhone(userFromStore?.phone || "");
    setPhoneError("");
    const roles =
      userFromStore?.roles
        ? userFromStore.roles.filter(
            (role: string) => role === "Admin" || role === "ExpertTrad"
          )
        : [];
    setRoles(roles);
    loadIndicators();
  }, [userFromStore]);

  const onChangeEmail = useCallback((e: Event) => {
    setEmail(e.target.value);
  }, []);
  const onChangePhone = useCallback((e: Event) => {
    setPhone(e.target.value);
  }, []);

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

  const hasStructure = userFromStore && (userFromStore.structures || []).length > 0;
  const isResponsable = hasStructure && userFromStore
    && (userFromStore.structures || []).find(s => (s.role && s.role.includes("Responsable")));
  const isAdmin = userFromStore && (userFromStore.roles || []).find(r => r === "Admin");

  const onSaveClick = async () => {
    try {
      if (userFromStore) {
        if ((isResponsable || isAdmin) && userFromStore?.phone && !phone) {
          setPhoneError("Vous devez renseigner un numéro");
          return;
        }
        setPhoneError("");
        await API.updateUser({
          query: {
            user: { _id: userFromStore._id, roles, email, phone },
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
            user: { _id: userFromStore._id, roles, email, phone },
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

  const getMinutes = useCallback((value) => {
    return value ? Math.floor(value / 1000 / 60) : 0;
  }, []);

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
        className={styles.modal}
        contentClassName={styles.modal_content}
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
        className={styles.modal}
        contentClassName={styles.modal_content}
        size="large"
      >
        Erreur
      </Modal>
    );

  return (
    <Modal
      isOpen={props.show}
      toggle={props.toggleModal}
      className={styles.modal}
      contentClassName={styles.modal_content}
      size="lg"
    >
      <RowContainer>
        <Image
          className={styles.user_img + " mr-8"}
          src={secureUrl}
          alt=""
          width={80}
          height={80}
          objectFit="contain"
        />
        <StructureName>{userFromStore.username}</StructureName>
      </RowContainer>
      <div style={{ marginRight: 32 }}>
        <Label
          htmlFor="email"
          style={{ marginBottom: 12 }}
        >Email</Label>
        <FInput
          id="email"
          value={email}
          onChange={onChangeEmail}
          newSize={true}
          autoFocus={false}
        />
      </div>
      <div style={{ marginRight: 32 }}>
        <Label
          htmlFor="phone"
          style={{ marginBottom: 12 }}
        >Numéro de téléphone</Label>
        <FInput
          id="phone"
          value={phone}
          onChange={onChangePhone}
          newSize={true}
          autoFocus={false}
          prepend
          prependName="smartphone-outline"
          inputClassName="phone-input"
          error={!!phoneError && !phone}
        />
        {(!!phoneError && !phone) && <p style={{color: colors.error}}>{phoneError}</p>}
      </div>
      <div>
        <Label>Structure</Label>
        {!hasStructure && <p>Pas de structure</p>}
        {hasStructure &&
          (userFromStore.structures || []).map((structure) => (
            <Structure
              key={structure._id.toString()}
              nom={structure.nom}
              picture={structure.picture}
              role={structure.role ? structure.role[0] : null}
              onClick={() => {
                //@ts-ignore
                props.setSelectedStructureIdAndToggleModal(structure);
                props.toggleModal();
              }}
            />
          ))
        }
      </div>
      <div>
        <Label>Rôles</Label>
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
      </div>
      <div>
        <Label>Langues</Label>
        <RowContainerWrap>
          {(userFromStore.langues || []).map((langue) => (
            <LangueDetail key={langue.langueCode} langue={langue} />
          ))}
        </RowContainerWrap>
      </div>
      <div>
        <Label>Date de création</Label>
        <div style={{ marginBottom: "8px" }}>
          {userFromStore.created_at
            ? moment(userFromStore.created_at).format("LLL")
            : "Non connue"}
        </div>
      </div>
      <IndicatorContainer>
        <IndicatorColumn>
          <Label>Minutes passées à traduire</Label>
          {indicators ? (
            <>
              <span>
                3 derniers mois : {getMinutes(indicators?.threeMonthsIndicator?.[0]?.timeSpent)}
              </span>
              <span>
                6 derniers mois : {getMinutes(indicators?.sixMonthsIndicator?.[0]?.timeSpent)}
              </span>
              <span>
                12 derniers mois : {getMinutes(indicators?.twelveMonthsIndicator?.[0]?.timeSpent)}
              </span>
              <span>
                Toujours : {getMinutes(indicators?.totalIndicator?.[0]?.timeSpent)}
              </span>
            </>
          ) : (
            <Spinner />
          )}
        </IndicatorColumn>
        <IndicatorColumn>
          <Label>Nombre de mots traduits</Label>
          {indicators ? (
            <>
              <span>
                3 derniers mois : {indicators?.threeMonthsIndicator?.[0]?.wordsCount || 0}
              </span>
              <span>
                6 derniers mois : {indicators?.sixMonthsIndicator?.[0]?.wordsCount || 0}
              </span>
              <span>
                12 derniers mois : {indicators?.twelveMonthsIndicator?.[0]?.wordsCount || 0}
              </span>
              <span>
                Toujours : {indicators?.totalIndicator?.[0]?.wordsCount || 0}
              </span>
            </>
          ) : (
            <Spinner />
          )}
        </IndicatorColumn>
      </IndicatorContainer>
      <ButtonContainer>
        <FButton
          type="error"
          onClick={onDeleteClick}
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
            onClick={() => onSaveClick()}
          >
            Enregistrer
          </FButton>
        </div>
      </ButtonContainer>
    </Modal>
  );
};
