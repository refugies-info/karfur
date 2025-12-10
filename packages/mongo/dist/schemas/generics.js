Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageSchema = exports.ImageZodSchema = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
exports.ImageZodSchema = zod_1.z.object({
  secure_url: zod_1.z.string(),
  public_id: zod_1.z.string().nullable(),
  imgId: zod_1.z.string().nullable(),
});
exports.ImageSchema = new mongoose_1.Schema(
  {
    secure_url: { type: String, required: true },
    public_id: { type: String },
    imgId: { type: String },
  },
  { _id: false },
);
