import React, { Component } from "react";
import { Row, Input, FormGroup, Label, Spinner } from "reactstrap";
import { connect } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";
import styled from "styled-components";
import { isMobile } from "react-device-detect";
import isEmpty from "lodash/isEmpty";
import uniqBy from "lodash/uniqBy";
import API from "utils/API";
import { getPath } from "routes";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import FButton from "components/UI/FButton/FButton";
import SearchBar from "components/UI/SearchBar/SearchBar";
import { structure_definie } from "assets/figma/index";
import CreationContent from "../CreationContent/CreationContent";
import { updateUserActionCreator } from "services/User/user.actions";
import { fetchActiveStructuresActionCreator } from "services/ActiveStructures/activeStructures.actions";
import { colors } from "colors";
import { SponsorSection } from "./SponsorSection/SponsorSection";
import CustomModal from "./CustomModal";
import ImgModal from "./ImgModal";
import styles from "./Sponsors.module.scss";
import { getBaseUrl } from "lib/getBaseUrl";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { Structure, User, Picture, Theme } from "types/interface";
import { RootState } from "services/rootReducer";
import { UiElementNodes } from "services/SelectedDispositif/selectedDispositif.reducer";
import { isValidPhone } from "lib/validateFields";
import { cls } from "lib/classname";
import mobile from "scss/components/mobile.module.scss";

const SponsorContainer = styled.div`
  padding: 0px 0px 0px 16px;
  width: auto !important;
  border-left: ${(props: { left?: boolean }) => (props.left ? "2px solid #FFFFFF" : null)};
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

const ConfirmationStructureContainer = styled.div`
  align-items: center;
  background-color: #ffe2b8;
  padding: 20px;
  border-radius: 12px;
  width: -webkit-fill-available;
  margin-top: 16px;
  margin-bottom: 16px;
`;

const MyStructureContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #bdf0c7;
  border-radius: 12px;
  padding: 18px;
  color: black;
  border: 0.5px solid #4caf50;
  margin-bottom: 10px;
`;

const ImageLink = styled.a`
  background-color: white;
  width: 166px;
  height: 116px;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  display: flex;
  position: relative;
`;
const ConfirmationStructureTitleContainer = styled.div`
  font-weight: bold;
  font-size: 22px;
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

const burl = getBaseUrl();

interface State {
  showModals: { name: string; show: boolean }[];
  checked: boolean;
  banner: boolean;
  authorBelongs: boolean;
  tooltipOpen: boolean;
  selected: Partial<Structure> | null;
  mesStructures: (Structure & { checked: boolean })[];
  imgData: Picture | null;
  link: string;
  nom: string;
  sponsorLoading: boolean;
  edit: boolean;
  sponsorKey: string;
  isMyStructureSelected: boolean;
  structure: {
    nom: string;
    acronyme: string;
    link: string;
    contact: string;
    mail_contact: string;
    phone_contact: string;
    authorBelongs: boolean;
  };
  phoneError: boolean;
  activeIndex: number;
  animating: boolean;
}

interface Props {
  sponsors: Structure[];
  mainSponsor: Structure | undefined;
  disableEdit: boolean;
  addSponsor: (param: Partial<Structure>) => void;
  deleteSponsor: (key: number) => void;
  addMainSponsor: (param: any) => void;
  deleteMainSponsor: () => void;
  editSponsor: (key: number, edit: Partial<Structure>) => void;
  admin: boolean;
  validate: () => void;
  finalValidation: boolean;
  toggleFinalValidation: () => void;
  toggleTutorielModal: (section: string) => void;
  displayTuto: boolean;
  updateUIArray: (key: number, subkey?: number | null, node?: UiElementNodes, value?: boolean) => void;
  typeContenu?: "dispositif" | "demarche";
  toggleDispositifValidateModal: () => void;
  mainTheme: Theme;
  locale: string | undefined;

  user: User;
  userStructure: Structure;
  structures: Structure[];
  isLoadingStructures: boolean;
  updateUserActionCreator: any;
  fetchActiveStructuresActionCreator: any;
}

const emptyStructure = {
  nom: "",
  acronyme: "",
  link: "",
  contact: "",
  mail_contact: "",
  phone_contact: "",
  authorBelongs: false
};

class Sponsors extends Component<Props, State> {
  state: State = {
    showModals: [
      { name: "responsabilite", show: false },
      { name: "etVous", show: false },
      { name: "creation", show: false },
      { name: "envoye", show: false },
      { name: "img-modal", show: false }
    ],
    checked: false,
    banner: true,
    authorBelongs: false,
    tooltipOpen: false,
    selected: null,
    mesStructures: [],
    imgData: null,
    link: "",
    nom: "",
    sponsorLoading: false,
    edit: false,
    sponsorKey: "",
    isMyStructureSelected: false,
    structure: emptyStructure,
    phoneError: false,
    activeIndex: 0,
    animating: false
  };

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (
      prevProps.disableEdit &&
      !this.props.disableEdit &&
      this.props.structures.length === 0 &&
      !this.props.isLoadingStructures
    ) {
      this.props.fetchActiveStructuresActionCreator();
    }

    if (prevProps.mainSponsor && !this.props.mainSponsor) {
      // sponsor deleted
      this.setState({ structure: emptyStructure });
    }

    if (prevState.structure.phone_contact !== this.state.structure.phone_contact) {
      // check phone format
      const phone = this.state.structure.phone_contact;
      this.setState({
        phoneError: !(phone === "" || isValidPhone(phone))
      });
    }
  }

  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.user && nextProps.userStructure) {
      const structure = { ...nextProps.userStructure, checked: false };
      this.setState({ mesStructures: [structure] });
    }
  }
  resetImg = () => {
    this.setState({ imgData: null });
  };
  toggleModal = (name?: string) =>
    this.setState((pS) => ({
      showModals: pS.showModals.map((x) => ({
        ...x,
        show: x.name === name ? !x.show : false
      }))
    }));
  toggleTooltip = () => this.setState((pS) => ({ tooltipOpen: !pS.tooltipOpen }));
  toggleIsMyStructureSelected = () => {
    this.setState({ isMyStructureSelected: !this.state.isMyStructureSelected });
  };
  handleFileInputChange = (event: any) => {
    this.setState({ sponsorLoading: true });
    const formData = new FormData();
    formData.append("0", event.target.files[0]);

    API.set_image(formData).then((data_res) => {
      const imgData = data_res.data.data;
      this.setState({
        imgData: {
          secure_url: imgData.secure_url,
          public_id: imgData.public_id,
          imgId: imgData.imgId
        },
        sponsorLoading: false
      });
    });
  };

  handleImgChange = (ev: any) => {
    //@ts-ignore
    this.setState({ [ev.currentTarget.id]: ev.target.value });
  };

  handleChange = (ev: any) =>
    this.setState({
      structure: {
        ...this.state.structure,
        [ev.currentTarget.id]: ev.target.value
      }
    });

  handleChangeValueEntered = (newValue: string) => {
    this.setState({
      structure: {
        ...this.state.structure,
        nom: newValue
      }
    });
  };
  handleUserChange = (e: any) =>
    this.props.updateUserActionCreator({
      ...this.props.user,
      [e.target.id]: e.target.value
    });

  handleBelongsSChange = () => this.setState((pS) => ({ authorBelongs: !pS.authorBelongs }));
  handleStructChange = (id: string) =>
    this.setState((pS) => ({
      mesStructures: pS.mesStructures.map((x) => ({
        ...x,
        checked: x._id.toString() === id ? !x.checked : false
      })),
      checked: false
    }));

  selectItem = (suggestion: Partial<Structure>) => {
    this.setState({ selected: suggestion });
    this.setState({
      imgData: suggestion.picture || null,
      link: suggestion.link || "",
      nom: ""
    });
    //@ts-ignore
    this.toggleModal(suggestion.createNew ? "creation" : "etVous");
  };

  createStructure = () => {
    if (
      !this.state.structure.nom ||
      !this.state.structure.contact ||
      (!this.state.structure.mail_contact && !this.state.structure.phone_contact)
    ) {
      Swal.fire({
        title: "Oh non!",
        text: "Certaines informations sont manquantes",
        icon: "error",
        timer: 1500
      });
      return;
    }
    let newStructure: Partial<Structure> = {
      nom: "",
      acronyme: "",
      link: "",
      contact: "",
      mail_contact: "",
      phone_contact: "",
      authorBelongs: false
    };
    Object.keys(newStructure).forEach((x) => {
      //@ts-ignore
      if (!!this.state.structure[x]) newStructure[x] = this.state.structure[x];
    });
    if (this.state.imgData) {
      newStructure.picture = this.state.imgData;
    }
    API.createStructure({ query: newStructure }).then((data) => {
      this.props.addMainSponsor(data.data.data);
      this.toggleModal("envoye");
    });
    this.setState({ imgData: null });
  };

  validerRespo = () => {
    if (this.state.checked) {
      let user = { ...this.props.user };
      let userInfo = { _id: user._id, email: user.email, phone: user.phone };
      this.props.addMainSponsor({ type: "Not found", user: { ...userInfo, username: user.username } });
      this.toggleModal();
      API.set_user_info(userInfo);
    } else if (this.state.mesStructures.some((x) => x.checked)) {
      this.props.addMainSponsor(this.state.mesStructures.find((x) => x.checked));
      this.toggleModal();
    }
    if (this.props.finalValidation) {
      this.props.validate();
    }
  };

  addSponsor = () => {
    if (isEmpty(this.props.sponsors) && this.props.finalValidation) {
      this.props.addSponsor({
        picture: this.state.imgData ? { ...this.state.imgData } : null,
        link: this.state.link,
        nom: this.state.nom
      });
      this.toggleModal();
      this.props.validate();
    } else {
      this.props.addSponsor({
        picture: this.state.imgData ? { ...this.state.imgData } : null,
        link: this.state.link,
        nom: this.state.nom
      });
      this.toggleModal();
    }
    this.setState({ imgData: null });
  };

  setStructureContactAsMe = () => {
    if (this.props.user) {
      this.setState({
        structure: {
          ...this.state.structure,
          contact: this.props.user.username,
          phone_contact: this.props.user.phone || "",
          mail_contact: this.props.user.email || ""
        }
      });
    }
  };

  editSponsor = (key: number) => {
    this.toggleModal();
    this.setState({ edit: false });
    var sponsor: Partial<Structure> = {
      picture: this.state.imgData ? { ...this.state.imgData } : null,
      link: this.state.link,
      nom: this.state.nom
    };
    this.props.editSponsor(key, sponsor);
  };

  createCarouselObject = (mainSponsor: Structure | undefined, deduplicatedSponsors: Structure[]) => {
    var allSponsor = [{ type: "mainSponsor", object: mainSponsor }];
    deduplicatedSponsors.map((item) => {
      allSponsor.push({ type: "deduplicatedSponsors", object: item });
    });
    return allSponsor;
  };

  upcoming = () =>
    Swal.fire({
      title: "Oh non!",
      text: "Cette fonctionnalité n'est pas encore disponible",
      icon: "error",
      timer: 1500
    });

  render() {
    const { disableEdit, sponsors, mainSponsor, deleteSponsor, deleteMainSponsor, user } = this.props;

    const { showModals, selected, authorBelongs, checked, mesStructures, isMyStructureSelected } = this.state;
    const sponsorsWithoutPicture = sponsors.filter((sponsor) => !sponsor.picture && !sponsor._id);
    const sponsorsWithPicture = sponsors.filter((sponsor) => !!sponsor.picture && !sponsor._id);
    const deduplicatedSponsors = sponsorsWithoutPicture.concat(uniqBy(sponsorsWithPicture, (sponsor) => sponsor.nom));
    const modal = { name: "responsabilite" };
    const structuresArray = this.props.structures ? this.props.structures : [{ createNew: true }];
    const totalSponsor = this.createCarouselObject(mainSponsor, deduplicatedSponsors);
    const isRTL = ["ar", "ps", "fa"].includes(this.props.locale || "fr");
    return (
      <div
        className={styles.container}
        onMouseEnter={() => this.props.updateUIArray(-7)}
        style={{ backgroundColor: this.props.mainTheme.colors.color100 }}
      >
        <div className={styles.wrapper}>
          <div className={styles.title}>{"Proposé par"}</div>
          {!disableEdit && this.props.displayTuto && this.props.typeContenu === "dispositif" && (
            <FButton type="tuto" name="play-circle-outline" onClick={() => this.props.toggleTutorielModal("Sponsors")}>
              Tutoriel
            </FButton>
          )}
        </div>
        {totalSponsor.length > 1 && (
          <div className={cls(mobile.visible_flex, styles.mobile_section)}>
            {totalSponsor.map((sponsor, index) => {
              return (
                <SponsorSection
                  totalNumberOfSponsor={totalSponsor.length}
                  index={index}
                  key={index}
                  sponsor={sponsor}
                  burl={burl}
                  isRTL={isRTL}
                />
              );
            })}
          </div>
        )}
        {(!isMobile || totalSponsor.length === 1) && (
          <Row>
            <SponsorContainer>
              {deduplicatedSponsors.length !== 0 || !disableEdit ? <SectionTitle>Responsable</SectionTitle> : null}
              {mainSponsor && mainSponsor._id ? (
                <div className={cls(styles.sponsor_card, disableEdit && styles.no_edit)}>
                  <Link
                    legacyBehavior
                    href={{
                      pathname: getPath("/annuaire/[id]", this.props.locale),
                      query: { id: mainSponsor._id.toString() }
                    }}
                    passHref
                    prefetch={false}
                  >
                    <ImageLink target="_blank" rel="noopener noreferrer">
                      {mainSponsor?.picture?.secure_url && (
                        <Image
                          className={styles.sponsor_img}
                          src={mainSponsor.picture.secure_url}
                          alt={mainSponsor.nom}
                          width={160}
                          height={110}
                          style={{ objectFit: "contain" }}
                        />
                      )}
                    </ImageLink>
                  </Link>
                  <SponsorTitle>{mainSponsor.nom}</SponsorTitle>
                  {!disableEdit ? (
                    <DeleteButtonFull onClick={() => deleteMainSponsor()}>
                      <EVAIcon name="trash-2-outline" size="large" fill={colors.gray10} />
                      <DeleteButtonFullText>Supprimer</DeleteButtonFullText>
                    </DeleteButtonFull>
                  ) : null}
                </div>
              ) : !disableEdit ? (
                <div
                  className={cls(styles.sponsor_card, disableEdit && styles.no_edit, styles.add)}
                  onClick={() => {
                    this.props.toggleFinalValidation();
                    this.toggleModal("responsabilite");
                  }}
                >
                  <AddSponsorTitle>Choisir la structure responsable</AddSponsorTitle>
                  <AddSponsorDescription>
                    Pour assurer la mise à jour des informations, nous devons relier votre fiche à la structure
                    responsable du dispositif.
                  </AddSponsorDescription>
                </div>
              ) : null}
            </SponsorContainer>
            {sponsors && deduplicatedSponsors.length > 0 ? (
              <SponsorContainer left>
                <SectionTitle>Partenaires</SectionTitle>
                <SponsorListContainer>
                  {deduplicatedSponsors.length === 1 && !disableEdit ? (
                    <div
                      className={cls(styles.sponsor_card, disableEdit && styles.no_edit, styles.add)}
                      onClick={() => {
                        this.props.toggleFinalValidation();
                        this.toggleModal("img-modal");
                        this.setState({
                          link: "",
                          nom: ""
                        });
                      }}
                    >
                      <AddSponsorTitle>Ajouter une structure partenaire</AddSponsorTitle>
                      <AddSponsorDescription>
                        Ces structures ne peuvent pas éditer la fiche mais sont ainsi visible dans le cas d’un
                        partenariat ou d’une co-animation.
                      </AddSponsorDescription>
                    </div>
                  ) : null}
                  {deduplicatedSponsors.map((sponsor, key) => {
                    return (
                      <div
                        className={cls(
                          styles.sponsor_card,
                          disableEdit && styles.no_edit,
                          !sponsor.link && styles.nolink
                        )}
                        key={key}
                      >
                        {sponsor.link && sponsor.picture && sponsor.picture.secure_url ? (
                          <ImageLink
                            href={((sponsor.link || "").includes("http") ? "" : "http://") + sponsor.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Image
                              className={styles.sponsor_img}
                              src={sponsor.picture.secure_url}
                              alt={sponsor.nom}
                              width={160}
                              height={110}
                              style={{ objectFit: "contain" }}
                            />
                          </ImageLink>
                        ) : (
                          <ImageLink>
                            {sponsor.picture && sponsor.picture.secure_url && (
                              <Image
                                className={styles.sponsor_img}
                                src={sponsor.picture.secure_url}
                                alt={sponsor.nom}
                                width={160}
                                height={110}
                                style={{ objectFit: "contain" }}
                              />
                            )}
                          </ImageLink>
                        )}
                        <SponsorTitle>{sponsor.nom}</SponsorTitle>
                        {!disableEdit ? (
                          <SponsorListContainer>
                            <EditButton
                              onClick={() => {
                                this.setState(
                                  {
                                    imgData: sponsor.picture || null,
                                    link: sponsor.link || "",
                                    nom: sponsor.nom || "",
                                    edit: true,
                                    sponsorKey: key.toString()
                                  },
                                  () => {
                                    this.props.toggleFinalValidation();
                                    this.toggleModal("img-modal");
                                  }
                                );
                              }}
                            >
                              <EVAIcon name="edit-outline" size="large" fill={colors.gray90} />
                              <EditText>Editer</EditText>
                            </EditButton>
                            <DeleteButtonSmall onClick={() => deleteSponsor(key)}>
                              <EVAIcon name="trash-2-outline" size="large" fill={colors.gray10} />
                            </DeleteButtonSmall>
                          </SponsorListContainer>
                        ) : null}
                      </div>
                    );
                  })}
                </SponsorListContainer>
              </SponsorContainer>
            ) : !disableEdit ? (
              <SponsorContainer left>
                <SectionTitle>Partenaires</SectionTitle>
                <SponsorListContainer>
                  <div
                    className={cls(styles.sponsor_card, disableEdit && styles.no_edit, styles.add)}
                    onClick={() => {
                      this.props.toggleFinalValidation();
                      this.toggleModal("img-modal");
                      this.setState({
                        link: "",
                        nom: ""
                      });
                    }}
                  >
                    <AddSponsorTitle>Ajouter une structure partenaire</AddSponsorTitle>
                    <AddSponsorDescription>
                      Ces structures ne peuvent pas éditer la fiche mais sont ainsi visible dans le cas d’un partenariat
                      ou d’une co-animation.
                    </AddSponsorDescription>
                  </div>
                </SponsorListContainer>
              </SponsorContainer>
            ) : null}
          </Row>
        )}

        <CustomModal
          showModals={showModals}
          toggleModal={this.toggleModal}
          modal={modal}
          keyValue={"0"}
          title="Responsabilité de la fiche"
          lowerLeftBtn={
            <FButton
              type="tuto"
              name="play-circle-outline"
              onClick={() => this.props.toggleTutorielModal("ResponsabilitéFiche")}
            >
              Tutoriel
            </FButton>
          }
          lowerRightBtn={
            <div>
              <FButton type="white" fill={colors.gray90} onClick={this.toggleModal} className="ms-auto me-2">
                Quitter
              </FButton>
              <FButton
                type="validate"
                name="checkmark-outline"
                fill={colors.gray90}
                disabled={(!checked || (!user.email && !user.phone)) && !mesStructures.some((x) => x.checked)}
                onClick={() => {
                  this.validerRespo();
                  this.toggleIsMyStructureSelected();
                  this.toggleModal("envoye");
                }}
                className="ms-auto"
              >
                Valider
              </FButton>
            </div>
          }
        >
          {this.state.banner ? (
            <div className={styles.warning + " bg-focus mt-4 mb-4"}>
              <EVAIcon name="info" fill={colors.gray10} className={styles.info_icon} />
              <div onClick={() => this.setState({ banner: false })} className={styles.close_icon}>
                <EVAIcon name="close-outline" fill={colors.gray10} />
              </div>
              <p style={{ marginBottom: 0 }}>
                Renseignez ci-dessous le nom de la structure responsable de cette fiche pour qu’elle soit correctement
                mise à jour au fil du temps.
              </p>
            </div>
          ) : (
            <div style={{ marginTop: 24 }} />
          )}
          <SearchBar
            structures
            loupe
            className="search-bar inner-addon right-addon mb-4 mt-2"
            placeholder="Rechercher une structure..."
            //@ts-ignore
            array={structuresArray}
            createNewCta="Créer une nouvelle structure"
            selectItem={this.selectItem}
            handleChangeValueEntered={this.handleChangeValueEntered}
            toggleModal={this.toggleModal}
          />

          {mesStructures.length > 0 &&
            this.state.structure.nom === "" &&
            mesStructures.map((struct) => (
              <FormGroup
                check
                className={styles.structure}
                key={struct._id.toString()}
                style={
                  struct.checked
                    ? {
                        backgroundColor: colors.greenValidate,
                        border: "0.5px solid" + colors.validationHover
                      }
                    : {}
                }
              >
                <Label
                  style={{
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
                  check
                >
                  <Input
                    type="checkbox"
                    checked={struct.checked}
                    style={{ cursor: "pointer" }}
                    onChange={() => this.handleStructChange(struct._id.toString())}
                  />{" "}
                  <b>Ma structure : </b>
                  {struct.nom}
                </Label>
              </FormGroup>
            ))}
        </CustomModal>

        <CustomModal
          showModals={showModals}
          toggleModal={this.toggleModal}
          modal={{ name: "etVous" }}
          keyValue={"1"}
          title="Responsabilité de la fiche"
          lowerLeftBtn={
            <FButton
              type="tuto"
              name="play-circle-outline"
              onClick={() => this.props.toggleTutorielModal("ResponsabilitéFiche")}
            >
              Tutoriel
            </FButton>
          }
          lowerRightBtn={
            <div>
              <FButton
                type="white"
                fill={colors.gray90}
                onClick={() => {
                  this.toggleModal("responsabilite");
                  this.handleChangeValueEntered("");
                  this.resetImg();
                }}
                className="ms-auto me-2"
                name="arrow-back-outline"
              >
                Retour
              </FButton>
              <FButton
                type="validate"
                name="checkmark-outline"
                fill={colors.gray90}
                onClick={() => {
                  this.props.addMainSponsor(this.state.selected);
                  this.toggleModal("envoye");
                  this.setState({ imgData: null });
                }}
                className="ms-auto"
              >
                Valider
              </FButton>
            </div>
          }
        >
          <ConfirmationStructureContainer>
            <p>
              <ConfirmationStructureTitleContainer>
                Faites-vous partie de cette structure ?{" "}
              </ConfirmationStructureTitleContainer>
            </p>

            <div className={styles.selection_wrapper + " bg-white mb-2"}>
              {selected && selected?.picture?.secure_url && (
                <Image
                  src={selected.picture.secure_url}
                  className={styles.selection_logo}
                  alt="logo de structure"
                  width={40}
                  height={40}
                  style={{ objectFit: "contain" }}
                />
              )}
              {selected && (
                <span>
                  {selected.acronyme || ""} - {selected.nom || ""}
                </span>
              )}
            </div>
          </ConfirmationStructureContainer>
          <FormGroup check className={styles.author + " mb-2"}>
            <Label check style={{ cursor: "pointer" }}>
              <Input type="checkbox" checked={this.state.authorBelongs} onChange={this.handleBelongsSChange} />{" "}
              <b>Oui et je veux devenir rédacteur de cette structure</b>
            </Label>
          </FormGroup>
          <FormGroup check className={styles.author}>
            <Label check style={{ cursor: "pointer" }}>
              <Input type="checkbox" checked={!this.state.authorBelongs} onChange={this.handleBelongsSChange} />{" "}
              <b>Non et j&apos;accepte que cette structure reprenne le droit d&apos;édition</b>
            </Label>
          </FormGroup>
          {this.state.banner ? (
            <div className={styles.warning + " bg-focus mt-4 mb-4"}>
              <EVAIcon name="info" fill={colors.gray10} className={styles.info_icon} />
              <div onClick={() => this.setState({ banner: false })} className={styles.close_icon}>
                <EVAIcon name="close-outline" fill={colors.gray10} />
              </div>
              <p style={{ marginBottom: 0 }}>
                Si oui, le responsable de la structure sera notifié de votre demande et pourra vous ajouter facilement.
              </p>
              <div>Si non, vous ne pourrez plus éditer la fiche dès que la structure en reprend la responsabilité.</div>
            </div>
          ) : (
            <div style={{ marginTop: 24 }} />
          )}
        </CustomModal>

        <CustomModal
          showModals={showModals}
          toggleModal={this.toggleModal}
          modal={{ name: "creation" }}
          keyValue={"2"}
          title="Création d'une structure"
          lowerLeftBtn={
            <FButton
              type="tuto"
              name={"play-circle-outline"}
              onClick={() => this.props.toggleTutorielModal("ResponsabilitéFiche")}
            >
              Tutoriel
            </FButton>
          }
          lowerRightBtn={
            <div>
              <FButton
                type="white"
                name="arrow-back-outline"
                fill={colors.gray90}
                onClick={() => {
                  this.toggleModal("responsabilite");
                  this.handleChangeValueEntered("");
                  this.resetImg();
                }}
                className="ms-auto me-2"
              >
                Retour
              </FButton>
              <FButton
                type="validate"
                name="checkmark-outline"
                fill={colors.gray90}
                disabled={
                  !this.state.structure.nom ||
                  !this.state.structure.contact ||
                  !this.state.structure.mail_contact ||
                  !this.state.structure.phone_contact ||
                  this.state.phoneError
                }
                onClick={this.createStructure}
                className="ms-auto"
              >
                Valider
              </FButton>
            </div>
          }
        >
          <CreationContent
            handleChange={this.handleChange}
            setStructureContactAsMe={this.setStructureContactAsMe}
            nom={this.state.structure.nom}
            contact={this.state.structure.contact}
            phone_contact={this.state.structure.phone_contact}
            mail_contact={this.state.structure.mail_contact}
            phoneError={this.state.phoneError}
          />
          <div className={`${styles.input} ${styles.inline}`}>
            <span style={{ fontSize: 22 }}>Ajouter un logo</span>
            {this.state.imgData?.secure_url ? (
              <div className={styles.image_wrapper}>
                <Image
                  className={styles.sponsor_img}
                  src={this.state.imgData.secure_url}
                  alt={""}
                  width={160}
                  height={110}
                  style={{ objectFit: "contain" }}
                />
                <FButton className="position-relative" type="fill-dark" name="upload-outline">
                  <Input
                    className={styles.file_input}
                    type="file"
                    id="picture"
                    name="user"
                    accept="image/*"
                    onChange={this.handleFileInputChange}
                  />
                  <span>Choisir</span>
                  {this.state.sponsorLoading && <Spinner size="sm" color="green" className="ms-2" />}
                </FButton>
              </div>
            ) : (
              <FButton className="position-relative" type="fill-dark" name="upload-outline">
                <Input
                  className={styles.file_input}
                  type="file"
                  id="picture"
                  name="user"
                  accept="image/*"
                  onChange={this.handleFileInputChange}
                />
                <span>Choisir</span>
                {this.state.sponsorLoading && <Spinner size="sm" color="green" className="ms-2" />}
              </FButton>
            )}
          </div>
        </CustomModal>

        <CustomModal
          showModals={showModals}
          toggleModal={this.toggleModal}
          modal={{ name: "envoye" }}
          keyValue={"3"}
          title={"Chouette !"}
          lowerRightBtn={
            <FButton
              type="validate"
              name="checkmark"
              onClick={() => {
                this.toggleModal("envoye");
                if (this.props.finalValidation) {
                  this.props.validate();
                }
                this.props.toggleDispositifValidateModal();
              }}
              className="ms-auto"
            >
              Je termine ma fiche
            </FButton>
          }
          lowerLeftBtn={
            <FButton
              type="dark"
              name="edit-outline"
              onClick={() => {
                this.toggleModal("envoye");
                if (this.props.finalValidation) {
                  this.props.validate();
                }
              }}
            >
              Je continue ma rédaction
            </FButton>
          }
        >
          <div className={styles.content_sent}>
            <Image src={structure_definie} className={styles.illu} alt="illustration" />

            {isMyStructureSelected ? (
              <>
                <h5 className="mb-2 green">Votre fiche va être transférée à la structure :</h5>
                <MyStructureContainer>
                  {" "}
                  {mainSponsor?.picture?.secure_url && (
                    <Image
                      src={mainSponsor.picture.secure_url}
                      className={styles.selection_logo}
                      alt="logo de structure"
                      style={{ objectFit: "contain" }}
                      width={40}
                      height={40}
                    />
                  )}
                  <span>
                    {mainSponsor?.acronyme || ""} - {mainSponsor?.nom || ""}
                  </span>
                </MyStructureContainer>
                <div className="mb-2">
                  <b>
                    Les responsables de la structure vont prendre le relais. N’hésitez pas à les joindre directement si
                    vous les connaissez.
                  </b>
                </div>
              </>
            ) : selected?.nom ? (
              authorBelongs ? (
                <>
                  <h5 className="mb-2">Votre demande est soumise aux reponsables de :</h5>
                  <div className={styles.selection_wrapper + " mb-2"}>
                    {selected?.picture?.secure_url && (
                      <Image
                        src={selected.picture.secure_url}
                        className={styles.selection_logo}
                        alt="logo de structure"
                        width={40}
                        height={40}
                        style={{ objectFit: "contain" }}
                      />
                    )}
                    <span>
                      {selected?.acronyme || ""} - {selected?.nom || ""}
                    </span>
                  </div>
                  <div>
                    Vous devriez être ajouté en tant que membre sous 7 jours.
                    <br />
                    N’hésitez pas à les joindre directement si vous les connaissez.
                    <br />
                    <b>Merci infiniment pour votre contribution !</b>
                  </div>
                </>
              ) : (
                <>
                  <h5 className="mb-2 green">Votre fiche va être transférée à la structure :</h5>
                  <MyStructureContainer>
                    {" "}
                    {mainSponsor?.picture?.secure_url && (
                      <Image
                        src={mainSponsor.picture.secure_url}
                        className={styles.selection_logo}
                        alt="logo de structure"
                        width={40}
                        height={40}
                        style={{ objectFit: "contain" }}
                      />
                    )}
                    <span>
                      {mainSponsor?.acronyme || ""} - {mainSponsor?.nom || ""}
                    </span>
                  </MyStructureContainer>
                  <div>
                    <b>
                      Les responsables de la structure vont prendre le relais. N’hésitez pas à les joindre directement
                      si vous les connaissez.
                    </b>
                  </div>
                </>
              )
            ) : (
              <>
                <h5 className="mb-2">La structure est en cours de création</h5>
                <div className="mb-2">
                  <b>
                    Nous allons faire le nécessaire pour activer votre structure à partir des informations que vous avez
                    renseignées.
                  </b>
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

const mapStateToProps = (state: RootState) => {
  return {
    user: state.user.user,
    userStructure: state.userStructure,
    structures: state.activeStructures,
    isLoadingStructures: isLoadingSelector(LoadingStatusKey.FETCH_STRUCTURES)(state)
  };
};

const mapDispatchToProps = {
  updateUserActionCreator,
  fetchActiveStructuresActionCreator
};

export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true
  //@ts-ignore
})(Sponsors);
