import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncFn } from "react-use";
import { useTranslation } from "next-i18next";
import { UpdateUserRequest } from "@refugies-info/api-types";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import PasswordInput from "@codegouvfr/react-dsfr/blocks/PasswordInput";
import API from "utils/API";
import { setAuthToken } from "utils/authToken";
import { cls } from "lib/classname";
import { isValidEmail, isValidPhone } from "lib/validateFields";
import { getPasswordStrength } from "lib/validatePassword";
import { fetchUserActionCreator } from "services/User/user.actions";
import { userDetailsSelector, userSelector } from "services/User/user.selectors";
import FRLink from "components/UI/FRLink";
import ErrorMessage from "components/UI/ErrorMessage";
import { ModalEmailCode, modalEmailCode } from "../ModalEmailCode";
import styles from "../../UserProfile.module.scss";
import { modalResetPassword, ModalResetPassword } from "../ModalResetPassword";

interface Props {
  edition: boolean;
  setEdition: (e: boolean) => void;
}

const UserProfileForm = ({ edition, setEdition }: Props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const user = useSelector(userSelector);
  const userDetails = useSelector(userDetailsSelector);

  const [username, setUsername] = useState<string>(userDetails?.username || "");
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string>(userDetails?.firstName || "");
  const [email, setEmail] = useState<string>(userDetails?.email || "");
  const [emailHint, setEmailHint] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailCodeError, setEmailCodeError] = useState<string | null>(null);
  const [phone, setPhone] = useState<string>(userDetails?.phone || "");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [oldPasswordError, setOldPasswordError] = useState<string | null>(null);
  const [newPasswordError, setNewPasswordError] = useState<string | null>(null);
  const passwordStrength = useMemo(() => getPasswordStrength(newPassword), [newPassword]);

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

  const resetErrors = useCallback(() => {
    setOldPasswordError(null);
    setNewPasswordError(null);
    setEmailCodeError(null);
  }, []);

  const [{ loading, error }, submit] = useAsyncFn(
    async (e: any, code?: string) => {
      e?.preventDefault();
      resetErrors();
      if (!userDetails || phoneError || emailError || usernameError) return;
      const updateUserRequest: UpdateUserRequest = {
        action: "modify-my-details",
        user: {
          username,
          firstName,
          email,
          phone,
          code,
        },
      };
      if (!oldPassword && newPassword) {
        setOldPasswordError("Veuillez renseigner votre ancien mot de passe.");
        return;
      }
      if (oldPassword && newPassword && !userDetails.sso) {
        if (!passwordStrength.isOk) return;
        updateUserRequest.user.password = {
          oldPassword,
          newPassword,
        };
      }
      try {
        const data = await API.updateUser(userDetails._id, updateUserRequest);
        if (data.token) setAuthToken(data.token);
        dispatch(fetchUserActionCreator());
        setEdition(false);
        // reset password inputs
        if (updateUserRequest.user.password) {
          setOldPassword("");
          setNewPassword("");
        }
      } catch (e: any) {
        const errorCode = e.response?.data?.code;
        if (errorCode === "NO_CODE_SUPPLIED") {
          modalEmailCode.open();
          return;
        } else if (errorCode === "WRONG_CODE") {
          setEmailCodeError("Code incorrect, veuillez réessayer.");
          return;
        } else if (errorCode === "INVALID_PASSWORD") {
          setOldPasswordError("Mot de passe incorrect, vérifiez votre saisie");
        } else if (errorCode === "USED_PASSWORD") {
          setNewPasswordError("Le nouveau mot de passe doit être différent du mot de passe actuel.");
        } else if (errorCode === "PASSWORD_TOO_WEAK") {
          setNewPasswordError(
            "Votre mot de passe ne contient pas l'un des éléments suivants : 7 caractères minimum, 1 caractère spécial, 1 chiffre minimum.",
          );
        } else if (errorCode === "USERNAME_TAKEN") {
          setUsernameError("Ce nom d'utilisateur est déjà pris. Veuillez en choisir un autre.");
        } else if (errorCode === "EMAIL_TAKEN") {
          setEmailError("Un compte Réfugiés.info est déjà associé à cette adresse email.");
        } else {
          throw new Error("Une erreur est survenue. Veuillez réessayer");
        }
      }
      modalEmailCode.close();
    },
    [userDetails, username, firstName, email, phone, phoneError, emailError, usernameError, oldPassword, newPassword],
  );

  const getPasswordErrorMessage = useCallback(
    (input: "old" | "new"): { severity: "valid" | "error" | "info"; message: ReactNode }[] => {
      let passwordError = null;
      if (input === "old") passwordError = oldPasswordError;
      if (input === "new") passwordError = newPasswordError;

      if (passwordError) return [{ message: passwordError, severity: "error" }];

      if (input === "new")
        return passwordStrength.criterias.map((criteria) => ({
          message: t(criteria.label),
          severity: !newPassword ? "info" : criteria.isOk ? "valid" : "error",
        }));
      return [];
    },
    [oldPasswordError, newPasswordError, passwordStrength, newPassword, t],
  );

  if (!userDetails) return null;

  return (
    <>
      <div className="d-flex align-items-center justify-content-between">
        <h2>Informations personnelles</h2>
        {edition ? (
          <Button
            priority="primary"
            size="small"
            onClick={submit}
            iconId="fr-icon-save-3-line"
            iconPosition="right"
            disabled={loading}
            className={styles.fix_align}
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
            className={styles.fix_align}
          >
            Modifier mes informations personnelles
          </Button>
        )}
      </div>

      <div className={cls(styles.block, styles.form, edition && styles.edit, "mb-10")}>
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
              title: "pseudo-input",
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
              title: "firstname-input",
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
              title: "email-input",
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
              title: "phone-input",
            }}
            disabled={loading}
            className={!phone ? styles.empty : ""}
          />
          {!userDetails.sso && (
            <>
              {!edition ? (
                <Input
                  label="Mot de passe actuel"
                  nativeInputProps={{
                    name: "fake-password-input",
                    readOnly: true,
                    value: "********",
                    title: "fake-password-input",
                  }}
                />
              ) : (
                <>
                  <PasswordInput
                    label="Mot de passe actuel"
                    messagesHint=""
                    messages={getPasswordErrorMessage("old")}
                    nativeInputProps={{
                      name: "old-password",
                      value: oldPassword,
                      onChange: (e: any) => setOldPassword(e.target.value),
                      title: "old-password-input",
                    }}
                  />
                </>
              )}
              <FRLink
                onClick={(e: any) => {
                  e.preventDefault();
                  modalResetPassword.open();
                }}
                className={cls(styles.link, edition && "mt-2")}
              >
                Mot de passe oublié&nbsp;?
              </FRLink>
              {edition && (
                <PasswordInput
                  label="Nouveau mot de passe"
                  messagesHint={!!newPasswordError ? "" : undefined}
                  messages={getPasswordErrorMessage("new")}
                  nativeInputProps={{
                    name: "new-password",
                    value: newPassword,
                    onChange: (e: any) => setNewPassword(e.target.value),
                    title: "new-password-input",
                  }}
                  className="mt-3"
                />
              )}
            </>
          )}
          <ErrorMessage error={error?.message} />
        </form>
        <ModalEmailCode email={email} updateUser={(code: string) => submit(null, code)} error={emailCodeError} />
        <ModalResetPassword email={userDetails?.email || ""} />
      </div>
    </>
  );
};

export default UserProfileForm;
