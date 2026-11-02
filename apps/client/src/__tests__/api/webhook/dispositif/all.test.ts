import * as webhookUtils from "../../../../lib/webhookUtils";
import allHandler from "../../../../pages/api/webhook/dispositif/all";

jest.mock("../../../../lib/webhookUtils");

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockRequest = (query = {}) => ({ method: "GET", headers: {}, query }) as any;

const objectId = (char: string) => char.repeat(24);

const chainable = (result: unknown) => {
  const chain: any = {};
  for (const method of ["sort", "limit", "select"])
    chain[method] = jest.fn().mockReturnValue(chain);
  chain.lean = jest.fn().mockResolvedValue(result);
  return chain;
};

describe("GET /api/webhook/dispositif/all", () => {
  const Dispositif = { find: jest.fn() };

  beforeEach(() => {
    jest.resetAllMocks();
    (webhookUtils.authorizeWebhookRequest as jest.Mock).mockReturnValue(true);
    (webhookUtils.getWebhookModels as jest.Mock).mockResolvedValue({ Dispositif });
    (webhookUtils.formatZodErrors as jest.Mock).mockImplementation((error) =>
      error.issues.map((issue: any) => ({ key: issue.path.join("."), message: issue.message })),
    );
  });

  it("stops when the request is not authorized", async () => {
    (webhookUtils.authorizeWebhookRequest as jest.Mock).mockReturnValue(false);

    await allHandler(mockRequest(), mockResponse());

    expect(Dispositif.find).not.toHaveBeenCalled();
  });

  it.each([
    ["an invalid cursor", { cursor: "nope" }],
    ["a limit of 0", { limit: "0" }],
    ["a limit over the maximum", { limit: "201" }],
    ["a limit that is not a number", { limit: "abc" }],
  ])("rejects %s", async (_label, query) => {
    const res = mockResponse();

    await allHandler(mockRequest(query), res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(Dispositif.find).not.toHaveBeenCalled();
  });

  it("returns the first page without any status filter", async () => {
    const chain = chainable([{ _id: objectId("1") }, { _id: objectId("2") }]);
    Dispositif.find.mockReturnValue(chain);
    const res = mockResponse();

    await allHandler(mockRequest(), res);

    expect(Dispositif.find).toHaveBeenCalledWith({});
    expect(chain.sort).toHaveBeenCalledWith({ _id: 1 });
    expect(chain.limit).toHaveBeenCalledWith(51);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      items: [{ _id: objectId("1") }, { _id: objectId("2") }],
      nextCursor: null,
    });
  });

  it("resumes after the cursor", async () => {
    Dispositif.find.mockReturnValue(chainable([]));

    await allHandler(mockRequest({ cursor: objectId("a") }), mockResponse());

    expect(Dispositif.find).toHaveBeenCalledWith({ _id: { $gt: objectId("a") } });
  });

  it("gives the cursor of the next page when there are more items than the limit", async () => {
    const chain = chainable([
      { _id: objectId("1") },
      { _id: objectId("2") },
      { _id: objectId("3") },
    ]);
    Dispositif.find.mockReturnValue(chain);
    const res = mockResponse();

    await allHandler(mockRequest({ limit: "2" }), res);

    expect(chain.limit).toHaveBeenCalledWith(3);
    expect(res.json).toHaveBeenCalledWith({
      items: [{ _id: objectId("1") }, { _id: objectId("2") }],
      nextCursor: objectId("2"),
    });
  });

  it("has no next page when the last page is exactly full", async () => {
    Dispositif.find.mockReturnValue(chainable([{ _id: objectId("1") }, { _id: objectId("2") }]));
    const res = mockResponse();

    await allHandler(mockRequest({ limit: "2" }), res);

    expect(res.json.mock.calls[0][0].nextCursor).toBeNull();
  });
});
