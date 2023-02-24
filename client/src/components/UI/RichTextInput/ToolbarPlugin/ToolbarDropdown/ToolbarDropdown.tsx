import { ReactElement, useCallback, useState } from "react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
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
      className={styles.dropdown}
      isOpen={menuOpen}
      toggle={toggleMenu}
      aria-controls={menuOpen ? props.name : undefined}
      aria-haspopup="true"
      aria-expanded={menuOpen ? "true" : undefined}
    >
      <DropdownToggle disabled={props.disabled} title={props.title} className={styles.toggle}>
        {props.toggleElement}
        <EVAIcon fill="dark" name="chevron-down-outline" className="ms-2" />
      </DropdownToggle>
      <DropdownMenu id={props.name} className={styles.menu}>
        {props.items.map((item, i) => (
          <DropdownItem key={i} onClick={item.onClick} active={item.selected}>
            <EVAIcon fill="dark" name={item.icon} className="me-2" />
            {item.text}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default ToolbarDropdown;
