import { Res, RequestFromClient } from "../../../types/interface";
import logger from "../../../logger";
import { getAllUsersFromDB } from "../../../modules/users/users.repository";
import { adaptUsers } from "../getAllUsers/getAllUsers";
import { ObjectId } from "mongoose";
import moment from "moment";
import { asyncForEach } from "../../../libs/asyncForEach";
import { computeGlobalIndicator } from "../../../controllers/traduction/lib";
import { checkIfUserIsAdmin } from "../../../libs/checkAuthorizations";
var Airtable = require("airtable");
var base = new Airtable({ apiKey: process.env.airtableApiKey }).base(
  process.env.AIRTABLE_BASE_USERS
);

interface UserToExport {
  Pseudonyme: string;
  Email: string;
  "Date de création": string;
  "Date de dernière visite": string;
  Role: string[];
  "Mots traduits": number;
  "Temps passé à traduire": number;
  Structure: string;
  Langues: string[];
  "Nb fiches avec contribution": number;
  Env: string;
}
interface User {
  _id: ObjectId;
  username: string;
  created_at?: Date;
  last_connected?: Date;
  roles?: string[];
  email: string;
  langues?: {
    langueCode: string;
    langueFr: string;
  }[];
  structures?: { _id: ObjectId; nom: string }[];
  nbStructures?: number;
  nbContributions?: number;
  totalIndicator: { wordsCount: number; timeSpent: number }[];
}

const exportUsersInAirtable = (users: { fields: UserToExport }[]) => {
  logger.info(
    `[exportUsersInAirtable] export ${users.length} users in airtable`
  );
  base("Users").create(users, function (err: Error) {
    if (err) {
      logger.error(
        "[exportUsersInAirtable] error while exporting users to airtable",
        {
          usersId: users.map((user) => user.fields.Pseudonyme),
          error: err,
        }
      );
      return;
    }

    logger.info(
      `[exportUsersInAirtable] successfully exported ${users.length}`
    );
  });
};

const formatUser = (user: User) => {
  logger.info(`[formatUser] format user with id ${user._id}`);
  const structure =
    user.structures && user.structures.length > 0
      ? user.structures.map((structure) => structure.nom).join()
      : "";
  const format2 = "YYYY/MM/DD";
  const createdAt = user.created_at
    ? moment(user.created_at).format(format2)
    : "1900/01/01";

  const last_connected = user.last_connected
    ? moment(user.last_connected).format(format2)
    : "1900/01/01";
  const rolesWithTraducteur =
    user.langues.length > 0 ? user.roles.concat(["Traducteur"]) : user.roles;

  const langues = user.langues.map((langue) => langue.langueFr);
  const nbWords =
    user.totalIndicator && user.totalIndicator.length > 0
      ? Math.floor(user.totalIndicator[0].wordsCount)
      : 0;

  const timeSpent =
    user.totalIndicator && user.totalIndicator.length > 0
      ? Math.floor(user.totalIndicator[0].timeSpent / 60 / 1000)
      : 0;

  return {
    fields: {
      Pseudonyme: user.username,
      Email: user.email,
      "Date de création": createdAt,
      "Date de dernière visite": last_connected,
      Role: rolesWithTraducteur,
      "Mots traduits": nbWords,
      "Temps passé à traduire": timeSpent,
      Structure: structure,
      Langues: langues,
      "Nb fiches avec contribution": user.nbContributions,
      Env: process.env.NODE_ENV,
    },
  };
};

export const exportUsers = async (req: RequestFromClient<{}>, res: Res) => {
  try {
    // @ts-ignore : populate roles
    checkIfUserIsAdmin(req.user.roles);

    logger.info("[exportUsers] call received");
    const neededFields = {
      username: 1,
      picture: 1,
      status: 1,
      created_at: 1,
      roles: 1,
      structures: 1,
      email: 1,
      selectedLanguages: 1,
      contributions: 1,
      last_connected: 1,
    };

    const users = await getAllUsersFromDB(neededFields);
    const adaptedUsers = adaptUsers(users, "admin");
    let usersToExport: { fields: UserToExport }[] = [];
    await asyncForEach(adaptedUsers, async (user) => {
      logger.info(`[exportUsers] get indicators user ${user._id}`);
      const totalIndicator = await computeGlobalIndicator(user._id);
      const formattedUser = formatUser({ ...user, totalIndicator });
      usersToExport.push(formattedUser);

      if (usersToExport.length === 10) {
        exportUsersInAirtable(usersToExport);
        usersToExport = [];
      }
    });

    if (usersToExport.length > 0) {
      exportUsersInAirtable(usersToExport);
    }

    logger.info(
      `[exportUsers] successfully launched export of ${adaptedUsers.length} users`
    );

    return res.status(200).json({
      text: "OK",
    });
  } catch (error) {
    logger.error("[exportUsers] error", { error: error.message });
    res.status(500).json({ text: "Erreur interne" });
  }
};
