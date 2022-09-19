// @ts-nocheck
import addView from "./addView";
import { getNeedFromDB, saveNeedInDB } from "../../../modules/needs/needs.repository";

jest.mock("../../../modules/needs/needs.repository", () => ({
  getNeedFromDB: jest.fn(),
  saveNeedInDB: jest.fn(),
}));

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("addView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const res = mockResponse();

  it("should return 400 if no need found", async () => {
    const req = {
      body: {id: "needId"}
    };
    getNeedFromDB.mockImplementationOnce(() => {
      return null
    });
    await addView[1](req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
  it("should return 200 and increment views", async () => {
    const req = {
      body: {id: "needId"}
    };
    getNeedFromDB.mockImplementationOnce(() => {
      return {_id:"needId", nbVues: 4}
    });
    await addView[1](req, res);
    expect(saveNeedInDB).toHaveBeenCalledWith("needId", {nbVues: 5});
    expect(res.status).toHaveBeenCalledWith(200);
  });
  it("should return 200 and increment views if no nbVues", async () => {
    const req = {
      body: {id: "needId"}
    };
    getNeedFromDB.mockImplementationOnce(() => {
      return {_id:"needId"}
    });
    await addView[1](req, res);
    expect(saveNeedInDB).toHaveBeenCalledWith("needId", {nbVues: 1});
    expect(res.status).toHaveBeenCalledWith(200);
  });

});
