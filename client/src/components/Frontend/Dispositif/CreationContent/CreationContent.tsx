import React, { useState } from "react";
import {
  Row,
  Col,
  Input,
  InputGroup,
  FormGroup,
  Label,
} from "reactstrap";
import { useTranslation } from "next-i18next";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import FInput from "components/UI/FInput/FInput";
import { colors } from "colors";
import styles from "./CreationContent.module.scss";
import parentStyles from "../Sponsors/Sponsors.module.scss";

interface Props {
  nom: string
  handleChange: any
  contact: string
  phone_contact: string
  mail_contact: string
  setStructureContactAsMe: () => void
  phoneError: boolean
}

const CreationContent = (props: Props) => {
  const { t } = useTranslation();
  const [banner, setBanner] = useState(true);
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.form_field}>
        <label className={styles.label}>Nom de la nouvelle structure</label>
        <Row>
          <Col lg="9" md="9" sm="12" xs="12">
            <InputGroup className={styles.input_group}>
              <EVAIcon
                className={styles.input_icon}
                name="pricetags-outline"
                fill={colors.gray90}
              />
              <FInput
                id="nom"
                placeholder="Nom complet de la structure"
                value={props.nom}
                onChange={props.handleChange}
                name="structure"
                newSize={true}
              />
            </InputGroup>
          </Col>
        </Row>
      </div>
      <div className={styles.form_field}>
        <b style={{ fontSize: "22px" }}>Responsable à contacter</b>
        {banner ? (
          <div className={parentStyles.warning + " bg-focus mt-16 mb-16"}>
            <EVAIcon name="info" fill={colors.gray10} className={parentStyles.info_icon} />
            <div
              onClick={() => setBanner(false)}
              className={parentStyles.close_icon}
            >
              <EVAIcon name="close-outline" fill={colors.gray10} />
            </div>
            <p style={{ marginBottom: 0 }}>
              Notre équipe va contacter au plus vite cette personne pour
              l’informer de la validation de la structure. Seule l’équipe de
              Réfugiés.info aura accès à ces coordonnées.
            </p>
          </div>
        ) : (
          <div style={{ marginTop: 24 }} />
        )}
        <Row className={"mt-16 mb-16"}>
          <Col lg="7" md="7" sm="12" xs="12">
            <b>Nom et prénom&#42;</b>
            <InputGroup className={styles.input_group}>
              <EVAIcon
                className={styles.input_icon}
                name="person-outline"
                fill={colors.gray90}
              />
              <FInput
                id="contact"
                placeholder="Nom et prénom du contact&#42;"
                value={props.contact || ""}
                onChange={props.handleChange}
                name="structure"
                newSize={true}
              />
            </InputGroup>
          </Col>
          <Col lg="5" md="5" sm="12" xs="12">
            <b>Téléphone&#42;</b>
            <InputGroup className={styles.input_group}>
              <EVAIcon
                className={styles.input_icon}
                name="phone-outline"
                fill={colors.gray90}
              />
              <FInput
                id="phone_contact"
                placeholder="Numéro de téléphone"
                type="tel"
                value={props.phone_contact || ""}
                onChange={props.handleChange}
                name="structure"
                newSize={true}
                error={props.phoneError}
              />
               {props.phoneError && (
                  <p className={styles.error}>
                    {t("Register.Ceci n'est pas un numéro de téléphone valide, vérifiez votre saisie")}
                  </p>
                )}
            </InputGroup>
          </Col>
        </Row>
        <b style={{ marginTop: "16px" }}>Email&#42;</b>
        <InputGroup className={styles.input_group}>
          <EVAIcon
            className={styles.input_icon}
            name="at-outline"
            fill={colors.gray90}
          />
          <FInput
            id="mail_contact"
            placeholder="Email du contact"
            value={props.mail_contact || ""}
            onChange={props.handleChange}
            name="structure"
            newSize={true}
          />
        </InputGroup>
        <b style={{ marginTop: "16px" }}>Est-ce que c&apos;est vous ?</b>
        <FormGroup
          check
          className={parentStyles.structure + " mb-10"}
          style={
            isChecked
              ? {
                  backgroundColor: colors.greenValidate,
                  border: "0.5px solid" + colors.validationHover,
                  margin: "16px auto",
                }
              : { margin: "16px auto" }
          }
        >
          <Label
            style={{
              cursor: "pointer",
              fontWeight: "bold",
            }}
            check
          >
            <Input
              type="checkbox"
              checked={isChecked}
              style={{ cursor: "pointer" }}
              onChange={() => {
                if (!isChecked) props.setStructureContactAsMe();
                setIsChecked(!isChecked);
              }}
            />{" "}
            <b>Oui, je suis la personne à contacter</b>
          </Label>
        </FormGroup>
      </div>
    </div>
  );
};

export default CreationContent;
