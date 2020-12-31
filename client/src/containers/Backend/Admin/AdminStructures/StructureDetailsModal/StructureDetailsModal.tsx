/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars-experimental */
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { SimplifiedStructureForAdmin } from "types/interface";
import { Modal, Input, Spinner } from "reactstrap";
import "./StructureDetailsModal.scss";
import FInput from "components/FigmaUI/FInput/FInput";
// @ts-ignore
import moment from "moment/min/moment-with-locales";
import FButton from "components/FigmaUI/FButton/FButton";
import API from "utils/API";
import noStructure from "assets/noStructure.png";
import { ObjectId } from "mongodb";
import {
  ResponsableComponent,
  RowContainer,
} from "../components/AdminStructureComponents";
import { correspondingStatus } from "../data";
import { compare } from "../../AdminContenu/AdminContenu";
import { StyledStatus } from "../../sharedComponents/SubComponents";
import Swal from "sweetalert2";

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
const BottomRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 16px;
  justify-content: space-between;
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: row;
`;
const LogoWrapper = styled.div`
  width: 160px;
  max-height: 200px;
`;
const RightLogoContainer = styled.div`
  margin-left: 32px;
  margin-bottom: 24px;
`;
interface Props {
  show: boolean;
  toggleModal: () => void;
  selectedStructure: SimplifiedStructureForAdmin | null;
  fetchStructures: () => void;
}
export const StructureDetailsModal = (props: Props) => {
  const [
    structure,
    setStructure,
  ] = useState<SimplifiedStructureForAdmin | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setStructure(props.selectedStructure);
  }, [props.selectedStructure]);

  const onSave = async () => {
    try {
      await API.create_structure(structure);
      Swal.fire({
        title: "Yay...",
        text: "Structure modifiée",
        type: "success",
        timer: 1500,
      });
      props.fetchStructures();
      props.toggleModal();
    } catch (error) {
      Swal.fire({
        title: "Oh non",
        text: "Erreur lors de la modification",
        type: "error",
        timer: 1500,
      });
      props.fetchStructures();
      props.toggleModal();
    }
  };

  const handleFileInputChange = (event: any) => {
    setUploading(true);
    const formData = new FormData();
    // @ts-ignore
    formData.append(0, event.target.files[0]);

    API.set_image(formData).then(
      (data_res: {
        data: {
          data: { secure_url: string; public_id: string; imgId: ObjectId };
        };
      }) => {
        const imgData = data_res.data.data;
        // @ts-ignore
        setStructure({
          ...structure,
          picture: {
            secure_url: imgData.secure_url,
            public_id: imgData.public_id,
            imgId: imgData.imgId,
          },
        });
        setUploading(false);
      }
    );
  };

  const modifyStatus = (status: string) =>
    // @ts-ignore
    setStructure({ ...structure, status });

  const onChange = (e: Event) =>
    // @ts-ignore
    setStructure({ ...structure, [e.target.id]: e.target.value });
  const secureUrl =
    structure && structure.picture && structure.picture.secure_url;

  console.log("structure", structure);
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
      <LogoContainer>
        <LogoWrapper>
          {secureUrl ? (
            <img className="sponsor-img" src={secureUrl} />
          ) : (
            <img className="sponsor-img" src={noStructure} />
          )}
        </LogoWrapper>
        <RightLogoContainer>
          <FButton className="upload-btn" type="theme" name="upload-outline">
            <Input
              className="file-input"
              type="file"
              id="picture"
              name="structure"
              accept="image/*"
              onChange={handleFileInputChange}
            />
            {secureUrl ? (
              <span>Choisir une autre image</span>
            ) : (
              <span>Choisir</span>
            )}

            {uploading && <Spinner color="success" className="ml-10" />}
          </FButton>
        </RightLogoContainer>
      </LogoContainer>
      <Title>Premier responsable</Title>
      <div style={{ marginBottom: "8px" }}>
        <ResponsableComponent responsable={structure.responsable} />
      </div>

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
      <RowContainer>
        {correspondingStatus.sort(compare).map((element) => {
          return (
            <div
              key={element.status}
              style={{
                marginRight: "8px",
                marginBottom: "8px",
              }}
              onClick={() => modifyStatus(element.status)}
            >
              <StyledStatus
                text={element.status}
                overrideColor={structure.status !== element.status}
                textToDisplay={element.status}
                // color={element.color}
                disabled={false}
              />
            </div>
          );
        })}
      </RowContainer>
      <Title>Date de création</Title>
      {moment(structure.created_at).format("LLL")}
      <BottomRowContainer>
        <div>
          <FButton className="mr-8" type="dark" name="external-link">
            Page
          </FButton>
          {props.selectedStructure &&
            props.selectedStructure.status === "Actif" && (
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
          <FButton
            className="mr-8"
            type="validate"
            name="checkmark-outline"
            onClick={onSave}
          >
            Enregistrer
          </FButton>
        </div>
      </BottomRowContainer>
    </Modal>
  );
};
