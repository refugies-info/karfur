import nodemailer from "nodemailer";
import { Ref } from "@typegoose/typegoose";
import { Request, Response } from "express";
import crypto from "crypto";

import logger from "../../logger";
import { sendResetPasswordMail } from "../../modules/mail/mail.service";
import formatPhoneNumber from "../../libs/formatPhoneNumber";
import { Langue, LangueModel, Role, User, UserModel } from "src/typegoose";
import { pick } from "lodash";

const transporter = nodemailer.createTransport({
  host: "pro2.mail.ovh.net",
  port: 587,
  auth: {
    user: "nour@refugies.info",
    pass: process.env.OVH_PASS
  }
});

// front url to reset password
const url =
  process.env.NODE_ENV === "dev"
    ? "http://localhost:3000/"
    : process.env.NODE_ENV === "staging"
    ? "https://staging.refugies.info/"
    : "https://www.refugies.info/";

const populateLanguages = async (user: User) => {
  if (user.selectedLanguages && user.selectedLanguages.constructor === Array && user.selectedLanguages.length > 0) {
    user.selectedLanguages.forEach((langue: Ref<Langue>) => {
      LangueModel.findOne({ _id: langue._id }).exec(async (err, result) => {
        if (!err) {
          if (!result.participants) {
            result.participants = [user._id];
            await result.save();
          } else if (!result.participants.some((participant) => participant._id.equals(user._id))) {
            result.participants = [...result.participants, user._id];
            await result.save();
          }
        }
      });
    });

    //Je vérifie maintenant s'il n'était pas inscrit dans d'autres langues à tort:
    LangueModel.find({ participants: user._id }).exec(async (err, results) => {
      if (!err) {
        results.forEach(async (result) => {
          if (result.participants.some((participant) => participant._id.equals(user._id))) {
            if (!user.selectedLanguages.some((x) => x._id === result._id)) {
              await LangueModel.updateOne({ _id: result._id }, { $pull: { participants: user._id } });
            }
          }
        });
      }
    });
  }
};
const _checkAndNotifyAdmin = async function (user: User, roles: Role[], requestingUser: User, isNew = true) {
  const adminId = roles.find((x) => x.nom === "Admin")._id;
  if (user.roles && user.roles.some((x) => adminId._id.equals(x._id))) {
    if (!isNew) {
      //Si l'utilisateur existe déjà, je vérifie qu'il n'avait pas déjà ce rôle pour pas spammer à chaque modif de l'utilisateur
      const currUser = await UserModel.findOne({ _id: user._id });
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
    html += user.description ? "<li>description : " + user.description + "</li>" : "";
    html += user.phone ? "<li>phone : " + user.phone + "</li>" : "";
    html += "</ul>";
    html += "Cet utilisateur a été ajouté par : " + requestingUser.username;
    html += "<p>A bientôt,</p>";
    html += "<p>Soufiane, admin Réfugiés.info</p>";

    const mailOptions = {
      from: "nour@refugies.info",
      to: "diairagir@gmail.com",
      subject: "Nouvel administrateur Réfugiés.info - " + user.username,
      html
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

async function checkUserExists(req: Request, res: Response) {
  if (!req.body.username) {
    return res.status(400).json({ text: "Requête invalide" });
  }
  try {
    const user = await UserModel.findOne({ username: req.body.username });
    if (!user) {
      return res.status(204).json({ text: "L'utilisateur n'existe pas", data: false });
    }
    return res.status(200).json({ text: "L'utilisateur existe", data: true });
  } catch (e) {
    return res.status(500).json({ text: "Erreur interne" });
  }
}

async function set_user_info(req: Request, res: Response) {
  try {
    let user = req.body;
    if (!user || !user._id) return res.status(400).json({ text: "Requête invalide" });

    if (user.password) {
      delete user.password;
    }

    //Si l'utilisateur n'est pas admin je vérifie qu'il ne se modifie que lui-même
    if (!req.user.isAdmin() && !req.user._id.equals(user._id)) {
      res.status(401).json({ text: "Token invalide" });
      return false;
    }

    await _checkAndNotifyAdmin(user, req.roles, req.user, false); //Si on lui donne un role admin, je notifie tous les autres admin

    // keep only needed properties
    let userToSave: any = {
      _id: user._id
    };
    if (user.email) userToSave.email = user.email;
    if (user.phone) userToSave.phone = formatPhoneNumber(user.phone);
    if (user.last_connected) userToSave.last_connected = user.last_connected;
    if (user.cookies) userToSave.cookies = user.cookies;
    if (user.traducteur) {
      userToSave["$addToSet"] = { roles: req.roles.find((x) => x.nom === "Trad")._id };
    }

    const result = await UserModel.findByIdAndUpdate(
      {
        _id: user._id
      },
      userToSave,
      { new: true }
    );

    //Si on a des données sur les langues j'alimente aussi les utilisateurs de la langue
    try {
      await populateLanguages(user);
    } catch (e) {
      logger.error("[set_user_info] error while populating languages", e);
    }
    return res.status(200).json({
      data: result,
      text: "Mise à jour réussie"
    });
  } catch (e) {
    logger.error("[set_user_info] error", e);
    return res.status(500).json({ text: "Erreur interne", error: e });
  }
}

function reset_password(req: Request, res: Response) {
  logger.info("Reset password");
  const { username } = req.body;
  if (!req.fromSite) {
    return res.status(405).json({ text: "Requête bloquée par API" });
  } else if (!username) {
    return res.status(400).json({ text: "Requête invalide" });
  }

  return UserModel.findOne({
    username
  })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ text: "L'utilisateur n'existe pas" });
      } else if (!user.email) {
        return res.status(403).json({
          text: "Aucune adresse mail n'est associée à ce compte. Il n'est pas possible de récupérer le mot de passe ainsi.",
          data: "no-alert"
        });
      }

      if (user.isAdmin()) {
        //L'admin ne peut pas le faire comme ça
        return res.status(401).json({
          text: "Cet utilisateur n'est pas autorisé à modifier son mot de passe ainsi, merci de contacter l'administrateur du site"
        });
      }
      crypto.randomBytes(20, async function (errb, buffer) {
        if (errb) {
          return res.status(422).json({ message: errb });
        }
        const token = buffer.toString("hex");
        await UserModel.updateOne({
          reset_password_token: token,
          reset_password_expires: Date.now() + 1 * 60 * 60 * 1000
        }).exec();
        const newUrl = url + "reset?token=" + token;

        await sendResetPasswordMail(username, newUrl, user.email);

        return res.status(200).json({ text: "Envoi réussi", data: user.email });
      });
    })
    .catch((err) => {
      return res.status(500).json({ text: "Erreur interne", data: err });
    });
}

function get_users(req: Request, res: Response) {
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

  const select = req.user?.isAdmin() ? undefined : req.fromSite ? "username roles last_connected email" : "username";

  UserModel.find(query)
    .sort(sort)
    .populate(populate)
    .select(select)
    .then((result) => {
      if (!result) throw 404;
      result.forEach((item) => {
        if (item.password) {
          item.password = "Hidden";
        }
      });
      res.status(200).json({
        text: "Succès",
        data: result
      });
    })
    .catch((error) => {
      switch (error) {
        case 404:
          res.status(404).json({
            text: "Pas de résultats"
          });
          break;
        default:
          res.status(500).json({
            text: "Erreur interne"
          });
      }
    });
}

function get_user_info(req: Request, res: Response) {
  console.log(req.user);
  res.status(200).json({
    text: "Succès",
    data: pick(req.user.toObject(), [
      "structures",
      "_id",
      "roles",
      "traductionsFaites",
      "contributions",
      "username",
      "status",
      "email",
      "selectedLanguages"
    ])
  });
}

export { checkUserExists, set_user_info, get_users, get_user_info, reset_password };
