import React, { Component } from "react";
import ReactHtmlParser from "react-html-parser";
import {
  Spinner,
  Tooltip,
  ListGroup,
  ListGroupItem,
  Progress,
} from "reactstrap";
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

import "./SideTrad.scss";
import { colorAvancement } from "../../../components/Functions/ColorFunctions";
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
  margin-right: 20px;
`;

class SideTrad extends Component {
  state = {
    pointeurs: ["titreInformatif", "titreMarque", "abstract"],
    currIdx: "titreInformatif",
    currSubIdx: -1,
    currSubName: "content",
    hasBeenSkipped: false,
    tooltipOpen: false,
    tooltipScoreOpen: false,
    listTrad: [],
    availableListTrad: [],
    selectedTrad: {},
    score: 0,
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
      if (availableListTrad.length > 0) {
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
      if (availableListTrad.length > 0) {
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
    console.log("Initialize component");
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
    const { pointeurs, currIdx, currSubIdx } = this.state;
    console.log("###########################",currIdx, this.props.menu);
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

  _endingFeedback = () => {
    this.props.onSkip();
    this.setState({ ...this.initialState });
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
    console.log("#####################", elems, elems.length);
    if (elems.length > 0) {
      const elem = elems[0];
      elem.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });;
      elem.classList.toggle("translating"); //On le surligne
    }
  };

  checkTranslate = (target) => {
    console.log('check translate');
    const { pointeurs, currIdx, currSubIdx, currSubName } = this.state;
    //console.log(pointeurs, currSubIdx, currIdx, currSubName);
    const text = this.initial_text.innerHTML,
      item = "body";
    //On vérifie si une traduction n'a pas déjà été validée
    const pos = pointeurs.findIndex((x) => currIdx === x),
      { isExpert, traductionsFaites } = this.props;
    let oldTrad = "",
      listTrad = [],
      score = 0,
      userId = {},
      selectedTrad = {};
    listTrad = (
      (traductionsFaites || []).map((x) => {
        let newValue = x.translatedText || {},
          scoreArr = {};
        if (pos > -1) {
          scoreArr = _.get(newValue, "scoreHeaders." + currIdx, {});
          newValue = newValue[currIdx];
        } else {
          newValue = newValue.contenu[currIdx];
          if (currSubIdx > -1 && newValue && newValue.children) {
            newValue = newValue.children[currSubIdx];
          }
          scoreArr = newValue["score" + this.state.currSubName] || {};
          newValue = newValue[this.state.currSubName];
        }
        return {
          value: newValue,
          score: _.get(scoreArr, "cosine.0.0", 0),
          ...x,
        };
      }) || []
    ).sort((a, b) => b.score - a.score);
    let availableListTrad = listTrad.filter((sugg, key) => {
      let valeur = h2p(sugg.value || "");
      if (valeur && valeur !== "" && valeur !== false) {
        return sugg;
      }
    });
    if (availableListTrad.length > 0) {
      this.setState({ validated: true });
    } else {
      this.setState({ validated: false });
    }
    if (listTrad.length) {
      this.setState({ avancement: listTrad[0].avancement });
    }
    if (availableListTrad && availableListTrad.length > 0) {
      oldTrad = availableListTrad[0].value;
      score = availableListTrad[0].score;
      userId = availableListTrad[0].userId;
      selectedTrad = availableListTrad[0];
      //availableListTrad.shift();
    }
    // console.log(listTrad, availableListTrad);
    ///////parse for buttons

    //ReactHtmlParser(oldTrad, {})
    this.setState({ listTrad, score, userId, selectedTrad, availableListTrad });
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
          score: _.get(
            x,
            "translatedText.scoreHeaders." + this.state.currIdx + ".cosine.0.0"
          ),
          ...x,
        })) || []
      ).filter((x) => x._id !== sugg._id) || []
    ).sort((a, b) => b.score - a.score);
    const score = sugg.score,
      userId = sugg.userId,
      selectedTrad = sugg;
    this.setState({ listTrad, score, userId, selectedTrad });
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
  toggleTooltipScore = () =>
    this.setState((prevState) => ({
      tooltipScoreOpen: !prevState.tooltipScoreOpen,
    }));

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

  removeTranslation = (translation) => {
    let listTrad = this.state.listTrad.filter((x) => x._id !== translation._id),
      score = 0,
      userId = {},
      selectedTrad = {},
      oldTrad = "";
    if (listTrad && listTrad.length > 0) {
      oldTrad = listTrad[0].value;
      score = listTrad[0].score;
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
    this.setState({ listTrad, score, userId, selectedTrad });
  };

  onValidate = async () =>{
    console.log("On Validate");
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
    if (!availableListTrad.length > 0) {
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
      const oldCount = listTrad[0].avancement * nbInit;
      if (this.state.modifiedNew) {
        traduction.avancement = oldCount / nbInit;
        this.setState({ modifiedNew: false });
      } else {
        traduction.avancement = (oldCount + 1) / nbInit;
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
    //if (newTrad._id, )
    if (userTrad && userTrad._id) {
      let newTrad = {
        _id: userTrad._id,
        translatedText: traduction.translatedText,
        avancement: traduction.avancement,
      };
      this.props.fwdSetState({ newTrad }, () => {});
      await this.props.valider(newTrad);
      console.log(newTrad);
      /*   await API.update_tradForReview(newTrad).then((data) => {
        console.log(data, "updated trad");
        if(newTrad.avancement >= 1){
          Swal.fire({title: 'Yay...', text: 'La traduction a bien été enregistrée', type: 'success', timer: 1000});
          this.props.onSkip();
        }
      }); */
    } else {
      this.props.fwdSetState({ traduction }, () => {
        console.log(traduction);
      });
      await this.props.valider(traduction);
    }
    this.goChange(true, false);
    this.props.fwdSetState({ disableBtn: false });
  };

  _insertTrad = () => {
    let newTrad = {
      ...this.props.traduction,
      articleId: this.props.itemId,
      type: "dispositif",
      locale: this.props.locale,
      traductions: this.props.traductionsFaites,
    };
    API.validate_tradForReview(newTrad).then((data) => {
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
    console.log(
      this.props,
      this.state,
      this.state.avancementCount,
      this.props.traduction,
      this.state.currIdx,
      this.state.availableListTrad
    );
    const langue = this.props.langue || {};
    const { francais, translated, isExpert, autosuggest } = this.props; //disableBtn
    const {
      pointeurs,
      currIdx,
      currSubIdx,
      currSubName,
      listTrad,
      score,
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
            className="mr-10 mb-10"
            onClick={() => this._endingFeedback()}
          >
            {"Fin de la session"}
          </FButton>
            <Progress
            style={{height: 10, width: '30%', alignSelf: 'center'}}
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
        <div className="langue-data">
          <i className="flag-icon flag-icon-fr mr-12" title="fr" id="fr"></i>
          <strong>Texte français initial</strong>
          {currIdx === "abstract" && (
            <div className="align-right">
              <b>Résumé</b>
              <EVAIcon
                className="ml-10"
                name="info"
                fill={variables.noir}
                id="eva-icon-info"
              />
              <Tooltip
                placement="top"
                offset="0px, 8px"
                isOpen={this.state.tooltipOpen}
                target="eva-icon-info"
                toggle={this.toggleTooltip}
              >
                Ce paragraphe de résumé apparaît dans les résultats de
                recherche. Il n'est pas visible sur la page.
              </Tooltip>
            </div>
          )}
        </div>
        <div
          className={
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
        {modified ? (
          <AlertModified type={"modified"}>
            <EVAIcon
              name="alert-triangle"
              fill={variables.orange}
              id="alert-triangle-outline"
              className={"mr-10"}
            />
            <AlertText type={"modified"}>Paragraphe modifié</AlertText>
          </AlertModified>
        ) : validated ? (
          <AlertModified type={"validated"}>
            <EVAIcon
              name="checkmark-circle-2"
              fill={"#4caf50"}
              id="alert-triangle-outline"
              className={"mr-10"}
            />
            <AlertText type={"validated"}>Déjà traduit</AlertText>
          </AlertModified>
        ) : null}
        <div className="langue-data">
          <i
            className={"mr-12 flag-icon flag-icon-" + langue.langueCode}
            title={langue.langueCode}
            id={langue.langueCode}
          ></i>
          <strong>
            {"Votre"} traduction en {(langue.langueFr || "").toLowerCase()}
          </strong>
        </div>
        <div
          className={
            userId && userId.username && validated && !modified && !modifiedNew
              ? "content-data notrounded editor-validated"
              : userId &&
                userId.username &&
                validated &&
                !modified &&
                modifiedNew
              ? "content-data notrounded"
              : "content-data"
          }
          id="body_texte_final"
        >
          <ConditionalSpinner show={!(translated || {}).body} />
          <DirectionProvider
            direction={isRTL ? DIRECTIONS.RTL : DIRECTIONS.LTR}
          >
            <Editor
              toolbarClassName="toolbar-editeur"
              editorClassName={
                validated && !modifiedNew && !modified
                  ? "editor-editeur editor-validated"
                  : "editor-editeur"
              }
              readOnly={validated && !modifiedNew && !modified ? true : false}
              //onContentStateChange={}
              wrapperClassName="wrapper-editeur editeur-sidebar editor-validated"
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
          </DirectionProvider>
          {autosuggest && (
            <div className="google-suggest">
              Suggestion par{" "}
              <img src={logo_google} className="google-logo" alt="google" />
            </div>
          )}
        </div>
        <div className="expert-bloc">
          {/* 
                     <div className="score">
              Score de qualité :{" "}
              <span className="texte-vert">
                {Math.round((score || 0) * 100)} %
              </span>
              <EVAIcon
                className="ml-10"
                name="info"
                fill={variables.noir}
                id="eva-icon-score"
              />
              <Tooltip
                placement="top"
                offset="0px, 8px"
                isOpen={this.state.tooltipScoreOpen}
                target="eva-icon-score"
                toggle={this.toggleTooltipScore}
              >
                Ce score de qualité est généré à partir d'un algorithme de
                traduction, il vous conseille quant à la qualité de la
                traduction. Vous pouvez l'ignorer s'il vous induit en erreur.
              </Tooltip>
            </div>
           */}
          {userId &&
          userId.username &&
          !modified &&
          !modifiedNew &&
          this.state.availableListTrad.length > 0 ? (
            <>
              <div className="trad-info">
                <img
                  src={(userId.picture || {}).secure_url || marioProfile}
                  className="profile-img-pin mr-10"
                  alt="profile"
                />
                <span>{userId.username}</span>
              </div>
              {this.state.availableListTrad.length === 1 ? (
                <div className="proposition">Proposition unique</div>
              ) : (
                <div className="propositions">
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div>
                      {this.state.propositionIndex +
                        1 +
                        " sur " +
                        this.state.availableListTrad.length}
                    </div>
                    <div>propositions</div>
                  </div>
                  <div>
                    <FButton
                      type="light-action"
                      name="arrow-ios-back-outline"
                      fill={variables.noir}
                      onClick={() =>
                        this.nextProposition(
                          this.state.propositionIndex === 0
                            ? this.state.availableListTrad.length - 1
                            : this.state.propositionIndex - 1
                        )
                      }
                      className="mt-10 small-figma"
                      style={{ marginRight: 5 }}
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
                        fill={variables.noir}
                        //className="ml-10"
                      />
                    </FButton>
                  </div>
                </div>
              )}
            </>
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
                type="outline-black"
                name="refresh-outline"
                fill={variables.noir}
                onClick={this.reset}
                className="mt-10 mr-10"
              >
                Réinitialiser
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
        {/* {listTrad.length > 0 && (
          <div className="other-propositions">
            <h5 className="title-props">Autres propositions possibles</h5>
            <ListGroup>
              {listTrad.map((sugg, key) => {
                let valeur = h2p(sugg.value || "");
                valeur =
                  valeur.slice(0, 35) + (valeur.length > 35 ? "..." : "");
                if (valeur && valeur !== "") {
                  return (
                    <ListGroupItem
                      tag="button"
                      action
                      key={key}
                      onClick={() => this.selectTranslation(sugg)}
                    >
                      {valeur}
                      {sugg.score && sugg.score !== 0 && sugg.score !== "0" && (
                        <b className="score">
                          {Math.round((sugg.score || 0) * 100)} %
                        </b>
                      )}
                    </ListGroupItem>
                  );
                } else {
                  return false;
                }
              })}
            </ListGroup>
          </div>
        )} */}

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
