const { User } = require("../../schema/schemaUser");
const Role = require("../../schema/schemaRole.js");
const { Langue } = require("../../schema/schemaLangue");
const passwordHash = require("password-hash");
const crypto = require("crypto");
const logger = require("../../logger");
const nodemailer = require("nodemailer");
import { computePasswordStrengthScore } from "../../libs/computePasswordStrengthScore";
import { sendResetPasswordMail } from "../../modules/mail/mail.service";

const transporter = nodemailer.createTransport({
  host: "pro2.mail.ovh.net",
  port: 587,
  auth: {
    user: "nour@refugies.info",
    pass: process.env.OVH_PASS,
  },
});

// front url to reset password
const url =
  process.env.NODE_ENV === "dev"
    ? "http://localhost:3000/"
    : process.env.NODE_ENV === "staging"
    ? "https://staging.refugies.info/"
    : "https://www.refugies.info/";

const populateLanguages = (user) => {
  if (
    user.selectedLanguages &&
    user.selectedLanguages.constructor === Array &&
    user.selectedLanguages.length > 0
  ) {
    user.selectedLanguages.forEach((langue) => {
      Langue.findOne({ _id: langue._id }).exec((err, result) => {
        if (!err) {
          if (!result.participants) {
            result.participants = [user._id];
            result.save();
          } else if (
            !result.participants.some((participant) =>
              participant.equals(user._id)
            )
          ) {
            result.participants = [...result.participants, user._id];
            result.save();
          }
        }
      });
    });

    //Je vérifie maintenant s'il n'était pas inscrit dans d'autres langues à tort:
    Langue.find({ participants: user._id }).exec((err, results) => {
      if (!err) {
        results.forEach((result) => {
          if (
            result.participants.some((participant) =>
              participant.equals(user._id)
            )
          ) {
            if (!user.selectedLanguages.some((x) => x._id === result._id)) {
              Langue.update(
                { _id: result._id },
                { $pull: { participants: user._id } }
              );
            }
          }
        });
      }
    });
  }
};
const _checkAndNotifyAdmin = async function (
  user,
  roles,
  requestingUser,
  isNew = true
) {
  const adminId = roles.find((x) => x.nom === "Admin")._id;
  if (user.roles && user.roles.some((x) => adminId.equals(x))) {
    if (!isNew) {
      //Si l'utilisateur existe déjà, je vérifie qu'il n'avait pas déjà ce rôle pour pas spammer à chaque modif de l'utilisateur
      const currUser = await User.findOne({ _id: user._id });
      if (!currUser || !currUser.roles || currUser.roles.includes(adminId)) {
        return false; //On ne fait rien s'il avait déjà ce rôle;
      }
    }
    let html = "<p>Bonjour,</p>";

    html +=
      "<p>Un nouvel administrateur a été ajouté sur la plateforme Réfugiés.info (environnement : '" +
      process.env.NODE_ENV +
      "') : </p>";
    html += "<ul>";
    html += "<li>username : " + user.username + "</li>";
    html += user._id ? "<li>identifiant : " + user._id + "</li>" : "";
    html += user.email ? "<li>email : " + user.email + "</li>" : "";
    html += user.description
      ? "<li>description : " + user.description + "</li>"
      : "";
    html += user.phone ? "<li>phone : " + user.phone + "</li>" : "";
    html += "</ul>";
    html += "Cet utilisateur a été ajouté par : " + requestingUser.username;
    html += "<p>A bientôt,</p>";
    html += "<p>Soufiane, admin Réfugiés.info</p>";

    const mailOptions = {
      from: "nour@refugies.info",
      to: "diairagir@gmail.com",
      subject: "Nouvel administrateur Réfugiés.info - " + user.username,
      html,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        logger.error("error sending mail", { error: error.message });
      } else {
        logger.info("Email sent: " + info.response);
      }
    });
  }
};

function checkUserExists(req, res) {
  if (!req.body.username) {
    res.status(400).json({ text: "Requête invalide" });
  } else {
    User.findOne(
      {
        username: req.body.username, //.toLowerCase()
      },
      (err, user) => {
        if (err) {
          res.status(500).json({ text: "Erreur interne" });
        } else if (!user) {
          res
            .status(204)
            .json({ text: "L'utilisateur n'existe pas", data: false });
        } else {
          res.status(200).json({ text: "L'utilisateur existe", data: true });
        }
      }
    );
  }
}

function set_user_info(req, res) {
  let user = req.body;
  if (!user || !user._id) {
    res.status(400).json({ text: "Requête invalide" });
  } else {
    if (user.password) {
      delete user.password;
    }

    //Si l'utilisateur n'est pas admin je vérifie qu'il ne se modifie que lui-même
    let isAdmin = req.user.roles.find((x) => x.nom === "Admin");
    if (!isAdmin && !req.user._id.equals(user._id)) {
      res.status(401).json({ text: "Token invalide" });
      return false;
    }

    _checkAndNotifyAdmin(user, req.roles, req.user, false); //Si on lui donne un role admin, je notifie tous les autres admin

    if (user.traducteur) {
      user = {
        ...user,
        $addToSet: { roles: req.roles.find((x) => x.nom === "Trad")._id },
      };
      delete user.traducteur;
    }
    User.findByIdAndUpdate(
      {
        _id: user._id,
      },
      user,
      { new: true },
      function (error, result) {
        if (error) {
          res.status(500).json({ text: "Erreur interne", error: error });
        } else {
          //Si on a des données sur les langues j'alimente aussi les utilisateurs de la langue
          //Je le fais en non bloquant, il faut pas que ça renvoie une erreur à l'enregistrement
          populateLanguages(user);
          res.status(200).json({
            data: result,
            text: "Mise à jour réussie",
          });
        }
      }
    );
  }
}

function reset_password(req, res) {
  logger.info("Reset password");
  const { username } = req.body;
  if (!req.fromSite) {
    return res.status(405).json({ text: "Requête bloquée par API" });
  } else if (!username) {
    return res.status(400).json({ text: "Requête invalide" });
  }

  return User.findOne(
    {
      username,
    },
    async (err, user) => {
      if (err) {
        return res.status(500).json({ text: "Erreur interne", data: err });
      } else if (!user) {
        return res.status(404).json({ text: "L'utilisateur n'existe pas" });
      } else if (!user.email) {
        return res.status(403).json({
          text:
            "Aucune adresse mail n'est associée à ce compte. Il n'est pas possible de récupérer le mot de passe ainsi.",
          data: "no-alert",
        });
      }
      if (
        (user.roles || []).some(
          (x) => x && x.equals(req.roles.find((x) => x.nom === "Admin")._id)
        )
      ) {
        //L'admin ne peut pas le faire comme ça
        return res.status(401).json({
          text:
            "Cet utilisateur n'est pas autorisé à modifier son mot de passe ainsi, merci de contacter l'administrateur du site",
        });
      }
      crypto.randomBytes(20, function (errb, buffer) {
        if (errb) {
          return res.status(422).json({ message: errb });
        }
        const token = buffer.toString("hex");
        user
          .updateOne({
            reset_password_token: token,
            reset_password_expires: Date.now() + 1 * 60 * 60 * 1000,
          })
          .exec();
        const newUrl = url + "reset/" + token;

        sendResetPasswordMail(username, newUrl, user.email);

        return res.status(200).json({ text: "Envoi réussi", data: user.email });
      });
    }
  );
}

function set_new_password(req, res) {
  const { newPassword, reset_password_token } = req.body;
  if (!req.fromSite) {
    return res.status(405).json({ text: "Requête bloquée par API" });
  } else if (!newPassword || !reset_password_token) {
    return res.status(400).json({ text: "Requête invalide" });
  }

  return User.findOne(
    {
      reset_password_token,
      reset_password_expires: { $gt: Date.now() },
    },
    async (err, user) => {
      if (err) {
        return res.status(500).json({ text: "Erreur interne", data: err });
      } else if (!user) {
        return res.status(404).json({ text: "L'utilisateur n'existe pas" });
      } else if (!user.email) {
        return res.status(403).json({
          text:
            "Aucune adresse mail n'est associée à ce compte. Il n'est pas possible de récupérer le mot de passe ainsi.",
        });
      }
      if (
        (user.roles || []).some(
          (x) => x && x.equals(req.roles.find((x) => x.nom === "Admin")._id)
        )
      ) {
        //L'admin ne peut pas le faire comme ça
        return res.status(401).json({
          text:
            "Cet utilisateur n'est pas autorisé à modifier son mot de passe ainsi, merci de contacter l'administrateur du site",
        });
      }
      if ((computePasswordStrengthScore(newPassword) || {}).score < 1) {
        return res
          .status(401)
          .json({ text: "Le mot de passe est trop faible" });
      }
      user.password = passwordHash.generate(newPassword);
      user.reset_password_token = undefined;
      user.reset_password_expires = undefined;
      user.save();
      res.status(200).json({
        token: user.getToken(),
        text: "Authentification réussi",
      });
    }
  );
}

function get_users(req, res) {
  var { query, sort, populate } = req.body;

  if (!req.fromSite) {
    //On n'autorise pas les populate en API externe
    populate = "";
  } else if (populate && populate.constructor === Object) {
    populate.select = "-password";
  } else if (populate) {
    populate = { path: populate, select: "-password" };
  } else {
    populate = "";
  }

  const select = ((req.user || {}).roles || []).some((x) => x.nom === "Admin")
    ? undefined
    : req.fromSite
    ? "username roles last_connected email"
    : "username";

  var find = new Promise((resolve, reject) => {
    User.find(query)
      .sort(sort)
      .populate(populate)
      .select(select)
      .exec(function (err, result) {
        if (err) {
          reject(500);
        } else {
          if (result) {
            resolve(result);
          } else {
            reject(404);
          }
        }
      });
  });

  find.then(
    (result) => {
      if (result) {
        result.forEach((item) => {
          if (item.password) {
            item.password = "Hidden";
          }
        });
      }

      res.status(200).json({
        text: "Succès",
        data: result,
      });
    },
    (error) => {
      switch (error) {
        case 500:
          res.status(500).json({
            text: "Erreur interne",
          });
          break;
        case 404:
          res.status(404).json({
            text: "Pas de résultats",
          });
          break;
        default:
          res.status(500).json({
            text: "Erreur interne",
          });
      }
    }
  );
}

function get_user_info(req, res) {
  const user = req.user;
  const filteredLanguages = user.selectedLanguages
    ? user.selectedLanguages.filter((langue) => langue.langueCode !== "fr")
    : [];

  user.selectedLanguages = filteredLanguages;
  res.status(200).json({
    text: "Succès",
    data: user,
  });
}

//Cette fonction semble inutilisée maintenant, à vérifier
function signup(req, res) {
  if (!req.body.username || !req.body.password) {
    //Le cas où l'email ou bien le password ne serait pas soumis ou nul
    res.status(400).json({ text: "Requête invalide" });
  } else {
    let user = req.body;

    if (user.password) {
      if ((computePasswordStrengthScore(user.password) || {}).score < 1) {
        return res
          .status(401)
          .json({ text: "Le mot de passe est trop faible" });
      }
      user.password = passwordHash.generate(user.password);
    }

    const find = new Promise(function (resolve, reject) {
      User.findOne(
        {
          username: user.username,
        },
        function (err, result) {
          if (err) {
            reject(500);
          } else {
            if (result) {
              reject(204);
            } else {
              resolve(true);
            }
          }
        }
      );
    });

    find.then(
      function () {
        if (user.traducteur) {
          user.roles = [req.roles.find((x) => x.nom === "Trad")._id];
          delete user.traducteur;
        }
        user.status = "Actif";
        user.last_connected = new Date();

        Role.findOne({ nom: "User" }).exec((e, result) => {
          user.roles = (result || {})._id;

          var _u = new User(user);
          _u.save(function (err, user) {
            if (err) {
              res.status(500).json({
                text: "Erreur interne",
              });
            } else {
              //Si on a des données sur les langues j'alimente aussi les utilisateurs de la langue
              //Je le fais en non bloquant, il faut pas que ça bloque l'enregistrement
              populateLanguages(user);

              res.status(200).json({
                text: "Succès",
                token: user.getToken(),
                data: user,
              });
            }
          });
        });
      },
      function (error) {
        switch (error) {
          case 500:
            res.status(500).json({
              text: "Erreur interne",
            });
            break;
          case 204:
            res.status(404).json({
              text: "Le nom d'utilisateur existe déjà",
            });
            break;
          default:
            res.status(500).json({
              text: "Erreur interne",
            });
        }
      }
    );
  }
}

//On exporte nos fonctions

exports.signup = signup;
exports.checkUserExists = checkUserExists;
exports.set_user_info = set_user_info;
exports.get_users = get_users;
exports.get_user_info = get_user_info;
exports.reset_password = reset_password;
exports.set_new_password = set_new_password;
