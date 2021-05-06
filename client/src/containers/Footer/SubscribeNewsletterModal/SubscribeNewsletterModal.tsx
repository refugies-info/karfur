/* eslint-disable no-console */
import React, { useState } from "react";
import { Modal } from "reactstrap";
import styled from "styled-components";
import { newsletter } from "../../../assets/figma";
import FInput from "../../../components/FigmaUI/FInput/FInput";
import Swal from "sweetalert2";
import API from "../../../utils/API";
import { FButtonMobile } from "../../../components/FigmaUI/FButtonMobile/FButtonMobile";
import { colors } from "colors";

declare const window: Window;
interface Props {
  toggle: () => void;
  show: boolean;
  t: (a: string, b: string) => void;
  onChange: void;
}

interface EmailProps {
  email: string;
  notEmailError: boolean;
  t: (a: string, b: string) => void;
  id: string;
  onChange: (email: string) => void;
}
const TitleContainer = styled.div`
  font-size: 28px;
  font-weight: 700;
  margin: 8px;
`;
const MainContainer = styled.div`
  text-align: center;
  padding: 29px;
  margin: 8px;
`;
const TextContainer = styled.div`
  font-size: 18px;
  font-weight: 400;
  margin: 16px;
`;

const ErrorMessageContainer = styled.div`
  color: #e8140f;
  font-size: 16px;
  line-height: 20px;
  margin-top: 16px;
`;

const EmailField = (props: EmailProps) => {
  return (
    <>
      <FInput
        prepend
        prependName="email-outline"
        value={props.email}
        {...props}
        id="email"
        type="email"
        placeholder={props.t("Register.Votre email", "Votre email")}
        error={props.notEmailError}
        errorIcon="email-outline"
        newSize
      />
    </>
  );
};

export const SubscribeNewsletterModal = (props: Props) => {
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
        type: "error",
        timer: 1500,
      });
      return;
    }
    const regex = /^\S+@\S+\.\S+$/;
    const isEmail = !!email.match(regex);
    if (isEmail) {
      console.log("email", email);
      API.set_mail({ mail: email })
        .then(() => {
          Swal.fire({
            title: "Yay...",
            text: "Mail correctement enregistré !",
            type: "success",
            timer: 1500,
          });
          setEmail("");
        })
        .catch(() =>
          Swal.fire("Oh non...", "Une erreur s'est produite", "error")
        );
    } else {
      setNotEmailError(true);
    }
  };

  return (
    <Modal isOpen={props.show} toggle={props.toggle} className="share-content">
      <MainContainer>
        <img src={newsletter} alt="image newsletter" />
        <TitleContainer>
          {props.t("Footer.Newsletter", "Newsletter")}
        </TitleContainer>
        <TextContainer>
          {props.t(
            "Footer.Inscrivez-vous à notre lettre",
            "Inscrivez-vous à notre lettre d'information pour suivre l'évolution du projet Réfugiés.info"
          )}
        </TextContainer>
        <EmailField
          id="email"
          email={email}
          onChange={handleChangeEmail}
          t={props.t}
          notEmailError={notEmailError}
        />

        <FButtonMobile
          name="checkmark-outline"
          disabled={!email}
          fill="white"
          color={colors.vert}
          onClick={sendMail}
          t={props.t}
          title="Envoyer"
          defaultTitle="Envoyer"
        />

        {notEmailError && (
          <ErrorMessageContainer>
            {props.t(
              "Register.Ceci n'est pas un email,",
              "Ceci n'est pas un email,"
            )}{" "}
            {props.t(
              "Register.vérifiez l'orthographe.",
              "vérifiez l'orthographe."
            )}
          </ErrorMessageContainer>
        )}
      </MainContainer>
    </Modal>
  );
};
