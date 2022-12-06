import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import useWindowSize from "hooks/useWindowSize";
import { cls } from "lib/classname";
import Image from "next/image";
import React, { useState } from "react";
import { Button, Col, Collapse, Row } from "reactstrap";
import InlineLink from "../InlineLink";
import styles from "./Accordion.module.scss";

type Item = {
  title: string;
  text: string;
  image?: any;
  cta?: {
    text: string;
    link: string;
  };
};

interface Props {
  items: Item[];
  withImages?: boolean; // not compatible with multi open
  multiOpen?: boolean;
  initOpen?: boolean;
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

  return (
    <Row>
      <Col className={cls(styles.infos, props.withImages && styles.with_images)}>
        {props.items.map((item, i) => {
          const isItemOpen = isOpen(i);
          return (
            <div key={i}>
              <Button className={cls(styles.btn, isItemOpen && styles.open)} onClick={() => toggle(i)}>
                {item.title}
                <EVAIcon name="arrow-ios-downward-outline" fill="black" size={32} className={styles.icon} />
              </Button>
              <Collapse isOpen={isItemOpen}>
                <p className={styles.text}>{item.text}</p>

                {isTablet && props.withImages && item?.image && <Image src={item?.image} alt="" />}
                {item.cta && <InlineLink link={item.cta.link} text={item.cta.text} color="blue" />}
              </Collapse>
            </div>
          );
        })}
      </Col>
      {!isTablet && props.withImages && open.length > 0 && (
        <Col>{props.items[open[0]]?.image && <Image src={props.items[open[0]].image} alt="" />}</Col>
      )}
    </Row>
  );
};

export default Accordion;
