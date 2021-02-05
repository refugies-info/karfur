import React from "react";
import { infoCardIcon } from "../../../components/Icon/Icon";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { DispositifContent } from "../../../types/interface";

interface Props {
  subitem: DispositifContent;
  disableEdit: boolean;
  availableCardTitles: {
    title: string;
    titleIcon: string;
    options?: string[];
  }[];
  t: any;
  isDropdownOpen: boolean;
  toggleDropdown: (e: any) => void;
}

export const CardHeaderContent = (props: Props) => {
  // in lecture mode, display title and icon or in edition when all types of infocard are already displayed
  if (props.disableEdit || props.availableCardTitles.length === 0) {
    return (
      <>
        {infoCardIcon(props.subitem.titleIcon, "#FFFFFF")}
        <span className="header-content">
          {props.subitem.title &&
            props.t("Dispositif." + props.subitem.title, props.subitem.title)}
        </span>
      </>
    );
  }
  // in edition mode
  return (
    <ButtonDropdown isOpen={props.isDropdownOpen} toggle={props.toggleDropdown}>
      {
        // title and icon
        <DropdownToggle caret={!props.disableEdit} className="header-value">
          <div className="icon-title">
            {infoCardIcon(props.subitem.titleIcon, "#FFFFFF")}
            <span className="header-content">{props.subitem.title}</span>
          </div>
        </DropdownToggle>
      }
      <DropdownMenu>
        {
          // drop down with the list of possible info cards
          props.availableCardTitles.map((cardTitle, key) => {
            return (
              <DropdownItem
                key={key}
                // @ts-ignore
                id={key}
              >
                <div className="icon-title">
                  {infoCardIcon(cardTitle.titleIcon)}
                  <span className="header-content">{cardTitle.title}</span>
                </div>
              </DropdownItem>
            );
          })
        }
      </DropdownMenu>
    </ButtonDropdown>
  );
};
