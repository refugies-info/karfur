import { newsletter } from "@/assets/figma";
import EVAIcon from "@/components/UI/EVAIcon/EVAIcon";
import FButton from "@/components/UI/FButton/FButton";
import { FButtonMobile } from "@/components/UI/FButtonMobile/FButtonMobile";
import FInput from "@/components/UI/FInput/FInput";
import { Event } from "@/lib/tracking";
import styles from "@/scss/components/modals.module.scss";
import { toggleNewsletterModalAction } from "@/services/Miscellaneous/miscellaneous.actions";
import { showNewsletterModalSelector } from "@/services/Miscellaneous/miscellaneous.selector";
import API from "@/utils/API";
import { colors } from "@/utils/colors";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { ChangeEventHandler, useState } from "react";
import { isMobile } from "react-device-detect";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "reactstrap";
import styled from "styled-components";
import Swal from "sweetalert2";

declare const window: Window;

interface EmailProps {
  email: string;
  notEmailError: boolean;
  id: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}
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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
`;

const ErrorMessageContainer = styled.div`
  color: ${colors.error};
  font-size: 16px;
  line-height: 20px;
  margin-top: 16px;
`;

const CloseIconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background-color: black;
  right: 10px;
  top: 8px;
`;

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

export const SubscribeNewsletterModal = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [notEmailError, setNotEmailError] = useState(false);
  const { t } = useTranslation();

  const show = useSelector(showNewsletterModalSelector);
  const toggle = () => dispatch(toggleNewsletterModalAction(false));

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
      toggle();
      API.contacts({ email })
        .then(() => {
          Event("NEWSLETTER", "subscribe", "newsletter modal");
          Swal.fire({
            title: "Yay...",
            text: "Mail correctement enregistré !",
            icon: "success",
            timer: 1500,
          });
          setEmail("");
        })
        .catch((e) => {
          if (e.response?.data?.code === "CONTACT_ALREADY_EXIST")
            Swal.fire("Oh non...", t("Footer.newsletter_contact_already_exist"), "error");
          else Swal.fire("Oh non...", "Une erreur s'est produite", "error");
        });
    } else {
      setNotEmailError(true);
    }
  };

  return (
    <Modal isOpen={show} toggle={toggle} className={styles.modal} contentClassName={styles.modal_content}>
      <MainContainer>
        {isMobile && (
          <CloseIconContainer onClick={toggle}>
            <EVAIcon name="close" fill="white" size={"large"} />
          </CloseIconContainer>
        )}
        <Image src={newsletter} alt="image newsletter" style={{ maxWidth: "100%", height: "auto" }} />
        <TitleContainer>
          {isMobile
            ? t("Footer.Newsletter", "Newsletter")
            : t("Footer.subscribe_to_newsletter_modal_title", "Inscription à la newsletter")}
        </TitleContainer>
        <TextContainer>
          {t(
            "Footer.subscribe_for_informations",
            "Inscrivez-vous à notre lettre d'information pour suivre l'évolution du projet Réfugiés.info",
          )}
        </TextContainer>
        <EmailField id="email" email={email} onChange={handleChangeEmail} notEmailError={notEmailError} />
        {notEmailError && (
          <ErrorMessageContainer>{`${t("Register.not_an_email")} ${t("Register.check_mail")}`}</ErrorMessageContainer>
        )}
        {isMobile ? (
          <FButtonMobile
            name="checkmark-outline"
            isDisabled={!email}
            fill="white"
            color={colors.vert}
            onClick={sendMail}
            i18nKey="Envoyer"
            defaultTitle="Envoyer"
          />
        ) : (
          <ButtonContainer>
            <FButton type="light-action" name="close-outline" onClick={toggle}>
              <div> {t("Retour", "Retour")}</div>
            </FButton>
            <FButton
              type="validate-light"
              name="checkmark-outline"
              disabled={!email}
              onClick={sendMail}
              className="ms-2"
            >
              <div> {t("Envoyer", "Envoyer")}</div>
            </FButton>
          </ButtonContainer>
        )}
      </MainContainer>
    </Modal>
  );
};
