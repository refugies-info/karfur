import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "next-i18next";
import { Modal } from "reactstrap";
import Swal from "sweetalert2";
import FInput from "components/UI/FInput/FInput";
import FButton from "components/UI/FButton/FButton";
import { saveUserActionCreator } from "services/User/user.actions";
import styles from "./CompleteProfilModal.module.scss";

interface Props {
  show: boolean;
  toggle: any;
  user: any;
  onComplete: () => void;
}

export const CompleteProfilModal = (props: Props) => {
  const [email, setEmail] = useState("");
  const [notEmailError, setNotEmailError] = useState(false);
  const { t } = useTranslation();

  const onChange = (e: any) => {
    setEmail(e.target.value);
  };

  const dispatch = useDispatch();

  const onEmailModificationValidate = () => {
    const regex = /^\S+@\S+\.\S+$/;
    const isEmail = !!email.match(regex);
    if (isEmail) {
      dispatch(
        saveUserActionCreator(props.user._id, {
          user: { email },
          action: "modify-my-details",
        }),
      );

      Swal.fire({
        title: "Yay...",
        text: "Votre email a bien été modifié",
        icon: "success",
        timer: 1500,
      });
      props.onComplete();
    } else {
      setNotEmailError(true);
    }
  };

  return (
    <Modal isOpen={props.show} toggle={props.toggle} className={styles.modal} contentClassName={styles.modal_content}>
      <h2 className={styles.title}>Complétez votre profil</h2>

      <p>Pour contribuer, vous devez renseigner votre adresse email :</p>
      <div className={styles.input_container}>
        <FInput
          id="email"
          value={email}
          onChange={onChange}
          newSize={true}
          autoFocus={false}
          prepend
          prependName="at-outline"
          placeholder="Mon adresse email"
        />
      </div>
      <div className={styles.explaination}>
        <p className={styles.title_container}>Pourquoi nous vous demandons votre email :</p>
        <ul>
          <li>Pour réinitialiser votre mot de passe en cas d’oubli</li>
          <li>Pour vous informer en cas d’évolutions sur vos contributions</li>
          <li>Pour des raisons de sécurité (en cas de pratiques abusives)</li>
        </ul>
        Nous ne transmetterons jamais votre email à d’autres organisations.
      </div>
      {notEmailError && <p className={styles.error}>{`${t("Register.not_an_email")} ${t("Register.check_mail")}`}</p>}
      <div className={styles.btn_container}>
        <FButton onClick={props.toggle} type="outline-black" className="me-2" name="arrow-back-outline">
          {"Retour"}
        </FButton>{" "}
        <FButton
          disabled={email === ""}
          onClick={onEmailModificationValidate}
          type={"validate"}
          name="checkmark-outline"
        >
          {"Valider"}
        </FButton>
      </div>
    </Modal>
  );
};
