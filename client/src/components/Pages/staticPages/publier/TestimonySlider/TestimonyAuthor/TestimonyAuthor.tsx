import Image from "next/image";
import React from "react";
import styles from "./TestimonyAuthor.module.scss";

interface Props {
  name: string;
  position: string;
  image: any;
}

const TestimonyAuthor = (props: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.image}>
        <Image src={props.image} alt={props.name} width={64} height={64} />
      </div>
      <div className={styles.infos}>
        <div className={styles.name}>{props.name}</div>
        <div>{props.position}</div>
      </div>
    </div>
  );
};

export default TestimonyAuthor;
