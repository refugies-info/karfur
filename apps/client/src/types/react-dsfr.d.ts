// Only in TypeScript projects
import type { DsfrLink } from "~/components/UI/DsfrLink";

declare module "@codegouvfr/react-dsfr/next-pagesdir" {
  interface RegisterLink {
    Link: typeof DsfrLink;
  }
}
