import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./AutoplayVideo.module.scss";
import { useInView } from "react-intersection-observer";

interface Props {
  src: string;
  height: number;
}

const AutoplayVideo = (props: Props) => {
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
    <video ref={setRefs} height={props.height} loop muted className={styles.video}>
      <source src={props.src} type="video/mp4" />
    </video>
  );
};

export default AutoplayVideo;
