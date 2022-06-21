import { Log } from "types/interface";

export const getLogText = (log: Log) => {
  if (!log.dynamicId) return <div>{log.text}</div>;

  const dynamicValue = log.dynamicId.nom || log.dynamicId.titreInformatif || log.dynamicId.username || log.dynamicId.langueFr || "";
  return (
    <div
      dangerouslySetInnerHTML={
        { __html: log.text.replace("{{dynamic}}", `<strong>${dynamicValue}</strong>`) }
      }
    ></div>
  )
}
