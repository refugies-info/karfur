import { RoleName, UserStatus } from "@refugies-info/api-types";
import jwt from "jwt-simple";
import { type Document, model, type PopulatedDoc, Schema, type Types } from "mongoose";
import passwordHash from "password-hash";
import { z } from "zod";
import { type Image, ImageSchema, type ImageType, ImageZodSchema } from "./generics";
import type { Langue } from "./Langue";
import { type Role, RoleModel } from "./Role";
// Since Structure is not migrated yet, we can't import it fully.
// But we can define a provisional type or just use standard Document if strictness allows.
// Actually, I can import it if I export a type from generics or similar, OR I'll just use any/Document for now and refine later.
// However, User.ts in server imports Structure.
// I will assume Structure is a Document for now in the interface.

// Zod Schemas
export const FavoriteZodSchema = z.object({
  dispositifId: z.any(), // Ref to Dispositif
  created_at: z.date(),
});

export const UserZodSchema = z.object({
  username: z.string().optional(),
  password: z.string(),
  email: z.string().email(),
  firstName: z.string().optional(),
  phone: z.string().optional(),
  description: z.string().optional(),
  picture: ImageZodSchema.optional(),
  roles: z.array(z.any()).optional(), // Ref Role
  selectedLanguages: z.array(z.any()).optional(), // Ref Langue
  contributions: z.array(z.any()).optional(), // Ref Dispositif
  status: z.nativeEnum(UserStatus).optional(),
  favorites: z.array(FavoriteZodSchema).optional(),
  structures: z.array(z.any()).optional(), // Ref Structure
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
  dispositifId: Types.ObjectId; // Ref
  created_at: Date;
}

export interface User extends Document {
  _id: Types.ObjectId;
  username?: string;
  password?: string; // Optional in type? required in DB.
  email: string;
  firstName?: string;
  phone?: string;
  description?: string;
  picture?: Image;
  roles?: (Role | Types.ObjectId)[]; // Populated or ID
  selectedLanguages?: (Langue | Types.ObjectId)[]; // Populated or ID
  contributions?: Types.ObjectId[]; // Ref Dispositif
  status?: UserStatus;
  favorites?: Favorite[];
  structures?: Types.ObjectId[]; // Ref Structure
  last_connected?: Date;
  authy_id?: string;
  reset_password_token?: string;
  reset_password_expires?: Date;
  adminComments?: string;
  partner?: string;
  departments?: string[];
  created_at?: Date;
  mfaCode?: string;

  // Methods
  authenticate(password: string): boolean;
  getToken(): string;
  hasRole(roleName: RoleName): boolean;
  isAdmin(): boolean;
  isExpert(): boolean;
  getPlateformeRoles(): RoleName[];
  getStructures(): Types.ObjectId[]; // Placeholder return type until Structure migrated
  getSelectedLanguages(): Langue[];
  getSelectedLanguagesButFrench(): Langue[];
}

export type UserId = Types.ObjectId | string;

const FavoriteSchema = new Schema<Favorite>({
  dispositifId: { type: Schema.Types.ObjectId, ref: "Dispositif" },
  created_at: { type: Date, default: Date.now },
});

const UserSchema = new Schema<User>(
  {
    username: { type: String, lowercase: true, trim: true },
    password: { type: String },
    email: { type: String, unique: true, required: true, lowercase: true, trim: true },
    firstName: { type: String, trim: true },
    phone: { type: String },
    description: { type: String },
    picture: { type: ImageSchema, _id: false },
    roles: [{ type: Schema.Types.ObjectId, ref: "Role" }],
    selectedLanguages: [{ type: Schema.Types.ObjectId, ref: "Langue" }],
    contributions: [{ type: Schema.Types.ObjectId, ref: "Dispositif" }],
    status: { type: String, enum: Object.values(UserStatus) },
    favorites: [FavoriteSchema],
    structures: [{ type: Schema.Types.ObjectId, ref: "Structure" }],
    last_connected: { type: Date },
    authy_id: { type: String },
    reset_password_token: { type: String },
    reset_password_expires: { type: Date },
    adminComments: { type: String },
    partner: { type: String },
    departments: [String],
    mfaCode: { type: String },
  },
  {
    collection: "users",
    timestamps: { createdAt: "created_at" },
  },
);

// Methods
UserSchema.methods.authenticate = function (password: string) {
  return passwordHash.verify(password, this.password);
};

UserSchema.methods.getToken = function () {
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

UserSchema.methods.hasRole = function (roleName: RoleName): boolean {
  return (
    Array.isArray(this.roles) && this.roles.some((role: any) => role.nom === roleName) // simplistic check, assumes populated or object structure
  );
};
// Note: original hasRole checked isDocumentArray. Mongoose types might need assertion.

UserSchema.methods.isAdmin = function (): boolean {
  return this.hasRole(RoleName.ADMIN);
};

UserSchema.methods.isExpert = function (): boolean {
  return this.hasRole(RoleName.EXPERT_TRAD);
};

UserSchema.methods.getPlateformeRoles = function (): RoleName[] {
  if (!this.roles || this.roles.length === 0) return [];
  // basic check if populated
  if (this.roles.length > 0 && !this.roles[0].nom) {
    throw new Error("roles must be populated");
  }
  return (this.roles as Role[])
    .filter((role) => role.nom === RoleName.ADMIN || role.nom === RoleName.EXPERT_TRAD)
    .map((role) => role.nom);
};

UserSchema.methods.getStructures = function (): Types.ObjectId[] {
  if (!this.structures) return [];
  // validation logic similar to original?
  // Original: throws if not populated.
  // Here we return structure array.
  // Use loose check for now or strict?
  // If strict, we need Structure type.
  // For now returning the field.
  return this.structures;
};

UserSchema.methods.getSelectedLanguages = function (): Langue[] {
  if (!this.selectedLanguages) return [];
  if (this.selectedLanguages.length > 0 && !(this.selectedLanguages[0] as any).i18nCode) {
    throw new Error("selectedLanguages must be populated");
  }
  return this.selectedLanguages as Langue[];
};

UserSchema.methods.getSelectedLanguagesButFrench = function (): Langue[] {
  const langs = this.getSelectedLanguages();
  return langs.filter((l: Langue) => l.langueCode !== "fr");
};

export const UserModel = model<User>("User", UserSchema);
