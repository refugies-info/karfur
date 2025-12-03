import type React from "react";
import TutoImg from "~/assets/dispositif/tutoriel-image.svg";
import Image from "~/components/UI/Image";
import styles from "./HelpCard.module.scss";

interface Props {
  title: string;
  children: string | React.ReactNode;
}

/**
 * Card which displays contextual help
 */
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
