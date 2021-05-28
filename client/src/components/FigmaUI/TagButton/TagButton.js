import React from "react";

import "./TagButton.scss";
import EVAIcon from "../../UI/EVAIcon/EVAIcon";

const fSearchBtn = (props) => {
  let {
    className,
    desactiver,
    active,
    color,
    lighter,
    noHover,
    filter,
    ...bProps
  } = props;

  let onCrossClick = (e) => {
    e.stopPropagation();
    desactiver();
  };

  return (
    <button
      className={
        (noHover ? "static-btn " : filter ? "filter-btn" : "search-btn ") +
        (className || "") +
        //(active ? " active" : "") +
        (color ? " color bg-" + color : "") +
        (lighter ? " lighter" : "")
      }
      {...bProps}
    >
      {props.children}
      {active && (
        <EVAIcon
          className={"ml-10"}
          fill={filter ? "black" : ""}
          name="close-outline"
          onClick={onCrossClick}
        />
      )}
    </button>
  );
};
// style={{backgroundColor: color, border: "none"}}
export default fSearchBtn;
