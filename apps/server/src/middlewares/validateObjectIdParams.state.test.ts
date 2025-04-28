import express from "express";
import http from "http";
import mongoose from "mongoose";
import { validateObjectIdParams } from "./validateObjectIdParams";

describe("validateObjectIdParams - state based test", () => {
  let app: express.Express;
  let server: http.Server;
  let port: number;

  beforeAll((done) => {
    app = express();
    app.use(express.json());

    // Test route with {id} parameter
    app.get("/test/:id", validateObjectIdParams, (req, res) => {
      res.status(200).json({ valid: true });
    });

    // Test route with {key} parameter
    app.get("/options/:key", validateObjectIdParams, (req, res) => {
      res.status(200).json({ valid: true });
    });

    // Test route with no relevant parameters
    app.get("/test", validateObjectIdParams, (req, res) => {
      res.status(200).json({ valid: true });
    });

    server = app.listen(0, () => {
      port = (server.address() as any).port;
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  const makeRequest = (path: string): Promise<{ status: number; body: any }> => {
    return new Promise((resolve) => {
      const req = http.get(`http://localhost:${port}${path}`, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () =>
          resolve({
            status: res.statusCode || 500,
            body: data ? JSON.parse(data) : null,
          }),
        );
      });
      req.on("error", () => resolve({ status: 500, body: null }));
    });
  };

  it("should allow request when {id} is valid ObjectId", async () => {
    const validId = new mongoose.Types.ObjectId().toString();
    const { status, body } = await makeRequest(`/test/${validId}`);
    expect(status).toBe(200);
    expect(body).toEqual({ valid: true });
  });

  it("should return 404 when {id} is invalid ObjectId", async () => {
    const { status, body } = await makeRequest("/test/invalid-id");
    expect(status).toBe(404);
    expect(body).toEqual({
      message: "Resource not found due to invalid ID format",
    });
  });

  it("should allow request when {key} is valid ObjectId", async () => {
    const validKey = new mongoose.Types.ObjectId().toString();
    const { status, body } = await makeRequest(`/options/${validKey}`);
    expect(status).toBe(200);
    expect(body).toEqual({ valid: true });
  });

  it("should return 404 when {key} is invalid ObjectId", async () => {
    const { status, body } = await makeRequest("/options/invalid-key");
    expect(status).toBe(404);
    expect(body).toEqual({
      message: "Resource not found due to invalid ID format",
    });
  });

  it("should allow request when no relevant parameters exist", async () => {
    const { status, body } = await makeRequest("/test");
    expect(status).toBe(200);
    expect(body).toEqual({ valid: true });
  });
});
