import { register } from "../register";
import passwdCheck from "zxcvbn";

// jest.mock("zxcvbn", () => {
//   return {
//     default: jest.fn(),
//   };
// });

describe("register", () => {
  const user = { username: "username", password: "password" };
  const userRole = { nom: "User", _id: "id_user" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should if password too weak", async () => {
    try {
      await register(user, userRole);
    } catch (error) {
      expect(error.message).toEqual("PASSWORD_TOO_WEAK");
      expect.assertions(1);
    }
  });
});
