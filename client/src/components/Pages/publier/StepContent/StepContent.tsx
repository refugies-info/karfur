import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./StepContent.module.scss";
import InlineLink from "../InlineLink";
import { cls } from "lib/classname";
import { useInView } from "react-intersection-observer";

interface Props {
  step: number;
  title: string;
  texts: string[];
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
}

const StepContent = (props: Props) => {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [refVideo, inViewVideo] = useInView({ threshold: 1 });
  const [isPlaying, setIsPlaying] = useState(false);

  const setRefs = useCallback(
    (node) => {
      ref.current = node;
      refVideo(node);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [inViewVideo]
  );

  useEffect(() => {
    if (inViewVideo && !isPlaying) {
      ref.current?.play();
      setIsPlaying(true);
    }
  }, [inViewVideo, isPlaying]);

  return (
    <div className={cls(styles.row, props.dottedLine && styles.dotted)}>
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
        {props.cta && <InlineLink link={props.cta.link} text={props.cta.text} color="orange" />}
        {props.buttonStep && <div className={styles.btn_step}>{props.buttonStep}</div>}
      </div>

      <div className={styles.media}>
        {props.image && (
          <Image src={props.image} alt="" width={props.width || 550} height={props.height} objectFit="contain" />
        )}
        {props.video && (
          <video ref={setRefs} height={props.height || 320} loop muted className={styles.video}>
            <source src={props.video} type="video/mp4" />
          </video>
        )}
      </div>
    </div>
  );
};

export default StepContent;
