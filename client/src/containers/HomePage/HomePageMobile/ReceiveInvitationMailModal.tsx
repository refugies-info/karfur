import React, { useState } from "react";
import { Modal } from "reactstrap";
import styled from "styled-components";
import Swal from "sweetalert2";
import { FButtonMobile } from "../../../components/FigmaUI/FButtonMobile/FButtonMobile";
import { colors } from "../../../colors";
import EVAIcon from "../../../components/UI/EVAIcon/EVAIcon";
import FInput from "../../../components/FigmaUI/FInput/FInput";

declare const window: Window;
interface Props {
  toggle: () => void;
  show: boolean;
  t: (a: string, b: string) => void;
}
interface EmailProps {
  email: string;
  notEmailError: boolean;
  t: (a: string, b: string) => void;
  id: string;
  onChange: (email: string) => void;
}

const EmailField = (props: EmailProps) => (
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

const TitleContainer = styled.div`
  font-size: 28px;
  font-weight: 700;
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
  font-weight: 400;
  margin: 16px;
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
  background-color: ;
  right: 10px;
  top: 8px;
`;

export const ReceiveInvitationMailModal = (props: Props) => {
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
    } else {
      setNotEmailError(true);
    }
  };

  return (
    <Modal isOpen={props.show} toggle={props.toggle} className="share-content">
      <MainContainer>
        <CloseIconContainer onClick={props.toggle}>
          <EVAIcon name="close" fill={colors.blancSimple} size={"large"} />
        </CloseIconContainer>
        <TitleContainer>
          {props.t(
            "Register.Recevoir une invitation",
            "Recevoir une invitation"
          )}
        </TitleContainer>
        <TextContainer>
          {props.t(
            "Register.Nous vous enverrons un email d'invitation pour vous inscrire.",
            "Nous vous enverrons un email d'invitation pour vous inscrire."
          )}
        </TextContainer>
        <EmailField
          id="email"
          email={email}
          onChange={handleChangeEmail}
          t={props.t}
          notEmailError={notEmailError}
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
        <FButtonMobile
          name="checkmark-outline"
          isDisabled={!email}
          fill="white"
          color={colors.vert}
          onClick={sendMail}
          t={props.t}
          title="Envoyer"
          defaultTitle="Envoyer"
        />
      </MainContainer>
    </Modal>
  );
};
