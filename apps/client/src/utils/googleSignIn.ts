import { GoogleOAuthProvider } from "google-oauth-gsi";
import { logger } from "logger";

export const googleProvider = process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_CLIENT_ID ?
  new GoogleOAuthProvider({
    clientId: process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_CLIENT_ID,
    onScriptLoadError: () => logger.info("[GoogleOAuth] error loading script"),
  }) : null;
