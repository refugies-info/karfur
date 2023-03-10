import React from "react";
import Image from "next/image";
import TutoImg from "assets/dispositif/tutoriel-image.svg";
import styles from "./HelpCard.module.scss";

interface Props {
  title: string;
  children: string | React.ReactNode;
}

const HelpCard = (props: Props) => {
  return (
    <div className={styles.container}>
      <Image src={TutoImg} width={47} height={32} alt="" />
      <p className={styles.title}>{props.title}</p>
      <div className={styles.content}>{props.children}</div>
    </div>
  );
};

export default HelpCard;
