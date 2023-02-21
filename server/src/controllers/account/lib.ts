import { Request, Response } from "express";
import crypto from "crypto";

import logger from "../../logger";
import { sendResetPasswordMail } from "../../modules/mail/mail.service";
import { UserModel } from "src/typegoose";

// front url to reset password
const url =
  process.env.NODE_ENV === "dev"
    ? "http://localhost:3000/"
    : process.env.NODE_ENV === "staging"
      ? "https://staging.refugies.info/"
      : "https://www.refugies.info/";

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

function reset_password(req: Request, res: Response) {
  logger.info("Reset password");
  const { username } = req.body;
  if (!req.fromSite) {
    return res.status(405).json({ text: "Requête bloquée par API" });
  } else if (!username) {
    return res.status(400).json({ text: "Requête invalide" });
  }

  return UserModel.findOne({
    username,
  })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ text: "L'utilisateur n'existe pas" });
      } else if (!user.email) {
        return res.status(403).json({
          text: "Aucune adresse mail n'est associée à ce compte. Il n'est pas possible de récupérer le mot de passe ainsi.",
          data: "no-alert",
        });
      }

      if (user.isAdmin()) {
        //L'admin ne peut pas le faire comme ça
        return res.status(401).json({
          text: "Cet utilisateur n'est pas autorisé à modifier son mot de passe ainsi, merci de contacter l'administrateur du site",
        });
      }
      crypto.randomBytes(20, async function (errb, buffer) {
        if (errb) {
          return res.status(422).json({ message: errb });
        }
        const token = buffer.toString("hex");
        await UserModel.updateOne({
          reset_password_token: token,
          reset_password_expires: Date.now() + 1 * 60 * 60 * 1000,
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
        data: result,
      });
    })
    .catch((error) => {
      switch (error) {
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
    });
}

export { checkUserExists, get_users, reset_password };
