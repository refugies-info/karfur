import * as Sentry from "@sentry/nextjs";
import "@refugies-info/sentry/client";

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
