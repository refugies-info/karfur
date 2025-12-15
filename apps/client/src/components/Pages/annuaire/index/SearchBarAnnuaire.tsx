import type { GetActiveStructuresResponse } from "@refugies-info/api-types";
import { structureTypes } from "data/structureTypes";
import { createRef, useEffect, useState } from "react";
import { Dropdown, DropdownMenu, DropdownToggle, Input } from "reactstrap";
import EVAIcon from "~/components/UI/EVAIcon/EVAIcon";
import FButton from "~/components/UI/FButton/FButton";
import { cls } from "~/lib/classname";
import { colors } from "~/utils/colors";
import styles from "./SearchBarAnnuaire.module.scss";

interface Props {
  t: any;
  filteredStructures: GetActiveStructuresResponse[] | null;
  keyword: string;
  setKeyword: (a: string) => void;
  typeSelected: string[] | null;
  setTypeSelected: (a: string[]) => void;
  ville: string;
  setVille: (a: string) => void;
  depName: string;
  setDepName: (a: string) => void;
  depNumber: string | null;
  setDepNumber: (a: string) => void;
  isCityFocus: boolean;
  setIsCityFocus: (a: boolean) => void;
  isCitySelected: boolean;
  setIsCitySelected: (a: boolean) => void;
}

export const SearchBarAnnuaire = (props: Props) => {
  const [dropdownOpen, setOpen] = useState(false);

  const toggle = () => setOpen(!dropdownOpen);
  const autocompleteRef = createRef<any>();

  const selectType = (item: string) => {
    if (props.typeSelected && !props.typeSelected.includes(item)) {
      const newTypesSelected = props.typeSelected.concat([item]);
      props.setTypeSelected(newTypesSelected);
    }

    toggle();
  };

  const onChangeKeywords = (e: any) => props.setKeyword(e.target.value);

  const handleChange = (e: any) => props.setVille(e.target.value);

  const [suggestions, setSuggestions] = useState<any[]>([]);

  const onPlaceSelected: any = (place: any) => {
    props.setDepNumber(place.properties.postcode.substr(0, 2));
    // context: "87, Haute-Vienne, Nouvelle-Aquitaine"
    const contextParts = place.properties.context.split(", ");
    if (contextParts.length > 1) {
      props.setDepName(contextParts[1]);
    }

    props.setIsCityFocus(false);
    props.setVille(place.properties.label);
    props.setIsCitySelected(true);
    setSuggestions([]);
  };

  const resetCity = () => {
    props.setIsCitySelected(false);
    props.setVille("");
    props.setDepNumber("");
    props.setDepName("");
  };

  const removeType = (item: string) => {
    const array = props.typeSelected ? props.typeSelected.filter((el) => el !== item) : [];
    props.setTypeSelected(array);
    toggle();
  };

  useEffect(() => {
    if (props.isCityFocus && autocompleteRef.current) {
      autocompleteRef.current.focus();
    }
  }, [props.isCityFocus, autocompleteRef]);

  useEffect(() => {
    if (props.ville.length > 2) {
      fetch(`https://data.geopf.fr/geocodage/search?q=${props.ville}&type=municipality`)
        .then((response) => response.json())
        .then((data) => {
          if (data.features) {
            setSuggestions(data.features);
          }
        });
    } else {
      setSuggestions([]);
    }
  }, [props.ville]);

  return (
    <div className={styles.container}>
      <div className={styles.btn}>
        <Input
          onChange={onChangeKeywords}
          type="text"
          plaintext={true}
          className={styles.input}
          placeholder={props.t("Annuaire.Rechercher par", "Rechercher par nom ...")}
          value={props.keyword}
        />
        {}

        {props.keyword === "" ? (
          <EVAIcon
            name="search-outline"
            fill={colors.gray90}
            id="bookmarkBtn"
            className="ms-2"
            size={"large"}
          />
        ) : (
          <EVAIcon
            name="close-circle"
            fill={colors.gray90}
            id="bookmarkBtn"
            className="ms-2"
            size={"large"}
            onClick={() => props.setKeyword("")}
          />
        )}
      </div>
      {props.ville === "" && !props.isCityFocus ? (
        <div className={styles.btn}>
          <EVAIcon
            name="pin-outline"
            fill={colors.gray90}
            className="me-2"
            id="bookmarkBtn"
            size={"large"}
          />
          <div
            onClick={() => {
              props.setIsCityFocus(true);
            }}
          >
            {props.t("Dispositif.Ville", "Ville")}
          </div>{" "}
        </div>
      ) : props.isCitySelected ? (
        <div className={`${styles.btn} ${styles.dark}`}>
          <EVAIcon
            name="pin-outline"
            fill={colors.white}
            className="me-2"
            id="bookmarkBtn"
            size={"large"}
          />
          <div
            onClick={() => {
              props.setIsCitySelected(false);
            }}
          >
            {props.ville}
          </div>{" "}
          <EVAIcon
            name="close-circle"
            fill={colors.white}
            className="ms-2"
            size={"large"}
            onClick={() => {
              resetCity();
            }}
          />
        </div>
      ) : (
        <div className={styles.btn}>
          <EVAIcon
            name="pin-outline"
            fill={colors.gray90}
            className="me-2"
            id="bookmarkBtn"
            size={"large"}
          />
          <div className={styles.city_input}>
            <input
              className={styles.autocomplete}
              onBlur={() => {
                // Do not hide suggestions right away to let the click happen
                setTimeout(() => props.setIsCityFocus(false), 200);
              }}
              placeholder=""
              id="villeAuto"
              value={props.ville}
              onChange={handleChange}
              ref={autocompleteRef}
            />
            {suggestions.length > 0 && props.isCityFocus && (
              <ul
                className="list-group position-absolute w-100"
                style={{ zIndex: 1000, top: "100%" }}
              >
                {suggestions.map((place, i) => (
                  <li
                    key={i}
                    className="list-group-item list-group-item-action"
                    onClick={() => onPlaceSelected(place)}
                  >
                    {place.properties.label}
                  </li>
                ))}
              </ul>
            )}
            <EVAIcon name="close-circle" size="large" className="ms-2" onClick={() => {}} />
          </div>
        </div>
      )}{" "}
      <Dropdown isOpen={dropdownOpen} toggle={toggle}>
        <DropdownToggle
          caret={false}
          className={cls(
            styles.type_btn,
            props.typeSelected && props.typeSelected.length === 0 ? "" : styles.selected,
          )}
        >
          {props.typeSelected && props.typeSelected.length === 1
            ? props.typeSelected[0]
            : props.typeSelected && props.typeSelected.length > 1
              ? props.typeSelected.length + " types"
              : props.t("Annuaire.Type de structure", "Type de structure")}
          {props.typeSelected && props.typeSelected.length > 0 && (
            <EVAIcon
              name="close-circle"
              fill={colors.white}
              onClick={(e: any) => {
                e.stopPropagation();
                props.setTypeSelected([]);
              }}
              id="bookmarkBtn"
              className="ms-2"
              size={"large"}
            />
          )}
        </DropdownToggle>
        <DropdownMenu>
          <div className={styles.dropdown}>
            {structureTypes.map((item: string, key) => {
              return (
                <FButton
                  onClick={() => {
                    selectType(item);
                  }}
                  type="white"
                  style={
                    props.typeSelected && props.typeSelected.includes(item)
                      ? { border: "2px black solid" }
                      : {}
                  }
                  className="mb-8"
                  key={key}
                >
                  {item}

                  {props.typeSelected && props.typeSelected.includes(item) && (
                    <EVAIcon
                      name="close-circle"
                      fill={colors.white}
                      onClick={(e: any) => {
                        e.stopPropagation();
                        removeType(item);
                      }}
                      id="bookmarkBtn"
                      className="ms-2"
                      size={"large"}
                    />
                  )}
                </FButton>
              );
            })}
          </div>
        </DropdownMenu>
      </Dropdown>
      <div className={styles.results}>
        {props.filteredStructures ? props.filteredStructures.length : 0}{" "}
        {props.t("Recherche.results", "résultats")}
      </div>
    </div>
  );
};
