import React from 'react';

import { Input, InputGroup, InputGroupAddon } from 'reactstrap';

import EVAIcon from '../../UI/EVAIcon/EVAIcon';

import './FInput.scss';
import variables from 'scss/colors.scss';

const FInput = props => (
  <InputGroup className="mb-10 figma-input-group">
    {props.prepend && 
      <InputGroupAddon addonType="prepend" className="icon-prepend">
        <EVAIcon name={props.prependName} fill={props.prependFill || variables.noir} />
      </InputGroupAddon>}
    <Input 
      autoFocus 
      id={props.id} 
      type={props.type} 
      placeholder={props.placeholder}
      value={props.value} 
      onChange={props.onChange} 
      autoComplete={props.autoComplete}
      disabled={props.disabled}
      className={[props.inputClassName, props.prepend ? "has-prepend" : ""].join(" ")} />
    {props.append && 
      <InputGroupAddon addonType="append" className="icon-append" onClick={props.onAppendClick}>
        <EVAIcon name={props.appendName} fill={props.appendFill || variables.noir} />
      </InputGroupAddon>}
  </InputGroup>
)

export default FInput;