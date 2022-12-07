import React, { useState } from "react";
import { Col, Input, Row, Spinner } from "reactstrap";
import API from "utils/API";
import FButton from "../FButton";
import emptyImage from "assets/empty-image.svg";
import styles from "./ImageInput.module.scss";
import Image from "next/legacy/image";
import { Picture } from "types/interface";
import { cls } from "lib/classname";

interface Props {
  onImageUploaded: (image: Picture) => void;
  image: Picture | undefined;
  minHeight?: number;
  imageSize?: number;
  dimensionsHelp?: string;
  labelNoBackground?: boolean
  darkBackground?: boolean
}

const AdminThemeButton = (props: Props) => {
  const [uploading, setUploading] = useState(false);

  const handleFileInputChange = (event: any) => {
    setUploading(true);
    const formData = new FormData();
    // @ts-ignore
    formData.append(0, event.target.files[0]);

    API.set_image(formData).then((data_res: any) => {
      const imgData = data_res.data.data;
      props.onImageUploaded({
        secure_url: imgData.secure_url,
        public_id: imgData.public_id,
        imgId: imgData.imgId,
      });
      setUploading(false);
    });
  };

  return (
    <>
      <Row className={cls(props.darkBackground && styles.dark)} style={{ minHeight: props.minHeight || 0 }}>
        <Col className={styles.col}>
          <div>
            <div
              className={styles.image_container}
              style={props.imageSize ? { width: props.imageSize, height: props.imageSize } : {}}
            >
              {uploading &&
                <div className={styles.uploading}>
                  <Spinner color="white" />
                </div>
              }
              <Image src={props.image?.secure_url || emptyImage} alt="" layout="fill" objectFit="contain" />
            </div>
          </div>
        </Col>
        <Col className={styles.col}>
          <div className={props.labelNoBackground ? "bg-transparent" : ""}>
            <div>
              <FButton type="fill-dark" name="upload-outline" className="position-relative">
                <Input
                  className={styles.file_input}
                  type="file"
                  id="picture"
                  name="structure"
                  accept="image/*"
                  onChange={handleFileInputChange}
                />
                {props.image?.secure_url ? <span>Choisir une autre image</span> : <span>Choisir une image</span>}
              </FButton>
              <p className={styles.help}>{props.dimensionsHelp}</p>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default AdminThemeButton;
