import React from "react";
import FeedbackIllu from "assets/dispositif/feedback-illu.svg";
import styles from "./Feedback.module.scss";
import Image from "next/image";
import Button from "components/UI/Button";

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
        <Button secondary onClick={() => {}} className={styles.btn}>
          {props.nbMercis} mercis
        </Button>
      </div>
    </div>
  );
};

export default Feedback;
