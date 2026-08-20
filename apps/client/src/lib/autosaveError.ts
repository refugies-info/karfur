import * as Sentry from "@sentry/nextjs";
import { logger } from "logger";

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

  details.eventId = Sentry.captureException(error, (scope) => {
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

  return details;
};
