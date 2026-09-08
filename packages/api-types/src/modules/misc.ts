export interface TechnicalInfoRequest {
  appVersion: string;
}

/**
 * Taille maximale d'un corps de requête acceptée par l'API, en octets.
 *
 * Doit rester alignée sur `express.json({ limit })` dans `apps/server/src/server.ts` : c'est
 * la valeur affichée à l'utilisateur à côté du volume qu'il a réellement envoyé.
 */
export const MAX_REQUEST_BODY_BYTES = 52428800;

/**
 * Un champ refusé par la validation de l'API, avec le motif renvoyé par tsoa
 * (eg. `"markdown" is an excess property and therefore is not allowed`).
 */
export interface ClientErrorField {
  path: string;
  reason?: string;
  /** Nom de la propriété en trop, extraite du motif tsoa quand il s'agit d'un excès. */
  excessProperty?: string;
}

/** Volume réellement envoyé et plafond accepté, pour situer un échec de taille. */
export interface ClientErrorPayloadSize {
  bytes: number;
  limitBytes: number;
}

/**
 * Remontée d'une erreur survenue côté navigateur, pour notification à l'équipe.
 * `reference` est l'identifiant affiché dans la modale : il doit être identique
 * dans la notification pour savoir qui contacter.
 */
export interface ReportClientErrorRequest {
  reference: string;
  /** Origine de l'erreur, eg. `autosave-edit` ou `autosave-translate` */
  source: string;
  status?: number | null;
  message: string;
  fields?: ClientErrorField[];
  payloadSize?: ClientErrorPayloadSize;
  dispositifId?: string | null;
  locale?: string;
  /** URL de la page où l'erreur est survenue */
  url?: string;
  userAgent?: string;
  /** Référence de l'événement Sentry, quand il a bien été envoyé */
  sentryEventId?: string | null;
}
