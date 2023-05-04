import { Request } from "express";
import jwt from "jwt-simple";
import { User, UserModel } from "./typegoose";
import { AuthenticationError } from "./errors";

// type Role = "optional" | "admin" | "expert";

export async function expressAuthentication(request: Request, securityName: string, roles?: string[]): Promise<User | null> {
  if (securityName === "fromSite") {
    const siteSecret = request.headers["site-secret"];
    if (!siteSecret || siteSecret !== process.env.REACT_APP_SITE_SECRET) throw new AuthenticationError("Request blocked via API");
  }

  if (securityName === "fromPostman") {
    const postmanToken = request.headers["postman-secret"];
    if (!postmanToken && postmanToken !== process.env.POSTMAN_SECRET) throw new AuthenticationError("Not authorized");
  }

  if (securityName === "fromCron") {
    const cronToken = request.body?.query?.cronToken;
    if (!cronToken && cronToken !== process.env.CRON_TOKEN) throw new AuthenticationError("Not authorized");
  }

  if (securityName === "jwt") {
    const optionalAuthentication = roles?.includes("optional");
    const token = (request.headers["authorization"] || request.headers["x-access-token"]) as string;

    if (!token) {
      if (optionalAuthentication) return null;
      throw new AuthenticationError("No token found");
    }
    const decoded = jwt.decode(token, process.env.SECRET);
    if (!decoded) {
      if (optionalAuthentication) return null;
      throw new AuthenticationError("No user found");
    }
    try {
      const user = await UserModel.findById(decoded._id).populate("roles");
      if (!user) throw new AuthenticationError("No user found");
      request.userId = user._id;

      if (roles.length > 0 && !optionalAuthentication) {
        if (roles?.includes("admin") && !user.isAdmin()) {
          throw new AuthenticationError("Not allowed");
        }
        if (roles?.includes("expert") && (!user.isExpert() || !user.isAdmin())) {
          throw new AuthenticationError("Not allowed");
        }
      }

      return user;
    } catch (e) {
      throw new Error("There was a problem finding the user");
    }
  }
  return null;
}
