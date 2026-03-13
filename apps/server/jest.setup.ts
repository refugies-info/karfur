// jest.setup.ts
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import path from "path";

let mongoServer: MongoMemoryServer;

// Resolve @refugies-info/mongo's mongoose instance. In the monorepo, pnpm may
// hoist different versions for apps/server and packages/mongo, creating two
// separate mongoose singletons. We must connect BOTH to the in-memory DB so
// that models from @refugies-info/mongo can access the same database.
//
// IMPORTANT: We use require.resolve() instead of a top-level import from
// @refugies-info/mongo to avoid triggering schema registration (which loads
// password-hash, etc.) before jest.mock() in test files has run.
const mongoPackagePath = path.dirname(require.resolve("@refugies-info/mongo/package.json"));
const mongoMongoosePath = require.resolve("mongoose", {
  paths: [mongoPackagePath],
});
// eslint-disable-next-line @typescript-eslint/no-require-imports
const mongoMongoose = require(mongoMongoosePath);
const hasDualInstances = mongoMongoose !== mongoose;

// Increase the timeout for the beforeAll hook to allow time for downloading MongoDB binaries
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Connect Typegoose (which uses Mongoose under the hood) to the in-memory MongoDB
  await mongoose.connect(uri);

  // Connect @refugies-info/mongo's mongoose if it resolved to a different instance
  if (hasDualInstances) {
    await mongoMongoose.connect(uri);
  }
}, 60000); // 60 seconds timeout

afterAll(async () => {
  await mongoose.disconnect();
  if (hasDualInstances) {
    await mongoMongoose.disconnect();
  }
  await mongoServer.stop();
});
