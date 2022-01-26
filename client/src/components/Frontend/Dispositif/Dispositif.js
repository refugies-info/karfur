import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Col, Row, Spinner } from "reactstrap";
import { connect } from "react-redux";
import { withRouter } from "next/router";
import ContentEditable from "react-contenteditable";
import dynamic from "next/dynamic"
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import {
  EditorState,
  convertToRaw,
  convertFromRaw,
  ContentState,
} from "draft-js";
import i18n from "i18n";
import moment from "moment/min/moment-with-locales";
import Swal from "sweetalert2";
import h2p from "html2plaintext";
import _ from "lodash";
import querySearch from "stringquery";
import { convertToHTML } from "draft-convert";
// import windowSize from "react-window-size";
import API from "utils/API";
import Sponsors from "components/Frontend/Dispositif/Sponsors/Sponsors";
import { ContenuDispositif } from "components/Frontend/Dispositif/ContenuDispositif";
import {
  BookmarkedModal,
  DispositifCreateModal,
  DispositifValidateModal,
  ReactionModal,
  ResponsableModal,
  RejectionModal,
  TagsModal,
  FrameModal,
  DraftModal,
  ShareContentOnMobileModal,
} from "components/Modals/index";
import FButton from "components/FigmaUI/FButton/FButton";
import { Tags } from "components/Pages/dispositif/Tags";
import { LanguageToReadModal } from "components/Pages/dispositif/LanguageToReadModal/LanguagetoReadModal";
import { LeftSideDispositif } from "components/Frontend/Dispositif/LeftSideDispositif";
import { BandeauEdition } from "components/Frontend/Dispositif/BandeauEdition";
import { TopRightHeader } from "components/Frontend/Dispositif/TopRightHeader";
import { fetchActiveDispositifsActionsCreator } from "services/ActiveDispositifs/activeDispositifs.actions";
import { fetchUserActionCreator } from "services/User/user.actions";
import ContribCaroussel from "components/Pages/dispositif/ContribCaroussel/ContribCaroussel";
import SideTrad from "components/Pages/dispositif/SideTrad/SideTrad";
import ExpertSideTrad from "components/Pages/dispositif/SideTrad/ExpertSideTrad";
import DemarcheCreateModal from "components/Modals/DemarcheCreateModal/DemarcheCreateModal";
import { initializeTimer } from "containers/Translation/functions";
import { readAudio, stopAudio } from "lib/readAudio";
import {
  contenu,
  menu as menuDispositif,
  filtres,
  importantCard,
  showModals,
  menuDemarche,
  demarcheSteps,
  customConvertOption,
  infocardsDemarcheTitles,
  infocardFranceEntiere,
} from "data/dispositif";
import { calculFiabilite } from "components/Pages/dispositif/functions";
import { breakpoints } from "utils/breakpoints.js";
import { BackButton } from "components/Frontend/Dispositif/BackButton";
import { colors } from "colors";
import {
  fetchSelectedDispositifActionCreator,
  updateUiArrayActionCreator,
  updateSelectedDispositifActionCreator,
} from "services/SelectedDispositif/selectedDispositif.actions";
import { EnBrefBanner } from "components/Frontend/Dispositif/EnBrefBanner";
import { FeedbackFooter } from "components/Frontend/Dispositif/FeedbackFooter";
import { initGA, Event } from "tracking/dispatch";
import { fetchActiveStructuresActionCreator } from "services/ActiveStructures/activeStructures.actions";
import { logger } from "logger";
import { isMobile } from "react-device-detect";
import { PdfCreateModal } from "components/Modals/PdfCreateModal/PdfCreateModal";
import styled from "styled-components";
import isInBrowser from "lib/isInBrowser";
import styles from "scss/pages/dispositif.module.scss";

moment.locale("fr");

const htmlToDraft = dynamic(
  () => import("html-to-draftjs"),
  { ssr: false }
);
const NotificationContainer = dynamic(
  () => import("react-notifications").then((mod) => mod.NotificationContainer),
  { ssr: false }
);
const NotificationManager = dynamic(
  () => import("react-notifications").then((mod) => mod.NotificationManager),
  { ssr: false }
);

const InfoBoxLanguageContainer = styled.div`
  display: flex;
  max-width: 1002px;
  color: ${colors.blanc};
  background-color: ${colors.focus};
  border-radius: 12px;
  padding: 16px;
  justify-content: space-between;
  align-items: flex-start;
  margin: ${isMobile ? "16px" : "0px 20px 20px 40px"};
`;

const TextOtherLanguageContainer = styled.p`
  display: flex;
  color: ${colors.grisFonce};
  font-size: 18px;
  justify-content: flex-start;
  flex-wrap: wrap;
  align-items: center;
  margin: ${isMobile ? "auto" : "auto 40px"};
  padding: ${isMobile ? "16px" : 0};
`;

const sponsorsData = [];
const uiElement = {
  isHover: false,
  accordion: false,
  cardDropdown: false,
  addDropdown: false,
  varianteSelected: false,
};
let user = { _id: "", cookies: {} };

const MAX_NUMBER_CHARACTERS_INFOCARD = 40;
export class Dispositif extends Component {
  constructor(props) {
    super(props);
    this.newRef = React.createRef();
    this.sponsors = React.createRef();
    this.mountTime = 0;
    this._isMounted = false;
    this.initializeTimer = initializeTimer.bind(this);
    this.readAudio = readAudio.bind(this);
    this.stopAudio = stopAudio.bind(this);
  }

  state = {
    menu: [],
    content: contenu,
    sponsors: sponsorsData,
    tags: [],
    mainTag: {
      darkColor: colors.darkColor,
      lightColor: colors.lightColor,
      hoverColor: colors.gris,
      short: "noImage",
    },
    uiArray: new Array(menuDispositif.length).fill(uiElement),
    showModals: showModals,
    accordion: new Array(1).fill(false),
    dropdown: new Array(5).fill(false),
    disableEdit: true,
    isModified: false,
    isSaved: false,
    tooltipOpen: false,
    showBookmarkModal: false,
    isAuth: false,
    showDispositifCreateModal: false,
    showDispositifValidateModal: false,
    showGeolocModal: false,
    showLanguageToReadModal: false,
    showTagsModal: false,
    showPdfModal: false,
    showTutorielModal: false,
    showDraftModal: false,
    showShareContentOnMobileModal: false,
    showSpinnerPrint: false,
    showSpinnerBookmark: false,
    showAlertBoxLanguage: true,
    suggestion: "",
    mail: "",
    tKeyValue: -1,
    tSubkey: -1,
    pinned: false,
    user: {},
    isDispositifLoading: true,
    contributeurs: [],
    withHelp: process.env.NODE_ENV !== "development",
    inputBtnClicked: false,
    mainSponsor: {},
    status: "",
    time: 0,
    initialTime: 0,
    typeContenu: "dispositif",
    search: {},
    allDemarches: [],
    demarcheId: null,
    dispositif: {},
    _id: undefined,
    printing: false,
    didThank: false,
    finalValidation: false,
    tutorielSection: "",
    displayTuto: true,
    addMapBtn: true,
    initialMenu: [],
  };

  componentDidMount() {
    /*     this.props.history.push({
      state: {},
    }); */
    this._isMounted = true;
    this.props.fetchUser();
    this.props.fetchActiveStructures();
    this.checkUserFetchedAndInitialize();
    // window.scrollTo(0, 0);
    // this._initializeDispositif(this.props);
  }

  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(nextProps) {
    if (
      ((nextProps.match || {}).params || {}).id !==
      ((this.props.match || {}).params || {}).id
    ) {
      this._isMounted && this._initializeDispositif(nextProps);
    }
    if (nextProps.languei18nCode !== this.props.languei18nCode) {
      this._isMounted && this._initializeDispositif(nextProps);
    }
    const userQuery = querySearch(
      _.get(nextProps, "history.location.search", "")
    );
    if (
      userQuery &&
      userQuery.age !== this.state.search.age &&
      userQuery.ville !== this.state.search.ville
    ) {
      this._isMounted && this.setState({ search: userQuery });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    clearInterval(this.timer);
  }

  checkUserFetchedAndInitialize = () => {
    if (this.props.userFetched) {
      this._initializeDispositif(this.props);
    } else {
      setTimeout(this.checkUserFetchedAndInitialize, 100); // check again in a 100 ms
    }
  };

  //temp
  _initializeDispositif = (props) => {
    const itemId = props.router.query.id;
    const typeContenu = (props.router.pathname || "").includes("demarche")
      ? "demarche"
      : "dispositif";

    // if an itemId is present : initialize dispositif lecture or dispositif modification
    // if no itemId and user logged in : initialize new dispo creation
    // if no itemId and user not logged in : redirect to login page
    if (itemId) {
      // work in progress : store dispo in redux and in state. the goal is not to have dispo in state anymore
      this.props.fetchSelectedDispositif({
        selectedDispositifId: itemId,
        locale: props.languei18nCode,
      });

      return API.get_dispositif({
        query: { _id: itemId },
        sort: {},
        populate: "creatorId mainSponsor participants",
        locale: props.languei18nCode,
      })
        .then((data_res) => {
          let dispositif = { ...data_res.data.data[0] };
          if (!dispositif || !dispositif._id) {
            this._isMounted = false;
            return this.props.router.push("/");
          }
          if (dispositif.status === "Actif" && !props.translating) {
            const nbVues = dispositif.nbVues ? dispositif.nbVues + 1 : 1;
            API.updateNbVuesOrFavoritesOnContent({
              query: { id: dispositif._id, nbVues },
            });
          }

          // case dispositif not active and user neither admin nor contributor nor in structure
          if (
            dispositif.status !== "Actif" &&
            !this.props.admin &&
            !this.props.user.contributions.includes(dispositif._id) &&
            (!dispositif.mainSponsor ||
              (dispositif.mainSponsor &&
                !this.props.user.structures.includes(
                  dispositif.mainSponsor._id
                )))
          ) {
            if (_.isEmpty(this.props.user)) {
              Swal.fire({
                title: "Erreur",
                text: "Accès non authorisé",
                type: "error",
                timer: 1200,
              });
              return this.props.router.push("/login");
            }
            Swal.fire({
              title: "Erreur",
              text: "Accès non authorisé",
              type: "error",
              timer: 1200,
            });
            this._isMounted = false;
            return this.props.router.push("/");
          }

          const disableEdit = true;

          if (dispositif.status === "Brouillon" && this._isMounted) {
            this.initializeTimer(3 * 60 * 1000, () => {
              this.valider_dispositif("Brouillon", true);
            });
          }
          const secondarySponsor = dispositif.sponsors.filter(
            (sponsor) => !sponsor._id && sponsor.nom
          );
          const sponsors = secondarySponsor || [];

          // for demarche we need to be compatible with the moteur de cas.
          // remove infocards not in list
          // for infocard age requis, rename ageTitle in contentTitle
          // if no infocard zone d'action, add one
          const menu =
            dispositif.typeContenu === "dispositif"
              ? dispositif.contenu
              : dispositif.contenu.map((part) => {
                  if (part.title !== "C'est pour qui ?") {
                    return part;
                  }
                  const children = part.children
                    .filter((child) =>
                      infocardsDemarcheTitles.includes(child.title)
                    )
                    .map((child) => {
                      if (child.title === "Âge requis" && child.ageTitle) {
                        const newFormatChild = {
                          ...child,
                          contentTitle: child.ageTitle,
                        };
                        delete newFormatChild.ageTitle;
                        return newFormatChild;
                      }
                      return child;
                    });
                  if (
                    children.filter((child) => child.title === "Zone d'action")
                      .length > 0
                  ) {
                    return {
                      ...part,
                      children: children,
                    };
                  }
                  return {
                    ...part,
                    children: children.concat([infocardFranceEntiere]),
                  };
                });

          //Enregistrement automatique du dispositif toutes les 3 minutes
          this._isMounted &&
            this.setState(
              {
                _id: itemId,
                menu: menu || [],
                content: {
                  titreInformatif: dispositif.titreInformatif,
                  titreMarque: dispositif.titreMarque,
                  abstract: dispositif.abstract,
                  contact: dispositif.contact,
                  externalLink: dispositif.externalLink,
                },
                sponsors,
                tags: dispositif.tags,
                creator: dispositif.creatorId,
                uiArray: _.get(dispositif, "contenu", []).map((x) => {
                  return {
                    ...uiElement,
                    ...(x.children && {
                      children: new Array(x.children.length).fill({
                        ...uiElement,
                        accordion: dispositif.status === "Accepté structure",
                      }),
                    }),
                  };
                }),
                dispositif: dispositif,
                isDispositifLoading: false,
                contributeurs: this.computeContributors(
                  dispositif.participants,
                  dispositif.creatorId
                ),
                mainTag:
                  dispositif.tags && dispositif.tags.length > 0
                    ? filtres.tags.find(
                        (x) => x && x.name === (dispositif.tags[0] || {}).name
                      ) || {}
                    : {},
                mainSponsor: dispositif.mainSponsor || {},
                status: dispositif.status,
                fiabilite: calculFiabilite(dispositif),
                disableEdit,
                typeContenu,
                ...(dispositif.status === "Brouillon" && {
                  initialTime: dispositif.timeSpent,
                }),
                initialMenu:
                  dispositif.typeContenu === "dispositif"
                    ? JSON.parse(JSON.stringify(menu))
                    : JSON.parse(JSON.stringify(menuDemarche)),
              },
              () => {
                this.setColors();
              }
            );
          //document.title =
          //  this.state.content.titreMarque ||
          //  this.state.content.titreInformatif;

          //On récupère les données de l'utilisateur
          if (this._isMounted && API.isAuth()) {
            this._isMounted &&
              // TO DO not necessary to call api, these info are stored in redux
              API.get_user_info().then((data_res) => {
                let u = data_res.data.data;
                user = { _id: u._id, cookies: u.cookies || {} };
                this._isMounted &&
                  this.setState({
                    pinned: (user.cookies.dispositifsPinned || []).some(
                      (x) => x._id === itemId
                    ),
                    isAuthor: u._id === (dispositif.creatorId || {})._id,
                  });
              });
          }
        })
        .catch((err) => {
          if (_.isEmpty(this.props.user)) {
            Swal.fire({
              title: "Erreur",
              text: "Accès non authorisé",
              type: "error",
              timer: 1200,
            });
            this._isMounted = false;
            return this.props.router.push("/login");
          }
          Swal.fire({
            title: "Erreur",
            text: "Accès non authorisé",
            type: "error",
            timer: 1200,
          });
          logger.error("Error: ", { error: err.message });
          this._isMounted = false;
          return this.props.router.push("/");
        });
    } else if (API.isAuth()) {
      // initialize the creation of a new dispositif if user is logged in
      this.initializeTimer(3 * 60 * 1000, () =>
        this.valider_dispositif("Brouillon", true)
      ); //Enregistrement automatique du dispositif toutes les 3 minutes
      const menuContenu =
        typeContenu === "demarche" ? menuDemarche : menuDispositif;
      this.setState(
        {
          disableEdit: false,
          uiArray: menuContenu.map((x) => {
            return {
              ...uiElement,
              ...(x.children && {
                children: new Array(x.children.length).fill({
                  ...uiElement,
                  accordion: true,
                }),
              }),
            };
          }),
          showDispositifCreateModal: true, //A modifier avant la mise en prod
          isDispositifLoading: false,
          menu: menuContenu.map((x) => {
            return {
              ...x,
              type: x.type || "paragraphe",
              isFakeContent: true,
              content: x.type ? null : x.content,
              editorState: EditorState.createWithContent(
                ContentState.createFromBlockArray(htmlToDraft("").contentBlocks)
              ),
            };
          }),
          typeContenu,
          initialMenu:
            typeContenu === "dispositif"
              ? JSON.parse(JSON.stringify(menuDispositif))
              : JSON.parse(JSON.stringify(menuDemarche)),
        },
        () => this.setColors()
      );
    } else {
      this.props.router.push({
        pathname: "/login",
        state: { redirectTo: "/dispositif" },
      });
    }
    // window.scrollTo(0, 0);
  };

  setColors = () => {
    return ["color", "borderColor", "backgroundColor", "fill"].map((s) => {
      return ["dark", "light"].map((c) => {
        return (
          document &&
          document
            .querySelectorAll("." + s + "-" + c + "Color")
            .forEach((elem) => {
              elem.style[s] = this.state.mainTag[c + "Color"];
            })
        );
      });
    });
  };

  toggleIsModified = (newState) => {
    this.setState({ isModified: newState });
  };
  toggleIsSaved = (newState) => {
    this.setState({ isSaved: newState });
  };

  onInputClicked = (ev) => {
    // when clicking on titreInformatif or titreMarque (name of asso)
    // if titre informatif is 'Titre informatif' we store "" instead of titre informatif
    // same for titre marque

    const id = ev.currentTarget.id;
    if (
      !this.state.disableEdit &&
      ((id === "titreInformatif" &&
        this.state.content.titreInformatif === contenu.titreInformatif) ||
        (id === "titreMarque" &&
          this.state.content.titreMarque === contenu.titreMarque))
    ) {
      this.setState({ content: { ...this.state.content, [id]: "" } });
    }
  };

  handleChange = (ev) => {
    var value = ev.target.value;

    // update selected dispositif in redux
    this.props.updateSelectedDispositif({
      [ev.currentTarget.id]: value,
    });

    // TO DO : remove this set state when all infos are taken from store
    this.setState({
      content: {
        ...this.state.content,
        [ev.currentTarget.id]: value,
      },
      isModified: true,
    });
  };

  handleKeyPress = (ev, index) => {
    if (ev.key === "Enter") {
      ev.preventDefault();
      if (
        index === 0 &&
        this.state.content.titreMarque === contenu.titreMarque
      ) {
        this.setState({ content: { ...this.state.content, titreMarque: "" } });
        // document.getElementById("titreMarque").focus();
      }
    }
  };

  toggleGeolocModal = (show) => {
    this.setState({ showGeolocModal: show });
  };

  toggleAlertBoxLanguage = () => {
    this.setState({ showAlertBoxLanguage: !this.state.showAlertBoxLanguage });
  };

  toggleShowPdfModal = () => {
    this.setState({ showPdfModal: !this.state.showPdfModal });
  };

  toggleShowLanguageModal = () => {
    this.setState({
      showLanguageToReadModal: !this.state.showLanguageToReadModal,
    });
  };

  handleModalChange = (ev) =>
    this.setState({ [ev.currentTarget.id]: ev.target.value });

  disableIsMapLoaded = (key, subkey) => {
    let state = [...this.state.menu];
    if (
      state.length > key &&
      state[key].children &&
      state[key].children.length > subkey
    ) {
      state[key].children[subkey].isMapLoaded = true;
      this.setState({ menu: state });
    }
  };

  fwdSetState = (fn, cb) => this.setState(fn, cb);

  handleMenuChange = (ev, value = null) => {
    const node = ev.currentTarget;
    let state = [...this.state.menu];
    state[node.id] = {
      ...state[node.id],
      ...(!node.dataset.subkey && {
        [(node.dataset || {}).target || "content"]:
          value || (value === null && ev.target.value),
        isFakeContent: false,
      }),
      ...(node.dataset.subkey &&
        state[node.id].children &&
        state[node.id].children.length > node.dataset.subkey && {
          children: state[node.id].children.map((y, subidx) => {
            return {
              ...y,
              ...(subidx === parseInt(node.dataset.subkey) && {
                [node.dataset.target || "content"]:
                  value ||
                  // in infocards we want to limit the number of caracters
                  (value === null && y.type === "card"
                    ? ev.target.value.substring(
                        0,
                        MAX_NUMBER_CHARACTERS_INFOCARD
                      )
                    : ev.target.value),
                isFakeContent: false,
              }),
            };
          }),
        }),
    };

    return this.setState({ menu: state, isModified: true });
  };

  handleContentClick = (key, editable, subkey = undefined) => {
    let state = [...this.state.menu];
    if (state.length > key && key >= 0 && !this.state.disableEdit) {
      if (editable) {
        state = state.map((x) => {
          const hasNewContent =
            x.editable && x.editorState && x.editorState.getCurrentContent();
          // if user removed text with store empty string without html balise (so that it works with translation)
          const content =
            hasNewContent &&
            x.editorState.getCurrentContent().getPlainText() !== ""
              ? convertToHTML(customConvertOption)(
                  x.editorState.getCurrentContent()
                )
              : "";
          return {
            ...x,
            editable: false,
            ...(hasNewContent && {
              content,
            }),
            ...(x.children && {
              children: x.children.map((y) => {
                const hasNewContent =
                  y.editable &&
                  y.editorState &&
                  y.editorState.getCurrentContent();
                // if user removed text with store empty string without html balise (so that it works with translation)
                const content =
                  hasNewContent &&
                  y.editorState.getCurrentContent().getPlainText() !== ""
                    ? convertToHTML(customConvertOption)(
                        y.editorState.getCurrentContent()
                      )
                    : "";
                return {
                  ...y,
                  ...(hasNewContent && {
                    content,
                  }),
                  editable: false,
                };
              }),
            }), //draftToHtml(convertToRaw(y.editorState.getCurrentContent()))
          };
        });
      }
      let right_node = state[key];
      if (subkey !== undefined && state[key].children.length > subkey) {
        right_node = state[key].children[subkey];
      }
      right_node.editable = editable;
      if (
        editable &&
        right_node.content !== undefined &&
        right_node.content !== null
      ) {
        const contentState = ContentState.createFromBlockArray(
          htmlToDraft(right_node.isFakeContent ? "" : right_node.content)
            .contentBlocks
        );
        const rawContentState = convertToRaw(contentState) || {};
        const rawBlocks = rawContentState.blocks || [];
        const textPosition = rawBlocks.findIndex((x) =>
          (x.text || "").includes("Bon à savoir :")
        );
        const newRawBlocks = rawBlocks.filter(
          (_, i) => i < textPosition - 3 || i >= textPosition
        );
        // we have to modify inlineStyleRanges and entityRanges after removing blocks otherwise style (bold and links) are not on the right words
        const newRawContentState = {
          ...rawContentState,
          blocks: newRawBlocks.map((x) =>
            x.text.includes("Bon à savoir :")
              ? {
                  ...x,
                  text: x.text.replace("Bon à savoir :", ""),
                  type: "header-six",
                  inlineStyleRanges: x.inlineStyleRanges
                    ? x.inlineStyleRanges.map((style) => {
                        return {
                          ...style,
                          offset: style.offset - 14,
                        };
                      })
                    : [],
                  entityRanges: x.entityRanges
                    ? x.entityRanges.map((style) => {
                        return {
                          ...style,
                          offset: style.offset - 14,
                        };
                      })
                    : [],
                }
              : x
          ),
        };
        const newContentState = convertFromRaw(newRawContentState);
        right_node.editorState = EditorState.createWithContent(newContentState);
      } else if (
        !editable &&
        right_node.editorState &&
        right_node.editorState.getCurrentContent
      ) {
        right_node.content = convertToHTML(customConvertOption)(
          right_node.editorState.getCurrentContent()
        ); //draftToHtml(convertToRaw(right_node.editorState.getCurrentContent()));
      }
      if (right_node.type === "accordion") {
        this.updateUIArray(key, subkey, "accordion", true);
      }
      return new Promise((resolve) =>
        this.setState({ menu: state }, () => {
          this.updateUI(key, subkey, editable);
          resolve();
        })
      );
    }
    return new Promise((r) => r());
  };

  updateUI = (key, subkey, editable) => {
    if (
      editable &&
      (subkey === undefined || (subkey === 0 && key > 1)) &&
      this.state.withHelp
    ) {
      try {
        //On place le curseur à l'intérieur du wysiwyg et on ajuste la hauteur
        const target =
          key === 0 || subkey !== undefined
            ? "editeur-" + key + "-" + subkey
            : key === 1
            ? "card-col col-lg-4"
            : undefined;
        let parentNode = null // document.getElementsByClassName(target)[0];
        if (subkey && parentNode) {
          parentNode
            .getElementsByClassName("public-DraftEditor-content")[0]
            .focus();
          // window.getSelection().addRange(document.createRange());
          parentNode.getElementsByClassName(
            "DraftEditor-root"
          )[0].style.height =
            (
              parentNode.getElementsByClassName(
                "public-DraftEditorPlaceholder-inner"
              )[0] || {}
            ).offsetHeight + "px";
        }

        // test remove this part
        // if (parentNode) {
        //   parentNode.scrollIntoView({
        //     behavior: "smooth",
        //     block: "end",
        //     inline: "nearest",
        //   });
        // }
      } catch (e) {
        logger.error("error", { error: e.message });
      }
      this.setState({
        inputBtnClicked: false,
      });
    }
  };

  onEditorStateChange = (editorState, key, subkey = null) => {
    let state = [...this.state.menu];

    if (state.length > key) {
      const content =
        editorState.getCurrentContent().getPlainText() !== ""
          ? convertToHTML(customConvertOption)(editorState.getCurrentContent())
          : "";
      if (subkey !== null && state[key].children.length > subkey) {
        state[key].children[subkey].editorState = editorState;
        state[key].children[subkey].isFakeContent = false;
        state[key].children[subkey].content = content;
      } else {
        state[key].editorState = editorState;
        state[key].isFakeContent = false;
        state[key].content = content;
      }
      this.setState({ menu: state, isModified: true });
    }
  };

  updateUIArray = (key, subkey = null, node = "isHover", value = true) => {
    let uiArray = [...this.state.uiArray];
    const updateOthers =
      node !== "varianteSelected" &&
      (this.state.disableEdit || node !== "accordion");
    uiArray = uiArray.map((x, idx) => {
      return {
        ...x,
        ...((subkey === null && idx === key && { [node]: value }) ||
          (updateOthers && { [node]: false })),
        ...(x.children && {
          children: x.children.map((y, subidx) => {
            return {
              ...y,
              ...((subidx === subkey && idx === key && { [node]: value }) ||
                (updateOthers && { [node]: false })),
            };
          }),
        }),
      };
    });

    // update uiarray in store redux
    this.props.updateUiArray({ subkey, key, node, value, updateOthers });
    this.setState({ uiArray: uiArray, tKeyValue: key, tSubkey: subkey });
  };

  showMapButton = (show) => {
    this.setState({ addMapBtn: show });
  };

  addItem = (key, type = "paragraphe", subkey = null) => {
    let prevState = [...this.state.menu];
    let uiArray = [...this.state.uiArray];
    const importantCard = {
      type: "card",
      isFakeContent: true,
      title: "Important !",
      titleIcon: "warning",
      contentTitle: "Compte bancaire",
      contentBody: "nécessaire pour recevoir l’indemnité",
      footer: "Pourquoi ?",
      footerIcon: "question-mark-circle-outline",
    };
    if (prevState[key].children && prevState[key].children.length > 0) {
      let newChild = {
        ...prevState[key].children[prevState[key].children.length - 1],
      };
      if (type === "card" && newChild.type !== "card") {
        prevState[key].type = "cards";
        newChild = importantCard;
      } else if (type === "card") {
        const menuFiche =
          this.state.typeContenu === "dispositif"
            ? menuDispositif
            : menuDemarche;
        // the new child is an infocard which title is subkey (a title that is not already displayed)
        newChild =
          menuFiche[1].children.filter((x) => x.title === subkey).length > 0
            ? menuFiche[1].children.filter((x) => x.title === subkey)[0]
            : importantCard;

        // very strange behaviour, when adding IC geoloc menu contains actual state and not data so overide newChild with correct value
        if (subkey === "Zone d'action") {
          newChild = {
            type: "card",
            isFakeContent: true,
            title: "Zone d'action",
            titleIcon: "pin-outline",
            typeIcon: "eva",
            departments: [],
            free: true,
            contentTitle: "Sélectionner",
          };
        }
      } else if (type === "accordion") {
        newChild = {
          type: "accordion",
          isFakeContent: true,
          content: "",
        };
      } else if (type === "map") {
        newChild = {
          type: "map",
          isFakeContent: true,
          isMapLoaded: false,
          markers: [],
        };
        this.setState({ addMapBtn: false });
      } else if (type === "paragraph" && !newChild.content) {
        newChild = {
          title: "Un exemple de paragraphe",
          isFakeContent: true,
          content: "",
          type: type,
        };
      } else if (type === "etape") {
        newChild = {
          type: "etape",
          title: "",
          papiers: [],
          duree: "00",
          timeStepDuree: "minutes",
          delai: "00",
          timeStepDelai: "minutes",
          option: {},
          isFakeContent: false,
          content: "",
        };
      }
      newChild.type = type;
      if (
        subkey === null ||
        subkey === undefined ||
        subkey === "Zone d'action"
      ) {
        prevState[key].children.push(newChild);
      } else {
        prevState[key].children.splice(subkey + 1, 0, newChild);
      }
    } else {
      if (type === "card") {
        prevState[key].type = "cards";
        prevState[key].children = [
          {
            type: "card",
            isFakeContent: true,
            title: "Important !",
            titleIcon: "warning",
            contentTitle: "Compte bancaire",
            contentBody: "nécessaire pour recevoir l’indemnité",
            footer: "Pourquoi ?",
            footerIcon: "question-mark-circle-outline",
          },
        ];
      } else if (type === "map") {
        prevState[key].children = [
          { type: "map", isFakeContent: true, isMapLoaded: false, markers: [] },
        ];
      } else {
        prevState[key].children = [
          {
            title: "Nouveau sous-paragraphe",
            type: type,
          },
        ];
      }
    }
    uiArray[key].children = [
      ...(uiArray[key].children || []),
      { ...uiElement, accordion: true, varianteSelected: true },
    ];
    this.setState(
      { menu: prevState, uiArray: uiArray },
      () => (type === "card" || type === "map") && this.setColors()
    );
  };

  removeItem = (key, subkey = null) => {
    let prevState = [...this.state.menu];
    let uiArray = [...this.state.uiArray];
    if (
      prevState[key].children &&
      prevState[key].children.length > 0 &&
      (prevState[key].children.length > 1 || prevState[key].content)
    ) {
      if (subkey === null || subkey === undefined) {
        prevState[key].children.pop();
        uiArray[key].children.pop();
      } else if (prevState[key].children.length > subkey) {
        prevState[key].children.splice(subkey, 1);
        uiArray[key].children.splice(subkey, 1);
      }
    }
    this.setState({ menu: prevState });
  };

  deleteCard = (key, subkey, type) => {
    if (type === "map") {
      this.setState({ addMapBtn: true, isModified: true });
    }
    const prevState = [...this.state.menu];
    prevState[key].children = prevState[key].children.filter(
      (_, index) => index !== subkey
    );
    this.setState(
      {
        menu: prevState,
        isModified: true,
      },
      () => this.setColors()
    );
  };

  toggleModal = (show, name) => {
    if (name === "merci" && this.state.showModals.merci) {
      Swal.fire({
        title: "Yay...",
        text: "Votre suggestion a bien été enregistrée, merci",
        type: "success",
        timer: 1500,
      });
    }
    this.setState((prevState) => ({
      showModals: { ...prevState.showModals, [name]: show },
      suggestion: "",
    }));
  };

  toggleTooltip = () => {
    this.setState({ tooltipOpen: !this.state.tooltipOpen });
  };

  toggleBookmarkModal = () =>
    this.setState((prevState) => ({
      showBookmarkModal: !prevState.showBookmarkModal,
    }));
  toggleDispositifCreateModal = () =>
    this.setState((prevState) => ({
      showDispositifCreateModal: !prevState.showDispositifCreateModal,
    }));
  toggleTagsModal = () =>
    this.setState((prevState) => ({
      showTagsModal: !prevState.showTagsModal,
    }));

  toggleTutorielModal = (section) =>
    this.setState((prevState) => ({
      showTutorielModal: !prevState.showTutorielModal,
      tutorielSection: section,
    }));

  toggleDraftModal = () =>
    this.setState((prevState) => ({
      showDraftModal: !prevState.showDraftModal,
    }));

  toggleShareContentOnMobileModal = () =>
    this.setState((prevState) => ({
      showShareContentOnMobileModal: !prevState.showShareContentOnMobileModal,
    }));

  toggleTutoriel = () =>
    this.setState((prevState) => ({ displayTuto: !prevState.displayTuto }));

  toggleDispositifValidateModal = () => {
    this.setState((prevState) => ({
      showDispositifValidateModal: !prevState.showDispositifValidateModal,
      finalValidation: false,
    }));
  };
  toggleDispositifValidateModalFinal = () => {
    this.setState((prevState) => ({
      showDispositifValidateModal: !prevState.showDispositifValidateModal,
      finalValidation: false,
    }));
  };

  toggleFinalValidation = () => {
    this.setState({ finalValidation: false });
  };

  toggleInputBtnClicked = () =>
    this.setState((prevState) => ({
      inputBtnClicked: !prevState.inputBtnClicked,
    }));

  toggleNiveau = (selectedLevels, key, subkey) => {
    this.setState(
      {
        menu: [...this.state.menu].map((x, i) =>
          i === key
            ? {
                ...x,
                children: x.children.map((y, ix) =>
                  ix === subkey ? { ...y, niveaux: selectedLevels } : y
                ),
              }
            : x
        ),
      },
      () => this.setColors()
    );
  };

  toggleFree = (key, subkey) =>
    this.setState({
      menu: [...this.state.menu].map((x, i) =>
        i === key
          ? {
              ...x,
              children: x.children.map((y, ix) =>
                ix === subkey
                  ? { ...y, free: !y.free, isFakeContent: false }
                  : y
              ),
            }
          : x
      ),
      isModified: true,
    });
  changeDepartements = (departments, key, subkey) =>
    this.setState(
      {
        menu: [...this.state.menu].map((x, i) =>
          i === key
            ? {
                ...x,
                children: x.children.map((y, ix) =>
                  ix === subkey
                    ? { ...y, departments: departments, isFakeContent: false }
                    : y
                ),
              }
            : x
        ),
        isModified: true,
      },
      () => this.setColors()
    );
  changePrice = (e, key, subkey) =>
    this.setState({
      menu: [...this.state.menu].map((x, i) =>
        i === key
          ? {
              ...x,
              children: x.children.map((y, ix) =>
                ix === subkey
                  ? { ...y, price: e.target.value, isFakeContent: false }
                  : y
              ),
            }
          : x
      ),
      isModified: true,
    });
  changeAge = (e, key, subkey, isBottom = true) =>
    this.setState({
      menu: [...this.state.menu].map((x, i) =>
        i === key
          ? {
              ...x,
              children: x.children.map((y, ix) =>
                ix === subkey
                  ? {
                      ...y,
                      [isBottom ? "bottomValue" : "topValue"]: (
                        e.target.value || ""
                      ).replace(/\D/g, ""),
                      isFakeContent: false,
                    }
                  : y
              ),
            }
          : x
      ),
      isModified: true,
    });
  setMarkers = (markers, key, subkey) => {
    this.setState({
      menu: [...this.state.menu].map((x, i) =>
        i === key
          ? {
              ...x,
              children: x.children.map((y, ix) =>
                ix === subkey ? { ...y, markers, isFakeContent: false } : y
              ),
            }
          : x
      ),
    });
  };

  toggleHelp = () =>
    this.setState((prevState) => ({ withHelp: !prevState.withHelp }));

  bookmarkDispositif = () => {
    this.setState({ showSpinnerBookmark: true });
    if (API.isAuth()) {
      if (this.state.pinned) {
        user.cookies.dispositifsPinned = user.cookies.dispositifsPinned.filter(
          (x) => x._id !== this.state.dispositif._id
        );
      } else {
        user.cookies.dispositifsPinned = [
          ...(user.cookies.dispositifsPinned || []),
          { _id: this.state._id, datePin: new Date() },
        ];
      }
      API.set_user_info(user).then(() => {
        this.props.fetchUser();
        this._isMounted &&
          this.setState((pS) => ({
            showSpinnerBookmark: false,
            showBookmarkModal: !pS.pinned,
            pinned: !pS.pinned,
            isAuth: true,
          }));
      });
    } else {
      this.setState(() => ({
        showSpinnerBookmark: false,
        showBookmarkModal: true,
        isAuth: false,
      }));
    }
  };

  changeCardTitle = (key, subkey, node, value) => {
    const prevState = [...this.state.menu];
    //var menuObj = [...menu[1].children]
    if (node === "title") {
      prevState[key].children[subkey] = menuDispositif[1].children
        .concat(importantCard)
        .find((x) => x.title === value);
    } else {
      prevState[key].children[subkey][node] = value;
    }
    this.setState({ menu: prevState, isModified: true });
  };

  changeTag = (key, value) => {
    this.setState(
      {
        tags: this.state.tags.map((x, i) => (i === key ? value : x)),
        ...(key === 0 && {
          mainTag: filtres.tags.find((x) => x.short === value.short),
        }),
      },
      () => {
        if (key === 0) {
          this.setColors();
        }
      }
    );
  };

  addTag = (tags) => {
    this.setState({ tags: tags });
  };

  validateTags = (tags) => {
    this.setState({ tags: tags, mainTag: tags[0] }, () => this.setColors());
  };

  openTag = () => {
    this.setState({ showTagsModal: true });
  };

  deleteTag = (idx) =>
    this.setState({ tags: [...this.state.tags].filter((_, i) => i !== idx) });

  addSponsor = (sponsor) =>
    this.setState({
      sponsors: [
        ...(this.state.sponsors || []).filter((x) => !x.dummy),
        sponsor,
      ],
    });

  addMainSponsor = (sponsor) =>
    this.setState({
      mainSponsor: sponsor,
    });

  deleteMainSponsor = () => {
    this.setState({
      mainSponsor: {},
    });
  };

  editSponsor = (key, sponsor) => {
    const newItems = [...this.state.sponsors];
    newItems[key] = sponsor;
    this.setState({ sponsors: newItems });
  };

  deleteSponsor = (key) => {
    if (
      (this.state.status === "Accepté structure" ||
        this.state.status === "Actif" ||
        this.state.status === "En attente admin") &&
      !this.props.admin
    ) {
      Swal.fire({
        title: "Oh non!",
        text: "Vous ne pouvez plus supprimer de structures partenaires",
        type: "error",
        timer: 1500,
      });
      return;
    }
    this.setState({
      sponsors: (this.state.sponsors || []).filter((_, i) => i !== key),
    });
  };

  deleteMainSponsor = () => {
    if (
      (this.state.status === "Accepté structure" ||
        this.state.status === "Actif" ||
        this.state.status === "En attente admin") &&
      !this.props.admin
    ) {
      Swal.fire({
        title: "Oh non!",
        text: "Vous ne pouvez plus supprimer de structures partenaires",
        type: "error",
        timer: 1500,
      });
      return;
    }
    this.setState({
      mainSponsor: {},
    });
  };

  goBack = () => {
    if (
      this.props.location.state &&
      this.props.location.state.previousRoute &&
      this.props.location.state.previousRoute === "advanced-search"
    ) {
      // this.props.history.go(-1);
    } else {
      this.props.router.push({ pathname: "/advanced-search" });
    }
  };

  closePdf = () => {
    this.setState({ showSpinnerPrint: false, printing: false });
  };

  createPdf = () => {
    initGA();
    Event("EXPORT_PDF", this.props.languei18nCode, "label");
    let uiArray = [...this.state.uiArray];
    uiArray = uiArray.map((x) => ({
      ...x,
      accordion: true,
      ...(x.children && {
        children: x.children.map((y) => {
          return { ...y, accordion: true };
        }),
      }),
    }));
    this.setState({ uiArray: uiArray, showSpinnerPrint: true, printing: true });
  };

  printPdf = () => {
    window.print();
  };

  editDispositif = (_ = null, disableEdit = false) => {
    /* this.props.history.push({
      state: {
        editable: true,
      },
    }); */
    this.setState(
      (pS) => ({
        disableEdit: disableEdit,
        uiArray: pS.menu.map((x, i) => ({
          ...uiElement,
          ...(pS.uiArray.length > i && {
            varianteSelected: pS.uiArray[i].varianteSelected,
          }),
          ...(x.children && {
            children: x.children.map((_, j) => ({
              ...uiElement,
              ...(pS.uiArray.length > i &&
                pS.uiArray[i] &&
                pS.uiArray[i].children &&
                pS.uiArray[i].children.length > j && {
                  varianteSelected: pS.uiArray[i].children[j].varianteSelected,
                }),
              accordion: !disableEdit,
            })),
          }),
        })),
      }),
      () => this.setColors()
    );
  };

  // save reaction and display modal of success
  pushReaction = (modalName = null, fieldName) => {
    // for a "Merci" modalName is null and fieldName is merci
    if (modalName) {
      this.toggleModal(false, modalName);
    }
    const dispositif = {
      dispositifId: this.state._id,
      keyValue: this.state.tKeyValue,
      subkey: this.state.tSubkey,
      fieldName: fieldName,
      type: "add",
      ...(this.state.suggestion && { suggestion: h2p(this.state.suggestion) }),
    };

    API.updateDispositifReactions(dispositif).then(() => {
      if (this._isMounted) {
        Swal.fire({
          title: "Yay...",
          text: "Votre réaction a bien été enregistrée, merci",
          type: "success",
          timer: 1500,
        });
        fieldName === "merci" && this.setState({ didThank: true });
      }
    });
  };

  update_status = (status) => {
    let dispositif = {
      status: status,
      dispositifId: this.state._id,
    };
    API.updateDispositifStatus({ query: dispositif }).then(() => {
      this.props.fetchDispositifs();
      this.props.fetchSelectedDispositif(this.state._id);
      this._isMounted &&
        this.setState({
          status: status,
          disableEdit: status !== "Accepté structure",
        });
      if (status === "Rejeté structure") {
        this.props.router.push("/backend/user-dash-structure");
      }
    });
  };

  computeContributors = (translators, creator) => {
    if (translators) {
      translators.push(creator);
      return translators;
    }
    return [creator];
  };

  valider_dispositif = (
    status = "En attente",
    auto = false,
    sauvegarde = false,
    saveAndEdit = false,
    continueEditing = true
  ) => {
    this.setState({ isDispositifLoading: !auto });
    let content = { ...this.state.content };

    Object.keys(content).map((k) => (content[k] = h2p(content[k])));
    // do not save automatically when lecture mode
    if (
      auto &&
      (!Object.keys(content).some(
        (k) => content[k] && content[k] !== contenu[k]
      ) ||
        this.state.disableEdit)
    ) {
      return;
    }
    //we delete the infocard geoloc if it's empty
    if (
      this.state.menu &&
      this.state.menu[1] &&
      this.state.menu[1].children &&
      this.state.menu[1].children.length > 0
    ) {
      var geolocInfoCard = this.state.menu[1].children.find(
        (elem) => elem.title === "Zone d'action"
      );
      if (
        geolocInfoCard &&
        (!geolocInfoCard.departments || geolocInfoCard.departments.length < 1)
      ) {
        var index = this.state.menu[1].children.indexOf(geolocInfoCard);
        if (index > -1) {
          this.state.menu[1].children.splice(index, 1);
        }
      }
    }
    let dispositif = {
      ...content,
      contenu: [...this.state.menu].map((x) => {
        const hasNewContent =
          x.editable && x.editorState && x.editorState.getCurrentContent();
        // if user removed text with store empty string without html balise (so that it works with translation)

        const content =
          hasNewContent &&
          x.editorState.getCurrentContent().getPlainText() !== ""
            ? convertToHTML(customConvertOption)(
                x.editorState.getCurrentContent()
              )
            : "";
        return {
          title: x.title,
          ...{
            content: hasNewContent ? content : x.content,
          },

          editable: false,
          type: x.type,
          ...(x.children && {
            children: x.children.map((y) => {
              const { editorState, ...noEditor } = y;
              const hasNewContent =
                y.editable &&
                y.editorState &&
                y.editorState.getCurrentContent();
              // if user removed text with store empty string without html balise (so that it works with translation)

              const content =
                hasNewContent &&
                y.editorState.getCurrentContent().getPlainText() !== ""
                  ? convertToHTML(customConvertOption)(
                      y.editorState.getCurrentContent()
                    )
                  : "";
              return {
                ...noEditor,
                ...(hasNewContent && { content }),

                editable: false,
                ...(y.title && { title: h2p(y.title) }),
              };
            }),
          }),
        };
      }),
      sponsors: (this.state.sponsors || []).filter((x) => !x.dummy),
      tags: this.state.tags,
      avancement: 1,
      status: status,
      typeContenu: this.state.typeContenu,
      ...{ dispositifId: this.state._id },
      ...(!this.state._id &&
        this.state.status !== "Brouillon" && { timeSpent: this.state.time }),
      autoSave: auto,
    };
    dispositif.mainSponsor = this.state.mainSponsor._id || null;
    const mainSponsorPopulate = this.state.mainSponsor;
    let cardElement =
      (this.state.menu.find((x) => x.title === "C'est pour qui ?") || [])
        .children || [];

    dispositif.audienceAge = cardElement.some((x) => x.title === "Âge requis")
      ? cardElement
          .filter((x) => x.title === "Âge requis")
          .map((x) => {
            if (x.contentTitle === "De ** à ** ans") {
              return {
                contentTitle: x.contentTitle,
                bottomValue: parseInt(x.bottomValue, 10),
                topValue: parseInt(x.topValue, 10),
              };
            }
            if (x.contentTitle === "Plus de ** ans") {
              return {
                contentTitle: x.contentTitle,
                bottomValue: parseInt(x.bottomValue, 10),
                topValue: 999,
              };
            }

            return {
              contentTitle: x.contentTitle,
              bottomValue: -1,
              topValue: parseInt(x.topValue, 10),
            };
          })
      : [{ contentTitle: "Plus de ** ans", bottomValue: -1, topValue: 999 }];
    if (dispositif.typeContenu === "dispositif") {
      dispositif.niveauFrancais = cardElement.some(
        (x) => x.title === "Niveau de français"
      )
        ? cardElement
            .filter((x) => x.title === "Niveau de français")
            .map((x) => x.contentTitle)
        : filtres.niveauFrancais;
    } else {
      delete dispositif.titreMarque;
    }
    if (status !== "Brouillon") {
      if (
        this.state.status &&
        this.state._id &&
        ![
          "",
          "En attente non prioritaire",
          "Brouillon",
          "Accepté structure",
        ].includes(this.state.status)
      ) {
        dispositif.status = this.state.status;
      } else if (dispositif.mainSponsor) {
        const mainSponsor = mainSponsorPopulate;
        const membre = mainSponsor
          ? (mainSponsor.membres || []).find(
              (x) => x.userId === this.props.userId
            )
          : [];
        if (
          ((membre &&
            membre.roles &&
            membre.roles.some(
              (x) => x === "administrateur" || x === "contributeur"
            )) ||
            this.props.admin) &&
          !sauvegarde
        ) {
          dispositif.status = "En attente admin";
        }
      } else {
        dispositif.status = "En attente non prioritaire";
      }
    }
    dispositif.lastModificationDate = Date.now();
    logger.info("[valider_dispositif] dispositif before call", { dispositif });
    API.addDispositif(dispositif).then((data) => {
      const newDispo = data.data.data;
      if (!continueEditing) {
        let text =
          dispositif.status === "Brouillon"
            ? "Retrouvez votre fiche dans votre espace « Mes Fiches ». Attention, votre fiche va rester en brouillon. Pour la publier, cliquez sur le bouton valider en vert, plutôt que sur enregistrer."
            : "Retrouvez votre fiche dans votre espace « Mes Fiches ».";

        Swal.fire({
          title: "Fiche enregistrée",
          text: text,
          type: "success",
        });
      }
      if (!auto && this._isMounted) {
        Swal.fire("Yay...", "Enregistrement réussi !", "success").then(() => {
          this.props.fetchUser();
          this.props.fetchDispositifs();
          this.setState(
            {
              status: dispositif.status,
              disableEdit:
                [
                  "En attente admin",
                  "En attente",
                  "Brouillon",
                  "En attente non prioritaire",
                  "Actif",
                ].includes(status) && !saveAndEdit,
              isDispositifLoading: false,
            },
            () => {
              this.props.router.push(
                "/" + dispositif.typeContenu + "/" + newDispo._id
              );
            }
          );
        });
      } else if (this._isMounted) {

        if (isInBrowser()) {
          NotificationManager.success(
            "Retrouvez votre contribution dans votre page 'Mon profil'",
            "Enregistrement automatique",
            5000,
            () => {
              Swal.fire(
                "Enregistrement automatique",
                "Retrouvez votre contribution dans votre page 'Mon profil'",
                "success"
              );
            }
          );
        }
        this.setState({ _id: newDispo._id });
      }
    });
  };

  upcoming = () =>
    Swal.fire({
      title: "Oh non!",
      text: "Cette fonctionnalité n'est pas encore disponible",
      type: "error",
      timer: 1500,
    });
  createPossibleLanguagesObject = (avancement, langues) => {
    let possibleLanguages = [];
    if (avancement) {
      Object.keys(avancement).forEach((item) => {
        let lng = langues.find(
          (langue) => langue.i18nCode === item && item !== "fr"
        );
        if (lng) possibleLanguages.push(lng);
      });
    }
    return possibleLanguages;
  };
  render() {
    const isRTL = ["ar", "ps", "fa"].includes(i18n.language);
    const { t, translating } = this.props;
    const windowWidth = isInBrowser() ? window.innerWidth : 0;
    const {
      showModals,
      isDispositifLoading,
      typeContenu,
      disableEdit,
      printing,
      didThank,
      mainTag,
    } = this.state;
    const tag =
      mainTag && mainTag.short ? mainTag.short.split(" ").join("-") : "noImage";

    let possibleLanguages = this.createPossibleLanguagesObject(
      this.state.dispositif.avancement,
      this.props.langues
    );

    let langueSelected = this.props.langues.find(
      (item) => item.i18nCode === this.props.languei18nCode
    );

    const isTranslated =
      (this.state.dispositif.avancement &&
        this.state.dispositif.avancement[this.props.languei18nCode] &&
        this.state.dispositif.avancement[this.props.languei18nCode] === 1) ||
      this.props.languei18nCode === "fr";
    return (
      <div
        id="dispositif"
        className={
          "animated fadeIn dispositif vue" +
          (!disableEdit
            ? " edition-mode"
            : isMobile
            ? ""
            : translating
            ? " side-view-mode"
            : printing && isRTL
            ? " printing-mode print-rtl"
            : printing && !isRTL
            ? " printing-mode"
            : " reading-mode")
        }
        ref={this.newRef}
      >
        <Row className="main-row">
          {translating && (
            {/* <Col xl="4" lg="4" md="4" sm="4" xs="4" className="side-col">
              {!this.props.isExpert ? (
                <SideTrad
                  menu={this.state.menu}
                  content={this.state.content}
                  updateUIArray={this.updateUIArray}
                  typeContenu={typeContenu}
                  {...this.props}
                />
              ) : (
                <ExpertSideTrad
                  menu={this.state.menu}
                  content={this.state.content}
                  updateUIArray={this.updateUIArray}
                  typeContenu={typeContenu}
                  {...this.props}
                />
              )}
            </Col> */}
          )}
          <Col
            xl={translating ? "8" : "12"}
            lg={translating ? "8" : "12"}
            md={translating ? "8" : "12"}
            sm={translating ? "8" : "12"}
            xs={translating ? "8" : "12"}
            className="main-col"
          >
            <section className={styles.banniere+ " " + styles[tag]}>
              {!disableEdit && (
                // yellow banner in top of a demarche to create a variante
                // To see this component, create a new demarche then select an existing demarche
                <BandeauEdition
                  typeContenu={typeContenu}
                  toggleTutoriel={this.toggleTutoriel}
                  displayTuto={this.state.displayTuto}
                  toggleDispositifValidateModal={
                    this.toggleDispositifValidateModal
                  }
                  isModified={this.state.isModified}
                  isSaved={this.state.isSaved}
                  toggleDraftModal={this.toggleDraftModal}
                  tKeyValue={this.state.tKeyValue}
                  toggleDispositifCreateModal={this.toggleDispositifCreateModal}
                />
              )}
              <Row className={styles.row}>
                {windowWidth >= breakpoints.smLimit && (
                  <BackButton goBack={this.goBack} />
                )}

                <TopRightHeader
                  disableEdit={this.state.disableEdit}
                  withHelp={this.state.withHelp}
                  showSpinnerBookmark={this.state.showSpinnerBookmark}
                  pinned={this.state.pinned}
                  bookmarkDispositif={this.bookmarkDispositif}
                  toggleHelp={this.toggleHelp}
                  toggleModal={this.toggleModal}
                  toggleDispositifValidateModal={
                    this.toggleDispositifValidateModal
                  }
                  toggleTutoModal={this.toggleTutorielModal}
                  editDispositif={this.editDispositif}
                  valider_dispositif={this.valider_dispositif}
                  toggleDispositifCreateModal={this.toggleDispositifCreateModal}
                  translating={translating}
                  status={this.state.status}
                  typeContenu={typeContenu}
                  langue={i18n.language}
                  t={t}
                />
              </Row>
              <Col lg="12" md="12" sm="12" xs="12" className={styles.title}>
                <div className={styles.bloc_title}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    {isMobile && (
                      <div>
                        <div className={styles.mobile_title}>
                          <div className={styles.mobile_title_text}>
                            {this.state.content.titreInformatif || ""}
                          </div>
                        </div>
                        {typeContenu === "dispositif" && (
                          <div className={styles.mobile_title_sponsor}>
                            <div className={styles.mobile_title_text}>
                              <span>{t("Dispositif.avec", "avec")}&nbsp;</span>
                              {this.state.content.titreMarque || ""}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {!isMobile && (
                      <div>
                        <h1 className={disableEdit ? "" : "editable"}>
                          {
                            // Display and edition of titreInformatif
                            <ContentEditable
                              id="titreInformatif"
                              html={this.state.content.titreInformatif || ""} // innerHTML of the editable div
                              disabled={disableEdit}
                              onClick={(e) => {
                                if (!disableEdit) {
                                  this.onInputClicked(e);
                                }
                              }}
                              onChange={this.handleChange}
                              onMouseEnter={(e) => {
                                this.updateUIArray(-4);
                                e.target.focus();
                              }}
                              onKeyPress={(e) => this.handleKeyPress(e, 0)}
                            />
                          }
                        </h1>
                        {typeContenu === "dispositif" && (
                          <h2 className={styles.bloc_subtitle}>
                            <span>{t("Dispositif.avec", "avec")}&nbsp;</span>
                            {
                              // Display and edition of titreMarque
                              <ContentEditable
                                id="titreMarque"
                                html={this.state.content.titreMarque || ""} // innerHTML of the editable div
                                disabled={this.state.disableEdit}
                                onClick={(e) => {
                                  this.onInputClicked(e);
                                }}
                                onChange={this.handleChange}
                                onKeyDown={this.onInputClicked}
                                onMouseEnter={(e) => {
                                  this.updateUIArray(-3);
                                  e.target.focus();
                                }}
                                onKeyPress={(e) => this.handleKeyPress(e, 1)}
                              />
                            }
                          </h2>
                        )}
                      </div>
                    )}
                    {!this.state.disableEdit &&
                      typeContenu === "dispositif" &&
                      this.state.displayTuto && (
                        <div style={{ marginTop: "16px" }}>
                          <FButton
                            type="tuto"
                            name={"play-circle-outline"}
                            className="ml-10"
                            onClick={() => this.toggleTutorielModal("Titre")}
                          >
                            Tutoriel
                          </FButton>
                        </div>
                      )}
                  </div>
                </div>
              </Col>
            </section>

            {!isMobile && (
              <Row className="tags-row backgroundColor-darkColor">
                <Col
                  style={{ display: "flex", alignItems: "center" }}
                  lg="8"
                  md="8"
                  sm="8"
                  xs="8"
                  className="col right-bar"
                >
                  {
                    // display En bref banner if content is a dispositif or if content is a demarch but not in edition mode
                    (disableEdit || typeContenu !== "demarche") && (
                      // TO DO : connect component to store when store updated after changing infocards
                      <EnBrefBanner menu={this.state.menu} isRTL={isRTL} />
                    )
                  }
                </Col>

                <Col lg="4" md="4" sm="4" xs="4" className="tags-bloc">
                  {
                    // Tags on the right of a dispositif or a demarche
                    <Tags
                      tags={this.state.tags}
                      disableEdit={this.state.disableEdit}
                      changeTag={this.changeTag}
                      addTag={this.addTag}
                      openTag={this.openTag}
                      deleteTag={this.deleteTag}
                      // history={this.props.history}
                      toggleTutorielModal={this.toggleTutorielModal}
                      displayTuto={this.state.displayTuto}
                      updateUIArray={this.updateUIArray}
                      isRTL={isRTL}
                      t={t}
                      typeContenu={typeContenu}
                    />
                  }
                </Col>
              </Row>
            )}

            <Row className="no-margin-right">
              {!translating && !printing && !isMobile && (
                <Col
                  xl="3"
                  lg="3"
                  md="12"
                  sm="12"
                  xs="12"
                  className="left-side-col pt-40"
                >
                  {
                    // left part of the dispositif/demarche to navigate in sections, go to external website, download in pdf, send by mail, by sms and print
                    <LeftSideDispositif
                      menu={this.state.menu}
                      showSpinner={this.state.showSpinnerPrint}
                      content={this.state.content}
                      inputBtnClicked={this.state.inputBtnClicked}
                      disableEdit={this.state.disableEdit}
                      toggleInputBtnClicked={this.toggleInputBtnClicked}
                      handleScrollSpy={this.handleScrollSpy}
                      createPdf={this.createPdf}
                      closePdf={this.closePdf}
                      newRef={this.newRef}
                      handleChange={this.handleChange}
                      typeContenu={typeContenu}
                      toggleTutorielModal={this.toggleTutorielModal}
                      displayTuto={this.state.displayTuto}
                      updateUIArray={this.updateUIArray}
                      toggleShowPdfModal={this.toggleShowPdfModal}
                    />
                  }
                </Col>
              )}

              <Col
                xl={translating || printing ? "12" : "7"}
                lg={translating || printing ? "12" : "7"}
                md={translating || printing ? "12" : "10"}
                sm={translating || printing ? "12" : "10"}
                xs="12"
                className="pt-40 col-middle"
                id={"pageContent"}
              >
                {isMobile && (
                  //On Mobile device only, button to show modal with sharing options.
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      margin: 10,
                    }}
                  >
                    <FButton
                      type="outline-black"
                      name={"share-outline"}
                      onClick={() => this.toggleShareContentOnMobileModal()}
                    >
                      {this.props.t(
                        "Dispositif.Partager Fiche",
                        "Partager la Fiche"
                      )}
                    </FButton>
                  </div>
                )}
                {!isTranslated && this.state.showAlertBoxLanguage && (
                  <InfoBoxLanguageContainer>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <EVAIcon
                        name={"alert-triangle"}
                        fill={colors.blanc}
                        className="mr-10"
                      ></EVAIcon>
                      <div>
                        {t(
                          "Dispositifs.Cette fiche n'est pas dispo",
                          "Cette fiche n'est pas encore disponible en :"
                        )}
                        {langueSelected
                          ? " " + langueSelected.langueLoc + "."
                          : ""}
                        {possibleLanguages.length
                          ? t(
                              "Dispositifs.Vous pouvez la lire en plusieurs langues",
                              " Vous pouvez la lire en français ou sélectionner une autre langue ci-dessous."
                            )
                          : t(
                              "Dispositifs.Vous pouvez la lire en français",
                              " Vous pouvez la lire en français ci-dessous"
                            )}
                      </div>
                    </div>
                    <EVAIcon
                      style={{ cursor: "pointer" }}
                      onClick={this.toggleAlertBoxLanguage}
                      name={"close"}
                      fill={colors.blanc}
                      className="ml-10"
                    ></EVAIcon>
                  </InfoBoxLanguageContainer>
                )}
                <div
                  style={
                    isMobile
                      ? {}
                      : { display: "flex", justifyContent: "flex-start", flexWrap: "wrap" }
                  }
                >
                  {disableEdit && this.state.dispositif.lastModificationDate && (
                    // Part about last update
                    <Row className="fiabilite-row">
                      <Col
                        lg="auto"
                        md="auto"
                        sm="auto"
                        xs="auto"
                        className="col align-right"
                      >
                        {t(
                          "Dispositif.Dernière mise à jour",
                          "Dernière mise à jour"
                        )}{" "}
                        :&nbsp;
                        <span className="date-maj">
                          {moment(
                            _.get(
                              this.state,
                              "dispositif.lastModificationDate",
                              0
                            )
                          ).format("ll")}
                        </span>
                      </Col>
                    </Row>
                  )}
                  {!isTranslated && possibleLanguages.length ? (
                    <TextOtherLanguageContainer>
                      {t("Dispositif.Lire en", "Lire en :")}
                      {langueSelected && isMobile ? (
                        <FButton
                          type="white"
                          className="ml-10 mb-2"
                          onClick={this.toggleShowLanguageModal}
                        >
                          <i
                            className={
                              "flag-icon flag-icon-" +
                              possibleLanguages[0].langueCode
                            }
                            title={possibleLanguages[0].langueCode}
                            id={possibleLanguages[0].langueCode}
                          />

                          <span className="ml-10 language-name">
                            {possibleLanguages[0].langueLoc || "Langue"}
                          </span>
                          <EVAIcon
                            name={"chevron-down-outline"}
                            fill={colors.noir}
                            className="ml-10"
                            size="xlarge"
                          ></EVAIcon>
                        </FButton>
                      ) : langueSelected ? (
                        possibleLanguages.map((langue, index) => {
                          return (
                            <FButton
                              key={index}
                              type="white"
                              className="ml-10 mb-2"
                              onClick={() => {
                                initGA();
                                Event(
                                  "CHANGE_LANGUAGE",
                                  langue.i18nCode,
                                  "label"
                                );
                                this.props.changeLanguage(langue.i18nCode);
                              }}
                            >
                              <i
                                className={
                                  "flag-icon flag-icon-" + langue.langueCode
                                }
                                title={langue.langueCode}
                                id={langue.langueCode}
                              />

                              <span className="ml-10 language-name">
                                {langue.langueLoc || "Langue"}
                              </span>
                            </FButton>
                          );
                        })
                      ) : null}
                    </TextOtherLanguageContainer>
                  ) : null}
                </div>

                <ContenuDispositif
                  showMapButton={this.showMapButton}
                  updateUIArray={this.updateUIArray}
                  handleContentClick={this.handleContentClick}
                  handleMenuChange={this.handleMenuChange}
                  onEditorStateChange={this.onEditorStateChange}
                  toggleModal={this.toggleModal}
                  deleteCard={this.deleteCard}
                  addItem={this.addItem}
                  sideView={this.state.sideView}
                  typeContenu={this.state.typeContenu}
                  uiArray={this.state.uiArray}
                  t={this.state.t}
                  disableEdit={this.state.disableEdit}
                  menu={this.state.menu}
                  removeItem={this.removeItem}
                  changeTitle={this.changeCardTitle}
                  disableIsMapLoaded={this.disableIsMapLoaded}
                  toggleNiveau={this.toggleNiveau}
                  changeDepartements={this.changeDepartements}
                  changeAge={this.changeAge}
                  changePrice={this.changePrice}
                  toggleFree={this.toggleFree}
                  setMarkers={this.setMarkers}
                  filtres={filtres}
                  readAudio={this.readAudio}
                  stopAudio={this.stopAudio}
                  demarcheSteps={demarcheSteps}
                  upcoming={this.upcoming}
                  toggleTutorielModal={this.toggleTutorielModal}
                  displayTuto={this.state.displayTuto}
                  addMapBtn={this.state.addMapBtn}
                  printing={printing}
                  admin={this.props.admin}
                  toggleGeolocModal={this.toggleGeolocModal}
                  showGeolocModal={this.state.showGeolocModal}
                  toggleShareContentOnMobileModal={
                    this.toggleShareContentOnMobileModal
                  }
                  // TO DO : remove spread state
                  {...this.state}
                />

                {this.state.disableEdit && (
                  <>
                    {!printing && (
                      <FeedbackFooter
                        pushReaction={this.pushReaction}
                        didThank={didThank}
                        color={this.state.mainTag.darkColor}
                        nbThanks={
                          this.state.dispositif.merci
                            ? this.state.dispositif.merci.length
                            : 0
                        }
                      />
                    )}
                    {!printing && !isMobile && (
                      <div className="discussion-footer backgroundColor-darkColor">
                        <h5>{t("Dispositif.Avis", "Avis et discussions")}</h5>
                        <span>
                          {t("Bientôt disponible !", "Bientôt disponible !")}
                        </span>
                      </div>
                    )}
                    {this.state.contributeurs.length > 0 &&
                      !isMobile &&
                      !printing && (
                        <div className="bottom-wrapper">
                          <ContribCaroussel
                            contributeurs={this.state.contributeurs}
                          />
                        </div>
                      )}
                  </>
                )}

                <Sponsors
                  ref={this.sponsors}
                  sponsors={this.state.sponsors}
                  mainSponsor={this.state.mainSponsor}
                  disableEdit={disableEdit}
                  addSponsor={this.addSponsor}
                  deleteSponsor={this.deleteSponsor}
                  addMainSponsor={this.addMainSponsor}
                  deleteMainSponsor={this.deleteMainSponsor}
                  editSponsor={this.editSponsor}
                  admin={this.props.admin}
                  validate={this.toggleDispositifValidateModalFinal}
                  t={t}
                  finalValidation={this.state.finalValidation}
                  toggleFinalValidation={this.toggleFinalValidation}
                  toggleTutorielModal={this.toggleTutorielModal}
                  displayTuto={this.state.displayTuto}
                  updateUIArray={this.updateUIArray}
                  dispositif={this.state.dispositif}
                  typeContenu={typeContenu}
                  toggleDispositifValidateModal={
                    this.toggleDispositifValidateModal
                  }
                />
              </Col>
              {!isMobile && (
                <Col
                  xl="2"
                  lg="2"
                  md="2"
                  sm="2"
                  xs="2"
                  className={
                    "aside-right pt-40" + (translating ? " sideView" : "")
                  }
                />
              )}
            </Row>

            <ReactionModal
              showModals={showModals}
              toggleModal={this.toggleModal}
              onChange={this.handleModalChange}
              suggestion={this.state.suggestion}
              onValidate={this.pushReaction}
            />

            <ResponsableModal
              name="responsable"
              show={showModals.responsable}
              toggleModal={this.toggleModal}
              createur={this.state.creator}
              mainSponsor={this.state.mainSponsor}
              editDispositif={this.editDispositif}
              update_status={this.update_status}
              sponsors={this.state.sponsors}
            />
            <RejectionModal
              name="rejection"
              show={showModals.rejection}
              toggleModal={this.toggleModal}
              createur={this.state.creator}
              mainSponsor={this.state.mainSponsor}
              editDispositif={this.editDispositif}
              update_status={this.update_status}
              sponsors={this.state.sponsors}
            />

            <PdfCreateModal
              createPdf={this.createPdf}
              t={this.props.t}
              show={this.state.showPdfModal}
              toggle={this.toggleShowPdfModal}
              printPdf={this.printPdf}
              closePdf={this.closePdf}
              newRef={this.newRef}
            />

            <BookmarkedModal
              t={this.props.t}
              success={this.state.isAuth}
              show={this.state.showBookmarkModal}
              toggle={this.toggleBookmarkModal}
            />
            {typeContenu === "dispositif" && (
              <DispositifCreateModal
                show={this.state.showDispositifCreateModal}
                toggle={this.toggleDispositifCreateModal}
                typeContenu={typeContenu}
                navigateToCommentContribuer={() =>
                  this.props.router.push("/comment-contribuer")
                }
              />
            )}
            <DispositifValidateModal
              show={this.state.showDispositifValidateModal}
              typeContenu={typeContenu}
              toggle={this.toggleDispositifValidateModal}
              abstract={this.state.content.abstract}
              onChange={this.handleChange}
              titreInformatif={this.state.content.titreInformatif}
              titreMarque={this.state.content.titreMarque}
              validate={this.valider_dispositif}
              toggleTutorielModal={this.toggleTutorielModal}
              tags={this.state.tags}
              mainSponsor={this.state.mainSponsor}
              menu={this.state.menu}
              toggleTagsModal={this.toggleTagsModal}
              toggleSponsorModal={() =>
                this.sponsors.current.toggleModal("responsabilite")
              }
              toggleGeolocModal={this.toggleGeolocModal}
              addItem={this.addItem}
            />
            <TagsModal
              tags={this.state.tags}
              validate={this.validateTags}
              categories={filtres.tags}
              show={this.state.showTagsModal}
              toggle={this.toggleTagsModal}
              toggleTutorielModal={this.toggleTutorielModal}
              user={this.props.user}
              // history={this.props.history}
              dispositifId={this.state.dispositif._id}
            />
            <FrameModal
              show={this.state.showTutorielModal}
              toggle={this.toggleTutorielModal}
              section={this.state.tutorielSection}
            />
            <LanguageToReadModal
              show={this.state.showLanguageToReadModal}
              toggle={this.toggleShowLanguageModal}
              t={this.props.t}
              languages={possibleLanguages}
              changeLanguage={this.props.changeLanguage}
            />

            <DraftModal
              show={this.state.showDraftModal}
              toggle={this.toggleDraftModal}
              valider_dispositif={this.valider_dispositif}
              navigateToMiddleOffice={() =>
                this.props.router.push("/backend/user-dash-contrib")
              }
              status={this.state.status}
              toggleIsModified={this.toggleIsModified}
              toggleIsSaved={this.toggleIsSaved}
            />
            <ShareContentOnMobileModal
              show={this.state.showShareContentOnMobileModal}
              toggle={this.toggleShareContentOnMobileModal}
              typeContenu={typeContenu}
              content={this.state.content}
              t={this.props.t}
            />

            {isInBrowser() && <NotificationContainer />}

            {isDispositifLoading && (
              <div className="ecran-protection no-main">
                <div className="content-wrapper">
                  <h1 className="mb-3">{t("Chargement", "Chargement")}...</h1>
                  <Spinner color="success" />
                </div>
              </div>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    languei18nCode: state.langue.languei18nCode,
    user: state.user.user,
    userId: state.user.userId,
    admin: state.user.admin,
    userFetched: state.user.userFetched,
    langues: state.langue.langues,
  };
};

const mapDispatchToProps = {
  fetchDispositifs: fetchActiveDispositifsActionsCreator,
  fetchUser: fetchUserActionCreator,
  fetchSelectedDispositif: fetchSelectedDispositifActionCreator,
  updateUiArray: updateUiArrayActionCreator,
  updateSelectedDispositif: updateSelectedDispositifActionCreator,
  fetchActiveStructures: fetchActiveStructuresActionCreator,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(withTranslation()(Dispositif)));
