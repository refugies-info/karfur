import React from "react";
import { ModalBody, ModalFooter } from "reactstrap";

import FButton from "../../FigmaUI/FButton/FButton";
import Modal from "../Modal";

import { colors } from "colors";
import FInput from "components/FigmaUI/FInput/FInput";

interface Props {
  visible: boolean
  code: string
  onChange: any
  onValidate: any
  t: any
}

export const CodePhoneValidationModal = (props: Props) => {
  return (
    <Modal
      show={props.visible}
    >
      <ModalBody>
        <FInput
          value={props.code}
          onChange={props.onChange}
          prepend
          prependName="lock-outline"
          id="code"
          type="number"
          placeholder={props.t("Login.Entrez votre code", "Entrez votre code")}
          newSize
        ></FInput>
      </ModalBody>
      <ModalFooter>
        <div className="align-right">
          <FButton
            type="outline-black"
            name="arrow-forward"
            fill={colors.noir}
            onClick={props.onValidate}
          />
        </div>
      </ModalFooter>
    </Modal>
  );
}
