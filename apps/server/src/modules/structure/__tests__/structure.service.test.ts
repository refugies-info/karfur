import { getStructureFromDB } from "../structure.repository";
import { getStructureMembers } from "../structure.service";

jest.mock("../structure.repository", () => ({
  getStructureFromDB: jest.fn(),
}));
jest.mock("~/logger");

describe("getStructureMembers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return no member without querying the db when there is no structure id", async () => {
    const membres = await getStructureMembers(undefined);

    expect(membres).toEqual([]);
    expect(getStructureFromDB).not.toHaveBeenCalled();
  });
});
