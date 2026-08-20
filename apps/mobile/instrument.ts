import * as Sentry from "@sentry/react-native";

// Passer à true pour tracer l'activité du SDK dans la console Metro.
const SENTRY_DEBUG = false;

// Ne pas déstructurer process.env : babel-preset-expo n'inline que les accès
// membres `process.env.EXPO_PUBLIC_*`, une déstructuration resterait undefined.
Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  environment: process.env.EXPO_PUBLIC_ENV_NAME,
  enabled: !!process.env.EXPO_PUBLIC_SENTRY_DSN,
  debug: SENTRY_DEBUG,
  tracesSampleRate: process.env.EXPO_PUBLIC_ENV_NAME === "production" ? 0.1 : 1.0,
  // En mode debug le SDK logue dans la console, et l'intégration Breadcrumbs
  // recapture ces logs : la récursion sature la stack (EXC_BAD_ACCESS). On coupe
  // les breadcrumbs console uniquement dans ce mode, ils restent actifs sinon.
  beforeBreadcrumb: (breadcrumb) =>
    SENTRY_DEBUG && breadcrumb.category === "console" ? null : breadcrumb,
});
