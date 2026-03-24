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

// ============================================
// POI SCHEMA (Points of Interest - carte géographique)
// ============================================

const PoiSchema = z.object(
  {
    title: z.string().min(1, { message: "Le titre du POI est requis" }),
    address: z.string().min(1, { message: "L'adresse du POI est requise" }),
    city: z.string().optional().nullable(),
    // z.coerce.number() accepte les strings ET les numbers (Luna envoie parfois des strings)
    lat: z.coerce.number({ message: "lat doit être un nombre (ex: 48.8566)" }),
    lng: z.coerce.number({ message: "lng doit être un nombre (ex: 2.3522)" }),
    description: z.string().optional(),
    email: z.string().email({ message: "L'email du POI doit être un email valide" }).optional(),
    phone: z.string().optional(),
  },
  {
    message: "Structure de POI invalide",
  },
);

// ============================================
// SPONSOR SCHEMA
// ============================================

const SponsorSchema = z.object({
  name: z.string().min(1, { message: "Le nom du sponsor est requis" }),
  logo: z.string().url({ message: "Le logo doit être une URL valide" }).optional(),
  link: z.string().url({ message: "Le lien doit être une URL valide" }).optional(),
});

// ============================================
// METADATAS SCHEMAS - with detailed error messages
// ============================================

// Age schema with detailed validation
const AgeSchema = z
  .object(
    {
      type: z.enum(["lessThan", "moreThan", "between"], {
        message: "Type d'âge invalide. Valeurs autorisées: 'lessThan', 'moreThan', 'between'",
      }),
      ages: z.array(z.number().int({ message: "Les âges doivent être des nombres entiers" }), {
        message: "Le champ 'ages' doit être un tableau de nombres",
      }),
    },
    {
      message: "Structure d'âge invalide",
    },
  )
  .refine(
    (data) => {
      if (data.type === "between") return data.ages.length === 2;
      return data.ages.length >= 1;
    },
    {
      message:
        "Pour 'between', exactement 2 âges sont requis. Pour les autres types, au moins 1 âge.",
    },
  );

// Price schema with detailed validation
const PriceSchema = z.object(
  {
    values: z.array(
      z.number().min(0, {
        message: "Les valeurs de prix doivent être positives ou nulles",
      }),
      {
        message:
          "Le champ 'values' doit être un tableau de nombres (0 = gratuit, vide = montant libre)",
      },
    ),
    details: z
      .enum(["once", "eachTime", "hour", "day", "week", "month", "trimester", "semester", "year"], {
        message:
          "Détails de prix invalide. Valeurs autorisées: 'once', 'eachTime', 'hour', 'day', 'week', 'month', 'trimester', 'semester', 'year'",
      })
      .optional(),
  },
  {
    message: "Structure de prix invalide",
  },
);

// Commitment schema with detailed validation
const CommitmentSchema = z.object(
  {
    amountDetails: z.enum(["minimum", "maximum", "approximately", "exactly", "between"], {
      message:
        "Type de détails d'engagement invalide. Valeurs autorisées: 'minimum', 'maximum', 'approximately', 'exactly', 'between'",
    }),
    hours: z.array(
      z.number().positive({ message: "Les heures doivent être des nombres positifs" }),
      {
        message: "Le champ 'hours' doit être un tableau de nombres positifs",
      },
    ),
    timeUnit: z.enum(
      [
        "sessions",
        "hours",
        "half-days",
        "days",
        "weeks",
        "months",
        "trimesters",
        "semesters",
        "years",
      ],
      {
        message:
          "Unité de temps invalide. Valeurs autorisées: 'sessions', 'hours', 'half-days', 'days', 'weeks', 'months', 'trimesters', 'semesters', 'years'",
      },
    ),
  },
  {
    message: "Structure d'engagement invalide",
  },
);

// Frequency schema with detailed validation
const FrequencySchema = z.object(
  {
    amountDetails: z.enum(["minimum", "maximum", "approximately", "exactly"], {
      message:
        "Type de détails de fréquence invalide. Valeurs autorisées: 'minimum', 'maximum', 'approximately', 'exactly'",
    }),
    hours: z.number().positive({ message: "Le nombre d'heures doit être un nombre positif" }),
    timeUnit: z.enum(
      [
        "sessions",
        "hours",
        "half-days",
        "days",
        "weeks",
        "months",
        "trimesters",
        "semesters",
        "years",
      ],
      {
        message:
          "Unité de temps invalide. Valeurs autorisées: 'sessions', 'hours', 'half-days', 'days', 'weeks', 'months', 'trimesters', 'semesters', 'years'",
      },
    ),
    frequencyUnit: z.enum(["session", "day", "week", "month", "trimester", "semester", "year"], {
      message:
        "Unité de fréquence invalide. Valeurs autorisées: 'session', 'day', 'week', 'month', 'trimester', 'semester', 'year'",
    }),
  },
  {
    message: "Structure de fréquence invalide",
  },
);

// Accepts YYYY-MM-DD or full ISO 8601 with timezone (rejects ambiguous datetime without timezone)
const DateStringSchema = z.union([z.string().date(), z.string().datetime({ offset: true })]);

// Session schema with detailed validation for dates
const SessionSchema = z
  .object(
    {
      startDate: DateStringSchema,
      endDate: DateStringSchema,
      registrationStartDate: DateStringSchema.optional(),
      registrationEndDate: DateStringSchema.optional(),
      externalRef: z
        .string()
        .min(1, { message: "externalRef ne peut pas être une chaîne vide" })
        .optional(),
      url: z
        .string()
        .url({
          message: "url doit être une URL valide (ex: https://example.com/session/123)",
        })
        .optional(),
    },
    {
      message: "Structure de session invalide",
    },
  )
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return start <= end;
    },
    {
      message: "startDate doit être antérieure ou égale à endDate",
      path: ["startDate"],
    },
  )
  .refine(
    (data) => {
      if (data.registrationStartDate && data.registrationEndDate) {
        const regStart = new Date(data.registrationStartDate);
        const regEnd = new Date(data.registrationEndDate);
        return regStart <= regEnd;
      }
      return true;
    },
    {
      message: "registrationStartDate doit être antérieure ou égale à registrationEndDate",
      path: ["registrationStartDate"],
    },
  )
  .refine(
    (data) => {
      if (data.registrationEndDate && data.startDate) {
        const regEnd = new Date(data.registrationEndDate);
        const start = new Date(data.startDate);
        return regEnd <= start;
      }
      return true;
    },
    {
      message: "registrationEndDate doit être antérieure ou égale à startDate de la session",
      path: ["registrationEndDate"],
    },
  );

export type WebhookSession = z.infer<typeof SessionSchema>;

// SessionsMetadata schema - wraps the sessions array with additional metadata
const SessionsMetadataSchema = z.object(
  {
    modalitesEntreesSorties: z
      .union([z.literal(0), z.literal(1)], {
        message: "modalitesEntreesSorties doit être 0 (dates fixes) ou 1 (entrées permanentes)",
      })
      .optional()
      .nullable(),
    items: z
      .array(SessionSchema, {
        message: "items doit être un tableau de sessions",
      })
      .optional()
      .nullable(),
  },
  {
    message: "Structure des sessions invalide",
  },
);
export type WebhookSessionsMetadata = z.infer<typeof SessionsMetadataSchema>;

// Main Metadatas schema with detailed error messages
export const MetadatasSchema = z.object(
  {
    location: z
      .union([
        z.enum(["france", "online"], {
          message: "Location générale invalide. Valeurs autorisées: 'france', 'online'",
        }),
        z.array(z.string().min(1, { message: "Les départements ne peuvent pas être vides" }), {
          message: "La location par département doit être un tableau de strings non vides",
        }),
      ])
      .optional(),

    frenchLevel: z
      .array(
        z.enum(["alpha", "A1", "A2", "B1", "B2", "C1", "C2"], {
          message:
            "Niveau de français invalide. Valeurs autorisées: 'alpha', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'",
        }),
        {
          message: "frenchLevel doit être un tableau de niveaux de français",
        },
      )
      .optional(),

    age: AgeSchema.optional(),

    price: PriceSchema.optional(),

    publicStatus: z
      .array(
        z.enum(["asile", "refugie", "subsidiaire", "temporaire", "apatride", "french"], {
          message:
            "Statut public invalide. Valeurs autorisées: 'asile', 'refugie', 'subsidiaire', 'temporaire', 'apatride', 'french'",
        }),
        {
          message: "publicStatus doit être un tableau de statuts",
        },
      )
      .optional(),

    public: z
      .array(
        z.enum(["family", "women", "youths", "senior", "gender"], {
          message:
            "Type de public invalide. Valeurs autorisées: 'family', 'women', 'youths', 'senior', 'gender'",
        }),
        {
          message: "public doit être un tableau de types de public",
        },
      )
      .optional(),

    conditions: z
      .array(
        z.enum(
          [
            "acte naissance",
            "titre sejour",
            "cir",
            "bank account",
            "pole emploi",
            "driver license",
            "school",
          ],
          {
            message:
              "Condition invalide. Valeurs autorisées: 'acte naissance', 'titre sejour', 'cir', 'bank account', 'pole emploi', 'driver license', 'school'",
          },
        ),
        {
          message: "conditions doit être un tableau de conditions",
        },
      )
      .optional(),

    commitment: CommitmentSchema.optional(),

    frequency: FrequencySchema.optional(),

    timeSlots: z
      .array(
        z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"], {
          message: "Jour de la semaine invalide. Valeurs autorisées: 'monday' à 'sunday'",
        }),
        {
          message: "timeSlots doit être un tableau de jours",
        },
      )
      .optional(),

    sessions: SessionsMetadataSchema.optional().nullable(),
  },
  {
    message: "Structure des métadonnées invalide",
  },
);
export type WebhookMetadatas = z.infer<typeof MetadatasSchema>;

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
    theme: ObjectIdSchema.optional(),
    secondaryThemes: z.array(ObjectIdSchema).optional(),
    needs: z.array(ObjectIdSchema).optional(),
    sponsors: z.array(SponsorSchema).optional(),
    map: z.array(PoiSchema).optional().nullable(),
    translations: TranslationSchema,
    metadatas: MetadatasSchema.optional(),
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
    theme: ObjectIdSchema.optional(),
    secondaryThemes: z.array(ObjectIdSchema).optional(),
    needs: z.array(ObjectIdSchema).optional(),
    sponsors: z.array(SponsorSchema).optional(),
    map: z.array(PoiSchema).optional().nullable(),
    translations: TranslationSchema,
    metadatas: MetadatasSchema.optional(),
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
