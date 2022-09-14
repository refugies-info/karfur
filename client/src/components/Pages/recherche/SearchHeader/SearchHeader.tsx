import React, { useState } from "react";
import styles from "./SearchHeader.module.scss";
import { Container, Dropdown, DropdownMenu, DropdownToggle } from "reactstrap";
import SearchInput from "../SearchInput";
import ThemeDropdown from "../ThemeDropdown";
import { ObjectId } from "mongodb";

interface Props {}

const SearchHeader = (props: Props) => {
  const [departementsFocused, setDepartementsFocused] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const [themesFocused, setThemesFocused] = useState(false);
  const [themesOpen, setThemesOpen] = useState(false);
  const toggleThemes = () => setThemesOpen((prevState) => !prevState);

  const [needsSelected, setNeedsSelected] = useState<ObjectId[]>([]);

  return (
    <div className={styles.container}>
      <Container>
        <h1 className="h3 text-white">135 fiches disponibles pour votre recherche</h1>
        <div className={styles.filters}>
          <SearchInput
            label="Département"
            icon="pin-outline"
            active={departementsFocused}
            setActive={setDepartementsFocused}
          />

          <Dropdown isOpen={themesOpen || themesFocused} toggle={toggleThemes} className={styles.dropdown}>
            <DropdownToggle>
              <SearchInput
                label="Thèmes"
                icon="list-outline"
                active={themesFocused || themesOpen}
                setActive={setThemesFocused}
              />
            </DropdownToggle>
            <DropdownMenu>
              <ThemeDropdown
                needsSelected={needsSelected}
                setNeedsSelected={setNeedsSelected}
              />
            </DropdownMenu>
          </Dropdown>

          <SearchInput label="Mot-clé" icon="search-outline" active={searchFocused} setActive={setSearchFocused} />
        </div>
      </Container>
    </div>
  );
};

export default SearchHeader;
