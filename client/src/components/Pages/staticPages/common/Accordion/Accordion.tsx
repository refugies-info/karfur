import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import useWindowSize from "hooks/useWindowSize";
import { cls } from "lib/classname";
import Image from "next/legacy/image";
import React, { useState } from "react";
import { Button, Col, Collapse, Row } from "reactstrap";
import AutoplayVideo from "../AutoplayVideo";
import InlineLink from "../InlineLink";
import styles from "./Accordion.module.scss";

type Item = {
  title: string;
  text: string;
  image?: any;
  video?: string;
  youtube?: string;
  mediaWidth?: number;
  mediaHeight?: number;
  noShadow?: boolean;
  cta?: {
    text: string;
    link: string;
  };
  className?: string;
};

interface Props {
  items: Item[];
  withImages?: boolean; // not compatible with multi open
  multiOpen?: boolean;
  initOpen?: boolean;
  mediaAlign?: "right" | "center";
}

const Accordion = (props: Props) => {
  const [open, setOpen] = useState<number[]>(props.initOpen ? [0] : []);
  const { isTablet } = useWindowSize();
  const toggle = (id: number) => {
    if (props.multiOpen) {
      setOpen(open.includes(id) ? [...open.filter((i) => i !== id)] : [...open, id]);
    } else {
      setOpen([id]);
    }
  };

  const isOpen = (index: number) => {
    return open.includes(index);
  };

  const getMedia = (type: "image" | "video" | "youtube", item: Item) => {
    switch (type) {
      case "image":
        return <Image src={item?.image} alt="" height={item.mediaHeight} width={item.mediaWidth} />;
      case "video":
        return (
          <AutoplayVideo
            src={item.video}
            height={item.mediaHeight || 420}
            width={item.mediaWidth}
            noShadow={item.noShadow}
          />
        );
      case "youtube":
        return (
          <iframe
            width={item.mediaWidth || "560"}
            height={item.mediaHeight || "315"}
            src={item.youtube}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className={styles.youtube}
          ></iframe>
        );
    }
  };

  return (
    <Row>
      <Col className={cls(styles.infos, props.withImages && styles.with_images)}>
        {props.items.map((item, i) => {
          const isItemOpen = isOpen(i);
          return (
            <div key={i} className={cls(styles.container, item.className)}>
              <Button className={cls(styles.btn, isItemOpen && styles.open)} onClick={() => toggle(i)}>
                {item.title}
                <EVAIcon name="arrow-ios-downward-outline" fill="black" size={32} className={styles.icon} />
              </Button>
              <Collapse isOpen={isItemOpen}>
                <p
                  className={styles.text}
                  dangerouslySetInnerHTML={{
                    __html: item.text
                  }}
                ></p>

                {isTablet && props.withImages && (
                  <>
                    {item?.image && getMedia("image", item)}
                    {item?.video && <div className={styles.video}>{getMedia("video", item)}</div>}
                    {item?.youtube && getMedia("youtube", item)}
                  </>
                )}
                {item.cta && (
                  <div className={styles.cta}>
                    <InlineLink link={item.cta.link} text={item.cta.text} color="blue" />
                  </div>
                )}
              </Collapse>
            </div>
          );
        })}
      </Col>
      {!isTablet && props.withImages && open.length > 0 && (
        <Col
          className={cls(
            styles.media,
            props.mediaAlign === "center" ? styles.center : styles.right,
            props.items[open[0]]?.className
          )}
        >
          {props.items[open[0]]?.image && getMedia("image", props.items[open[0]])}
          {props.items[open[0]]?.video && getMedia("video", props.items[open[0]])}
          {props.items[open[0]]?.youtube && getMedia("youtube", props.items[open[0]])}
        </Col>
      )}
    </Row>
  );
};

export default Accordion;
