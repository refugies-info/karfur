import type { PostImageResponse } from "@refugies-info/api-types";
import cloudinary from "cloudinary";
import { InvalidRequestError } from "~/errors";
import logger from "~/logger";
import { ImageModel } from "~/typegoose";
import type { ResponseWithData } from "~/types/interface";

/**
 * Interface for uploaded file.
 *
 * We use this interface because express-form-data doesn't provide a proper type for the files.
 */
export interface UploadedFile {
  originalFilename: string;
  path: string;
}

export const postImages = async (files: UploadedFile[]): ResponseWithData<PostImageResponse> => {
  logger.info("[postImages] received a call");
  const file = files[0];
  if (!file) throw new InvalidRequestError("Invalid request");
  const originalFilename = file?.originalFilename || null;
  // @ts-expect-error cloudinary type mismatch
  const imgData = await cloudinary.uploader.upload(file.path, "", { folder: "/pictures" });

  if (!imgData) throw new Error("Error while uploading");
  const image = {
    format: imgData.format,
    height: imgData.height,
    width: imgData.width,
    original_filename: originalFilename,
    public_id: imgData.public_id,
    secure_url: imgData.secure_url,
    signature: imgData.signature,
    url: imgData.url,
    version: imgData.version,
  };

  const imageDb = await ImageModel.create(image);
  return {
    text: "success",
    data: {
      imgId: imageDb._id.toString(),
      public_id: imgData.public_id,
      secure_url: imgData.secure_url,
    },
  };
};
