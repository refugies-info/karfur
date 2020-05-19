import React, { Component } from "react";
import ReactHtmlParser from "react-html-parser";
import { Spinner, Tooltip, ListGroup, ListGroupItem, Progress } from "reactstrap";
import { connect } from "react-redux";
import Swal from "sweetalert2";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import h2p from "html2plaintext";
import { convertToRaw, EditorState, ContentState } from "draft-js";
import htmlToDraft from "html-to-draftjs";
import DirectionProvider, {
  DIRECTIONS,
} from "react-with-direction/dist/DirectionProvider";
import _ from "lodash";

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

import "./SideTrad.scss";
import variables from "scss/colors.scss";
import API from "../../../utils/API";
import produce from "immer";
import styled from "styled-components";

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
  };
  initialState = this.state;

  /*  componentDidMount() {
      this._initializeComponent();

  } */

  componentWillReceiveProps(nextProps) {
    if (
      this.state.initialize == false &&
      nextProps.content.titreInformatif !== this.props.content.titreInformatif
    ) {
      this._initializeComponent(nextProps);
      this.setState({ initialize: true });
    }
    if (
      this.state.initializeTrad == false &&
      nextProps.traductionsFaites !== this.props.traductionsFaites
    ) {
      this._initializeComponent(nextProps);
      this.setState({ initializeTrad: true });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      currIdx,
      currSubIdx,
      currSubName,
      isExpert,
      availableListTrad,
      modifiedNew,
    } = this.state;

    if (
      currIdx !== prevState.currIdx ||
      currSubIdx !== prevState.currSubIdx ||
      currSubName !== prevState.currSubName
    ) {
      this.setState({ propositionIndex: 0 });
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
        this.props.traduction.translatedText[currIdx + "Modified"] == true
      ) {
        this.setState({ modified: true });
      }
      this.setState({ traduction: this.props.traduction });
    }
    const { traduction } = this.props;
    if (!this.state.pointersMod) {
      this.state.pointeurs.forEach((x) => {
        if (traduction.translatedText[x + "Modified"]) {
          const elems = document.querySelectorAll('div[id="' + x + '"]');
          elems[0].classList.toggle("arevoir", true);
          this.setState({ pointersMod: true });
        }
      });
    }
    if (!this.state.contentMod) {
      traduction.translatedText.contenu.forEach((p, index) => {
        if (p.titleModified) {
        }
        if (p.contentModified) {
        }
        if (p.children && p.children.length > 0) {
          p.children.forEach((c, j) => {
            if (c.titleModified) {
              const elems1 = document.querySelectorAll(
                'div[id="' +
                  index +
                  '"]' +
                  (j !== undefined && j > -1
                    ? '[data-subkey="' + j + '"]'
                    : "") +
                  (j !== undefined && j > -1 ? '[data-target="title"]' : "")
              );
              if (elems1 && elems1[0] && elems1[0].classList) {
                elems1[0].classList.toggle("arevoir", true);
                this.setState({ contentMod: true });
              }
            }
            if (c.contentModified) {
              const elems2 = document.querySelectorAll(
                'div[id="' +
                  index +
                  '"]' +
                  (j !== undefined && j > -1
                    ? '[data-subkey="' + j + '"]'
                    : "") +
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

  _initializeComponent = async (props) => {
    console.log('Initialize component');
    if (props.traductionsFaites.length > 0) {
      let trad = props.traductionsFaites.find((trad) => {
        console.log(trad.status);
        return (
          trad.status === "En attente" ||
          trad.status === "À revoir" ||
          trad.status === "Validée"
        );
      });
      console.log(trad);
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
        console.log("initialize the highlight and scroll");
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
        //this.checkTranslate(props.locale)
      }
      if (props.typeContenu === "demarche") {
        this.setState({ pointeurs: ["titreInformatif", "abstract"] });
      }
      const { traduction } = this.props;
    }
  };

  goChange = async (isNext = true, fromFn = true) => {
    console.log("goChange");
    await this.props.getTrads();
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
    console.log('#################',currIdx, this.props.menu.length);
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
          this._scrollAndHighlight(this.state.currIdx);
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
          this.state.currSubName === "content") ||
        this.state.currSubName === "contentTitle" ||
        (!isNext && currSubIdx <= 0 && this.state.currSubName === "title")
      ) {
        idx = currIdx + (isNext ? 1 : 0);
        subidx = -1;
        subname = "content";
      } else {
        idx = currIdx;
        if (this.state.currSubName === "title") {
          subidx = currSubIdx + (isNext ? 0 : -1);
          subname = "content";
        } else {
          subidx = currSubIdx + (isNext ? 1 : 0);
          subname = "title";
        }
      }
      this.setState(
        { currIdx: idx, currSubIdx: subidx, currSubName: subname },
        () => {
          let value = "";
          console.log('before ending feedback', idx, this.props.menu.length);
          if (idx > this.props.menu.length - 1) {
            this._endingFeedback();
            return;
          } else if (subidx > -1 && this.props.menu[idx].type === "cards") {
            if (
              this.props.menu[idx].children[subidx][subname] === "Important !"
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
          this._scrollAndHighlight(idx, subidx, subname);
          this.props.fwdSetState(
            () => ({ francais: { body: value } }),
            () => this.checkTranslate(this.props.locale)
          );
        }
      );
    }
  };

  _endingFeedback = (newTrad) => {
    console.log('inside ending feedback', this.props.traduction);
    if (
      this.props.isExpert &&
      (this.state.selectedTrad.status === "Validée" ||
        this.state.avancement >= 1 || (newTrad && newTrad.avancement >= 1))
    ) {
      this._insertTrad(newTrad); //On insère cette traduction
    } else {
      this.props.onSkip();
      this.setState({ ...this.initialState });
    }
  };

  _scrollAndHighlight = (idx, subidx = -1, subname = "") => {
    console.log("scroll and highlight");
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
      'div[id="' +
        idx +
        '"]' +
        (subidx !== undefined && subidx > -1
          ? '[data-subkey="' + subidx + '"]'
          : "") +
        (subidx !== undefined && subidx > -1 && subname && subname !== ""
          ? '[data-target="' + subname + '"]'
          : "")
    );
    if (elems.length > 0) {
      const elem = elems[0];
    console.log("#####################", elem);
      elem.scrollIntoView({
        behavior: "smooth",
        block: "end",
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
    console.log('Check translate');
    const { pointeurs, currIdx, currSubIdx, currSubName } = this.state;
    //console.log(pointeurs, currSubIdx, currIdx, currSubName);
    const text = this.initial_text.innerHTML,
      item = "body";
    //On vérifie si une traduction n'a pas déjà été validée
    const pos = pointeurs.findIndex((x) => currIdx === x),
      { isExpert, traductionsFaites } = this.props;
    let oldTrad = "",
      listTrad = [],
      userId = {},
      selectedTrad = {};
    listTrad = (
      (traductionsFaites || []).map((x) => {
        console.log(x);
        let newValue = x.translatedText || {};
        if (pos > -1) {
          newValue = newValue[currIdx];
        } else {
          console.log(newValue, currIdx, currSubIdx);
          newValue = newValue.contenu[currIdx];
          console.log(newValue);
          if (currSubIdx > -1 && newValue && newValue.children) {
            newValue = newValue.children[currSubIdx];
          }
          console.log(newValue);
          if (newValue) {
          newValue = newValue[this.state.currSubName];
          }
          console.log(newValue);
        }
        return {
          value: newValue,
          ...x,
        };
      }) || []);
      console.log(listTrad);
    let availableListTrad = listTrad.filter((sugg, key) => {
      let valeur = h2p(sugg.value || "");
      if (valeur && valeur !== "" && valeur !== false && valeur !== 'undefined') {
        return sugg;
      }
    });
    const userTrad = listTrad.find(
      (trad) => trad.userId._id === this.props.user._id
    );
    if (userTrad) {
      this.setState({ avancement: 
        this._countValidated([userTrad.translatedText])/
        (this._countContents(this.props.menu) +
        pointeurs.length -
        this.props.menu.length)});
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
    // console.log(listTrad, availableListTrad);
    ///////parse for buttons

    //ReactHtmlParser(oldTrad, {})
    this.setState({ listTrad, userId, selectedTrad, availableListTrad });
    // console.log(oldTrad);
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
    const listTrad = (
      (
        (this.props.traductionsFaites || []).map((x) => ({
          value: (x.translatedText || {})[this.state.currIdx],
          ...x,
        })) || []
      ).filter((x) => x._id !== sugg._id) || []
    );
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
          x[p] !== "null" &&
          x[p] !== "undefined" &&
          x[p] !== "<p>null</p>" &&
          x[p] !== "<p><br></p>" &&
          x[p] !== "<p><br></p>\n" &&
          x[p] !== "<br>" &&
          x[p] !== "<p></p>\n\n<p></p>\n" &&
          type !== "cards"
        ) {
          nbChamps += 1;
        }
      });
      if (
        type === "cards" &&
        (x.title === "Important !" || !x.title) &&
        x.contentTitle &&
        x.contentTitle !== "" &&
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
        (x.title === "Important !" || !x.title) &&
        x.contentTitle &&
        x.contentTitle !== "" &&
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
    console.log('On validate');
    if (!this.props.translated.body) {
      Swal.fire({
        title: "Oh non",
        text: "Aucune traduction n'a été rentrée, veuillez rééssayer",
        type: "error",
        timer: 1500,
      });
      return;
    }
    let {
      pointeurs,
      currIdx,
      currSubIdx,
      currSubName,
      selectedTrad,
      userId,
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
    const userTrad = listTrad.find(
      (trad) => trad.userId._id === this.props.user._id
    );
    if (userTrad) {
      traduction = { ...userTrad };
    } else {
      traduction = {
        initialText: { contenu: new Array(this.props.menu.length).fill(false) },
        translatedText: {
          contenu: new Array(this.props.menu.length).fill(false),
        },
        status: this.state.referenceTrad ? this.state.referenceTrad.status : 'À traduire',
      };
    }
    //the god function
    ["translated"].forEach((nom) => {
      const initialValue = this.props[nom].body;
      const texte =
        nom === "francais"
          ? initialValue
          : draftToHtml(convertToRaw(initialValue.getCurrentContent()));
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
                      children: (
                        x.children ||
                        new Array(
                          this.props.menu[currIdx].children.length
                        ).fill(false)
                      ).map((y, j) =>
                        j === currSubIdx ? { ...y, [currSubName]: texte } : y
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
    // const nbTraduits = this._countContents([traduction.translatedText]);
    const nbInit =
      this._countContents(this.props.menu) +
      pointeurs.length -
      this.props.menu.length;
    //const nbInit = this._countContents([traduction.initialText]);
    if (listTrad.length > 0) {
     let nbValidated = userTrad ? this._countValidated([userTrad.translatedText]) : 0;
     console.log('##############', nbValidated);
      const oldCount = userTrad ? userTrad.avancement * nbInit : 0;
      if (this.state.modifiedNew) {
        traduction.avancement = nbValidated / nbInit;
        this.setState({ modifiedNew: false });
      } else {
        traduction.avancement = (nbValidated + 1) / nbInit;
      }
      console.log(traduction.avancement, avancementCount, oldCount, nbInit);
    } else {
      traduction.avancement = avancementCount / nbInit;
      console.log(traduction.avancement, avancementCount, nbInit);
    }
    traduction.title =
      (this.props.content.titreMarque || "") +
      (this.props.content.titreMarque && this.props.content.titreInformatif
        ? " - "
        : "") +
      (this.props.content.titreInformatif || "");
    console.log(
      "avancement: ##########################",
      traduction,
      traduction.avancement
    );

    //if this is the expert
    let newTranslatedText = produce(traduction.translatedText, (draft) => {
      //draft.status[currIdx] = "Acceptée";
      if (this.state.pointeurs.includes(currIdx)) {
        draft[currIdx + "Modified"] = false;
      } else if (currSubIdx === -1) {
        draft.contenu[currIdx][currSubName + "Modified"] = false;
      } else {
        draft.contenu[currIdx].children[currSubIdx][
          currSubName + "Modified"
        ] = false;
      }
    });
    traduction.translatedText = newTranslatedText;
    const elems1 = document.querySelectorAll(
      'div[id="' +
        currIdx +
        '"]' +
        (currSubIdx !== undefined && currSubIdx > -1
          ? '[data-subkey="' + currSubIdx + '"]'
          : "") +
        (currSubIdx !== undefined &&
        currSubIdx > -1 &&
        currSubName &&
        currSubName !== ""
          ? '[data-target="' + currSubName + '"]'
          : "")
    );
    if (elems1 && elems1[0] && elems1[0].classList) {
      elems1[0].classList.toggle("arevoir", false);
    }
    /* let newTrad = {
        _id: selectedTrad._id,
        translatedText: {
          ...traduction.translatedText,
          status: {
            ...(selectedTrad.translatedText.status || {}),
            [currIdx]: "Acceptée"
          }
        }
      }; */
    /*  let newTrad = {
        _id: selectedTrad._id || traduction._id,
        translatedText: newTranslatedText,
        avancement: traduction.avancement,
      };
      //if (newTrad._id, )
      if (newTrad._id) {
        await API.update_tradForReview(newTrad).then((data) => {
          console.log(data, 'updated trad')
        });
      } */

    //if (newTrad._id, )
    if (userTrad && userTrad._id) {
      let newTrad = {
        _id: userTrad._id,
        translatedText: traduction.translatedText,
        avancement: traduction.avancement,
      };
      this.props.fwdSetState({ newTrad }, () => {});
      //await this.props.valider(newTrad);
      console.log(newTrad);
      if (newTrad.avancement >= 1) {
        this._endingFeedback(newTrad);
        return;
      }
     await API.update_tradForReview(newTrad).then((data) => {
        console.log(data, "updated trad");
        if(newTrad.avancement >= 1){
          Swal.fire({title: 'Yay...', text: 'La traduction a bien été enregistrée', type: 'success', timer: 1000});
          this.props.onSkip();
        }
      });
    } else {
      this.props.fwdSetState({ traduction }, () => {
        console.log(traduction);
      });
      await this.props.valider(traduction);
    }
    this.goChange(true, false);
    this.props.fwdSetState({ disableBtn: false });
  };

  _insertTrad = async (trad) => {
    console.log('Insert trad');
    if (trad) {
      await API.update_tradForReview(trad);
    }
    let newTrad = {
      ...this.props.traduction,
      articleId: this.props.itemId,
      type: "dispositif",
      locale: this.props.locale,
      traductions: this.props.traductionsFaites,
    };
    await API.validate_tradForReview(newTrad).then((data) => {
      Swal.fire(
        "Yay...",
        "Ce dispositif est maintenant intégralement validé et disponible à la lecture",
        "success"
      ).then(() => {
        this.props.onSkip();
      });
    });
  };

  render() {
    console.log(this.props, this.state, this.state.avancementCount, this.props.traduction, this.state.currIdx, this.state.availableListTrad);
    const langue = this.props.langue || {};
    const { francais, translated, isExpert, autosuggest } = this.props; //disableBtn
    const {
      pointeurs,
      currIdx,
      currSubIdx,
      currSubName,
      listTrad,
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
            fill={variables.noir}
            onClick={() => this._endingFeedback()}
          >
            {"Fin de la session"}
          </FButton>
          <div style={{display: 'flex', flex: 1, justifyContent: 'flex-end'}}>
            <Progress
            style={{height: 10, width: '50%', marginLeft: 20, marginRight: 20 ,alignSelf: 'center'}}
              color={colorAvancement(this.state.avancement)}
              value={this.state.avancement * 100}
            />
            <div style={{alignItems: 'center', justifyContent: 'center', alignSelf: 'center'}}>
            <div className={"text-" + colorAvancement(this.state.avancement)}>
              {this.state.avancement === 1 ? (
                <EVAIcon name="checkmark-circle-2" fill={variables.vert} />
              ) : (
                <span>{Math.round((this.state.avancement || 0) * 100)} %</span>
              )}
            </div>
          </div> 
          </div>
        </div>
        <div className="langue-data">
          <h5>Texte français initial</h5>
          <i className="flag-icon flag-icon-fr mr-12 ml-12 mb-8 flag-margin" title="fr" id="fr"></i>
        </div>
        <div
          className={
            (this.state.currIdx === 'abstract') ?
            "content-data-french no-margin-abstract" :
            modified
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
        {this.state.currIdx === 'abstract' ?
        (
          <AlertModified type={"abstract"}>
            <EVAIcon
              name="info"
              fill={variables.noir}
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
                Ce résumé est visible dans les résultats de
                recherche.
              </Tooltip>
            <AlertText type={"abstract"}>Résumé de la fiche</AlertText>
          </AlertModified>
        ) : modified ? (
          <AlertModified type={"modified"}>
            <EVAIcon
              name="alert-triangle"
              fill={variables.orange}
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
          
          <h5>
            Traduction en {(langue.langueFr || "").toLowerCase()}
          </h5>
          <i
            className={"mr-12 ml-12 mb-8 flag-icon flag-margin flag-icon-" + langue.langueCode}
            title={langue.langueCode}
            id={langue.langueCode}
          ></i>
        </div>
        <div
          className={
            userId && userId.username && validated && !modified && !modifiedNew
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
              toolbarClassName="toolbar-editeur"
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
              toolbarHidden={pointeurs.includes(currIdx)}
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
        {validated && !modifiedNew && !modified ? 
        <AlertExpert type={"validated"}>
            <EVAIcon
              name="checkmark-circle-2"
              fill={"#4caf50"}
              id="alert-triangle-outline"
              className={"mr-10 mb-1"}
            />
            <AlertText type={"validated"}>Proposition retenue</AlertText>
          </AlertExpert>
          : null
  }
        <div className="expert-bloc">
          {userId &&
          userId.username &&
          !modifiedNew &&
          this.state.availableListTrad.length > 0 ? (
            <div style={{display: 'flex', flexDirection: 'row', flex: 1}}>
              <div className="trad-info">
                <img
                  src={(userId.picture || {}).secure_url || marioProfile}
                  className="profile-img-pin mr-10"
                  alt="profile"
                />
                <span>{userId.username}</span>
              </div>
              {this.state.availableListTrad.length === 1 ? (
                <div className={validated ? "proposition no-margin-validated" : "proposition"}>Proposition unique</div>
              ) : (
                <div className={validated ? "propositions no-margin-validated" : "propositions"}>
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: 'flex-start'}}>
                    <div>
                      {this.state.propositionIndex +
                        1 +
                        " sur " +
                        this.state.availableListTrad.length
                        + " propositions"}
                    </div>
                  </div>
                  <div>
                    <FButton
                      type="light-action"
                      name="arrow-ios-back-outline"
                      fill={variables.blanc}
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
                fill={variables.noir}
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
              onClick={this.goChange}
            >
              {""}
              <EVAIcon
                name="arrow-forward-outline"
                fill={variables.noir}
                //className="ml-10"
              />
            </FButton>
            <FButton
              type="outline-black"
              name="refresh-outline"
              fill={variables.noir}
              onClick={this.reset}
              className="mt-10 ml-10"
            />
          </div>
          <div className="right-footer">
            {validated && !modified && !modifiedNew ? (
              <FButton
                type="outline-black"
                name={"edit-outline"}
                fill={variables.noir}
                className="mr-10 mt-10"
                onClick={this.modifyNew}
              >
                {"Modifier"}
              </FButton>
            ) : validated && !modified && modifiedNew ? (
              <FButton
                type="outline-black"
                name={"close-circle-outline"}
                fill={variables.noir}
                className="mr-10 mt-10"
                onClick={this.modifyNew}
              >
                {"Annuler"}
              </FButton>
            ) : (
              <FButton
                type="help"
                name="slash-outline"
                fill={variables.noir}
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
                onClick={this.goChange}
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

{
  /* <FButton
type="outline-black"
name="refresh-outline"
fill={variables.noir}
onClick={this.reset}
className="mt-10 mr-10"
>
Réinitialiser
</FButton> */
}

const ConditionalSpinner = (props) => {
  if (props.show) {
    return (
      <div className="text-center">
        <Spinner color="success" className="fadeIn fadeOut" />
      </div>
    );
  } else {
    return false;
  }
};

const mapStateToProps = (state) => {
  return {
    langues: state.langue.langues,
  };
};

export default connect(mapStateToProps)(SideTrad);
