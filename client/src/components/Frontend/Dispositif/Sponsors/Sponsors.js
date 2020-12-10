import React, { Component } from "react";
import {
  Row,
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
import { connect } from "react-redux";
import Swal from "sweetalert2";

import API from "utils/API.js";
import EVAIcon from "../../../UI/EVAIcon/EVAIcon";
import FButton from "../../../FigmaUI/FButton/FButton";
import FInput from "../../../FigmaUI/FInput/FInput";
import SearchBar from "../../../../containers/UI/SearchBar/SearchBar";
import { sentIllu } from "../../../../assets/figma/index";
import CreationContent from "../CreationContent/CreationContent";
import { updateUserActionCreator } from "../../../../services/User/user.actions";
import _ from "lodash";
import "./Sponsors.scss";
import variables from "scss/colors.scss";
import styled from "styled-components";

const SponsorContainer = styled.div`
  padding: 0px 0px 0px 16px;
  border-left: ${(props) => (props.left ? "2px solid #FFFFFF" : null)};
`;
const SponsorListContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const SectionTitle = styled.p`
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  color: #ffffff;
`;

const SponsorTitle = styled.p`
  font-weight: bold;
  font-size: 18px;
  color: #212121;
  text-align: center;
`;

const ImageLink = styled.a`
  background-color: white;
  width: 166px;
  height: 116px;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  display: flex;
`;

const DeleteButtonFull = styled.div`
  background: #f44336;
  border-radius: 12px;
  width: 139px;
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  cursor: pointer;
`;

const DeleteButtonFullText = styled.div`
  font-weight: bold;
  font-size: 16px;
  color: #ffffff;
`;
const EditText = styled.p`
  font-weight: bold;
  font-size: 16px;
  color: #212121;
  text-align: center;
  margin-bottom: 0px;
`;
const EditButton = styled.div`
  background: #f9ef99;
  border-radius: 12px;
  width: 105px;
  height: 50px;
  padding: 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-right: 8px;
  cursor: pointer;
`;

const DeleteButtonSmall = styled.div`
  background: #f44336;
  border-radius: 12px;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const AddSponsorTitle = styled.p`
  font-weight: bold;
  font-size: 22px;
  color: #212121;
  line-height: 28px;
`;
const AddSponsorDescription = styled.p`
  font-weight: normal;
  font-size: 16px;
  color: #212121;
  line-height: 20px;
`;

const SponsorCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  margin-right: 16px;

  width: 214px;
  height: ${(props) => (props.disableEdit ? "303px" : "345px")};

  /* Noir/Blanc */

  background: ${(props) => (props.add ? "#F9EF99" : "#eaeaea")};
  border-radius: 12px;
  cursor: ${(props) =>
    (props.add || props.disableEdit) && !props.nolink ? "pointer" : "auto"};
  &:hover {
    border: ${(props) => (props.add ? "2px solid #212121" : "none")};
  }
`;

const burl =
  process.env.REACT_APP_ENV === "development"
    ? "http://localhost:3000/"
    : process.env.REACT_APP_ENV === "staging"
    ? "https://staging.refugies.info/"
    : "https://www.refugies.info/";

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
    banner: true,
    authorBelongs: false,
    tooltipOpen: false,
    selected: {},
    mesStructures: [],
    imgData: {},
    link: "",
    nom: "",
    sponsorLoading: false,
    edit: false,
    sponsorKey: null,

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
    if (nextProps.user && nextProps.userStructure) {
      const structure = nextProps.userStructure;

      this.setState({ mesStructures: [structure] });
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
      nom: "",
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
        "picture",
      ];
    fields.forEach((x) =>
      this.state.structure[x] !== ""
        ? (structure[x] = this.state.structure[x])
        : false
    );
    if (this.state.imgData) {
      structure.picture = this.state.imgData;
    }
    API.create_structure(structure).then((data) => {
      this.props.addMainSponsor(data.data.data);
      this.toggleModal("envoye");
    });
  };

  validerRespo = () => {
    if (this.state.checked) {
      let user = { ...this.props.user };
      let userInfo = { _id: user._id, email: user.email, phone: user.phone };
      this.props.addMainSponsor(
        { type: "Not found", user: { ...userInfo, username: user.username } },
        false
      );
      this.toggleModal();
      API.set_user_info(userInfo);
    } else if (this.state.mesStructures.some((x) => x.checked)) {
      this.props.addMainSponsor(
        this.state.mesStructures.find((x) => x.checked)
      );
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
          nom: this.state.nom,
          asAdmin,
        });
        this.toggleModal();
        this.props.validate();
      } else {
        this.props.addSponsor({
          ...this.state.selected,
          picture: { ...this.state.imgData },
          link: this.state.link,
          nom: this.state.nom,
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
          nom: this.state.nom,
          asAdmin,
        });
        this.toggleModal();
      }
    }
    this.setState({ imgData: {} });
  };

  editSponsor = (key) => {
    this.toggleModal();
    this.setState({ edit: false });
    var sponsor = {
      ...this.state.selected,
      picture: { ...this.state.imgData },
      link: this.state.link,
      nom: this.state.nom,
    };
    this.props.editSponsor(key, sponsor);
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
      sponsors,
      mainSponsor,
      deleteSponsor,
      deleteMainSponsor,
      user,
    } = this.props;
    const {
      showModals,
      selected,
      authorBelongs,
      checked,
      mesStructures,
    } = this.state;

    const sponsorsWithoutPicture = sponsors.filter(
      (sponsor) => !sponsor.picture && !sponsor._id
    );
    const sponsorsWithPicture = sponsors.filter(
      (sponsor) => !!sponsor.picture && !sponsor._id
    );
    const deduplicatedSponsors = sponsorsWithoutPicture.concat(
      _.uniqBy(sponsorsWithPicture, (sponsor) => sponsor.nom)
    );
    const modal = { name: "responsabilite" };
    const structuresArray = this.props.structures
      ? this.props.structures.concat([{ createNew: true }])
      : [{ createNew: true }];
    return (
      <div
        className="sponsor-footer backgroundColor-darkColor"
        onMouseEnter={() => this.props.updateUIArray(-7)}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: "25px",
          }}
        >
          <h5 className="">{"Proposé par"}</h5>
          {!disableEdit && this.props.displayTuto && (
            <FButton
              type="tuto"
              name={"play-circle-outline"}
              onClick={() => this.props.toggleTutorielModal("Sponsors")}
            >
              Tutoriel
            </FButton>
          )}
        </div>
        <Row className="sponsor-images">
          <SponsorContainer>
            {deduplicatedSponsors.length !== 0 || !disableEdit ? (
              <SectionTitle>Responsable</SectionTitle>
            ) : null}
            {mainSponsor._id ? (
              <SponsorCard disableEdit={disableEdit}>
                <ImageLink
                  href={`${burl}annuaire/${mainSponsor._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    className="sponsor-img"
                    src={(mainSponsor.picture || {}).secure_url}
                    alt={mainSponsor.acronyme}
                  />
                </ImageLink>
                <SponsorTitle>{mainSponsor.nom}</SponsorTitle>
                {!disableEdit ? (
                  <DeleteButtonFull onClick={() => deleteMainSponsor()}>
                    <EVAIcon
                      name="trash-2-outline"
                      size="large"
                      fill={variables.blanc}
                    />
                    <DeleteButtonFullText>Supprimer</DeleteButtonFullText>
                  </DeleteButtonFull>
                ) : null}
              </SponsorCard>
            ) : !disableEdit ? (
              <SponsorCard
                onClick={() => {
                  this.props.toggleFinalValidation();
                  this.toggleModal("responsabilite");
                }}
                add
                disableEdit={disableEdit}
              >
                <AddSponsorTitle>
                  Choisir la structure responsable
                </AddSponsorTitle>
                <AddSponsorDescription>
                  Pour assurer la mise à jour des informations, nous devons
                  relier votre fiche à la structure responsable du dispositif.
                </AddSponsorDescription>
              </SponsorCard>
            ) : null}
          </SponsorContainer>
          {sponsors && deduplicatedSponsors.length > 0 ? (
            <SponsorContainer left>
              <SectionTitle>Partenaires</SectionTitle>
              <SponsorListContainer>
                {deduplicatedSponsors.length === 1 && !disableEdit ? (
                  <SponsorCard
                    onClick={() => {
                      this.props.toggleFinalValidation();
                      this.toggleModal("img-modal");
                      this.setState({
                        picture: {},
                        link: "",
                        nom: "",
                      });
                    }}
                    add
                    disableEdit={disableEdit}
                  >
                    <AddSponsorTitle>
                      Ajouter une structure partenaire
                    </AddSponsorTitle>
                    <AddSponsorDescription>
                      Ces structures ne peuvent pas éditer la fiche mais sont
                      ainsi visible dans le cas d’un partenariat ou d’une
                      co-animation.
                    </AddSponsorDescription>
                  </SponsorCard>
                ) : null}
                {deduplicatedSponsors.map((sponsor, key) => {
                  return (
                    <SponsorCard
                      nolink={!sponsor.link}
                      disableEdit={disableEdit}
                      key={key}
                    >
                      {sponsor.link ? (
                        <ImageLink
                          href={
                            ((sponsor.link || "").includes("http")
                              ? ""
                              : "http://") + sponsor.link
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            className="sponsor-img"
                            src={sponsor.picture.secure_url}
                            alt={sponsor.alt}
                          />
                        </ImageLink>
                      ) : (
                        <ImageLink>
                          <img
                            className="sponsor-img"
                            src={sponsor.picture.secure_url}
                            alt={sponsor.alt}
                          />
                        </ImageLink>
                      )}
                      <SponsorTitle>{sponsor.nom}</SponsorTitle>
                      {!disableEdit ? (
                        <SponsorListContainer>
                          <EditButton
                            onClick={() => {
                              this.setState(
                                {
                                  imgData: sponsor.picture || {},
                                  link: sponsor.link || "",
                                  nom: sponsor.nom || "",
                                  edit: true,
                                  sponsorKey: key,
                                },
                                () => {
                                  this.props.toggleFinalValidation();
                                  this.toggleModal("img-modal");
                                }
                              );
                            }}
                          >
                            <EVAIcon
                              name="edit-outline"
                              size="large"
                              fill={variables.noir}
                            />
                            <EditText>Editer</EditText>
                          </EditButton>
                          <DeleteButtonSmall onClick={() => deleteSponsor(key)}>
                            <EVAIcon
                              name="trash-2-outline"
                              size="large"
                              fill={variables.blanc}
                            />
                          </DeleteButtonSmall>
                        </SponsorListContainer>
                      ) : null}
                    </SponsorCard>
                    /*                   <Col key={key} className="sponsor-col">
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
                          <NoSponsorImage
                            nom={sponsor.nom}
                            acronyme={sponsor.acronyme}
                            alt={sponsor.alt}
                          />
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
                  </Col> */
                  );
                })}
              </SponsorListContainer>
            </SponsorContainer>
          ) : !disableEdit ? (
            <SponsorContainer left>
              <SectionTitle>Partenaires</SectionTitle>
              <SponsorListContainer>
                <SponsorCard
                  onClick={() => {
                    this.props.toggleFinalValidation();
                    this.toggleModal("img-modal");
                    this.setState({
                      picture: {},
                      link: "",
                      nom: "",
                    });
                  }}
                  add
                  disableEdit={disableEdit}
                >
                  <AddSponsorTitle>
                    Ajouter une structure partenaire
                  </AddSponsorTitle>
                  <AddSponsorDescription>
                    Ces structures ne peuvent pas éditer la fiche mais sont
                    ainsi visible dans le cas d’un partenariat ou d’une
                    co-animation.
                  </AddSponsorDescription>
                </SponsorCard>
              </SponsorListContainer>
            </SponsorContainer>
          ) : null}
          {/* {!disableEdit && (
            <Col>
              <div
                className="add-sponsor"
                onClick={() => {
                  this.props.toggleFinalValidation();
                  !sponsors || sponsors.length === 0
                    ? this.toggleModal("responsabilite")
                    : sponsors.length > 0 && this.toggleModal("img-modal");
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
          )} */}
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
          {this.state.banner ? (
            <div className="warning-bloc bg-focus mt-16 mb-8">
              <EVAIcon
                name="info"
                fill={variables.blanc}
                className="info-icon"
              />
              <div
                onClick={() => this.setState({ banner: false })}
                className={"info-icon-close"}
              >
                <EVAIcon name="close-outline" fill={variables.blanc} />
              </div>
              <p style={{ marginBottom: 0 }}>
                Pour que la fiche soit correctement mise à jour au fil du temps,
                nous allons la connecter à sa structure légale. Cherchez la
                structure dans la barre de recherche ci-dessous, ou créez-en une
                nouvelle si elle n’est pas présente dans la base de donnée.
              </p>
            </div>
          ) : (
            <div style={{ marginTop: 24 }} />
          )}

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
            array={structuresArray}
            createNewCta="Créer une nouvelle structure"
            selectItem={this.selectItem}
          />

          {/* <FormGroup check className="case-cochee mt-10">
            <Label check>
              <Input
                type="checkbox"
                checked={checked}
                onChange={this.handleCheckChange}
              />{" "}
              Je ne sais pas quelle est la structure responsable
            </Label>
          </FormGroup> */}
          {/*           {this.state.checked && (
            <>
              <div className="warning-bloc bg-attention mt-10">
                <EVAIcon
                  name="alert-triangle-outline"
                  fill={variables.noir}
                  className="info-icon"
                />
                <b>Structure inconnue</b>
                <p>
                  Pour que la fiche soit correctement mise à jour au fil du
                  temps, nous allons la connecter à sa structure légale.
                  Cherchez la structure dans la barre de recherche ci-dessous,
                  ou créez-en une nouvelle si elle n’est pas présente dans la
                  base de donnée.
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
          )} */}
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
              onClick={() => this.props.addMainSponsor(this.state.selected)}
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
          className="modal-sponsors"
          title="Créer une structure"
        >
          <CreationContent
            handleChange={this.handleChange}
            handleBelongsChange={this.handleBelongsChange}
            {...this.state.structure}
          />
          <div className="form-field inline-div">
            <span style={{ fontSize: 22 }}>Ajouter un logo</span>
            {this.state.imgData.secure_url ? (
              <div className="image-wrapper">
                <img
                  className="sponsor-img"
                  src={this.state.imgData.secure_url}
                  alt={this.state.imgData.alt}
                />
                <FButton
                  className="upload-btn"
                  type="theme"
                  name="upload-outline"
                >
                  <Input
                    className="file-input"
                    type="file"
                    id="picture"
                    name="user"
                    accept="image/*"
                    onChange={this.handleFileInputChange}
                  />
                  <span>Choisir</span>
                  {this.state.sponsorLoading && (
                    <Spinner size="sm" color="green" className="ml-10" />
                  )}
                </FButton>
              </div>
            ) : (
              <FButton
                className="upload-btn"
                type="theme"
                name="upload-outline"
              >
                <Input
                  className="file-input"
                  type="file"
                  id="picture"
                  name="user"
                  accept="image/*"
                  onChange={this.handleFileInputChange}
                />
                <span>Choisir</span>
                {this.state.sponsorLoading && (
                  <Spinner size="sm" color="green" className="ml-10" />
                )}
              </FButton>
            )}
          </div>
          <div className="btn-footer">
            <FButton onClick={this.toggleModal} type="default" className="mr-8">
              Annuler
            </FButton>
            <FButton
              disabled={
                !this.state.structure.nom ||
                !this.state.structure.contact ||
                !this.state.structure.mail_contact ||
                !this.state.structure.phone_contact
              }
              onClick={this.createStructure}
              type="validate"
              name="checkmark-outline"
            >
              Valider
            </FButton>
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
                    L’équipe Réfugiés.info va prendre contact avec vous sous 7
                    jours pour vérifier vos informations.
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
          nom={this.state.nom}
          sponsorLoading={this.state.sponsorLoading}
          toggleModal={this.toggleModal}
          toggleTooltip={this.toggleTooltip}
          handleFileInputChange={this.handleFileInputChange}
          handleChange={this.handleImgChange}
          addSponsor={this.addSponsor}
          tooltipOpen={this.state.tooltipOpen}
          edit={this.state.edit}
          editSponsor={this.editSponsor}
          sponsorKey={this.state.sponsorKey}
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
      <span>Ajouter un logo</span>
      {props.imgData.secure_url ? (
        <div className="image-wrapper">
          <img
            className="sponsor-img"
            src={props.imgData.secure_url}
            alt={props.imgData.alt}
          />
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
            {props.sponsorLoading && (
              <Spinner size="sm" color="green" className="ml-10" />
            )}
          </FButton>
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
          {props.sponsorLoading && (
            <Spinner size="sm" color="green" className="ml-10" />
          )}
        </FButton>
      )}
    </div>
    <div className="form-field">
      <span>Entrez le nom de la structure partenaire</span>
      <InputGroup>
        <EVAIcon
          className="input-icon"
          name="briefcase-outline"
          fill={variables.noir}
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
    <div className="form-field">
      <div
        style={{
          display: "flex",
          justifyContent: "row",
          alignItems: "center",
        }}
      >
        <span>Collez un lien vers le site de la structure</span>
      </div>
      <InputGroup>
        <EVAIcon
          className="input-icon"
          name="link-outline"
          fill={variables.noir}
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
    <div className="btn-footer">
      <FButton onClick={props.toggleModal} type="default" className="mr-8">
        Annuler
      </FButton>
      <FButton
        onClick={() =>
          props.edit
            ? props.editSponsor(props.sponsorKey)
            : props.addSponsor(true)
        }
        type="validate"
        name="checkmark-outline"
      >
        Valider
      </FButton>
    </div>
  </Modal>
);

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
    userStructure: state.userStructure,
    structures: state.structures,
  };
};

const mapDispatchToProps = {
  updateUserActionCreator,
};

export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(Sponsors);
