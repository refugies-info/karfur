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
  useRef,
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

/**
 * Délai entre la fermeture d'un toast et le démontage du viewport, pour laisser
 * l'animation de sortie se dérouler (`hide 100ms` dans `Toast.module.scss`).
 *
 * Le retrait de la clé est porté par la branche « fermé » de l'effet, jamais par
 * son nettoyage : un nettoyage retirerait la clé dès le changement d'état et le
 * délai n'existerait pas. Seul le démontage du composant retire immédiatement.
 */
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
      return;
    }
    const timer = setTimeout(() => setToastOpen(cle, false), DUREE_SORTIE_MS);
    return () => clearTimeout(timer);
  }, [cle, open, setToastOpen]);

  // Le démontage du composant, lui, retire la clé sans délai : il n'y a plus
  // rien à animer. Cet effet est séparé pour que son nettoyage ne se déclenche
  // pas au simple changement de `open`.
  useEffect(() => () => setToastOpen(cle, false), [cle, setToastOpen]);
};

/**
 * Viewport Radix, monté seulement quand au moins un toast est à afficher.
 *
 * Exception : on le garde monté tant qu'il porte le focus. À la fermeture d'un
 * toast au clavier, Radix exécute `viewport?.focus()` ; démonter derrière lui
 * ferait tomber le focus sur `<body>`. On attend donc que le focus soit sorti
 * de la zone. C'est le comportement actuel de production dans ce seul cas, et
 * la zone n'est alors pas un repère vide puisqu'elle porte le focus.
 */
export const ToastViewportWhenNeeded = (props: ComponentProps<typeof ToastViewport>) => {
  const { hasToasts } = useContext(ToastPresenceContext);
  const [monte, setMonte] = useState(false);
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    if (hasToasts) {
      setMonte(true);
      return;
    }
    const zone = ref.current?.parentElement ?? ref.current;
    if (!zone?.contains(document.activeElement)) {
      setMonte(false);
      return;
    }
    const surSortieDuFocus = (event: FocusEvent) => {
      if (!zone.contains(event.relatedTarget as Node | null)) setMonte(false);
    };
    zone.addEventListener("focusout", surSortieDuFocus);
    return () => zone.removeEventListener("focusout", surSortieDuFocus);
  }, [hasToasts]);

  if (!monte) return null;
  return <ToastViewport ref={ref} {...props} />;
};
