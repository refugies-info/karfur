import React from "react";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import AddContentButton from "../AddContentButton";
import styles from "./LeftSidebarEdition.module.scss";

const LeftSidebarEdition = () => {
  return (
    <div>
      <AddContentButton onClick={() => {}} className="mb-6" size="md">
        <EVAIcon name="color-palette-outline" size={24} fill={styles.lightTextDisabledGrey} className="me-2" />
        Thèmes
      </AddContentButton>
      <AddContentButton onClick={() => {}} size="md">
        Nom de l'action
      </AddContentButton>

      <p className={styles.title}>C'est pour qui ?</p>
      <AddContentButton onClick={() => {}} className="mb-6" size="md">
        Public visé
      </AddContentButton>
      <AddContentButton onClick={() => {}} className="mb-6" size="md">
        Prix
      </AddContentButton>
      <AddContentButton onClick={() => {}} className="mb-6" size="md">
        Formation certifiante
      </AddContentButton>
      <AddContentButton onClick={() => {}} className="mb-6" size="md">
        Disponibilité demandée
      </AddContentButton>
      <AddContentButton onClick={() => {}} className="mb-6" size="md">
        Conditions
      </AddContentButton>
      <AddContentButton onClick={() => {}} className="mb-6" size="md">
        Zone d'action
      </AddContentButton>

      <p className={styles.title}>Responsabilité</p>
      <AddContentButton onClick={() => {}} size="md">
        Ajouter ma structure
      </AddContentButton>
    </div>
  );
};

export default LeftSidebarEdition;
