import { ContentType, DispositifOrigin, DispositifStatus } from "@refugies-info/api-types";
import { z } from "zod";

// ObjectId validation - prevents NoSQL injection
const ObjectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, {
  message: "Format ObjectId invalide (doit être 24 caractères hexadécimaux)",
});

// Base schema for shared fields
const BaseWebhookSchema = z.object({
  email: z.string().email("Format d'email invalide"),
});

// Dispositif content schema (simplified for webhooks)
const DispositifContentSchema = z
  .object({
    titreInformatif: z.string().optional(),
    titreMarque: z.string().optional(),
    abstract: z.string().optional(),
    markdown: z.string().optional(),
    // Add more content fields if needed based on usage
  })
  .passthrough(); // Allow some flexibility but still strict at the top level

import { activatedLanguages } from "../data/activatedLanguages";

const AllowedLanguages = activatedLanguages.map((l) => l.i18nCode);

const TranslationSchema = z
  .record(
    z.string(),
    z.object({
      content: DispositifContentSchema.optional(),
    }),
  )
  .optional()
  .refine(
    (t) => {
      if (!t) return true; // optional translations are OK
      const keys = Object.keys(t);
      return keys.every((k) => AllowedLanguages.includes(k as any));
    },
    {
      message: `Langue non supportée. Valeurs autorisées : ${AllowedLanguages.join(", ")}`,
    },
  );

// CREATE
export const DispositifCreateSchema = BaseWebhookSchema.extend({
  dispositif: z.object({
    titreInformatif: z.string().optional(),
    titreMarque: z.string().optional(),
    abstract: z.string().optional(),
    themes: z.array(z.string()).optional(),
    translations: TranslationSchema,
    origin: z
      .nativeEnum(DispositifOrigin)
      .refine((val) => val === DispositifOrigin.RI || val === DispositifOrigin.RCO, {
        message: "L'origine doit être 'RI' ou 'RCO'",
      }),
  }),
});

// UPDATE
export const DispositifUpdateSchema = BaseWebhookSchema.extend({
  dispositif: z.object({
    _id: ObjectIdSchema,
    titreInformatif: z.string().optional(),
    titreMarque: z.string().optional(),
    abstract: z.string().optional(),
    themes: z.array(z.string()).optional(),
    translations: TranslationSchema,
  }),
});

// TRANSLATION
export const TranslationUpdateSchema = BaseWebhookSchema.extend({
  dispositif: z.object({
    _id: ObjectIdSchema,
    translations: z
      .record(
        z.string(),
        z.object({
          content: DispositifContentSchema.optional(),
        }),
      )
      .refine((t) => Object.keys(t).length === 1, {
        message: "Une seule langue doit être fournie pour la mise à jour",
      })
      .refine(
        (t) => {
          const keys = Object.keys(t);
          return keys.every((k) => AllowedLanguages.includes(k as any));
        },
        {
          message: `Langue non supportée. Valeurs autorisées : ${AllowedLanguages.join(", ")}`,
        },
      ),
  }),
});

// ARCHIVE
export const ArchiveSchema = BaseWebhookSchema.extend({
  dispositif: z.object({
    _id: ObjectIdSchema,
  }),
});
