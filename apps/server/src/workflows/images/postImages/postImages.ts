import { PostImageResponse } from "@refugies-info/api-types";
import cloudinary from "cloudinary";
import { InvalidRequestError } from "~/errors";
import logger from "~/logger";
import { ImageModel } from "~/typegoose";
import { ResponseWithData } from "~/types/interface";

export const postImages = async (files: any): ResponseWithData<PostImageResponse> => {
  logger.info("[postImages] received a call");
  const file = files[0];
  if (!file) throw new InvalidRequestError("Invalid request");
  const originalFilename = file?.originalFilename || null;
  // @ts-ignore
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
