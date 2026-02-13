import { ContentType, DispositifOrigin, DispositifStatus } from "@refugies-info/api-types";
import { z } from "zod";

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

import { activatedLanguages } from "~/data/activatedLanguages";

const AllowedLanguages = activatedLanguages.map((l) => l.i18nCode) as [string, ...string[]];

const TranslationSchema = z
  .record(
    z.enum(AllowedLanguages, {
      error: () => ({
        message: `Langue non supportée. Valeurs autorisées : ${AllowedLanguages.join(", ")}`,
      }),
    }),
    z.object({
      content: DispositifContentSchema.optional(),
    }),
  )
  .optional();

// CREATE
export const DispositifCreateSchema = BaseWebhookSchema.extend({
  dispositif: z.object({
    titreInformatif: z.string().optional(),
    titreMarque: z.string().optional(),
    abstract: z.string().optional(),
    themes: z.array(z.string()).optional(),
    origin: z.nativeEnum(DispositifOrigin, {
      error: () => ({ message: "L'origine doit être 'RI' ou 'RCO'" }),
    }),
    translations: TranslationSchema,
  }),
});

// UPDATE
export const DispositifUpdateSchema = BaseWebhookSchema.extend({
  dispositif: z.object({
    _id: z.string(),
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
    _id: z.string(),
    translations: z
      .record(
        z.enum(AllowedLanguages, {
          error: () => ({
            message: `Langue non supportée. Valeurs autorisées : ${AllowedLanguages.join(", ")}`,
          }),
        }),
        z.object({
          content: DispositifContentSchema.optional(),
        }),
      )
      .refine((t) => Object.keys(t).length === 1, {
        message: "Une seule langue doit être fournie pour la mise à jour",
      }),
  }),
});

// ARCHIVE
export const ArchiveSchema = BaseWebhookSchema.extend({
  dispositif: z.object({
    _id: z.string(),
  }),
});
