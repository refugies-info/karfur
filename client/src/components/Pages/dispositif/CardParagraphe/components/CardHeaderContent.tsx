import React from "react";
import { infoCardIcon } from "components/Icon/Icon";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { DispositifContent } from "types/interface";
import styles from "./CardHeaderContent.module.scss";

interface Props {
  subitem: DispositifContent;
  disableEdit: boolean;
  availablecardTitles: {
    title: string;
    titleIcon: string;
    options?: string[];
  }[];
  t: any;
  isDropdownOpen: boolean;
  toggleDropdown: any;
  typeContenu: "dispositif" | "demarche";
}

const getTitle = (
  initialTitle: string | undefined,
  typeContenu: "dispositif" | "demarche"
) => {
  if (initialTitle && ["Titre de séjour", "Acte de naissance OFPRA"].includes(initialTitle))
    return "Impossible sans";

  if (typeContenu === "demarche" && initialTitle === "Zone d'action")
    return "Localisation";

  return initialTitle;
};
export const CardHeaderContent = (props: Props) => {
  // we change the header of the infocards for demarches for acte de naissance, titre de séjour and zone d'action
  const title = getTitle(props.subitem.title, props.typeContenu);
  // in lecture mode, display title and icon or in edition when all types of infocard are already displayed
  if (
    props.disableEdit ||
    props.availablecardTitles.length === 0 ||
    (props.subitem.title === "Zone d'action" &&
      props.typeContenu === "demarche")
  ) {
    return (
      <>
        {infoCardIcon(props.subitem.titleIcon, "#FFFFFF")}
        <span className={styles.header_content}>
          {title && props.t("Dispositif." + title, title)}
        </span>
      </>
    );
  }

  // in edition mode
  return (
    <ButtonDropdown isOpen={props.isDropdownOpen} toggle={props.toggleDropdown}>
      {
        // title and icon
        <DropdownToggle caret={!props.disableEdit} className={styles.header_value}>
          <div className={styles.icon_title}>
            {infoCardIcon(props.subitem.titleIcon, "#FFFFFF")}
            <span className={styles.header_content}>{title}</span>
          </div>
        </DropdownToggle>
      }
      <DropdownMenu>
        {
          // drop down with the list of possible info cards
          props.availablecardTitles.map((cardTitle, key) => {
            return (
              <DropdownItem
                key={key}
                // @ts-ignore
                id={key}
              >
                <div className={styles.icon_title}>
                  {infoCardIcon(cardTitle.titleIcon)}
                  <span className={styles.header_content}>{cardTitle.title}</span>
                </div>
              </DropdownItem>
            );
          })
        }
      </DropdownMenu>
    </ButtonDropdown>
  );
};
