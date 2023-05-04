import React, { useState } from "react";
import { Input, Spinner } from "reactstrap";
import Image from "next/image";
import { Picture } from "api-types";
import API from "utils/API";
import { handleApiDefaultError } from "lib/handleApiErrors";
import Button from "components/UI/Button";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import styles from "./LogoInput.module.scss";

interface Props {
  id: string;
  image: Picture | undefined;
  onImageUploaded: (image: Picture | undefined) => void;
  label?: string;
  minHeight?: number;
  imageSize: number;
  dimensionsHelp?: string;
  labelNoBackground?: boolean;
  darkBackground?: boolean;
}

const LogoInput = (props: Props) => {
  const [uploading, setUploading] = useState(false);

  const handleFileInputChange = (event: any) => {
    setUploading(true);
    const formData = new FormData();
    // @ts-ignore
    formData.append(0, event.target.files[0]);

    API.postImage(formData)
      .then((data_res) => {
        const imgData = data_res.data.data;
        props.onImageUploaded({
          secure_url: imgData.secure_url,
          public_id: imgData.public_id,
          imgId: imgData.imgId,
        });
        setUploading(false);
      })
      .catch(handleApiDefaultError);
  };

  const deleteImage = (e: any) => {
    e.preventDefault();
    props.onImageUploaded(undefined);
  };

  return (
    <div>
      {props.label && (
        <label className="mb-2" htmlFor={props.id}>
          {props.label}
        </label>
      )}
      <div className={styles.container} style={{ minHeight: props.minHeight || 0 }}>
        {props.image?.secure_url ? (
          <div
            className={styles.image_container}
            style={props.imageSize ? { width: props.imageSize, height: props.imageSize } : {}}
          >
            {uploading && (
              <div className={styles.uploading}>
                <Spinner color="white" />
              </div>
            )}
            <Image
              src={props.image.secure_url}
              alt=""
              width={props.imageSize}
              height={props.imageSize}
              style={{ objectFit: "contain" }}
            />
            <EVAIcon
              name="close-circle"
              size={20}
              fill={styles.lightTextDefaultError}
              onClick={deleteImage}
              className={styles.delete}
            />
          </div>
        ) : (
          <>
            <Button evaIcon="download-outline" iconPosition="right" className="position-relative">
              <Input
                className={styles.file_input}
                type="file"
                id="picture"
                name="structure"
                accept="image/*"
                onChange={handleFileInputChange}
              />
              Télécharger un logo
            </Button>
          </>
        )}
      </div>
      <p className={styles.help}>{props.dimensionsHelp}</p>
    </div>
  );
};

export default LogoInput;
