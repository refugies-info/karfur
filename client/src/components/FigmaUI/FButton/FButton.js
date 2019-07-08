import React, {Component} from 'react';

import './FButton.scss';
import EVAIcon from '../../UI/EVAIcon/EVAIcon';

class FButton extends Component { //Je passe par une classe parce que le bouton d'impression passe des refs dans ses "children"
  render() {
    //Possible types: default, dark, validate, outline (retour, en blanc), outline-black, pill (vocal), light-action (light-PDF), theme (ac couleur de theme dark)
    let {type, className, fill, name, size, ...bProps}= this.props;
    return (
      <button className={'figma-btn ' + type + ' ' + className + (type === "theme" ? " backgroundColor-darkColor" : "")} {...bProps}>
        {name && 
          <EVAIcon name={name} fill={fill} size={size} className={this.props.children ? "mr-10" : ""} />}
        {this.props.children}
      </button>
    )
  }
};

export default FButton;