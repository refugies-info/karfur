import React, { ReactElement, useMemo } from "react";
import Image from "next/legacy/image";
import { cls } from "lib/classname";
import AutoplayVideo from "../AutoplayVideo";
import InlineLink from "../InlineLink";
import styles from "./StepContent.module.scss";
import useWindowSize from "hooks/useWindowSize";

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
  const { isTablet } = useWindowSize();

  const buttonStep = useMemo(
    () => <div className={cls(styles.btn_step, props.buttonStepEnd && styles.last)}>{props.buttonStep}</div>,
    [props.buttonStep, props.buttonStepEnd]
  );

  return (
    <div
      className={cls(
        styles.row,
        styles[props.color],
        props.dottedLine && styles.dotted,
        !!props.buttonStep && styles.has_btn_step
      )}
    >
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
        {props.cta && <InlineLink link={props.cta.link} text={props.cta.text} color={props.color} />}
        {props.footer}
        {!isTablet && props.buttonStep && buttonStep}
      </div>

      <div className={styles.media}>
        {props.image && (
          <Image src={props.image} alt="" width={props.width || 550} height={props.height} objectFit="contain" />
        )}
        {props.video && <AutoplayVideo src={props.video} height={props.height || 320} />}
      </div>
      {isTablet && props.buttonStep && buttonStep}
    </div>
  );
};

export default StepContent;
