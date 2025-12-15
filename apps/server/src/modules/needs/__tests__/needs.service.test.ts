import { getNeedsFromDB } from "../needs.repository";
import { computePossibleNeeds } from "../needs.service";

// Properly type the mock
const mockGetNeedsFromDB = getNeedsFromDB as jest.MockedFunction<typeof getNeedsFromDB>;

jest.mock("../needs.repository", () => ({
  getNeedsFromDB: jest.fn(),
}));

describe("computePossibleNeeds", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const contentThemes = ["id1"];

  it("should return correct value when no need in entry", async () => {
    const actualNeeds: string[] = [];
    const res = await computePossibleNeeds(actualNeeds, contentThemes);
    expect(mockGetNeedsFromDB).toHaveBeenCalledWith();
    expect(res).toEqual([]);
  });

  const allNeeds = [
    { _id: "id1", theme: { _id: "id1" } },
    { _id: "id2", theme: { _id: "id1" } },
    { _id: "id3", theme: { _id: "id2" } },
  ];

  it("should return correct value when all needs are in theme", async () => {
    mockGetNeedsFromDB.mockResolvedValueOnce(
      allNeeds as unknown as ReturnType<typeof getNeedsFromDB>,
    );
    const actualNeeds = ["id1", "id2"];
    const res = await computePossibleNeeds(actualNeeds, contentThemes);
    expect(mockGetNeedsFromDB).toHaveBeenCalledWith();
    expect(res).toEqual(["id1", "id2"]);
  });
});
