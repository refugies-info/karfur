import styled from "styled-components";
import React from "react";
import Image from "next/image";
import marioProfile from "assets/mario-profile.jpg";
import FButton from "components/UI/FButton/FButton";
import styles from "./AdminStructureComponents.module.scss";
import { GetAllStructuresResponse } from "@refugies-info/api-types";

export const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const StructureName = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
`;

interface Props {
  responsable: GetAllStructuresResponse["responsable"] | null;
  canClickOnRespo: boolean;
  toggleModal?: () => void;
  onUserNameClick?: () => void;
  onNewRespoClick?: () => void;
}

export const ResponsableComponent = (props: Props) => {
  const responsableSecureUrl =
    props.responsable && props.responsable.picture && props.responsable.picture.secure_url
      ? props.responsable.picture.secure_url
      : marioProfile;

  if (props.canClickOnRespo) {
    return (
      <RowContainer style={{ marginBottom: "8px" }}>
        {props.responsable && (
          <Image
            className={styles.respo_img + " me-2"}
            src={responsableSecureUrl}
            alt=""
            width={40}
            height={40}
            style={{ objectFit: "contain" }}
          />
        )}
        {props.responsable ? (
          <div
            onClick={() => {
              if (props.toggleModal) {
                props.toggleModal();
              }
              if (props.onUserNameClick) {
                props.onUserNameClick();
              }
            }}
            style={{
              cursor: "pointer",
              textDecoration: "underline",
              marginLeft: 16,
            }}
          >
            {props.responsable.username || props.responsable.email}
          </div>
        ) : (
          <FButton
            type="white"
            name="person-add-outline"
            onClick={() => {
              if (props.onNewRespoClick) {
                props.onNewRespoClick();
              }
            }}
          >
            Choisir un responsable
          </FButton>
        )}
      </RowContainer>
    );
  }

  return (
    <RowContainer>
      {props.responsable && (
        <Image
          className={styles.respo_img + " me-2"}
          src={responsableSecureUrl}
          alt=""
          width={40}
          height={40}
          style={{ objectFit: "contain" }}
        />
      )}
      <span className="ms-4">
        {props.responsable ? props.responsable.username || props.responsable.email : "Aucun responsable"}
      </span>
    </RowContainer>
  );
};
