/* eslint-disable no-console */
const { MongoClient, ObjectId } = require("mongodb");
const himalaya = require("himalaya");
const { v4: uuidv4 } = require("uuid");

const dbPath = "mongodb://127.0.0.1:27017/heroku_wbj38s57?serverSelectionTimeoutMS=60000";
const client = new MongoClient(dbPath);
const dbName = "heroku_wbj38s57";

const getLocalizedContent = (content, ln) => {
  if (ln === "fr") return content?.fr || content || "";
  return content?.[ln] || "";
};

const turnJSONtoHTML = (content) => {
  if (typeof content === Object || typeof content === "object") {
    return himalaya.stringify(content);
  }
  return content;
};

/* Remove corrupted dispositifs */
const removeDispositifs = async (dispositifsColl) => {
  await dispositifsColl.deleteMany({ status: { $exists: false } });
};

/* List all fields to remove from a dispositif */
const removeOldFields = async (dispositifsColl) => {
  await dispositifsColl.updateMany(
    { status: { $ne: "Supprimé" } },
    {
      $unset: {
        abstract: "",
        audience: "",
        audienceAge: "",
        autoSave: "",
        avancement: "",
        demarcheId: "",
        niveauFrancais: "",
        questions: "",
        responsable: "",
        tags: "",
        timeSpent: "",
        pasMerci: "",
        localisation: "",
        bravo: "",
        signalements: "",
        variantes: "",
        titreInformatif: "",
        titreMarque: "",
        internal_action: "",
        traductions: "",
        contenu: ""
      }
    }
  );
};

const formatMerci = (merci) => {
  return {
    createdAt: new Date(merci.createdAt),
    userId: new ObjectId(merci.userId) || null
  };
};

const getSuggestionSection = (key, type) => {
  switch (key) {
    case 0:
      return "what";
    case 1:
      return "metadatas";
    case 2:
      return type === "dispositif" ? "why" : "how";
    case 3:
      return type === "dispositif" ? "how" : "next";
    default:
      return "";
  }
};

const formatSuggestion = (suggestion, typeContenu) => {
  return {
    createdAt: new Date(suggestion.createdAt),
    userId: new ObjectId(suggestion.userId),
    read: suggestion.read === null ? true : suggestion.read,
    suggestion: suggestion.suggestion,
    suggestionId: suggestion.suggestionId,
    section: getSuggestionSection(suggestion.keyValue, typeContenu)
  };
};

const getInfoSections = (children, ln) => {
  const infosections = {};

  for (const section of children) {
    const uuid = uuidv4();
    infosections[uuid] = {
      title: getLocalizedContent(section.title, ln),
      content: turnJSONtoHTML(getLocalizedContent(section.content, ln))
    };
  }

  return infosections;
};

const getAgeType = (ageType) => {
  switch (ageType) {
    case "De ** à ** ans":
      return "between";
    case "Moins de ** ans":
      return "lessThan";
    default:
      return "moreThan";
  }
};

const getJustificatif = (justificatif) => {
  switch (justificatif) {
    case "Titre de séjour":
      return "titre sejour";
    case "Titre de sejour":
      return "titre sejour";
    case "Diplôme":
      return "diplome";
    case "Justificatif de domicile":
      return "domicile";
    default:
      return "";
  }
};

const getMarkers = (children) => {
  const markers = children.find((c) => c.type === "map")?.markers;

  return (markers || []).map((m) => {
    const marker = {
      title: m.nom,
      address: m.address,
      city: m.vicinity,
      lat: m.latitude,
      lng: m.longitude
    };

    if (m.description) marker.description = m.description;
    if (m.email) marker.email = m.email;
    if (m.telephone) marker.phone = m.telephone;

    return marker;
  });
};

const getMetadatas = (content) => {
  const metas = {};
  const translatedMetas = {};
  for (const metadata of content.children) {
    switch (metadata.title) {
      case "Zone d'action":
        metas.location = metadata.departments;
        break;
      case "Combien ça coûte ?":
        metas.price = {
          value: parseInt(metadata.price),
          details: metadata.price === 0 || !metadata.contentTitle ? null : metadata.contentTitle
        };
        break;
      case "Niveau de français":
        // TODO : est-ce qu'on garde les 2 types de niveaux ? Si oui -> adapter les types
        break;
      case "Âge requis":
        metas.age = {
          type: getAgeType(metadata.contentTitle?.fr || metadata.contentTitle),
          ages: [parseInt(metadata.bottomValue), parseInt(metadata.topValue)]
        };
        break;
      case "Public visé":
        metas.public = metadata.contentTitle === "Réfugié" ? "refugee" : "all";
        break;
      case "Acte de naissance OFPRA":
        metas.acteNaissanceRequired = true;
        break;
      case "Titre de séjour":
        metas.titreSejourRequired = true;
        break;
      case "Justificatif demandé":
        metas.justificatif = getJustificatif(metadata.contentTitle);
        break;
      case "Durée":
        translatedMetas.duration = metadata.contentTitle;
        break;
      case "Important !":
        translatedMetas.important = metadata.contentTitle;
        break;
      default:
        console.warn("meta non ajoutée", metadata.title);
    }
  }

  return { metas, translatedMetas };
};

const getSponsors = (dispositif) => {
  const sponsors = [];

  const secondarySponsors = dispositif.sponsors.filter((s) => {
    // sometimes, mainSponsor replicated in sponsors -> remove it
    const isMainSponsor =
      (dispositif.mainSponsor && s._id && s._id.toString() === dispositif.mainSponsor.toString()) || // in object
      (typeof s === "string" && dispositif.mainSponsor && s === dispositif.mainSponsor.toString()); // or in string
    return !isMainSponsor;
  });

  for (const sponsor of secondarySponsors) {
    if (sponsor._id) sponsors.push(new ObjectId(sponsor._id));
    else if (sponsor.nom || sponsor.alt || sponsor.picture) {
      sponsors.push({
        name: sponsor.nom || sponsor.alt || "",
        logo: sponsor.picture || null,
        link: sponsor.link || null
      });
    } else {
      console.warn("sponsor not added", sponsor);
    }
  }

  return sponsors;
};

const getMultilangContent = (dispositif, translatedMetas) => {
  const translations = {};

  for (const ln of ["fr", "en", "ps", "fa", "ti", "ru", "uk", "ar"]) {
    if (dispositif.avancement[ln] === 1 || (ln === "fr" && dispositif.avancement === 1)) {
      translations[ln] = {
        content: {
          titreInformatif: getLocalizedContent(dispositif.titreInformatif, ln),
          titreMarque: getLocalizedContent(dispositif.titreMarque, ln),
          abstract: getLocalizedContent(dispositif.abstract, ln),
          what: turnJSONtoHTML(getLocalizedContent(dispositif.contenu?.[0]?.content, [ln]))
        },
        metadatas: {}
      };

      if (dispositif.typeContenu === "dispositif") {
        translations[ln].content.why = getInfoSections(dispositif.contenu?.[2]?.children, ln);
        translations[ln].content.how = getInfoSections(dispositif.contenu?.[3]?.children, ln);
      } else if (dispositif.typeContenu === "demarche") {
        translations[ln].content.how = getInfoSections(dispositif.contenu?.[2]?.children, ln);
        translations[ln].content.next = getInfoSections(dispositif.contenu?.[3]?.children, ln);
      }

      if (translatedMetas.duration) {
        translations[ln].metadatas.duration = getLocalizedContent(translatedMetas.duration, ln);
      }
      if (translatedMetas.important) {
        translations[ln].metadatas.important = getLocalizedContent(translatedMetas.important, ln);
      }
    }
  }

  return translations;
};

/* Add new fields to dispositif */
const getNewDispositif = (dispositif) => {
  if (!dispositif.status) return null; // some dispositifs seems not complete and not displayed
  const metadatas = getMetadatas(dispositif.contenu?.[1]);
  const newDispositif = {
    translations: {
      ...getMultilangContent(dispositif, metadatas.translatedMetas)
    },
    map: getMarkers(dispositif.contenu?.[3].children),
    sponsors: getSponsors(dispositif),
    mainSponsor: dispositif.mainSponsor || null,
    needs: dispositif.needs || [],
    notificationsSent: dispositif.notificationsSent || {},
    participants: dispositif.participants || [],
    secondaryThemes: dispositif.secondaryThemes || [],
    themesSelectedByAuthor: dispositif.themesSelectedByAuthor || false,
    nbFavoritesMobile: dispositif.nbFavoritesMobile || 0,
    nbMots: dispositif.nbMots || 0,
    webOnly: dispositif.webOnly || false,
    merci: (dispositif.merci || []).map((d) => formatMerci(d)),
    suggestions: (dispositif.suggestions || []).map((s) => formatSuggestion(s, dispositif.typeContenu)),
    metadatas: metadatas.metas
  };

  return { ...dispositif, ...newDispositif };
};

/* Start script */
async function main() {
  await client.connect();
  console.log("Connected successfully to server");
  const db = client.db(dbName);

  const dispositifsColl = db.collection("dispositifs");
  const dispositifs = await dispositifsColl.find({ status: { $ne: "Supprimé" } }).toArray();

  // update dispositifs one by one
  for (const dispositif of dispositifs) {
    const newDispositif = getNewDispositif(dispositif);
    if (newDispositif) {
      await dispositifsColl.replaceOne({ _id: dispositif._id }, newDispositif);
    }
  }

  // and remove all unused fields
  await removeOldFields(dispositifsColl);

  // and remove all unused fields
  await removeDispositifs(dispositifsColl);
}

main()
  .catch(console.error)
  .finally(() => client.close());
