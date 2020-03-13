import React, { Component } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Input } from "reactstrap";
import FButton from "../../../FigmaUI/FButton/FButton";
import styled from "styled-components";

const Tabs = styled.div`
    display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-evenly;
`;

const Tab = styled.button`

`

export const MediaModal = props => {
  return (
    <Modal
      isOpen={props.modalState}
      toggle={props.toggle}
      className="dispositif-validate-modal"
    >
      <ModalHeader toggle={props.toggle}>Ajouter un média</ModalHeader>
      <ModalBody>
        <Tabs>
          <div style={{flex: 1, margin: 0}}>
            <FButton name="checkmark" type="default">
              Photo
            </FButton>
          </div>
          <div style={{flex: 1, margin: 0}}>
            <FButton name="checkmark" type="outline-black">
              Photo
            </FButton>
          </div>
          <div style={{flex: 1, margin: 0}}>
            <FButton name="checkmark" type="light-action">
              Photo
            </FButton>
          </div>
        </Tabs>

        <p>
          Merci d’ajouter <b>une phrase explicative</b> décrivant votre fiche.{" "}
          <br />
          Elle sera affichée dans les résultats de recherche.
        </p>
        <Input
          type="textarea"
          rows={5}
          value={props.abstract}
          onChange={props.onChange}
          id="abstract"
          placeholder="Résumez votre dispositif en une phrase"
        />
      </ModalBody>
      <ModalFooter>
        <span
          className={
            "decompte" +
            ((props.abstract || "").length > 110 ? " text-danger" : "")
          }
        >
          {110 - (props.abstract || "").length} sur 110 caractères restants
        </span>
        <FButton
          name="checkmark"
          type="validate"
          disabled={
            !props.abstract ||
            props.abstract === "" ||
            props.abstract.length > 110
          }
        >
          Envoyer
        </FButton>
      </ModalFooter>
    </Modal>
  );
};
