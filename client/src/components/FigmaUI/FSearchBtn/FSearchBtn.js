import React from 'react';

import './FSearchBtn.scss';
import EVAIcon from '../../UI/EVAIcon/EVAIcon';

const fSearchBtn = props => {
  let {className, desactiver, active, color, ...bProps}= props;

  let onCrossClick = e => {
    e.stopPropagation();
    desactiver();
  }
  console.log(color);
  return(
    <button className={'search-btn ' + (className || '') + (active ? " active" : "") + (color ? " color bg-"+color : "")}  {...bProps}>
      {props.children}
      {active && 
        <EVAIcon className="ml-10" name="close-outline" onClick={onCrossClick} />}
    </button>
  )
};
// style={{backgroundColor: color, border: "none"}}
export default fSearchBtn;