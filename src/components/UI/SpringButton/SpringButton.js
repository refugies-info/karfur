import React, { useState, useRef } from 'react';
import { useTransition, useSpring, useChain, config, animated } from 'react-spring'
import { Container, Item } from './styles'

import './SpringButton.css';

export default function SpringButton(props) {
  const [open, set] = useState(false)
  const [items, setItems] = useState([1,2,3,4])

  const springRef = useRef()
  const { width,height, opacity, ...rest } = useSpring({
    ref: springRef,
    config: config.stiff,
    from: { width: '200px',height: '100px', background: 'turquoise' },
    to: { width: open ? '200px' : '200px', height: open ? '100px' : '100px', background: open ? 'white' : 'turquoise' }
  })

  const transRef = useRef()
  const transitions = useTransition(open ? props.element.children : [], item => item.name, {
    ref: transRef,
    unique: true,
    trail: 400 / props.element.children.length,
    from: { opacity: 0, transform: 'scale(0)' },
    enter: { opacity: 1, transform: 'scale(1)' },
    leave: { opacity: 0, transform: 'scale(0)' }
  })
  const title_transition = useTransition(!open ? props.element:'', item => item.name, {
    trail: 10,
    from: { opacity: 0, transform: 'scale(0)' },
    enter: { opacity: 1, transform: 'scale(1)' },
    leave: { opacity: 0, transform: 'scale(0)' }
  })

  // This will orchestrate the two animations above, comment the last arg and it creates a sequence
  useChain(open ? [springRef, transRef] : [transRef, springRef], [0, open ? 0.1 : 0.6])
  
  return (
    <Container className="styledButton" style={{ ...rest,  width: width, height: height }} onClick={() => set(open => !open)}>
      {title_transition.map(({ item, props, key }) =>
        <animated.div key={key} style={props}>{item.name}</animated.div>
      )}
      {transitions.map(({item, key, props}) => {return (
        <Item key={key} style={{ ...props, background: item.css }}>
          {item.name}
        </Item>
        )}
      )}
    </Container>
  );
}

