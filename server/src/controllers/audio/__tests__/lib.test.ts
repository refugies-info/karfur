// @ts-nocheck
import { set_audio } from "../lib";
import cloudinary from "cloudinary";

jest.mock("cloudinary", () => ({
  uploader: {
    upload: jest.fn().mockResolvedValue({
      resource_type: "resource_type",
      bytes: "bytes",
      type: "type",
      etag: "etag",
      original_filename: "originalFilename",
      public_id: "public_id",
      secure_url: "secure_url",
      signature: "signature",
      url: "url",
      version: "version",
    }),
  },
}));

let save = (audio: any) =>
  jest.fn().mockResolvedValue({ ...audio, _id: "_id" });

jest.mock("../../../schema/schemaAudio", () => ({
  Audio: jest.fn().mockImplementation((audio) => {
    return { save: save(audio) };
  }),
}));

const mockRequest = (data?: any) => ({
  files: data,
  body: !!data,
});

type MockResponse = { json: any; status: any };

const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("function set_audio", () => {
  it("should return 400 status if no body", async () => {
    const req = mockRequest();
    const res = mockResponse();
    await set_audio(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      text: "Requête invalide",
    });
  });

  it("should return 200 status if no body", async () => {
    const req = mockRequest({
      key1: { originalFilename: "originalFilename", path: "path1" },
      key2: { path: "path2" },
    });
    const res = mockResponse();
    await set_audio(req, res);
    expect(cloudinary.uploader.upload).toHaveBeenCalledWith("path1", "", {
      folder: "/audio",
      resource_type: "video",
    });
    expect(cloudinary.uploader.upload).toHaveBeenCalledWith("path2", "", {
      folder: "/audio",
      resource_type: "video",
    });

    expect(res.json).toHaveBeenCalledWith({
      text: "Succès",
      data: {
        audioId: "_id",
        public_id: "public_id",
        secure_url: "secure_url",
      },
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return 401 status if no data", async () => {
    cloudinary.uploader.upload.mockResolvedValueOnce();
    const req = mockRequest({
      key1: { originalFilename: "originalFilename", path: "path1" },
      key2: { path: "path2" },
    });
    const res = mockResponse();
    await set_audio(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      text: "Pas de résultats à l'enregistrement",
    });
  });

  it("should return 500 status if save throws", async () => {
    save = () => jest.fn().mockRejectedValueOnce(new Error("error"));
    const req = mockRequest({
      key1: { originalFilename: "originalFilename", path: "path1" },
      key2: { path: "path2" },
    });
    const res = mockResponse();
    await set_audio(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      text: "Erreur interne",
      error: new Error("error"),
    });
  });
});
