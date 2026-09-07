import {
  DispositifOrigin,
  type GetDispositifResponse,
  hasMarkdownContent,
  type Languages,
} from "@refugies-info/api-types";

/**
 * Markdown body of an RCO dispositif, in the language it was fetched with.
 *
 * Returns null for RI dispositifs, whose body is HTML in `what`.
 */
export const getDispositifMarkdown = (
  dispositif: GetDispositifResponse | null | undefined,
  language: string,
): string | null => {
  if (!dispositif?.origin || dispositif.origin === DispositifOrigin.RI) return null;
  if (dispositif.markdown) return dispositif.markdown;

  const translated = dispositif.translations?.[language as Languages]?.content;
  return hasMarkdownContent(translated) ? translated.markdown : null;
};
