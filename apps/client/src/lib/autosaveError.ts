import * as Sentry from "@sentry/nextjs";
import { logger, shouldSendToSentry } from "logger";

/** Dernière référence Sentry réellement envoyée, réutilisée quand un envoi est filtré. */
let lastEventId: string | null = null;

export interface AutosaveErrorDetails {
  status: number | null;
  message: string;
  /** Field paths rejected by the API validation, eg. "body.metadatas.sessions" */
  fields: string[];
  eventId: string | null;
}

interface AutosaveErrorContext {
  mode: "edit" | "translate";
  dispositifId?: string | null;
  locale?: string;
}

/**
 * Autosave failures used to be invisible: `logger.error` is a no-op in production and the
 * modal only said "Oups". Send the error to Sentry with the API payload attached, and return
 * a readable summary so the modal can show what the API actually refused.
 */
export const reportAutosaveError = (
  error: any,
  context: AutosaveErrorContext,
): AutosaveErrorDetails => {
  const response = error?.response;
  const payload = response?.data;
  const validationErrors =
    payload?.data && typeof payload.data === "object" ? payload.data : undefined;

  const details: AutosaveErrorDetails = {
    status: response?.status ?? null,
    message: payload?.message || error?.message || "Erreur inconnue",
    fields: validationErrors ? Object.keys(validationErrors) : [],
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
      if (details.status !== null) scope.setTag("autosave.status", String(details.status));
      if (details.fields.length > 0) scope.setTag("autosave.invalid_field", details.fields[0]);
      scope.setContext("autosave", {
        ...context,
        status: details.status,
        message: details.message,
        fields: details.fields,
        validationErrors,
      });
      return scope;
    });
  }

  // On garde la dernière référence connue : la modale doit rester utile au support même
  // lorsque l'événement courant a été filtré.
  details.eventId = lastEventId;

  return details;
};
