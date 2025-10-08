import { useEffect, useState } from "react";
import { getDbDepartment } from "~/lib/departments";

interface Department {
  nom: string;
  code: string;
}

const useDepartmentAutocomplete = () => {
  const [search, setSearch] = useState("");
  const [hidePredictions, setHidePredictions] = useState(false);
  const [suggestions, setSuggestions] = useState<Department[]>([]);

  useEffect(() => {
    if (search.length > 2) {
      fetch(`https://geo.api.gouv.fr/departements?nom=${search}`)
        .then((response) => response.json())
        .then((data) => setSuggestions(data));
      if (hidePredictions) setHidePredictions(false);
    } else {
      setSuggestions([]);
    }
  }, [search, hidePredictions]);

  const getPlaceSelected = (depName: string): Promise<string | null> => {
    return Promise.resolve(getDbDepartment(depName));
  };

  const predictions = suggestions.map((dep) => ({
    id: dep.code,
    text: dep.nom,
  }));

  return { search, setSearch, hidePredictions, setHidePredictions, getPlaceSelected, predictions };
};

export default useDepartmentAutocomplete;
