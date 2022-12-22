import React, { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { isIOS } from "react-device-detect";
import { cls } from "lib/classname";
import styles from "./AutoplayVideo.module.scss";

interface Props {
  src: string | undefined;
  height: number;
  width?: number;
  noShadow?: boolean;
}

const AutoplayVideo = (props: Props) => {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [refVideo, inViewVideo] = useInView({ threshold: 1 });
  const [isPlaying, setIsPlaying] = useState<string | undefined>(undefined);

  const setRefs = useCallback(
    (node: any) => {
      ref.current = node;
      refVideo(node);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [inViewVideo]
  );

  useEffect(() => {
    if (inViewVideo) {
      if (!isPlaying) {
        // first play
        ref.current?.play();
        setIsPlaying(props.src);
      } else if (isPlaying !== props.src) {
        // change src
        ref.current?.load();
        ref.current?.play();
        setIsPlaying(props.src);
      }
    }
  }, [inViewVideo, isPlaying, props.src]);

  if (!props.src) return <></>;
  return (
    <video
      ref={setRefs}
      height={props.height}
      width={props.width}
      loop
      muted
      playsInline={isIOS}
      className={cls(styles.video, props.noShadow && styles.no_shadow)}
    >
      <source src={props.src} type="video/mp4" />
    </video>
  );
};

export default AutoplayVideo;
