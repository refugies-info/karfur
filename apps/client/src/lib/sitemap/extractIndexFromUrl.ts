export const extractIndexFromUrl = (urlPath: string) => {
  return urlPath.replace(".xml", "").replace("sitemap-index-", "");
}
