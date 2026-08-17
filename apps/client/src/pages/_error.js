import * as Sentry from "@sentry/nextjs";

export default function ErrorPage({ statusCode }) {
  return (
    <div>
      <h1>Une erreur est survenue</h1>
      {statusCode && <p>Erreur {statusCode}</p>}
    </div>
  );
}

ErrorPage.getInitialProps = async (contextData) => {
  // Attaches the request context to the event and avoids duplicates,
  // unlike a bare Sentry.captureException(err).
  await Sentry.captureUnderscoreErrorException(contextData);

  const { res, err } = contextData;
  return {
    statusCode: res?.statusCode ?? err?.statusCode ?? 500,
  };
};
