import React, { useState } from "react";
import { Modal } from "reactstrap";
import styled from "styled-components";
import { newsletter } from "../../../assets/figma";
import FInput from "../../../components/FigmaUI/FInput/FInput";
import Swal from "sweetalert2";
import API from "../../../utils/API";
import { FButtonMobile } from "../../../components/FigmaUI/FButtonMobile/FButtonMobile";
import { colors } from "colors";
import { isMobile } from "react-device-detect";
import FButton from "../../../components/FigmaUI/FButton/FButton";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";

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

const CancelButton = styled.div`
  display: flex;
  align-items: center;
  margin-right: 8px;
  height: 60px;
  background-color: ${colors.blanc};
  border-radius: 12px;
  padding: 20px;
  font-size: 16px;
  font-weight: 700;
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ErrorMessageContainer = styled.div`
  color: #e8140f;
  font-size: 16px;
  line-height: 20px;
  margin-top: 16px;
`;

const Icon = styled.div`
  margin-right: 10px;
`;
const CloseIcon = styled.div`
  position: absolute;
  right: 10px;
  top: 8px;
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
      API.set_mail({ mail: email })
        .then(() => {
          Swal.fire({
            title: "Yay...",
            text: "Mail correctement enregistré !",
            type: "success",
            timer: 1500,
          });
          setEmail("");
          props.toggle();
        })
        .catch(() => {
          Swal.fire("Oh non...", "Une erreur s'est produite", "error");
        });
    } else {
      setNotEmailError(true);
    }
  };

  return (
    <Modal isOpen={props.show} toggle={props.toggle} className="share-content">
      <MainContainer>
        {isMobile && (
          <CloseIcon onClick={props.toggle}>
            <EVAIcon name="close" fill="black" size={"large"} />
          </CloseIcon>
        )}
        <img src={newsletter} alt="image newsletter" />
        <TitleContainer>
          {isMobile
            ? props.t("Footer.Newsletter", "Newsletter")
            : props.t(
                "Footer.Inscription à la newsletter",
                "Inscription à la newsletter"
              )}
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

        {isMobile ? (
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
        ) : (
          <ButtonContainer>
            <CancelButton>
              <Icon>
                <EVAIcon name="close" fill="black" size={"large"} />
              </Icon>
              <div> {props.t("Annuler", "Annuler")}</div>
            </CancelButton>
            <FButton
              type="validate-light"
              name="checkmark-outline"
              disabled={!email}
              onClick={sendMail}
            >
              <div> {props.t("Envoyer", "Envoyer")}</div>
            </FButton>
          </ButtonContainer>
        )}

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
