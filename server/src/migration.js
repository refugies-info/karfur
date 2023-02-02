/* eslint-disable no-console */
const { MongoClient, ObjectId } = require("mongodb");
const himalaya = require("himalaya");
const { v4: uuidv4 } = require("uuid");

const dbPath = "mongodb://127.0.0.1:27017/heroku_wbj38s57?serverSelectionTimeoutMS=60000";
const client = new MongoClient(dbPath);
const dbName = "heroku_wbj38s57";

const getLocalizedContent = (content, ln, root = false) => {
  if (root) return content || "";
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
  console.log("Suppression de dispositifs...");
  const count1 = await dispositifsColl.deleteMany({ status: "Supprimé" });
  const count2 = await dispositifsColl.deleteMany({ status: { $exists: false } });
  console.log("  Dispositifs supprimés :", count1.deletedCount + count2.deletedCount);
};

/* List all fields to remove from a dispositif */
const removeOldFields = async (dispositifsColl) => {
  console.log("Suppression des champs inutilisés...");
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

const getInfoSections = (children, ln, root) => {
  const infosections = {};

  if (children) {
    for (const section of children) {
      const uuid = uuidv4();
      infosections[uuid] = {
        title: getLocalizedContent(section.title, ln, root),
        content: turnJSONtoHTML(getLocalizedContent(section.content, ln, root))
      };
    }
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

const savedMetadatasIndex = {}; // save index of translated meta to find it in translations then

const getMetadatas = (content, id) => {
  const metas = {};
  const translatedMetas = {};

  const titles = (content?.children || []).map((c) => c.title);
  savedMetadatasIndex[id] = {};

  if (titles.indexOf("Durée") >= 0) savedMetadatasIndex[id].duration = titles.indexOf("Durée");
  if (titles.indexOf("Important !") >= 0) savedMetadatasIndex[id].important = titles.indexOf("Important !");

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
        console.warn("  Meta non ajoutée", metadata.title);
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
      console.warn("  Sponsor non ajouté", sponsor);
    }
  }

  return sponsors;
};

const getContent = (dispositif, ln, root) => {
  const contentLn = {
    content: {
      titreInformatif: getLocalizedContent(dispositif.titreInformatif, ln, root),
      titreMarque: getLocalizedContent(dispositif.titreMarque, ln, root),
      abstract: getLocalizedContent(dispositif.abstract, ln, root),
      what: turnJSONtoHTML(getLocalizedContent(dispositif.contenu?.[0]?.content, ln, root))
    },
    metadatas: {}
  };

  if (dispositif.typeContenu === "dispositif") {
    contentLn.content.why = getInfoSections(dispositif.contenu?.[2]?.children, ln, root);
    contentLn.content.how = getInfoSections(dispositif.contenu?.[3]?.children, ln, root);
  } else if (dispositif.typeContenu === "demarche") {
    contentLn.content.how = getInfoSections(dispositif.contenu?.[2]?.children, ln, root);
    contentLn.content.next = getInfoSections(dispositif.contenu?.[3]?.children, ln, root);
  }

  return contentLn;
};

const getMultilangContent = (dispositif, translatedMetas) => {
  const translations = {};

  for (const ln of ["fr", "en", "ps", "fa", "ti", "ru", "uk", "ar"]) {
    if (dispositif.avancement[ln] === 1 || (ln === "fr" && dispositif.avancement === 1)) {
      translations[ln] = getContent(dispositif, ln, false);

      if (translatedMetas.duration) {
        translations[ln].metadatas.duration = getLocalizedContent(translatedMetas.duration, ln, false);
      }
      if (translatedMetas.important) {
        translations[ln].metadatas.important = getLocalizedContent(translatedMetas.important, ln, false);
      }
    }
  }

  return translations;
};

/* Add new fields to dispositif */
const getNewDispositif = (dispositif) => {
  if (!dispositif.status) return null; // some dispositifs seems not complete and not displayed
  const metadatas = getMetadatas(dispositif.contenu?.[1], dispositif._id);
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

const deletedDispositifsRequest = [
  {
    $match: {
      type: "dispositif"
    }
  },
  {
    $lookup: {
      from: "dispositifs",
      localField: "articleId",
      foreignField: "_id",
      as: "dispositifs"
    }
  },
  { $project: { articleId: 1, dispositifs: 1 } },
  {
    $match: {
      "dispositifs.status": "Supprimé"
    }
  }
];

const removeCorruptedTrads = async (traductionsColl) => {
  console.log("Suppression de traductions ...");

  // langues not supported
  const languageNotSupported = await traductionsColl.deleteMany({
    type: "dispositif",
    langueCible: { $nin: ["en", "ps", "fa", "ti", "ru", "uk", "ar"] }
  });
  console.log("  Trads avec langues non supportées :", languageNotSupported.deletedCount);

  // type == string
  const typeString = await traductionsColl.deleteMany({ type: { $ne: "dispositif" } });
  console.log("  Trads avec type string :", typeString.deletedCount);

  // deleted dispositifs
  const deletedDispositifs = await traductionsColl.aggregate(deletedDispositifsRequest).toArray();
  const deleted0 = await traductionsColl.deleteMany({ articleId: { $in: deletedDispositifs.map((d) => d.articleId) } });
  console.log("  Trads liées à des dispositifs supprimées :", deleted0.deletedCount);

  // "a traduire" && isExpert
  const aTraduireExpert = await traductionsColl.deleteMany({
    type: "dispositif",
    status: "À traduire",
    isExpert: true
  });
  console.log("  Trads 'À traduire' et isExpert :", aTraduireExpert.deletedCount);

  // "a revoir" && !isExpert
  const aRevoirNotExpert = await traductionsColl.deleteMany({
    type: "dispositif",
    status: "À revoir",
    isExpert: { $exists: false }
  });
  console.log("  Trads 'À revoir' et !isExpert :", aRevoirNotExpert.deletedCount);

  // "Validée" && !isExpert
  const valideNotExpert = await traductionsColl
    .find(
      {
        type: "dispositif",
        status: "Validée",
        isExpert: { $exists: false }
      },
      { articleId: 1, langueCible: 1, validatorId: 1 }
    )
    .toArray();
  let i = 0;
  for (const trad of valideNotExpert) {
    const count = await traductionsColl.count({
      articleId: trad.articleId,
      langueCible: trad.langueCible,
      isExpert: true
    });
    if (count > 0) {
      const deleted = await traductionsColl.deleteOne({ _id: trad._id });
      i = i + deleted.deletedCount;
    }
  }
  console.log("  Trads 'Validée', !isExpert et la trad existe en isExpert ", i);

  // "Validée" && isExpert && avancement < 1
  const valideNotCompleteExpert = await traductionsColl.deleteMany({
    type: "dispositif",
    status: "Validée",
    isExpert: true,
    avancement: { $lt: 1 }
  });
  console.log("  Trad 'Validée', isExpert mais incomplète", valideNotCompleteExpert.deletedCount);
};

let contentValidatedAndNotCopied = 0;
const getTranslatedText = (trad) => {
  if (trad.status === "Validée") {
    const translated = trad.dispositifs?.[0]?.translations[trad.langueCible];
    if (!translated) {
      // TODO: getContent and copy in dispositif
      // console.warn("translation not available", trad._id, trad.articleId);
      contentValidatedAndNotCopied++;
    } else {
      return translated;
    }
  }
  if (!trad.dispositifs?.[0]) {
    // should not happen
    console.warn("  Dispositif supprimé ?", trad.articleId);
    return {};
  }
  const content = getContent(
    { ...trad.translatedText, typeContenu: trad.dispositifs?.[0].typeContenu },
    trad.langueCible,
    true
  );

  // get metadatas from index
  if (savedMetadatasIndex[trad.articleId]?.duration !== undefined) {
    const value =
      trad.translatedText.contenu[1]?.children?.[savedMetadatasIndex[trad.articleId].duration]?.contentTitle;
    if (value) content.metadatas.duration = value;
  }
  if (savedMetadatasIndex[trad.articleId]?.important !== undefined) {
    const value =
      trad.translatedText.contenu[1]?.children?.[savedMetadatasIndex[trad.articleId].important]?.contentTitle;
    if (value) content.metadatas.important = value;
  }

  return content;
};

const migrateTrads = async (traductionsColl) => {
  console.log("Migration des traductions...");
  const allTrads = await traductionsColl
    .aggregate([
      {
        $lookup: {
          from: "dispositifs",
          localField: "articleId",
          foreignField: "_id",
          as: "dispositifs"
        }
      }
    ])
    .toArray();

  let toReviewGenerated = 0;
  let bugExpert = 0;
  for (const trad of allTrads) {
    const bugValideeIsExpert = trad.status === "Validée" && !trad.isExpert;
    if (bugValideeIsExpert) bugExpert++;

    const newTrad = {
      dispositifId: trad.articleId,
      userId: trad.userId,
      language: trad.langueCible,
      translated: getTranslatedText(trad),
      timeSpent: trad.timeSpent,
      type: trad.isExpert || bugValideeIsExpert ? "validation" : "suggestion",
      avancement: trad.avancement,
      created_at: trad.created_at,
      updatedAt: trad.updatedAt
    };

    if (bugValideeIsExpert) newTrad.userId = trad.validatorId;
    if (trad.status === "À revoir") {
      newTrad.toReview = [];
      toReviewGenerated++;
    }
    // TODO: toReview

    await traductionsColl.replaceOne({ _id: trad._id }, newTrad);
  }

  console.log(
    "  ",
    contentValidatedAndNotCopied,
    " contenus validés mais pas dans le dispositifs. Ils ont été copiés."
  );
  console.log("  ", toReviewGenerated, " toReview générés");
  console.log("  ", bugExpert, " validée mais pas isExpert. On les passe en isExpert et on garde le validatorId.");
};

const checkDispositifsWithoutTrads = async (dispositifsColl) => {
  const withoutTrads = await dispositifsColl
    .aggregate([
      {
        $match: {
          status: {
            $ne: "Supprimé"
          }
        }
      },
      {
        $lookup: {
          from: "traductions",
          localField: "_id",
          foreignField: "dispositifId",
          as: "traductions"
        }
      },
      {
        $match: {
          "traductions.0": {
            $exists: false
          },
          "translations.1": {
            $exists: true
          }
        }
      }
    ])
    .toArray();

  if (withoutTrads.length > 0) {
    console.error("  À CHECKER ! ", withoutTrads.length, "dispositifs sans traduction validée.");
  }
};

const checkSuggestionsAlreadyValidated = async (traductionsColl) => {
  const suggestions = await traductionsColl
    .aggregate([
      {
        $match: {
          type: "suggestion"
        }
      },
      {
        $lookup: {
          from: "dispositifs",
          localField: "dispositifId",
          foreignField: "_id",
          as: "dispositifs"
        }
      },
      {
        $project: {
          "language": 1,
          "dispositifId": 1,
          "dispositifs.translations": 1
        }
      },
      {
        $match: {
          "dispositifs.status": {
            $ne: "Supprimé"
          }
        }
      }
    ])
    .toArray();

  for (const trad of suggestions) {
    if (trad.dispositifs?.[0].translations[trad.language]) {
      console.error(
        "  À CHECKER ! Suggestion avec une trad déjà validée existante. Dispositif:",
        trad.dispositifId,
        "en",
        trad.language
      );
    }
  }
};

/* Start script */
async function main() {
  await client.connect();
  console.log("Démarrage ...");
  const db = client.db(dbName);

  const dispositifsColl = db.collection("dispositifs");
  const dispositifs = await dispositifsColl.find({ status: { $ne: "Supprimé" } }).toArray();

  // update dispositifs one by one
  console.log("Mise à jour du schéma 'dispositifs' ...");
  for (const dispositif of dispositifs) {
    const newDispositif = getNewDispositif(dispositif);
    if (newDispositif) {
      await dispositifsColl.replaceOne({ _id: dispositif._id }, newDispositif);
    }
  }

  // remove all unused dispositifs fields
  await removeOldFields(dispositifsColl);

  const traductionsColl = db.collection("traductions");
  await removeCorruptedTrads(traductionsColl);
  await migrateTrads(traductionsColl);

  // remove all unused dispositifs
  await removeDispositifs(dispositifsColl);

  console.log("Dernières vérifications...");
  await checkDispositifsWithoutTrads(dispositifsColl);
  await checkSuggestionsAlreadyValidated(traductionsColl);
  console.log("Vérifications terminées");

  console.log("C'est tout bon !");
}

main()
  .catch(console.error)
  .finally(() => client.close());
