import get from "lodash/get";
import { searchFrench, FrenchLevelFilter, AgeFilter, searchAge } from "data/searchFilters";
import { SearchQuery } from "pages/recherche";
import { IDispositif, Theme } from "types/interface";

const filterContentsByTheme = (contents: IDispositif[], themeFilter: string[] | undefined) => {
  if (!themeFilter) return contents;

  return contents.filter((content) => {
    if (content.theme && themeFilter.includes(content.theme.name.fr)) return true;
    if (content.secondaryThemes && content.secondaryThemes.length > 0) {
      const hasContentTheme = content.secondaryThemes.filter(
        (theme) => theme && themeFilter.includes(theme.name.fr)
      ).length > 0;
      return hasContentTheme;
    }
    return false;
  });
};

const filterContentsByAge = (
  contents: IDispositif[],
  age: string | undefined,
) => {
  if (!age || !searchAge.children) return contents;

  const currentAgeFilter = (searchAge.children as AgeFilter[]).find(
    (filter: AgeFilter) => filter.name === age
  );
  if (!currentAgeFilter || !currentAgeFilter.bottomValue || !currentAgeFilter.topValue) {
    return contents;
  }

  return contents.filter((content) => {
    if (content.audienceAge && content.audienceAge.length > 0) {
      const ageFilter = content.audienceAge[0];

      if (!ageFilter.bottomValue || !ageFilter.topValue) return true;
      if (
        ageFilter.bottomValue <= currentAgeFilter.bottomValue &&
        ageFilter.topValue >= currentAgeFilter.topValue
      ) {
        return true;
      }
      return false;
    }
    return true;
  });
};

const filterContentsByFrenchLevel = (contents: IDispositif[], frenchLevelFilter: string | undefined) => {
  if (!frenchLevelFilter || frenchLevelFilter === "bien" || !searchFrench.children) return contents;

  const levelsNotAccepted = (searchFrench.children as FrenchLevelFilter[]).find(
    (filter: FrenchLevelFilter) => filter.name === frenchLevelFilter
  )?.query || [];

  return contents.filter((content) => {
    if (
      content.niveauFrancais &&
      levelsNotAccepted.includes(content.niveauFrancais[0])
    ) {
      return false;
    }
    return true;
  });
};

const filterContentsByType = (contents: IDispositif[], typeContenuFilter: "dispositifs" | "demarches" | undefined) => {
  if (!typeContenuFilter) return contents;

  if (typeContenuFilter === "demarches") {
    return contents.filter((content) => content.typeContenu === "demarche");
  }

  if (typeContenuFilter === "dispositifs") {
    return contents.filter((content) => content.typeContenu === "dispositif");
  }

  return contents;
};

const filterContents = (contents: IDispositif[], query: SearchQuery) => {
  if (!query) return contents;
  const contentsFilteredByTheme = filterContentsByTheme(contents, query.theme);
  const contentsFilteredByAge = filterContentsByAge(
    contentsFilteredByTheme,
    query.age
  );
  const contentsFilteredByFrenchLevel = filterContentsByFrenchLevel(
    contentsFilteredByAge,
    query.frenchLevel
  );
  const contentsFilterByType = filterContentsByType(
    contentsFilteredByFrenchLevel,
    query.type
  );

  return contentsFilterByType;
};

const sortDispositifs = (dispositifs: IDispositif[], order: string) => {
  return dispositifs.sort((a, b) => {
    var aValue = 0;
    var bValue = 0;
    if (order === "created_at") {
      aValue = get(a, "publishedAt", get(a, "created_at"));
      bValue = get(b, "publishedAt", get(b, "created_at"));
    } else {
      aValue = get(a, order);
      bValue = get(b, order);
    }
    return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
  });
};


export interface DispositifsFilteredState {
  dispositifs: IDispositif[]
  countTotal: number
  countShow: number
  nonTranslated: IDispositif[]
  dispositifsFullFrance: IDispositif[]
  themesObject: {
    theme: Theme
    dispositifs: IDispositif[]
  }[]
  principalThemeList: IDispositif[]
  secondaryThemeList: IDispositif[]
  principalThemeListFullFrance: IDispositif[]
  secondaryThemeListFullFrance: IDispositif[]
  filterVille: string
}

export const queryDispositifs = (
  allDispositifs: IDispositif[],
  query: SearchQuery,
  ln: string,
  themes: Theme[]
) => {
  const filteredDispositifs = filterContents(
    allDispositifs,
    query
  );
  const sortedDispositifs = sortDispositifs(
    filteredDispositifs,
    query.order
  );

  let dispositifs = sortedDispositifs;
  const countTotal = dispositifs.length;

  if (query.theme) {
    //On réarrange les résultats pour avoir les dispositifs dont le theme est le principal en premier, sinon trié par date de création
    dispositifs = dispositifs.sort((a, b) =>
      query.theme?.includes(get(a, "theme.name.fr", {}))
        ? -1
        : query.theme?.includes(get(b, "theme.name.fr", {}))
        ? 1
        : 0
    );
  } else {
    //@ts-ignore
    dispositifs = dispositifs.sort((a, b) => a.created_at - b.created_at);
  }

  // TRANSLATION
  let nonTranslated: IDispositif[] = [];
  if (ln !== "fr" || query.langue) {
    nonTranslated = dispositifs.filter((dispo) => {
      const lnCode = ln !== "fr" ? ln : query.langue;
      if (!lnCode) return false
      if (dispo.avancement?.[lnCode]) return false;
      return true;
    });

    dispositifs = dispositifs.filter((dispo) => {
      const lnCode = ln !== "fr"
        ? ln : query.langue;
        if (!lnCode) return false
        if (dispo.avancement?.[lnCode]) return true;
        return false;
    });
  }

  // LOCATION
  let dispositifsFullFrance: IDispositif[] = [];
  let filterVille = "";
  if (query.loc?.dep) {
    var index;
    var i;
    var dispositifsFrance = [];
    var dispositifsVille = [];
    var dispositifsEmpty = [];
    filterVille = query.loc?.city || "";
    for (index = 0; index < dispositifs.length; index++) {
      if (dispositifs[index]?.contenu?.[1]?.children) {
        var geolocInfocard = (dispositifs[index].contenu[1].children || []).find(
          (infocard) => infocard.title === "Zone d'action"
        );
        if (geolocInfocard && geolocInfocard.departments) {
          for (i = 0; i < geolocInfocard.departments.length; i++) {
            if (
              geolocInfocard.departments[i] === "All" &&
              dispositifs[index].typeContenu === "dispositif"
            ) {
              dispositifsFrance.push(dispositifs[index]);
            } else if (
              geolocInfocard.departments[i].split(" - ")[1] ===
                query.loc?.dep ||
              geolocInfocard.departments[i].split(" - ")[1] ===
                query.loc?.city ||
              dispositifs[index].typeContenu === "demarche"
            ) {
              dispositifsVille.push(dispositifs[index]);
            }
          }
        } else if (dispositifs[index].typeContenu === "dispositif") {
          dispositifsEmpty.push(dispositifs[index]);
        } else if (dispositifs[index].typeContenu === "demarche") {
          dispositifsVille.push(dispositifs[index]);
        }
      } else if (dispositifs[index].typeContenu === "dispositif") {
        dispositifsEmpty.push(dispositifs[index]);
      } else if (dispositifs[index].typeContenu === "demarche") {
        dispositifsVille.push(dispositifs[index]);
      }
    }
    dispositifsFullFrance = dispositifsFrance.concat(dispositifsEmpty);

    dispositifs = dispositifsVille;
  }

  dispositifs = dispositifs.map((x) => ({
    ...x,
    nbVues: x.nbVues || 0,
  }));

  // ORDER BY THEME
  let themesObject: {
    theme: Theme;
    dispositifs: IDispositif[];
  }[] = [];
  if (query.order === "theme") {
    themesObject = themes.map((theme) => {
      return {
        theme: theme,
        dispositifs: dispositifs.filter((dispositif) => (
          dispositif.theme ? dispositif.theme._id === theme._id : null
        )),
      };
    }).filter(themeObject => themeObject.dispositifs.length > 0);
  }

  // THEME
  let principalThemeListSorted: IDispositif[] = [];
  let secondaryThemeListSorted: IDispositif[] = [];
  let principalThemeListFullFranceSorted: IDispositif[] = [];
  let secondaryThemeListFullFranceSorted: IDispositif[] = [];

  if (query.theme) {
    const principalThemeList = dispositifs.filter((elem) => (
      elem.theme ? query.theme?.includes(elem.theme.name.fr) : ""
    ));
    principalThemeListSorted = sortDispositifs(
      principalThemeList,
      query.order
    );

    const secondaryThemeList = dispositifs.filter((dispositif) => {
      if (dispositif.secondaryThemes && dispositif.secondaryThemes.length > 0) {
        for (const dispositifTheme of dispositif.secondaryThemes) {
          if (query.theme?.includes(dispositifTheme.name.fr)) return true;
        }
      }
      return false;
    });
    secondaryThemeListSorted = sortDispositifs(
      secondaryThemeList,
      query.order
    );

    // THEME + LOCATION
    if (query.loc?.city) {
      var principalThemeListFullFrance = dispositifsFullFrance.filter(
        (disp) => (disp?.theme ? query.theme?.includes(disp.theme.name.fr) : "")
      );
      principalThemeListFullFranceSorted = sortDispositifs(
        principalThemeListFullFrance,
        query.order
      );
      const secondaryThemeListFullFrance = dispositifsFullFrance.filter((dispositif) => {
        if (dispositif.secondaryThemes && dispositif.secondaryThemes.length > 0) {
          for (const dispositifTheme of dispositif.secondaryThemes) {
            if (query.theme?.includes(dispositifTheme.name.fr)) return true;
          }
        }
        return false;
      });
      secondaryThemeListFullFranceSorted = sortDispositifs(
        secondaryThemeListFullFrance,
        query.order
      );
    }
  }
  const newState: DispositifsFilteredState = {
    dispositifs,
    countTotal,
    countShow: dispositifs.length,
    nonTranslated,
    dispositifsFullFrance,
    themesObject,
    principalThemeList: principalThemeListSorted,
    secondaryThemeList: secondaryThemeListSorted,
    principalThemeListFullFrance: principalThemeListFullFranceSorted,
    secondaryThemeListFullFrance: secondaryThemeListFullFranceSorted,
    filterVille
  };

  return newState
};

interface QueryState {
  searchToggleVisible: boolean
  geoSearch: boolean
  query: SearchQuery
}
export const decodeQuery = (routerQuery: any): QueryState => {
  const {
    tag, dep, city, age, niveauFrancais, filter, langue, tri
  } = routerQuery;
  let searchToggleVisible = false;
  let geoSearch = false;
  let query: SearchQuery = { order: "" }

  if (filter || langue || tri) searchToggleVisible = true;

  // Reinject filters value in search
  if (tag || age || niveauFrancais || dep || city || filter || langue || tri) {
    if (tag) query.theme = decodeURIComponent(tag).split(",");
    if (age) query.age = decodeURIComponent(age);
    if (dep && city) {
      query.loc = {
        city: decodeURIComponent(city),
        dep: decodeURIComponent(dep)
      }
      geoSearch = true;
    }
    if (niveauFrancais) query.frenchLevel = decodeURIComponent(niveauFrancais);
    if (filter) query.type = decodeURIComponent(filter) as ("dispositifs" | "demarches" | undefined);
    if (langue) query.langue = langue
    if (tri) query.order = tri
  }

  return {
    searchToggleVisible,
    geoSearch,
    query,
  }
}
