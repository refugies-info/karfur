import Image from "next/image";
import React, { ReactElement } from "react";
import { cls } from "lib/classname";
import AutoplayVideo from "components/Pages/staticPages/AutoplayVideo";
import InlineLink from "../InlineLink";
import styles from "./StepContent.module.scss";

interface Props {
  step: number;
  title: string;
  texts: string[];
  color: "orange" | "purple";
  cta?: {
    text: string;
    link: string;
  };
  image?: any;
  video?: string;
  dottedLine?: boolean;
  width?: number;
  height?: number;
  buttonStep?: string;
  buttonStepEnd?: boolean;
  footer?: ReactElement;
}

const StepContent = (props: Props) => {
  return (
    <div className={cls(styles.row, styles[props.color], props.dottedLine && styles.dotted)}>
      <div className={cls(styles.content, !!props.buttonStep && styles.has_btn_step)}>
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
        {props.cta && <InlineLink link={props.cta.link} text={props.cta.text} color={props.color} />}
        {props.footer}
        {props.buttonStep && (
          <div className={cls(styles.btn_step, props.buttonStepEnd && styles.last)}>{props.buttonStep}</div>
        )}
      </div>

      <div className={styles.media}>
        {props.image && (
          <Image src={props.image} alt="" width={props.width || 550} height={props.height} objectFit="contain" />
        )}
        {props.video && <AutoplayVideo src={props.video} height={props.height || 320} />}
      </div>
    </div>
  );
};

export default StepContent;
