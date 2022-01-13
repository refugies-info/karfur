import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next';
import { ObjectId } from "mongodb";
import { fetchActiveStructuresActionCreator } from "services/ActiveStructures/activeStructures.actions";
import { useDispatch, useSelector } from "react-redux";
import { activeStructuresSelector } from "services/ActiveStructures/activeStructures.selector";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { setSelectedStructureActionCreator } from "services/SelectedStructure/selectedStructure.actions";
import Skeleton from "react-loading-skeleton";
import { Event, initGA } from "tracking/dispatch";
import { SimplifiedStructure } from "types/interface";
import { NoResult } from "components/Pages/annuaire/NoResult";
import { LetterSection } from "components/Pages/annuaire/LetterSection";
import { Header } from "components/Pages/annuaire/Header";
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
  margin-top: ${(props) =>
    props.stopScroll ? "140px" : -props.currentScroll + "px"};
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
  const [stopScroll, setStopScroll] = useState(false);
  const [currentScroll, setCurrentScroll] = useState(0);
  const [letterSelected, setLetterSelected] = useState("");
  const [filteredStructures, setFilteredStructures] = useState<SimplifiedStructure[]>([]);
  const [keyword, setKeyword] = useState("");
  const [typeSelected, setTypeSelected] = useState<string[]>([]);
  const [ville, setVille] = useState("");
  const [depName, setDepName] = useState("");
  const [depNumber, setDepNumber] = useState("");
  const [isCityFocus, setIsCityFocus] = useState(false);
  const [isCitySelected, setIsCitySelected] = useState(false);

  const structures = useSelector(activeStructuresSelector);
  const isLoading = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_STRUCTURES));

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

  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    setCurrentScroll(currentScrollPos);
    return setStopScroll(currentScrollPos >= 85);
  };

  const defineLettersClickable = (
    sortedStructureByAlpha: SimplifiedStructure[]
  ) => {
    let lettersClickable: string[] = [];
    sortedStructureByAlpha.forEach((structure) => {
      let letter = structure.nom.substr(0, 1);
      if (!lettersClickable.includes(letter.toLocaleUpperCase())) {
        lettersClickable.push(letter.toLocaleUpperCase());
      }
    });
    return lettersClickable;
  };

  useEffect(() => {
    const loadStructures = () => {
      dispatch(setSelectedStructureActionCreator(null));
      dispatch(fetchActiveStructuresActionCreator());
    };
    if (!structures.length) {
      loadStructures();
    }

    window.addEventListener("scroll", handleScroll);
    window.scrollTo(0, 0);

    initGA();
    Event("ANNUAIRE_VIEW", "VIEW", "label");
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [dispatch]);

  const resetSearch = () => {
    const filterStructures = structures
      ? structures.filter(
          (structure) => structure._id.toString() !== "5f69cb9c0aab6900460c0f3f"
        )
      : [];

    setFilteredStructures(filterStructures);
  };

  const computeTypeFromUrl = (search: any) => {
    let typeSelectedFromUrl: string[] = [];
    if (querySearch(search).isAssociation) {
      typeSelectedFromUrl.push("Association");
    }
    if (querySearch(search).isEntreprise) {
      typeSelectedFromUrl.push("Entreprise");
    }
    if (querySearch(search).isEcole) {
      typeSelectedFromUrl.push("École");
    }
    if (querySearch(search).isUni) {
      typeSelectedFromUrl.push("Université");
    }
    if (querySearch(search).isOpe) {
      typeSelectedFromUrl.push("Opérateur");
    }
    if (querySearch(search).isPublic) {
      typeSelectedFromUrl.push("Établissement publicateur");
    }
    if (querySearch(search).isReseau) {
      typeSelectedFromUrl.push("Réseau d'acteurs");
    }
    if (querySearch(search).isCenter) {
      typeSelectedFromUrl.push("Centre de formation");
    }

    return typeSelectedFromUrl;
  };

  const computeStateFromUrl = (search: any) => {
    let keywordFromUrl = querySearch(search).keyword;
    let typeSelectedFromUrl = computeTypeFromUrl(search);
    let villeFromUrl = querySearch(search).ville;
    let depNameFromUrl = querySearch(search).depName;
    let depNumberFromUrl = querySearch(search).depNumber;
    if (keywordFromUrl) {
      setKeyword(decodeURIComponent(keywordFromUrl));
    }
    if (typeSelectedFromUrl) {
      setTypeSelected(typeSelectedFromUrl);
    }
    if (depNameFromUrl) {
      setDepName(decodeURIComponent(depNameFromUrl));
      setVille(decodeURIComponent(villeFromUrl));
      setIsCitySelected(true);
    }
    if (depNumberFromUrl) {
      setDepNumber(decodeURIComponent(depNumberFromUrl));
      setVille(decodeURIComponent(villeFromUrl));
      setIsCitySelected(true);
    }
  };

  useEffect(() => {
    // computeStateFromUrl(history.location.search);
  }, []);

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

  const filterStructures = () => {
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
  };

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

  useEffect(() => {
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
  }, [typeSelected, depName, depNumber, keyword, isCitySelected]);

  useEffect(() => {
    resetSearch();
    filterStructures();
  }, [structures]);

  const letters = "abcdefghijklmnopqrstuvwxyz".split("");
  const onStructureCardClick = (id: ObjectId) =>
    props.history.push({
      pathname: `/annuaire/${id}`,
      state: "from_annuaire_lecture",
    });
  const lettersClickable = defineLettersClickable(filteredStructures);

  if (isLoading) {
    const emptyArray = new Array(7).fill("a");
    return (
      <MainContainer>
        <Header
          letters={letters}
          stopScroll={stopScroll}
          currentScroll={currentScroll}
          letterSelected={letterSelected}
          setLetterSelected={setLetterSelected}
          filteredStructures={filteredStructures}
          resetSearch={resetSearch}
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
          history={null}
          lettersClickable={lettersClickable}
        />
        <LoadingContainer>
          <div
            style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
          >
            {emptyArray.map((index) => (
              <LoadingCard key={index} />
            ))}
          </div>
        </LoadingContainer>
      </MainContainer>
    );
  }

  return (
    <MainContainer>
      <Header
        resetSearch={resetSearch}
        letters={letters}
        stopScroll={stopScroll}
        currentScroll={currentScroll}
        letterSelected={letterSelected}
        setLetterSelected={setLetterSelected}
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
        history={null}
        lettersClickable={lettersClickable}
      />
      <Content
        currentScroll={currentScroll}
        stopScroll={stopScroll}
        hasMarginBottom={true}
      >
        {filteredStructures.length > 0 ? (
          <LetterSection
            onStructureCardClick={onStructureCardClick}
            structures={filteredStructures}
            setLetterSelected={setLetterSelected}
          />
        ) : (
          <NoResult resetAllFilter={resetAllFilter} t={props.t} />
        )}
      </Content>
    </MainContainer>
  );
};

export default Annuaire;
