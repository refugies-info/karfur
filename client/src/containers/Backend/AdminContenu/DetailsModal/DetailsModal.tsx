import React from "react";
import styled from "styled-components";
import { Modal, Spinner } from "reactstrap";
// @ts-ignore
import "./DetailsModal.scss";
import { Moment } from "moment";
import { TypeContenu, StyledStatus } from "../components/SubComponents";
import FButton from "../../../../components/FigmaUI/FButton/FButton";
import { ObjectId } from "mongodb";
import { correspondingStatus } from "../data";
import { compare } from "../AdminContenu";
// @ts-ignore
import moment from "moment/min/moment-with-locales";

interface SelectedDispositif {
  titreInformatif: string;
  titreMarque?: string;
  updatedAt: Moment;
  status: string;
  typeContenu: string;
  created_at: Moment;
  publishedAt?: Moment;
  _id: ObjectId;
}
interface Props {
  show: boolean;
  toggleModal: () => void;
  selectedDispositif: SelectedDispositif;
  url: string;
  onDeleteClick: () => void;
}

const LeftPart = styled.div`
  display: flex;
  flex-direction: column;
  width: 350px;
`;

const RightPart = styled.div`
  display: flex;
  flex-direction: column;
  width: 350px;
`;

const TitreInformatif = styled.span`
  font-style: normal;
  font-weight: 500;
  font-size: 32px;
  line-height: 40px;
`;
const TitreMarque = styled.div`
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  margin-right: 8px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  margin: 12px 0px 12px 0px;
`;

moment.locale("fr");
export const DetailsModal = (props: Props) => {
  const selectedDispositif = props.selectedDispositif;
  if (selectedDispositif) {
    const burl =
      props.url +
      (selectedDispositif.typeContenu || "dispositif") +
      "/" +
      selectedDispositif._id;
    return (
      <Modal
        isOpen={props.show}
        toggle={props.toggleModal}
        size="lg"
        className="details-modal"
      >
        <LeftPart>
          <TitreInformatif>
            {selectedDispositif.titreInformatif}
          </TitreInformatif>
          <RowContainer>
            {selectedDispositif.titreMarque && (
              <TitreMarque>
                <span style={{ color: "#828282" }}>avec </span>
                {selectedDispositif.titreMarque}
              </TitreMarque>
            )}
            <TypeContenu
              type={selectedDispositif.typeContenu}
              isDetailedVue={true}
            />
          </RowContainer>
          <Title>Statut</Title>
          <RowContainer>
            {correspondingStatus.sort(compare).map((status) => (
              <div
                key={status.storedStatus}
                style={{
                  marginRight: "8px",
                  marginTop: "4px",
                  marginBottom: "4px",
                }}
              >
                <StyledStatus
                  text={status.storedStatus}
                  overrideColor={
                    selectedDispositif.status !== status.storedStatus
                  }
                />
              </div>
            ))}
          </RowContainer>
          <Title>Dernière mise à jour</Title>
          {`${moment(selectedDispositif.updatedAt).format("LLL")} soit ${moment(
            selectedDispositif.updatedAt
          ).fromNow()}`}
          <Title>Date de publication</Title>
          {selectedDispositif.publishedAt
            ? `${moment(selectedDispositif.publishedAt).format(
                "LLL"
              )} soit ${moment(selectedDispositif.publishedAt).fromNow()}`
            : "Non disponible"}
          <Title>Date de création</Title>
          {`${moment(selectedDispositif.created_at).format(
            "LLL"
          )} soit ${moment(selectedDispositif.created_at).fromNow()}`}
          <Title>Auteur</Title>
          <RowContainer>
            <FButton
              className="mr-8"
              type="dark"
              tag={"a"}
              href={burl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Voir la fiche
            </FButton>
            <FButton type="error" onClick={props.onDeleteClick}>
              Supprimer
            </FButton>
          </RowContainer>
        </LeftPart>
        <RightPart></RightPart>
      </Modal>
    );
  }
  return <Spinner />;
};
