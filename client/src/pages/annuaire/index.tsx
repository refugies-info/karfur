import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import qs from "query-string";
import { END } from "redux-saga";

import { fetchActiveStructuresActionCreator } from "services/ActiveStructures/activeStructures.actions";
import { activeStructuresSelector } from "services/ActiveStructures/activeStructures.selector";
import { wrapper } from "services/configureStore";

import { SimplifiedStructure } from "types/interface";
import { getPath } from "routes";
import { Event } from "lib/tracking";
import { getLanguageFromLocale } from "lib/getLanguageFromLocale";
import { filterStructuresByType, filterStructuresByKeword, filterStructuresByLoc } from "lib/filterStructures";

import { NoResult } from "components/Pages/annuaire/index/NoResult";
import { LetterSection } from "components/Pages/annuaire/index/LetterSection";
import { Header } from "components/Pages/annuaire/index/Header";
import SEO from "components/Seo";

import styles from "scss/pages/annuaire.module.scss";
import isInBrowser from "lib/isInBrowser";

const computeTypeFromUrl = (query: NextParsedUrlQuery) => {
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

const Annuaire = () => {
  const router = useRouter();

  const [keyword, setKeyword] = useState((router.query.keyword as string) || "");
  const [typeSelected, setTypeSelected] = useState<string[]>(computeTypeFromUrl(router.query) || []);
  const [ville, setVille] = useState((router.query.ville as string) || "");
  const [depName, setDepName] = useState((router.query.depName as string) || "");
  const [depNumber, setDepNumber] = useState((router.query.depNumber as string) || "");
  const [isCityFocus, setIsCityFocus] = useState(false);
  const [isCitySelected, setIsCitySelected] = useState(!!router.query.depNumber || !!router.query.depName);

  const resetAllFilter = useCallback(() => {
    setIsCitySelected(false);
    setIsCityFocus(false);
    setDepNumber("");
    setDepName("");
    setVille("");
    setTypeSelected([]);
    setKeyword("");
  }, []);

  const defineLettersClickable = useCallback((sortedStructureByAlpha: SimplifiedStructure[]) => {
    let lettersClickable: string[] = [];
    sortedStructureByAlpha.forEach((structure) => {
      let letter = structure.nom[0];
      if (!lettersClickable.includes(letter.toLocaleUpperCase())) {
        lettersClickable.push(letter.toLocaleUpperCase());
      }
    });
    return lettersClickable;
  }, []);

  useEffect(() => {
    Event("ANNUAIRE_VIEW", "VIEW", "label");
  }, []);

  const structures = useSelector(activeStructuresSelector);

  const filteredStructures = useMemo(() => {
    const computeUrlFromState = (query: {
      depName?: string | undefined;
      depNumber?: string | null;
      keyword?: string;
      ville?: string;
    }) => {
      // SSR patch https://nextjs.org/docs/messages/no-router-instance
      if (isInBrowser())
        router.push(
          {
            pathname: getPath("/annuaire", router.locale),
            search: qs.stringify(query)
          },
          undefined,
          { shallow: true }
        );
    };

    // build url
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

    if (depName !== "") query.depName = depName;
    if (ville !== "") query.ville = ville;
    if (depNumber) query.depNumber = depNumber;
    if (keyword !== "") query.keyword = keyword;
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

    // filter structures
    const initialFilteredStructures = (structures || []).filter(
      (structure) => structure._id.toString() !== "5f69cb9c0aab6900460c0f3f"
    );
    const filterByType = filterStructuresByType(initialFilteredStructures, typeSelected);
    const filterByTypeAndLoc = filterStructuresByLoc(filterByType, isCitySelected, depNumber, depName);
    const filterByTypeAndLocAndKeyword = filterStructuresByKeword(filterByTypeAndLoc, keyword);
    const sortedStructureByAlpha = filterByTypeAndLocAndKeyword
      ? filterByTypeAndLocAndKeyword.sort((a, b) =>
          a.nom[0].toLowerCase() < b.nom[0].toLowerCase() ? -1 : a.nom[0].toLowerCase() > b.nom[0].toLowerCase() ? 1 : 0
        )
      : [];

    return sortedStructureByAlpha;

    // Bug router: https://github.com/vercel/next.js/issues/18127#issuecomment-950907739
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeSelected, depName, depNumber, keyword, isCitySelected, structures, ville, router.locale]);

  const letters = "abcdefghijklmnopqrstuvwxyz".split("");
  const lettersClickable = defineLettersClickable(filteredStructures);

  return (
    <div className={styles.container}>
      <SEO title="Annuaire" />
      <Header
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
      <div className={styles.content}>
        {filteredStructures.length > 0 ? (
          <LetterSection structures={filteredStructures} />
        ) : (
          <NoResult resetAllFilter={resetAllFilter} />
        )}
      </div>
    </div>
  );
};

export const getStaticProps = wrapper.getStaticProps((store) => async ({ locale }) => {
  store.dispatch(fetchActiveStructuresActionCreator());
  store.dispatch(END);
  await store.sagaTask?.toPromise();

  return {
    props: {
      ...(await serverSideTranslations(getLanguageFromLocale(locale), ["common"]))
    },
    revalidate: 30
  };
});

export default Annuaire;
