import get from "lodash/get";
import { searchFrench, FrenchLevelFilter, AgeFilter, searchAge } from "data/searchFilters";
import { SearchQuery } from "pages/recherche";
import { IDispositif, Tag } from "types/interface";
import { tags } from "data/tags";

const filterContentsByTheme = (contents: IDispositif[], tagFilter: string | undefined) => {
  if (!tagFilter) return contents;

  return contents.filter((content) => {
    if (content.tags && content.tags.length > 0) {
      const hasContentTheme = content.tags.filter((tag) => tag && tag.name === tagFilter).length > 0;
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


interface DispositifsFilteredState {
  dispositifs: IDispositif[]
  countTotal: number
  countShow: number
  nonTranslated: IDispositif[]
  dispositifsFullFrance: IDispositif[]
  themesObject: {
    tag: Tag
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
  ln: string
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
    //On réarrange les résultats pour avoir les dispositifs dont le tag est le principal en premier, sinon trié par date de création
    dispositifs = dispositifs.sort((a, b) =>
      get(a, "tags.0.name", {}) === query.theme
        ? -1
        : get(b, "tags.0.name", {}) === query.theme
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
    tag: Tag;
    dispositifs: IDispositif[];
  }[] = [];
  if (query.order === "theme") {
    themesObject = tags.map((tag) => {
      return {
        tag: tag,
        dispositifs: dispositifs.filter((elem) => (
          elem.tags[0] ? elem.tags[0].short === tag.short : ""
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
      elem?.tags[0] ? elem.tags[0].name === query.theme : ""
    ));
    principalThemeListSorted = sortDispositifs(
      principalThemeList,
      query.order
    );

    const secondaryThemeList = dispositifs.filter((element) => {
      if (element.tags && element.tags.length > 0) {
        for (var index = 1; index < element.tags.length; index++) {
          if (
            index !== 0 &&
            element.tags[index] &&
            element.tags[index].name === query.theme
          )
          return true;
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
        (elem) => (elem?.tags[0] ? elem.tags[0].name === query.theme : "")
      );
      principalThemeListFullFranceSorted = sortDispositifs(
        principalThemeListFullFrance,
        query.order
      );
      var secondaryThemeListFullFrance = dispositifsFullFrance.filter(
        (element) => {
          if (element.tags && element.tags.length > 0) {
            for (var index = 1; index < element.tags.length; index++) {
              if (
                index !== 0 &&
                element.tags[index] &&
                element.tags[index].name === query.theme
              )
                return true;
            }
          }
          return false;
        }
      );
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
    if (tag) query.theme = decodeURIComponent(tag);
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
