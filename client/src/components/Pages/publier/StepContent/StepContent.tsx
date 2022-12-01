import Image from "next/image";
import React from "react";
import styles from "./StepContent.module.scss";
import InlineLink from "../InlineLink";
import { cls } from "lib/classname";

interface Props {
  step: number;
  title: string;
  texts: string[];
  cta?: {
    text: string;
    link: string;
  };
  image?: any;
  dottedLine?: boolean;
}

const StepContent = (props: Props) => {
  return (
    <div className={cls(styles.row, props.dottedLine && styles.dotted)}>
      <div className={cls(styles.content)}>
        <div className={styles.step}>{props.step}</div>
        <h3
          className={styles.title}
          dangerouslySetInnerHTML={{
            __html: props.title
          }}
        ></h3>
        {props.texts.map((text, i) => (
          <p key={i} className={styles.text}>
            {text}
          </p>
        ))}
        {props.cta && <InlineLink link={props.cta.link} text={props.cta.text} color="orange" />}
      </div>
      <div className={styles.image}>
        <div>
          <Image src={props.image} alt="" width={550} objectFit="contain" />
        </div>
      </div>
    </div>
  );
};

export default StepContent;
