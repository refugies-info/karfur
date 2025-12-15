import type { Picture } from "@refugies-info/api-types";
import { ImageSchema } from "~/typegoose/generics";

/** 1-to-1 mapping from the DTO coming from the form to our Typegoose schema */
export const pictureToImageSchema = (p?: Picture | null): ImageSchema | null => {
  if (!p) return null; // nothing to save
  return Object.assign(new ImageSchema(), {
    secure_url: p.secure_url,
    public_id: p.public_id ?? "", // keep TS happy – DB field is required
    imgId: p.imgId ?? "",
  });
};
