import type { Languages } from "@refugies-info/api-types";
import { type Document, type Types } from "mongoose";
import { z } from "zod";
export declare const LangueZodSchema: z.ZodObject<
  {
    langueFr: z.ZodString;
    langueLoc: z.ZodOptional<z.ZodString>;
    langueCode: z.ZodOptional<z.ZodString>;
    i18nCode: z.ZodEnum<["fr", "en", "uk", "ti", "ar", "ps", "ru", "fa"]>;
    avancement: z.ZodDefault<z.ZodNumber>;
    avancementTrad: z.ZodDefault<z.ZodNumber>;
    created_at: z.ZodOptional<z.ZodDate>;
    updatedAt: z.ZodOptional<z.ZodDate>;
  },
  "strip",
  z.ZodTypeAny,
  {
    langueFr: string;
    i18nCode: "fr" | "en" | "uk" | "ti" | "ar" | "ps" | "ru" | "fa";
    avancement: number;
    avancementTrad: number;
    langueLoc?: string | undefined;
    langueCode?: string | undefined;
    created_at?: Date | undefined;
    updatedAt?: Date | undefined;
  },
  {
    langueFr: string;
    i18nCode: "fr" | "en" | "uk" | "ti" | "ar" | "ps" | "ru" | "fa";
    langueLoc?: string | undefined;
    langueCode?: string | undefined;
    avancement?: number | undefined;
    avancementTrad?: number | undefined;
    created_at?: Date | undefined;
    updatedAt?: Date | undefined;
  }
>;
export type LangueType = z.infer<typeof LangueZodSchema>;
export interface Langue extends Omit<LangueType, "i18nCode">, Document {
  _id: Types.ObjectId;
  i18nCode: Languages;
  created_at?: Date;
  updatedAt?: Date;
}
export type LangueId = Langue["_id"] | Langue["id"];
export declare const LangueModel: import("mongoose").Model<
  Langue,
  {},
  {},
  {},
  Document<unknown, {}, Langue, {}, {}> &
    Langue &
    Required<{
      _id: Types.ObjectId;
    }> & {
      __v: number;
    },
  any
>;
//# sourceMappingURL=Langue.d.ts.map
