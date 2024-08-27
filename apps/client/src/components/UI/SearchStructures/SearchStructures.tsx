import Image from "next/image";
import { ChangeEventHandler, useCallback, useMemo, useState } from "react";
import { Row } from "reactstrap";
import styled from "styled-components";

import { useTranslation } from "next-i18next";
import NoResultImage from "~/assets/no_results.svg";
import { removeAccents } from "~/lib";
import { escapeRegexCharacters } from "~/lib/search";
import FButton from "../FButton";

import { GetAllStructuresResponse } from "@refugies-info/api-types";
import SearchStructureResult from "./SearchStructureResult";
import styles from "./SearchStructures.module.scss";

export interface SearchStructuresProps {
  onChange: (structure: GetAllStructuresResponse | null) => void;
  onClickCreateStructure: Function;
  selectedStructure: Partial<GetAllStructuresResponse> | null;
  structures: Array<GetAllStructuresResponse>;
}

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

const SearchStructures = ({
  onChange,
  onClickCreateStructure,
  selectedStructure,
  structures = [],
}: SearchStructuresProps) => {
  const { t } = useTranslation();
  const [needle, setNeedle] = useState<string>("");

  const onChangeNeedle: ChangeEventHandler<HTMLInputElement> = useCallback(
    (data) => {
      setNeedle(data.currentTarget.value);
      onChange(null);
    },
    [onChange, setNeedle],
  );

  const filteredStructures = useMemo(() => {
    if (!needle || needle.length === 0) return [];

    const escapedValue = removeAccents(escapeRegexCharacters((needle || "").trim()));
    if (escapedValue === "") return [];

    const regex = new RegExp(".*?" + escapedValue + ".*", "i");
    return structures.filter(
      (structure) => regex.test(structure.acronyme || "") || regex.test(removeAccents(structure.nom)),
    );
  }, [needle, structures]);

  return (
    <Row>
      <input
        placeholder={t("Rechercher une structure ...", "Rechercher une structure...")}
        className="form-control"
        type="text"
        onChange={onChangeNeedle}
        defaultValue=""
      />
      {filteredStructures.length > 0 ? (
        <div className={styles.search_structures + " search-bar isArray"}>
          {filteredStructures.map((structure) => (
            <SearchStructureResult
              key={structure._id.toString()}
              onClick={onChange}
              query={needle}
              selected={selectedStructure?._id === structure._id}
              structure={structure}
            />
          ))}
        </div>
      ) : (
        <NoResultContainer>
          <Image src={NoResultImage} width={127} height={90} alt="no results" />
          <div>
            <NoResultTextContainer>Aucune structure trouvée ...</NoResultTextContainer>
            <FButton type="white" name="folder-add-outline" onClick={onClickCreateStructure}>
              Créer une nouvelle structure
            </FButton>
          </div>
        </NoResultContainer>
      )}
    </Row>
  );
};

export default SearchStructures;
