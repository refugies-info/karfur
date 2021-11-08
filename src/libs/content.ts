import { DispositifContent, SimplifiedContent } from "../types/interface";
import { tags } from "../data/tagData";
import { theme } from "../theme";

const sectionsDispositif = [
  { title: "C'est où ?", filters: ["Zone d'action"] },
  { title: "C'est pour qui ?", filters: ["Âge requis", "Niveau de français"] },
  { title: "Comment ça marche ?", filters: ["Combien ça coûte ?", "Durée"] },
  { title: "Important", filters: ["Important !"] },
];

const sectionsDemarche = [
  { title: "C'est pour qui ?", filters: ["Âge requis"] },

  {
    title: "Impossible sans",
    filters: ["Titre de séjour", "Acte de naissance OFPRA"],
  },
];

export const formatInfocards = (
  data: DispositifContent[],
  typeContenu: "dispositif" | "demarche"
) => {
  let result: { title: string; filteredData: DispositifContent[] }[] = [];

  let sections =
    typeContenu === "dispositif" ? sectionsDispositif : sectionsDemarche;

  sections.forEach((section) => {
    const filteredData = data.filter((el) =>
      section.filters.includes(el.title)
    );

    if (filteredData.length > 0) {
      result.push({ title: section.title, filteredData });
    }
  });
  return result;
};

export const getDescription = (infocard: DispositifContent, t: any) => {
  if (infocard.title === "Zone d'action") {
    if (!infocard.departments) return "";
    if (infocard.departments.includes("All")) {
      return t("Content.Toute la France", "Toute la France");
    }
    let result = "";
    infocard.departments.forEach((dep) => {
      const nbDep = dep.split(" -")[0];
      result = result === "" ? nbDep : result + ", " + nbDep;
    });
    return result;
  }

  if (infocard.title === "Âge requis") {
    if (infocard.contentTitle === "Plus de ** ans") {
      const result =
        t("Content.Plus de", "Plus de") +
        " " +
        infocard.bottomValue +
        " " +
        t("Content.ans", "ans");

      return result;
    }

    if (infocard.contentTitle === "Moins de ** ans") {
      const result =
        t("Content.Moins de", "Moins de") +
        " " +
        infocard.topValue +
        " " +
        t("Content.ans", "ans");

      return result;
    }

    if (infocard.contentTitle === "De ** à ** ans") {
      const result =
        t("Content.De", "De") +
        " " +
        infocard.bottomValue +
        " " +
        t("Content.à", "à") +
        " " +
        infocard.topValue +
        " " +
        t("Content.ans", "ans");

      return result;
    }
  }

  if (infocard.title === "Niveau de français") {
    if (infocard.niveaux && infocard.niveaux.length > 0) {
      let levels = "";
      infocard.niveaux.forEach((niveau) => {
        levels = levels === "" ? niveau : levels + "/" + niveau;
      });

      return (
        t("Content." + infocard.contentTitle, infocard.contentTitle) +
        " : " +
        levels
      );
    }

    return t("Content." + infocard.contentTitle, infocard.contentTitle);
  }

  if (infocard.title === "Combien ça coûte ?") {
    if (infocard.free) {
      return t("Content.Gratuit", "Gratuit");
    }
    return infocard.price + "€ " + infocard.contentTitle;
  }

  if (infocard.title === "Durée") {
    return null;
  }

  if (infocard.title === "Acte de naissance OFPRA") {
    return t("Content.L'acte de naissance OFPRA", "L'acte de naissance OFPRA");
  }

  if (infocard.title === "Titre de séjour")
    return t("Content.Titre de séjour", "Le titre de séjour");
  return null;
};

/**
 * Return colors of the ContentSummary card
 * @param content
 */
export const getCardColors = (content: SimplifiedContent) => {
  const defaultColors = {
    tagDarkColor: theme.colors.black,
    tagVeryLightColor: theme.colors.white,
    tagName: "",
    tagLightColor: theme.colors.white,
    iconName: ""
  };

  const primaryTagName = content.tags.length > 0 ? content.tags[0] : null;
  if (!primaryTagName) return defaultColors;
  const currentTag = tags.find(t => primaryTagName.short === t.short);
  if (!currentTag) return defaultColors;

  return {
    tagDarkColor: currentTag.darkColor,
    tagVeryLightColor: currentTag.veryLightColor,
    tagName: currentTag.name,
    tagLightColor: currentTag.lightColor,
    iconName: currentTag.icon
  }
}