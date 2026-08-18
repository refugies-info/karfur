import * as Sentry from "@sentry/node";
import { config } from "dotenv";

config();

const { NODE_ENV, SENTRY_DSN } = process.env;

Sentry.init({
  dsn: SENTRY_DSN,
  environment: NODE_ENV || "dev",
  enabled: !!SENTRY_DSN,
  tracesSampleRate: NODE_ENV === "production" ? 0.1 : 1.0,
});
