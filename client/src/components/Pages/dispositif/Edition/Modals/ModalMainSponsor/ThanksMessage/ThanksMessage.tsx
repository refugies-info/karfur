import React from "react";
import Image from "next/image";
import ThanksModalImage from "assets/dispositif/thanks-modal-image.svg";
import styles from "./ThanksMessage.module.scss";

interface Props {}

const ThanksMessage = (props: Props) => {
  return (
    <div>
      <p>
        Nous allons désormais contacter et valider cette structure grâce aux informations que vous nous avez données.
      </p>
      <div className="text-center">
        <Image src={ThanksModalImage} width={274} height={160} alt="" />
      </div>
    </div>
  );
};

export default ThanksMessage;
