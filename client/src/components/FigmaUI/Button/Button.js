import React from 'react';

import './Button.scss';
import EVAIcon from '../../UI/EVAIcon/EVAIcon';

const button = (props) => {
  let {type, className, ...bProps}=props;
  return (
    <button className={'figma-btn ' + props.type + ' ' + props.className} {...bProps}>
      {props.name && 
        <EVAIcon name={props.name} fill={props.fill} size={props.size} className="mr-10" />}
      {props.children}
    </button>
  )
};

export default button;