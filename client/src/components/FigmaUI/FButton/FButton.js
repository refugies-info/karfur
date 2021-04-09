import React, { Component } from "react";

import "./FButton.scss";
import EVAIcon from "../../UI/EVAIcon/EVAIcon";

const defaultProps = {
  type: "default",
  tag: "button",
};

class FButton extends Component {
  //Je passe par une classe parce que le bouton d'impression passe des refs dans ses "children"
  render() {
    //Possible types: default, dark, validate, outline (retour, en blanc), outline-black, pill (vocal), light-action (light-PDF), theme (ac couleur de theme dark), error (rouge), help (rouge clair), login and signup (blue), white (white background, black hover) and validate-light, edit
    let {
      type,
      className,
      fill,
      name,
      size,
      filter,
      tag: Tag,
      ...bProps
    } = this.props;
    if (bProps.href && Tag === "button") {
      Tag = "a";
    }
    return (
      <Tag
        className={
          "figma-btn " +
          (filter ? "filter-fbutton " : "") +
          (type || "") +
          " " +
          (className || "") +
          (type === "theme" ? " backgroundColor-darkColor" : "")
        }
        {...bProps}
      >
        {name && (
          <EVAIcon
            name={name}
            fill={fill}
            size={size}
            className={this.props.children ? "mr-10" : ""}
          />
        )}
        {this.props.children}
      </Tag>
    );
  }
}

FButton.defaultProps = defaultProps;

export default FButton;
