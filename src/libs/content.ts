import { ContentType, Metadatas } from "@refugies-info/api-types";

// const sectionsDispositif = [
//   { title: "where", filters: ["Zone d'action"] },
//   { title: "who", filters: ["Âge requis", "Niveau de français"] },
//   { title: "how", filters: ["Combien ça coûte ?", "Durée"] },
//   { title: "important", filters: ["Important !"] },
// ];
type MetadatasKeys = keyof Metadatas;
type Sections = { title: string; filters: MetadatasKeys[] }[];
const sectionsDispositif: Sections = [
  { title: "where", filters: ["location"] },
  {
    title: "who",
    filters: ["age", "frenchLevel", "public", "publicStatus"],
  },
  { title: "how", filters: ["price", "commitment", "frequency", "timeSlots"] },
  { title: "important", filters: ["conditions"] },
];

const sectionsDemarche: Sections = [
  { title: "who", filters: ["age", "frenchLevel", "public", "publicStatus"] },
  // {
  //   title: "must_have",
  //   filters: ["Titre de séjour", "Acte de naissance OFPRA"],
  // },
];

export const formatInfocards = (data: Metadatas, typeContenu: ContentType) => {
  // let result: { title: string; filteredData: any }[] = [];
  let result: any = {};

  let sections =
    typeContenu === ContentType.DISPOSITIF
      ? sectionsDispositif
      : sectionsDemarche;

  sections.forEach((section) => {
    section.filters.forEach((filter) => {
      if (data[filter]) {
        if (!result[section.title]) {
          result[section.title] = [];
        }
        result[section.title].push({
          title: filter,
          filteredData: data[filter],
        });
      }
    });
  });
  // console.log("result", result);

  return result;
};

export const getDescription = (
  infocard: { title: keyof Metadatas; filteredData: any },
  t: any
) => {
  if (infocard.title === "location") {
    const data: Metadatas["location"] = infocard.filteredData;
    if (!data) return "";
    if (data === "online") {
      return t("content_screen.online", "En ligne");
    }
    if (data === "france" || data.includes("All")) {
      return t("content_screen.whole_country", "Toute la France");
    }
    let result = "";
    data.forEach((dep: string) => {
      const nbDep = dep.split(" -")[0];
      result = result === "" ? nbDep : result + ", " + nbDep;
    });
    return result;
  }

  if (infocard.title === "age") {
    const data: Metadatas["age"] = infocard.filteredData;
    if (!data) return "";
    if (data.type === "moreThan") {
      const result =
        t("content_screen.more_than", "Plus de") +
        " " +
        data.ages[0] +
        " " +
        t("content_screen.years", "ans");

      return result;
    }

    if (data.type === "lessThan") {
      const result =
        t("content_screen.less_than", "Moins de") +
        " " +
        data.ages[0] +
        " " +
        t("content_screen.years", "ans");

      return result;
    }

    if (data.type === "between") {
      const result =
        t("content_screen.from", "De") +
        " " +
        data.ages[0] +
        " " +
        t("content_screen.to", "à") +
        " " +
        data.ages[1] +
        " " +
        t("content_screen.years", "ans");

      return result;
    }
  }

  if (infocard.title === "frenchLevel") {
    const data: Metadatas["frenchLevel"] = infocard.filteredData;
    if (data && data.length > 0) {
      let levels = "";
      data.forEach((niveau) => {
        levels = levels === "" ? niveau : levels + "/" + niveau;
      });

      return t("content_screen.french_level", infocard.title) + " : " + levels;
    }

    return t("content_screen." + infocard.title, infocard.title);
  }

  if (infocard.title === "price") {
    const data: Metadatas["price"] = infocard.filteredData;
    if (data?.values[0] === 0) {
      return t("content_screen.free", "Gratuit");
    }
    return data?.values[0] + "€ " + data?.details;
  }

  if (infocard.title === "duration") {
    return null;
  }

  // if (infocard.title === "Acte de naissance OFPRA") {
  //   return t("content_screen.ofpra_birth_act", "L'acte de naissance OFPRA");
  // }

  // if (infocard.title === "Titre de séjour")
  //   return t("content_screen.residence_permit", "Le titre de séjour");
  return null;
};
