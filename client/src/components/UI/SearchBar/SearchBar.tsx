import React, { useState } from "react";
import styled from "styled-components";
import Autosuggest from "react-autosuggest";
import AutosuggestHighlightMatch from "autosuggest-highlight/match";
import AutosuggestHighlightParse from "autosuggest-highlight/parse";
import debounce from "lodash/debounce";
import NoResultImage from "assets/no_results.svg";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import FButton from "components/UI/FButton/FButton";
import { escapeRegexCharacters, getSuggestionValue } from "lib/search";
import { removeAccents } from "lib";

import { colors } from "colors";
import Image from "next/image";
import { GetActiveUsersResponse, GetAllUsersResponse } from "@refugies-info/api-types";

type Suggestion = GetActiveUsersResponse;

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
  array?: GetAllUsersResponse[] | GetActiveUsersResponse[];
  structures?: boolean;
  users?: boolean;
  className?: string;
  placeholder?: string;
  createNewCta?: string;
  selectItem: (s: GetActiveUsersResponse | GetAllUsersResponse) => void;
  handleChangeValueEntered?: (val: any) => void;
  toggleModal?: (name: any) => void;
}

/**
 * Ce composant fourni un champ de recherche avec suggestion
 * de résultats. Une fois sélectionné, la méthode selectItem est
 * appelée avec le résulat.
 *
 * Ce composant peut être utilisé pour les structures et les utilisateurs.
 *
 * @deprecated use SearchStructures
 *
 * @param props Props
 * @returns SearchBar component
 */
const SearchBar = (props: Props) => {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoadingResults, setIsLoadingResults] = useState(false);

  const onChange = (_: any, { newValue }: { newValue: string }) => {
    setValue(newValue);
    setIsLoadingResults(true);

    if (props.handleChangeValueEntered && props.structures) {
      props.handleChangeValueEntered(newValue);
    }
  };

  const getSuggestions = (value: string) => {
    if (!value || value.length === 0) return [];

    const escapedValue = removeAccents(escapeRegexCharacters((value || "").trim()));
    if (escapedValue === "") return [];

    const regex = new RegExp(".*?" + escapedValue + ".*", "i");
    if (!props.array) return [];
    //@ts-ignore
    return props.array.filter((child) => {
      return regex.test(removeAccents(child.username)) || regex.test(removeAccents(child.email));
    });
  };

  const onSuggestionsFetchRequested = debounce(({ value }) => {
    setSuggestions(getSuggestions(value));
    setIsLoadingResults(false);
  }, 200);

  const onSuggestionSelected = (_: any, { suggestion }: { suggestion: Suggestion }) => {
    props.selectItem(suggestion);
  };

  const isNoResult = value !== "" && !suggestions.length;

  const renderSuggestion = (suggestion: Suggestion, { query }: { query: any }) => {
    //@ts-ignore
    if (suggestion.createNew) {
      return (
        <span className="suggestion-content">
          <span className="name">
            <EVAIcon name="plus-outline" className="me-2 plus-btn" />
            <span>{props.createNewCta || "Créer une nouvelle structure"}</span>
          </span>
          <span>
            <EVAIcon name="plus-circle-outline" fill={colors.gray70} />
          </span>
        </span>
      );
    }
    //@ts-ignore
    const firstPart = (props.structures ? suggestion.acronyme : suggestion.username) || "";
    //@ts-ignore
    const secondPart = (props.structures ? suggestion.nom : suggestion.email) || "";
    const matches_first = AutosuggestHighlightMatch(firstPart, query + " " + query);
    const parts_first = AutosuggestHighlightParse(firstPart, matches_first);
    const matches_second = AutosuggestHighlightMatch(secondPart, query + " " + query);
    const parts_second = AutosuggestHighlightParse(secondPart, matches_second);
    return (
      <span className="suggestion-content">
        {suggestion.picture && suggestion.picture.secure_url ? (
          <Image
            src={suggestion.picture.secure_url}
            className="selection-logo me-2"
            alt="logo"
            width={40}
            height={40}
            style={{ objectFit: "contain" }}
          />
        ) : (
          <span style={{ width: "40px" }}></span>
        )}
        {firstPart !== "" ? (
          <span className="name">
            {parts_first.map((part, index) => {
              const className = part.highlight ? "highlight" : null;
              return (
                <span className={className || ""} key={index}>
                  {part.text}
                </span>
              );
            })}
          </span>
        ) : null}
        <span className="name-2">
          {parts_second.map((part, index) => {
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
    placeholder: props.placeholder || "Chercher",
    value: value || "",
    onChange: onChange,
  };

  return (
    <div className={"md-form form-sm form-2 ps-0 isArray " + props.className}>
      <Autosuggest
        shouldRenderSuggestions={(value) => value.length >= 0}
        highlightFirstSuggestion
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        getSuggestionValue={(s) => getSuggestionValue(s)}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        onSuggestionSelected={onSuggestionSelected}
        onSuggestionsClearRequested={() => setSuggestions([])}
        focusInputOnSuggestionClick
      />
      {isNoResult && props.structures && !isLoadingResults && (
        <NoResultContainer>
          {" "}
          <Image src={NoResultImage} width={127} height={90} alt="no results" />
          <div>
            <NoResultTextContainer>Aucune structure trouvée...</NoResultTextContainer>
            <FButton
              type="white"
              name="folder-add-outline"
              onClick={() => (props.toggleModal ? props.toggleModal("creation") : null)}
            >
              Créer une nouvelle structure
            </FButton>
          </div>
        </NoResultContainer>
      )}
    </div>
  );
};

export default SearchBar;
