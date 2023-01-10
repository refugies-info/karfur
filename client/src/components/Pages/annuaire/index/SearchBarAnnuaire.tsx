import React, { createRef, useEffect, useState } from "react";
import { colors } from "colors";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { Input } from "reactstrap";
import { Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import { structureTypes } from "data/structureTypes";
import FButton from "components/UI/FButton/FButton";
import { SimplifiedStructure } from "types/interface";
import Autocomplete from "react-google-autocomplete";
import styles from "./SearchBarAnnuaire.module.scss";
import { cls } from "lib/classname";
interface Props {
  t: any;
  filteredStructures: SimplifiedStructure[] | null;
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
      let newTypesSelected = props.typeSelected.concat([item]);
      props.setTypeSelected(newTypesSelected);
    }

    toggle();
  };

  const onChangeKeywords = (e: any) => props.setKeyword(e.target.value);

  const handleChange = (e: any) => props.setVille(e.target.value);

  const onPlaceSelected: any = (place: any) => {
    if (place.address_components.find((item: any) => item.types.includes("postal_code"))) {
      props.setDepNumber(
        place.address_components.find((item: any) => item.types.includes("postal_code")).long_name.substr(0, 2)
      );
    }
    if (place.address_components.find((item: any) => item.types.includes("administrative_area_level_2"))) {
      if (
        place.address_components.find((item: any) => item.types.includes("administrative_area_level_2")).long_name ===
        "Département de Paris"
      ) {
        props.setDepName("Paris");
      } else {
        props.setDepName(
          place.address_components.find((item: any) => item.types.includes("administrative_area_level_2")).long_name
        );
      }
    }
    props.setIsCityFocus(false);
    if (place.formatted_address) {
      props.setVille(place.formatted_address);
      props.setIsCitySelected(true);
    }
  };

  const resetCity = () => {
    props.setIsCitySelected(false);
    props.setVille("");
    props.setDepNumber("");
    props.setDepName("");
  };

  const removeType = (item: string) => {
    let array = props.typeSelected ? props.typeSelected.filter((el) => el !== item) : [];
    props.setTypeSelected(array);
    toggle();
  };

  useEffect(() => {
    if (props.isCityFocus) {
      autocompleteRef.current?.focus();
    }
  }, [autocompleteRef, props.isCityFocus]);

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
          <EVAIcon name="search-outline" fill={colors.gray90} id="bookmarkBtn" className="ms-2" size={"large"} />
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
          <EVAIcon name="pin-outline" fill={colors.gray90} className="me-2" id="bookmarkBtn" size={"large"} />
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
          <EVAIcon name="pin-outline" fill={colors.white} className="me-2" id="bookmarkBtn" size={"large"} />
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
          <EVAIcon name="pin-outline" fill={colors.gray90} className="me-2" id="bookmarkBtn" size={"large"} />
          <div className={styles.city_input}>
            <Autocomplete
              apiKey={process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_API_KEY || ""}
              className={styles.autocomplete}
              onBlur={() => {
                props.setIsCityFocus(false);
              }}
              placeholder=""
              id="villeAuto"
              value={props.ville}
              onChange={handleChange}
              onPlaceSelected={onPlaceSelected}
              ref={autocompleteRef}
              options={{
                componentRestrictions: { country: "fr" }
              }}
            />
            <EVAIcon name="close-circle" size="large" className="ms-2" onClick={() => {}} />
          </div>
        </div>
      )}{" "}
      <Dropdown isOpen={dropdownOpen} toggle={toggle}>
        <DropdownToggle
          caret={false}
          className={cls(styles.type_btn, props.typeSelected && props.typeSelected.length === 0 ? "" : styles.selected)}
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
                  style={props.typeSelected && props.typeSelected.includes(item) ? { border: "2px black solid" } : {}}
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
        {props.filteredStructures ? props.filteredStructures.length : 0} {props.t("Recherche.results", "résultats")}
      </div>
    </div>
  );
};
