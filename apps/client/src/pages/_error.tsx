import * as Sentry from "@sentry/nextjs";
import type { NextPageContext } from "next";

interface ErrorPageProps {
  statusCode?: number;
}

const ErrorPage = ({ statusCode }: ErrorPageProps) => (
  <div>
    <h1>Une erreur est survenue</h1>
    {statusCode ? <p>Erreur {statusCode}</p> : null}
  </div>
);

ErrorPage.getInitialProps = async (contextData: NextPageContext): Promise<ErrorPageProps> => {
  // Attaches the request context to the event and avoids duplicates,
  // unlike a bare Sentry.captureException(err).
  await Sentry.captureUnderscoreErrorException(contextData);

  const { res, err } = contextData;
  return {
    statusCode: res?.statusCode ?? err?.statusCode ?? 500,
  };
};

export default ErrorPage;
