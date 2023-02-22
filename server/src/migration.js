/* eslint-disable no-console */
const { MongoClient, ObjectId } = require("mongodb");
const himalaya = require("himalaya");
const { v4: uuidv4 } = require("uuid");
const { Types } = require("mongoose");
const { Id } = require("./typegoose");

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
    try {
      return himalaya.stringify(content);
    } catch (error) {
      console.error(error);
      return content;
    }
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
        contenu: "",
        contact: "",
      },
    },
  );
};

const formatMerci = (merci) => {
  return {
    createdAt: new Date(merci.createdAt),
    userId: new ObjectId(merci.userId) || null,
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
    section: getSuggestionSection(suggestion.keyValue, typeContenu),
  };
};

const savedUuids = {};

const getInfoSections = (children, ln, root, id, type) => {
  const infosections = {};

  if (children) {
    for (const [i, section] of Object.entries(children)) {
      const uuid = savedUuids[id + type]?.[i] || uuidv4(); // use uuid if it exists in another language

      infosections[uuid] = {
        title: getLocalizedContent(section.title, ln, root),
        text: turnJSONtoHTML(getLocalizedContent(section.content, ln, root)),
      };
    }
  }

  if (!savedUuids[id + type]) {
    // save uuid if we set if for the 1rst time for this dispositif
    savedUuids[id + type] = Object.keys(infosections);
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
      lng: m.longitude,
    };

    if (m.description) marker.description = m.description;
    if (m.email) marker.email = m.email;
    if (m.telephone) marker.phone = m.telephone;

    return marker;
  });
};

const getFrenchLevel = (metadata) => {
  if (metadata.niveaux.length > 0) return metadata.niveaux;

  const value = metadata.contentTitle?.fr || metadata.contentTitle;
  switch (value) {
    case "Débutant":
      return ["A1", "A2"];
    case "Intermédiaire":
      return ["A1", "A2", "B1", "B2"];
    case "Avancé":
      return ["A1", "A2", "B1", "B2", "C1", "C2"];
    case "Tous les niveaux":
      return ["A1", "A2", "B1", "B2", "C1", "C2"];
    default:
      console.warn("  frenchLevel non ajouté. Valeur :", metadata.contentTitle);
      return "";
  }
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
    const title = metadata.title?.fr || metadata.title;
    switch (title) {
      case "Zone d'action":
        metas.location = metadata.departments;
        break;
      case "Combien ça coûte ?":
        metas.price = {
          value: parseInt(metadata.price),
          details: metadata.price === 0 || !metadata.contentTitle ? null : metadata.contentTitle,
        };
        break;
      case "Niveau de français":
        metas.frenchLevel = getFrenchLevel(metadata);
        break;
      case "Âge requis":
        metas.age = {
          type: getAgeType(metadata.contentTitle?.fr || metadata.contentTitle),
          ages: [parseInt(metadata.bottomValue), parseInt(metadata.topValue)],
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
        console.warn("  À CHECKER ! Meta non ajoutée", metadata.title, id);
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
        link: sponsor.link || null,
      });
    } else {
      console.warn("  À CHECKER ! Sponsor non ajouté", sponsor);
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
      what: turnJSONtoHTML(getLocalizedContent(dispositif.contenu?.[0]?.content, ln, root)),
    },
    metadatas: {},
  };

  if (dispositif.typeContenu === "dispositif") {
    contentLn.content.why = getInfoSections(dispositif.contenu?.[2]?.children, ln, root, dispositif._id, "why");
    contentLn.content.how = getInfoSections(dispositif.contenu?.[3]?.children, ln, root, dispositif._id, "how");
  } else if (dispositif.typeContenu === "demarche") {
    contentLn.content.how = getInfoSections(dispositif.contenu?.[2]?.children, ln, root, dispositif._id, "how");
    contentLn.content.next = getInfoSections(dispositif.contenu?.[3]?.children, ln, root, dispositif._id, "next");
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
      ...getMultilangContent(dispositif, metadatas.translatedMetas),
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
    metadatas: metadatas.metas,
  };

  return { ...dispositif, ...newDispositif };
};

const deletedDispositifsRequest = [
  {
    $match: {
      type: "dispositif",
    },
  },
  {
    $lookup: {
      from: "dispositifs",
      localField: "articleId",
      foreignField: "_id",
      as: "dispositifs",
    },
  },
  { $project: { articleId: 1, dispositifs: 1 } },
  {
    $match: {
      "dispositifs.status": "Supprimé",
    },
  },
];

const missingDispositifsRequest = [
  {
    $lookup: {
      from: "dispositifs",
      localField: "articleId",
      foreignField: "_id",
      as: "dispositifs",
    },
  },
  {
    $match: {
      "dispositifs.0": {
        $exists: false,
      },
    },
  },
];

const removeCorruptedTrads = async (traductionsColl) => {
  console.log("Suppression de traductions ...");

  //--- langues not supported
  const languageNotSupported = await traductionsColl.deleteMany({
    type: "dispositif",
    langueCible: { $nin: ["en", "ps", "fa", "ti", "ru", "uk", "ar"] },
  });
  console.log("  Trads avec langues non supportées :", languageNotSupported.deletedCount);

  //--- type == string
  const typeString = await traductionsColl.deleteMany({ type: { $ne: "dispositif" } });
  console.log("  Trads avec type string :", typeString.deletedCount);

  //--- deleted dispositifs
  const deletedDispositifs = await traductionsColl.aggregate(deletedDispositifsRequest).toArray();
  const deleted0 = await traductionsColl.deleteMany({ articleId: { $in: deletedDispositifs.map((d) => d.articleId) } });
  console.log("  Trads liées à des dispositifs supprimées :", deleted0.deletedCount);

  //--- missing dispositifs
  const missingDispositifs = await traductionsColl.aggregate(missingDispositifsRequest).toArray();
  const deleted1 = await traductionsColl.deleteMany({ _id: { $in: missingDispositifs.map((d) => d._id) } });
  console.log("  Trads liées à des dispositifs qui n'existent pas :", deleted1.deletedCount);

  //--- "a traduire" && isExpert
  const aTraduireExpert = await traductionsColl.deleteMany({
    type: "dispositif",
    status: "À traduire",
    isExpert: true,
  });
  /* à supprimer, il y en a peu, ce sont des erreurs */
  console.log("  Trads 'À traduire' et isExpert :", aTraduireExpert.deletedCount);

  //--- "a revoir" && !isExpert
  const aRevoirNotExpert = await traductionsColl.deleteMany({
    type: "dispositif",
    status: "À revoir",
    isExpert: { $exists: false },
  });
  /* rôle probablement changé sur les utilisateurs. Il y en a peu, à supprimer */
  console.log("  Trads 'À revoir' et !isExpert :", aRevoirNotExpert.deletedCount);

  //--- "Validée" && !isExpert
  const valideNotExpert = await traductionsColl
    .find(
      {
        type: "dispositif",
        status: "Validée",
        isExpert: { $exists: false },
      },
      { articleId: 1, langueCible: 1, validatorId: 1 },
    )
    .toArray();
  let i = 0;
  for (const trad of valideNotExpert) {
    const count = await traductionsColl.count({
      articleId: trad.articleId,
      langueCible: trad.langueCible,
      isExpert: true,
    });
    if (count > 0) {
      const deleted = await traductionsColl.deleteOne({ _id: trad._id });
      i = i + deleted.deletedCount;
    }
  }
  /* si la trad est aussi dispo en isExpert, on la supprime. Sinon, on la passe en isExpert au moment de la migration */
  console.log("  Trads 'Validée', !isExpert et la trad existe en isExpert ", i);

  //--- "Validée" && isExpert && avancement < 1
  const valideNotCompleteExpert = await traductionsColl.deleteMany({
    type: "dispositif",
    status: "Validée",
    isExpert: true,
    avancement: { $lt: 1 },
  });
  /* une autre trad isExpert complète existe. On supprime celle-ci */
  console.log("  Trad 'Validée', isExpert mais incomplète", valideNotCompleteExpert.deletedCount);
};

const getInfosectionReview = (trad, newContent, section, contenuKey) => {
  const res = [];
  let i = 0;
  if (!newContent.content[section]) return [];
  for (const key of Object.keys(newContent.content[section])) {
    if (trad.translatedText.contenu[contenuKey]?.children[i].titleModified) res.push(`${section}.${key}.title`);
    if (trad.translatedText.contenu[contenuKey]?.children[i].contentModified) res.push(`${section}.${key}.text`);
    i++;
  }

  return res;
};

const toReview = {};
const findToReview = (trad, newContent, typeContenu) => {
  const res = [];
  const translated = trad.translatedText;
  if (translated.titreInformatifModified) res.push("titreInformatif");
  if (translated.titreMarqueModified) res.push("titreMarque");
  if (translated.abstractModified) res.push("abstract");

  if (translated.contenu[0].contentModified) res.push("what");
  if (typeContenu === "dispositif") {
    res.push(...getInfosectionReview(trad, newContent, "why", 2), ...getInfosectionReview(trad, newContent, "how", 3));
  } else if (typeContenu === "demarche") {
    res.push(...getInfosectionReview(trad, newContent, "how", 2), ...getInfosectionReview(trad, newContent, "next", 3));
  }

  if (savedMetadatasIndex[trad.articleId]?.important) {
    if (translated.contenu[1]?.children?.[savedMetadatasIndex[trad.articleId]?.important]?.contentTitleModified)
      res.push("metadatas.important");
  }
  if (savedMetadatasIndex[trad.articleId]?.duration) {
    if (translated.contenu[1]?.children?.[savedMetadatasIndex[trad.articleId]?.duration]?.contentTitleModified)
      res.push("metadatas.duration");
  }

  return res;
};

const getContentFromTrad = (trad) => {
  const dispositifId = trad.articleId;
  const typeContenu = trad.dispositifs?.[0].typeContenu;
  const content = getContent(
    { ...trad.translatedText, typeContenu: typeContenu, _id: dispositifId },
    trad.langueCible,
    true,
  );

  // get metadatas from index
  if (savedMetadatasIndex[dispositifId]?.duration !== undefined) {
    const value = trad.translatedText.contenu[1]?.children?.[savedMetadatasIndex[dispositifId].duration]?.contentTitle;
    if (value) content.metadatas.duration = value;
  }
  if (savedMetadatasIndex[dispositifId]?.important !== undefined) {
    const value = trad.translatedText.contenu[1]?.children?.[savedMetadatasIndex[dispositifId].important]?.contentTitle;
    if (value) content.metadatas.important = value;
  }

  if (trad.status === "À revoir") {
    toReview[dispositifId] = findToReview(trad, content, typeContenu);
  }

  return content;
};

let contentValidatedAndNotCopied = 0;
const getTranslatedText = async (trad, dispositifsColl) => {
  // si la trad est validée
  if (trad.status === "Validée") {
    // on garde le contenu déjà copié dans le dispositif
    const translated = trad.dispositifs?.[0]?.translations[trad.langueCible];

    // si pas dispo -> bug
    if (trad.dispositifs?.[0] && !translated) {
      const content = getContentFromTrad(trad); // on génère le contenu de la trad
      const key = `translations.${trad.langueCible}`;
      await dispositifsColl.updateOne({ _id: trad.articleId }, { $set: { [key]: content } }); // et on le copie dans le dispositif
      contentValidatedAndNotCopied++;
      return content;
    }
    return translated;
  }
  if (!trad.dispositifs?.[0]) {
    // should not happen
    console.warn("  Dispositif supprimé ?", trad.articleId);
    return {};
  }

  // si trad non validée, on génère son contenu
  return getContentFromTrad(trad);
};

const migrateTrads = async (traductionsColl, dispositifsColl) => {
  console.log("Migration des traductions...");
  const allTrads = await traductionsColl
    .aggregate([
      {
        $lookup: {
          from: "dispositifs",
          localField: "articleId",
          foreignField: "_id",
          as: "dispositifs",
        },
      },
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
      translated: await getTranslatedText(trad, dispositifsColl),
      timeSpent: trad.timeSpent,
      type: trad.isExpert || bugValideeIsExpert ? "validation" : "suggestion",
      avancement: trad.avancement,
      created_at: trad.created_at,
      updatedAt: trad.updatedAt,
    };

    if (bugValideeIsExpert) newTrad.userId = trad.validatorId;
    if (trad.status === "À revoir") {
      if (toReview[trad.articleId]) {
        newTrad.toReview = toReview[trad.articleId];
        toReviewGenerated++;
      } else {
        console.warn("  À CHECKER ! Trad à revoir et toReview pas généré");
      }
    }

    await traductionsColl.replaceOne({ _id: trad._id }, newTrad);
  }

  console.log(
    "  ",
    contentValidatedAndNotCopied,
    " contenus validés mais pas dans le dispositifs. Ils ont été copiés.",
  );
  console.log("  ", toReviewGenerated, " toReview générés");
  console.log("  ", bugExpert, " validée mais pas isExpert. On les passe en isExpert et on garde le validatorId.");
};

/* Tous les dispositifs doivent avoir au moins 1 trad type validation */
const checkDispositifsWithoutTrads = async (dispositifsColl) => {
  const withoutTrads = await dispositifsColl
    .aggregate([
      {
        $match: {
          status: {
            $ne: "Supprimé",
          },
        },
      },
      {
        $lookup: {
          from: "traductions",
          localField: "_id",
          foreignField: "dispositifId",
          as: "traductions",
        },
      },
      {
        $match: {
          "traductions.0": {
            $exists: false,
          },
          "translations.1": {
            $exists: true,
          },
        },
      },
    ])
    .toArray();

  if (withoutTrads.length > 0) {
    console.error("  À CHECKER ! ", withoutTrads.length, "dispositifs sans traduction validée.");
  }
};

/* Il ne doit pas exister de suggestion dans une langue si la version validée existe */
const checkSuggestionsAlreadyValidated = async (traductionsColl) => {
  const suggestions = await traductionsColl
    .aggregate([
      {
        $match: {
          type: "suggestion",
        },
      },
      {
        $lookup: {
          from: "dispositifs",
          localField: "dispositifId",
          foreignField: "_id",
          as: "dispositifs",
        },
      },
      {
        $project: {
          "language": 1,
          "dispositifId": 1,
          "dispositifs.translations": 1,
        },
      },
      {
        $match: {
          "dispositifs.status": {
            $ne: "Supprimé",
          },
        },
      },
    ])
    .toArray();

  for (const trad of suggestions) {
    if (trad.dispositifs?.[0].translations[trad.language]) {
      console.error(
        "  À CHECKER ! Suggestion avec une trad déjà validée existante. Dispositif:",
        trad.dispositifId,
        "en",
        trad.language,
      );
    }
  }
};

const adaptUserSelectedLanguages = async (usersColl) => {
  const users = await usersColl.find({}).toArray();

  for (const user of users) {
    // console.log("Update user", user._id, {
    //   selectedLanguages: (user.selectedLanguages || []).map((language) => language._id || language)
    // });
    await usersColl.updateOne(
      { _id: user._id },
      { $set: { selectedLanguages: (user.selectedLanguages || []).map((language) => new Id(language._id)) } },
    );
  }
};

const adaptUserFavorites = async (usersColl) => {
  const users = await usersColl.find({}).toArray();

  for (const user of users) {
    await usersColl.updateOne(
      { _id: user._id },
      {
        $set: {
          favorites: (user.cookies?.dispositifsPinned || []).map((fav) => ({
            dispositifId: new ObjectId(fav._id),
            created_at: fav.datePin ? new Date(fav.datePin) : new Date(),
          })),
        },
        $unset: { cookies: "" },
      },
    );
  }
};

/* Start script */
async function main() {
  await client.connect();
  console.log("Démarrage ...");
  const db = client.db(dbName);

  // const dispositifsColl = db.collection("dispositifs");
  // const traductionsColl = db.collection("traductions");
  const usersColl = db.collection("users");

  // // update dispositifs one by one
  // console.log("Mise à jour du schéma 'dispositifs' ...");
  // const dispositifs = await dispositifsColl.find({ status: { $ne: "Supprimé" } }).toArray();
  // for (const dispositif of dispositifs) {
  //   const newDispositif = getNewDispositif(dispositif);
  //   if (newDispositif) {
  //     await dispositifsColl.replaceOne({ _id: dispositif._id }, newDispositif);
  //   }
  // }

  // // remove all unused dispositifs fields
  // await removeOldFields(dispositifsColl);

  // await removeCorruptedTrads(traductionsColl);
  // await migrateTrads(traductionsColl, dispositifsColl);

  // // remove all unused dispositifs
  // await removeDispositifs(dispositifsColl);

  // console.log("Dernières vérifications...");
  // await checkDispositifsWithoutTrads(dispositifsColl);
  // await checkSuggestionsAlreadyValidated(traductionsColl);
  // console.log("Vérifications terminées");

  console.log("Adaptation des utilisateurs");
  await adaptUserSelectedLanguages(usersColl);
  await adaptUserFavorites(usersColl);
  console.log("FIN Adaptation des utilisateurs");

  console.log("C'est tout bon !");
}

main()
  .catch(console.error)
  .finally(() => client.close());
