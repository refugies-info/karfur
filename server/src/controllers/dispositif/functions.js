const himalaya = require("himalaya");
const sanitizeHtml = require("sanitize-html");
const { sanitizeOptions } = require("../article/data");

const pointeurs = ["titreInformatif", "titreMarque", "abstract"];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const markTradModifications = (newD, oldD, trad, locale) => {
  pointeurs.forEach((x) => {
    if (JSON.stringify(oldD[x]) !== JSON.stringify(newD[x])) {
      trad.translatedText[x + "Modified"] = true;
      trad.status = "À revoir";
    }
  });
  oldD.contenu.forEach((p, index) => {
    if (!trad.translatedText.contenu[index]) {
      return;
    }
    if (JSON.stringify(p.title) !== JSON.stringify(newD.contenu[index].title)) {
      trad.translatedText.contenu[index].titleModified = true;
      trad.status = "À revoir";
    }

    if (
      JSON.stringify(p.content) !== JSON.stringify(newD.contenu[index].content)
    ) {
      trad.translatedText.contenu[index].contentModified = true;
      trad.status = "À revoir";
    }

    if (
      p.children !== newD.contenu[index].children ||
      (p.children && p.children.length !== newD.contenu[index].children.length)
    ) {
      trad.status = "À revoir";
    }
    if (p.children && p.children.length > 0) {
      p.children.forEach((c, j) => {
        if (!newD.contenu[index].children) {
          delete trad.translatedText.contenu[index].children;
          trad.status = "À revoir";
        } else if (!newD.contenu[index].children[j]) {
          trad.translatedText.contenu[index].children.splice(j, 1);
          trad.status = "À revoir";
        } else {
          if (
            c.type !== "card" &&
            JSON.stringify(c.title) !==
              JSON.stringify(newD.contenu[index].children[j].title)
          ) {
            trad.translatedText.contenu[index].children[j].titleModified = true;
            trad.status = "À revoir";
          }

          if (
            c.type !== "card" &&
            JSON.stringify(c.content) !==
              JSON.stringify(newD.contenu[index].children[j].content)
          ) {
            trad.translatedText.contenu[index].children[
              j
            ].contentModified = true;
            trad.status = "À revoir";
          }

          if (
            c.type !== "card" &&
            JSON.stringify(c.contentTitle) !==
              JSON.stringify(newD.contenu[index].children[j].contentTitle)
          ) {
            trad.translatedText.contenu[index].children[
              j
            ].contentTitleModified = true;
            trad.status = "À revoir";
          }
        }
      });
    }
  });
  return trad;
};

const countContents = (obj, nbChamps = 0, type = null) => {
  obj.forEach((x) => {
    ["titreInformatif", "titreMarque", "abstract", "title", "content"].forEach(
      (p) => {
        if (
          x[p] &&
          x[p] !== "" &&
          x[p] !== "null" &&
          x[p] !== "undefined" &&
          x[p] !== undefined &&
          x[p] !== null &&
          x[p] !== "<p>null</p>" &&
          x[p] !== "<p><br></p>" &&
          x[p] !== "<p><br></p>\n" &&
          x[p] !== "<br>" &&
          x[p] !== "<p></p>\n\n<p></p>\n" &&
          type !== "cards"
        ) {
          nbChamps += 1;
        }
      }
    );
    if (
      type === "cards" &&
      (x.title === "Important !" || !x.title) &&
      x.contentTitle &&
      x.contentTitle !== "" &&
      x.contentTitle !== undefined &&
      x.contentTitle !== null &&
      x.contentTitle !== "null" &&
      x.contentTitle !== "undefined" &&
      x.contentTitle !== "<p>null</p>" &&
      x.contentTitle !== "<p><br></p>" &&
      x.contentTitle !== "<br>"
    ) {
      nbChamps += 1;
    }
    if (x.contenu && x.contenu.length > 0) {
      nbChamps = countContents(x.contenu, nbChamps, x.type);
    }
    if (x.children && x.children.length > 0) {
      nbChamps = countContents(x.children, nbChamps, x.type);
    }
  });
  return nbChamps;
};

const countValidated = (obj, nbChamps = 0, type = null) => {
  obj.forEach((x) => {
    ["titreInformatif", "titreMarque", "abstract", "title", "content"].forEach(
      (p) => {
        if (
          x[p] &&
          x[p] !== "" &&
          x[p] !== "null" &&
          x[p] !== "undefined" &&
          x[p] !== undefined &&
          x[p] !== null &&
          x[p] !== "<p>null</p>" &&
          x[p] !== "<p><br></p>" &&
          x[p] !== "<p><br></p>\n" &&
          x[p] !== "<br>" &&
          x[p] !== "<p></p>\n\n<p></p>\n" &&
          type !== "cards" &&
          !x[p + "Modified"]
        ) {
          nbChamps += 1;
        }
      }
    );
    if (
      type === "cards" &&
      (x.title === "Important !" || !x.title) &&
      x.contentTitle &&
      x.contentTitle !== "" &&
      x.contentTitle !== undefined &&
      x.contentTitle !== null &&
      x.contentTitle !== "null" &&
      x.contentTitle !== "undefined" &&
      x.contentTitle !== "<p>null</p>" &&
      x.contentTitle !== "<p><br></p>" &&
      x.contentTitle !== "<br>" &&
      !x["contentTitleModified"]
    ) {
      nbChamps += 1;
    }
    if (x.contenu && x.contenu.length > 0) {
      nbChamps = countValidated(x.contenu, nbChamps, x.type);
    }
    if (x.children && x.children.length > 0) {
      nbChamps = countValidated(x.children, nbChamps, x.type);
    }
  });
  return nbChamps;
};

const turnToLocalized = (result, locale) => {
  pointeurs.forEach((x) => {
    if (result[x]) {
      result[x] = result[x][locale] || result[x].fr || result[x];
    }
  });

  result.contenu.forEach((p) => {
    if (p.title) {
      p.title = p.title[locale] || p.title.fr || p.title;
    }
    if (p.content) {
      p.content = p.content[locale] || p.content.fr || p.content;
    }
    if (p.children && p.children.length > 0) {
      p.children.forEach((c, j) => {
        if (c.title) {
          c.title = c.title[locale] || c.title.fr || c.title;
        }
        if (c.content) {
          c.content = c.content[locale] || c.content.fr || c.content;
        }
        if (c.contentTitle) {
          c.contentTitle =
            c.contentTitle[locale] || c.contentTitle.fr || c.contentTitle;
        }
      });
    }
  });
  return result;
};

const turnToLocalizedNew = (resultObj, locale) => {
  var result = JSON.parse(JSON.stringify(resultObj));
  pointeurs.forEach((x) => {
    if (result[x]) {
      result[x] = result[x][locale] || result[x].fr || result[x];
    }
  });

  result.contenu.forEach((p) => {
    if (p.title) {
      p.title = p.title[locale] || p.title.fr || p.title;
    }
    if (p.content) {
      p.content = p.content[locale] || p.content.fr || p.content;
    }
    if (p.children && p.children.length > 0) {
      p.children.forEach((c, j) => {
        if (c.title) {
          c.title = c.title[locale] || c.title.fr || c.title;
        }
        if (c.content) {
          c.content = c.content[locale] || c.content.fr || c.content;
        }
        if (c.contentTitle) {
          c.contentTitle =
            c.contentTitle[locale] || c.contentTitle.fr || c.contentTitle;
        }
      });
    }
  });
  return result;
};

const turnToLocalizedFaster = (result, locale) => {
  var clonedResult = { ...result };
  pointeurs.map((x) => {
    if (result[x]) {
      result[x] = result[x][locale] || result[x].fr || result[x];
    }
  });

  const newResult = result.contenu.map((p) => {
    if (p.title) {
      const title = p.title[locale] || p.title.fr || p.title;
    }
    if (p.content) {
      const content = p.content[locale] || p.content.fr || p.content;
    }
    if (p.children && p.children.length > 0) {
      const children = p.children.map((c, j) => {
        if (c.title) {
          const ctitle = c.title[locale] || c.title.fr || c.title;
        }
        if (c.content) {
          const ccontent = c.content[locale] || c.content.fr || c.content;
        }
        return { title: ctitle, content: ccontent };
      });
    }
    return { title, content, children };
  });
  return newResult;
};

const turnToDelocalized = () => {};

//Dupliqué dans traduction/lib : Node ne semble pas gérer cet export (circulaire)
const turnHTMLtoJSON = (contenu, nbMots = 0) => {
  for (var i = 0; i < contenu.length; i++) {
    if (contenu[i].content) {
      let html = contenu[i].content;
      nbMots += (html || "").trim().split(/\s+/).length;
      let safeHTML = sanitizeHtml(html, sanitizeOptions); //Pour l'instant j'autorise tous les tags, il faudra voir plus finement ce qui peut descendre de l'éditeur et restreindre à ça
      let jsonBody = himalaya.parse(safeHTML, {
        ...himalaya.parseDefaults,
        includePositions: false,
      });
      contenu[i].content = jsonBody;
    }

    if ((contenu[i].children || []).length > 0) {
      nbMots = turnHTMLtoJSON(contenu[i].children, nbMots);
    }
  }
  return nbMots;
};

//Dupliqué dans traduction/lib : Node ne semble pas gérer cet export (circulaire)
const turnJSONtoHTML = (contenu) => {
  if (contenu) {
    for (var i = 0; i < contenu.length; i++) {
      if (
        contenu[i] &&
        contenu[i].content &&
        (typeof contenu[i].content === Object ||
          typeof contenu[i].content === "object")
      ) {
        contenu[i].content = himalaya.stringify(contenu[i].content);
      }
      if (contenu[i] && contenu[i].children && contenu[i].children.length > 0) {
        turnJSONtoHTML(contenu[i].children);
      }
    }
  }
};

exports.turnToLocalized = turnToLocalized;
exports.turnToLocalizedNew = turnToLocalizedNew;
exports.markTradModifications = markTradModifications;
exports.countContents = countContents;
exports.countValidated = countValidated;
exports.turnHTMLtoJSON = turnHTMLtoJSON;
exports.turnJSONtoHTML = turnJSONtoHTML;
