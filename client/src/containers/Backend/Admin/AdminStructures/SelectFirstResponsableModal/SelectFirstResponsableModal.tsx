import React from "react";
import styled from "styled-components";
import { Modal } from "reactstrap";
import "./SelectFirstResponsableModal.scss";

const TEst = styled.div`
  background-color: red;
`;

interface Props {
  show: boolean;
  toggleModal: () => void;
}
export const SelectFirstResponsableModal = (props: Props) => (
  <Modal
    isOpen={props.show}
    toggle={props.toggleModal}
    size="lg"
    className="select-respo-modal"
  >
    <TEst>test respo </TEst>
  </Modal>
);
