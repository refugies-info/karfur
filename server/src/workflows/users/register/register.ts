import logger from "../../../logger";
import { ResponseWithData } from "../../../types/interface";
// import { getRoleByName } from "../../../modules/role/role.repository";
// import { register } from "../../../modules/users/register";
import { LoginResponse, RegisterRequest } from "@refugies-info/api-types";
// import { loginExceptionsManager } from "../../../modules/users/auth";

export const register = async (body: RegisterRequest): ResponseWithData<LoginResponse> => {
  logger.info("[Register] register user", { body }); // TODO: remove body

  /* try { */
  return {
    text: "success",
    data: { token: "" }
  };
  /*  } catch (error) {
     loginExceptionsManager(error);
   } */
};
