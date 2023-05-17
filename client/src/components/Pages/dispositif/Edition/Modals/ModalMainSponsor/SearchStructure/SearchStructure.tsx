import React, { ChangeEventHandler, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Collapse } from "reactstrap";
import { Id } from "api-types";
import { removeAccents } from "lib";
import { escapeRegexCharacters } from "lib/search";
import { allStructuresSelector } from "services/AllStructures/allStructures.selector";
import SearchStructureResult from "components/UI/SearchStructures/SearchStructureResult";
import Input from "components/Pages/dispositif/Input";
import ChoiceButton from "../../../ChoiceButton";
import { RemovableItem } from "../../components";
import StructureImage from "assets/dispositif/structure-image.svg";
import styles from "./SearchStructure.module.scss";

interface Props {
  setSelectedStructure: React.Dispatch<React.SetStateAction<Id | null>>;
  selectedStructure: Id | null;
  setCreateStructure: React.Dispatch<React.SetStateAction<boolean>>;
  createStructure: boolean;
}

const SearchStructure = (props: Props) => {
  const { setSelectedStructure, selectedStructure, setCreateStructure, createStructure } = props;
  const structures = useSelector(allStructuresSelector).filter(
    (structure) => structure.status === "Actif" || structure.status === "En attente",
  );
  const [needle, setNeedle] = useState<string>("");
  const [isCollapseOpen, setIsCollapseOpen] = useState(false);

  const onChangeNeedle: ChangeEventHandler<HTMLInputElement> = useCallback(
    (data) => {
      setNeedle(data.currentTarget.value);
      setSelectedStructure(null);
    },
    [setSelectedStructure, setNeedle],
  );

  const filteredStructures = useMemo(() => {
    if (!needle || needle.length < 2) return [];

    const escapedValue = removeAccents(escapeRegexCharacters((needle || "").trim()));
    if (escapedValue === "") return [];

    const regex = new RegExp(".*?" + escapedValue + ".*", "i");
    return structures.filter(
      (structure) => regex.test(structure.acronyme || "") || regex.test(removeAccents(structure.nom)),
    );
  }, [needle, structures]);

  useEffect(() => {
    setIsCollapseOpen(filteredStructures.length > 0);
  }, [filteredStructures]);

  const selectedStructureData = useMemo(() => {
    return structures.find((s) => s._id === selectedStructure);
  }, [selectedStructure, structures]);

  // show structure does not exist
  const [showCreateButton, setShowCreateButton] = useState(false);
  const onFocus = useCallback(() => setShowCreateButton(true), []);

  return (
    <div className="position-relative">
      <p>Tapez le nom de la structure</p>
      <Input
        id="search-structure-input"
        placeholder="Exemple: ..."
        type="text"
        onChange={onChangeNeedle}
        onFocus={onFocus}
        value={needle}
        icon="search-outline"
        className="mb-6"
      />

      {selectedStructureData && (
        <RemovableItem
          text={selectedStructureData.nom}
          image={selectedStructureData.picture?.secure_url}
          onClick={() => setSelectedStructure(null)}
        />
      )}

      <Collapse isOpen={isCollapseOpen} className={styles.collapse}>
        {filteredStructures.map((structure) => (
          <SearchStructureResult
            key={structure._id.toString()}
            onClick={() => {
              setSelectedStructure(structure._id);
              if (createStructure) setCreateStructure(false);
              setNeedle("");
            }}
            query={needle}
            selected={selectedStructure === structure._id}
            structure={structure}
            logoSize={24}
            className={styles.item}
          />
        ))}
      </Collapse>

      {showCreateButton && (
        <ChoiceButton
          text="Cette structure n’existe pas encore dans notre base de données. Créez-la !"
          selected={createStructure}
          onSelect={() => {
            setCreateStructure(true);
            if (selectedStructure) setSelectedStructure(null);
          }}
          type="radio"
          className="mt-6"
          image={StructureImage}
        />
      )}
    </div>
  );
};

export default SearchStructure;
