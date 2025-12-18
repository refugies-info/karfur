import { useEffect, useMemo, useState } from "react";
import { getDbDepartment } from "~/lib/departments";
import { levenshteinDistance, normalizeString } from "~/lib/string";

interface Department {
  nom: string;
  code: string;
}

const useDepartmentAutocomplete = () => {
  const [search, setSearch] = useState("");
  const [hidePredictions, setHidePredictions] = useState(false);
  const [suggestions, setSuggestions] = useState<Department[]>([]);

  useEffect(() => {
    fetch("https://geo.api.gouv.fr/departements")
      .then((response) => response.json())
      .then((data) => setSuggestions(data));
  }, []);

  useEffect(() => {
    setHidePredictions(false);
  }, [search]);

  const getPlaceSelected = (depName: string): Promise<string | null> => {
    return Promise.resolve(getDbDepartment(depName));
  };

  const getFilteredDepartments = () => {
    if (!search) return [];
    if (search.length < 2) return [];

    const normalizedSearch = normalizeString(search);

    return suggestions
      .map((dep) => {
        const normalizedName = normalizeString(dep.nom);
        let score = 0;

        // Exact match (highest priority)
        if (normalizedName === normalizedSearch) score = 100;
        // Exact code match
        else if (dep.code === normalizedSearch) score = 100;
        // Starts with name
        else if (normalizedName.startsWith(normalizedSearch)) score = 80;
        // Starts with code
        else if (dep.code.startsWith(normalizedSearch)) score = 80;
        // Contains
        else if (normalizedName.includes(normalizedSearch)) score = 60;
        // Fuzzy match
        else {
          const distance = levenshteinDistance(normalizedName, normalizedSearch);
          if (distance <= 2 && normalizedSearch.length > 3) {
            score = 40 - distance;
          }
        }

        return { ...dep, score };
      })
      .filter((dep) => dep.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((dep) => ({
        id: dep.code,
        text: dep.nom,
      }));
  };

  const predictions = useMemo(() => getFilteredDepartments(), [search, suggestions]);

  return {
    search,
    setSearch,
    hidePredictions,
    setHidePredictions,
    getPlaceSelected,
    predictions,
  };
};

export default useDepartmentAutocomplete;
