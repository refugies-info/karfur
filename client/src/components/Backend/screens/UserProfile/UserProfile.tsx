import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAsyncFn } from "react-use";
import { StructureMemberRole } from "@refugies-info/api-types";
import { Col, Row } from "reactstrap";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { ToggleSwitch } from "@codegouvfr/react-dsfr/ToggleSwitch";
import { logger } from "logger";
import API from "utils/API";
import { isValidEmail, isValidPhone } from "lib/validateFields";
import { cls } from "lib/classname";
import { userDetailsSelector, userSelector } from "services/User/user.selectors";
import { fetchUserActionCreator } from "services/User/user.actions";
import { userStructureRoleSelector, userStructureSelector } from "services/UserStructure/userStructure.selectors";
import {
  EditAvatar,
  EditButton,
  LanguageBadge,
  ModalDepartments,
  modalDepartments,
  ModalLanguage,
  modalLanguage,
  Tag,
} from "./components";
import ErrorMessage from "components/UI/ErrorMessage";
import styles from "./UserProfile.module.scss";

interface Props {
  title: string;
}

export const UserProfile = (props: Props) => {
  const dispatch = useDispatch();
  const user = useSelector(userSelector);
  const userDetails = useSelector(userDetailsSelector);
  const userStructure = useSelector(userStructureSelector);
  const userStructureRole = useSelector(userStructureRoleSelector);

  const [edition, setEdition] = useState(false);
  const [username, setUsername] = useState<string>(userDetails?.username || "");
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string>(userDetails?.firstName || "");
  const [email, setEmail] = useState<string>(userDetails?.email || "");
  const [emailHint, setEmailHint] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phone, setPhone] = useState<string>(userDetails?.phone || "");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [newsletter, setNewsletter] = useState<boolean | null>(null);
  const [nbWordsTranslated, setNbWordsTranslated] = useState<number | null>(null);

  useEffect(() => {
    document.title = props.title;
  }, [props.title]);

  useEffect(() => {
    if (!userDetails) return;
    API.isInContacts().then((res) => setNewsletter(res.isInContacts));
  }, [dispatch, user, userDetails, nbWordsTranslated]);

  const subscribeNewsletter = async (checked: boolean) => {
    if (!userDetails?.email) return;
    setNewsletter(checked);
    try {
      if (checked) {
        await API.contacts({ email: userDetails.email });
      } else {
        await API.deleteContact();
      }
    } catch (e: any) {
      logger.error(e);
    }
  };

  // Load user stats
  useEffect(() => {
    if (!userDetails) return;
    const loadIndicators = async () => {
      if (user.traducteur || user.expertTrad) {
        const data = await API.get_progression({ onlyTotal: true });
        setNbWordsTranslated(data?.totalIndicator?.wordsCount || 0);
      }
    };
    if (nbWordsTranslated === null) {
      loadIndicators();
    }
  }, [dispatch, user, userDetails, nbWordsTranslated]);

  // Fill form
  useEffect(() => {
    if (!userDetails) return;
    if (userDetails.username) setUsername(userDetails.username);
    if (userDetails.firstName) setFirstName(userDetails.firstName);
    if (userDetails.email) setEmail(userDetails.email);
    if (userDetails.phone) setPhone(userDetails.phone);
  }, [dispatch, userDetails]);

  // Form validation
  useEffect(() => {
    if (phone && !isValidPhone(phone))
      setPhoneError("Ce n'est pas un numéro de téléphone valide, vérifiez votre saisie.");
    else setPhoneError(null);
  }, [phone]);

  useEffect(() => {
    if (!email) setEmailError("L'email est obligatoire");
    else if (!isValidEmail(email)) setEmailError("Ce n'est pas une adresse email valide, vérifiez votre saisie.");
    else setEmailError(null);
  }, [email]);

  useEffect(() => {
    const usernameMandatory = user.admin || user.contributeur || user.expertTrad || user.traducteur;
    if (!username && usernameMandatory) setUsernameError("Veuillez choisir un pseudonyme.");
    else setUsernameError(null); // needed to reset api errors
  }, [username, user]);

  const [{ loading, error }, submit] = useAsyncFn(
    async (e: any) => {
      e.preventDefault();
      if (!userDetails || phoneError || emailError || usernameError) return;
      try {
        await API.updateUser(userDetails._id, {
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
      } catch (e: any) {
        const errorCode = e.response?.data?.code;
        if (errorCode === "NO_CODE_SUPPLIED") {
          // TODO: handle 2FA
        } else if (errorCode === "USERNAME_TAKEN") {
          setUsernameError("Ce nom d'utilisateur est déjà pris. Veuillez en choisir un autre.");
        } else if (errorCode === "EMAIL_TAKEN") {
          setEmailError("Un compte Réfugiés.info est déjà associé à cette adresse email.");
        } else {
          throw new Error("Une erreur est survenue. Veuillez réessayer");
        }
      }
    },
    [userDetails, username, firstName, email, phone, phoneError, emailError, usernameError],
  );

  if (!userDetails) return <div>Une erreur est survenue, veuillez recharger la page&nbsp;!</div>;

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Row className="mb-10 align-items-center">
          <Col>
            <h1>Mon profil</h1>
          </Col>
          <Col className="text-end text-nowrap">
            {/* <Button
              disabled={edition}
              priority="secondary"
              size="small"
              iconId="fr-icon-error-warning-line"
              iconPosition="right"
              className={cls(styles.danger, "ms-2")}
            >
              Supprimer mon profil
            </Button> */}
          </Col>
        </Row>

        <Row>
          <Col className="flex-grow-0">
            <h2>Photo de profil</h2>
            <div className={styles.block}>
              <EditAvatar />
            </div>

            <h2 className="my-6">Activité</h2>
            {nbWordsTranslated !== null && (
              <div className={styles.info}>
                <label>Nombre de mots traduits</label>
                <p>{nbWordsTranslated}</p>
              </div>
            )}
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

            {user.caregiver && userDetails.partner && (
              <div className={styles.info}>
                <label>Partenaire</label>
                <p>{userDetails.partner}</p>
              </div>
            )}

            {(user.admin || user.expertTrad) && (
              <div className={styles.info}>
                <label className="mb-2">Rôles exceptionnels</label>
                {user.admin && <Tag className="w-100 mb-2">Administrateur</Tag>}
                {user.expertTrad && <Tag className="w-100">Expert en traduction</Tag>}
              </div>
            )}
          </Col>

          <Col>
            <div className="d-flex align-content-center justify-content-between">
              <h2>Informations personnelles</h2>
              {edition ? (
                <Button
                  priority="primary"
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
                  priority="secondary"
                  size="small"
                  onClick={() => setEdition(true)}
                  iconId="fr-icon-edit-box-line"
                  iconPosition="right"
                >
                  Modifier mon profil
                </Button>
              )}
            </div>

            <div className={cls(styles.block, styles.form, "mb-10")}>
              <form onSubmit={submit}>
                <Input
                  label="Pseudonyme public"
                  state={!!usernameError && edition ? "error" : "default"}
                  stateRelatedMessage={usernameError}
                  hintText="Votre pseudonyme apparaît sur les fiches auxquelles vous contribuez."
                  nativeInputProps={{
                    name: "pseudo",
                    readOnly: !edition,
                    value: username || (!edition ? "Non défini" : ""),
                    onChange: (e: any) => setUsername(e.target.value),
                  }}
                  disabled={loading}
                  className={!username ? styles.empty : ""}
                />
                <Input
                  label="Prénom"
                  hintText="Votre prénom n’est pas public, il est utilisé pour échanger avec vous directement."
                  nativeInputProps={{
                    name: "firstName",
                    readOnly: !edition,
                    value: firstName || (!edition ? "Non défini" : ""),
                    onChange: (e: any) => setFirstName(e.target.value),
                  }}
                  disabled={loading}
                  className={!firstName ? styles.empty : ""}
                />
                <Input
                  label="Email"
                  state={!!emailError && edition ? "error" : "default"}
                  stateRelatedMessage={emailError}
                  hintText={
                    emailHint
                      ? "Saisissez la nouvelle adresse email que vous souhaitez associer à votre compte. Nous enverrons un code de vérification à cette adresse."
                      : null
                  }
                  nativeInputProps={{
                    name: "email",
                    readOnly: !edition,
                    value: email || (!edition ? "Non défini" : ""),
                    onChange: (e: any) => setEmail(e.target.value),
                    onFocus: () => setEmailHint(true),
                    onBlur: () => setEmailHint(false),
                  }}
                  disabled={loading}
                  className={!email ? styles.empty : ""}
                />
                <Input
                  label="Téléphone"
                  state={!!phoneError && edition ? "error" : "default"}
                  stateRelatedMessage={phoneError}
                  nativeInputProps={{
                    name: "phone",
                    readOnly: !edition,
                    value: phone || (!edition ? "Non défini" : ""),
                    onChange: (e: any) => setPhone(e.target.value),
                  }}
                  disabled={loading}
                  className={!phone ? styles.empty : ""}
                />
                <ErrorMessage error={error?.message} />
              </form>
            </div>

            <h2>Préférences</h2>
            <div className={cls(styles.block, "mb-4")}>
              <div className="d-flex justify-content-between mb-3">
                <label className={styles.label}>Départements pour la recherche</label>
                <EditButton icon="map" onClick={() => modalDepartments.open()} />
              </div>
              {!userDetails.departments ? (
                <p className={styles.empty}>Non défini</p>
              ) : (
                userDetails.departments.map((dep, i) => (
                  <Tag key={i} className="me-1 mt-1">
                    {dep}
                  </Tag>
                ))
              )}
            </div>

            <div className={cls(styles.block, "mb-4")}>
              <div className="d-flex justify-content-between mb-4">
                <label className={styles.label}>Langues de traduction</label>
                <EditButton icon="translate" onClick={() => modalLanguage.open()} />
              </div>
              {!userDetails.selectedLanguages ? (
                <p className={styles.empty}>Non défini</p>
              ) : (
                userDetails.selectedLanguages.map((ln, i) => <LanguageBadge key={i} id={ln} />)
              )}
            </div>

            <div className={styles.block}>
              <label className={cls(styles.label, "mb-2")} htmlFor="newsletter">
                Communication par email
              </label>

              <ToggleSwitch
                label={
                  <span>
                    <strong>La lettre d’information de Réfugiés.info</strong> : actualités, nouveaux contenus, mises à
                    jour, événements.
                  </span>
                }
                helperText="Maximum 1 fois par mois"
                checked={!!newsletter}
                onChange={subscribeNewsletter}
                disabled={newsletter === null}
                showCheckedHint={false}
              />
            </div>
          </Col>
        </Row>
      </div>

      <ModalDepartments />
      <ModalLanguage />
    </div>
  );
};

export default UserProfile;
