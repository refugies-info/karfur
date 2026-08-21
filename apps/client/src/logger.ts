/* eslint-disable no-console */
import * as Sentry from "@sentry/nextjs";

const isProduction = process.env.NEXT_PUBLIC_REACT_APP_ENV === "production";

/**
 * Extrait une Error exploitable par Sentry : sans elle, tous les événements d'un même appel
 * se regroupent sur la stack de ce fichier au lieu du site d'appel.
 */
const toError = (message: string, data?: any): Error => {
  if (data instanceof Error) return data;
  if (data?.response?.data?.message) return new Error(`${message} ${data.response.data.message}`);
  return new Error(message);
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
   * donc systématiquement, quel que soit l'environnement.
   */
  static error = (message: string, data?: any, options?: { captureToSentry?: boolean }) => {
    if (!isProduction) console.error(message, data);
    if (options?.captureToSentry === false) return;

    Sentry.withScope((scope) => {
      scope.setTag("source", "client-logger");
      // `data` est passé tel quel : Sentry sérialise les objets, alors que String() les
      // aplatirait en "[object Object]".
      if (data !== undefined) scope.setContext("logger", { message, data });
      Sentry.captureException(toError(message, data));
    });
  };
}
