import React, { Component } from "react";
import {
  Row,
  Col,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  InputGroup,
  Tooltip,
  FormGroup,
  Label,
  Spinner,
} from "reactstrap";
import Icon from "react-eva-icons";
import { connect } from "react-redux";
import Swal from "sweetalert2";

import API from "utils/API.js";
import EVAIcon from "../../../UI/EVAIcon/EVAIcon";
import FButton from "../../../FigmaUI/FButton/FButton";
import SearchBar from "../../../../containers/UI/SearchBar/SearchBar";
import { sentIllu } from "../../../../assets/figma/index";
import CreationContent from "../CreationContent/CreationContent";
import { updateUserActionCreator } from "../../../../services/User/user.actions";
import _ from "lodash";

import "./Sponsors.scss";
import variables from "scss/colors.scss";
//ch
class Sponsors extends Component {
  state = {
    showModals: [
      { name: "responsabilite", show: false },
      { name: "etVous", show: false },
      { name: "creation", show: false },
      { name: "envoye", show: false },
      { name: "img-modal", show: false },
    ],
    checked: false,
    authorBelongs: false,
    tooltipOpen: false,
    selected: {},
    mesStructures: [],
    imgData: {},
    link: "",
    alt: "",
    sponsorLoading: false,

    structure: {
      nom: "",
      acronyme: "",
      link: "",
      contact: "",
      mail_contact: "",
      phone_contact: "",
      authorBelongs: false,
    },
  };

  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.user &&
      nextProps.structures &&
      nextProps.structures.length > 0
    ) {
      const mesStructures = (
        nextProps.structures.filter((x) =>
          (x.membres || []).some((y) => y.userId === nextProps.user._id)
        ) || []
      ).map((x) => ({ ...x, checked: false }));
      this.setState({ mesStructures });
    }
  }

  toggleModal = (name) =>
    this.setState((pS) => ({
      showModals: pS.showModals.map((x) => ({
        ...x,
        show: x.name === name ? !x.show : false,
      })),
    }));
  toggleTooltip = () =>
    this.setState((pS) => ({ tooltipOpen: !pS.tooltipOpen }));

  handleFileInputChange = (event) => {
    this.setState({ sponsorLoading: true });
    const formData = new FormData();
    formData.append(0, event.target.files[0]);

    API.set_image(formData).then((data_res) => {
      const imgData = data_res.data.data;
      this.setState({
        imgData: {
          secure_url: imgData.secure_url,
          public_id: imgData.public_id,
          imgId: imgData.imgId,
        },
        sponsorLoading: false,
      });
    });
  };

  handleImgChange = (ev) => {
    this.setState({ [ev.currentTarget.id]: ev.target.value });
  };

  handleChange = (ev) =>
    this.setState({
      structure: {
        ...this.state.structure,
        [ev.currentTarget.id]: ev.target.value,
      },
    });
  handleUserChange = (e) =>
    this.props.updateUserActionCreator({
      ...this.props.user,
      [e.target.id]: e.target.value,
    });

  handleCheckChange = () =>
    this.setState((pS) => ({
      checked: !pS.checked,
      mesStructures: pS.mesStructures.map((x) => ({ ...x, checked: false })),
    }));
  handleBelongsChange = () =>
    this.setState((pS) => ({
      structure: {
        ...pS.structure,
        authorBelongs: !pS.structure.authorBelongs,
      },
    }));
  handleBelongsSChange = () =>
    this.setState((pS) => ({ authorBelongs: !pS.authorBelongs }));
  handleStructChange = (id) =>
    this.setState((pS) => ({
      mesStructures: pS.mesStructures.map((x) => ({
        ...x,
        checked: x._id === id ? !x.checked : false,
      })),
      checked: false,
    }));

  selectItem = (suggestion) => {
    this.setState({ selected: suggestion });
    this.setState({
      imgData: suggestion.picture || {},
      link: suggestion.link || "",
      alt: "",
    });
    this.toggleModal(suggestion.createNew ? "creation" : "etVous");
  };

  createStructure = () => {
    if (
      !this.state.structure.nom ||
      !this.state.structure.contact ||
      (!this.state.structure.mail_contact &&
        !this.state.structure.phone_contact)
    ) {
      Swal.fire({
        title: "Oh non!",
        text: "Certaines informations sont manquantes",
        type: "error",
        timer: 1500,
      });
      return;
    }
    let structure = {},
      fields = [
        "nom",
        "acronyme",
        "link",
        "contact",
        "mail_contact",
        "phone_contact",
        "authorBelongs",
      ];
    fields.forEach((x) =>
      this.state.structure[x] !== ""
        ? (structure[x] = this.state.structure[x])
        : false
    );
    API.create_structure(structure).then((data) => {
      this.props.addSponsor(data.data.data);
      this.toggleModal("envoye");
    });
  };

  validerRespo = () => {
    if (this.state.checked) {
      let user = { ...this.props.user };
      let userInfo = { _id: user._id, email: user.email, phone: user.phone };
      this.props.addSponsor(
        { type: "Not found", user: { ...userInfo, username: user.username } },
        false
      );
      this.toggleModal();
      API.set_user_info(userInfo);
    } else if (this.state.mesStructures.some((x) => x.checked)) {
      this.props.addSponsor(this.state.mesStructures.find((x) => x.checked));
      this.toggleModal();
    }
    if (this.props.finalValidation) {
      this.props.validate();
    }
  };

  addSponsor = (asAdmin = false) => {
    if (asAdmin) {
      //Le cas où on rajoute plus d'un sponsor, en tant qu'admin
      if (_.isEmpty(this.props.sponsors) && this.props.finalValidation) {
        this.props.addSponsor({
          ...this.state.selected,
          picture: { ...this.state.imgData },
          link: this.state.link,
          alt: this.state.alt,
          asAdmin,
        });
        this.toggleModal();
        this.props.validate();
      } else {
        this.props.addSponsor({
          ...this.state.selected,
          picture: { ...this.state.imgData },
          link: this.state.link,
          alt: this.state.alt,
          asAdmin,
        });
        this.toggleModal();
      }
    } else {
      if (_.isEmpty(this.props.sponsors) && this.props.finalValidation) {
        this.props.addSponsor({
          ...this.state.selected,
          userBelongs: this.state.authorBelongs,
        });
        this.toggleModal("envoye");
        this.props.validate();
      } else {
        this.props.addSponsor({
          ...this.state.selected,
          picture: { ...this.state.imgData },
          link: this.state.link,
          alt: this.state.alt,
          asAdmin,
        });
        this.toggleModal();
      }
    }
  };

  /*   addStructure = () => {
    console.log(this.state, 'add structure');
    this.setState({
      imgData: this.state.selected.picture || {},
      link: this.state.selected.link || '',
      alt: '',
    })
    this.addSponsor();
  } */

  upcoming = () =>
    Swal.fire({
      title: "Oh non!",
      text: "Cette fonctionnalité n'est pas encore disponible",
      type: "error",
      timer: 1500,
    });

  render() {
    const {
      disableEdit,
      t,
      sponsors,
      deleteSponsor,
      user,
      structures,
      admin,
    } = this.props;
    const {
      showModals,
      selected,
      authorBelongs,
      checked,
      mesStructures,
    } = this.state;

    const modal = { name: "responsabilite" };
    return (
      <div className="sponsor-footer">
        <h5 className="color-darkColor">
          {t("Dispositif.Structures", "Structures partenaires")}
        </h5>
        <Row className="sponsor-images">
          {sponsors &&
            sponsors.map((sponsor, key) => {
              return (
                <Col key={key} className="sponsor-col">
                  <div className="image-wrapper">
                    <a
                      href={
                        ((sponsor.link || "").includes("http")
                          ? ""
                          : "http://") + sponsor.link
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {sponsor.picture && sponsor.picture.secure_url ? (
                        <img
                          className="sponsor-img"
                          src={sponsor.picture.secure_url}
                          alt={sponsor.alt}
                        />
                      ) : sponsor.type === "Not found" ? (
                        <div className="not-found-wrapper">
                          <EVAIcon
                            name="question-mark-circle"
                            className="not-found-icon"
                            size="large"
                          />
                          <span>
                            Structure responsable
                            <br />
                            non-identifiée
                          </span>
                        </div>
                      ) : (
                        <div className="not-exist-wrapper">
                          <EVAIcon
                            name="image-outline"
                            className="not-exist-icon mr-16"
                            size="large"
                            fill={variables.noir}
                          />
                          <span>
                            {sponsor.acronyme || sponsor.nom
                              ? (sponsor.acronyme || "") +
                                (sponsor.acronyme && sponsor.nom ? " - " : "") +
                                (sponsor.nom || "")
                              : sponsor.alt || "Structure 1"}
                          </span>
                        </div>
                      )}
                    </a>
                    {key === 0 && sponsor.type !== "Not found" && (
                      <div className="owner-badge">
                        <EVAIcon name="shield" className="mr-10" />
                        Responsable
                      </div>
                    )}
                    {!disableEdit && (
                      <div
                        className="delete-icon"
                        onClick={() => deleteSponsor(key)}
                      >
                        <Icon
                          name="minus-circle"
                          fill={variables.darkColor}
                          size="xlarge"
                        />
                      </div>
                    )}
                  </div>
                </Col>
              );
            })}

          {!disableEdit && (!sponsors || sponsors.length === 0 || admin) && (
            <Col>
              <div
                className="add-sponsor"
                onClick={() => {
                  this.props.toggleFinalValidation();
                  !sponsors || sponsors.length === 0
                    ? this.toggleModal("responsabilite")
                    : sponsors.length > 0 &&
                      admin &&
                      this.toggleModal("img-modal");
                }}
              >
                <EVAIcon
                  className="add-sign backgroundColor-darkColor"
                  name="plus-outline"
                />
                <span className="add-text color-darkColor">
                  Ajouter une structure
                </span>
              </div>
            </Col>
          )}
        </Row>

        <CustomModal
          showModals={showModals}
          toggleModal={this.toggleModal}
          modal={modal}
          keyValue={0}
          title="Responsabilité du dispositif"
          lowerRightBtn={
            <FButton
              type="dark"
              name="paper-plane-outline"
              fill={variables.noir}
              disabled={
                (!checked || (!user.email && !user.phone)) &&
                !mesStructures.some((x) => x.checked)
              }
              onClick={this.validerRespo}
              className="push-right"
            >
              Valider
            </FButton>
          }
        >
          <p>
            Pour assurer la mise à jour des informations, nous devons relier ce
            dispositif à sa structure d’origine. Merci de la renseigner
            ci-dessous :
          </p>

          {mesStructures.length > 0 &&
            mesStructures.map((struct) => (
              <FormGroup check className="ma-structure mb-10" key={struct._id}>
                <Label check>
                  <Input
                    type="radio"
                    checked={struct.checked}
                    onChange={() => this.handleStructChange(struct._id)}
                  />{" "}
                  <b>Ma structure : </b>
                  {struct.nom}
                </Label>
              </FormGroup>
            ))}

          <SearchBar
            isArray
            structures
            loupe
            className="search-bar inner-addon right-addon"
            placeholder="Rechercher ou créer une structure"
            array={[
              ...structures.filter((x) => x.status === "Actif"),
              { createNew: true },
            ]}
            createNewCta="Créer une nouvelle structure"
            selectItem={this.selectItem}
          />

          <FormGroup check className="case-cochee mt-10">
            <Label check>
              <Input
                type="checkbox"
                checked={checked}
                onChange={this.handleCheckChange}
              />{" "}
              Je ne sais pas quelle est la structure responsable
            </Label>
          </FormGroup>
          {this.state.checked && (
            <>
              <div className="warning-bloc bg-attention mt-10">
                <EVAIcon
                  name="alert-triangle-outline"
                  fill={variables.noir}
                  className="info-icon"
                />
                <b>Structure inconnue</b>
                <p>
                  Pas d’inquiétude, nous allons essayer de trouver ensemble la
                  structure d’origine de ce dispositif. Merci de nous donner au
                  moins un moyen de contact pour que nous échangions ensemble
                  sur l’origine de ce dispositif.
                </p>
              </div>
              <div className="form-field">
                <InputGroup>
                  <EVAIcon
                    className="input-icon"
                    name="at-outline"
                    fill={variables.noir}
                  />
                  <Input
                    id="email"
                    placeholder="Entrez votre email pour que nous puissions vous contacter"
                    value={user.email || ""}
                    onChange={this.handleUserChange}
                    name="user"
                  />
                </InputGroup>
                <InputGroup>
                  <EVAIcon
                    className="input-icon"
                    name="phone-outline"
                    fill={variables.noir}
                  />
                  <Input
                    id="phone"
                    placeholder="Ou votre numéro de téléphone pour un contact plus rapide"
                    value={user.phone || ""}
                    onChange={this.handleUserChange}
                    name="user"
                  />
                </InputGroup>
              </div>
            </>
          )}
        </CustomModal>

        <CustomModal
          showModals={showModals}
          toggleModal={this.toggleModal}
          modal={{ name: "etVous" }}
          keyValue={1}
          title="Et vous ?"
          lowerRightBtn={
            <FButton
              type="dark"
              name="paper-plane-outline"
              fill={variables.noir}
              onClick={this.addSponsor}
              className="push-right"
            >
              Valider
            </FButton>
          }
        >
          <p>
            <span>Faites-vous partie de la structure suivante : </span>
            <EVAIcon
              className="float-right"
              id="alt-tooltip"
              name="info"
              fill={variables.noir}
            />
            <Tooltip
              placement="top"
              isOpen={this.state.tooltipOpen}
              target="alt-tooltip"
              toggle={this.toggleTooltip}
            >
              Si oui, nous enverrons une demande d’ajout à un responsable de la
              structure. Si non, la propriété de la page lui sera transférée
              pour qu’il puisse vérifier les informations.
            </Tooltip>
          </p>

          <div className="selection-wrapper bg-validation mb-10">
            {selected.picture && selected.picture.secure_url && (
              <img
                src={selected.picture.secure_url}
                className="selection-logo mr-10"
                alt="logo de structure"
              />
            )}
            <span>
              {selected.acronyme} - {selected.nom}
            </span>
          </div>

          <FormGroup check className="author-choice mb-10">
            <Label check>
              <Input
                type="checkbox"
                checked={this.state.authorBelongs}
                onChange={this.handleBelongsSChange}
              />{" "}
              <b>Oui !</b>
            </Label>
          </FormGroup>
          <FormGroup check className="author-choice">
            <Label check>
              <Input
                type="checkbox"
                checked={!this.state.authorBelongs}
                onChange={this.handleBelongsSChange}
              />{" "}
              <b>Non et je renonce à mon droit d’édition</b>
            </Label>
          </FormGroup>
        </CustomModal>

        <CustomModal
          showModals={showModals}
          toggleModal={this.toggleModal}
          modal={{ name: "creation" }}
          keyValue={2}
          title="Créer une structure"
          lowerLeftBtn={
            <FButton
              type="outline-black"
              name="search-outline"
              fill={variables.noir}
              onClick={() => this.toggleModal("responsabilite")}
            >
              Rechercher une structure
            </FButton>
          }
          lowerRightBtn={
            <FButton
              type="validate"
              name="plus-circle-outline"
              onClick={this.createStructure}
            >
              Ajouter
            </FButton>
          }
        >
          <CreationContent
            handleChange={this.handleChange}
            handleBelongsChange={this.handleBelongsChange}
            {...this.state.structure}
          />
          <div className="warning-bloc bg-attention">
            <EVAIcon
              name="info-outline"
              fill={variables.noir}
              className="info-icon"
            />
            Notre équipe va vous contacter d’ici 7 jours pour confirmer la
            création. Vous allez recevoir un e-mail de confirmation.&nbsp;
            <b>Bienvenue !</b>
          </div>
        </CustomModal>

        <CustomModal
          showModals={showModals}
          toggleModal={this.toggleModal}
          modal={{ name: "envoye" }}
          keyValue={3}
          title="C’est envoyé !"
          lowerRightBtn={
            <FButton
              type="validate"
              name="checkmark"
              onClick={() => {
                this.toggleModal("envoye");
                if (this.props.finalValidation) {
                  this.props.validate();
                }
              }}
              className="push-right"
            >
              Ok !
            </FButton>
          }
        >
          <div className="envoye-content center-text">
            <img src={sentIllu} className="illu" alt="illustration" />
            {selected.nom ? (
              authorBelongs ? (
                <>
                  <h5 className="mb-10">
                    Votre demande est soumise aux reponsables de :
                  </h5>
                  <div className="selection-wrapper mb-10">
                    {selected.picture && selected.picture.secure_url && (
                      <img
                        src={selected.picture.secure_url}
                        className="selection-logo mr-10"
                        alt="logo de structure"
                      />
                    )}
                    <span>
                      {selected.acronyme} - {selected.nom}
                    </span>
                  </div>
                  <div className="contenu">
                    Vous devriez être ajouté en tant que membre sous 7 jours.
                    <br />
                    N’hésitez pas à les joindre directement si vous les
                    connaissez.
                    <br />
                    <b>Merci infiniment pour votre contribution !</b>
                  </div>
                </>
              ) : (
                <>
                  <h5 className="mb-10">
                    Votre contenu va être transféré à la structure :
                  </h5>
                  <div className="selection-wrapper mb-10">
                    {selected.picture && selected.picture.secure_url && (
                      <img
                        src={selected.picture.secure_url}
                        className="selection-logo mr-10"
                        alt="logo de structure"
                      />
                    )}
                    <span>
                      {selected.acronyme} - {selected.nom}
                    </span>
                  </div>
                  <div className="contenu">
                    Les responsables de la structure vont prendre le relais.
                    <br />
                    N’hésitez pas à les joindre directement si vous les
                    connaissez.
                    <br />
                    <b>Merci infiniment pour votre contribution !</b>
                  </div>
                </>
              )
            ) : (
              <>
                <h5 className="mb-10">
                  Votre structure est en cours de création
                </h5>
                <div className="contenu mb-10">
                  <b>
                    L’équipe Agi’r va prendre contact avec vous sous 7 jours
                    pour vérifier vos informations.
                  </b>
                </div>
                <div className="contenu">
                  <b>Merci de rejoindre l’aventure !</b>
                </div>
              </>
            )}
          </div>
        </CustomModal>

        <ImgModal
          modal={{ name: "img-modal" }}
          keyValue={4}
          showModals={showModals}
          imgData={this.state.imgData}
          link={this.state.link}
          alt={this.state.alt}
          sponsorLoading={this.state.sponsorLoading}
          toggleModal={this.toggleModal}
          toggleTooltip={this.toggleTooltip}
          handleFileInputChange={this.handleFileInputChange}
          handleChange={this.handleImgChange}
          addSponsor={this.addSponsor}
        />
      </div>
    );
  }
}

const CustomModal = (props) => (
  <Modal
    isOpen={props.showModals[props.keyValue].show}
    toggle={() => props.toggleModal(props.modal.name)}
    className="modal-structure"
    key={props.keyValue}
  >
    <ModalBody>
      <h3>{props.title}</h3>
      {props.children}
    </ModalBody>
    <ModalFooter>
      {props.lowerLeftBtn}
      {props.lowerRightBtn}
    </ModalFooter>
  </Modal>
);

const ImgModal = (props) => (
  <Modal
    isOpen={props.showModals[props.keyValue].show}
    toggle={() => props.toggleModal(props.modal.name)}
    className="modal-sponsors"
  >
    <div className="form-field inline-div">
      <span>
        1. Choix de l’image<sup>*</sup>
      </span>
      {props.imgData.src ? (
        <div className="image-wrapper">
          <Input
            className="file-input"
            type="file"
            id="picture"
            name="user"
            accept="image/*"
            onChange={props.handleFileInputChange}
          />
          <img
            className="sponsor-img"
            src={props.imgData.src}
            alt={props.imgData.alt}
          />
          {props.sponsorLoading && <Spinner color="green" />}
        </div>
      ) : (
        <FButton className="upload-btn" type="theme" name="upload-outline">
          <Input
            className="file-input"
            type="file"
            id="picture"
            name="user"
            accept="image/*"
            onChange={props.handleFileInputChange}
          />
          <span>Choisir</span>
          {props.sponsorLoading && <Spinner color="green" className="ml-10" />}
        </FButton>
      )}
    </div>
    <div className="form-field">
      <span>
        2. Lien vers le site de la structure<sup>*</sup>
      </span>
      <InputGroup>
        <EVAIcon
          className="input-icon"
          name="link-outline"
          fill={variables.noir}
        />
        <Input
          id="link"
          placeholder="https://www.agi-r.fr"
          value={props.link}
          onChange={props.handleChange}
        />
      </InputGroup>
    </div>
    <div className="form-field">
      <span>
        3. Texte alternatif à l’image<sup>*</sup>
        <EVAIcon
          className="float-right"
          id="alt-tooltip"
          name="info"
          fill={variables.noir}
        />
        <Tooltip
          placement="top"
          isOpen={props.tooltipOpen}
          target="alt-tooltip"
          toggle={props.toggleTooltip}
        >
          Ce texte est utile pour les personnes malvoyantes ou en cas de
          non-chargement de l’image.
        </Tooltip>
      </span>
      <InputGroup>
        <EVAIcon
          className="input-icon"
          name="eye-off-outline"
          fill={variables.noir}
        />
        <Input
          id="alt"
          placeholder="Agi’r"
          value={props.alt}
          onChange={props.handleChange}
        />
      </InputGroup>
    </div>
    <div className="btn-footer">
      <FButton onClick={props.toggleModal} type="default" className="mr-10">
        Annuler
      </FButton>
      <FButton
        onClick={() => props.addSponsor(true)}
        type="validate"
        name="checkmark-circle-2-outline"
      >
        Valider
      </FButton>
    </div>
  </Modal>
);

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
    hasStructure: state.user.hasStructure,
    structures: state.structure.structures,
  };
};

const mapDispatchToProps = { updateUserActionCreator };

export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(Sponsors);
