import React, { Component } from "react";
import Swal from "sweetalert2";
import h2p from "html2plaintext";
import { EditorState, ContentState } from "draft-js";
import { connect } from "react-redux";
import _ from "lodash";
import produce from "immer";

import API from "../../utils/API";
import Dispositif from "components/Frontend/Dispositif/Dispositif";
import { menu } from "data/dispositif";
import {
  fetchTranslationsActionCreator,
  addTradActionCreator,
} from "../../services/Translation/translation.actions";
import { withRouter } from "react-router-dom";
import { fetchSelectedDispositifActionCreator } from "services/SelectedDispositif/selectedDispositif.actions";
import isInBrowser from "lib/isInBrowser";

let last_target = null;
let letter_pressed = null;

let htmlToDraft = null;
if (isInBrowser()) {
  htmlToDraft = require("html-to-draftjs").default;
}
export class TranslationHOC extends Component {
  constructor(props) {
    super(props);
    this.mountTime = 0;
    this._isMounted = false;
  }

  state = {
    // value: "",
    francais: {
      title: "",
      body: "",
    },
    texte_traduit: "",
    texte_a_traduire: "",
    avancement: 1,
    isComplete: false,
    isStructure: false,
    path: [],
    id: "",
    nbMotsRestants: 0,
    type: "",
    time: 0,
    disableBtn: false,
    jsonId: null,
    langueBackupId: null,

    translated: {
      body: "",
      title: "",
    },
    itemId: "",
    isExpert: false,
    locale: "",
    langue: {},
    traduction: {
      initialText: { contenu: new Array(menu.length).fill(false) },
      translatedText: { contenu: new Array(menu.length).fill(false) },
    },
    traductionsFaites: [],
    autosuggest: false,
  };

  componentDidMount() {
    this._isMounted = true;
    this._initializeComponent(this.props);
    window.scrollTo(0, 0);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.translations !== this.props.translations) {
      const { isExpert, userId } = this.props;
      const traductions = this.props.translations;

      const traduction = traductions.find(
        (trad) => trad.userId._id === trad.validatorId
      );
      this.setState({
        traductionsFaites: traductions,
        traduction: {
          initialText: _.get(traductions, "0.initialText", {}),
          translatedText:
            isExpert && traductions.find((trad) => trad.userId._id === userId)
              ? _.get(
                  traductions.find((trad) => trad.userId._id === userId),
                  ["translatedText"]
                )
              : traduction
              ? traduction.translatedText
              : _.get(traductions, "0.translatedText", {}),
        },
        autosuggest: false,
      });
    }

    if (
      prevProps.translation !== this.props.translation &&
      this.props.translation._id
    ) {
      this.setState(
        produce((draft) => {
          draft.traduction._id = this.props.translation._id;
        })
      );
    }
  }

  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(nextProps) {
    if (nextProps.location.search !== this.props.location.search) {
      this._initializeComponent(nextProps);
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }
  // eslint-disable-next-line react/no-deprecated
  componentWillUpdate(_, nextState) {
    if (nextState.translated.body !== this.state.translated.body) {
      this.setState({
        nbMotsRestants: Math.max(
          0,
          h2p(nextState.francais.body).split(/\s+/).length -
            h2p(nextState.translated.body).split(/\s+/).length
        ),
      });
    }
  }

  _initializeComponent = async (props) => {
    const searchParams = (new URL(document.location)).searchParams;
    const languageId = searchParams.get("language");
    const itemId = searchParams.get("dispositif");
    const { locale, langueBackupId } = await this._setLangue(languageId);
    const isExpert = this.props.isExpert;
    const type =
      (props.location.pathname || "").includes("dispositif") ||
      (props.location.pathname || "").includes("demarche")
        ? "dispositif"
        : "string";
    this.props.fetchSelectedDispositif({
      selectedDispositifId: itemId,
      locale: "fr"
    });
    this.setState({ type, itemId, locale, isExpert, langueBackupId });
    if (itemId && type === "dispositif") {
      //...(!isExpert && userId && {userId})
      this.props.fetchTranslations(itemId, locale);
    }
  };

  get_trads = () => {
    const { itemId, locale } = this.state;
    this.props.fetchTranslations(itemId, locale);
  };

  _setLangue = async (languageId) => {
    let langue = null;
    try {
      langue = (
        await API.get_langues({ _id: languageId }, {}, "langueBackupId")
      ).data.data[0];
    } catch (err) {}
    this._isMounted && this.setState({ langue });
    return {
      locale: langue.i18nCode,
      langueBackupId: _.get(langue, "langueBackupId.i18nCode"),
    };
  };

  setRef = (refObj, name) => (this[name] = refObj);
  fwdSetState = (fn, cb) => this._isMounted && this.setState(fn, cb);

  translate = (text, target, item, toEditor = false) => {
    this.setState({
      translated: { ...this.state.translated, [item]: "" },
      autosuggest: true,
    });
    API.get_translation({ q: text, target: target })
      .then((data) => {
        if (!this.state.translated[item]) {
          let value =
            data.data
              .replace(/ id='initial_/g, " id='target_")
              // eslint-disable-next-line
              .replace(/ id="initial_/g, ' id="target_') || "";
          value = toEditor
            ? EditorState.createWithContent(
                ContentState.createFromBlockArray(
                  htmlToDraft(value).contentBlocks
                )
              )
            : value;
          this._isMounted &&
            item &&
            this.setState({
              translated: {
                ...this.state.translated,
                [item]: value,
              },
            });
        }
      })
      .catch(() => {
        if (
          !this.state.translated[item]
          //h2p(this.state.francais[item]) === h2p(text)
        ) {
          let value = this.state.francais[item] || "";
          value = toEditor
            ? EditorState.createWithContent(
                ContentState.createFromBlockArray(
                  htmlToDraft(value).contentBlocks
                )
              )
            : value;
          this._isMounted &&
            this.setState({
              translated: {
                ...this.state.translated,
                [item]: value,
              },
            });
        }
      });
  };

  handleChange = (ev) => {
    var targetNode = ev.currentTarget;
    let target = targetNode.className.includes("title") ? "title" : "body";
    let value = target === "title" ? targetNode.innerText : ev.target.value;
    this.setState({
      translated: {
        ...this.state.translated,
        [target]: value,
      },
      autosuggest: false,
    });
  };

  onEditorStateChange = (editorState, target = "body") => {
    this.setState({
      translated: {
        ...this.state.translated,
        [target]: editorState,
      },
      autosuggest: false,
    });
  };

  handleClickText = (e, initial, target) => {
    try {
      if (last_target) {
        document
          .getElementById(last_target)
          .classList.remove("temporarily_highlight");
      }
      let cible = e.target;
      last_target = cible.id.replace(initial + "_", target + "_");
      if (last_target) {
        document
          .getElementById(last_target)
          .classList.add("temporarily_highlight");
      }
    } catch (e) {}
  };

  handleChangeEnCours = (event) => {
    if (
      letter_pressed &&
      letter_pressed === " " &&
      this.state.texte_a_traduire.slice(0, 1) !== " "
    ) {
      let i = 0,
        le_text = this.state.texte_a_traduire;
      do {
        le_text = le_text.substring(1);
        i++;
      } while (le_text.slice(0, 1) !== " " && le_text !== "" && le_text);
      this.setState((prevState) => ({
        texte_a_traduire: prevState.texte_a_traduire.substring(i + 1),
      }));
    } else if (
      letter_pressed &&
      ((letter_pressed !== " " &&
        this.state.texte_a_traduire.slice(0, 1) !== " ") ||
        (letter_pressed === " " &&
          this.state.texte_a_traduire.slice(0, 1) === " "))
    ) {
      this.setState((prevState) => ({
        texte_a_traduire: prevState.texte_a_traduire.substring(1),
      }));
    }
    this.setState({
      texte_traduit:
        h2p(event.target.value) + (letter_pressed === " " ? " " : ""),
      translated: {
        ...this.state.trandslated,
        body:
          h2p(event.target.value) +
          (this.state.translated.body.length > event.target.value.length
            ? this.state.translated.body.substring(event.target.value.length)
            : ""),
      },
    });
    letter_pressed = null;
  };

  handleKeyPress = (event) => {
    letter_pressed = event.key;
  };

  //the trad is validated
  valider = async (tradData = {}) => {
    this.setState({ disableBtn: true });
    let traduction = {
      langueCible: this.state.locale,
      articleId: this.state.jsonId || this.state.itemId,
      initialText: this.state.francais,
      translatedText: this.state.translated,
      timeSpent: this.state.time,
      isStructure: this.state.isStructure,
      avancement: this.state.avancement,
      type: this.state.type,
      ...(this.state.path.length > 0 && { path: this.state.path }),
      ...(this.state.id && { id: this.state.id }),
    };
    if (this.state.isExpert) {
      traduction = {
        ...traduction,
        isExpert: true,
      };
    }
    traduction = { ...traduction, ...tradData };

    //sent to the backend to save the trad
    await this.props.addTranslation(traduction);
    //traduction._id = (data.data.data || {})._id;
    this.setState({ traduction });
    //await this.get_trads();
    //if trad is done with 100% the sweet alert is sent  and we go back to the list of translations
    if (traduction.avancement >= 1) {
      Swal.fire({
        title: "Yay...",
        text: "La traduction a bien été enregistrée",
        type: "success",
        timer: 1000,
      });
      this._isMounted && this.setState({ disableBtn: false });
      this._isMounted && this.onSkip();
    }
    //catch(()=> this.setState({disableBtn: false}))
  };

  //gose back to the list of translations
  onSkip = () => {
    const i18nCode = (this.state.langue || {}).i18nCode,
      { isExpert, type, langue } = this.state;
    const nom = "avancement." + i18nCode;
    if (!isExpert) {
      this.props.history.push("/backend/user-translation/" + langue.i18nCode);
      return;
    }

    const query = {
      $or: [{ [nom]: { $lt: 1 } }, { [nom]: null }, { avancement: 1 }],
      status: "Actif",
    };
    API[
      isExpert
        ? "get_tradForReview"
        : type === "dispositif"
        ? "get_dispositif"
        : "getArticle"
    ]({ query: query, locale: i18nCode, random: true, isExpert })
      .then((data_res) => {
        let results = data_res.data.data;

        if (results.length === 0) {
          this.props.history.push(
            "/backend/user-translation/" + langue.i18nCode
          );
        } else {
          this.props.history.push({
            pathname:
              "/backend/" +
              (isExpert ? "validation" : "traduction") +
              "/" +
              (_.get(results, "0.typeContenu") || type),
            search: `?language=${langue._id}&dispositif=${_.get(results, "0._id")}`
          });
          this.setState({ disableBtn: false });
        }
      })
      .catch(() =>
        Swal.fire({
          title: "Oh non",
          text:
            "Aucun résultat n'a été retourné. 2 possibilités : vous avez traduit tout le contenu disponible, ou une erreur s'est produite",
          type: "error",
          timer: 2000,
        })
      );
  };

  handleCheckboxChange = (event) => {
    event.stopPropagation();
    this.setState({
      isComplete: event.target.checked,
      avancement: event.target.checked ? 1 : 0.495,
    });
  };

  handleCheckboxClicked = () => {
    this.setState((prevState) => ({
      isComplete: !prevState.isComplete,
      avancement: !prevState.isComplete ? 1 : 0.495,
    }));
  };

  handleSliderChange = (value) => {
    this.setState({ avancement: value });
    if (value === 1 || this.state.isComplete) {
      this.setState({ isComplete: value === 1 });
    }
  };

  upcoming = () =>
    Swal.fire({
      title: "Oh non!",
      text: "Cette fonctionnalité n'est pas encore activée",
      type: "error",
      timer: 1500,
    });

  render() {
    if (this.state.type === "dispositif") {
      return (
        <Dispositif
          type="translation"
          translate={this.translate}
          fwdSetState={this.fwdSetState}
          handleChange={this.handleChange}
          valider={this.valider}
          onEditorStateChange={this.onEditorStateChange}
          onSkip={this.onSkip}
          getTrads={this.get_trads}

          dispositif={this.props.selectedDispositif}
          typeContenu={this.props.selectedDispositif?.typeContenu || "dispositif"}
          translated={this.state.translated}
          isExpert={this.state.isExpert}
          locale={this.state.locale}
          langue={this.state.langue}
          traduction={this.state.traduction}
          francais={this.state.francais}
          traductionsFaites={this.state.traductionsFaites}
          autosuggest={this.state.autosuggest}

          translations={this.props.translations}
          translation={this.props.translation}
        />
      );
    }
    return null;
  }
}

const mapStateToProps = (state) => {
  return {
    userId: state.user.userId,
    isExpert: state.user.expertTrad,
    translations: state.translation.translations,
    translation: state.translation.translation,
    selectedDispositif: state.selectedDispositif,
  };
};

const mapDispatchToProps = {
  fetchTranslations: fetchTranslationsActionCreator,
  fetchSelectedDispositif: fetchSelectedDispositifActionCreator,
  addTranslation: addTradActionCreator,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TranslationHOC));
