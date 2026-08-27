import type { ReportClientErrorRequest } from "@refugies-info/api-types";
import type { DocumentType, User } from "@refugies-info/mongo";
import { slackClientError } from "~/connectors/slack/sendSlackNotif";
import logger from "~/logger";
import { getDispositifById } from "~/modules/dispositif/dispositif.repository";

const THROTTLE_MS = 5 * 60_000;
/** Borne la mémoire si les clés se multiplient (une par fiche, par statut, par champ). */
const MAX_TRACKED_KEYS = 500;
const lastNotifiedAt = new Map<string, number>();

/**
 * L'autosave se relance à chaque frappe : le navigateur limite déjà ses envois, mais rien
 * n'empêche plusieurs onglets — ou un client qui ignore la limite — d'inonder le canal. On
 * regroupe donc par nature d'échec plutôt que par occurrence.
 */
const shouldNotify = (key: string): boolean => {
  const now = Date.now();
  const last = lastNotifiedAt.get(key);
  if (last !== undefined && now - last < THROTTLE_MS) return false;

  if (lastNotifiedAt.size >= MAX_TRACKED_KEYS) lastNotifiedAt.clear();
  lastNotifiedAt.set(key, now);
  return true;
};

/** Le type de contenu et le titre viennent de la base, pas du navigateur. */
const getDispositifInfo = async (dispositifId?: string | null) => {
  if (!dispositifId) return { typeContenu: null, dispositifTitle: null };
  try {
    const dispositif = await getDispositifById(dispositifId, {
      typeContenu: 1,
      "translations.fr.content.titreInformatif": 1,
    });
    return {
      typeContenu: dispositif?.typeContenu ?? null,
      dispositifTitle: dispositif?.translations?.fr?.content?.titreInformatif ?? null,
    };
  } catch (e) {
    // Un id invalide ne doit pas faire perdre la remontée : on notifie sans les liens.
    logger.warn("[reportClientError] dispositif introuvable", { dispositifId, error: e });
    return { typeContenu: null, dispositifTitle: null };
  }
};

/**
 * Remonte au canal technique une erreur survenue dans le navigateur. La `reference` affichée
 * dans la modale est reprise telle quelle : c'est le seul lien entre l'appel au support et
 * cette notification.
 */
const reportClientError = async (
  request: ReportClientErrorRequest,
  user?: DocumentType<User>,
): Promise<void> => {
  const throttleKey = [
    user?._id?.toString() ?? "anonymous",
    request.source,
    request.dispositifId ?? "new",
    request.status ?? "no-status",
    request.fields?.[0]?.path ?? "",
  ].join(":");

  if (!shouldNotify(throttleKey)) {
    logger.info("[reportClientError] notif filtrée", { reference: request.reference, throttleKey });
    return;
  }

  const { typeContenu, dispositifTitle } = await getDispositifInfo(request.dispositifId);

  await slackClientError({
    reference: request.reference,
    source: request.source,
    status: request.status,
    message: request.message,
    fields: request.fields,
    payloadSize: request.payloadSize,
    dispositifId: request.dispositifId,
    typeContenu,
    dispositifTitle,
    locale: request.locale,
    url: request.url,
    userAgent: request.userAgent,
    sentryEventId: request.sentryEventId,
    username: user?.username,
    email: user?.email,
  });
};

export default reportClientError;
