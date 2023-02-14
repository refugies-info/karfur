import { GetLogResponse } from "api-types";

const getText = (log: GetLogResponse) => {
  if (!log.dynamicId) return log.text;

  const dynamicValue =
    log.dynamicId.nom || log.dynamicId.titreInformatif || log.dynamicId.username || log.dynamicId.langueFr || "";
  return log.text.replace("{{dynamic}}", `<strong>${dynamicValue}</strong>`);
};

export const getLogText = (log: GetLogResponse) => {
  const text = getText(log);
  return <div dangerouslySetInnerHTML={{ __html: text }}></div>;
};
