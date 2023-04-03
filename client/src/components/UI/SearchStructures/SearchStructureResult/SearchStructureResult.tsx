import Image from "next/image";
import AutosuggestHighlightMatch from "autosuggest-highlight/match";
import AutosuggestHighlightParse from "autosuggest-highlight/parse";
import { GetAllStructuresResponse } from "api-types";
import { cls } from "lib/classname";
import { StyledStatusContainer } from "containers/Backend/Admin/sharedComponents/SubComponents";
import styles from "./SearchStructureResult.module.scss";

export interface SearchStructureResultProps {
  onClick: (structure: GetAllStructuresResponse) => void;
  query: string;
  selected: boolean;
  structure: GetAllStructuresResponse;
  logoSize?: number;
  className?: string;
}

const SearchStructureResult = ({
  query,
  selected,
  structure,
  onClick,
  logoSize,
  className,
}: SearchStructureResultProps) => {
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
      className={cls(styles.container, selected && styles.selected, onHold && styles.on_hold, className)}
      onClick={_onClick}
    >
      {structure.picture?.secure_url ? (
        <Image
          src={structure.picture.secure_url}
          className="me-2"
          alt="logo"
          width={logoSize || 40}
          height={logoSize || 40}
          style={{ objectFit: "contain" }}
        />
      ) : (
        <span style={{ width: logoSize || 40, height: logoSize || 40 }}></span>
      )}
      {firstPart !== "" ? (
        <span className={styles.name}>
          {parts_first.map((part, index) => (
            <span className={cls(part.highlight && styles.highlight)} key={index}>
              {part.text}
            </span>
          ))}
        </span>
      ) : null}
      <span className={styles.name_2}>
        {parts_second.map((part, index) => (
          <span className={cls(part.highlight && styles.highlight)} key={index}>
            {part.text}
          </span>
        ))}
      </span>
      {onHold ? (
        <StyledStatusContainer
          className={styles.tag}
          color={styles.orange}
          textColor={styles.darkColor}
          disabled={false}
        >
          En attente de validation
        </StyledStatusContainer>
      ) : null}
    </div>
  );
};

export default SearchStructureResult;
