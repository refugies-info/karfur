import React from "react";
import { connect } from "react-redux";
import Autosuggest from "react-autosuggest";
import AutosuggestHighlightMatch from "autosuggest-highlight/match";
import AutosuggestHighlightParse from "autosuggest-highlight/parse";
import debounce from "lodash.debounce";
import NoResultImage from "../../../assets/no_results.svg";
import { withRouter } from "react-router-dom";
import { withTranslation } from "react-i18next";

import EVAIcon from "../../../components/UI/EVAIcon/EVAIcon";

import "./SearchBar.scss";
import { colors } from "colors";
import FButton from "components/FigmaUI/FButton/FButton";
import styled from "styled-components";

const NoResultContainer = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  background-color: #ffe2b8;
  padding: 20px 50px;
  justify-content: space-between;
  border-radius: 12px;
  width: -webkit-fill-available;
  margin-top: 16px;
`;

const NoResultTextContainer = styled.div`
  font-weight: 700;
  font-size: 22px;
  margin-bottom: 20px;
`;

const escapeRegexCharacters = (str) =>
  str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const getSuggestionValue = (suggestion, isArray = false, structures = false) =>
  isArray
    ? structures
      ? (suggestion.acronyme || "") +
        (suggestion.acronyme && suggestion.nom ? " - " : "") +
        (suggestion.nom || "")
      : (suggestion.username || "") +
        (suggestion.username && suggestion.email ? " - " : "") +
        (suggestion.email || "")
    : suggestion.titreMarque || suggestion.titreInformatif; // + (suggestion.titreMarque && suggestion.titreInformatif ? " - " : "") + suggestion.titreInformatif;

const removeAccents = (str = "") => {
  var accents =
    "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
  var accentsOut =
    "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
  str = str.split("");
  var i, x;
  for (i = 0; i < str.length; i++) {
    if ((x = accents.indexOf(str[i])) !== -1) {
      str[i] = accentsOut[x];
    }
  }
  return str.join("");
};
export class SearchBar extends React.Component {
  state = {
    showSearch: true,
    value: "",
    suggestions: [],
    selectedResult: {},
    isFocused: false,
  };

  onChange = (_, { newValue }) => {
    this.setState({ value: newValue });
    this.props.handleChangeValueEntered(newValue);
  };
  onSuggestionsFetchRequested = debounce(
    ({ value }) => this.setState({ suggestions: this.getSuggestions(value) }),
    200
  );
  onSuggestionsClearRequested = () => this.setState({ suggestions: [] });

  getSuggestions = (value) => {
    this.setState({ isFocused: true });
    if (!value || value.length === 0) {
      return [];
    }
    const array = this.props.array || this.props.dispositifs || [];
    const escapedValue = removeAccents(
      escapeRegexCharacters((value || "").trim())
    );
    if (escapedValue === "") {
      return [];
    }
    const regex = new RegExp(".*?" + escapedValue + ".*", "i");
    return array.filter((child) => {
      return this.props.isArray
        ? regex.test(child.acronyme) ||
            regex.test(removeAccents(child.nom)) ||
            child.createNew ||
            regex.test(removeAccents(child.username)) ||
            regex.test(removeAccents(child.email))
        : regex.test(removeAccents(child.titreMarque)) ||
            regex.test(removeAccents(child.titreInformatif)) ||
            regex.test(removeAccents(child.abstract)) ||
            child.createNew ||
            regex.test(child.contact) ||
            (child.tags || []).some((x) => regex.test(x)) ||
            (child.audience || []).some((x) => regex.test(x)) ||
            (child.audienceAge || []).some((x) => regex.test(x)) ||
            this.findInContent(child.contenu, regex);
    });
  };

  findInContent = (contenu, regex) =>
    (contenu || []).some(
      (x) =>
        regex.test(x.title) ||
        regex.test(x.content) ||
        (x.children &&
          x.children.length > 0 &&
          this.findInContent(x.children, regex))
    );

  onSuggestionSelected = (_, { suggestion }) => {
    this.setState({ selectedResult: suggestion });
    this.props.isArray
      ? this.props.selectItem(suggestion)
      : this.goToDispositif(suggestion, true);
  };

  goToDispositif = (dispositif = {}) => {
    this.props.history.push({
      pathname:
        "/" +
        (dispositif.typeContenu || "dispositif") +
        (dispositif._id ? "/" + dispositif._id : ""),
      state: {
        checkingVariante:
          this.props.toVariante && dispositif.typeContenu === "demarche",
        textInput: this.state.value,
      },
    });
  };

  validateSearch = () => this.goToDispositif(this.state.selectedResult, true);

  render() {
    const { isArray, structures, createNewCta, withEye, t } = this.props;
    const { value } = this.state;
    const isNoResult = value !== "" && !this.state.suggestions.length;
    const renderSuggestion = (suggestion, { query }) => {
      if (suggestion.createNew) {
        return (
          <span className="suggestion-content">
            <span className="name">
              <EVAIcon name="plus-outline" className="mr-10 plus-btn" />
              <span>{createNewCta || "Créer une nouvelle structure"}</span>
            </span>
            <span>
              <EVAIcon name="plus-circle-outline" fill={colors.grisFonce} />
            </span>
          </span>
        );
      }
      const firstPart = isArray
        ? structures
          ? suggestion.acronyme
          : suggestion.username
        : suggestion.titreMarque;
      const secondPart = isArray
        ? structures
          ? suggestion.nom
          : suggestion.email
        : suggestion.titreInformatif;
      const suggestionText =
        (firstPart || "") +
        (firstPart && secondPart ? " - " : "") +
        (secondPart || "");
      const matches = AutosuggestHighlightMatch(
        suggestionText,
        query + " " + query
      );
      const parts = AutosuggestHighlightParse(suggestionText, matches);
      return (
        <span className="suggestion-content">
          {isArray && suggestion.picture && suggestion.picture.secure_url && (
            <img
              src={suggestion.picture.secure_url}
              className="selection-logo mr-10"
              alt="logo"
            />
          )}
          <span className="name">
            {parts.map((part, index) => {
              const className = part.highlight ? "highlight" : null;
              return (
                <span className={className} key={index}>
                  {part.text}
                </span>
              );
            })}
          </span>
          {withEye && (
            <span className="oeil-btn">
              <EVAIcon name="eye-outline" fill={colors.noir} />
            </span>
          )}
        </span>
      );
    };

    const inputProps = {
      placeholder:
        t &&
        t(
          this.props.placeholder || "Chercher",
          this.props.placeholder || "Chercher"
        ),
      value: value || "",
      onChange: this.onChange,
    };

    return (
      <div
        className={
          "md-form form-sm form-2 pl-0 " +
          this.props.className +
          (isArray ? " isArray" : "")
        }
      >
        <Autosuggest
          shouldRenderSuggestions={(value) => value.length >= 0}
          highlightFirstSuggestion
          suggestions={this.state.suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          getSuggestionValue={(s) => getSuggestionValue(s, isArray, structures)}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
          onSuggestionSelected={this.onSuggestionSelected}
        />
        {isNoResult && (
          <NoResultContainer>
            {" "}
            <img
              src={NoResultImage}
              style={{ height: "90px" }}
              alt="no results"
            />
            <div>
              <NoResultTextContainer>
                Aucune structure trouvée...
              </NoResultTextContainer>
              <FButton
                type="white"
                name="folder-add-outline"
                onClick={() => this.props.toggleModal("creation")}
              >
                Créer une nouvelle structure
              </FButton>
            </div>
          </NoResultContainer>
        )}
        {this.props.loupe && (
          <i className="fa fa-search text-grey loupe-btn" aria-hidden="true" />
        )}
        {this.props.validate && (
          <div className="input-group-append" onClick={this.validateSearch}>
            <span className="input-group-text amber lighten-3" id="basic-text1">
              Valider
            </span>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    dispositifs: state.activeDispositifs,
  };
};

export default withRouter(
  connect(mapStateToProps)(withTranslation()(SearchBar))
);
