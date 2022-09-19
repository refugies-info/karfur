import get from "lodash/get";
import { searchFrench, FrenchLevelFilter, AgeFilter, searchAge } from "data/searchFilters";
import { IDispositif, Theme } from "types/interface";
import { SearchQuery } from "pages/recherche";

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

const filterContents = (contents: IDispositif[], query: any) => {
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


export interface SearchResult {
  dispositifs: IDispositif[]
  demarches: IDispositif[]
}

export const queryDispositifs = (
  query: SearchQuery,
  dispositifs: IDispositif[],
): SearchResult => {

  return {
    dispositifs: dispositifs.filter(d => d.typeContenu === "dispositif"),
    demarches: dispositifs.filter(d => d.typeContenu === "demarche")
  }
};

interface QueryState {
  searchToggleVisible: boolean
  geoSearch: boolean
  query: any
}
export const decodeQuery = (routerQuery: any): QueryState => {
  const {
    tag, dep, city, age, niveauFrancais, filter, langue, tri
  } = routerQuery;
  let searchToggleVisible = false;
  let geoSearch = false;
  let query: any = { order: "" }

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
