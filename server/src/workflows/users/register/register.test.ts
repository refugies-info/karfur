import { register } from "./register";
import { RoleName } from "@refugies-info/api-types";
import { loginExceptionsManager } from "../../../modules/users/auth";
import * as password from "../../../libs/validatePassword";
import { addToNewsletter } from "../../../connectors/sendinblue/addToNewsletter";
import { registerUser } from "../../../modules/users/users.service";
import { user } from "../../../__fixtures__";
import { User, UserModel } from "../../../typegoose";
import { LoginErrorType } from "../../../modules/users/LoginError";

jest.spyOn(User.prototype, 'getToken').mockImplementation(() => "token");

jest.mock("password-hash", () => ({
  generate: jest.fn(p => p)
}));
jest.mock("../../../modules/users/auth", () => ({
  loginExceptionsManager: jest.fn()
}))
jest.mock("../../../connectors/sendinblue/addToNewsletter", () => ({
  addToNewsletter: jest.fn()
}))
jest.mock("../../../modules/users/users.service", () => ({
  registerUser: jest.fn(() => user)
}))

describe("register", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date(2023, 0, 1));
  });


  it("should create user", async () => {
    const isPasswordOkMock = jest.spyOn(password, 'isPasswordOk').mockReturnValue(true);

    const res = await register({ email: "test@example.com", password: "password" });
    expect(isPasswordOkMock).toHaveBeenCalledWith("password");
    expect(registerUser).toHaveBeenCalledWith({
      email: "test@example.com",
      firstName: undefined,
      role: undefined,
      hashedPassword: "password"
    });
    expect(addToNewsletter).not.toHaveBeenCalled();
    expect(loginExceptionsManager).not.toHaveBeenCalled();
    expect(res).toStrictEqual({ token: "token" })
  });

  it("should create user and add informations", async () => {
    const isPasswordOkMock = jest.spyOn(password, 'isPasswordOk').mockReturnValue(true);

    const res = await register({ email: "test@example.com", password: "password", subscribeNewsletter: true, firstName: "Test", role: RoleName.TRAD });
    expect(isPasswordOkMock).toHaveBeenCalledWith("password");
    expect(registerUser).toHaveBeenCalledWith({
      email: "test@example.com",
      firstName: "Test", role: RoleName.TRAD,
      hashedPassword: "password"
    });
    expect(addToNewsletter).toHaveBeenCalledWith("test@example.com");
    expect(loginExceptionsManager).not.toHaveBeenCalled();
    expect(res).toStrictEqual({ token: "token" })
  });

  it("should reject if password to weak", async () => {
    const isPasswordOkMock = jest.spyOn(password, 'isPasswordOk').mockReturnValue(false);
    try {
      await register({ email: "test@example.com", password: "password", subscribeNewsletter: true, firstName: "Test", role: RoleName.TRAD });
      expect(isPasswordOkMock).toHaveBeenCalledWith("password");
      expect(registerUser).not.toHaveBeenCalledWith();
      expect(addToNewsletter).not.toHaveBeenCalled();
      expect(loginExceptionsManager).toHaveBeenCalledWith(new Error(LoginErrorType.PASSWORD_TOO_WEAK));
    } catch (e) { }
    expect.assertions(4);
  });


  afterEach(() => {
    jest.useRealTimers();
  });
});
