import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Modal } from "reactstrap";
import styled from "styled-components";
import FInput from "../../FigmaUI/FInput/FInput";
import FButton from "../../FigmaUI/FButton/FButton";
import { colors } from "colors";

import { saveUserActionCreator } from "../../../services/User/user.actions";
import Swal from "sweetalert2";

import "./CompleteProfilModal.module.scss";

const TitleContainer = styled.div`
  font-weight: 700;
  font-size: 40px;
`;
const FInputContainer = styled.div`
  width: 520px; ;
`;

const ExplainationContainer = styled.div`
  width: 520px;
  background-color: ${colors.focus};
  border-radius: 12px;
  padding: 16px;
  color: white;
  font-size: 16px;
  margin-top: 8px;
`;
const ButtonContainer = styled.div`
  display: flex;
  margin-top: 16px;
  justify-content: flex-end;
`;

const ErrorMessageContainer = styled.div`
  color: ${colors.error};
  font-size: 16px;
  line-height: 20px;
  margin-top: 16px;
`;

const ExplainationTitleContainer = styled.p`
  font-weight: 700;
`;

export const CompleteProfilModal = (props) => {
  const [email, setEmail] = useState("");
  const [notEmailError, setNotEmailError] = useState(false);

  const onChange = (e) => {
    setEmail(e.target.value);
  };

  const redirect = () => {
    if (props.type === "dispositif") {
      props.history.push("/dispositif");
    } else if (props.type === "demarche") {
      props.history.push("/demarche");
    } else if (props.type === "traduction") {
      if (!props.langueId) return;
      if (!props.isExpert && props.element.tradStatus === "Validée") return;
      return props.history.push({
        pathname:
          (props.isExpert ? "/validation" : "/traduction") +
          "/" +
          (props.element.typeContenu || "dispositif") +
          "/" +
          props.element._id,
        search: "?id=" + props.langueId,
      });
    }
  };

  const dispatch = useDispatch();

  const onEmailModificationValidate = () => {
    const regex = /^\S+@\S+\.\S+$/;
    const isEmail = !!email.match(regex);
    if (isEmail) {
      dispatch(
        saveUserActionCreator({
          user: { email: email, _id: props.user._id },
          type: "modify-my-details",
        })
      );

      Swal.fire({
        title: "Yay...",
        text: "Votre email a bien été modifié",
        type: "success",
        timer: 1500,
      });
      redirect();
    } else {
      setNotEmailError(true);
    }
  };

  return (
    <Modal isOpen={props.show} toggle={props.toggle} className="profil-modal">
      <TitleContainer>Complétez votre profil</TitleContainer>

      <p>Pour contribuer, vous devez renseigner votre adresse email :</p>
      <FInputContainer>
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
      </FInputContainer>
      <ExplainationContainer>
        <ExplainationTitleContainer>
          Pourquoi nous vous demandons votre email :
        </ExplainationTitleContainer>
        <ul>
          <li>Pour réinitialiser votre mot de passe en cas d’oubli</li>
          <li>Pour vous informer en cas d’évolutions sur vos contributions</li>
          <li>Pour des raisons de sécurité (en cas de pratiques abusives)</li>
        </ul>
        Nous ne transmetterons jamais votre email à d’autres organisations.
      </ExplainationContainer>
      {notEmailError && (
        <ErrorMessageContainer>
          {`${props.t("Register.Ceci n'est pas un email,")} ${props.t("Register.vérifiez l'orthographe")}`}
        </ErrorMessageContainer>
      )}
      <ButtonContainer>
        <FButton
          onClick={props.toggle}
          type="outline-black mr-8"
          name="arrow-back-outline"
        >
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
      </ButtonContainer>
    </Modal>
  );
};
