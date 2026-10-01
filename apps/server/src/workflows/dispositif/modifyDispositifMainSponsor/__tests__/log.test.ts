import type { Dispositif } from "@refugies-info/mongo";
import { ObjectId } from "@refugies-info/mongo";
import { addLog } from "~/modules/logs/logs.service";
import { log } from "../log";

jest.mock("~/modules/logs/logs.service", () => ({
  addLog: jest.fn(),
}));
jest.mock("~/logger");

const dispositifId = new ObjectId("6569af9815c38bd134125ff3");
const authorId = new ObjectId("6569af9815c38bd134125ff5");
const sponsorId = "6569af9815c38bd134125ff4";

describe("modifyDispositifMainSponsor log", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not log a sponsor change when the ObjectId matches the string id", async () => {
    const oldDispositif = { mainSponsor: new ObjectId(sponsorId) } as Dispositif;
    await log(oldDispositif, dispositifId, sponsorId, authorId);

    expect(addLog).toHaveBeenCalledTimes(1);
    expect(addLog).toHaveBeenCalledWith(
      dispositifId,
      "Dispositif",
      expect.any(String),
      expect.any(Object),
    );
  });

  it("should log on both structures when the sponsor changes", async () => {
    const oldDispositif = { mainSponsor: new ObjectId("6569af9815c38bd134125ff6") } as Dispositif;
    await log(oldDispositif, dispositifId, sponsorId, authorId);

    expect(addLog).toHaveBeenCalledTimes(3);
  });
});
