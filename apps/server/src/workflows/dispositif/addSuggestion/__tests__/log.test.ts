import type { Dispositif } from "@refugies-info/mongo";
import { ObjectId } from "@refugies-info/mongo";
import { addLog } from "~/modules/logs/logs.service";
import { log } from "../log";

jest.mock("~/modules/logs/logs.service", () => ({
  addLog: jest.fn(),
}));

const dispositifId = new ObjectId("6569af9815c38bd134125ff3");

describe("addSuggestion log", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not throw when the dispositif has no main sponsor", async () => {
    await log({} as Dispositif, dispositifId);

    expect(addLog).toHaveBeenCalledTimes(1);
    expect(addLog).toHaveBeenCalledWith(
      dispositifId,
      "Dispositif",
      expect.any(String),
      expect.any(Object),
    );
  });

  it("should log on the main sponsor structure", async () => {
    const mainSponsor = new ObjectId("6569af9815c38bd134125ff4");
    await log({ mainSponsor } as Dispositif, dispositifId);

    expect(addLog).toHaveBeenCalledTimes(2);
    expect(addLog).toHaveBeenLastCalledWith(
      mainSponsor.toString(),
      "Structure",
      expect.any(String),
      expect.any(Object),
    );
  });
});
