import { DispositifContent } from "../types/interface"

const sectionsDispositif = [
  { title: "where", filters: ["Zone d'action"] },
  { title: "who", filters: ["Âge requis", "Niveau de français"] },
  { title: "how_it_works", filters: ["Combien ça coûte ?", "Durée"] },
  { title: "important", filters: ["Important !"] },
];

const sectionsDemarche = [
  { title: "who", filters: ["Âge requis"] },

  {
    title: "must_have",
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
      return t("content_screen.whole_country", "Toute la France");
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
        t("content_screen.more_than", "Plus de") +
        " " +
        infocard.bottomValue +
        " " +
        t("content_screen.years", "ans");

      return result;
    }

    if (infocard.contentTitle === "Moins de ** ans") {
      const result =
        t("content_screen.less_than", "Moins de") +
        " " +
        infocard.topValue +
        " " +
        t("content_screen.years", "ans");

      return result;
    }

    if (infocard.contentTitle === "De ** à ** ans") {
      const result =
        t("content_screen.from", "De") +
        " " +
        infocard.bottomValue +
        " " +
        t("content_screen.to", "à") +
        " " +
        infocard.topValue +
        " " +
        t("content_screen.years", "ans");

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
        t("content_screen." + infocard.contentTitle, infocard.contentTitle) +
        " : " +
        levels
      );
    }

    return t("content_screen." + infocard.contentTitle, infocard.contentTitle);
  }

  if (infocard.title === "Combien ça coûte ?") {
    if (infocard.free) {
      return t("content_screen.free", "Gratuit");
    }
    return infocard.price + "€ " + infocard.contentTitle;
  }

  if (infocard.title === "Durée") {
    return null;
  }

  if (infocard.title === "Acte de naissance OFPRA") {
    return t("content_screen.ofpra_birth_act", "L'acte de naissance OFPRA");
  }

  if (infocard.title === "Titre de séjour")
    return t("content_screen.residence_permit", "Le titre de séjour");
  return null;
};
