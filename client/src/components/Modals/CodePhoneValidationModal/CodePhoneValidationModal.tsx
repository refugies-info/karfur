import React from "react";
import { ModalBody } from "reactstrap";
import styled from "styled-components";

import FButton from "components/FigmaUI/FButton/FButton";
import Modal from "../Modal";

import { colors } from "colors";
import FInput from "components/FigmaUI/FInput/FInput";

const Title = styled.h2`
  margin-top: 20px;
  margin-bottom: 64px;
  font-weight: bold;
  font-size: 28px;
  line-height: 35px;
  color: ${colors.bleuCharte};
`;
const Text = styled.p`
  font-weight: bold;
`;
const ErrorText = styled.p`
  font-weight: bold;
  color: ${colors.error};
`;
const ButtonsContainer = styled.div`
  margin-top: 54px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
interface Props {
  visible: boolean
  code: string
  phone: string
  isLoading: boolean
  error: string|undefined|null
  onChange: any
  onValidate: any
  toggle: any
  t: any
}

export const CodePhoneValidationModal = (props: Props) => {
  return (
    <Modal
      show={props.visible}
      toggle={props.toggle}
      className="auto-height bg-grey"
    >
      <ModalBody>
        <Title>{ props.t("UserProfile.edit_phone_number") }</Title>
        <Text> {props.t("UserProfile.edit_phone_number_subtitle", { phone: props.phone })}</Text>
        <FInput
          value={props.code}
          onChange={props.onChange}
          prepend={true}
          prependName="lock-outline"
          id="code"
          type="number"
          error={!!props.error}
          placeholder={props.t("Login.Entrez votre code", "Entrez votre code")}
          newSize
          disabled={props.isLoading}
        ></FInput>
        <ErrorText>
          {(props.error && props.error === "WRONG_CODE") &&
          props.t("UserProfile.edit_phone_number_wrong_code")}
        </ErrorText>

        <ButtonsContainer>
          <FButton
            type="white"
            name="close-outline"
            className="mr-8"
            onClick={props.toggle}
            disabled={props.isLoading}
          >
            {props.t("Annuler")}
          </FButton>
          <FButton
            type="validate"
            name="checkmark-outline"
            onClick={props.onValidate}
            disabled={props.isLoading || !props.code}
          >
            {props.t("Valider")}
          </FButton>
        </ButtonsContainer>
      </ModalBody>
    </Modal>
  );
}
