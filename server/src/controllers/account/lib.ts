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

export { checkUserExists };
