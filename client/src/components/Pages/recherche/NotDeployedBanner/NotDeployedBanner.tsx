import React, { memo } from "react";
import Image from "next/image";
import NotDeployed from "assets/recherche/not_deployed_image.png";
import styles from "./NotDeployedBanner.module.scss";

interface Props {
}

const NotDeployedBanner = (props: Props) => {

  return (
    <div className={styles.container}>
      <div className={styles.image}>
        <Image
          src={NotDeployed}
          width={146}
          height={71}
          alt=""
        />
      </div>
      <div>
        <p className="mb-2 font-weight-bold">Ce département est en cours de déploiement !</p>
        <p className="mb-0">Réfugiés.info est collaboratif, alimenté directement par les acteurs associatifs, les bénévoles et les intervenants sociaux. Aidez-nous à l’enrichir ! Rédiger une fiche</p>
      </div>
      <div>

      </div>
    </div>
  );
};

export default memo(NotDeployedBanner);
