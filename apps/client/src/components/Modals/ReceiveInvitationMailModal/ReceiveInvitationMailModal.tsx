import { SubscriptionRequest } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import { ChangeEvent, useState } from "react";
import { Modal } from "reactstrap";
import styled from "styled-components";
import Swal from "sweetalert2";
import EVAIcon from "~/components/UI/EVAIcon/EVAIcon";
import { FButtonMobile } from "~/components/UI/FButtonMobile/FButtonMobile";
import FInput from "~/components/UI/FInput/FInput";
import { handleApiError } from "~/lib/handleApiErrors";
import styles from "~/scss/components/modals.module.scss";
import API from "~/utils/API";
import { colors } from "~/utils/colors";

declare const window: Window;
interface Props {
  toggle: () => void;
  togglePreviousModal: () => void;
  show: boolean;
}
interface EmailProps {
  email: string;
  notEmailError: boolean;
  id: string;
  onChange: (email: ChangeEvent<HTMLInputElement>) => void;
}

const EmailField = (props: EmailProps) => {
  const { t } = useTranslation();

  return (
    <>
      <FInput
        prepend
        prependName="email-outline"
        value={props.email}
        onChange={props.onChange}
        id="email"
        type="email"
        placeholder={t("Register.Votre email", "Votre email")}
        error={props.notEmailError}
        errorIcon="email-outline"
        newSize
      />
    </>
  );
};

const TitleContainer = styled.div`
  font-size: 28px;
  font-weight: bold;
  margin: 8px;
`;
const MainContainer = styled.div`
  text-align: center;
  padding: 29px;
  padding-top: 50px;
  margin: 8px;
`;
const TextContainer = styled.div`
  font-size: 18px;
  font-weight: normal;
  margin: 16px;
`;

const ErrorMessageContainer = styled.div`
  color: ${colors.error};
  font-size: 16px;
  line-height: 20px;
  margin-top: 16px;
  margin-bottom: 10px;
`;
const CloseIconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background-color: ${colors.gray90};
  right: 10px;
  top: 8px;
`;

export const ReceiveInvitationMailModal = (props: Props) => {
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [notEmailError, setNotEmailError] = useState(false);

  const handleChangeEmail = (event: any) => {
    setEmail(event.target.value);
  };

  const sendMail = (e: any) => {
    e.preventDefault();
    if (email === "") {
      Swal.fire({
        title: "Oops...",
        text: "Aucun mail renseigné",
        icon: "error",
        timer: 1500,
      });
      return;
    }
    const regex = /^\S+@\S+\.\S+$/;
    const isEmail = !!email.match(regex);
    if (isEmail) {
      const body: SubscriptionRequest = { email };
      API.sendSubscriptionReminderMail(body)
        .then(() => {
          Swal.fire({
            title: "Yay...",
            text: "Mail envoyé",
            icon: "success",
            timer: 1500,
          });
          props.toggle();
          props.togglePreviousModal();
        })
        .catch(() => {
          handleApiError({ text: "Erreur lors de l'envoi" });
          props.toggle();
          props.togglePreviousModal();
        });
    } else {
      setNotEmailError(true);
    }
  };

  return (
    <Modal isOpen={props.show} toggle={props.toggle} className={styles.modal} contentClassName={styles.modal_content}>
      <MainContainer>
        <CloseIconContainer onClick={props.toggle}>
          <EVAIcon name="close" fill={colors.white} size={"large"} />
        </CloseIconContainer>
        <TitleContainer>{t("Register.Recevoir une invitation", "Recevoir une invitation")}</TitleContainer>
        <TextContainer>
          {t("Register.email_invitation", "Nous vous enverrons un email d'invitation pour vous inscrire.")}
        </TextContainer>
        <EmailField id="email" email={email} onChange={handleChangeEmail} notEmailError={notEmailError} />
        {notEmailError && (
          <ErrorMessageContainer>
            {t("Register.not_an_email", "Ceci n'est pas un email,")}{" "}
            {t("Register.check_mail", "vérifiez l'orthographe.")}
          </ErrorMessageContainer>
        )}
        <FButtonMobile
          name="checkmark-outline"
          isDisabled={!email}
          fill="white"
          color={colors.vert}
          onClick={sendMail}
          i18nKey="Envoyer"
          defaultTitle="Envoyer"
        />
      </MainContainer>
    </Modal>
  );
};
