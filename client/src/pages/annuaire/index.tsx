import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import Skeleton from "react-loading-skeleton";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { ObjectId } from "mongodb";
import { fetchActiveStructuresActionCreator } from "services/ActiveStructures/activeStructures.actions";
import { activeStructuresSelector } from "services/ActiveStructures/activeStructures.selector";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { setSelectedStructureActionCreator } from "services/SelectedStructure/selectedStructure.actions";
import { Event, initGA } from "tracking/dispatch";
import { SimplifiedStructure } from "types/interface";
import { NoResult } from "components/Pages/annuaire/index/NoResult";
import { LetterSection } from "components/Pages/annuaire/index/LetterSection";
import { Header } from "components/Pages/annuaire/index/Header";
// import { history } from "services/configureStore";
import qs from "query-string";
// @ts-ignore
import querySearch from "stringquery";

declare const window: Window;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  background: #e5e5e5;
`;

const LoadingContainer = styled.div`
  margin-top: 24px;
  display: flex;
  flex-direction: row;
  margin-left: 72px;
`;
const Content = styled.div`
  display: flex;
  flex-direction: row;
  flew-wrap: wrap;
  margin-bottom: ${(props) => (props.hasMarginBottom ? "24px" : "0px")};
`;

const LoadingCardContainer = styled.div`
  background: #ffffff;
  border-radius: 12px;
  width: 198px;
  height: 271px;
  margin-right: 8px;
  margin-left: 8px;
  margin-bottom: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const GreyContainer = styled.div`
  border-radius: 12px;
  width: 100%;
  margin-bottom: 24px;
`;

const LoadingCard = () => (
  <LoadingCardContainer>
    <GreyContainer>
      <Skeleton height={100} />
    </GreyContainer>
    <GreyContainer>
      <Skeleton count={2} />
    </GreyContainer>
  </LoadingCardContainer>
);

const Annuaire = (props: any) => {
  const [filteredStructures, setFilteredStructures] = useState<
    SimplifiedStructure[]
  >([]);
  const [keyword, setKeyword] = useState("");
  const [typeSelected, setTypeSelected] = useState<string[]>([]);
  const [ville, setVille] = useState("");
  const [depName, setDepName] = useState("");
  const [depNumber, setDepNumber] = useState("");
  const [isCityFocus, setIsCityFocus] = useState(false);
  const [isCitySelected, setIsCitySelected] = useState(false);

  const structures = useSelector(activeStructuresSelector);
  const isLoading = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_STRUCTURES)
  );

  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation();

  const resetAllFilter = () => {
    setIsCitySelected(false);
    setIsCityFocus(false);
    setDepNumber("");
    setDepName("");
    setVille("");
    setTypeSelected([]);
    setKeyword("");
  };

  const defineLettersClickable = (
    sortedStructureByAlpha: SimplifiedStructure[]
  ) => {
    let lettersClickable: string[] = [];
    sortedStructureByAlpha.forEach((structure) => {
      let letter = structure.nom[0];
      if (!lettersClickable.includes(letter.toLocaleUpperCase())) {
        lettersClickable.push(letter.toLocaleUpperCase());
      }
    });
    return lettersClickable;
  };

  useEffect(() => {
    initGA();
    Event("ANNUAIRE_VIEW", "VIEW", "label");
  }, []);

  useEffect(() => {
    const loadStructures = () => {
      dispatch(setSelectedStructureActionCreator(null));
      dispatch(fetchActiveStructuresActionCreator());
    };
    if (!structures.length) loadStructures();
  }, [dispatch, structures.length]);

  const resetSearch = useCallback(() => {
    const filterStructures = structures
      ? structures.filter(
          (structure) => structure._id.toString() !== "5f69cb9c0aab6900460c0f3f"
        )
      : [];

    setFilteredStructures(filterStructures);
  }, [structures]);

  const computeTypeFromUrl = (query: any) => {
    let typeSelectedFromUrl: string[] = [];
    if (query.isAssociation) {
      typeSelectedFromUrl.push("Association");
    }
    if (query.isEntreprise) {
      typeSelectedFromUrl.push("Entreprise");
    }
    if (query.isEcole) {
      typeSelectedFromUrl.push("École");
    }
    if (query.isUni) {
      typeSelectedFromUrl.push("Université");
    }
    if (query.isOpe) {
      typeSelectedFromUrl.push("Opérateur");
    }
    if (query.isPublic) {
      typeSelectedFromUrl.push("Établissement publicateur");
    }
    if (query.isReseau) {
      typeSelectedFromUrl.push("Réseau d'acteurs");
    }
    if (query.isCenter) {
      typeSelectedFromUrl.push("Centre de formation");
    }

    return typeSelectedFromUrl;
  };

  useEffect(() => {
      let keywordFromUrl = router.query.keyword;
      let typeSelectedFromUrl = computeTypeFromUrl(router.query);
      let villeFromUrl = router.query.ville;
      let depNameFromUrl = router.query.depName;
      let depNumberFromUrl = router.query.depNumber;
      if (keywordFromUrl) {
        setKeyword(keywordFromUrl as string);
      }
      if (typeSelectedFromUrl) {
        setTypeSelected(typeSelectedFromUrl);
      }
      if (depNameFromUrl) {
        setDepName(depNameFromUrl as string);
        setVille(villeFromUrl as string);
        setIsCitySelected(true);
      }
      if (depNumberFromUrl) {
        setDepNumber(depNumberFromUrl as string);
        setVille(villeFromUrl as string);
        setIsCitySelected(true);
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filterStructures = useCallback(() => {
    const filterStructuresByType = (arrayTofilter: SimplifiedStructure[]) => {
      if (!typeSelected || typeSelected.length === 0) {
        return arrayTofilter;
      }
      return arrayTofilter.filter((structure) => {
        let hasType: boolean = false;

        typeSelected.forEach((type) => {
          if (
            structure.structureTypes &&
            structure.structureTypes.includes(type)
          ) {
            hasType = true;
          }
        });

        return hasType;
      });
    };

    const filterStructuresByKeword = (arrayTofilter: SimplifiedStructure[]) => {
      let newArrayKeyword: SimplifiedStructure[] = [];
      if (keyword.length > 0) {
        if (arrayTofilter) {
          arrayTofilter.forEach((structure) => {
            if (
              (structure.nom.toLowerCase().includes(keyword.toLowerCase()) ||
                (structure.acronyme &&
                  structure.acronyme
                    .toLowerCase()
                    .includes(keyword.toLowerCase()))) &&
              newArrayKeyword &&
              !newArrayKeyword.includes(structure)
            ) {
              newArrayKeyword.push(structure);
            }
          });
        }
      } else {
        newArrayKeyword = arrayTofilter;
      }
      return newArrayKeyword;
    };

    const filterStructuresByLoc = (arrayTofilter: SimplifiedStructure[]) => {
      let newArrayLoc: SimplifiedStructure[] = [];
      if (isCitySelected) {
        if (arrayTofilter) {
          arrayTofilter.forEach((structure) => {
            if (
              structure.disposAssociesLocalisation?.includes("All") ||
              (structure.departments?.includes("All") && newArrayLoc)
            ) {
              newArrayLoc.push(structure);
            } else {
              if (depNumber && structure.disposAssociesLocalisation) {
                structure.disposAssociesLocalisation.forEach((el) => {
                  if (
                    el.substr(0, 2) === depNumber &&
                    newArrayLoc &&
                    !newArrayLoc.includes(structure)
                  ) {
                    newArrayLoc.push(structure);
                  }
                });
                if (structure.departments) {
                  structure.departments.forEach((el) => {
                    if (
                      el.substr(0, 2) === depNumber &&
                      newArrayLoc &&
                      !newArrayLoc.includes(structure)
                    ) {
                      newArrayLoc.push(structure);
                    }
                  });
                }
              } else if (depName && structure.disposAssociesLocalisation) {
                structure.disposAssociesLocalisation.forEach((el) => {
                  if (
                    el.includes(depName) &&
                    newArrayLoc &&
                    !newArrayLoc.includes(structure)
                  ) {
                    newArrayLoc.push(structure);
                  }
                });
                if (structure.departments) {
                  structure.departments.forEach((el) => {
                    if (
                      el.includes(depName) &&
                      newArrayLoc &&
                      !newArrayLoc.includes(structure)
                    ) {
                      newArrayLoc.push(structure);
                    }
                  });
                }
              }
            }
          });
        }
      } else {
        newArrayLoc = arrayTofilter;
      }
      return newArrayLoc;
    };

    const filterByType = filterStructuresByType(structures);
    const filterByTypeAndLoc = filterStructuresByLoc(filterByType);
    const filterByTypeAndLocAndKeyword =
      filterStructuresByKeword(filterByTypeAndLoc);
    const sortedStructureByAlpha = filterByTypeAndLocAndKeyword
      ? filterByTypeAndLocAndKeyword.sort((a, b) =>
        a.nom[0].toLowerCase() < b.nom[0].toLowerCase()
          ? -1
          : a.nom[0].toLowerCase() > b.nom[0].toLowerCase()
            ? 1
            : 0
      )
      : [];

    setFilteredStructures(sortedStructureByAlpha);
  }, [depName, depNumber, isCitySelected, keyword, structures, typeSelected]);

  useEffect(() => {
    const computeUrlFromState = (query: {
      depName?: string | undefined;
      depNumber?: string | null;
      keyword?: string;
      ville?: string;
    }) => {
      router.push({
        search: qs.stringify(query),
      });
    };

    let query: {
      depName?: string | undefined;
      depNumber?: string;
      keyword?: string;
      type?: string[];
      ville?: string;
      isUni?: boolean;
      isEcole?: boolean;
      isEntreprise?: boolean;
      isAssociation?: boolean;
      isOpe?: boolean;
      isPublic?: boolean;
      isReseau?: boolean;
      isCenter?: boolean;
    } = {};

    if (depName !== "") {
      query.depName = depName;
    }
    if (ville !== "") {
      query.ville = ville;
    }
    if (depNumber) {
      query.depNumber = depNumber;
    }
    if (keyword !== "") {
      query.keyword = keyword;
    }
    if (typeSelected && typeSelected.length) {
      if (typeSelected.includes("Association")) {
        query.isAssociation = true;
      }
      if (typeSelected.includes("Entreprise")) {
        query.isEntreprise = true;
      }
      if (typeSelected.includes("École")) {
        query.isEcole = true;
      }
      if (typeSelected.includes("Université")) {
        query.isUni = true;
      }
      if (typeSelected.includes("Opérateur")) {
        query.isOpe = true;
      }
      if (typeSelected.includes("Établissement publicateur")) {
        query.isPublic = true;
      }
      if (typeSelected.includes("Réseau d'acteurs")) {
        query.isReseau = true;
      }
      if (typeSelected.includes("Centre de formation")) {
        query.isCenter = true;
      }
    }
    computeUrlFromState(query);
    filterStructures();

  // Bug router: https://github.com/vercel/next.js/issues/18127#issuecomment-950907739
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeSelected, depName, depNumber, keyword, isCitySelected, filterStructures, ville]);

  useEffect(() => {
    resetSearch();
    filterStructures();
  }, [structures, resetSearch, filterStructures]);

  const letters = "abcdefghijklmnopqrstuvwxyz".split("");
  const onStructureCardClick = (id: ObjectId) =>
    router.push({
      pathname: `/annuaire/${id}`,
      // state: "from_annuaire_lecture", // TODO : location.state
    });
  const lettersClickable = defineLettersClickable(filteredStructures);

  return (
    <MainContainer>
      <Header
        resetSearch={resetSearch}
        letters={letters}
        filteredStructures={filteredStructures}
        keyword={keyword}
        setKeyword={setKeyword}
        typeSelected={typeSelected}
        setTypeSelected={setTypeSelected}
        ville={ville}
        setVille={setVille}
        depName={depName}
        setDepName={setDepName}
        depNumber={depNumber}
        setDepNumber={setDepNumber}
        isCityFocus={isCityFocus}
        setIsCityFocus={setIsCityFocus}
        isCitySelected={isCitySelected}
        setIsCitySelected={setIsCitySelected}
        lettersClickable={lettersClickable}
      />

      {isLoading ? (
        <LoadingContainer>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            {new Array(7).fill("a").map((_, index) => (
              <LoadingCard key={index} />
            ))}
          </div>
        </LoadingContainer>
      ) : (
        <Content
          hasMarginBottom={true}
        >
          {filteredStructures.length > 0 ? (
            <LetterSection
              onStructureCardClick={onStructureCardClick}
              structures={filteredStructures}
            />
          ) : (
            <NoResult resetAllFilter={resetAllFilter} t={props.t} />
          )}
        </Content>
      )}
    </MainContainer>
  );
};

export default Annuaire;
