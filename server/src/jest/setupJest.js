jest.mock("../schema/schemaUser", () => ({
  USER_STATUS_ACTIVE: "Actif",
  USER_STATUS_DELETED: "Exclu",
  User: {
    find: jest.fn(),
    findOne: jest.fn()
  }
}));
