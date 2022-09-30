import React, { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import FButton from "components/UI/FButton";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import NotDeployed from "assets/recherche/not_deployed_image.png";
import iconMap from "assets/recherche/icon-map.svg";
import styles from "./NotDeployedBanner.module.scss";

interface Props {
  departments: string[];
  hideBanner: () => void;
}

const NotDeployedBanner = (props: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.image}>
        <Image src={NotDeployed} width={146} height={71} alt="" />
      </div>
      <div>
        <p className={styles.title}>
          <span className={styles.map_icon}>
            <Image src={iconMap} width={16} height={16} alt="" />
          </span>
          <span className="ml-1">{props.departments.join(", ")} : ce département est en cours de déploiement !</span>
        </p>
        <p className="mb-0">
          Réfugiés.info est collaboratif, alimenté directement par les acteurs associatifs, les bénévoles et les
          intervenants sociaux. Aidez-nous à l’enrichir !{" "}
          <Link href="/comment-contribuer">
            <a className={styles.link}>Rédiger une fiche</a>
          </Link>
        </p>
      </div>
      <div className={styles.actions}>
        <FButton type="white" className={styles.btn} onClick={props.hideBanner}>
          J'ai compris
          <EVAIcon name="close-outline" fill="dark" className="ml-2" />
        </FButton>
      </div>
    </div>
  );
};

export default memo(NotDeployedBanner);
