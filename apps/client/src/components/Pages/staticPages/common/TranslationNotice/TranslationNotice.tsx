import Notice from "@codegouvfr/react-dsfr/Notice";
import { useLocale } from "~/hooks";

export const TranslationNotice = () => {
  const locale = useLocale();
  return locale === "fr" ? null : (
    <Notice isClosable title="Cette page est disponible uniquement en français." />
  );
};
