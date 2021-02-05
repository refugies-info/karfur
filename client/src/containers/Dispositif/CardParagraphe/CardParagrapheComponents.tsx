import React, { useState } from "react";
import {
  Tooltip,
  Input,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { DispositifContent } from "../../../types/interface";

export const GeolocTooltipItem = (props: any) => {
  const { item, id } = props;
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const toggle = () => setTooltipOpen(!tooltipOpen);

  return (
    <>
      <button
        key={id + "d"}
        id={"Tooltip-" + id}
        className={"backgroundColor-darkColor active "}
      >
        {item.split(" ")[0].length > 1
          ? item.split(" ")[0]
          : "0" + item.split(" ")[0]}
      </button>
      <Tooltip
        placement="top"
        offset="0px, 8px"
        isOpen={tooltipOpen}
        target={"Tooltip-" + id}
        toggle={toggle}
      >
        {item}
      </Tooltip>
    </>
  );
};

interface AgeRequisEditionContentTitleProps {
  subitem: DispositifContent;
  changeAge: (arg1: any, arg2: any, arg3: any, arg4: any) => void;
  keyValue: number;
  subkey: number;
}

export const AgeRequisEditionContentTitle = (
  props: AgeRequisEditionContentTitleProps // case Age Requis
) => (
  <span>
    {props.subitem.contentTitle &&
      props.subitem.contentTitle.split("**").map((x, i, arr) => (
        <React.Fragment key={i}>
          <span>{x}</span>
          {i < arr.length - 1 && (
            <Input
              type="number"
              className="color-darkColor age-input"
              value={
                (arr[0] === "De " && i === 0) || arr[0] === "Plus de "
                  ? props.subitem.bottomValue
                  : props.subitem.topValue
              }
              onClick={(e: { stopPropagation: () => void }) =>
                e.stopPropagation()
              }
              onMouseUp={() =>
                (props.subitem || {}).isFakeContent &&
                props.changeAge(
                  { target: { value: "" } },
                  props.keyValue,
                  props.subkey,
                  i === 0 || arr[0] === "Plus de"
                )
              }
              onChange={(e) =>
                props.changeAge(
                  e,
                  props.keyValue,
                  props.subkey,
                  (arr[0] === "De " && i === 0) || arr[0] === "Plus de "
                )
              }
            />
          )}
        </React.Fragment>
      ))}
  </span>
);

const jsUcfirst = (string: string, title: string) => {
  if (title === "Public visé" && string && string.length > 1) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  return string;
};
interface DropDownContentProps {
  isOptionsOpen: boolean;
  toggleOptions: (e: any) => void;
  disableEdit: boolean;
  subitem: DispositifContent;
  changeAge: (arg1: any, arg2: any, arg3: any, arg4: any) => void;
  keyValue: number;
  subkey: number;
  t: any;
  cardTitle: { title: string; options: string[] };
}
export const DropDownContent = (props: DropDownContentProps) => (
  <ButtonDropdown
    isOpen={props.isOptionsOpen}
    toggle={props.toggleOptions}
    className="content-title"
  >
    <DropdownToggle caret={!props.disableEdit}>
      {props.subitem.title === "Âge requis" ? (
        <AgeRequisEditionContentTitle
          subitem={props.subitem}
          keyValue={props.keyValue}
          subkey={props.subkey}
          changeAge={props.changeAge}
        />
      ) : (
        <span>
          {props.subitem.contentTitle &&
            jsUcfirst(
              props.t(
                "Dispositif." + props.subitem.contentTitle,
                props.subitem.contentTitle
              ),
              props.cardTitle.title
            )}
        </span>
      )}
    </DropdownToggle>
    <DropdownMenu>
      {props.cardTitle.options.map((option, key: number) => {
        return (
          //@ts-ignore
          // eslint-disable-next-line react/jsx-no-undef
          <DropdownItem key={key} id={key}>
            {props.cardTitle ? jsUcfirst(option, props.cardTitle.title) : ""}
          </DropdownItem>
        );
      })}
    </DropdownMenu>
  </ButtonDropdown>
);
