import { Request, Response } from "express";
import { UserModel } from "src/typegoose";



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

export { checkUserExists, get_users };
