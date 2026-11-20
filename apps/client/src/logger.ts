/* eslint-disable no-console */
import * as Sentry from "@sentry/nextjs";
import axios from "axios";

const isProduction = process.env.NEXT_PUBLIC_REACT_APP_ENV === "production";

/**
 * Extrait une Error exploitable par Sentry : sans elle, tous les événements d'un même appel
 * se regroupent sur la stack de ce fichier au lieu du site d'appel.
 */
export const toError = (message: string, rawData?: any): Error => {
  if (rawData instanceof Error) return rawData;
  // Most call sites log `{ error }`: unwrap it so the server message isn't lost.
  const data = rawData?.error ?? rawData;
  if (data?.response?.data?.message) return new Error(`${message} ${data.response.data.message}`);
  return new Error(message);
};

/**
 * An axios error without a response never reached the server (offline, flaky mobile network,
 * request aborted by a navigation): nothing to fix on our side, so it stays out of Sentry.
 * Callers pass the error either directly or wrapped as `{ error }`.
 */
export const isNetworkError = (data?: any): boolean => {
  const error = data instanceof Error ? data : data?.error;
  return axios.isAxiosError(error) && !error.response;
};

const THROTTLE_MS = 60_000;
/** Borne la mémoire si des messages dynamiques créent des clés à l'infini. */
const MAX_TRACKED_MESSAGES = 100;
const lastSentAt = new Map<string, number>();

/**
 * Le volume ne vient pas du nombre de sites d'appel mais de leur répétition : l'autosave se
 * déclenche à chaque frappe, donc un échec persistant enverrait un événement par caractère.
 * On limite chaque message à un envoi par minute — la première occurrence de toute erreur
 * distincte passe toujours, ce qu'un échantillonnage aléatoire ne garantirait pas.
 */
export const shouldSendToSentry = (message: string): boolean => {
  const now = Date.now();
  const last = lastSentAt.get(message);
  if (last !== undefined && now - last < THROTTLE_MS) return false;

  if (lastSentAt.size >= MAX_TRACKED_MESSAGES) lastSentAt.clear();
  lastSentAt.set(message, now);
  return true;
};

export class logger {
  static info = (message: string, data?: any) => {
    if (!isProduction) console.log(message, data);
  };

  /**
   * En production, laisse une trace dans le fil d'ariane Sentry : elle sera jointe au prochain
   * événement et donne le contexte de ce qui précédait l'erreur.
   */
  static warn = (message: string, data?: any) => {
    if (!isProduction) console.warn(message, data);
    Sentry.addBreadcrumb({ level: "warning", category: "logger", message, data: { data } });
  };

  /**
   * `console.error` est muet en production, ce qui rendait les 56 appels du front invisibles :
   * les erreurs d'autosave n'ont jamais été observables avant l'arrivée de Sentry. On remonte
   * donc quel que soit l'environnement, mais en limitant les répétitions (voir
   * `shouldSendToSentry`).
   */
  static error = (message: string, data?: any, options?: { captureToSentry?: boolean }) => {
    if (!isProduction) console.error(message, data);
    if (options?.captureToSentry === false || isNetworkError(data)) return;
    if (!shouldSendToSentry(message)) return;

    Sentry.withScope((scope) => {
      scope.setTag("source", "client-logger");
      // `data` est passé tel quel : Sentry sérialise les objets, alors que String() les
      // aplatirait en "[object Object]".
      if (data !== undefined) scope.setContext("logger", { message, data });
      Sentry.captureException(toError(message, data));
    });
  };
}
