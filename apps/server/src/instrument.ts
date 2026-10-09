import * as Sentry from "@sentry/node";
import { config } from "dotenv";

config();

const { NODE_ENV, SENTRY_DSN } = process.env;
const environment = NODE_ENV || "dev";

Sentry.init({
  dsn: SENTRY_DSN,
  environment,
  ignoreErrors: ["dev", "development"].includes(environment) ? ["EADDRINUSE"] : [],
  enabled: !!SENTRY_DSN,
  tracesSampleRate: NODE_ENV === "production" ? 0.1 : 1.0,
});
