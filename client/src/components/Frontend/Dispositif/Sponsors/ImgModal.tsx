
import React from "react";
import {
  Input,
  Modal,
  InputGroup,
  Spinner,
} from "reactstrap";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import FButton from "components/FigmaUI/FButton/FButton";
import FInput from "components/FigmaUI/FInput/FInput";
import { colors } from "colors";
import styles from "./Sponsors.module.scss";

interface Props {
  modal: any
  keyValue: number
  showModals: any
  imgData: any
  link: any
  nom: string
  sponsorLoading: boolean
  toggleModal: any
  toggleTooltip: any
  handleFileInputChange: any
  handleChange: any
  addSponsor: any
  tooltipOpen: boolean
  edit: boolean
  editSponsor: any
  sponsorKey: string
}

const ImgModal = (props: Props) => {
  return (
    <Modal
      isOpen={props.showModals[props.keyValue].show}
      toggle={() => props.toggleModal(props.modal.name)}
      className={styles.img_modal}
    >
      <div className={`${styles.input} ${styles.inline}`}>
        <span>Ajouter un logo</span>
        {props.imgData.secure_url ? (
          <div className={styles.image_wrapper}>
            <img
              className={styles.sponsor_img}
              src={props.imgData.secure_url}
              alt={props.imgData.alt}
            />
            <FButton className={styles.upload_btn} type="theme" name="upload-outline">
              <Input
                className={styles.file_input}
                type="file"
                id="picture"
                name="user"
                accept="image/*"
                onChange={props.handleFileInputChange}
              />
              <span>Choisir</span>
              {props.sponsorLoading && (
                <Spinner size="sm" color="green" className="ml-10" />
              )}
            </FButton>
          </div>
        ) : (
          <FButton className={styles.upload_btn} type="theme" name="upload-outline">
            <Input
              className={styles.file_input}
              type="file"
              id="picture"
              name="user"
              accept="image/*"
              onChange={props.handleFileInputChange}
            />
            <span>Choisir</span>
            {props.sponsorLoading && (
              <Spinner size="sm" color="green" className="ml-10" />
            )}
          </FButton>
        )}
      </div>
      <div className={styles.input}>
        <span>Entrez le nom de la structure partenaire</span>
        <InputGroup className={styles.input_group}>
          <EVAIcon
            className={styles.input_icon}
            name="briefcase-outline"
            fill={colors.noir}
          />
          <FInput
            id="nom"
            placeholder="Réfugiés.info"
            value={props.nom}
            onChange={props.handleChange}
            newSize={true}
          />
        </InputGroup>
      </div>
      <div className={styles.input}>
        <div
          style={{
            display: "flex",
            justifyContent: "row",
            alignItems: "center",
          }}
        >
          <span>Collez un lien vers le site de la structure</span>
        </div>
        <InputGroup className={styles.input_group}>
          <EVAIcon
            className={styles.input_icon}
            name="link-outline"
            fill={colors.noir}
          />
          <FInput
            id="link"
            placeholder="https://www.réfugiés.info"
            value={props.link}
            onChange={props.handleChange}
            newSize={true}
          />
        </InputGroup>
      </div>
      <div className={styles.btn_footer}>
        <FButton onClick={props.toggleModal} type="default" className="mr-8">
          Annuler
        </FButton>
        <FButton
          onClick={() =>
            props.edit
              ? props.editSponsor(props.sponsorKey)
              : props.addSponsor()
          }
          type="validate"
          name="checkmark-outline"
        >
          Valider
        </FButton>
      </div>
    </Modal>
  );
};

export default ImgModal;
