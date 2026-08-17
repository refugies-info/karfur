import { useEffect, useState } from "react";

export type SupportAvailability = "open" | "closed" | "unavailable";

// Horaires du support Réfugiés.info : du lundi au jeudi, de 9h30 à 12h30 et de 14h à 18h.
const OPENING_DAYS = ["Mon", "Tue", "Wed", "Thu"];
const OPENING_RANGES = [
  [9 * 60 + 30, 12 * 60 + 30],
  [14 * 60, 18 * 60],
];

// Toujours l'heure de l'équipe, jamais celle du visiteur : le public du site est international.
const parisTime = new Intl.DateTimeFormat("en-US", {
  timeZone: "Europe/Paris",
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export const isWithinOpeningHours = (date: Date) => {
  const parts = parisTime.formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";

  if (!OPENING_DAYS.includes(part("weekday"))) return false;

  const minutes = Number(part("hour")) * 60 + Number(part("minute"));
  return OPENING_RANGES.some(([start, end]) => minutes >= start && minutes < end);
};

/**
 * Disponibilité du support, à deux sources :
 * - le calendrier ci-dessus décide et plafonne, y compris si Crisp ne charge pas ;
 * - l'état Crisp ne fait que fermer en plus, pendant les heures ouvrées (congés, absence
 *   imprévue). Il ne rouvre jamais le lien un dimanche.
 */
const useSupportAvailability = (): SupportAvailability => {
  // Premier rendu « ouvert » : calculer l'heure au rendu serveur provoquerait un écart d'hydratation.
  const [isOpenNow, setIsOpenNow] = useState(true);
  const [isTeamAway, setIsTeamAway] = useState(false);

  useEffect(() => {
    const refresh = () => setIsOpenNow(isWithinOpeningHours(new Date()));
    refresh();
    const interval = setInterval(refresh, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // window.$crisp n'est le SDK qu'une fois client.crisp.chat chargé (Script en lazyOnload) :
    // avant, c'est un simple tableau. On l'interroge jusqu'à ce qu'il réponde, et on abandonne
    // sans bruit si le visiteur bloque Crisp.
    const readAvailability = () => {
      if (typeof window.$crisp?.is !== "function") return false;
      const isAvailable = window.$crisp.is("website:available");
      if (typeof isAvailable !== "boolean") return false;

      setIsTeamAway(!isAvailable);
      window.$crisp.push([
        "on",
        "website:availability:changed",
        (available: boolean) => setIsTeamAway(!available),
      ]);
      return true;
    };

    if (readAvailability()) return;

    let attempts = 0;
    const interval = setInterval(() => {
      attempts += 1;
      if (readAvailability() || attempts >= 30) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isOpenNow) return "closed";
  return isTeamAway ? "unavailable" : "open";
};

export default useSupportAvailability;
