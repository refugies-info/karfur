import React from "react";
import styled from "styled-components";
import { Modal } from "reactstrap";
import "./SelectFirstResponsableModal.scss";
import { SearchBar } from "containers/UI/SearchBar/SearchBar";

const TEst = styled.div`
  background-color: red;
`;

interface Props {
  show: boolean;
  toggleModal: () => void;
}
export const SelectFirstResponsableModal = (props: Props) => {
  const users = [{ username: "test" }];

  return (
    <Modal
      isOpen={props.show}
      toggle={props.toggleModal}
      size="lg"
      className="select-respo-modal"
    >
      <TEst>test respo </TEst>
      <SearchBar
        isArray
        users
        className="search-bar inner-addon right-addon"
        placeholder="Chercher"
        array={users}
        selectItem={() => {}}
      />
    </Modal>
  );
};
