import React from "react";
import Image from "next/image";
import { cls } from "lib/classname";
import Button from "components/UI/Button";
import FeedbackIllu from "assets/dispositif/feedback-illu.svg";
import ThumbUpIcon from "assets/dispositif/thumb-up.svg";
import ThumbDownIcon from "assets/dispositif/thumb-down.svg";
import styles from "./Feedback.module.scss";

interface Props {
  nbMercis: number;
}

const Feedback = (props: Props) => {
  return (
    <div className={styles.container}>
      <Image src={FeedbackIllu} width={287} height={204} alt="" className={styles.illu} />
      <div className={styles.content}>
        <p className={styles.title}>Vous avez trouvé cette fiche utile ?</p>
        <p>Remerciez les contributeurs qui l’ont rédigée et traduite pour vous !</p>
        <Button secondary onClick={() => {}} className={cls(styles.btn, "me-2")}>
          <Image src={ThumbUpIcon} width={24} height={24} alt="" className="me-2" />
          {props.nbMercis} mercis
        </Button>
        <Button secondary onClick={() => {}} className={styles.btn}>
          <Image src={ThumbDownIcon} width={24} height={24} alt="" />
        </Button>
      </div>
    </div>
  );
};

export default Feedback;
