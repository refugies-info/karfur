import { ReactElement, useCallback, useState } from "react";
import { Dropdown, DropdownMenu, DropdownToggle } from "reactstrap";
import ToolbarButton from "../ToolbarButton";
import styles from "./ToolbarDropdown.module.scss";

interface Props {
  name: string;
  title: string;
  disabled?: boolean;
  toggleElement?: ReactElement;
  items: {
    text: string;
    icon: string;
    onClick: () => void;
    selected?: boolean;
  }[];
}

const ToolbarDropdown = (props: Props) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = useCallback(() => setMenuOpen((o) => !o), [setMenuOpen]);

  return (
    <Dropdown
      isOpen={menuOpen}
      toggle={toggleMenu}
      aria-controls={menuOpen ? props.name : undefined}
      aria-haspopup="true"
      aria-expanded={menuOpen ? "true" : undefined}
    >
      <DropdownToggle disabled={props.disabled} title={props.title} className={styles.toggle}>
        {props.toggleElement}
      </DropdownToggle>
      <DropdownMenu id={props.name} className={styles.menu}>
        {props.items.map((item, i) => (
          <ToolbarButton
            key={i}
            onClick={() => {
              item.onClick();
              toggleMenu();
            }}
            isPressed={item.selected}
            hasSelectedIcon={true}
            icon={item.icon}
            text={item.text}
            className={"w-100 mb-1"}
          ></ToolbarButton>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default ToolbarDropdown;
