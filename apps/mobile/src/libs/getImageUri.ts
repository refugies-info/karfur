import Config from "./getEnvironment"

// temp function used to rebuild uri of a theme image
export const getImageUri = (imageUri: string) => {
  return imageUri.startsWith("/") ? (Config.siteUrl + imageUri) : imageUri
}
