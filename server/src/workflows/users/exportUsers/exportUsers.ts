import logger from "../../../logger";
import { getAllUsersForAdminFromDB } from "../../../modules/users/users.repository";
import { computeGlobalIndicator } from "../../../controllers/traduction/lib";
import { Response } from "../../../types/interface";
import { ProgressionIndicator } from "@refugies-info/api-types";
import { airtableUserBase } from "../../../connectors/airtable/airtable";

interface UserToExport {
  fields: {
    "Pseudonyme": string;
    "Email": string;
    "Date de création": string;
    "Date de dernière visite": string;
    "Role": string[];
    "Mots traduits": number;
    "Temps passé à traduire": number;
    "Structure": string;
    "Langues": string[];
    "Nb fiches avec contribution": number;
    "Env": string;
  };
}

const exportUsersInAirtable = (users: UserToExport[]): void => {
  logger.info(`[exportUsersInAirtable] export ${users.length} users in airtable`);
  return airtableUserBase("Users").create(users, { typecast: true }, function (err: Error) {
    if (err) {
      logger.error("[exportUsersInAirtable] error while exporting users to airtable", {
        usersId: users.map((user) => user.fields.Pseudonyme),
        error: err,
      });
      return;
    }

    logger.info(`[exportUsersInAirtable] successfully exported ${users.length}`);
  });
};

const formatUser = (user: Awaited<ReturnType<typeof getAllUsersForAdminFromDB>>[0], indicators: ProgressionIndicator): UserToExport => {
  logger.info(`[formatUser] format user with id ${user._id}`);
  const structure =
    user.structures && user.structures.length > 0 ? user.structures.map((structure) => structure.nom).join() : "";
  const createdAt = user.created_at ? user.created_at.toISOString() : "";
  const last_connected = user.last_connected ? user.last_connected.toISOString() : "";
  const roleNames = user.roles.filter(r => r.nom !== "User").map((r) => r.nomPublique);
  const langues = user.selectedLanguages.map((langue) => langue.langueFr);
  const nbWords = Math.floor(indicators?.wordsCount || 0);
  const timeSpent = Math.floor((indicators?.timeSpent || 0) / 60 / 1000);

  return {
    fields: {
      "Pseudonyme": user.username,
      "Email": user.email,
      "Date de création": createdAt,
      "Date de dernière visite": last_connected,
      "Role": roleNames,
      "Mots traduits": nbWords,
      "Temps passé à traduire": timeSpent,
      "Structure": structure,
      "Langues": langues,
      "Nb fiches avec contribution": (user.contributions || []).length,
      "Env": process.env.NODE_ENV,
    },
  };
};

export const exportUsers = async (): Response => {
  logger.info("[exportUsers] received");
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

  const users = await getAllUsersForAdminFromDB(neededFields);
  let usersToExport: UserToExport[] = [];
  for (const user of users) {
    logger.info(`[exportUsers] get indicators user ${user._id}`);
    const totalIndicator = await computeGlobalIndicator(user._id.toString());
    const formattedUser = formatUser(user, totalIndicator);
    usersToExport.push(formattedUser);

    if (usersToExport.length === 10) {
      exportUsersInAirtable(usersToExport);
      usersToExport = [];
    }
  }

  if (usersToExport.length > 0) {
    exportUsersInAirtable(usersToExport);
  }

  logger.info(`[exportUsers] successfully launched export of ${users.length} users`);

  return { text: "success" };
};
