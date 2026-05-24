import { RoleName, UserStatus } from "@refugies-info/api-types";
import { zId, zodSchema } from "@zodyac/zod-mongoose";
import jwt from "jwt-simple";
import { type Document, type Model, model, models, type Schema, type Types } from "mongoose";
import passwordHash from "password-hash";
import { z } from "zod";
import { type ImageType, ImageZodSchema } from "./generics";
import type { Langue } from "./Langue";
import type { Role } from "./Role";

// Zod Schemas
export const FavoriteZodSchema = z.object({
  dispositifId: zId("Dispositif"),
  created_at: z.date().default(() => new Date()),
});

// --- Mongoose-compatible schema (relaxed for zod-mongoose limitations) ---
export const UserZodSchema = z.object({
  username: z.string().optional(),
  password: z.string().nullable().optional(),
  email: z.string().email(),
  firstName: z.string().optional(),
  phone: z.string().optional(),
  description: z.string().optional(),
  // PATCHED: Nested optional with required fields causes validation issues
  picture: z.any().optional(),
  roles: z.array(zId("Role")).optional(),
  selectedLanguages: z.array(zId("Langue")).optional(),
  contributions: z.array(zId("Dispositif")).optional(),
  status: z.enum(Object.values(UserStatus) as [string, ...string[]]).optional() as z.ZodType<
    UserStatus | undefined
  >,
  favorites: z.array(FavoriteZodSchema).optional(),
  structures: z.array(zId("Structure")).optional(),
  last_connected: z.date().optional(),
  authy_id: z.string().optional(),
  reset_password_token: z.string().optional(),
  reset_password_expires: z.date().optional(),
  adminComments: z.string().optional(),
  partner: z.string().optional(),
  departments: z.array(z.string()).optional(),
  created_at: z.date().optional(),
  mfaCode: z.string().optional(),
});

export type UserType = z.infer<typeof UserZodSchema>;

export interface Favorite {
  dispositifId: Types.ObjectId;
  created_at: Date;
}

// --- Strict TypeScript type for User ---
type UserBase = z.infer<typeof UserZodSchema>;

// Patched type with correct strict types for relaxed fields
export type User = Omit<UserBase, "picture"> & {
  picture?: ImageType | null;
} & Document<Types.ObjectId> & {
    // Methods
    authenticate(password: string): boolean;
    getToken(): string;
    hasRole(roleName: RoleName): boolean;
    isAdmin(): boolean;
    isExpert(): boolean;
    getPlateformeRoles(): RoleName[];
    getStructures(): Types.ObjectId[];
    getSelectedLanguages(): Langue[];
    getSelectedLanguagesButFrench(): Langue[];
  };

/**
 * UserId represents a unique identifier for a User.
 *
 * Rationale for `| string` union:
 * 1. **API Compatibility**: IDs received from frontend/API (URL params, JSON bodies) are strings.
 * 2. **Flexibility**: Allows service functions to accept raw strings without forcing immediate `new ObjectId()` casting at the controller layer.
 * 3. **Note**: The Mongoose `User` document strictly uses `Types.ObjectId` for its `_id` field.
 */
export type UserId = Types.ObjectId | string;

const UserMongooseSchema = zodSchema(UserZodSchema);
UserMongooseSchema.set("collection", "users");
UserMongooseSchema.set("timestamps", { createdAt: "created_at" });

// Configure subdocuments
const picturePath = UserMongooseSchema.path("picture") as any;
if (picturePath && picturePath.schema) picturePath.schema.set("_id", false);

// Methods
UserMongooseSchema.methods.authenticate = function (password: string) {
  return this.password && passwordHash.verify(password, this.password);
};

UserMongooseSchema.methods.getToken = function () {
  if (!process.env.SECRET) throw new Error("You need to setup a SECRET envvar for jwt");
  return jwt.encode(
    {
      _id: this._id,
      username: this.username,
      password: this.password,
      email: this.email,
    },
    process.env.SECRET,
  );
};

UserMongooseSchema.methods.hasRole = function (roleName: RoleName): boolean {
  return Array.isArray(this.roles) && this.roles.some((role: any) => role.nom === roleName);
};

UserMongooseSchema.methods.isAdmin = function (): boolean {
  return this.hasRole(RoleName.ADMIN);
};

UserMongooseSchema.methods.isExpert = function (): boolean {
  return this.hasRole(RoleName.EXPERT_TRAD);
};

UserMongooseSchema.methods.getPlateformeRoles = function (): RoleName[] {
  if (!this.roles || this.roles.length === 0) return [];
  if (this.roles.length > 0 && !this.roles[0].nom) {
    throw new Error("roles must be populated");
  }
  return (this.roles as Role[])
    .filter((role) => role.nom === RoleName.ADMIN || role.nom === RoleName.EXPERT_TRAD)
    .map((role) => role.nom);
};

UserMongooseSchema.methods.getStructures = function (): Types.ObjectId[] {
  if (!this.structures) return [];
  return this.structures;
};

UserMongooseSchema.methods.getSelectedLanguages = function (): Langue[] {
  if (!this.selectedLanguages) return [];
  if (this.selectedLanguages.length > 0 && !(this.selectedLanguages[0] as any).i18nCode) {
    throw new Error("selectedLanguages must be populated");
  }
  return this.selectedLanguages as Langue[];
};

UserMongooseSchema.methods.getSelectedLanguagesButFrench = function (): Langue[] {
  const langs = this.getSelectedLanguages();
  return langs.filter((l: Langue) => l.langueCode !== "fr");
};

// HMR-safe: use existing model if already compiled (Next.js dev mode)
export const UserModel = (models.User ||
  model("User", UserMongooseSchema as unknown as Schema<User>)) as Model<User>;
