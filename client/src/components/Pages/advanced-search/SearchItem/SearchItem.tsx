import React, { useState, useEffect, createRef } from "react";
import { useTranslation } from "next-i18next";
import { Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import Autocomplete from "react-google-autocomplete";
import FSearchBtn from "components/UI/FSearchBtn/FSearchBtn";
import Streamline from "assets/streamline";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import useRTL from "hooks/useRTL";
import styles from "./SearchItem.module.scss";
import fsb_styles from "components/UI/FSearchBtn/FSearchBtn.module.scss";
import { SearchQuery } from "pages/recherche";
import {
  SearchItemType,
  AgeFilter,
  FrenchLevelFilter,
} from "data/searchFilters";
import { Theme } from "types/interface";
import { cls } from "lib/classname";
import { useSelector } from "react-redux";
import { themesSelector } from "services/Themes/themes.selectors";
import { getThemeName } from "lib/getThemeName";
import { useRouter } from "next/router";

interface Props {
  geoSearch: boolean;
  searchItem: SearchItemType;
  query: SearchQuery;
  addToQuery: (query: Partial<SearchQuery>) => void;
  switchGeoSearch: (val: boolean) => void;
  removeFromQuery: () => void;
}
const SearchItem = (props: Props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [ville, setVille] = useState("");
  const [villeAuto, setVilleAuto] = useState("");

  const { t } = useTranslation();
  const router = useRouter();
  const isRTL = useRTL();

  const autocompleteRef = createRef<any>();

  useEffect(() => {
    if (!props.geoSearch) {
      setVille("");
      setVilleAuto("");
    }
  }, [props.geoSearch]);

  useEffect(() => {
    if (
      ville === "" &&
      props.searchItem.type === "loc" &&
      props.query.loc?.city
    ) {
      setVille(props.query.loc?.city || "");
      setVilleAuto(props.query.loc?.city || "");
    }
  }, [ville, props.query.loc, props.searchItem.type]);

  const onPlaceSelected = (place: any) => {
    if (place.formatted_address) {
      setVille(place.formatted_address);
      props.addToQuery({
        [props.searchItem.type]: {
          city: place.address_components[0].long_name,
          dep: place.address_components[1].long_name,
        }
      });
    }
  };

  const toggle = () => setDropdownOpen(!dropdownOpen);
  const initializeVille = () => {
    setVille("");
    setVilleAuto("");
  };
  const selectOption = (item: Theme | AgeFilter | FrenchLevelFilter) => {
    const value = props.searchItem.type === "theme" ? [(item as Theme).name.fr] : item.name;
    props.addToQuery({ [props.searchItem.type]: value });
    toggle();
  };

  const themes = useSelector(themesSelector);
  const active = !!props.query[props.searchItem.type];
  const currentTheme = props.searchItem.type === "theme" && active
    ? themes.find((theme) => theme.name.fr === props.query.theme?.[0])
    : null;

  useEffect(() => {
    if (props.geoSearch) {
      autocompleteRef.current?.focus();
    }
  }, [autocompleteRef, props.geoSearch])

  return (
    <div className={styles.search_col}>
      <span className={"mr-10 " + styles.title}>
        {t("SearchItem." + props.searchItem.title, props.searchItem.title)}
      </span>
      {
        // Location Filter
        props.searchItem.type === "loc" ? (
          ville !== "" && props.geoSearch ? (
            <FSearchBtn inHeader extraPadding active={active} noIcon>
              {ville ? ville.slice(0, 20) + (ville.length > 20 ? "..." : "") : null}
              {active && (
                <EVAIcon
                  name="close-outline"
                  size="large"
                  className="ml-10"
                  onClick={(e: any) => {
                    e.stopPropagation();
                    props.removeFromQuery();
                    initializeVille();
                  }}
                />
              )}
            </FSearchBtn>
          ) : ville === "" && props.geoSearch ? (
            <div className="position-relative">
              <Autocomplete
                apiKey={process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_API_KEY || ""}
                className={cls(
                  fsb_styles.search_btn,
                  fsb_styles.extra_padding,
                  fsb_styles.in_header,
                  styles.search_autocomplete,
                  active ? fsb_styles.active : "",
                )}
                onBlur={() =>
                  ville === "" && villeAuto === "" && props.switchGeoSearch(false)
                }
                placeholder={props.searchItem.placeholder}
                id="villeAuto"
                value={villeAuto}
                ref={autocompleteRef}
                onChange={(e: any) => setVilleAuto(e.target.value)}
                onPlaceSelected={onPlaceSelected}
                options={{
                  componentRestrictions: { country: "fr" },
                }}
              />
              {active && (
                <EVAIcon
                  name="close-outline"
                  size="large"
                  className="ml-10"
                  onClick={(e: any) => {
                    e.stopPropagation();
                    props.removeFromQuery();
                    initializeVille();
                  }}
                />
              )}
            </div>
          ) : (
            <FSearchBtn
              inHeader
              extraPadding
              onClick={() => { props.switchGeoSearch(true) }}
            >
              {t("SearchItem.ma ville", "ma ville")}
            </FSearchBtn>
          )
        ) : (

        // Regular dropdown
        <Dropdown
          isOpen={dropdownOpen}
          toggle={toggle}
          className="inline-block"
        >
          <DropdownToggle
            caret={false}
            tag="div"
            aria-haspopup={false}
            aria-expanded={dropdownOpen}
            className={cls(
              fsb_styles.search_btn,
              fsb_styles.extra_padding,
              fsb_styles.in_header,
              !!currentTheme && "bg-" + currentTheme.short.fr.split(" ").join("-"),
              props.searchItem.type !== "theme" && active && fsb_styles.active,
            )}
          >
            {active && props.searchItem.type === "theme" && currentTheme && (
              <div
                style={{
                  display: "flex",
                  marginRight: isRTL ? 0 : 10,
                  marginLeft: isRTL ? 10 : 0,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Streamline
                  name={currentTheme.icon}
                  stroke={"white"}
                  width={22}
                  height={22}
                />
              </div>
                )}
            {active
              ? t("Tags." + props.query[props.searchItem.type], props.query[props.searchItem.type])
              : t(
                  "Tags." + props.searchItem.placeholder,
                  props.searchItem.placeholder
                )}
            {active ? (
              <EVAIcon
                key={active.toString()}
                name="close-outline"
                size="large"
                className="ml-10"
                onClick={(e: any) => {
                  e.stopPropagation();
                  props.removeFromQuery();
                }}
              />
            ) : (
              <EVAIcon
                key={active.toString()}
                name="arrow-ios-downward-outline"
                size="large"
                className="ml-8"
                onClick={(e: any) => {
                  e.stopPropagation();
                  toggle();
                }}
              />
            )}
          </DropdownToggle>
          <DropdownMenu className={styles.dropdown}>
            <div
              className={cls(
                styles.options,
                props.searchItem.type === "theme" && styles.tags,
              )}
            >
              {((props.searchItem?.children || []) as Theme[]).map(
                (theme: Theme, idx: number) => {
                  return (
                    <FSearchBtn
                      key={idx}
                      onClick={() => selectOption(theme)}
                      filter={!theme.short?.fr}
                      searchOption
                      inHeader
                      color={(theme.short?.fr || "").replace(/ /g, "-")}
                    >
                      {theme.icon ? (
                        <div
                          style={{
                            display: "flex",
                            marginRight: isRTL ? 0 : 10,
                            marginLeft: isRTL ? 10 : 0,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Streamline
                            name={theme.icon}
                            stroke={"white"}
                            width={22}
                            height={22}
                          />
                        </div>
                      ) : null}
                      {getThemeName(theme, router.locale)}
                    </FSearchBtn>
                  );
                }
              )}
            </div>
          </DropdownMenu>
        </Dropdown>
        )
      }
    </div>
  );
};

export default SearchItem;
