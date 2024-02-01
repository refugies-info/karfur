export enum LoginErrorType {
  INVALID_REQUEST = "INVALID_REQUEST",
  INVALID_PASSWORD = "INVALID_PASSWORD",
  USED_PASSWORD = "USED_PASSWORD",
  PASSWORD_TOO_WEAK = "PASSWORD_TOO_WEAK",
  WRONG_CODE = "WRONG_CODE",
  ERROR_WHILE_SENDING_CODE = "ERROR_WHILE_SENDING_CODE",
  NO_CONTACT = "NO_CONTACT",
  NO_CODE_SUPPLIED = "NO_CODE_SUPPLIED",
  USER_DELETED = "USER_DELETED",
  ADMIN_FORBIDDEN = "ADMIN_FORBIDDEN",
  NO_EMAIL = "NO_EMAIL",
  NO_ACCOUNT = "NO_ACCOUNT",
  USER_NOT_EXISTS = "USER_NOT_EXISTS",
  SSO_URL = "SSO_URL",
}

class LoginError extends Error {
  data: any;

  constructor(message: LoginErrorType, data?: any) {
    super(message)
    this.data = data || {};
  }
}

export default LoginError;
