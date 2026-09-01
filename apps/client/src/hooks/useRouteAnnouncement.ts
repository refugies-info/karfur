import Router, { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { humanizeRoutePattern } from "~/lib/humanizeRoutePattern";

/** Id of the announcer paragraph, shared with `_document.tsx` which renders it. */
export const ROUTE_ANNOUNCER_ID = "route-announcer";

/**
 * Frame budget for the `<title>` wait. Frames, not a timer: the title lands
 * with the render cycle. See voiceover.md for the measured values.
 */
const TITLE_WAIT_MAX_FRAMES = 30;

/**
 * Routes whose page sets its own autofocus: the paragraph stays in sync but is
 * never focused, otherwise it steals the focus from the field. Update procedure
 * in documentation/client/accessibility/voiceover.md.
 */
const AUTOFOCUS_ROUTE_PATTERNS = new Set([
  // src/pages/auth/index.tsx l.162 - measured 25/08 (focus set on the email field)
  "/auth",
  // src/pages/auth/connexion.tsx l.97 - declared, not measured (redirects to /fr/auth without a session)
  "/auth/connexion",
  // src/pages/auth/inscription/index.tsx l.112 - declared, not measured (redirects without a session)
  "/auth/inscription",
  // src/components/User/EditPseudo/EditPseudo.tsx l.62 - declared, not measured (redirects without a session)
  "/auth/inscription/pseudo",
  // src/components/Pages/auth/CheckCode/CheckCode.tsx l.128 - declared, not measured (redirects without a session)
  "/auth/code-connexion",
  // src/components/Pages/auth/CheckCode/CheckCode.tsx l.128 - declared, not measured (redirects without a session)
  "/auth/code-securite",
  // src/components/User/ForgotPassword/ForgotPassword.tsx l.44 - measured 25/08 (focus set)
  "/auth/reinitialiser-mot-de-passe",
  // src/pages/auth/reinitialiser-mot-de-passe/nouveau.tsx l.122 and l.134 - declared;
  // measured 25/08 with NO focus set, kept as a precaution until the gap is explained
  "/auth/reinitialiser-mot-de-passe/nouveau",
]);

/**
 * Anchor navigation flag, shared with `useScrollToAnchor`: the anchor target
 * keeps the focus, so the paragraph stays out of that navigation. Set before
 * the `push`, consumed on `routeChangeComplete`, cleared in a `finally`.
 */
let anchorNavigationInProgress = false;

export const markAnchorNavigation = () => {
  anchorNavigationInProgress = true;
};

export const clearAnchorNavigation = () => {
  anchorNavigationInProgress = false;
};

const writeAnnouncement = (text: string, moveFocus: boolean) => {
  const paragraph = document.getElementById(ROUTE_ANNOUNCER_ID);
  if (!paragraph) return;
  // `focus()` on an already focused element emits nothing, so two navigations
  // in a row to the same title would only be announced once: blur and clear
  // first, so the restitution starts fresh.
  if (document.activeElement === paragraph) paragraph.blur();
  paragraph.textContent = "";
  paragraph.textContent = text;
  // `preventScroll`: sr-only pins neither top nor left, a scrolling focus would
  // jump the page and break browser back position restoration.
  if (moveFocus) paragraph.focus({ preventScroll: true });
};

/**
 * Announces page changes and repositions the focus on client navigations
 * (RGAA 12.8).
 *
 * Syncs the `sr-only` paragraph rendered by `_document.tsx` with the incoming
 * `<title>` and focuses it. Guards, autofocus exceptions and the measurements
 * behind them: documentation/client/accessibility/voiceover.md.
 *
 * @example
 * // Use inside _app.tsx
 * useRouteAnnouncement();
 */
const useRouteAnnouncement = () => {
  const router = useRouter();
  const generationRef = useRef(0);
  const lastRouteRef = useRef<{ pathname: string; locale?: string }>({
    pathname: "",
    locale: undefined,
  });

  useEffect(() => {
    lastRouteRef.current = { pathname: Router.pathname, locale: Router.locale };

    // Generation token: a navigation that supersedes another makes the pending
    // title wait stale, so only the last one writes.
    const handleRouteChangeStart = () => {
      generationRef.current += 1;
    };

    const waitForTitle = (generation: number) => {
      let frames = 0;
      const tick = () => {
        if (generationRef.current !== generation) return; // stale wait
        // Never compete with a page autofocus: sync without focusing.
        const moveFocus = !AUTOFOCUS_ROUTE_PATTERNS.has(Router.pathname);
        const title = document.title;
        if (title) {
          writeAnnouncement(title, moveFocus);
          return;
        }
        frames += 1;
        if (frames >= TITLE_WAIT_MAX_FRAMES) {
          const fallback = humanizeRoutePattern(Router.pathname);
          if (fallback) writeAnnouncement(fallback, moveFocus);
          return;
        }
        window.requestAnimationFrame(tick);
      };
      window.requestAnimationFrame(tick);
    };

    const handleRouteChangeComplete = (_url: string, { shallow }: { shallow: boolean }) => {
      const previous = lastRouteRef.current;
      lastRouteRef.current = { pathname: Router.pathname, locale: Router.locale };

      // The search page pushes a debounced shallow navigation on every
      // keystroke, which is not a page change.
      if (shallow) return;

      // Inter-page anchor (`/#newsletter` from the footer): the anchor target
      // keeps the focus. Consuming the flag restores ordinary behavior next time.
      if (anchorNavigationInProgress) {
        anchorNavigationInProgress = false;
        return;
      }

      // Only the locale changed on the same route: first-load language redirect
      // (Layout.tsx) or language modal validation, not a page change.
      if (Router.locale !== previous.locale && Router.pathname === previous.pathname) return;

      waitForTitle(generationRef.current);
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
    // Subscribe once on mount, same pattern as the _app.tsx subscriptions.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useRouteAnnouncement;
