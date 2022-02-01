import React, { useState } from "react";
import {
  Row,
  Col,
  Input,
  InputGroup,
  FormGroup,
  Label,
  Spinner,
} from "reactstrap";
import Image from "next/image";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import FButton from "components/FigmaUI/FButton/FButton";
import FInput from "components/FigmaUI/FInput/FInput";
import { colors } from "colors";
import styles from "./CreationContent.module.scss";

const CreationContent = (props) => {
  const [banner, setBanner] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  return (
    <div className={styles.container}>
      <div className={styles.form_field}>
        <b>Nom de la nouvelle structure</b>
        <Row>
          <Col lg="9" md="9" sm="12" xs="12">
            <InputGroup className={styles.input_group}>
              <EVAIcon
                className={styles.input_icon}
                name="pricetags-outline"
                fill={colors.noir}
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
          <div className="bg-focus mt-16 mb-8">
            <EVAIcon name="info" fill={colors.blanc} />
            <div onClick={() => setBanner(false)}>
              <EVAIcon name="close-outline" fill={colors.blanc} />
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
            <InputGroup>
              <EVAIcon
                className={styles.input_icon}
                name="person-outline"
                fill={colors.noir}
              />
              <FInput
                id="contact"
                placeholder="Nom et prénom du contact&#42;"
                value={props.contact}
                onChange={props.handleChange}
                name="structure"
                newSize={true}
              />
            </InputGroup>
          </Col>
          <Col lg="5" md="5" sm="12" xs="12">
            <b>Téléphone&#42;</b>
            <InputGroup>
              <EVAIcon
                className={styles.input_icon}
                name="phone-outline"
                fill={colors.noir}
              />
              <FInput
                id="phone_contact"
                placeholder="Numéro de téléphone"
                value={props.phone_contact}
                onChange={props.handleChange}
                name="structure"
                newSize={true}
              />
            </InputGroup>
          </Col>
        </Row>
        <b style={{ marginTop: "16px" }}>Email&#42;</b>
        <InputGroup>
          <EVAIcon
            className={styles.input_icon}
            name="at-outline"
            fill={colors.noir}
          />
          <FInput
            id="mail_contact"
            placeholder="Email du contact"
            value={props.mail_contact}
            onChange={props.handleChange}
            name="structure"
            newSize={true}
          />
        </InputGroup>
        <b style={{ marginTop: "16px" }}>Est-ce que c&apos;est vous ?</b>
        <FormGroup
          check
          className="mb-10"
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
                props.setStructureContactAsMe();
                setIsChecked(!isChecked);
              }}
            />{" "}
            <b>Oui, je suis la personne à contacter</b>
          </Label>
        </FormGroup>
      </div>

      {props.adminView && (
        <>
          {props._id && props.createur && props.createur._id && (
            <div className={styles.creator_wrapper}>
              {props.createur.picture && props.createur.picture.secure_url && (
                <Image
                  className={styles.img + " mr-10"}
                  src={props.createur.picture.secure_url}
                  alt="profile"
                  width={100}
                  height={100}
                  objectFit="contain"
                />
              )}
              <div>
                <p>
                  <b>Nom d&apos;utilisateur : </b> {props.createur.username}
                </p>
                <p>
                  <b>Email : </b> {props.createur.email}
                </p>
                <p>
                  <b>Description : </b> {props.createur.description}
                </p>
              </div>
            </div>
          )}
          <FormGroup row>
            <Col md="3">
              <Label htmlFor="select">
                <b>Administrateur de la structure</b>
              </Label>
            </Col>
            <Col xs="12" md="9">
              <Input
                type="select"
                id="administrateur"
                name="structure"
                value={props.administrateur || ""}
                onChange={props.handleChange}
              >
                <option value={""} key={0}>
                  A définir
                </option>
                {props.users.map((user) => (
                  <option value={user._id} key={user._id}>
                    {user.username}
                  </option>
                ))}
              </Input>
            </Col>
          </FormGroup>
          <div className={styles.form_field}>
            <b>Informations administratives</b>
            <span className="float-right">
              Renseignées par un administrateur uniquement
            </span>
            <Row>
              <Col lg="6" md="6" sm="12" xs="12">
                <InputGroup>
                  <EVAIcon
                    className={styles.input_icon}
                    name="award-outline"
                    fill={colors.noir}
                  />
                  <Input
                    id="siren"
                    placeholder="SIREN"
                    value={props.siren}
                    onChange={props.handleChange}
                    name="structure"
                  />
                </InputGroup>
              </Col>
              <Col lg="6" md="6" sm="12" xs="12">
                <InputGroup>
                  <EVAIcon
                    className={styles.input_icon}
                    name="award-outline"
                    fill={colors.noir}
                  />
                  <Input
                    id="siret"
                    placeholder="SIRET"
                    value={props.siret}
                    onChange={props.handleChange}
                    name="structure"
                  />
                </InputGroup>
              </Col>
            </Row>
            <InputGroup>
              <EVAIcon
                className={styles.input_icon}
                name="pin-outline"
                fill={colors.noir}
              />
              <Input
                id="adresse"
                placeholder="Adresse physique"
                value={props.adresse}
                onChange={props.handleChange}
                name="structure"
              />
            </InputGroup>
            <InputGroup>
              <EVAIcon
                className={styles.input_icon}
                name="at-outline"
                fill={colors.noir}
              />
              <Input
                id="mail_generique"
                placeholder="Mail générique de contact"
                value={props.mail_generique}
                onChange={props.handleChange}
                name="structure"
              />
            </InputGroup>
          </div>

          <div className={`${styles.form_field} ${styles.inline_div}`}>
            <b>Logo de la structure</b>
            {(props.picture || {}).secure_url ? (
              <div className={styles.image_wrapper}>
                <Input
                  type="file"
                  id="picture"
                  name="structure"
                  accept="image/*"
                  onChange={props.handleFileInputChange}
                />
                <Image
                  className={styles.sponsor_img}
                  src={(props.picture || {}).secure_url}
                  alt={props.acronyme}
                  width={110}
                  height={40}
                  objectFit="contain"
                />
                {props.uploading && (
                  <Spinner color="success" className="ml-10" />
                )}
              </div>
            ) : (
              <FButton
                className={styles.upload_btn}
                type="theme"
                theme={props.mainTag.darkColor}
                name="upload-outline"
              >
                <Input
                  type="file"
                  id="picture"
                  name="structure"
                  accept="image/*"
                  onChange={props.handleFileInputChange}
                />
                <span>Choisir</span>
                {props.uploading && (
                  <Spinner color="success" className="ml-10" />
                )}
              </FButton>
            )}
          </div>
          <div className={styles.form_field}>
            <b>Texte alternatif à l’image</b>
            <InputGroup>
              <EVAIcon
                className={styles.input_icon}
                name="eye-off-outline"
                fill={colors.noir}
              />
              <Input
                id="alt"
                placeholder="Agi’r"
                value={props.alt || ""}
                onChange={props.handleChange}
                name="structure"
              />
            </InputGroup>
          </div>
        </>
      )}
    </div>
  );
};

export default CreationContent;
