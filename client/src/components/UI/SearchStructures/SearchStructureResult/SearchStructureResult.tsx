import AutosuggestHighlightMatch from "autosuggest-highlight/match";
import AutosuggestHighlightParse from "autosuggest-highlight/parse";
import { StyledStatusContainer } from "containers/Backend/Admin/sharedComponents/SubComponents";
import Image from "next/image";
import { SimplifiedStructureForAdmin, Structure } from "types/interface";

import styles from "../SearchStructures.module.scss";

export interface SearchStructureResultProps {
  onClick: (structure: SimplifiedStructureForAdmin | Structure) => void;
  query: string;
  selected: boolean;
  structure: SimplifiedStructureForAdmin | Structure;
}

const SearchStructureResult = ({ query, selected, structure, onClick }: SearchStructureResultProps) => {
  const firstPart = structure.acronyme || "";
  const secondPart = structure.nom || "";

  const matches_first = AutosuggestHighlightMatch(firstPart, query, { insideWords: true });
  const parts_first = AutosuggestHighlightParse(firstPart, matches_first);
  const matches_second = AutosuggestHighlightMatch(secondPart, query, { insideWords: true });
  const parts_second = AutosuggestHighlightParse(secondPart, matches_second);

  const _onClick = () => {
    onClick(structure);
  };

  const onHold = structure.status === "En attente";

  return (
    <div
      className={
        styles.search_structures__result +
        (selected ? ` ${styles.selected} ` : "") +
        (onHold ? ` ${styles.on_hold} ` : "")
      }
      onClick={_onClick}
    >
      {structure.picture && structure.picture.secure_url ? (
        <Image
          src={structure.picture.secure_url}
          className="selection-logo me-2"
          alt="logo"
          width={40}
          height={40}
          style={{ objectFit: "contain" }}
        />
      ) : (
        <span style={{ width: 40, height: 40 }}></span>
      )}
      {firstPart !== "" ? (
        <span className={styles.name}>
          {parts_first.map((part, index) => {
            const className = part.highlight ? styles.highlight : null;
            return (
              <span className={className || ""} key={index}>
                {part.text}
              </span>
            );
          })}
        </span>
      ) : null}
      <span className={styles.name_2}>
        {parts_second.map((part, index) => {
          const className = part.highlight ? styles.highlight : null;
          return (
            <span className={className || ""} key={index}>
              {part.text}
            </span>
          );
        })}
      </span>
      {onHold ? (
        <StyledStatusContainer className={styles.tag} color="#FF9800" textColor="black" disabled={false}>
          En attente de validation
        </StyledStatusContainer>
      ) : null}
    </div>
  );
};

export default SearchStructureResult;
