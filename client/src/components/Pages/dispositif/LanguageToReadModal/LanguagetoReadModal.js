import React from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import FButton from "components/FigmaUI/FButton/FButton";
import styled from "styled-components";
import { initGA, Event } from "tracking/dispatch";

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const LanguageToReadModal = (props) => {
  return (
    <Modal isOpen={props.show} toggle={props.toggle} className="language-modal">
      <ModalHeader toggle={props.toggle}>
        <span className="title">
          {props.t("Dispositif.Lire en", "Lire en : ")}
        </span>
      </ModalHeader>
      <ModalBody>
        <ButtonContainer>
          {props.languages.map((langue, index) => {
            return (
              <FButton
                key={index}
                type="white"
                className="mb-16"
                style={{
                  boxShadow: "0px 8px 16px rgba(33, 33, 33, 0.24)",
                  width: "auto",
                  height: "56px",
                }}
                onClick={() => {
                  initGA();
                  Event("CHANGE_LANGUAGE", langue.i18nCode, "label");
                  props.changeLanguage(langue.i18nCode);
                  props.toggle();
                }}
              >
                <i
                  className={"flag-icon flag-icon-" + langue.langueCode}
                  title={langue.langueCode}
                  id={langue.langueCode}
                />
                <span className="ml-10 language-name">
                  {langue.langueLoc || "Langue"}
                </span>
              </FButton>
            );
          })}
        </ButtonContainer>
      </ModalBody>
    </Modal>
  );
};
