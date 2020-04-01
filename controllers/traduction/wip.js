const insertInDispositif = (res, traduction, locale) => {
  console.log(res, traduction, locale);
  return Dispositif.findOne({ _id: traduction.articleId }).exec(
    (err, result) => {
      if (!err && result) {
        pointeurs.forEach(x => {
          if (!result[x] || !traduction.translatedText[x]) {
            return;
          }
          if (!result[x].fr) {
            result[x] = { fr: result[x] };
          }
          console.log(
            x,
            traduction.translatedText,
            traduction.translatedText[x],
            result,
            result[x][locale]
          );
          result[x][locale] = traduction.translatedText[x];
          result.markModified(x);
        });

        result.contenu.forEach((p, i) => {
          if (p.title) {
            if (!p.title.fr) {
              p.title = { fr: p.title };
            }
            p.title[locale] = traduction.translatedText.contenu[i].title;
          }
          if (p.content) {
            if (!p.content.fr) {
              p.content = { fr: p.content };
            }
            p.content[locale] = traduction.translatedText.contenu[i].content;
          }
          if (p.children && p.children.length > 0) {
            p.children.forEach((c, j) => {
              if (
                c.title &&
                traduction.translatedText.contenu[i] &&
                traduction.translatedText.contenu[i].children &&
                traduction.translatedText.contenu[i].children[j] &&
                traduction.translatedText.contenu[i].children[j].title
              ) {
                console.log(
                  "check before insertion of childrren:",
                  traduction,
                  traduction.translatedText.contenu[i].children[j]
                );
                if (!c.title.fr) {
                  c.title = { fr: c.title };
                }
                c.title[locale] =
                  traduction.translatedText.contenu[i].children[j].title;
              }
              if (
                c.content &&
                traduction.translatedText.contenu[i] &&
                traduction.translatedText.contenu[i].children &&
                traduction.translatedText.contenu[i].children[j] &&
                traduction.translatedText.contenu[i].children[j].content
              ) {
                console.log(
                  "check before insertion of childrren:",
                  traduction,
                  traduction.translatedText.contenu[i].children[j]
                );
                if (!c.content.fr) {
                  c.content = { fr: c.content };
                }
                c.content[locale] =
                  traduction.translatedText.contenu[i].children[j].content;
              }
            });
          }
        });
        result.markModified("contenu");

        result.traductions = [
          ...new Set([
            ...(result.traductions || []),
            ...(traduction.traductions || []).map(x => x._id)
          ])
        ];
        result.participants = [
          ...new Set([
            ...(result.participants || []),
            ...(traduction.traductions || []).map(x => (x.userId || {})._id)
          ])
        ];
        if (result.avancement === 1) {
          result.avancement = { fr: 1 };
        }
        result.avancement = {
          ...result.avancement,
          [locale]: 1
        };
        return result.save((err, data) => {
          if (err) {
            console.log(err);
            res.status(500).json({ text: "Erreur interne" });
          } else {
            console.log("succes");
            res.status(200).json({
              text: "Succès",
              data: data
            });
          }
          return res;
        });
      } else {
        console.log(err);
        res.status(400).json({ text: "Erreur d'identification du dispositif" });
        return res;
      }
    }
  );
};

const turnToLocalized = (result, locale) => {
  pointeurs.forEach(x => {
    if (result[x]) {
      result[x] = result[x][locale] || result[x].fr || result[x];
    }
  });

  result.contenu.forEach(p => {
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
      });
    }
  });
  return result;
};

const markTradModifications = (newD, oldD, trad, locale) => {
  pointeurs.forEach(x => {
    if (JSON.stringify(oldD[x]) !== JSON.stringify(newD[x])) {
      trad.translatedText[x].modified = true;
      trad.status = 'À revoir';
    }
  });

  newD.contenu.forEach(p, index => {
    if (JSON.stringify(p.title) !== JSON.stringify(oldD.contenu[index].title)) {
        trad.translatedText.contenu[index].titleModified = true;
        trad.status = 'À revoir';
    }
    if (
      JSON.stringify(p.content) !== JSON.stringify(oldD.contenu[index].content)
    ) {
        trad.translatedText.contenu[index].contentModified = true;
        trad.status = 'À revoir';
    }
    if (p.children && p.children.length > 0) {
      p.children.forEach((c, j) => {
        if (JSON.stringify(c.title) !== JSON.stringify(oldD.contenu[index].children[j].title)) {
            trad.translatedText.contenu[index].children[j].titleModified = true;
            trad.status = 'À revoir';
        }
        if (JSON.stringify(c.content) !== JSON.stringify(oldD.contenu[index].children[j].content)) {
            trad.translatedText.contenu[index].children[j].contentModified = true;
            trad.status = 'À revoir';
          }
      });
    }
  });
  return trad;
};
JSON.stringify(obj1) === JSON.stringify(obj2);
