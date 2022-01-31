import styled from "styled-components";
import { Responsable } from "types/interface";
import React from "react";
import Image from "next/image";
import marioProfile from "assets/mario-profile.jpg";
import FButton from "components/FigmaUI/FButton/FButton";
import styles from "./AdminStructureComponents.module.scss";

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
  responsable: Responsable | null;
  canClickOnRespo: boolean;
  toggleModal?: () => void;
  onUserNameClick?: () => void;
  onNewRespoClick?: () => void;
}

export const ResponsableComponent = (props: Props) => {
  const responsableSecureUrl =
    props.responsable &&
    props.responsable.picture &&
    props.responsable.picture.secure_url
      ? props.responsable.picture.secure_url
      : marioProfile;

  if (props.canClickOnRespo) {
    return (
      <RowContainer style={{ marginBottom: "8px" }}>
        {props.responsable && (
          <Image
            className={styles.respo_img + " mr-8"}
            src={responsableSecureUrl}
            alt=""
            width={70}
            height={40}
            objectFit="contain"
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
            }}
          >
            {props.responsable.username}
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
          className={styles.respo_img + " mr-8"}
          src={responsableSecureUrl}
          alt=""
          width={70}
          height={40}
          objectFit="contain"
        />
      )}
      {props.responsable ? props.responsable.username : "Aucun responsable"}
    </RowContainer>
  );
};
