Object.defineProperty(exports, "__esModule", { value: true });
exports.LangueModel = exports.LangueZodSchema = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
exports.LangueZodSchema = zod_1.z.object({
  langueFr: zod_1.z.string(),
  langueLoc: zod_1.z.string().optional(),
  langueCode: zod_1.z.string().optional(),
  i18nCode: zod_1.z.enum(["fr", "en", "uk", "ti", "ar", "ps", "ru", "fa"]),
  avancement: zod_1.z.number().default(0),
  avancementTrad: zod_1.z.number().default(0),
  created_at: zod_1.z.date().optional(),
  updatedAt: zod_1.z.date().optional(),
});
const LangueSchema = new mongoose_1.Schema(
  {
    langueFr: { type: String, required: true, unique: true },
    langueLoc: { type: String },
    langueCode: { type: String },
    i18nCode: { type: String, required: true, unique: true },
    avancement: { type: Number, default: 0 },
    avancementTrad: { type: Number, default: 0 },
  },
  {
    collection: "langues",
    timestamps: { createdAt: "created_at" },
  },
);
exports.LangueModel = (0, mongoose_1.model)("Langue", LangueSchema);
