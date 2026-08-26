import { useEffect, useState } from "react";

/**
 * Suit une media query CSS.
 *
 * A ne pas confondre avec `isMobile` de `useWindowSize`, qui compare la largeur
 * de la fenetre a la taille de police de la racine. Les deux divergent des que
 * l'utilisateur agrandit le texte : l'unite `em` d'une media query se mesure sur
 * la taille de police par defaut du navigateur, que l'agrandissement du texte ne
 * change pas, alors que la racine, elle, grandit. Quand un composant doit suivre
 * le meme point de rupture qu'une feuille de style (celle du DSFR par exemple),
 * c'est ce hook qu'il faut, pas `isMobile`.
 *
 * `defaultValue` est la valeur du premier rendu, cote serveur et avant montage.
 * La choisir egale au comportement d'origine evite un saut a l'hydratation.
 */
export const useMediaQuery = (query: string, defaultValue = false): boolean => {
  const [matches, setMatches] = useState(defaultValue);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);

    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);

  return matches;
};

export default useMediaQuery;
