"use client";

import { ToastViewport } from "@radix-ui/react-toast";
import {
  type ComponentProps,
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/**
 * Suivi des toasts ouverts, pour ne monter le viewport Radix que lorsqu'il sert.
 *
 * Sans ce garde-fou, `<ToastViewport>` rend en permanence un conteneur
 * `<div role="region" aria-label="Notifications (F8)">` vide en fin de page.
 * Les lecteurs d'écran l'annoncent comme un repère de navigation qui ne mène
 * nulle part (RGAA 8.9, relevé Ideance sur la page d'accueil).
 *
 * Radix ne publie pas son compteur de toasts, on le tient donc nous-mêmes :
 * chaque `<Toast>` déclare sa présence, et le viewport apparaît puis disparaît
 * avec elle. `ToastImpl` de Radix rend `null` tant que le viewport n'existe pas,
 * puis se replace tout seul dans le portail dès qu'il est monté.
 */

/** Laisse l'animation de fermeture se terminer avant de démonter le viewport. */
const DUREE_SORTIE_MS = 300;

/**
 * L'identité d'un toast est un objet vide propre à l'instance, pas un `useId`.
 * `useId` consommerait un créneau du compteur d'identifiants de React et
 * décalerait ceux que DSFR génère en aval, ce qui change des identifiants
 * rendus sans rien apporter.
 */
type CleToast = Record<string, never>;

type ToastPresence = {
  hasToasts: boolean;
  setToastOpen: (cle: CleToast, open: boolean) => void;
};

/**
 * Repli neutre hors provider : le harnais de test monte son propre viewport
 * sans passer par `_app`, et ne doit pas casser pour autant.
 */
const REPLI: ToastPresence = { hasToasts: false, setToastOpen: () => {} };

const ToastPresenceContext = createContext<ToastPresence>(REPLI);

export const ToastPresenceProvider = ({ children }: { children: ReactNode }) => {
  const [ouverts, setOuverts] = useState<ReadonlySet<CleToast>>(() => new Set());

  const setToastOpen = useCallback((cle: CleToast, open: boolean) => {
    setOuverts((prev) => {
      if (open === prev.has(cle)) return prev;
      const suivant = new Set(prev);
      if (open) suivant.add(cle);
      else suivant.delete(cle);
      return suivant;
    });
  }, []);

  const value = useMemo(
    () => ({ hasToasts: ouverts.size > 0, setToastOpen }),
    [ouverts, setToastOpen],
  );

  return <ToastPresenceContext.Provider value={value}>{children}</ToastPresenceContext.Provider>;
};

/** Déclare l'état d'un toast auprès du provider. */
export const useDeclareToast = (open: boolean) => {
  const { setToastOpen } = useContext(ToastPresenceContext);
  const [cle] = useState<CleToast>(() => ({}));

  useEffect(() => {
    if (open) {
      setToastOpen(cle, true);
      return () => setToastOpen(cle, false);
    }
    const timer = setTimeout(() => setToastOpen(cle, false), DUREE_SORTIE_MS);
    return () => clearTimeout(timer);
  }, [cle, open, setToastOpen]);
};

/** Viewport Radix, monté seulement quand au moins un toast est à afficher. */
export const ToastViewportWhenNeeded = (props: ComponentProps<typeof ToastViewport>) => {
  const { hasToasts } = useContext(ToastPresenceContext);
  if (!hasToasts) return null;
  return <ToastViewport {...props} />;
};
