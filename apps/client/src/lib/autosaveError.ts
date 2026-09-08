import { MAX_REQUEST_BODY_BYTES } from "@refugies-info/api-types";
import * as Sentry from "@sentry/nextjs";
import { logger, shouldSendToSentry } from "logger";
import API from "~/utils/API";

/** Dernière référence Sentry réellement envoyée, réutilisée quand un envoi est filtré. */
let lastEventId: string | null = null;
/** Idem pour la référence affichée : elle doit désigner la notification réellement partie. */
let lastReference: string | null = null;

/** Un champ refusé par la validation, avec le motif renvoyé par l'API. */
export interface AutosaveErrorField {
  path: string;
  /** Motif brut de tsoa, transmis au support tel quel. */
  reason?: string;
  /** Propriété en trop désignée par le motif, quand il s'agit d'un excès. */
  excessProperty?: string;
  /** Motif reformulé en français, affichable. */
  readableReason?: string;
}

/** Volume réellement envoyé et plafond accepté par l'API. */
export interface AutosaveErrorPayloadSize {
  bytes: number;
  limitBytes: number;
}

export interface AutosaveErrorDetails {
  status: number | null;
  message: string;
  /** Field paths rejected by the API validation, eg. "body.metadatas.sessions" */
  fields: string[];
  /** Mêmes champs, avec le motif du refus — la seule information qui dise *pourquoi*. */
  fieldDetails: AutosaveErrorField[];
  /** Volume envoyé et plafond, quand on a pu les mesurer. */
  payloadSize: AutosaveErrorPayloadSize | null;
  /**
   * Identifiant montré dans la modale et repris dans la notification Slack : c'est ce qui
   * permet de relier un appel au support à l'erreur remontée.
   */
  reference: string;
  /**
   * Formulation compréhensible quand on sait interpréter l'erreur. `null` quand on ne sait
   * pas : la modale n'affiche alors que la référence, plutôt qu'un jargon inquiétant.
   */
  userMessage: string | null;
  eventId: string | null;
}

interface AutosaveErrorContext {
  mode: "edit" | "translate";
  dispositifId?: string | null;
  locale?: string;
}

/**
 * Même format que les identifiants d'événement Sentry (32 caractères hexadécimaux), pour que
 * les deux références soient interchangeables à l'oral avec le support.
 */
const newReference = (): string => {
  const uuid = globalThis.crypto?.randomUUID?.();
  if (uuid) return uuid.replace(/-/g, "");
  return Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
};

/**
 * Sur un champ typé en union, tsoa n'expose pas le vrai motif : il l'enfouit dans
 * `Could not match the union against any of the items. Issues: [{...}]`, où chaque branche a
 * son propre message. `translated.content` est justement une union (contenu structuré |
 * markdown), donc le motif utile y est toujours noyé. On en extrait la propriété en trop,
 * seul cas qui désigne précisément le coupable.
 */
const EXCESS_PROPERTY_RE = /"([^"]+)" is an excess property/;

const findExcessProperty = (message: string): string | undefined =>
  EXCESS_PROPERTY_RE.exec(message)?.[1];

/**
 * Traduit le jargon tsoa. Le message d'origine part dans Slack et Sentry : ici on ne garde que
 * ce qu'une personne non technique peut comprendre.
 */
const translateReason = (message: string | undefined): string | undefined => {
  if (!message) return undefined;

  const excess = findExcessProperty(message);
  if (excess) return `la donnée « ${excess} » n’est plus acceptée à cet endroit`;
  if (/is required/.test(message)) return "une information obligatoire est absente";
  if (/invalid string value/.test(message)) return "le format du texte est inattendu";
  if (/invalid (float|integer) number/.test(message)) return "un nombre est attendu";
  if (/invalid boolean value/.test(message)) return "une valeur vrai/faux est attendue";
  if (/invalid undefined value/.test(message)) return "la valeur envoyée est vide";
  if (/Could not match the union/.test(message)) return "la structure du contenu est inattendue";
  return undefined;
};

/**
 * tsoa renvoie `{ [chemin]: { message, value } }`. Le message est la seule chose qui dise
 * pourquoi le champ est refusé (`"markdown" is an excess property...`, `invalid string value`) :
 * il était jeté avec `Object.keys`, ce qui rendait chaque 422 indéchiffrable.
 */
const extractFields = (validationErrors: unknown): AutosaveErrorField[] => {
  if (!validationErrors || typeof validationErrors !== "object") return [];
  return Object.entries(validationErrors as Record<string, unknown>).map(([path, detail]) => {
    const reason =
      detail && typeof detail === "object" && typeof (detail as any).message === "string"
        ? ((detail as any).message as string)
        : undefined;
    return {
      path,
      reason,
      excessProperty: reason ? findExcessProperty(reason) : undefined,
      readableReason: translateReason(reason),
    };
  });
};

/** Formate un volume d'octets en unité lisible (« 1,2 Mo »). */
export const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} o`;
  const units = ["ko", "Mo", "Go"];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  // 1 décimale sous 10, aucune au-delà : « 1,2 Mo » mais « 48 Mo ».
  return `${value.toLocaleString("fr-FR", {
    maximumFractionDigits: value < 10 ? 1 : 0,
  })} ${units[unit]}`;
};

/**
 * Axios conserve le corps sérialisé dans `config.data` : on y lit le volume réellement parti,
 * sans avoir à le faire remonter depuis l'autosave.
 */
const getPayloadSize = (error: any): AutosaveErrorPayloadSize | null => {
  const data = error?.config?.data;
  if (typeof data !== "string") return null;
  const bytes =
    typeof TextEncoder !== "undefined" ? new TextEncoder().encode(data).length : data.length;
  return { bytes, limitBytes: MAX_REQUEST_BODY_BYTES };
};

/**
 * Les rédactrices et rédacteurs sont des associations : « Validation Failed » ne leur dit rien
 * et fait peur. On traduit ce qu'on sait interpréter, et on se tait sur le reste.
 */
const getUserMessage = (
  status: number | null,
  fields: AutosaveErrorField[],
  payloadSize: AutosaveErrorPayloadSize | null,
): string | null => {
  if (status === null) {
    return "La connexion au serveur a été interrompue. Vérifiez votre connexion internet.";
  }
  if (status === 401 || status === 403) {
    return "Votre session a expiré. Reconnectez-vous pour reprendre votre travail.";
  }
  if (status === 413) {
    const volumes = payloadSize
      ? ` Volume envoyé : ${formatBytes(payloadSize.bytes)}, maximum accepté : ${formatBytes(
          payloadSize.limitBytes,
        )}.`
      : "";
    return `Le contenu envoyé est trop volumineux, souvent à cause d’une image trop lourde.${volumes}`;
  }
  if (status === 422) {
    // `throw-on-extras` côté serveur : la fiche contient une donnée que l'API n'accepte plus.
    // Ce n'est pas une faute de frappe, personne ne peut le corriger depuis l'éditeur.
    const excess = fields.find((field) => field.excessProperty)?.excessProperty;
    if (excess) {
      return `Cette fiche contient une donnée que l’éditeur ne sait plus enregistrer (« ${excess} »). Ce n’est pas lié à ce que vous venez d’écrire, et aucun caractère n’est en cause : l’équipe RI doit intervenir.`;
    }
    const readable = fields.find((field) => field.readableReason)?.readableReason;
    if (readable) return `Une partie du contenu n’a pas été acceptée par le serveur : ${readable}.`;
    return "Une partie du contenu n’a pas été acceptée par le serveur.";
  }
  if (status >= 500) {
    return "Le serveur a rencontré une erreur temporaire.";
  }
  return null;
};

/**
 * Autosave failures used to be invisible: `logger.error` is a no-op in production and the
 * modal only said "Oups". Send the error to Sentry with the API payload attached, notify the
 * team on Slack, and return a readable summary so the modal can show what the API refused.
 */
export const reportAutosaveError = (
  error: any,
  context: AutosaveErrorContext,
): AutosaveErrorDetails => {
  const response = error?.response;
  const payload = response?.data;
  const validationErrors =
    payload?.data && typeof payload.data === "object" ? payload.data : undefined;

  const status = response?.status ?? null;
  const fieldDetails = extractFields(validationErrors);
  const payloadSize = getPayloadSize(error);
  const details: AutosaveErrorDetails = {
    status,
    message: payload?.message || error?.message || "Erreur inconnue",
    fields: fieldDetails.map((field) => field.path),
    fieldDetails,
    payloadSize,
    reference: newReference(),
    userMessage: getUserMessage(status, fieldDetails, payloadSize),
    eventId: null,
  };

  // captureToSentry: false — l'événement riche est envoyé juste en dessous, sans quoi chaque
  // échec en produirait deux.
  logger.error(
    "[autosave] error:",
    { ...context, ...details, validationErrors },
    { captureToSentry: false },
  );

  // L'autosave se relance à chaque frappe : sans limite, une panne persistante enverrait un
  // événement par caractère saisi. La clé inclut la fiche, le statut et le champ fautif, pour
  // qu'un échec sur un autre document ou d'une autre nature remonte immédiatement au lieu
  // d'être masqué par le précédent.
  const throttleKey = [
    "autosave",
    context.mode,
    context.dispositifId ?? "new",
    details.status,
    details.fields[0] ?? "",
  ].join(":");
  if (shouldSendToSentry(throttleKey)) {
    lastEventId = Sentry.captureException(error, (scope) => {
      scope.setTag("feature", "dispositif-autosave");
      scope.setTag("autosave.mode", context.mode);
      scope.setTag("autosave.reference", details.reference);
      if (details.status !== null) scope.setTag("autosave.status", String(details.status));
      if (details.fields.length > 0) scope.setTag("autosave.invalid_field", details.fields[0]);
      scope.setContext("autosave", {
        ...context,
        reference: details.reference,
        status: details.status,
        message: details.message,
        fields: details.fieldDetails,
        payloadSize: details.payloadSize,
        validationErrors,
      });
      return scope;
    });
    lastReference = details.reference;

    // Sans Sentry configuré côté navigateur, Slack est la seule remontée : on notifie donc
    // indépendamment du succès de la capture. L'appel ne renvoie jamais d'erreur.
    void API.reportClientError({
      reference: details.reference,
      source: `autosave-${context.mode}`,
      status: details.status,
      message: details.message,
      fields: details.fieldDetails,
      payloadSize: details.payloadSize ?? undefined,
      dispositifId: context.dispositifId ?? null,
      locale: context.locale,
      url: typeof window !== "undefined" ? window.location.href : undefined,
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      sentryEventId: lastEventId,
    });
  } else if (lastReference) {
    // La modale doit rester utile au support même lorsque l'envoi courant a été filtré : on
    // affiche la référence de la notification réellement partie.
    details.reference = lastReference;
  }

  details.eventId = lastEventId;

  return details;
};
