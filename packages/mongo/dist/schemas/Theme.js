Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeModel = exports.ThemeZodSchemaFinal = exports.ThemeZodSchema = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
const generics_1 = require("./generics");
const ThemeColorsZodSchema = zod_1.z.object({
  color100: zod_1.z.string(),
  color80: zod_1.z.string(),
  color60: zod_1.z.string(),
  color40: zod_1.z.string(),
  color30: zod_1.z.string(),
});
const ThemeGradientColorsZodSchema = zod_1.z.object({
  colorTop: zod_1.z.string(),
  colorBottom: zod_1.z.string(),
});
exports.ThemeZodSchema = zod_1.z.object({
  name: zod_1.z.record(zod_1.z.string()),
  short: zod_1.z.record(zod_1.z.string()),
  mainColor: zod_1.z.string(),
  colors: ThemeColorsZodSchema,
  gradientColors: ThemeGradientColorsZodSchema,
  position: zod_1.z.number().int().nonnegative(),
  icon: generics_1.ImageSchema.obj ? zod_1.z.any() : zod_1.z.any(),
  banner: generics_1.ImageSchema.obj ? zod_1.z.any() : zod_1.z.any(),
  appBanner: generics_1.ImageSchema.obj ? zod_1.z.any() : zod_1.z.any(),
  appImage: generics_1.ImageSchema.obj ? zod_1.z.any() : zod_1.z.any(),
  shareImage: generics_1.ImageSchema.obj ? zod_1.z.any() : zod_1.z.any(),
  dispositifImage: generics_1.ImageSchema.obj ? zod_1.z.any() : zod_1.z.any(),
  demarcheImage: generics_1.ImageSchema.obj ? zod_1.z.any() : zod_1.z.any(),
  notificationEmoji: zod_1.z.string(),
  adminComments: zod_1.z.string().optional(),
});
const generics_2 = require("./generics");
exports.ThemeZodSchemaFinal = zod_1.z.object({
  name: zod_1.z.record(zod_1.z.string()),
  short: zod_1.z.record(zod_1.z.string()),
  mainColor: zod_1.z.string(),
  colors: ThemeColorsZodSchema,
  gradientColors: ThemeGradientColorsZodSchema,
  position: zod_1.z.number().int().nonnegative(),
  icon: generics_2.ImageZodSchema.optional(),
  banner: generics_2.ImageZodSchema.optional(),
  appBanner: generics_2.ImageZodSchema.optional(),
  appImage: generics_2.ImageZodSchema.optional(),
  shareImage: generics_2.ImageZodSchema.optional(),
  dispositifImage: generics_2.ImageZodSchema.optional(),
  demarcheImage: generics_2.ImageZodSchema.optional(),
  notificationEmoji: zod_1.z.string(),
  adminComments: zod_1.z.string().optional(),
  created_at: zod_1.z.date().optional(),
  updatedAt: zod_1.z.date().optional(),
});
const ThemeSchema = new mongoose_1.Schema(
  {
    name: { type: Map, of: String },
    short: { type: Map, of: String },
    mainColor: { type: String },
    colors: {
      color100: String,
      color80: String,
      color60: String,
      color40: String,
      color30: String,
    },
    gradientColors: {
      colorTop: String,
      colorBottom: String,
    },
    position: {
      type: Number,
      validate: {
        validator: (v) => Number.isInteger(v) && v >= 0,
        message: "position must be an positive integer",
      },
      required: true,
    },
    icon: { type: generics_1.ImageSchema, _id: false },
    banner: { type: generics_1.ImageSchema, _id: false },
    appBanner: { type: generics_1.ImageSchema, _id: false },
    appImage: { type: generics_1.ImageSchema, _id: false },
    shareImage: { type: generics_1.ImageSchema, _id: false },
    dispositifImage: { type: generics_1.ImageSchema, _id: false },
    demarcheImage: { type: generics_1.ImageSchema, _id: false },
    notificationEmoji: { type: String },
    adminComments: { type: String },
  },
  {
    collection: "themes",
    timestamps: { createdAt: "created_at" },
  },
);
ThemeSchema.methods.isActive = function (activeLanguages) {
  for (const ln of activeLanguages) {
    if (!this.name?.[ln.i18nCode] || !this.short?.[ln.i18nCode]) return false;
  }
  if (
    !this.colors?.color100 ||
    !this.colors?.color80 ||
    !this.colors?.color60 ||
    !this.colors?.color40 ||
    !this.colors?.color30 ||
    !this.icon?.secure_url ||
    !this.banner?.secure_url ||
    !this.appImage?.secure_url ||
    !this.shareImage?.secure_url ||
    !this.dispositifImage?.secure_url ||
    !this.demarcheImage?.secure_url ||
    !this.notificationEmoji
  ) {
    return false;
  }
  return true;
};
exports.ThemeModel = (0, mongoose_1.model)("Theme", ThemeSchema);
