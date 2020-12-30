/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars-experimental */
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { SimplifiedStructureForAdmin } from "types/interface";
import { Modal } from "reactstrap";
import "./StructureDetailsModal.scss";
import FInput from "components/FigmaUI/FInput/FInput";
// @ts-ignore
import moment from "moment/min/moment-with-locales";
import FButton from "components/FigmaUI/FButton/FButton";

moment.locale("fr");

const Title = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  margin: 0px 0px 8px 0px;
`;

const InputContainer = styled.div`
  margin-bottom: 8px;
  width: 440px;
`;
const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 16px;
  justify-content: space-between;
`;
interface Props {
  show: boolean;
  toggleModal: () => void;
  selectedStructure: SimplifiedStructureForAdmin | null;
}
export const StructureDetailsModal = (props: Props) => {
  const [
    structure,
    setStructure,
  ] = useState<SimplifiedStructureForAdmin | null>(null);

  useEffect(() => {
    setStructure(props.selectedStructure);
  }, [props.selectedStructure]);

  const onChange = (e: Event) =>
    // @ts-ignore
    setStructure({ ...structure, [e.target.id]: e.target.value });

  if (!structure)
    return (
      <Modal
        isOpen={props.show}
        toggle={props.toggleModal}
        size="lg"
        className="structure-details-modal"
      >
        Erreur
      </Modal>
    );
  return (
    <Modal
      isOpen={props.show}
      toggle={props.toggleModal}
      size="lg"
      className="structure-details-modal"
    >
      <InputContainer>
        <FInput
          id="nom"
          value={structure.nom}
          onChange={onChange}
          newSize={true}
          autoFocus={false}
        />
      </InputContainer>
      <Title>Premier responsable</Title>
      <Title>Coordonnées du contact unique</Title>
      <InputContainer>
        <FInput
          id="contact"
          value={structure.contact}
          onChange={onChange}
          newSize={true}
          autoFocus={false}
          placeholder="Coordonnées"
        />
      </InputContainer>
      <InputContainer>
        <FInput
          id="mail_contact"
          value={structure.mail_contact}
          onChange={onChange}
          newSize={true}
          autoFocus={false}
          placeholder="Adresse email"
        />
      </InputContainer>
      <InputContainer>
        <FInput
          id="phone_contact"
          value={structure.phone_contact}
          onChange={onChange}
          newSize={true}
          autoFocus={false}
          placeholder="Numéro de téléphone"
        />
      </InputContainer>
      <Title>Statut</Title>
      <Title>Date de création</Title>
      {moment(structure.created_at).format("LLL")}
      <RowContainer>
        <div>
          <FButton className="mr-8" type="dark" name="external-link">
            Page
          </FButton>
          {structure.status === "Actif" && (
            <FButton
              className="mr-8"
              type="dark"
              name="paper-plane"
              tag={"a"}
              href={`/annuaire/${structure._id}`}
              target="_blank"
            >
              Annuaire
            </FButton>
          )}
        </div>
        <div>
          <FButton
            className="mr-8"
            type="white"
            name="close-outline"
            onClick={props.toggleModal}
          >
            Annuler
          </FButton>
          <FButton className="mr-8" type="validate" name="checkmark-outline">
            Enregistrer
          </FButton>
        </div>
      </RowContainer>
    </Modal>
  );
};
