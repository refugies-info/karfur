import type express from "express";
import { NotFoundError } from "~/errors";
import { modifyDispositifMainSponsor } from "~/workflows";
import { DispositifController } from "../dispositifController";

jest.mock("../../logger");
jest.mock("~/workflows", () => ({
  ...jest.requireActual("~/workflows"),
  modifyDispositifMainSponsor: jest.fn(),
}));

const dispositifId = "6569af9815c38bd134125ff3";
const request = { userId: "6569af9815c38bd134125ff5" } as unknown as express.Request;

describe("DispositifController.updateMainSponsor", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("rejects an empty sponsor id", async () => {
    const controller = new DispositifController();

    await expect(
      controller.updateMainSponsor(dispositifId, { sponsorId: "" }, request),
    ).rejects.toThrow(NotFoundError);
    expect(modifyDispositifMainSponsor).not.toHaveBeenCalled();
  });

  it("modifies the main sponsor with a valid sponsor id", async () => {
    const controller = new DispositifController();
    const body = { sponsorId: "6569af9815c38bd134125ff4" };

    await controller.updateMainSponsor(dispositifId, body, request);

    expect(modifyDispositifMainSponsor).toHaveBeenCalledWith(dispositifId, body, request.userId);
  });
});
