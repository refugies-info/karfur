import { Request } from "express";
import jwt from "jwt-simple";
import { User, UserModel } from "./typegoose";
import { AuthenticationError, UnauthorizedError } from "./errors";

// type Role = "optional" | "admin" | "expert";

export async function expressAuthentication(request: Request, securityName: string, roles?: string[]): Promise<User | null> {
  const logData: any = { securityName, roles, userId: null };

  if (securityName === "fromSite") {
    const siteSecret = request.headers["site-secret"];
    if (!siteSecret || siteSecret !== process.env.REACT_APP_SITE_SECRET) throw new UnauthorizedError("[authentication] Request blocked via API", undefined, logData);
  }

  if (securityName === "fromPostman") {
    const postmanToken = request.headers["postman-secret"];
    if (!postmanToken && postmanToken !== process.env.POSTMAN_SECRET) throw new UnauthorizedError("[authentication] Must only run from Postman", undefined, logData);
  }

  if (securityName === "fromCron") {
    const cronToken = request.body?.query?.cronToken;
    if (!cronToken && cronToken !== process.env.CRON_TOKEN) throw new UnauthorizedError("[authentication] Must only run from cron", undefined, logData);
  }

  if (securityName === "jwt") {
    const optionalAuthentication = roles?.includes("optional");
    const token = (request.headers["authorization"] || request.headers["x-access-token"]) as string;

    if (!token) {
      if (optionalAuthentication) return null;
      throw new AuthenticationError("[authentication] No token found", undefined, logData);
    }
    const decoded = jwt.decode(token, process.env.SECRET);
    if (!decoded) {
      if (optionalAuthentication) return null;
      throw new AuthenticationError("[authentication] No user found", undefined, logData);
    }

    const user = await UserModel.findById(decoded._id).populate("roles");
    if (!user) throw new AuthenticationError("[authentication] No user found", undefined, logData);
    request.userId = user._id;
    logData.userId = user._id;

    if (roles.length > 0 && !optionalAuthentication) {
      if (roles?.includes("admin") && !user.isAdmin()) {
        throw new UnauthorizedError("[authentication] Must be admin", undefined, logData);
      }
      if (roles?.includes("expert") && !(user.isExpert() || user.isAdmin())) {
        throw new UnauthorizedError("[authentication] Must be expert", undefined, logData);
      }
    }

    return user;
  }
  return null;
}
