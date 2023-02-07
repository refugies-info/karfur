import { Request } from "express";
import jwt from "jwt-simple";
import { Config } from "src/types/interface";
import { UserModel } from "src/typegoose";
import { AuthenticationError } from "./errors";

let config: Config = {};
if (process.env.NODE_ENV === "dev") {
  config = require("./config/config");
}

export function expressAuthentication(
  request: Request,
  securityName: string,
  roles?: string[]
): Promise<any> {
  return new Promise((resolve, reject) => {
    if (securityName === "fromSite") {
      const siteSecret = request.headers["site-secret"];
      if (siteSecret && siteSecret === process.env.REACT_APP_SITE_SECRET) resolve(true);
      else reject(new AuthenticationError("Request blocked via API"));
    }

    if (securityName === "fromPostman") {
      const postmanToken = request.headers["postman-secret"];
      if (postmanToken && postmanToken === process.env.POSTMAN_SECRET) resolve(true);
      else reject(new AuthenticationError("Not authorized"));
    }

    if (securityName === "fromCron") {
      const cronToken = request.body?.query?.cronToken;
      if (cronToken && cronToken === process.env.CRON_TOKEN) resolve(true);
      else reject(new AuthenticationError("Not authorized"));
    }


    if (securityName === "jwt") {
      const token = (request.headers["authorization"] || request.headers["x-access-token"]) as string;

      if (!token) {
        reject(new AuthenticationError("No token found"));
      }
      const decoded = jwt.decode(token, process.env.NODE_ENV === "dev" ? config.secret : process.env.SECRET);
      if (!decoded) {
        reject(new AuthenticationError("No user found"));
      }
      UserModel.findById(decoded._id)
        .populate("roles")
        .then((user) => {
          if (!user) reject(new AuthenticationError("No user found"));
          request.userId = user._id;
          request.user = user;

          if (roles.length > 0) {
            if (roles?.includes("admin") && !user.hasRole("Admin")) {
              reject(new AuthenticationError("Not allowed"));
            }
            if (roles?.includes("expert") && (!user.hasRole("ExpertTrad") || !user.hasRole("Admin"))) {
              reject(new AuthenticationError("Not allowed"));
            }
          }

          resolve(true);
        })
        .catch(() => {
          reject(new Error("There was a problem finding the user"));
        });
    }
  });
}
