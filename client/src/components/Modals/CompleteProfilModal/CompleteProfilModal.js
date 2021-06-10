import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Modal } from "reactstrap";
import styled from "styled-components";
import FInput from "../../FigmaUI/FInput/FInput";
import FButton from "../../FigmaUI/FButton/FButton";
import { colors } from "colors";
//import { useDispatch } from "react-redux";
import { saveUserActionCreator } from "../../../services/User/user.actions";
import Swal from "sweetalert2";

import "./CompleteProfilModal.scss";

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

const ExplainationTitleContainer = styled.p`
  font-weight: 700;
`;

export const CompleteProfilModal = (props) => {
  const [email, setEmail] = useState("");

  const onChange = (e) => {
    setEmail(e.target.value);
  };

  const dispatch = useDispatch();

  const onEmailModificationValidate = () => {
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
    props.history.push("/dispositif");
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
      <ButtonContainer>
        <FButton
          onClick={props.toggle}
          type="outline-black mr-8"
          name="arrow-left"
        >
          {"Retour"}
        </FButton>{" "}
        <FButton
          onClick={() => props.history.push("/dispositif")}
          type="white mr-8"
          name="arrowhead-right-outline"
        >
          {"Plus tard"}
        </FButton>
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
