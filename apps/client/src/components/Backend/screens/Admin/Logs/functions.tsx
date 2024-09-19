import { GetLogResponse } from "@refugies-info/api-types";
import { useSanitizedContent } from "hooks";

const getText = (log: GetLogResponse) => {
  if (!log.dynamicId) return log.text;

  const dynamicValue =
    log.dynamicId.nom || log.dynamicId.titreInformatif || log.dynamicId.username || log.dynamicId.langueFr || "";
  return log.text.replace("{{dynamic}}", `<strong>${dynamicValue}</strong>`);
};

export const LogText = (log: GetLogResponse) => {
  const safeText = useSanitizedContent(getText(log));
  return <div dangerouslySetInnerHTML={{ __html: safeText }}></div>;
};
