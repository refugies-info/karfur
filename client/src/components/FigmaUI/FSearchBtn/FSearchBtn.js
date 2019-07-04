import React from 'react';

import './FSearchBtn.scss';
import EVAIcon from '../../UI/EVAIcon/EVAIcon';

const fSearchBtn = props => {
  let {className, desactiver, active, ...bProps}= props;

  let onCrossClick = e => {
    e.stopPropagation();
    desactiver();
  }
  return(
    <button className={'search-btn ' + (className || '') + (active ? " active" : "")} {...bProps}>
      {props.children}
      {active && 
        <EVAIcon className="ml-10" name="close-outline" onClick={onCrossClick} />}
    </button>
  )
};

export default fSearchBtn;