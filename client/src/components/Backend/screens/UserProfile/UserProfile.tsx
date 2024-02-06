import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { GetUserInfoResponse, RoleName, StructureMemberRole } from "@refugies-info/api-types";
import { Event } from "types/interface";
import API from "utils/API";
import { setAuthToken } from "utils/authToken";
import { getPasswordStrength } from "lib/validatePassword";
import { isValidPhone } from "lib/validateFields";
import { handleApiDefaultError, handleApiError } from "lib/handleApiErrors";
import { userDetailsSelector } from "services/User/user.selectors";
import { fetchUserActionCreator, saveUserActionCreator } from "services/User/user.actions";
import { isLoadingSelector, errorSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { userStructureRoleSelector, userStructureSelector } from "services/UserStructure/userStructure.selectors";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import {
  EditButton,
  LanguageBadge,
  ModalDepartments,
  modalDepartments,
  ModalLanguage,
  modalLanguage,
  Tag,
} from "./components";
import marioProfile from "assets/mario-profile.jpg";
import styles from "./UserProfile.module.scss";
import { Col, Row } from "reactstrap";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { Badge } from "@codegouvfr/react-dsfr/Badge";

import { cls } from "lib/classname";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import { hasRole } from "lib/hasRole";
import { fetchUserStructureActionCreator } from "services/UserStructure/userStructure.actions";
import { useAsyncFn } from "react-use";
import ErrorMessage from "components/UI/ErrorMessage";

interface Props {
  title: string;
}

export const UserProfile = (props: Props) => {
  const { t } = useTranslation();
  const user = useSelector(userDetailsSelector);

  const [edition, setEdition] = useState(false);
  const [username, setUsername] = useState<string>(user?.username || "");
  const [firstName, setFirstName] = useState<string>(user?.firstName || "");
  const [email, setEmail] = useState<string>(user?.email || "");
  const [phone, setPhone] = useState<string>(user?.phone || "");
  const [newsletter, setNewsletter] = useState<boolean>(/* user?.newsletter ||  */ false);
  const [departments, setDepartments] = useState<string[]>(user?.departments || []);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(user?.selectedLanguages || []);
  const [isPictureUploading, setIsPictureUploading] = useState(false);
  const [nbWordsTranslated, setNbWordsTranslated] = useState<number | null>(null);

  const isLoadingFetch = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_USER));
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = props.title;
  }, [props.title]);

  const userStructure = useSelector(userStructureSelector);
  const userStructureRole = useSelector(userStructureRoleSelector);
  useEffect(() => {
    if (!user) return;

    // Load user stats
    const loadIndicators = async () => {
      if (hasRole(user, RoleName.TRAD) || hasRole(user, RoleName.EXPERT_TRAD)) {
        const data = await API.get_progression({
          userId: user._id.toString(),
        });
        setNbWordsTranslated(data.totalIndicator?.wordsCount || null);
      }
    };
    loadIndicators();

    // Fill form
    if (!user) return;
    if (user.username) setUsername(user.username);
    if (user.firstName) setFirstName(user.firstName);
    if (user.email) setEmail(user.email);
    if (user.phone) setPhone(user.phone);
    // if (user.newsletter) setNewsletter(user.newsletter);
    if (user.departments) setDepartments(user.departments);
    if (user.selectedLanguages) setSelectedLanguages(user.selectedLanguages);
  }, [dispatch, user]);

  const handleFileInputChange = async (e: any) => {
    if (!user) return;
    setIsPictureUploading(true);
    const formData = new FormData();
    formData.append("0", e.target.files[0]);

    try {
      const imgData = await API.postImage(formData);
      await API.updateUser(user._id, {
        user: {
          picture: imgData,
        },
        action: "modify-my-details",
      });
      dispatch(fetchUserActionCreator());
    } catch (e: any) {
      handleApiDefaultError(e);
    }
    setIsPictureUploading(false);
  };

  const [{ loading, error }, submit] = useAsyncFn(
    async (e: any) => {
      e.preventDefault();
      if (!user) return;
      try {
        await API.updateUser(user._id, {
          action: "modify-my-details",
          user: {
            username,
            firstName,
            email,
            phone,
          },
        });
        dispatch(fetchUserActionCreator());
        setEdition(false);
      } catch (e) {
        throw new Error("Une erreur est survenue");
        // TODO: handle 422 and color field in red
      }
    },
    [username, firstName, email, phone],
  );

  const isAdmin = useMemo(() => hasRole(user, RoleName.ADMIN), [user]);
  const isExpert = useMemo(() => hasRole(user, RoleName.EXPERT_TRAD), [user]);

  if (!user) return <div>Une erreur est survenue, veuillez recharger la page&nbsp;!</div>;

  return (
    <div className={styles.container}>
      <Row className="mb-10 align-items-center">
        <Col>
          <h1>Mon profil</h1>
        </Col>
        <Col className="text-end text-nowrap">
          {edition ? (
            <Button
              priority="secondary"
              size="small"
              onClick={submit}
              iconId="fr-icon-save-3-line"
              iconPosition="right"
              disabled={loading}
            >
              Sauvegarder les modifications
            </Button>
          ) : (
            <Button
              priority="primary"
              size="small"
              onClick={() => setEdition(true)}
              iconId="fr-icon-edit-box-line"
              iconPosition="right"
            >
              Modifier mon profil
            </Button>
          )}
          <Button
            disabled={edition}
            priority="secondary"
            size="small"
            iconId="fr-icon-error-warning-line"
            iconPosition="right"
            className={cls(styles.danger, "ms-2")}
          >
            Supprimer mon profil
          </Button>
        </Col>
      </Row>

      <Row>
        <Col className="flex-grow-0">
          <div className={styles.avatar}>
            <Image src={user.picture?.secure_url || marioProfile} width="160" height="160" alt="user picture" />
          </div>
          <button className="fr-btn fr-btn--secondary fr-btn--sm fr-icon-image-edit-line fr-btn--icon-right position-relative">
            Modifier ma photo
            <input type="file" id="avatar" onChange={handleFileInputChange} />
          </button>
          <p className={cls(styles.small, "mt-4")}>Votre photo apparaît sur les fiches auxquelles vous contribuer.</p>

          {nbWordsTranslated !== null && (
            <div className={styles.info}>
              <label>Nombre de mots traduits</label>
              <p>{nbWordsTranslated}</p>
            </div>
          )}

          {(isAdmin || isExpert) && (
            <div className={styles.info}>
              <label className="mb-2">Rôles exceptionnels</label>
              {isAdmin && <Tag className="w-100 mb-2">Administrateur</Tag>}
              {isExpert && <Tag className="w-100">Expert en traduction</Tag>}
            </div>
          )}
        </Col>

        <Col xs="auto" className={styles.inputs}>
          <form onSubmit={submit}>
            <Input
              label="Pseudonyme"
              nativeInputProps={{
                name: "pseudo",
                readOnly: !edition,
                value: username || (!edition ? "Non défini" : ""),
                onChange: (e: any) => setUsername(e.target.value),
              }}
              className={!username ? styles.empty : ""}
            />
            <Input
              label="Prénom"
              nativeInputProps={{
                name: "firstName",
                readOnly: !edition,
                value: firstName || (!edition ? "Non défini" : ""),
                onChange: (e: any) => setFirstName(e.target.value),
              }}
              className={!firstName ? styles.empty : ""}
            />
            <Input
              label="Email"
              nativeInputProps={{
                name: "email",
                readOnly: !edition,
                value: email || (!edition ? "Non défini" : ""),
                onChange: (e: any) => setEmail(e.target.value),
              }}
              className={!email ? styles.empty : ""}
            />
            <Input
              label="Téléphone"
              nativeInputProps={{
                name: "phone",
                readOnly: !edition,
                value: phone || (!edition ? "Non défini" : ""),
                onChange: (e: any) => setPhone(e.target.value),
              }}
              className={!phone ? styles.empty : ""}
            />
            <ErrorMessage error={error?.message} />

            {userStructure && (
              <div className={styles.info}>
                <p>{userStructure.nom}</p>
                {userStructureRole?.includes(StructureMemberRole.ADMIN) && (
                  <Badge severity="success" noIcon>
                    Responsable
                  </Badge>
                )}
              </div>
            )}
          </form>
        </Col>

        <Col>
          <div className="mb-4">
            <div className="d-flex justify-content-between mb-2">
              <label className="fr-label">Départements</label>
              <EditButton icon="map" onClick={() => modalDepartments.open()} />
            </div>
            {!user.departments ? (
              <p className={styles.empty}>Non défini</p>
            ) : (
              user.departments.map((dep, i) => (
                <Tag key={i} className="me-1 mt-1">
                  {dep}
                </Tag>
              ))
            )}
          </div>

          <div className="mb-4">
            <div className="d-flex justify-content-between mb-2">
              <label className="fr-label">Langues de traduction</label>
              <EditButton icon="translate" onClick={() => modalLanguage.open()} />
            </div>
            {!user.selectedLanguages ? (
              <p className={styles.empty}>Non défini</p>
            ) : (
              user.selectedLanguages.map((ln, i) => <LanguageBadge key={i} id={ln} />)
            )}
          </div>

          <div>
            <label className="fr-label mb-2" htmlFor="newsletter">
              Préférences de communication par email
            </label>
            <Checkbox
              small
              className={styles.checkboxes}
              options={[
                {
                  label: "La lettre d’information de Réfugiés.info ",
                  hintText: "Maximum 1 fois par mois ",
                  nativeInputProps: {
                    name: "newsletter",
                    checked: newsletter,
                    onChange: () => setNewsletter((n) => !n),
                  },
                },
              ]}
            />
          </div>
        </Col>
      </Row>

      <ModalDepartments />
      <ModalLanguage />
    </div>
  );
};

export default UserProfile;
