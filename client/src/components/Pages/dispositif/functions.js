import _ from "lodash";
import { menu } from "data/dispositif";

const calculFiabilite = function (dispositif) {
  let score = 0;
  if (process.env.NODE_ENV !== "test") {
    if (dispositif.status === "Actif") {
      score = 1;
    }
    const nbMoisAvantMaJ =
      (new Date().getTime() - new Date(dispositif.updatedAt).getTime()) /
      (1000 * 3600 * 24 * 30);
    const nbMoisEntreCreationEtMaj =
      (new Date(dispositif.updatedAt).getTime() -
        new Date(dispositif.created_at).getTime()) /
      (1000 * 3600 * 24 * 30);
    const hasSponsor =
      dispositif.sponsors &&
      dispositif.sponsors.length > 0 &&
      dispositif.sponsors[0] &&
      dispositif.sponsors[0]._id
        ? true
        : false;
    const nbMots = dispositif.nbMots;
    const nbLangues = Object.keys(dispositif.avancement || {}).length || 1;
    const nbTags = (dispositif.tags || []).length;
    const tagAutreExist = (dispositif.tags || []).includes("Autre");
    const hasExternalLink = dispositif.externalLink ? true : false;
    // nbSections Seulement pour le calcul
    const nbSections =
      _.get(dispositif, "contenu", []).length +
      _.get(dispositif, "contenu", []).reduce(
        (acc, curr) =>
          (acc +=
            curr.children && curr.children.length > 1
              ? curr.children.length
              : 0),
        0
      );
    const nbSectionsSansContenu = (
      _.get(dispositif, "contenu", []).filter(
        (x) =>
          (!x.content || x.content === "" || x.content === "null") &&
          (!x.children ||
            x.children.some((y) => !y.title || (!y.content && !y.contentTitle)))
      ) || []
    ).length;
    const nbFakeContent =
      (_.get(dispositif, "contenu", []).filter((x) => x.isFakeContent) || [])
        .length +
      _.get(dispositif, "contenu", []).reduce(
        (acc, curr) =>
          (acc +=
            curr.children && curr.children.length > 1
              ? (curr.children.filter((x) => x.isFakeContent) || []).length
              : 0),
        0
      );
    const nbAddedChildren =
      nbSections -
      menu.length -
      menu.reduce(
        (acc, curr) =>
          (acc +=
            curr.children && curr.children.length > 1
              ? curr.children.length
              : 0),
        0
      );
    const hasMap = _.get(dispositif, "contenu", []).some(
      (x) =>
        x.children &&
        x.children.length > 0 &&
        x.children.some(
          (y) => y.type === "map" && y.markers && y.markers.length > 0
        )
    );

    score =
      score *
      (1 - Math.min(3, nbMoisAvantMaJ) / 3) * //Dernière mise à jour date de moins de 3 mois
      (Math.min(6, nbMoisEntreCreationEtMaj + 1) / 6) * //Doit avoir été créé au moins 6 mois depuis la dernière mise à jour
      (1 - 0.1 * !hasSponsor) * //10% de pénalité si pas de sponsor
      (Math.min(100, nbMots) / 100) * //Au moins 100 mots
      (Math.min(5, nbLangues) / 5) * // Doit être traduit en au moins 5 langues
      (Math.max(Math.min(nbTags, 2), 1) / 2) * // Doit avoir au moins 2 tags
      (1 - 0.1 * tagAutreExist) * // 10% de pénalité si le tag "Autres" est mis
      (1 + 0.1 * hasExternalLink) * // 10% de bonus si de lien externe
      (1 - nbSectionsSansContenu / menu.length) * // Grosse pénalité si une section n'a pas de contenu dessus
      (1 - nbFakeContent / (2 * nbSections)) * // Si un contenu est laissé sans modification, on sanctionne à 50%
      (1 + Math.min(nbAddedChildren, 30) / (2 * 30)) * // On rajoute un bonus jusqu'à 50% si du contenu original est créé
      (1 + 0.1 * hasMap); // 10% de bonus si une map est créée
    //   hasSponsor, nbMots, nbLangues, nbTags, tagAutreExist, hasExternalLink,
    //   nbSectionsSansContenu, nbFakeContent, nbAddedChildren, hasMap, nbSections)
  }
  return score;
  //Nouvelles idées: nombre de suggestions, merci etc
};

export { calculFiabilite };
