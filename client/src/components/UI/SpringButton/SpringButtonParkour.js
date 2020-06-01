import React, { useState, useRef } from "react";
import { useTransition, useSpring, useChain, config } from "react-spring";
import { Container, Item } from "./styles";

import "./SpringButton.css";

export default function SpringButtonParkour(props) {
  const [open, set] = useState(true);

  const springRef = useRef();
  const { size, opacity, ...rest } = useSpring({
    ref: springRef,
    config: config.stiff,
    from: { size: "33%", background: "transparent" },
    to: {
      size: open ? "100%" : "33%",
      background: open ? "transparent" : "transparent",
    },
  });

  const transRef = useRef();
  const transitions = useTransition(
    open ? props.element.children : [],
    (_, key) => key,
    {
      ref: transRef,
      unique: true,
      trail: 400 / props.element.children.length,
      from: { opacity: 0, transform: "scale(0)" },
      enter: { opacity: 1, transform: "scale(1)" },
      leave: { opacity: 0, transform: "scale(0)" },
    }
  );

  // This will orchestrate the two animations above, comment the last arg and it creates a sequence
  useChain(open ? [springRef, transRef] : [transRef, springRef], [
    0,
    open ? 0.1 : 0.6,
  ]);

  const _toggleButtons = (key, item) => {
    set((open) => !open);
    props.setValue(key, item);
  };

  return (
    <>
      <Container style={{ ...rest, width: size, height: size }}>
        {transitions.map(({ item, key, props }) => (
          <Item
            key={item.name}
            onClick={() => _toggleButtons(key, item)}
            style={{ ...props }}
          >
            <span>{(item || {}).name}</span>
          </Item>
        ))}
      </Container>
    </>
  );
}
