import React, { useState, useEffect, useCallback } from "react";
import { Event, Indicators } from "types/interface";
import Image from "next/image";
import { Spinner, Row, Col } from "reactstrap";
import moment from "moment";
import "moment/locale/fr";
import { useSelector, useDispatch } from "react-redux";
import marioProfile from "assets/mario-profile.jpg";
import { allUsersSelector, userSelector } from "services/AllUsers/allUsers.selector";
import FInput from "components/UI/FInput/FInput";
import { RoleCheckBox, LangueDetail } from "../ components/AdminUsersComponents";
import FButton from "components/UI/FButton/FButton";
import API from "utils/API";
import { setAllUsersActionsCreator } from "services/AllUsers/allUsers.actions";
import Swal from "sweetalert2";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { colors } from "colors";
import styles from "./UserDetailsModal.module.scss";
import { DetailsModal } from "../../sharedComponents/DetailsModal";
import { Label } from "../../sharedComponents/SubComponents";
import { NotesInput } from "../../sharedComponents/NotesInput";
import { LogList } from "../../Logs/LogList";
import { StructureButton } from "../../sharedComponents/StructureButton";
import { isValidEmail, isValidPhone } from "lib/validateFields";
import { GetAllUsersResponse, GetLogResponse, Id } from "api-types";
import { useLanguages } from "hooks";

moment.locale("fr");

interface Props {
  show: boolean;
  toggleModal: () => void;
  selectedUserId: Id | null;
  setSelectedStructureIdAndToggleModal: (structureId: Id | null) => void;
}

export const UserDetailsModal: React.FunctionComponent<Props> = (props: Props) => {
  const { getLanguage } = useLanguages();
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [roles, setRoles] = useState<string[]>([]);
  const [indicators, setIndicators] = useState<null | Indicators>(null);
  const [selectedUserId, setSelectedUserId] = useState<Id | null>(props.selectedUserId);

  const allUsers = useSelector(allUsersSelector);
  const userFromStore = useSelector(userSelector(selectedUserId));
  const [adminComments, setAdminComments] = useState<string>(userFromStore?.adminComments || "");
  const [infosSaved, setInfosSaved] = useState(false);
  const [currentId, setCurrentId] = useState<Id | null>(null);
  const [logs, setLogs] = useState<GetLogResponse[]>([]);

  const dispatch = useDispatch();
  const updateLogs = useCallback(() => {
    if (selectedUserId) {
      API.logs(selectedUserId).then((res) => {
        setLogs(res.data.data);
      });
    }
  }, [selectedUserId]);

  useEffect(() => {
    setSelectedUserId(props.selectedUserId);
  }, [props.selectedUserId]);

  useEffect(() => {
    const loadIndicators = async () => {
      if (userFromStore) {
        const data = await API.get_progression({
          userId: userFromStore._id,
        });
        setIndicators(data.data);
      }
    };

    if (userFromStore && currentId !== selectedUserId) {
      setEmail(userFromStore?.email || "");
      setPhone(userFromStore?.phone || "");
      setPhoneError("");
      const roles = userFromStore?.roles
        ? userFromStore.roles.filter((role: string) => role === "Admin" || role === "ExpertTrad")
        : [];
      setRoles(roles);
      setAdminComments(userFromStore.adminComments || "");
      setInfosSaved(false);
      setCurrentId(selectedUserId);
      updateLogs();
      loadIndicators();
    }
  }, [userFromStore, currentId, selectedUserId, updateLogs]);

  const updateUserStore = (userId: Id, user: Partial<GetAllUsersResponse>) => {
    const users = [...allUsers];
    let newUser = users.find((u) => u._id === userId);
    if (newUser) newUser = { ...newUser, ...user };
    dispatch(setAllUsersActionsCreator(users));
    updateLogs();
  };

  const onChangeEmail = useCallback(
    (e: Event) => {
      if (infosSaved) setInfosSaved(false);
      if (e.target.value && !isValidEmail(e.target.value)) {
        setEmailError("Ceci n'est pas un email valide, vérifiez votre saisie");
      } else {
        setEmailError("");
      }
      setEmail(e.target.value);
    },
    [infosSaved],
  );
  const onChangePhone = useCallback(
    (e: Event) => {
      if (infosSaved) setInfosSaved(false);
      if (e.target.value && !isValidPhone(e.target.value)) {
        setPhoneError("Ceci n'est pas un numéro de téléphone valide, vérifiez votre saisie");
      } else {
        setPhoneError("");
      }
      setPhone(e.target.value);
    },
    [infosSaved],
  );
  const onNotesChange = useCallback(
    (e: any) => {
      if (infosSaved) setInfosSaved(false);
      setAdminComments(e.target.value);
    },
    [infosSaved],
  );

  const handleCheckBoxChange = (name: string) => {
    if (!roles) return;
    if (infosSaved) setInfosSaved(false);
    const mappedName = name === "Expert en traduction" ? "ExpertTrad" : "Admin";
    const hasAlreadyRole = roles.includes(mappedName);

    if (hasAlreadyRole) {
      const newRolesFiltered = roles.filter((role: string) => role !== mappedName);
      // remove role
      return setRoles(newRolesFiltered);
    }

    const newRoles = roles.concat([mappedName]);
    // add role
    return setRoles(newRoles);
  };

  const hasStructure = userFromStore && (userFromStore.structures || []).length > 0;
  const isResponsable =
    hasStructure &&
    userFromStore &&
    (userFromStore.structures || []).find((s) => s.role && s.role.includes("Responsable"));
  const isAdmin = userFromStore && (userFromStore.roles || []).find((r) => r === "Admin");

  const onSaveClick = async () => {
    try {
      if (userFromStore) {
        if ((isResponsable || isAdmin) && userFromStore?.phone && !phone) {
          setPhoneError("Vous devez renseigner un numéro");
        }
        if (!!phoneError || !!emailError) return;
        setPhoneError("");
        await API.updateUser(userFromStore._id, {
          user: { roles, email, phone, adminComments },
          action: "modify-with-roles",
        });
        setInfosSaved(true);
        updateUserStore(userFromStore._id, {
          email: email,
          phone: phone,
          // name: name,
          adminComments: adminComments,
          roles: roles,
        });
        updateLogs();
      }
    } catch (error) {
      Swal.fire({
        title: "Oh non",
        text: "Erreur lors de la modification",
        icon: "error",
        timer: 1500,
      });
    }
  };

  const onDeleteClick = async () => {
    try {
      if (userFromStore) {
        const res = await Swal.fire({
          title: "Êtes-vous sûr ?",
          text: "Souhaitez-vous supprimer cet utilisateur",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: colors.rouge,
          cancelButtonColor: colors.vert,
          confirmButtonText: "Oui, le supprimer",
          cancelButtonText: "Annuler",
        });
        if (!res.value) return;
        await API.deleteUser(userFromStore._id);
        Swal.fire({
          title: "Yay...",
          text: "Utilisateur supprimé",
          icon: "success",
          timer: 1500,
        });
        dispatch(setAllUsersActionsCreator([...allUsers.filter((u) => u._id !== userFromStore._id)]));
        props.toggleModal();
      }
    } catch (error) {
      Swal.fire({
        title: "Oh non",
        text: "Erreur lors de la suppression",
        icon: "error",
        timer: 1500,
      });
      props.toggleModal();
    }
  };

  const getMinutes = useCallback((value: number | undefined) => {
    return value ? Math.floor(value / 1000 / 60) : 0;
  }, []);

  const secureUrl = userFromStore?.picture?.secure_url || marioProfile;

  const isLoading = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_ALL_USERS));

  const isEdited =
    email !== (userFromStore?.email || "") ||
    phone !== (userFromStore?.phone || "") ||
    adminComments !== (userFromStore?.adminComments || "") ||
    roles.find((r) => r === "ExpertTrad") !== (userFromStore?.roles || []).find((r) => r === "ExpertTrad") ||
    roles.find((r) => r === "Admin") !== (userFromStore?.roles || []).find((r) => r === "Admin");

  return (
    <DetailsModal
      show={props.show}
      toggleModal={props.toggleModal}
      isLoading={isLoading}
      leftHead={
        <>
          <Image
            className={styles.user_img}
            src={secureUrl}
            alt=""
            width={50}
            height={50}
            style={{ objectFit: "contain" }}
          />
          <h2>{userFromStore ? userFromStore.username : "utilisateur supprimé"}</h2>
        </>
      }
      rightHead={
        <>
          {userFromStore && (
            <FButton className="me-2" type="error" name="trash-2-outline" target="_blank" onClick={onDeleteClick}>
              Supprimer
            </FButton>
          )}
          <FButton className="me-2" type="white" onClick={props.toggleModal} name="close-outline"></FButton>
        </>
      }
    >
      {userFromStore ? (
        <>
          <div className={styles.details_row}>
            <div className={styles.col_1}>
              <div>
                <Label htmlFor="email">Email</Label>
                <FInput
                  id="email"
                  value={email}
                  onChange={onChangeEmail}
                  newSize={true}
                  autoFocus={false}
                  prepend
                  prependName="email-outline"
                  error={!!emailError}
                />
                {!!emailError && <p className={styles.error}>{emailError}</p>}
              </div>
              <div className="mt-2">
                <Label htmlFor="phone">Numéro de téléphone</Label>
                <FInput
                  id="phone"
                  value={phone}
                  onChange={onChangePhone}
                  newSize={true}
                  autoFocus={false}
                  prepend
                  prependName="smartphone-outline"
                  inputClassName="phone-input"
                  error={!!phoneError}
                />
                {!!phoneError && <p className={styles.error}>{phoneError}</p>}
              </div>
              <div className="mt-2">
                <Label>Notes sur l'utilisateur</Label>
                <NotesInput
                  adminComments={adminComments}
                  onNotesChange={onNotesChange}
                  saveAdminComments={() => {
                    onSaveClick();
                  }}
                  adminCommentsSaved={infosSaved}
                  edited={isEdited}
                />
              </div>
            </div>
            <div className={styles.col_2}>
              <Label>Structure</Label>
              {!hasStructure ? (
                <p className={styles.no_structure}>Aucune structure</p>
              ) : (
                <div>
                  {(userFromStore.structures || []).map((structure) => (
                    <StructureButton
                      key={structure._id.toString()}
                      sponsor={structure}
                      onClick={() => {
                        if (!structure) return;
                        props.setSelectedStructureIdAndToggleModal(structure?._id || null);
                        props.toggleModal();
                      }}
                      additionnalProp="role"
                    />
                  ))}
                </div>
              )}

              <div className="mt-4">
                <Label>Rôles</Label>
                <div>
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
                </div>
              </div>

              <div className="mt-4">
                <Label>Langues de traduction activées</Label>
                <div>
                  {(userFromStore.selectedLanguages || []).map((langue, i) => (
                    <LangueDetail key={i} langue={getLanguage(langue)} />
                  ))}
                </div>
              </div>

              <Row className="mt-4">
                <Col className={styles.stats}>
                  <Label>Minutes passées à traduire</Label>
                  {indicators ? (
                    <>
                      <div>3 derniers mois : {getMinutes(indicators?.threeMonthsIndicator?.[0]?.timeSpent)}</div>
                      <div>6 derniers mois : {getMinutes(indicators?.sixMonthsIndicator?.[0]?.timeSpent)}</div>
                      <div>12 derniers mois : {getMinutes(indicators?.twelveMonthsIndicator?.[0]?.timeSpent)}</div>
                      <div>Toujours : {getMinutes(indicators?.totalIndicator?.[0]?.timeSpent)}</div>
                    </>
                  ) : (
                    <Spinner />
                  )}
                </Col>
                <Col className={styles.stats}>
                  <Label>Nombre de mots traduits</Label>
                  {indicators ? (
                    <>
                      <div>3 derniers mois : {indicators?.threeMonthsIndicator?.[0]?.wordsCount || 0}</div>
                      <div>6 derniers mois : {indicators?.sixMonthsIndicator?.[0]?.wordsCount || 0}</div>
                      <div>12 derniers mois : {indicators?.twelveMonthsIndicator?.[0]?.wordsCount || 0}</div>
                      <div>Toujours : {indicators?.totalIndicator?.[0]?.wordsCount || 0}</div>
                    </>
                  ) : (
                    <Spinner />
                  )}
                </Col>
              </Row>
            </div>
            <div className={styles.col_3}>
              <Label>Journal d'activité</Label>
              <LogList logs={logs} openUserModal={setSelectedUserId} />
            </div>
          </div>
        </>
      ) : (
        <p className="my-4">L'utilisateur a été supprimé.</p>
      )}
    </DetailsModal>
  );
};
