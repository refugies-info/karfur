import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import track from "react-tracking";
import { Col, Row, Modal, Spinner } from "reactstrap";
import { connect } from "react-redux";
import ContentEditable from "react-contenteditable";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import htmlToDraft from "html-to-draftjs";
import {
  EditorState,
  convertToRaw,
  convertFromRaw,
  ContentState
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import { savePDF } from "@progress/kendo-react-pdf";
import moment from "moment/min/moment-with-locales";
import Swal from "sweetalert2";
import Icon from "react-eva-icons";
import h2p from "html2plaintext";
import ReactJoyride, { ACTIONS, EVENTS, STATUS } from "react-joyride";
import _ from "lodash";
import querySearch from "stringquery";
import { convertToHTML } from "draft-convert";
import windowSize from "react-window-size";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import "../../../node_modules/video-react/dist/video-react.css";

import API from "../../utils/API";
import Sponsors from "../../components/Frontend/Dispositif/Sponsors/Sponsors";
import ContenuDispositif from "../../components/Frontend/Dispositif/ContenuDispositif/ContenuDispositif";
import {
  ReagirModal,
  BookmarkedModal,
  DispositifCreateModal,
  DispositifValidateModal,
  SuggererModal,
  MerciModal,
  EnConstructionModal,
  ResponsableModal,
  VarianteCreateModal
} from "../../components/Modals/index";
import SVGIcon from "../../components/UI/SVGIcon/SVGIcon";
import Commentaires from "../../components/Frontend/Dispositif/Commentaires/Commentaires";
import Tags from "./Tags/Tags";
import EVAIcon from "../../components/UI/EVAIcon/EVAIcon";
import LeftSideDispositif from "../../components/Frontend/Dispositif/LeftSideDispositif/LeftSideDispositif";
import BandeauEdition from "../../components/Frontend/Dispositif/BandeauEdition/BandeauEdition";
import TopRightHeader from "../../components/Frontend/Dispositif/TopRightHeader/TopRightHeader";
import { fetch_dispositifs, fetch_user } from "../../Store/actions";
import ContribCaroussel from "./ContribCaroussel/ContribCaroussel";
import FButton from "../../components/FigmaUI/FButton/FButton";
import SideTrad from "./SideTrad/SideTrad";
import { initializeTimer } from "../Translation/functions";
import { readAudio } from "../Layout/functions";
import MoteurVariantes from "./MoteurVariantes/MoteurVariantes";
import {
  contenu,
  lorems,
  menu,
  filtres,
  onBoardSteps,
  tutoSteps,
  importantCard,
  showModals,
  menuDemarche,
  demarcheSteps,
  tutoStepsDemarche,
  customConvertOption
} from "./data";
import {
  switchVariante,
  initializeVariantes,
  initializeInfoCards,
  verifierDemarche,
  validateVariante,
  deleteVariante,
  calculFiabilite
} from "./functions";
import { breakpoints } from "utils/breakpoints.js";

import variables from "scss/colors.scss";
// var opentype = require('opentype.js');

moment.locale("fr");

const sponsorsData = [];
const uiElement = {
  isHover: false,
  accordion: false,
  cardDropdown: false,
  addDropdown: false,
  varianteSelected: false
};
let user = { _id: "", cookies: {} };
const nbMoisNouveau = 1;

export class Dispositif extends Component {
  constructor(props) {
    super(props);
    this.newRef = React.createRef();
    this.sponsors = React.createRef();
    this.mountTime = 0;
    this.audio = new Audio();
    this._isMounted = false;
    this.initializeTimer = initializeTimer.bind(this);
    this.readAudio = readAudio.bind(this);
    this.switchVariante = switchVariante.bind(this);
    this.initializeVariantes = initializeVariantes.bind(this);
    this.initializeInfoCards = initializeInfoCards.bind(this);
    this.verifierDemarche = verifierDemarche.bind(this);
    this.validateVariante = validateVariante.bind(this);
    this.deleteVariante = deleteVariante.bind(this);
  }

  state = {
    menu: [],
    content: contenu,
    sponsors: sponsorsData,
    tags: [],
    mainTag: {
      darkColor: variables.darkColor,
      lightColor: variables.lightColor,
      hoverColor: variables.gris
    },

    uiArray: new Array(menu.length).fill(uiElement),
    showModals: showModals,
    accordion: new Array(1).fill(false),
    dropdown: new Array(5).fill(false),
    disableEdit: true,
    tooltipOpen: false,
    showBookmarkModal: false,
    isAuth: false,
    showDispositifCreateModal: false,
    showDispositifValidateModal: false,
    showSpinnerPrint: false,
    showSpinnerBookmark: false,
    suggestion: "",
    mail: "",
    tKeyValue: -1,
    tSubkey: -1,
    pinned: false,
    user: {},
    isDispositifLoading: true,
    contributeurs: [],
    withHelp: process.env.NODE_ENV !== "development",
    runFirstJoyRide: false,
    runJoyRide: false,
    stepIndex: 0,
    disableOverlay: false,
    joyRideWidth: 800,
    inputBtnClicked: false,
    mainSponsor: {},
    status: "",
    time: 0,
    initialTime: 0,
    typeContenu: "dispositif",
    variantes: [],
    search: {},
    inVariante: false,
    allDemarches: [],
    demarcheId: null,
    isVarianteValidated: false,
    dispositif: {},
    _id: undefined,
    checkingVariante: false,
    printing: false,
    didThank: false,
    finalValidation: false
  };

  componentDidMount() {
    this._isMounted = true;
    this._initializeDispositif(this.props);
  }

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

  _initializeDispositif = props => {
    const itemId = props.match && props.match.params && props.match.params.id;
    const typeContenu = (props.match.path || "").includes("demarche")
      ? "demarche"
      : "dispositif";
    const checkingVariante = _.get(props, "location.state.checkingVariante"),
      textInput = _.get(props, "location.state.textInput");
    if (itemId) {
      this.props.tracking.trackEvent({
        action: "readDispositif",
        label: "dispositifId",
        value: itemId
      });
      return API.get_dispositif({
        query: { _id: itemId },
        sort: {},
        populate: "creatorId mainSponsor participants",
        locale: props.languei18nCode
      })
        .then(data_res => {
          console.log(data_res);
          let dispositif = { ...data_res.data.data[0] };
          console.log(dispositif);
          if (!dispositif || !dispositif._id) {
            this._isMounted = false;
            return this.props.history.push("/");
          }
          if (
            dispositif.status !== "Actif" &&
            !this.props.admin &&
            !this.props.user.contributions.includes(dispositif._id) &&
            !this.props.user.structures.includes(dispositif.sponsors[0]._id)
          ) {
            if (_.isEmpty(this.props.user)) {
              return this.props.history.push("/login");
            } else {
              this._isMounted = false;
              return this.props.history.push("/");
            }
          }
          const disableEdit =
            dispositif.status !== "Accepté structure" || props.translating;
          if (dispositif.status === "Brouillon" && this._isMounted) {
            this.initializeTimer(3 * 60 * 1000, () =>
              this.valider_dispositif("Brouillon", true)
            );
          } //Enregistrement automatique du dispositif toutes les 3 minutes
          console.log(dispositif);
          this._isMounted &&
            this.setState(
              {
                _id: itemId,
                menu: dispositif.contenu || [],
                content: {
                  titreInformatif: dispositif.titreInformatif,
                  titreMarque: dispositif.titreMarque,
                  abstract: dispositif.abstract,
                  contact: dispositif.contact,
                  externalLink: dispositif.externalLink
                },
                sponsors: dispositif.sponsors,
                tags: dispositif.tags,
                creator: dispositif.creatorId,
                uiArray: _.get(dispositif, "contenu", []).map(x => {
                  return {
                    ...uiElement,
                    ...(x.children && {
                      children: new Array(x.children.length).fill({
                        ...uiElement,
                        accordion: dispositif.status === "Accepté structure"
                      })
                    })
                  };
                }),
                dispositif: dispositif,
                isDispositifLoading: false,
                contributeurs: dispositif.participants || [],
                mainTag:
                  dispositif.tags && dispositif.tags.length > 0
                    ? filtres.tags.find(
                        x => x && x.name === (dispositif.tags[0] || {}).name
                      ) || {}
                    : {},
                mainSponsor: dispositif.mainSponsor,
                status: dispositif.status,
                variantes: dispositif.variantes || [],
                fiabilite: calculFiabilite(dispositif),
                disableEdit,
                typeContenu,
                checkingVariante,
                ...(dispositif.status === "Brouillon" && {
                  initialTime: dispositif.timeSpent
                })
              },
              () => {
                if (typeContenu === "demarche") {
                  this.initializeInfoCards();
                  this.initializeVariantes(itemId, props);
                } else {
                  this.setColors();
                }
              }
            );
          document.title =
            this.state.content.titreMarque ||
            this.state.content.titreInformatif;
          //On va récupérer les vraies données des sponsors
          this._isMounted &&
            API.get_structure({
              _id: {
                $in: _.get(dispositif, "sponsors", []).map(s => s && s._id)
              }
            }).then(data => {
              this._isMounted &&
                data.data.data &&
                data.data.data.length > 0 &&
                this.setState(pS => ({
                  sponsors: [
                    ...data.data.data,
                    ...pS.sponsors.filter(x => x.asAdmin)
                  ]
                }));
            });
          //On récupère les données de l'utilisateur
          if (this._isMounted && API.isAuth()) {
            this._isMounted &&
              API.get_user_info().then(data_res => {
                let u = data_res.data.data;
                user = { _id: u._id, cookies: u.cookies || {} };
                this._isMounted &&
                  this.setState({
                    pinned: (user.cookies.dispositifsPinned || []).some(
                      x => x._id === itemId
                    ),
                    isAuthor: u._id === (dispositif.creatorId || {})._id
                  });
              });
          }
        })
        .catch(err => {
          if (_.isEmpty(this.props.user)) {
            this._isMounted = false;
            return this.props.history.push("/login");
          }
          console.log("Error: ", err.message);
          this._isMounted = false;
          return this.props.history.push("/");
        });
    } else if (API.isAuth()) {
      this.initializeTimer(3 * 60 * 1000, () =>
        this.valider_dispositif("Brouillon", true)
      ); //Enregistrement automatique du dispositif toutes les 3 minutes
      const menuContenu = typeContenu === "demarche" ? menuDemarche : menu;
      this.setState(
        {
          disableEdit: false,
          uiArray: menuContenu.map(x => {
            return {
              ...uiElement,
              ...(x.children && {
                children: new Array(x.children.length).fill({
                  ...uiElement,
                  accordion: true
                })
              })
            };
          }),
          showDispositifCreateModal: process.env.NODE_ENV !== "development", //A modifier avant la mise en prod
          isDispositifLoading: false,
          menu: menuContenu.map(x => {
            return {
              ...x,
              type: x.type || "paragraphe",
              isFakeContent: true,
              placeholder: (x.tutoriel || {}).contenu,
              content: x.type ? null : x.content,
              editorState: EditorState.createWithContent(
                ContentState.createFromBlockArray(htmlToDraft("").contentBlocks)
              )
            };
          }),
          typeContenu,
          ...(textInput && {
            content: { ...contenu, titreInformatif: textInput }
          })
        },
        () => this.setColors()
      );
    } else {
      props.history.push({
        pathname: "/login",
        state: { redirectTo: "/dispositif" }
      });
    }
    window.scrollTo(0, 0);
  };

  setColors = () => {
    return ["color", "borderColor", "backgroundColor", "fill"].map(s => {
      return ["dark", "light"].map(c => {
        return (
          document &&
          document
            .querySelectorAll("." + s + "-" + c + "Color")
            .forEach(elem => {
              elem.style[s] = this.state.mainTag[c + "Color"];
            })
        );
      });
    });
  };

  onInputClicked = ev => {
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

  handleChange = ev => {
    this.setState({
      content: {
        ...this.state.content,
        [ev.currentTarget.id]: ev.target.value
      }
    });
  };

  handleKeyPress = (ev, index) => {
    if (ev.key === "Enter") {
      ev.preventDefault();
      this.setState({ stepIndex: index + 1 });
      if (
        index === 0 &&
        this.state.content.titreMarque === contenu.titreMarque
      ) {
        this.setState({ content: { ...this.state.content, titreMarque: "" } });
        document.getElementById("titreMarque").focus();
      }
    }
  };

  handleModalChange = ev =>
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
        isFakeContent: false
      }),
      ...(node.dataset.subkey &&
        state[node.id].children &&
        state[node.id].children.length > node.dataset.subkey && {
          children: state[node.id].children.map((y, subidx) => {
            return {
              ...y,
              ...(subidx === parseInt(node.dataset.subkey) && {
                [node.dataset.target || "content"]:
                  value || (value === null && ev.target.value),
                isFakeContent: false
              })
            };
          })
        })
    };
    return this.setState({ menu: state });
  };

  handleContentClick = (key, editable, subkey = undefined) => {
    let state = [...this.state.menu];
    if (
      state.length > key &&
      key >= 0 &&
      !this.state.disableEdit &&
      (!this.state.inVariante ||
        _.get(
          this.state.uiArray,
          key + (subkey ? ".children." + subkey : "") + ".varianteSelected"
        ))
    ) {
      if (editable) {
        state = state.map(x => ({
          ...x,
          editable: false,
          ...(x.editable &&
            x.editorState &&
            x.editorState.getCurrentContent() &&
            x.editorState.getCurrentContent().getPlainText() !== "" && {
              content: convertToHTML(customConvertOption)(
                x.editorState.getCurrentContent()
              )
            }),
          ...(x.children && {
            children: x.children.map(y => ({
              ...y,
              ...(y.editable &&
                y.editorState &&
                y.editorState.getCurrentContent() &&
                y.editorState.getCurrentContent().getPlainText() !== "" && {
                  content: convertToHTML(customConvertOption)(
                    y.editorState.getCurrentContent()
                  )
                }),
              editable: false
            }))
          }) //draftToHtml(convertToRaw(y.editorState.getCurrentContent()))
        }));
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
        const textPosition = rawBlocks.findIndex(x =>
          (x.text || "").includes("Bon à savoir :")
        );
        const newRawBlocks = rawBlocks.filter(
          (_, i) => i < textPosition - 3 || i >= textPosition
        );
        const newRawContentState = {
          ...rawContentState,
          blocks: newRawBlocks.map(x =>
            x.text.includes("Bon à savoir :")
              ? {
                  ...x,
                  text: x.text.replace("Bon à savoir :", ""),
                  type: "header-six"
                }
              : x
          )
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
      return new Promise(resolve =>
        this.setState({ menu: state }, () => {
          this.updateUI(key, subkey, editable);
          resolve();
        })
      );
    } else {
      return new Promise(r => r());
    }
  };

  updateUI = (key, subkey, editable) => {
    if (
      editable &&
      (subkey === undefined || (subkey === 0 && key > 1)) &&
      this.state.withHelp
    ) {
      const seuil_tuto = this.state.typeContenu === "demarche" ? 3 : 4;
      try {
        //On place le curseur à l'intérieur du wysiwyg et on ajuste la hauteur
        const target =
          key === 0 || subkey !== undefined
            ? "editeur-" + key + "-" + subkey
            : key === 1
            ? "card-col col-lg-4"
            : undefined;
        console.log(target);
        let parentNode = document.getElementsByClassName(target)[0];
        if (subkey && parentNode) {
          parentNode
            .getElementsByClassName("public-DraftEditor-content")[0]
            .focus();
          window.getSelection().addRange(document.createRange());
          parentNode.getElementsByClassName(
            "DraftEditor-root"
          )[0].style.height =
            (
              parentNode.getElementsByClassName(
                "public-DraftEditorPlaceholder-inner"
              )[0] || {}
            ).offsetHeight + "px";
          this.setState(pS => ({
            joyRideWidth: parentNode.offsetWidth || pS.joyRideWidth
          }));
        }
        if (parentNode) {
          parentNode.scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "nearest"
          });
        }
      } catch (e) {
        console.log(e);
      }
      console.log(key, seuil_tuto);
      this.setState({
        stepIndex: key + seuil_tuto,
        runJoyRide: true,
        disableOverlay: true,
        inputBtnClicked: false
      });
    }
  };

  onEditorStateChange = (editorState, key, subkey = null) => {
    let state = [...this.state.menu];
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const markup = convertToHTML(customConvertOption)(
      editorState.getCurrentContent()
    );
    console.log(
      "Menu State",
      state,
      contentState,
      selectionState,
      rawContentState,
      markup,
      //rawContentState.blocks[1].data
    );
    if (state.length > key) {
      if (subkey !== null && state[key].children.length > subkey) {
        state[key].children[subkey].editorState = editorState;
        state[key].children[subkey].isFakeContent = false;
      } else {
        state[key].editorState = editorState;
        state[key].isFakeContent = false;
      }
      this.setState({ menu: state });
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
                (updateOthers && { [node]: false }))
            };
          })
        })
      };
    });
    this.setState({ uiArray: uiArray, tKeyValue: key, tSubkey: subkey });
  };

  addItem = (key, type = "paragraphe", subkey = null) => {
    let prevState = [...this.state.menu];
    let uiArray = [...this.state.uiArray];
    if (prevState[key].children && prevState[key].children.length > 0) {
      let newChild = {
        ...prevState[key].children[prevState[key].children.length - 1]
      };
      if (type === "card" && newChild.type !== "card") {
        prevState[key].type = "cards";
        newChild = {
          type: "card",
          isFakeContent: true,
          title: "Important !",
          titleIcon: "warning",
          contentTitle: "Compte bancaire",
          contentBody: "nécessaire pour recevoir l’indemnité",
          footer: "Pourquoi ?",
          footerIcon: "question-mark-circle-outline"
        };
      } else if (type === "accordion" && !newChild.content) {
        newChild = {
          type: "accordion",
          isFakeContent: true,
          title: "Un exemple d'accordéon",
          placeholder: lorems.sousParagraphe,
          content: ""
        };
      } else if (type === "map") {
        newChild = {
          type: "map",
          isFakeContent: true,
          isMapLoaded: false,
          markers: []
        };
      } else if (type === "paragraph" && !newChild.content) {
        newChild = {
          title: "Un exemple de paragraphe",
          isFakeContent: true,
          placeholder: lorems.sousParagraphe,
          content: "",
          type: type
        };
      } else if (type === "etape") {
        newChild = {
          ...newChild,
          papiers: [],
          duree: "00",
          timeStepDuree: "minutes",
          delai: "00",
          timeStepDelai: "minutes",
          option: {}
        };
      }
      newChild.type = type;
      if (subkey === null || subkey === undefined) {
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
            footerIcon: "question-mark-circle-outline"
          }
        ];
      } else if (type === "map") {
        prevState[key].children = [
          { type: "map", isFakeContent: true, isMapLoaded: false, markers: [] }
        ];
      } else {
        prevState[key].children = [
          {
            title: "Nouveau sous-paragraphe",
            type: type,
            content: lorems.sousParagraphe
          }
        ];
      }
    }
    uiArray[key].children = [
      ...(uiArray[key].children || []),
      { ...uiElement, accordion: true, varianteSelected: true }
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

  deleteCard = (key, subkey) => {
    const prevState = [...this.state.menu];
    prevState[key].children = prevState[key].children.filter(
      (x, index) => index !== subkey
    );
    this.setState({
      menu: prevState
    });
  };

  toggleModal = (show, name) => {
    this.props.tracking.trackEvent({
      action: "toggleModal",
      label: name,
      value: show
    });
    if (name === "merci" && this.state.showModals.merci) {
      Swal.fire({
        title: "Yay...",
        text: "Votre suggestion a bien été enregistrée, merci",
        type: "success",
        timer: 1500
      });
    }
    this.setState(prevState => ({
      showModals: { ...prevState.showModals, [name]: show },
      suggestion: ""
    }));
  };

  toggleTooltip = () => {
    this.props.tracking.trackEvent({
      action: "toggleTooltip",
      label: "tooltipOpen",
      value: !this.state.tooltipOpen
    });
    this.setState({ tooltipOpen: !this.state.tooltipOpen });
  };

  toggleBookmarkModal = () =>
    this.setState(prevState => ({
      showBookmarkModal: !prevState.showBookmarkModal
    }));
  toggleDispositifCreateModal = () =>
    this.setState(prevState => ({
      showDispositifCreateModal: !prevState.showDispositifCreateModal
    }));
  toggleDispositifValidateModal = () => {
    if (_.isEmpty(this.state.sponsors)) {
      this.setState({ finalValidation: true });
      this.sponsors.current.toggleModal("responsabilite");
    } else {
      this.setState(prevState => ({
        showDispositifValidateModal: !prevState.showDispositifValidateModal,
        finalValidation: false
      }));
    }
  };
  toggleDispositifValidateModalFinal = () => {
    this.setState(prevState => ({
      showDispositifValidateModal: !prevState.showDispositifValidateModal,
      finalValidation: false
    }));
  };

  toggleFinalValidation = () => {
    this.setState({ finalValidation: false });
  };

  toggleInputBtnClicked = () =>
    this.setState(prevState => ({
      inputBtnClicked: !prevState.inputBtnClicked
    }));
  toggleCheckingVariante = () =>
    this.setState(pS => ({ checkingVariante: !pS.checkingVariante }));
  toggleInVariante = () =>
    this.setState(pS => ({
      inVariante: !pS.inVariante,
      ...(!pS.inVariante &&
        pS.disableEdit && {
          checkingVariante: false,
          showModals: { ...this.state.showModals, variante: true }
        })
    }));

  toggleNiveau = (nv, key, subkey) => {
    let niveaux = _.get(
      this.state.menu,
      key + ".children." + subkey + ".niveaux",
      []
    );
    niveaux = niveaux.some(x => x === nv)
      ? niveaux.filter(x => x !== nv)
      : [...niveaux, nv];
    this.setState({
      menu: [...this.state.menu].map((x, i) =>
        i === key
          ? {
              ...x,
              children: x.children.map((y, ix) =>
                ix === subkey ? { ...y, niveaux: niveaux } : y
              )
            }
          : x
      )
    });
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
              )
            }
          : x
      )
    });
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
              )
            }
          : x
      )
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
                      isFakeContent: false
                    }
                  : y
              )
            }
          : x
      )
    });
  setMarkers = (markers, key, subkey) =>
    this.setState({
      menu: [...this.state.menu].map((x, i) =>
        i === key
          ? {
              ...x,
              children: x.children.map((y, ix) =>
                ix === subkey
                  ? { ...y, markers: markers, isFakeContent: false }
                  : y
              )
            }
          : x
      )
    });

  startFirstJoyRide = () =>
    this.setState({ showDispositifCreateModal: false, runJoyRide: true });
  startJoyRide = (idx = 0) =>
    this.setState({ runJoyRide: true, stepIndex: idx });

  toggleHelp = () =>
    this.setState(prevState => ({ withHelp: !prevState.withHelp }));

  bookmarkDispositif = () => {
    this.setState({ showSpinnerBookmark: true });
    if (API.isAuth()) {
      if (this.state.pinned) {
        user.cookies.dispositifsPinned = user.cookies.dispositifsPinned.filter(
          x => x._id !== this.state.dispositif._id
        );
      } else {
        user.cookies.dispositifsPinned = [
          ...(user.cookies.dispositifsPinned || []),
          { _id: this.state._id, datePin: new Date() }
        ];
      }
      API.set_user_info(user).then(() => {
        this.props.fetch_user();
        this._isMounted &&
          this.setState(pS => ({
            showSpinnerBookmark: false,
            showBookmarkModal: !pS.pinned,
            pinned: !pS.pinned,
            isAuth: true
          }));
      });
    } else {
      this.setState(pS => ({
        showBookmarkModal: false,
        isAuth: false
      }));
    }
  };

  changeCardTitle = (key, subkey, node, value) => {
    const prevState = [...this.state.menu];
    if (node === "title") {
      prevState[key].children[subkey] = [
        ...menu[1].children,
        importantCard
      ].find(x => x.title === value);
    } else {
      prevState[key].children[subkey][node] = value;
    }
    this.setState({ menu: prevState });
  };

  changeTag = (key, value) => {
    this.setState(
      {
        tags: this.state.tags.map((x, i) => (i === key ? value : x)),
        ...(key === 0 && {
          mainTag: filtres.tags.find(x => x.short === value.short)
        })
      },
      () => {
        if (key === 0) {
          this.setColors();
        }
      }
    );
  };

  addTag = () => this.setState({ tags: [...(this.state.tags || []), "Autre"] });
  deleteTag = idx =>
    this.setState({ tags: [...this.state.tags].filter((_, i) => i !== idx) });

  handleJoyrideCallback = data => {
    const { action, index, type, lifecycle, status } = data;
    const etapes_tuto =
      this.state.typeContenu === "demarche" ? tutoStepsDemarche : tutoSteps;
    const trigger_lower = this.state.typeContenu === "demarche" ? 2 : 3,
      trigger_upper = this.state.typeContenu === "demarche" ? 5 : 7;
    if (
      [STATUS.FINISHED, STATUS.SKIPPED].includes(status) ||
      (action === ACTIONS.CLOSE && type === EVENTS.STEP_AFTER)
    ) {
      this.setState({ runJoyRide: false, disableOverlay: false });
    } else if (
      ((action === ACTIONS.NEXT && index >= trigger_lower) ||
        index > trigger_lower + 1) &&
      index < trigger_upper &&
      type === EVENTS.STEP_AFTER &&
      lifecycle === "complete"
    ) {
      let key = index - trigger_lower + (action === ACTIONS.PREV ? -2 : 0);
      if (this.state.typeContenu === "demarche" && key === 1) {
        key = 2;
      }
      this.handleContentClick(key, true, key > 1 ? 0 : undefined);
    } else if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      const stepIndex = index + (action === ACTIONS.PREV ? -1 : 1);
      const inputBtnClicked =
        (action === ACTIONS.NEXT && index === 2) ||
        (action === ACTIONS.PREV && index === 4);
      this.setState({
        stepIndex,
        disableOverlay: index > trigger_lower,
        inputBtnClicked
      });
      if (
        this.state.withHelp &&
        etapes_tuto[stepIndex] &&
        etapes_tuto[stepIndex].target &&
        etapes_tuto[stepIndex].target.includes("#") &&
        document.getElementById(etapes_tuto[stepIndex].target.replace("#", ""))
      ) {
        const cible = document.getElementById(
          etapes_tuto[stepIndex].target.replace("#", "")
        );
        cible.focus();
        cible.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest"
        });
      }
    }
  };

  handleFirstJoyrideCallback = data => {
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(data.status)) {
      this.setState({ runJoyRide: true, runFirstJoyRide: false });
    }
  };

  addSponsor = sponsor =>
    this.setState({
      sponsors: [...(this.state.sponsors || []).filter(x => !x.dummy), sponsor]
    });
  deleteSponsor = key => {
    if (this.state.status === "Accepté structure") {
      Swal.fire({
        title: "Oh non!",
        text: "Vous ne pouvez plus supprimer de structures partenaires",
        type: "error",
        timer: 1500
      });
      return;
    }
    this.setState({
      sponsors: (this.state.sponsors || []).filter((_, i) => i !== key)
    });
  };

  goBack = () => {
    this.props.tracking.trackEvent({ action: "click", label: "goBack" });
    this.props.history.push("/advanced-search");
  };

  send_sms = () =>
    Swal.fire({
      title: "Veuillez renseigner votre numéro de téléphone",
      input: "tel",
      inputPlaceholder: "0633445566",
      inputAttributes: {
        autocomplete: "on"
      },
      showCancelButton: true,
      confirmButtonText: "Envoyer",
      cancelButtonText: "Annuler",
      showLoaderOnConfirm: true,
      preConfirm: number => {
        return API.send_sms({
          number,
          typeContenu: this.state.typeContenu,
          url: window.location.href,
          title: this.state.content.titreInformatif
        })
          .then(response => {
            if (!response.status === 200) {
              throw new Error(response.statusText);
            }
            return response.data;
          })
          .catch(error => {
            Swal.showValidationMessage(`Echec d'envoi: ${error}`);
          });
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then(result => {
      if (result.value) {
        Swal.fire({
          title: "Yay...",
          text: "Votre message a bien été envoyé, merci",
          type: "success",
          timer: 1500
        });
      }
    });

  createPdf = () => {
    this.props.tracking.trackEvent({ action: "click", label: "createPdf" });
    let uiArray = [...this.state.uiArray];
    uiArray = uiArray.map(x => ({
      ...x,
      accordion: true,
      ...(x.children && {
        children: x.children.map(y => {
          return { ...y, accordion: true };
        })
      })
    }));
    this.setState({ uiArray: uiArray, showSpinnerPrint: true }, () => {
      setTimeout(() => {
        this.setState(
          { printing: true },
          () =>
            this._isMounted &&
            savePDF(
              this.newRef.current,
              {
                fileName:
                  (this.state.typeContenu || "dispositif") +
                  (this.state.content && this.state.content.titreMarque
                    ? " - " + this.state.content.titreMarque
                    : "") +
                  ".pdf",
                scale: 0.5,
                margin: {
                  top: "2cm",
                  left: "1.5cm",
                  right: "1.5cm",
                  bottom: "2cm"
                }
              },
              this._isMounted &&
                setTimeout(() => {
                  this._isMounted &&
                    this.setState({ showSpinnerPrint: false, printing: false });
                }, 3000)
            )
        );
      }, 3000);
    });

    // opentype.load("https://kendo.cdn.telerik.com/2016.2.607/styles/fonts/DejaVu/DejaVuSans.ttf", function(err, font) {
    //   if (err) { alert('Font could not be loaded: ' + err);
    //   } else {
    //     var ctx = document.getElementById('dispositif').getContext('2d');
    //     var path = font.getPath('Hello, World!', 0, 150, 72);
    //     path.draw(ctx);
    //   }
    // });
  };

  editDispositif = (_ = null, disableEdit = false) =>
    this.setState(
      pS => ({
        disableEdit: disableEdit,
        uiArray: pS.menu.map((x, i) => ({
          ...uiElement,
          ...(pS.uiArray.length > i && {
            varianteSelected: pS.uiArray[i].varianteSelected
          }),
          ...(x.children && {
            children: x.children.map((_, j) => ({
              ...uiElement,
              ...(pS.uiArray.length > i &&
                pS.uiArray[i] &&
                pS.uiArray[i].children &&
                pS.uiArray[i].children.length > j && {
                  varianteSelected: pS.uiArray[i].children[j].varianteSelected
                }),
              accordion: !disableEdit
            }))
          })
        }))
      }),
      () => this.setColors()
    );

  pushReaction = (modalName = null, fieldName) => {
    if (modalName) {
      this.toggleModal(false, modalName);
    }
    const dispositif = {
      dispositifId: this.state._id,
      keyValue: this.state.tKeyValue,
      subkey: this.state.tSubkey,
      fieldName: fieldName,
      type: "push",
      ...(this.state.suggestion && { suggestion: h2p(this.state.suggestion) })
    };
    API.update_dispositif(dispositif).then(data => {
      if (
        (modalName === "reaction" || fieldName === "merci") &&
        this._isMounted
      ) {
        Swal.fire({
          title: "Yay...",
          text: "Votre réaction a bien été enregistrée, merci",
          type: "success",
          timer: 1500
        });
        fieldName === "merci" && this.setState({ didThank: true });
      } else if (API.isAuth() && fieldName !== "merci" && this._isMounted) {
        Swal.fire({
          title: "Yay...",
          text: "Votre suggestion a bien été enregistrée, merci",
          type: "success",
          timer: 1500
        });
      } else if (this._isMounted) {
        this.toggleModal(true, "merci");
      }
    });
  };

  update_status = status => {
    let dispositif = {
      status: status,
      dispositifId: this.state._id
    };
    API.add_dispositif(dispositif).then(data => {
      this.props.fetch_dispositifs();
      this._isMounted &&
        this.setState({
          status: status,
          disableEdit: status !== "Accepté structure"
        });
      if (status === "Rejeté structure") {
        this.props.history.push("/backend/user-dash-structure");
      }
    });
  };

  valider_dispositif = (status = "En attente", auto = false) => {
    if (!auto && !this.verifierDemarche()) {
      return;
    }
    this.setState({ isDispositifLoading: !auto });
    let content = { ...this.state.content };
    const uiArray = { ...this.state.uiArray },
      inVariante = this.state.inVariante;
    Object.keys(content).map(k => (content[k] = h2p(content[k])));
    if (
      auto &&
      !Object.keys(content).some(k => content[k] && content[k] !== contenu[k])
    ) {
      return;
    }
    let dispositif = {
      ...content,
      contenu: [...this.state.menu].map((x, i) => ({
        title: x.title,
        ...{
          content:
            x.editable &&
            x.editorState &&
            x.editorState.getCurrentContent() &&
            x.editorState.getCurrentContent().getPlainText() !== ""
              ? convertToHTML(customConvertOption)(
                  x.editorState.getCurrentContent()
                )
              : x.content
        },
        ...(inVariante && {
          isVariante: _.get(uiArray, `${i}.varianteSelected`)
        }),
        editable: false,
        type: x.type,
        ...(x.children && {
          children: x.children.map((y, j) => ({
            ...y,
            ...(y.editable &&
              y.editorState &&
              y.editorState.getCurrentContent() &&
              y.editorState.getCurrentContent().getPlainText() !== "" && {
                content: convertToHTML(customConvertOption)(
                  y.editorState.getCurrentContent()
                )
              }),
            ...(inVariante && {
              isVariante: _.get(uiArray, `${i}.children.${j}.varianteSelected`)
            }),
            editable: false,
            ...(y.title && { title: h2p(y.title) })
          }))
        })
      })),
      sponsors: (this.state.sponsors || []).filter(x => !x.dummy),
      tags: this.state.tags,
      avancement: 1,
      status: status,
      typeContenu: this.state.typeContenu,
      ...(this.state.inVariante
        ? { demarcheId: this.state._id }
        : { dispositifId: this.state._id }),
      ...(!this.state._id &&
        this.state.status !== "Brouillon" && { timeSpent: this.state.time }),
      autoSave: auto
    };
    console.log(dispositif);
    dispositif.mainSponsor = _.get(dispositif, "sponsors.0._id");
    if (dispositif.typeContenu === "dispositif") {
      let cardElement =
        (this.state.menu.find(x => x.title === "C'est pour qui ?") || [])
          .children || [];
      dispositif.audience = cardElement.some(x => x.title === "Public visé")
        ? cardElement
            .filter(x => x.title === "Public visé")
            .map(x => x.contentTitle)
        : filtres.audience;
      dispositif.audienceAge = cardElement.some(x => x.title === "Âge requis")
        ? cardElement
            .filter(x => x.title === "Âge requis")
            .map(x => ({
              contentTitle: x.contentTitle,
              bottomValue: x.bottomValue,
              topValue: x.topValue
            }))
        : [{ contentTitle: "Plus de ** ans", bottomValue: -1, topValue: 999 }];
      dispositif.niveauFrancais = cardElement.some(
        x => x.title === "Niveau de français"
      )
        ? cardElement
            .filter(x => x.title === "Niveau de français")
            .map(x => x.contentTitle)
        : filtres.niveauFrancais;
      dispositif.cecrlFrancais = cardElement.some(
        x => x.title === "Niveau de français"
      )
        ? [
            ...new Set(
              cardElement
                .filter(x => x.title === "Niveau de français")
                .map(x => x.niveaux)
                .reduce((acc, curr) => [...acc, ...curr])
            )
          ]
        : [];
      dispositif.isFree = cardElement.some(
        x => x.title === "Combien ça coûte ?"
      )
        ? cardElement.find(x => x.title === "Combien ça coûte ?").free
        : true;
    } else {
      dispositif.variantes = this.state.variantes;
      delete dispositif.titreMarque;
    }
    if (status !== "Brouillon") {
      if (
        this.state.status &&
        this.state._id &&
        !inVariante &&
        ![
          "",
          "En attente non prioritaire",
          "Brouillon",
          "Accepté structure"
        ].includes(this.state.status)
      ) {
        console.log("un cas qui justifie ici :", this.state.status, status);
        dispositif.status = this.state.status;
      } else if (dispositif.sponsors && dispositif.sponsors.length > 0) {
        //Je vais chercher les membres de cette structure
        const sponsors = _.get(dispositif, "sponsors.0", {});
        const currSponsor = this.props.structures.find(
          x => x._id === sponsors._id
        );
        //Si l'auteur appartient à la structure principale je la fait passer directe en validation
        const membre = currSponsor
          ? (currSponsor.membres || []).find(
              x => x.userId === this.props.userId
            )
          : (sponsors.membres || []).find(x => x.userId === this.props.userId);
        if (
          membre &&
          membre.roles &&
          membre.roles.some(x => x === "administrateur" || x === "contributeur")
        ) {
          dispositif.status = "En attente admin";
        }
      } else {
        dispositif.status = "En attente non prioritaire";
      }
    }
    API.add_dispositif(dispositif).then(data => {
      const newDispo = data.data.data;
      if (!auto && this._isMounted) {
        Swal.fire("Yay...", "Enregistrement réussi !", "success").then(() => {
          this.props.fetch_user();
          this.props.fetch_dispositifs();
          this.setState(
            {
              disableEdit: [
                "En attente admin",
                "En attente",
                "Brouillon",
                "En attente non prioritaire",
                "Actif"
              ].includes(status),
              isDispositifLoading: false
            },
            () => {
              this.props.history.push(
                "/" + dispositif.typeContenu + "/" + newDispo._id
              );
            }
          );
        });
      } else if (this._isMounted) {
        NotificationManager.success(
          'Retrouvez votre contribution dans votre page "Mon profil"',
          "Enregistrement automatique",
          5000,
          () => {
            Swal.fire(
              "Enregistrement automatique",
              'Retrouvez votre contribution dans votre page "Mon profil"',
              "success"
            );
          }
        );
        this.setState({ _id: newDispo._id });
      }
    });
  };

  upcoming = () =>
    Swal.fire({
      title: "Oh non!",
      text: "Cette fonctionnalité n'est pas encore disponible",
      type: "error",
      timer: 1500
    });

  render() {
    const { t, translating, windowWidth } = this.props;
    const {
      showModals,
      isDispositifLoading,
      typeContenu,
      runJoyRide,
      stepIndex,
      disableOverlay,
      joyRideWidth,
      withHelp,
      disableEdit,
      mainTag,
      fiabilite,
      inVariante,
      checkingVariante,
      printing,
      didThank,
      dispositif
    } = this.state;
    console.log(dispositif);
    const etapes_tuto =
      typeContenu === "demarche" ? tutoStepsDemarche : tutoSteps;
    const moisDepuisCreation =
      (new Date().getTime() - new Date(dispositif.created_at).getTime()) /
      (1000 * 3600 * 24 * 30);

    const Tooltip = ({
      index,
      step,
      backProps,
      primaryProps,
      tooltipProps,
      closeProps,
      isLastStep
    }) => {
      if (step) {
        return (
          <div
            key="JoyrideTooltip"
            className="tooltip-wrapper custom-tooltip"
            style={{
              width: joyRideWidth + "px",
              /*backgroundColor: mainTag.darkColor,*/ marginRight: "40px"
            }}
            {...tooltipProps}
          >
            <div className="tooltipContainer">
              <b>{step.title}</b> : {step.content}
            </div>
            <div className="tooltipFooter">
              <ul className="nav nav-tabs" role="tablist">
                {etapes_tuto.map((_, idx) => (
                  <li
                    role="presentation"
                    className={idx <= stepIndex ? "active" : "disabled"}
                    key={idx}
                  >
                    <span className="round-tab" />
                  </li>
                ))}
              </ul>
              {index > 0 && (
                <FButton
                  onMouseEnter={e => e.target.focus()}
                  type="pill"
                  className="mr-10"
                  name="arrow-back-outline"
                  fill="#FFFFFF"
                  {...backProps}
                />
              )}
              <FButton onMouseEnter={e => e.target.focus()} {...primaryProps}>
                {isLastStep ? (
                  <span>Terminer</span>
                ) : (
                  <span>
                    Suivant
                    <EVAIcon
                      name="arrow-forward-outline"
                      fill={variables.grisFonce}
                      className="ml-10"
                    />
                  </span>
                )}
              </FButton>
            </div>
            <EVAIcon
              onMouseEnter={e => e.currentTarget.focus()}
              {...closeProps}
              name="close-outline"
              className="close-icon"
            />
          </div>
        );
      } else {
        return false;
      }
    };

    return (
      <div
        id="dispositif"
        className={
          "animated fadeIn dispositif vue" +
          (!disableEdit
            ? " edition-mode"
            : translating
            ? " side-view-mode"
            : printing
            ? " printing-mode"
            : " reading-mode")
        }
        ref={this.newRef}
      >
        {/* Second guided tour */}
        <ReactJoyride
          continuous
          steps={etapes_tuto}
          run={!disableEdit && withHelp && runJoyRide}
          showProgress
          disableOverlay={disableOverlay}
          disableOverlayClose={true}
          spotlightClicks={true}
          callback={this.handleJoyrideCallback}
          stepIndex={stepIndex}
          tooltipComponent={Tooltip}
          debug={false}
          styles={{
            options: {
              arrowColor: mainTag.darkColor
            }
          }}
          joyRideWidth={joyRideWidth}
          mainTag={mainTag}
        />

        <Row className="main-row">
          {translating && (
            <Col xl="4" lg="4" md="4" sm="4" xs="4" className="side-col">
              <SideTrad
                menu={this.state.menu}
                content={this.state.content}
                updateUIArray={this.updateUIArray}
                typeContenu={typeContenu}
                {...this.props}
              />
            </Col>
          )}
          <Col
            xl={translating ? "8" : "12"}
            lg={translating ? "8" : "12"}
            md={translating ? "8" : "12"}
            sm={translating ? "8" : "12"}
            xs={translating ? "8" : "12"}
            className="main-col"
          >
            <section
              className="banniere-dispo"
              style={
                mainTag &&
                mainTag.short && {
                  backgroundImage: `url(${bgImage(mainTag.short)})`
                }
              }
            >
              {(inVariante || checkingVariante) && (
                <BandeauEdition
                  menu={this.state.menu}
                  uiArray={this.state.uiArray}
                  withHelp={withHelp}
                  disableEdit={disableEdit}
                  checkingVariante={checkingVariante}
                  editDispositif={this.editDispositif}
                  upcoming={this.upcoming}
                  toggleDispositifValidateModal={
                    this.toggleDispositifValidateModal
                  }
                  valider_dispositif={this.valider_dispositif}
                  toggleHelp={this.toggleHelp}
                  toggleCheckingVariante={this.toggleCheckingVariante}
                  toggleInVariante={this.toggleInVariante}
                />
              )}

              <Row className="header-row">
                {windowWidth >= breakpoints.smLimit && (
                  <Col
                    xl="6"
                    lg="6"
                    md="6"
                    sm="6"
                    xs="12"
                    className="top-left"
                    onClick={this.goBack}
                  >
                    <FButton
                      type="light-action"
                      name="arrow-back"
                      className="btn-retour"
                    >
                      <span>
                        {t("Retour à la recherche", "Retour à la recherche")}
                      </span>
                    </FButton>
                  </Col>
                )}
                {!inVariante && (
                  <TopRightHeader
                    validateStructure={false}
                    disableEdit={this.state.disableEdit}
                    withHelp={this.state.withHelp}
                    showSpinnerBookmark={this.state.showSpinnerBookmark}
                    pinned={this.state.pinned}
                    isAuthor={this.state.isAuthor}
                    status={this.state.status}
                    mainSponsor={this.state.mainSponsor}
                    userId={this.props.userId}
                    update_status={this.update_status}
                    bookmarkDispositif={this.bookmarkDispositif}
                    toggleHelp={this.toggleHelp}
                    toggleModal={this.toggleModal}
                    toggleDispositifValidateModal={
                      this.toggleDispositifValidateModal
                    }
                    editDispositif={this.editDispositif}
                    valider_dispositif={this.valider_dispositif}
                    toggleDispositifCreateModal={
                      this.toggleDispositifCreateModal
                    }
                    admin={this.props.admin}
                    translating={translating}
                  />
                )}
              </Row>
              <Col lg="12" md="12" sm="12" xs="12" className="post-title-block">
                <div className="bloc-titre">
                  <h1 className={disableEdit ? "" : "editable"}>
                    <ContentEditable
                      id="titreInformatif"
                      html={this.state.content.titreInformatif || ""} // innerHTML of the editable div
                      disabled={disableEdit || inVariante}
                      onClick={e => {
                        if (!disableEdit && !inVariante) {
                          this.startJoyRide();
                          this.onInputClicked(e);
                        }
                      }}
                      onChange={this.handleChange}
                      onMouseEnter={e => e.target.focus()}
                      onKeyPress={e => this.handleKeyPress(e, 0)}
                    />
                  </h1>
                  {typeContenu === "dispositif" && (
                    <h2 className="bloc-subtitle">
                      <span>{t("avec", "avec")}&nbsp;</span>
                      <ContentEditable
                        id="titreMarque"
                        html={this.state.content.titreMarque || ""} // innerHTML of the editable div
                        disabled={this.state.disableEdit}
                        onClick={e => {
                          this.startJoyRide(1);
                          this.onInputClicked(e);
                        }}
                        onChange={this.handleChange}
                        onKeyDown={this.onInputClicked}
                        onMouseEnter={e => e.target.focus()}
                        onKeyPress={e => this.handleKeyPress(e, 1)}
                      />
                    </h2>
                  )}
                </div>
              </Col>
            </section>

            {!inVariante && (
              <Row className="tags-row backgroundColor-darkColor">
                <Col lg="8" md="8" sm="8" xs="8" className="col right-bar">
                  {(disableEdit || typeContenu !== "demarche") && (
                    <Row>
                      <b className="en-bref mt-10">
                        {t("En bref", "En bref")}{" "}
                      </b>
                      {(
                        (
                          (this.state.menu || []).find(
                            x => x.title === "C'est pour qui ?"
                          ) || []
                        ).children || []
                      ).map((card, key) => {
                        if (
                          card.type === "card" &&
                          card.title !== "Important !"
                        ) {
                          let texte = card.contentTitle;
                          if (card.title === "Âge requis") {
                            texte =
                              card.contentTitle === "De ** à ** ans"
                                ? t("Dispositif.De", "De") +
                                  " " +
                                  card.bottomValue +
                                  " " +
                                  t("Dispositif.à", "à") +
                                  " " +
                                  card.topValue +
                                  " " +
                                  t("Dispositif.ans", "ans")
                                : card.contentTitle === "Moins de ** ans"
                                ? t("Dispositif.Moins de", "Moins de") +
                                  " " +
                                  card.topValue +
                                  " " +
                                  t("Dispositif.ans", "ans")
                                : t("Dispositif.Plus de", "Plus de") +
                                  " " +
                                  card.bottomValue +
                                  " " +
                                  t("Dispositif.ans", "ans");
                          } else if (
                            [
                              "Niveau de français",
                              "Justificatif demandé",
                              "Public visé"
                            ].includes(card.title)
                          ) {
                            texte =
                              card.contentTitle &&
                              t(
                                "Dispositif." + card.contentTitle,
                                card.contentTitle
                              );
                          } else if (card.title === "Combien ça coûte ?") {
                            texte = card.free
                              ? t("Dispositif.Gratuit", "Gratuit")
                              : card.price +
                                " € " +
                                t(
                                  "Dispositif." + card.contentTitle,
                                  card.contentTitle
                                );
                          }
                          return (
                            <div className="tag-wrapper ml-15" key={key}>
                              <div className="tag-item">
                                <a
                                  href={"#item-head-1"}
                                  className="no-decoration"
                                >
                                  {card.typeIcon === "eva" ? (
                                    <EVAIcon
                                      name={card.titleIcon}
                                      fill="#FFFFFF"
                                      className="mr-10"
                                    />
                                  ) : (
                                    <SVGIcon
                                      fill="#FFFFFF"
                                      width="20"
                                      height="20"
                                      viewBox="0 0 25 25"
                                      name={card.titleIcon}
                                      className="mr-10"
                                    />
                                  )}
                                  <span>{h2p(texte)}</span>
                                </a>
                              </div>
                            </div>
                          );
                        } else {
                          return false;
                        }
                      })}
                    </Row>
                  )}
                </Col>
                <Col lg="4" md="4" sm="4" xs="4" className="tags-bloc">
                  <Tags
                    tags={this.state.tags}
                    filtres={filtres.tags}
                    disableEdit={this.state.disableEdit}
                    changeTag={this.changeTag}
                    addTag={this.addTag}
                    deleteTag={this.deleteTag}
                    history={this.props.history}
                  />
                </Col>
              </Row>
            )}

            <Row className="no-margin-right">
              {!translating && !printing && (
                <Col
                  xl="3"
                  lg="3"
                  md="12"
                  sm="12"
                  xs="12"
                  className="left-side-col pt-40"
                >
                  <LeftSideDispositif
                    menu={this.state.menu}
                    accordion={this.state.accordion}
                    showSpinner={this.state.showSpinnerPrint}
                    content={this.state.content}
                    inputBtnClicked={this.state.inputBtnClicked}
                    disableEdit={this.state.disableEdit}
                    toggleInputBtnClicked={this.toggleInputBtnClicked}
                    handleScrollSpy={this.handleScrollSpy}
                    createPdf={this.createPdf}
                    newRef={this.newRef}
                    handleChange={this.handleChange}
                    typeContenu={typeContenu}
                    send_sms={this.send_sms}
                  />
                </Col>
              )}
              {inVariante && disableEdit && (
                <Col className="variante-col">
                  <div className="radio-btn" />
                </Col>
              )}
              <Col
                xl={translating || printing ? "12" : "7"}
                lg={translating || printing ? "12" : "7"}
                md={translating || printing ? "12" : "10"}
                sm={translating || printing ? "12" : "10"}
                xs={translating || printing ? "12" : "10"}
                className="pt-40 col-middle"
              >
                {disableEdit && !inVariante && (
                  <Row className="fiabilite-row">
                    <Col
                      lg="auto"
                      md="auto"
                      sm="auto"
                      xs="auto"
                      className="col align-right"
                    >
                      {t("Dernière mise à jour", "Dernière mise à jour")}{" "}
                      :&nbsp;
                      <span className="date-maj">
                        {moment(
                          _.get(this.state, "dispositif.updatedAt", 0)
                        ).format("ll")}
                      </span>
                    </Col>
                    <Col className="col">
                      <span>
                        {t(
                          "Fiabilité de l'information",
                          "Fiabilité de l'information"
                        )}{" "}
                        :&nbsp;
                      </span>
                      <span
                        className={
                          "fiabilite color-" +
                          (moisDepuisCreation <= nbMoisNouveau
                            ? "focus"
                            : fiabilite > 0.2
                            ? "vert"
                            : fiabilite > 0.1
                            ? "orange"
                            : "rouge")
                        }
                      >
                        {t(
                          moisDepuisCreation <= nbMoisNouveau
                            ? "Nouveau"
                            : fiabilite > 0.2
                            ? "Forte"
                            : fiabilite > 0.1
                            ? "Moyenne"
                            : "Faible",
                          moisDepuisCreation <= nbMoisNouveau
                            ? "Nouveau"
                            : fiabilite > 0.2
                            ? "Forte"
                            : fiabilite > 0.1
                            ? "Moyenne"
                            : "Faible"
                        )}
                      </span>
                      {fiabilite ? (
                        <>
                          <EVAIcon
                            className="question-bloc ml-8"
                            id="question-bloc"
                            name="question-mark-circle"
                            fill={
                              variables[
                                moisDepuisCreation <= nbMoisNouveau
                                  ? "focus"
                                  : fiabilite > 0.2
                                  ? "validationHover"
                                  : fiabilite > 0.1
                                  ? "orange"
                                  : "error"
                              ]
                            }
                            onClick={() => this.toggleModal(true, "fiabilite")}
                          />
                          <Tooltip
                            placement="top"
                            isOpen={this.state.tooltipOpen}
                            target="question-bloc"
                            toggle={this.toggleTooltip}
                            onClick={() => this.toggleModal(true, "fiabilite")}
                          >
                            <span
                              className="texte-small ml-10"
                              dangerouslySetInnerHTML={{
                                __html: t(
                                  "Dispositif.fiabilite_faible",
                                  "Une information avec une <b>faible</b> fiabilité n'a pas été vérifiée auparavant"
                                )
                              }}
                            />
                            {t(
                              "Dispositif.cliquez",
                              "Cliquez sur le '?' pour en savoir plus"
                            )}
                          </Tooltip>{" "}
                        </>
                      ) : (
                        false
                      )}
                    </Col>
                  </Row>
                )}

                {typeContenu === "demarche" && !(disableEdit && inVariante) && (
                  <MoteurVariantes
                    itemId={this.state._id}
                    disableEdit={disableEdit}
                    inVariante={inVariante}
                    validateVariante={this.validateVariante}
                    deleteVariante={this.deleteVariante}
                    filtres={filtres}
                    upcoming={this.upcoming}
                    switchVariante={this.switchVariante}
                    variantes={this.state.variantes}
                    allDemarches={this.state.allDemarches}
                    search={this.state.search}
                  />
                )}

                <ContenuDispositif
                  updateUIArray={this.updateUIArray}
                  handleContentClick={this.handleContentClick}
                  handleMenuChange={this.handleMenuChange}
                  onEditorStateChange={this.onEditorStateChange}
                  toggleModal={this.toggleModal}
                  deleteCard={this.deleteCard}
                  addItem={this.addItem}
                  removeItem={this.removeItem}
                  changeTitle={this.changeCardTitle}
                  disableIsMapLoaded={this.disableIsMapLoaded}
                  toggleNiveau={this.toggleNiveau}
                  changeAge={this.changeAge}
                  changePrice={this.changePrice}
                  toggleFree={this.toggleFree}
                  setMarkers={this.setMarkers}
                  filtres={filtres}
                  sideView={translating}
                  readAudio={this.readAudio}
                  demarcheSteps={demarcheSteps}
                  upcoming={this.upcoming}
                  {...this.state}
                />

                {this.state.disableEdit && !inVariante && (
                  <>
                    {!printing && (
                      <div className="feedback-footer">
                        <div>
                          <h5 className="color-darkColor">
                            {t(
                              "Dispositif.informations_utiles",
                              "Vous avez trouvé des informations utiles ?"
                            )}
                          </h5>
                          <span className="color-darkColor">
                            {t(
                              "Dispositif.remerciez",
                              "Remerciez les contributeurs qui les ont rédigé pour vous"
                            )}
                            &nbsp;:
                          </span>
                        </div>
                        <div>
                          <FButton
                            className={"thanks" + (didThank ? " clicked" : "")}
                            onClick={() => this.pushReaction(null, "merci")}
                          >
                            {t("Merci", "Merci")}
                          </FButton>
                        </div>
                      </div>
                    )}
                    {!printing && (
                      <div className="discussion-footer backgroundColor-darkColor">
                        <h5>{t("Dispositif.Avis", "Avis et discussions")}</h5>
                        <span>
                          {t("Bientôt disponible !", "Bientôt disponible !")}
                        </span>
                      </div>
                    )}
                    {this.state.contributeurs.length > 0 && (
                      <div className="bottom-wrapper">
                        <ContribCaroussel
                          contributeurs={this.state.contributeurs}
                        />

                        {!this.state.disableEdit && (
                          <div className="ecran-protection">
                            <div className="content-wrapper">
                              <Icon
                                name="alert-triangle-outline"
                                fill="#FFFFFF"
                              />
                              <span>
                                Ajout des contributeurs{" "}
                                <u
                                  className="pointer"
                                  onClick={() =>
                                    this.toggleModal(true, "construction")
                                  }
                                >
                                  disponible prochainement
                                </u>
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

                <Sponsors
                  ref={this.sponsors}
                  sponsors={this.state.sponsors}
                  disableEdit={disableEdit}
                  addSponsor={this.addSponsor}
                  deleteSponsor={this.deleteSponsor}
                  admin={this.props.admin}
                  validate={this.toggleDispositifValidateModalFinal}
                  t={t}
                  finalValidation={this.state.finalValidation}
                  toggleFinalValidation={this.toggleFinalValidation}
                />

                {false && <Commentaires />}
              </Col>
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
            </Row>

            <ReagirModal
              name="reaction"
              show={showModals.reaction}
              toggleModal={this.toggleModal}
              onValidate={this.pushReaction}
            />
            <SuggererModal
              showModals={showModals}
              toggleModal={this.toggleModal}
              onChange={this.handleModalChange}
              suggestion={this.state.suggestion}
              onValidate={this.pushReaction}
            />
            <MerciModal
              name="merci"
              show={showModals.merci}
              toggleModal={this.toggleModal}
              onChange={this.handleModalChange}
              mail={this.state.mail}
            />
            <EnConstructionModal
              name="construction"
              show={showModals.construction}
              toggleModal={this.toggleModal}
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

            <Modal
              isOpen={this.state.showModals.fiabilite}
              toggle={() => this.toggleModal(false, "fiabilite")}
              className="modal-fiabilite"
            >
              <h1>{t("Dispositif.fiabilite", "Fiabilité de l’information")}</h1>
              <div className="liste-fiabilite">
                <Row>
                  <Col lg="4" className="make-it-red">
                    {t("Faible")}
                  </Col>
                  <Col lg="8">
                    L’information a été rédigée par un contributeur qui n’est
                    pas directement responsable et n’a pas été validée par
                    l’autorité compétente.
                  </Col>
                </Row>
                <Row>
                  <Col lg="4" className="make-it-orange">
                    {t("Moyenne")}
                  </Col>
                  <Col lg="8">
                    L’information a été rédigée par un contributeur qui n’est
                    pas directement responsable et n’a pas été validée par
                    l’autorité compétente.
                  </Col>
                </Row>
                <Row>
                  <Col lg="4" className="make-it-green">
                    {t("Forte")}
                  </Col>
                  <Col lg="8">
                    L’information a été rédigée par un contributeur qui n’est
                    pas directement responsable et n’a pas été validée par
                    l’autorité compétente.
                  </Col>
                </Row>
              </div>
            </Modal>

            <BookmarkedModal
              success={this.state.isAuth}
              show={this.state.showBookmarkModal}
              toggle={this.toggleBookmarkModal}
            />
            <DispositifCreateModal
              show={this.state.showDispositifCreateModal}
              toggle={this.toggleDispositifCreateModal}
              typeContenu={typeContenu}
              startFirstJoyRide={this.startFirstJoyRide}
              onBoardSteps={onBoardSteps}
            />
            <DispositifValidateModal
              show={this.state.showDispositifValidateModal}
              toggle={this.toggleDispositifValidateModal}
              abstract={this.state.content.abstract}
              onChange={this.handleChange}
              validate={this.valider_dispositif}
            />
            <VarianteCreateModal
              titreInformatif={this.state.content.titreInformatif}
              show={showModals.variante}
              toggle={() => this.toggleModal(false, "variante")}
              upcoming={this.upcoming}
            />

            <NotificationContainer />

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

function bgImage(short) {
  const imageUrl = require("../../assets/figma/illustration_" +
    short.split(" ").join("-") +
    ".svg"); //illustration_
  return imageUrl;
}

const mapStateToProps = state => {
  return {
    languei18nCode: state.langue.languei18nCode,
    user: state.user.user,
    userId: state.user.userId,
    admin: state.user.admin,
    structures: state.structure.structures
  };
};

const mapDispatchToProps = { fetch_dispositifs, fetch_user };

export default track({
  page: "Dispositif"
})(
  connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(
    withTranslation()(windowSize(Dispositif))
  )
);
