import type { Picture } from "@refugies-info/api-types";
import type { ImageType } from "@refugies-info/mongo";

/**
 * Converts a mongo ImageType (or partial/null) to an api-types Picture
 * Handles the case where imgId and public_id may be null in the database
 * but are required in the Picture type
 */
export function toPicture(image: ImageType | null | undefined): Picture {
  if (!image) {
    // Return a minimal valid Picture when image is null/undefined
    return {
      imgId: null,
      public_id: null,
      secure_url: "",
    };
  }

  return {
    imgId: image.imgId ?? null,
    public_id: image.public_id ?? null,
    secure_url: image.secure_url,
  };
}
