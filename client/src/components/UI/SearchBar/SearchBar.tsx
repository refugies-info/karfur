import React, { useState } from "react";
import styled from "styled-components";
import Autosuggest from "react-autosuggest";
import AutosuggestHighlightMatch from "autosuggest-highlight/match";
import AutosuggestHighlightParse from "autosuggest-highlight/parse";
import { debounce } from "lodash";
import { useTranslation } from "next-i18next";
import NoResultImage from "assets/no_results.svg";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import FButton from "components/UI/FButton/FButton";
import {
  escapeRegexCharacters,
  getSuggestionValue,
  removeAccents,
} from "lib/search";

import { colors } from "colors";
import Image from "next/image";
import { SimplifiedStructure, SimplifiedUser } from "types/interface";

type Suggestion = SimplifiedStructure | SimplifiedUser;

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
  font-weight: bold;
  font-size: 22px;
  margin-bottom: 20px;
`;

interface Props {
  array?: SimplifiedStructure[] | SimplifiedUser[];
  structures?: boolean;
  users?: boolean;
  loupe?: boolean;
  className?: string;
  placeholder?: string;
  createNewCta?: string;
  selectItem: (s: SimplifiedStructure | SimplifiedUser) => void;
  handleChangeValueEntered?: (val: any) => void;
  toggleModal?: (name: any) => void;
}

const SearchBar = (props: Props) => {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoadingResults, setIsLoadingResults] = useState(false);

  const { t } = useTranslation();

  const onChange = (_: any, { newValue }: { newValue: string }) => {
    setValue(newValue);
    setIsLoadingResults(true);

    if (props.handleChangeValueEntered && props.structures) {
      props.handleChangeValueEntered(newValue);
    }
  };

  const getSuggestions = (value: string) => {
    if (!value || value.length === 0) return [];

    const escapedValue = removeAccents(
      escapeRegexCharacters((value || "").trim())
    );
    if (escapedValue === "") return [];

    const regex = new RegExp(".*?" + escapedValue + ".*", "i");
    if (!props.array) return [];
    //@ts-ignore
    return props.array.filter((child: Suggestion) => {
        if ("username" in child) { // User
          return (
            regex.test(removeAccents(child.username)) ||
            regex.test(removeAccents(child.email))
          );
        }
        return ( // Structure
          regex.test(child.acronyme) ||
          regex.test(removeAccents(child.nom)) ||
          //@ts-ignore
          child.createNew
        );
      }
    );
  };

  const onSuggestionsFetchRequested = debounce(({ value }) => {
    setSuggestions(getSuggestions(value));
    setIsLoadingResults(false);
  }, 200);

  const onSuggestionSelected = (_: any, { suggestion }: { suggestion: Suggestion }) => {
    props.selectItem(suggestion);
  };

  const isNoResult = value !== "" && !suggestions.length;

  const renderSuggestion = (suggestion: Suggestion, { query }: {query: any}) => {
    //@ts-ignore
    if (suggestion.createNew) {
      return (
        <span className="suggestion-content">
          <span className="name">
            <EVAIcon name="plus-outline" className="mr-10 plus-btn" />
            <span>{props.createNewCta || "Créer une nouvelle structure"}</span>
          </span>
          <span>
            <EVAIcon name="plus-circle-outline" fill={colors.gray70} />
          </span>
        </span>
      );
    }
    //@ts-ignore
    const firstPart = props.structures ? suggestion.acronyme : suggestion.username;
    //@ts-ignore
    const secondPart = props.structures ? suggestion.nom : suggestion.email;
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
        {suggestion.picture && suggestion.picture.secure_url && (
          <Image
            src={suggestion.picture.secure_url}
            className="selection-logo mr-10"
            alt="logo"
            width={40}
            height={40}
            objectFit="contain"
          />
        )}
        <span className="name">
          {parts.map((part, index) => {
            const className = part.highlight ? "highlight" : null;
            return (
              <span className={className || ""} key={index}>
                {part.text}
              </span>
            );
          })}
        </span>
      </span>
    );
  };

  const inputProps = {
    placeholder: t(
      props.placeholder || "Chercher",
      props.placeholder || "Chercher"
    ),
    value: value || "",
    onChange: onChange,
  };

  return (
    <div className={"md-form form-sm form-2 pl-0 isArray " + props.className}>
      <Autosuggest
        shouldRenderSuggestions={(value) => value.length >= 0}
        highlightFirstSuggestion
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        getSuggestionValue={(s) => getSuggestionValue(s)}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        onSuggestionSelected={onSuggestionSelected}
      />
      {isNoResult && props.structures && !isLoadingResults && (
        <NoResultContainer>
          {" "}
          <Image src={NoResultImage} width={127} height={90} alt="no results" />
          <div>
            <NoResultTextContainer>
              Aucune structure trouvée...
            </NoResultTextContainer>
            <FButton
              type="white"
              name="folder-add-outline"
              onClick={() => props.toggleModal ? props.toggleModal("creation") : null}
            >
              Créer une nouvelle structure
            </FButton>
          </div>
        </NoResultContainer>
      )}
      {props.loupe && (
        <i className="fa fa-search text-grey loupe-btn" aria-hidden="true" />
      )}
    </div>
  );
};

export default SearchBar;
