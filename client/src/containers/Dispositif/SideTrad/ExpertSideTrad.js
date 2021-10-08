import React, { Component } from "react";
import ReactHtmlParser from "react-html-parser";
import { Spinner, Tooltip, Progress } from "reactstrap";
import { connect } from "react-redux";
import Swal from "sweetalert2";
import { Editor } from "react-draft-wysiwyg";
import h2p from "html2plaintext";
import { EditorState, ContentState } from "draft-js";
import { convertToHTML } from "draft-convert";
import htmlToDraft from "html-to-draftjs";
import DirectionProvider, {
  DIRECTIONS,
} from "react-with-direction/dist/DirectionProvider";
import _ from "lodash";
import moment from "moment";

import FButton from "../../../components/FigmaUI/FButton/FButton";
import EVAIcon from "../../../components/UI/EVAIcon/EVAIcon";
import {
  boldBtn,
  italicBtn,
  underBtn,
  listBtn,
  logo_google,
  linkBtn,
} from "../../../assets/figma/index";
import marioProfile from "../../../assets/mario-profile.jpg";
import { RejectTradModal } from "../../../components/Modals";
import { colorAvancement } from "../../../components/Functions/ColorFunctions";
import { customConvertOption } from "../data";

import "./SideTrad.scss";
import { colors } from "colors";
import API from "../../../utils/API";
import produce from "immer";
import styled from "styled-components";
import { updateTradActionCreator } from "../../../services/Translation/translation.actions";

const AlertModified = styled.div`
  height: 40px;
  border-radius: 0px 0px 12px 12px;
  display: flex;
  flex-direction: row;
  background-color: ${(props) =>
    props.type === "modified"
      ? "#fcd497"
      : props.type === "validated"
      ? "#def6c2"
      : props.type === "abstract"
      ? "#f9ef99"
      : "#ffffff"};
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
`;

const AlertExpert = styled.div`
  height: 40px;
  display: flex;
  flex-direction: row;
  background-color: ${(props) =>
    props.type === "modified"
      ? "#fcd497"
      : props.type === "validated"
      ? "#def6c2"
      : props.type === "abstract"
      ? "#f9ef99"
      : "#ffffff"};
  justify-content: flex-end;
  align-items: center;
  padding: 15px;
`;

const AlertText = styled.div`
  color: ${(props) =>
    props.type === "modified"
      ? "orange"
      : props.type === "validated"
      ? "#4caf50"
      : props.type === "abstract"
      ? "black"
      : "#ffffff"};
  font-weight: 600;
  font-size: 12px;
`;

class SideTrad extends Component {
  state = {
    pointeurs: ["titreInformatif", "titreMarque", "abstract"],
    currIdx: "titreInformatif",
    currSubIdx: -1,
    currSubName: "content",
    hasBeenSkipped: false,
    tooltipOpen: false,
    listTrad: [],
    availableListTrad: [],
    selectedTrad: {},
    userId: {},
    showModals: {
      rejected: false,
    },
    toggle: false,
    pointersMod: false,
    contentMod: false,
    traduction: this.props.traduction,
    modified: false,
    validated: false,
    modifiedNew: false,
    propositionIndex: 0,
    avancementCount: 0,
    nextIndex: 0,
    validatedCounter: 0,
    topIndex: 0,
    initialize: false,
    initializeTrad: false,
    referenceId: null,
    referenceTrad: null,
    avancement: 0,
    startingTime: null,
    endingTime: null,
    validerInit: false,
  };
  initialState = this.state;

  componentDidMount() {
    this.setState({ startingTime: moment() });
  }

  /*   UNSAFE_componentWillReceiveProps(nextProps) {
    //update when receiving api's return, working with sagas
    if (
      this.props.translations !== nextProps.translations &&
      nextProps.translations
    ) {
      console.log("inside componenet will receive props", this.props.translations , nextProps.translations );
      const { translations } = nextProps;
      if (translations.length) {
        const userTrad = translations.find(
          (trad) => trad.userId._id === this.props.user._id
        );
        if (userTrad) {
          this.setState({
            avancement:
              this._countValidated([userTrad.translatedText]) /
              (this._countContents(this.props.menu) +
                this.state.pointeurs.length -
                this.props.menu.length),
          });
        }
      }
      this.props.fwdSetState({ disableBtn: false });
      if (this.state.initialize) {
        console.log('wrong here');
        this.goChange(true, false);
      }
    }
    if (
      this.props.translation !== nextProps.translation &&
      nextProps.translation
    ) {
      if (nextProps.translation.avancement >= 1) {
        Swal.fire({
          title: "Yay...",
          text: "La traduction a bien été enregistrée",
          type: "success",
          timer: 1000,
        });
        this.props.onSkip();
      }
    }
    if (
      this.state.initialize === false &&
      nextProps.content.titreInformatif !== this.props.content.titreInformatif
    ) {
      this._initializeComponent(nextProps);
      this.setState({ initialize: true });
    }
    if (
      this.state.initializeTrad === false &&
      nextProps.traductionsFaites !== this.props.traductionsFaites
    ) {
      this._initializeComponent(nextProps);
      this.setState({ initializeTrad: true });
    }
  }
 */
  //similar to the function in SideTrad.js
  componentDidUpdate(prevProps, prevState) {
    const { currIdx, currSubIdx, currSubName, availableListTrad } = this.state;
    this._scrollAndHighlight(currIdx, currSubIdx, currSubName);
    if (
      this.state.initialize === false &&
      prevProps.content.titreInformatif !== this.props.content.titreInformatif
    ) {
      this._initializeComponent(this.props);
      this.setState({ initialize: true });
    }
    if (
      this.state.initializeTrad === false &&
      prevProps.traductionsFaites !== this.props.traductionsFaites
    ) {
      this._initializeComponent(this.props);
      this.setState({ initializeTrad: true });
    }
    if (
      this.props.translations !== prevProps.translations &&
      this.props.translations
    ) {
      const { translations } = this.props;
      var userTrad = null;

      if (translations.length) {
        const userTrads = translations.filter(
          (trad) => trad.userId._id === this.props.user._id
        );
        if (userTrads.length > 0) {
          userTrad = userTrads.reduce(function (prev, current) {
            return prev.avancement > current.avancement ? prev : current;
          });
        }
        if (userTrad) {
          this.setState({
            avancement:
              this._countValidated([userTrad.translatedText]) /
              (this._countContents(this.props.menu) +
                this.state.pointeurs.length -
                this.props.menu.length),
          });
        }
      }
      this.props.fwdSetState({ disableBtn: false });
      if (
        (this.state.initialize && currIdx !== "titreInformatif") ||
        (this.state.initialize &&
          currIdx === "titreInformatif" &&
          this.state.validerInit)
      ) {
        this.goChange(true, false);
      }
    }
    if (
      this.props.translation !== prevProps.translation &&
      this.props.translation
    ) {
      if (this.props.translation.avancement >= 1) {
        Swal.fire({
          title: "Yay...",
          text: "La traduction a bien été enregistrée",
          type: "success",
          timer: 1000,
        });
        this.props.onSkip();
      }
    }

    if (
      currIdx !== prevState.currIdx ||
      currSubIdx !== prevState.currSubIdx ||
      currSubName !== prevState.currSubName
    ) {
      this.setState({ propositionIndex: 0, startingTime: moment() });
      if (
        availableListTrad.length > 0 &&
        availableListTrad.find(
          (trad) => trad.userId._id === this.props.user._id
        )
      ) {
        this.setState({ validated: true });
      } else {
        this.setState({ validated: false });
      }
      if (
        this.state.pointeurs.includes(currIdx) &&
        this.props.traduction.translatedText[currIdx + "Modified"] === true
      ) {
        this.setState({ modified: true });
      } else if (
        !this.state.pointeurs.includes(currIdx) &&
        currSubIdx >= 0 &&
        this.props.traduction.translatedText.contenu[currIdx] &&
        this.props.traduction.translatedText.contenu[currIdx].children &&
        this.props.traduction.translatedText.contenu[currIdx].children[
          currSubIdx
        ] &&
        this.props.traduction.translatedText.contenu[currIdx].children[
          currSubIdx
        ][currSubName + "Modified"] === true
      ) {
        this.setState({ modified: true });
      } else if (
        !this.state.pointeurs.includes(currIdx) &&
        currSubIdx < 0 &&
        this.props.traduction.translatedText.contenu[currIdx] &&
        this.props.traduction.translatedText.contenu[currIdx][
          currSubName + "Modified"
        ] === true
      ) {
        this.setState({ modified: true });
      } else {
        this.setState({ modified: false });
      }
    }
    if (this.props.traduction !== prevProps.traduction) {
      if (
        availableListTrad.length > 0 &&
        availableListTrad.find(
          (trad) => trad.userId._id === this.props.user._id
        )
      ) {
        this.setState({ validated: true });
      } else {
        this.setState({ validated: false });
      }
      if (
        this.state.pointeurs.includes(currIdx) &&
        this.props.traduction.translatedText[currIdx + "Modified"] === true
      ) {
        this.setState({ modified: true });
      }
      this.setState({ traduction: this.props.traduction });
    }
    const { traduction } = this.props;
    if (!this.state.pointersMod) {
      this.state.pointeurs.forEach((x) => {
        if (traduction.translatedText[x + "Modified"]) {
          // eslint-disable-next-line
          const elems = document.querySelectorAll('div[id="' + x + '"]');
          if (elems[0]) {
            elems[0].classList.toggle("arevoir", true);
          }
          this.setState({ pointersMod: true });
        }
      });
    }
    if (!this.state.contentMod) {
      traduction.translatedText.contenu.forEach((p, index) => {
        if (p.titleModified) {
        }
        if (p.contentModified) {
          const elems1 = document.querySelectorAll(
            // eslint-disable-next-line
            'div[id="' +
              index +
              // eslint-disable-next-line
              '"]'
          );
          if (elems1 && elems1[0] && elems1[0].classList) {
            elems1[0].classList.toggle("arevoir", true);
            this.setState({ contentMod: true });
          }
        }
        if (p.children && p.children.length > 0) {
          p.children.forEach((c, j) => {
            if (c.titleModified) {
              const elems1 = document.querySelectorAll(
                // eslint-disable-next-line
                'div[id="' +
                  index +
                  // eslint-disable-next-line
                  '"]' +
                  (j !== undefined && j > -1
                    ? // eslint-disable-next-line
                      '[data-subkey="' + j + '"]'
                    : "") +
                  // eslint-disable-next-line
                  (j !== undefined && j > -1 ? '[data-target="title"]' : "")
              );
              if (elems1 && elems1[0] && elems1[0].classList) {
                elems1[0].classList.toggle("arevoir", true);
                this.setState({ contentMod: true });
              }
            }
            if (c.contentModified) {
              const elems2 = document.querySelectorAll(
                // eslint-disable-next-line
                'div[id="' +
                  index +
                  // eslint-disable-next-line
                  '"]' +
                  (j !== undefined && j > -1
                    ? // eslint-disable-next-line
                      '[data-subkey="' + j + '"]'
                    : "") +
                  // eslint-disable-next-line
                  (j !== undefined && j > -1 ? '[data-target="content"]' : "")
              );
              if (elems2 && elems2[0] && elems2[0].classList) {
                elems2[0].classList.toggle("arevoir", true);
                this.setState({ contentMod: true });
              }
            }
          });
        }
      });
    }
  }

  //similar to the function in SideTrad.js
  _initializeComponent = async (props) => {
    if (props.traductionsFaites.length > 0) {
      let trad = props.traductionsFaites.find((trad) => {
        return (
          trad.status === "En attente" ||
          trad.status === "À revoir" ||
          trad.status === "Validée"
        );
      });
      if (trad) {
        this.setState({ referenceId: trad._id, referenceTrad: trad });
      }
    }
    const { idx, subidx, subname } = this.state;
    if (
      props.content &&
      props.content.titreInformatif !== "Titre informatif" &&
      props.fwdSetState &&
      props.translate
    ) {
      if (this.state.currIdx === "titreInformatif") {
        this._scrollAndHighlight("titreInformatif");
        props.fwdSetState(
          () => ({ francais: { body: props.content.titreInformatif } }),
          () => this.checkTranslate(props.locale)
        );
      } else {
        this._scrollAndHighlight(idx, subidx, subname);
        props.fwdSetState(
          () => {},
          () => this.checkTranslate(props.locale)
        );
      }
      if (props.typeContenu === "demarche") {
        this.setState({ pointeurs: ["titreInformatif", "abstract"] });
      }
    }
  };

  //similar to the function in SideTrad.js
  goChange = async (isNext = true, fromFn = true) => {
    if (isNext && fromFn) {
      this.setState({ hasBeenSkipped: true });
    }
    /*  let nextIndex = { ...this.state.nextIndex };

    if (isNext) {
      nextIndex += 1;
      this.setState({
        nextIndex,
        topIndex:
          nextIndex > this.state.topIndex ? nextIndex : this.state.topIndex,
      });
      if (nextIndex > this.state.topIndex) {
        this.setState({ validatedCount: this.state.validatedCount + 1 });
      }
    } else {
      nextIndex -= 1;
      this.setState({ nextIndex });
    } */
    const { pointeurs, currIdx, currSubIdx } = this.state;
    if (currIdx > this.props.menu.length - 1) {
      this._endingFeedback();
      return;
    }
    const oldP = pointeurs.findIndex((x) => currIdx === x);
    if (
      (oldP > -1 + (isNext ? 0 : 1) &&
        oldP < pointeurs.length - (isNext ? 1 : 0)) ||
      (!isNext &&
        currIdx === 0 &&
        currSubIdx === -1 &&
        this.state.currSubName === "content")
    ) {
      this.setState(
        {
          currIdx:
            pointeurs[
              oldP + (isNext ? 1 : currIdx === 0 ? pointeurs.length : -1)
            ],
        },
        () => {
          const texte_francais = this.props.content[this.state.currIdx];
          this.props.fwdSetState(
            () => ({ francais: { body: texte_francais } }),
            () => {
              this.checkTranslate(this.props.locale);
            }
          );
          //this._scrollAndHighlight(this.state.currIdx);
        }
      );
    } else {
      let idx = -1,
        subidx = -1,
        subname = "";
      if (
        (isNext && oldP === pointeurs.length - 1) ||
        (!isNext &&
          currIdx === 0 &&
          currSubIdx === -1 &&
          this.state.currSubName === "content")
      ) {
        idx = isNext ? 0 : pointeurs[pointeurs.length - 1];
        subidx = -1;
        subname = "content";
      } else if (
        !isNext &&
        currSubIdx === -1 &&
        this.state.currSubName === "title"
      ) {
        idx = currIdx - 1;
        subidx = _.get(this.props, "menu." + idx + ".children", []).length - 1;
        subname = "content";
      } else if (
        (isNext &&
          (!this.props.menu[currIdx].children ||
            currSubIdx >= this.props.menu[currIdx].children.length - 1) &&
          (this.state.currSubName === "content" ||
            this.state.currSubName === "contentTitle")) ||
        (!isNext &&
          currSubIdx <= 0 &&
          (this.state.currSubName === "title" ||
            this.state.currSubName === "contentTitle"))
      ) {
        idx = currIdx + (isNext ? 1 : 0);
        subidx = -1;
        subname = "content";
      } else {
        idx = currIdx;
        if (this.state.currSubName === "title") {
          subidx = currSubIdx + (isNext ? 0 : -1);
          subname = "content";
        } else if (this.state.currSubName === "contentTitle") {
          subidx = currSubIdx + (isNext ? 1 : -1);
          subname = "contentTitle";
        } else {
          subidx = currSubIdx + (isNext ? 1 : 0);
          subname = "title";
        }
      }
      this.setState(
        { currIdx: idx, currSubIdx: subidx, currSubName: subname },
        () => {
          let value = "";
          if (idx > this.props.menu.length - 1) {
            this._endingFeedback();
            return;
          } else if (subidx > -1 && this.props.menu[idx].type === "cards") {
            if (
              this.props.menu[idx].children[subidx].title === "Important !" ||
              this.props.menu[idx].children[subidx].title === "Durée"
            ) {
              subname = "contentTitle";
              value = this.props.menu[idx].children[subidx].contentTitle;
              this.setState({ currSubName: subname });
            }
          } else {
            value =
              subidx > -1
                ? this.props.menu[idx].children[subidx][subname]
                : this.props.menu[idx].content;
          }
          if (
            !value ||
            h2p(value) === "" ||
            h2p(value) === "undefined" ||
            h2p(value) === "null" ||
            h2p(value) === "<br>"
          ) {
            this.goChange(isNext, false);
            return;
          }
          this.props.fwdSetState(
            () => ({ francais: { body: value } }),
            () => this.checkTranslate(this.props.locale)
          );
        }
      );
    }
  };

  // this differs from SideTrad.js because we call insertTrad and send the translation to the backend to be inserted in the dispositif and be pubblished
  _endingFeedback = (newTrad) => {
    if (
      newTrad &&
      this.props.isExpert &&
      (this.state.selectedTrad.status === "Validée" ||
        this.state.avancement >= 1 ||
        (newTrad && newTrad.avancement >= 1))
    ) {
      this._insertTrad(newTrad); //On insère cette traduction
    } else {
      this.props.onSkip();
      this.setState({ ...this.initialState });
    }
  };

  _scrollAndHighlight = (idx, subidx = -1, subname = "") => {
    if (
      subidx > -1 &&
      subname === "content" &&
      ["accordion", "etape"].includes(
        this.props.menu[idx].children[subidx].type
      )
    ) {
      this.props.updateUIArray(idx, subidx, "accordion", true);
    }
    Array.from(document.getElementsByClassName("translating")).forEach((x) => {
      x.classList.remove("translating");
    }); //On enlève le surlignage des anciens éléments
    const elems = document.querySelectorAll(
      // eslint-disable-next-line
      'div[id="' +
        idx +
        // eslint-disable-next-line
        '"]' +
        (subidx !== undefined && subidx > -1
          ? // eslint-disable-next-line
            '[data-subkey="' + subidx + '"]'
          : "") +
        (subidx !== undefined && subidx > -1 && subname && subname !== ""
          ? // eslint-disable-next-line
            '[data-target="' + subname + '"]'
          : "")
    );
    if (elems.length > 0) {
      const elem = elems[0];
      elem.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
      elem.classList.toggle("translating"); //On le surligne
    }
  };

  /* transform = (node, index) => {

    // return null to block certain elements
    // don't allow <span> elements
    if (node.type === 'tag' && node.name === 'a') {
      return <>
      <a>
        {}
      </a>
      </>
    }
  }
 */
  checkTranslate = (target) => {
    const { pointeurs, currIdx, currSubIdx } = this.state;
    //console.log(pointeurs, currSubIdx, currIdx, currSubName);
    const text = this.initial_text.innerHTML,
      item = "body";
    //On vérifie si une traduction n'a pas déjà été validée
    const pos = pointeurs.findIndex((x) => currIdx === x),
      { traductionsFaites } = this.props;
    let oldTrad = "",
      listTrad = [],
      userId = {},
      selectedTrad = {};
    listTrad =
      (traductionsFaites || []).map((x) => {
        let newValue = x.translatedText || {};
        if (pos > -1) {
          newValue = newValue[currIdx];
        } else {
          newValue = newValue.contenu[currIdx];
          if (currSubIdx > -1 && newValue && newValue.children) {
            newValue = newValue.children[currSubIdx];
          }
          if (newValue) {
            newValue = newValue[this.state.currSubName];
          }
        }
        return {
          value: newValue,
          ...x,
        };
      }) || [];
    let availableListTrad = listTrad.filter((sugg) => {
      let valeur = h2p(sugg.value || "");
      if (
        valeur &&
        valeur !== "" &&
        valeur !== false &&
        valeur !== "undefined"
      ) {
        return sugg;
      }
    });

    const userTrads = listTrad.filter(
      (trad) => trad.userId._id === this.props.user._id
    );
    var userTrad = null;

    if (userTrads.length > 0) {
      userTrad = userTrads.reduce(function (prev, current) {
        return prev.avancement > current.avancement ? prev : current;
      });
    }
    if (userTrad) {
      this.setState({
        avancement:
          this._countValidated([userTrad.translatedText]) /
          (this._countContents(this.props.menu) +
            pointeurs.length -
            this.props.menu.length),
      });
    }
    if (
      availableListTrad.length > 0 &&
      availableListTrad.find((trad) => trad.userId._id === this.props.user._id)
    ) {
      this.setState({ validated: true });
    } else {
      this.setState({ validated: false });
    }
    if (availableListTrad && availableListTrad.length > 0) {
      oldTrad = availableListTrad[0].value;
      userId = availableListTrad[0].userId;
      selectedTrad = availableListTrad[0];
      //availableListTrad.shift();
    }
    ///////parse for buttons

    //ReactHtmlParser(oldTrad, {})
    this.setState({ listTrad, userId, selectedTrad, availableListTrad });
    if (oldTrad && typeof oldTrad === "string") {
      this.props.fwdSetState({
        autosuggest: false,
        translated: {
          ...this.props.translated,
          body: EditorState.createWithContent(
            ContentState.createFromBlockArray(
              htmlToDraft(oldTrad || "").contentBlocks
            )
          ),
        },
      });
    } else {
      this.props.translate(text, target, item, true);
    }
  };

  nextProposition = (index) => {
    this.setState({ propositionIndex: index });
    this.selectTranslation(this.state.availableListTrad[index]);
  };

  selectTranslation = (sugg) => {
    const listTrad =
      (
        (this.props.traductionsFaites || []).map((x) => ({
          value: (x.translatedText || {})[this.state.currIdx],
          ...x,
        })) || []
      ).filter((x) => x._id !== sugg._id) || [];
    const userId = sugg.userId,
      selectedTrad = sugg;
    this.setState({ listTrad, userId, selectedTrad });
    this.props.fwdSetState({
      translated: {
        ...this.props.translated,
        body: EditorState.createWithContent(
          ContentState.createFromBlockArray(
            htmlToDraft(sugg.value || "").contentBlocks
          )
        ),
      },
    });
  };

  toggleTooltip = () =>
    this.setState((prevState) => ({ tooltipOpen: !prevState.tooltipOpen }));

  resetToEmpty = () => {
    this.props.fwdSetState({
      translated: {
        ...this.props.translated,
        ["body"]: EditorState.createWithContent(
          ContentState.createFromBlockArray(htmlToDraft("").contentBlocks)
        ),
      },
    });
  };

  reset = () =>
    this.props.translate(
      this.initial_text.innerHTML,
      this.props.locale,
      "body",
      true
    );

  modifyNew = () => {
    if (this.state.modifiedNew) {
      this.checkTranslate();
    }
    this.setState({ modifiedNew: !this.state.modifiedNew });
  };

  toggleModal = (show, name) =>
    this.setState((prevState) => ({
      showModals: { ...prevState.showModals, [name]: show },
    }));

  _countContents = (obj, nbChamps = 0, type = null) => {
    obj.forEach((x) => {
      [...this.state.pointeurs, "title", "content"].forEach((p) => {
        if (
          x[p] &&
          x[p] !== "" &&
          x[p] !== undefined &&
          x[p] !== null &&
          x[p] !== "null" &&
          x[p] !== "undefined" &&
          x[p] !== "<p>null</p>" &&
          x[p] !== "<p><br></p>" &&
          x[p] !== "<p><br></p>\n" &&
          x[p] !== "<br>" &&
          x[p] !== "<p></p>\n\n<p></p>\n" &&
          x[p] !== "<p></p><figure> </figure><p><br></p>" &&
          type !== "cards"
        ) {
          nbChamps += 1;
        }
      });
      if (
        type === "cards" &&
        (x.title === "Important !" || x.title === "Durée" || !x.title) &&
        x.contentTitle &&
        x.contentTitle !== "" &&
        x.contentTitle !== undefined &&
        x.contentTitle !== null &&
        x.contentTitle !== "null" &&
        x.contentTitle !== "undefined" &&
        x.contentTitle !== "<p>null</p>" &&
        x.contentTitle !== "<p><br></p>" &&
        x.contentTitle !== "<br>"
      ) {
        nbChamps += 1;
      }
      if (x.contenu && x.contenu.length > 0) {
        nbChamps = this._countContents(x.contenu, nbChamps, x.type);
      }
      if (x.children && x.children.length > 0) {
        nbChamps = this._countContents(x.children, nbChamps, x.type);
      }
    });
    return nbChamps;
  };

  _countValidated = (obj, nbChamps = 0, type = null) => {
    obj.forEach((x) => {
      [...this.state.pointeurs, "title", "content"].forEach((p) => {
        if (
          x[p] &&
          x[p] !== "" &&
          x[p] !== "null" &&
          x[p] !== "undefined" &&
          x[p] !== undefined &&
          x[p] !== null &&
          x[p] !== "<p>null</p>" &&
          x[p] !== "<p><br></p>" &&
          x[p] !== "<p><br></p>\n" &&
          x[p] !== "<br>" &&
          x[p] !== "<p></p>\n\n<p></p>\n" &&
          type !== "cards" &&
          !x[p + "Modified"]
        ) {
          nbChamps += 1;
        }
      });
      if (
        type === "cards" &&
        (x.title === "Important !" || x.title === "Durée" || !x.title) &&
        x.contentTitle &&
        x.contentTitle !== "" &&
        x.contentTitle !== undefined &&
        x.contentTitle !== null &&
        x.contentTitle !== "null" &&
        x.contentTitle !== "undefined" &&
        x.contentTitle !== "<p>null</p>" &&
        x.contentTitle !== "<p><br></p>" &&
        x.contentTitle !== "<br>" &&
        !x["contentTitleModified"]
      ) {
        nbChamps += 1;
      }
      if (x.contenu && x.contenu.length > 0) {
        nbChamps = this._countValidated(x.contenu, nbChamps, x.type);
      }
      if (x.children && x.children.length > 0) {
        nbChamps = this._countValidated(x.children, nbChamps, x.type);
      }
    });
    return nbChamps;
  };

  removeTranslation = (translation) => {
    let listTrad = this.state.listTrad.filter((x) => x._id !== translation._id),
      userId = {},
      selectedTrad = {},
      oldTrad = "";
    if (listTrad && listTrad.length > 0) {
      oldTrad = listTrad[0].value;
      userId = listTrad[0].userId;
      selectedTrad = listTrad[0];
      listTrad.shift();
      this.props.fwdSetState({
        translated: {
          ...this.props.translated,
          body: EditorState.createWithContent(
            ContentState.createFromBlockArray(
              htmlToDraft(oldTrad || "").contentBlocks
            )
          ),
        },
      });
    }
    this.setState({ listTrad, userId, selectedTrad });
  };

  onValidate = async () => {
    if (this.state.currIdx === "titreInformatif") {
      this.setState({ validerInit: true });
    }
    if (!this.props.translated.body) {
      Swal.fire({
        title: "Oh non",
        text: "Aucune traduction n'a été rentrée, veuillez rééssayer",
        type: "error",
        timer: 1500,
      });
      return;
    }
    let timeSpent = 0;
    if (this.state.startingTime) {
      timeSpent = this.state.startingTime.diff(moment()) * -1;
    }
    let textString = this.props.translated.body
      .getCurrentContent()
      .getPlainText();
    let wordsCount = textString.split(" ").filter(function (n) {
      return n !== "";
    }).length;

    let {
      pointeurs,
      currIdx,
      currSubIdx,
      currSubName,
      listTrad,
      availableListTrad,
    } = this.state;
    let avancementCount = this.state.avancementCount;
    if (
      !availableListTrad.length ||
      (availableListTrad.length &&
        !availableListTrad.find(
          (trad) => trad.userId._id === this.props.user._id
        ))
    ) {
      avancementCount = this.state.avancementCount + 1;
      this.setState({ avancementCount });
    }
    this.props.fwdSetState({ disableBtn: true });
    const pos = pointeurs.findIndex((x) => currIdx === x);
    const node = pos > -1 ? currIdx : "contenu";
    if (
      pos === -1 &&
      currIdx > -1 &&
      currSubIdx > -1 &&
      this.props.menu[currIdx].type === "cards" &&
      this.props.menu[currIdx].children[currSubIdx][currSubName] ===
        "Important !"
    ) {
      currSubName = "contentTitle";
    }
    let traduction = { ...this.props.traduction };
    const userTrads = listTrad.filter(
      (trad) => trad.userId._id === this.props.user._id
    );
    var userTrad = null;

    if (userTrads.length > 0) {
      userTrad = userTrads.reduce(function (prev, current) {
        return prev.avancement > current.avancement ? prev : current;
      });
      traduction = { ...userTrad };
    } else {
      traduction = {
        initialText: { contenu: new Array(this.props.menu.length).fill(false) },
        translatedText: {
          contenu: new Array(this.props.menu.length).fill(false),
        },
        status: this.state.referenceTrad
          ? this.state.referenceTrad.status
          : "À traduire",
      };
    }
    //the god function
    ["translated"].forEach((nom) => {
      const initialValue = this.props[nom].body;
      const texte =
        nom === "francais"
          ? initialValue
          : convertToHTML(customConvertOption)(
              initialValue.getCurrentContent()
            );
      const value =
        pos > -1
          ? h2p(texte)
          : traduction[
              (nom === "francais" ? "initial" : "translated") + "Text"
            ].contenu.map((x, i) =>
              i === currIdx
                ? currSubIdx > -1
                  ? {
                      ...x,
                      children:
                        x.children && x.children.length === currSubIdx
                          ? [...x.children, { [currSubName]: texte }]
                          : (
                              x.children ||
                              new Array(
                                this.props.menu[currIdx].children.length
                              ).fill(false)
                            ).map((y, j) =>
                              j === currSubIdx
                                ? { ...y, [currSubName]: texte }
                                : y
                            ),
                      type: this.props.menu[currIdx].type,
                    }
                  : {
                      ...x,
                      [currSubName]: texte,
                      type: this.props.menu[currIdx].type,
                    }
                : x
            );
      traduction[(nom === "francais" ? "initial" : "translated") + "Text"] = {
        ...traduction[(nom === "francais" ? "initial" : "translated") + "Text"],
        [node]: value,
      };
    });
    const nbInit =
      this._countContents(this.props.menu) +
      pointeurs.length -
      this.props.menu.length;
    if (listTrad.length > 0) {
      let nbValidated = userTrad
        ? this._countValidated([userTrad.translatedText])
        : 0;
      if (this.state.modifiedNew) {
        traduction.avancement = nbValidated / nbInit;
        this.setState({ modifiedNew: false });
      } else {
        traduction.avancement = (nbValidated + 1) / nbInit;
      }
    } else {
      traduction.avancement = avancementCount / nbInit;
    }
    traduction.title =
      (this.props.content.titreMarque || "") +
      (this.props.content.titreMarque && this.props.content.titreInformatif
        ? " - "
        : "") +
      (this.props.content.titreInformatif || "");

    let newTranslatedText = produce(traduction.translatedText, (draft) => {
      if (this.state.pointeurs.includes(currIdx)) {
        draft[currIdx + "Modified"] = false;
      } else if (currSubIdx === -1) {
        draft.contenu[currIdx][currSubName + "Modified"] = false;
      } else if (
        draft.contenu[currIdx].children &&
        draft.contenu[currIdx].children[currSubIdx]
      ) {
        draft.contenu[currIdx].children[currSubIdx][
          currSubName + "Modified"
        ] = false;
      }
    });
    traduction.translatedText = newTranslatedText;
    const elems1 = document.querySelectorAll(
      // eslint-disable-next-line
      'div[id="' +
        currIdx +
        // eslint-disable-next-line
        '"]' +
        (currSubIdx !== undefined && currSubIdx > -1
          ? // eslint-disable-next-line
            '[data-subkey="' + currSubIdx + '"]'
          : "") +
        (currSubIdx !== undefined &&
        currSubIdx > -1 &&
        currSubName &&
        currSubName !== ""
          ? // eslint-disable-next-line
            '[data-target="' + currSubName + '"]'
          : "")
    );
    if (elems1 && elems1[0] && elems1[0].classList) {
      elems1[0].classList.toggle("arevoir", false);
    }
    if (userTrad && userTrad._id) {
      let newTrad = {
        _id: userTrad._id,
        translatedText: traduction.translatedText,
        avancement: traduction.avancement,
        isExpert: true,
        wordsCount,
        timeSpent: timeSpent,
        articleId: this.props.itemId,
        language: this.props.langue.langueCode,
      };
      this.props.fwdSetState({ newTrad }, () => {});
      if (newTrad.avancement >= 1) {
        this._endingFeedback(newTrad);
        return;
      }
      this.props.updateTranslation(newTrad);
    } else {
      this.props.fwdSetState({ traduction }, () => {
        // eslint-disable-next-line
        console.log(traduction);
      });
      traduction.wordsCount = wordsCount;
      traduction.timeSpent = timeSpent;
      await this.props.valider(traduction);
    }
    /* this.goChange(true, false);
    this.props.fwdSetState({ disableBtn: false }); */
  };

  _insertTrad = async (trad) => {
    if (trad) {
      await API.update_tradForReview(trad);
    }
    let newTrad = {
      ...trad,
      articleId: this.props.itemId,
      type: "dispositif",
      locale: this.props.locale,
      traductions: this.props.traductionsFaites,
      isExpert: true,
    };

    await API.validateTranslations(newTrad).then(() => {
      Swal.fire({
        title: "Yay...",
        text: "Ce dispositif est maintenant intégralement validé et disponible à la lecture. Voir le questionnaire",
        type: "success",
        footer:
          "<a target='_blank' href='https://airtable.com/shr2i7HLU1eJSsznj'>Répondre au questionnaire</a>",
      }).then(() => {
        this.props.onSkip();
      });
    });
  };

  render() {
    const langue = this.props.langue || {};
    const { francais, translated, autosuggest } = this.props; //disableBtn
    const {
      pointeurs,
      currIdx,
      currSubIdx,
      currSubName,
      userId,
      showModals,
      selectedTrad,
      modified,
      validated,
      modifiedNew,
    } = this.state;
    const isRTL = ["ar", "ps", "fa"].includes(langue.i18nCode);
    const options = {
      decodeEntities: true,
      // transform: this.transform
    };

    return (
      <div className="side-trad shadow">
        <div className="nav-btns">
          <FButton
            type="light-action"
            name={"close" + "-outline"}
            fill={colors.noir}
            onClick={() => this._endingFeedback()}
          >
            {"Fin de la session"}
          </FButton>
          <div style={{ display: "flex", flex: 1, justifyContent: "flex-end" }}>
            <Progress
              style={{
                height: 10,
                width: "50%",
                marginLeft: 20,
                marginRight: 20,
                alignSelf: "center",
              }}
              color={colorAvancement(this.state.avancement)}
              value={this.state.avancement * 100}
            />
            <div
              style={{
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "center",
              }}
            >
              <div className={"text-" + colorAvancement(this.state.avancement)}>
                {this.state.avancement === 1 ? (
                  <EVAIcon name="checkmark-circle-2" fill={colors.vert} />
                ) : (
                  <span>
                    {Math.round((this.state.avancement || 0) * 100)} %
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="langue-data">
          <h5>Texte français initial</h5>
          <i
            className="flag-icon flag-icon-fr mr-12 ml-12 mb-8 flag-margin"
            title="fr"
            id="fr"
          ></i>
        </div>
        <div
          className={
            this.state.currIdx === "abstract" && modified
              ? "content-data-french no-margin-modified"
              : this.state.currIdx === "abstract"
              ? "content-data-french no-margin-abstract"
              : modified
              ? "content-data-french no-margin-modified"
              : validated && !modified
              ? "content-data-french no-margin-validated"
              : "content-data-french"
          }
          id="body_texte_initial"
          ref={(initial_text) => {
            this.initial_text = initial_text;
          }}
        >
          {ReactHtmlParser((francais || {}).body || "", options)}
        </div>
        {this.state.currIdx === "abstract" ? (
          <AlertModified type={modified ? "modified" : "abstract"}>
            <EVAIcon
              name="info"
              fill={colors.noir}
              id="alert-info"
              className={"mr-10 mb-1"}
            />
            <Tooltip
              placement="top"
              offset="0px, 8px"
              isOpen={this.state.tooltipOpen}
              target="alert-info"
              toggle={this.toggleTooltip}
            >
              Ce résumé est visible dans les résultats de recherche.
            </Tooltip>
            <AlertText type={modified ? "modified" : "abstract"}>
              {!modified ? "Résumé de la fiche" : "Résumé de la fiche modifié"}
            </AlertText>
          </AlertModified>
        ) : modified ? (
          <AlertModified type={"modified"}>
            <EVAIcon
              name="alert-triangle"
              fill={colors.orange}
              id="alert-triangle-outline"
              className={"mr-10 mb-1"}
            />
            <AlertText type={"modified"}>Paragraphe modifié</AlertText>
          </AlertModified>
        ) : validated ? (
          <AlertModified type={"validated"}>
            <EVAIcon
              name="checkmark-circle-2"
              fill={"#4caf50"}
              id="alert-triangle-outline"
              className={"mr-10 mb-1"}
            />
            <AlertText type={"validated"}>Déjà validé</AlertText>
          </AlertModified>
        ) : null}
        <div className="langue-data">
          <h5>Traduction en {(langue.langueFr || "").toLowerCase()}</h5>
          <i
            className={
              "mr-12 ml-12 mb-8 flag-icon flag-margin flag-icon-" +
              langue.langueCode
            }
            title={langue.langueCode}
            id={langue.langueCode}
          ></i>
        </div>
        <DirectionProvider direction={isRTL ? DIRECTIONS.RTL : DIRECTIONS.LTR}>
          <div
            className={
              userId &&
              userId.username &&
              validated &&
              !modified &&
              !modifiedNew
                ? "content-data notrounded no-margin-validated"
                : userId &&
                  userId.username &&
                  validated &&
                  !modified &&
                  modifiedNew
                ? "content-data notrounded"
                : this.state.availableListTrad.length > 0
                ? "content-data notrounded"
                : "content-data"
            }
            id="body_texte_final"
          >
            <ConditionalSpinner show={!(translated || {}).body} />
            <Editor
              toolbarClassName={
                isRTL
                  ? "toolbar-editeur"
                  : "toolbar-editeur toolbar-editeur-droite"
              }
              editorClassName={
                validated && !modifiedNew && !modified
                  ? "editor-editeur editor-validated"
                  : "editor-editeur"
              }
              readOnly={validated && !modifiedNew && !modified ? true : false}
              //onContentStateChange={}
              wrapperClassName="wrapper-editeur editeur-sidebar"
              placeholder="Renseignez votre traduction ici"
              onEditorStateChange={this.props.onEditorStateChange}
              editorState={(translated || {}).body}
              toolbarHidden={
                pointeurs.includes(currIdx) ||
                this.state.currSubName === "contentTitle" ||
                this.state.currSubName === "title"
              }
              toolbar={{
                options: ["inline", "list", "link"],
                inline: {
                  inDropdown: false,
                  options: ["bold", "italic", "underline"],
                  className: "bloc-gauche-inline blc-gh",
                  bold: { icon: boldBtn, className: "inline-btn btn-bold" },
                  italic: {
                    icon: italicBtn,
                    className: "inline-btn btn-italic",
                  },
                  underline: {
                    icon: underBtn,
                    className: "inline-btn btn-underline",
                  },
                },
                list: {
                  inDropdown: false,
                  options: ["unordered"],
                  className: "inline-btn blc-gh",
                  unordered: { icon: listBtn, className: "list-btn" },
                },
                link: {
                  inDropdown: false,
                  options: ["link"],
                  className: "bloc-gauche-list blc-gh",
                  link: { icon: linkBtn, className: "btn-link" },
                  defaultTargetOption: "_blank",
                  showOpenOptionOnHover: true,
                },
              }}
            />
            {autosuggest && (
              <div className="google-suggest">
                Suggestion par{" "}
                <img src={logo_google} className="google-logo" alt="google" />
              </div>
            )}
          </div>
        </DirectionProvider>
        {validated && !modifiedNew && !modified ? (
          <AlertExpert type={"validated"}>
            <EVAIcon
              name="checkmark-circle-2"
              fill={"#4caf50"}
              id="alert-triangle-outline"
              className={"mr-10 mb-1"}
            />
            <AlertText type={"validated"}>Proposition retenue</AlertText>
          </AlertExpert>
        ) : null}
        <div className="expert-bloc">
          {userId &&
          userId.username &&
          !modifiedNew &&
          this.state.availableListTrad.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "row", flex: 1 }}>
              <div className="trad-info">
                <img
                  src={(userId.picture || {}).secure_url || marioProfile}
                  className="profile-img-pin mr-10"
                  alt="profile"
                />
                <span>{userId.username}</span>
              </div>
              {this.state.availableListTrad.length === 1 ? (
                <div
                  className={
                    validated
                      ? "proposition no-margin-validated"
                      : "proposition"
                  }
                >
                  Proposition unique
                </div>
              ) : (
                <div
                  className={
                    validated
                      ? "propositions no-margin-validated"
                      : "propositions"
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                    }}
                  >
                    <div>
                      {this.state.propositionIndex +
                        1 +
                        " sur " +
                        this.state.availableListTrad.length +
                        " propositions"}
                    </div>
                  </div>
                  <div>
                    <FButton
                      type="light-action"
                      name="arrow-ios-back-outline"
                      fill={colors.blanc}
                      onClick={() =>
                        this.nextProposition(
                          this.state.propositionIndex === 0
                            ? this.state.availableListTrad.length - 1
                            : this.state.propositionIndex - 1
                        )
                      }
                      className="mt-10 small-figma"
                      style={{ marginRight: 10 }}
                    >
                      {""}
                    </FButton>
                    <FButton
                      className="mt-10 small-figma"
                      type="light-action"
                      onClick={() =>
                        this.nextProposition(
                          this.state.propositionIndex ===
                            this.state.availableListTrad.length - 1
                            ? 0
                            : this.state.propositionIndex + 1
                        )
                      }
                    >
                      {""}
                      <EVAIcon
                        name="arrow-ios-forward-outline"
                        fill={"white"}
                        //className="ml-10"
                      />
                    </FButton>
                  </div>
                </div>
              )}
            </div>
          ) : modifiedNew ? (
            <>
              <div className="trad-info">
                <img
                  src={(userId.picture || {}).secure_url || marioProfile}
                  className="profile-img-pin mr-10"
                  alt="profile"
                />
                <span>{this.props.user.username}</span>
              </div>
              <div className="proposition">Ma nouvelle proposition</div>
            </>
          ) : null}
        </div>
        <div className="footer-btns">
          <div>
            {currIdx !== "titreInformatif" && (
              <FButton
                type="outline-black"
                name="arrow-back-outline"
                fill={colors.noir}
                onClick={() => this.goChange(false)}
                className="mt-10"
                style={{ marginRight: 5 }}
              >
                {""}
              </FButton>
            )}
            <FButton
              className="mt-10"
              type="outline-black"
              onClick={() => {
                this.goChange();
              }}
            >
              {""}
              <EVAIcon
                name="arrow-forward-outline"
                fill={colors.noir}
                //className="ml-10"
              />
            </FButton>
            <FButton
              type="outline-black"
              name="refresh-outline"
              fill={colors.noir}
              onClick={this.reset}
              className="mt-10 ml-10"
            />
          </div>
          <div className="right-footer">
            {validated && !modified && !modifiedNew ? (
              <FButton
                type="outline-black"
                name={"edit-outline"}
                fill={colors.noir}
                className="mr-10 mt-10"
                onClick={this.modifyNew}
              >
                {"Modifier"}
              </FButton>
            ) : validated && !modified && modifiedNew ? (
              <FButton
                type="outline-black"
                name={"close-circle-outline"}
                fill={colors.noir}
                className="mr-10 mt-10"
                onClick={this.modifyNew}
              >
                {"Annuler"}
              </FButton>
            ) : (
              <FButton
                type="help"
                name="slash-outline"
                fill={colors.noir}
                onClick={this.resetToEmpty}
                className="mt-10 mr-10"
              >
                Effacer
              </FButton>
            )}
            {validated && !modified && !modifiedNew ? (
              <FButton
                type="validate"
                name="arrow-forward-outline"
                onClick={() => {
                  this.goChange();
                }}
                disabled={!(translated || {}).body}
                className="mt-10 mr-10"
              >
                {" "}
                {/* || disableBtn */}
                Suivant
              </FButton>
            ) : (
              <FButton
                type="validate"
                name="checkmark-circle-outline"
                onClick={this.onValidate}
                disabled={!(translated || {}).body}
                className="mt-10 mr-10"
              >
                {" "}
                {/* || disableBtn */}
                Valider
              </FButton>
            )}
          </div>
        </div>

        <RejectTradModal
          name="rejected"
          show={showModals.rejected}
          toggle={() => this.toggleModal(false, "rejected")}
          removeTranslation={this.removeTranslation}
          currIdx={currIdx}
          currSubIdx={currSubIdx}
          currSubName={currSubName}
          selectedTrad={selectedTrad}
          userId={userId}
        />
      </div>
    );
  }
}

const ConditionalSpinner = (props) => {
  if (props.show) {
    return (
      <div className="text-center">
        <Spinner color="success" className="fadeIn fadeOut" />
      </div>
    );
    // eslint-disable-next-line
  } else {
    return false;
  }
};

const mapDispatchToProps = {
  updateTranslation: updateTradActionCreator,
};

const mapStateToProps = (state) => {
  return {
    langues: state.langue.langues,
    translation: state.translation.translation,
    translations: state.translation.translations,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SideTrad);
