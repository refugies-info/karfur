import { DispositifModel } from "@refugies-info/mongo";
import * as repository from "~/modules/dispositif/dispositif.repository";
import { fixtures } from "../../../__fixtures__";
import * as log from "./log";
import { updateDispositifTagsOrNeeds } from "./updateDispositifTagsOrNeeds";

jest.mock("airtable");
jest.mock("@sendgrid/mail");

const id = "5ce7b52d83983700167bca27";

describe("updateDispositifTagsOrNeeds", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(log, "log").mockResolvedValue();
  });

  it.each([
    [true, 2],
    [false, 1],
  ])("with hasDraftVersion %s, updates %i version(s)", async (hasDraftVersion, updates) => {
    const published = new DispositifModel(fixtures.dispositif);
    published.hasDraftVersion = hasDraftVersion;
    jest.spyOn(repository, "getDispositifById").mockResolvedValue(published);
    const getDraftDispositifByIdMock = jest
      .spyOn(repository, "getDraftDispositifById")
      .mockResolvedValue(new DispositifModel(fixtures.dispositif));
    const updateDispositifInDBMock = jest
      .spyOn(repository, "updateDispositifInDB")
      .mockResolvedValue(published);

    await updateDispositifTagsOrNeeds(id, {}, fixtures.user);

    expect(getDraftDispositifByIdMock).toHaveBeenCalledTimes(hasDraftVersion ? 1 : 0);
    expect(updateDispositifInDBMock).toHaveBeenCalledTimes(updates);
    expect(updateDispositifInDBMock).toHaveBeenLastCalledWith(id, expect.any(Object), false);
  });
});
