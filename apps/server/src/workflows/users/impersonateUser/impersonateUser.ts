import type { ImpersonateResponse } from "@refugies-info/api-types";
import { UserModel } from "@refugies-info/mongo";
import logger from "~/logger";

export const impersonateUser = async (
  adminId: string,
  targetUserId: string,
): Promise<ImpersonateResponse> => {
  logger.info("[impersonateUser] admin impersonating user", {
    adminId,
    targetUserId,
  });

  const user = await UserModel.findById(targetUserId).populate("roles");
  if (!user) throw new Error("USER_NOT_FOUND");

  if (user.status !== "Actif") throw new Error("USER_NOT_ACTIVE");

  const isTargetAdmin = (user.roles as any[])?.some((r) => r.nom === "Admin");
  if (isTargetAdmin) throw new Error("CANNOT_IMPERSONATE_ADMIN");

  const token = user.getToken();

  logger.info("[impersonateUser] impersonation token generated", {
    adminId,
    targetUserId,
    targetUsername: user.username || user.email,
  });

  return { token };
};
