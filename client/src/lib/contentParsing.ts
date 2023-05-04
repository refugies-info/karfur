export const getCalloutTranslationKey = (level: "info" | "important") => {
  switch (level) {
    case "info":
      return "callout_info"
    case "important":
      return "callout_important"
  }
}

interface ToParse {
  nodeAttr: string;
  translation: string;
}

export const translationParsing = (originalHTML: string, toParse: ToParse[]) => {
  let parsedHTML = originalHTML;
  for (const parsing of toParse) {
    parsedHTML = parsedHTML.replace(parsing.nodeAttr, `${parsing.nodeAttr} data-title='${parsing.translation}'`)
  }
  return parsedHTML
}
