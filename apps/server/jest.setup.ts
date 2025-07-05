// jest.setup.ts
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongoServer: MongoMemoryServer;

// Increase the timeout for the beforeAll hook to allow time for downloading MongoDB binaries
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Connect Typegoose (which uses Mongoose under the hood) to the in-memory MongoDB
  await mongoose.connect(uri, {
    //@ts-expect-error useNewUrlParser is not used in regular Mongoose
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}, 60000); // 60 seconds timeout

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
