import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import React, { useCallback } from "react";
import SearchButton from "./SearchButton";
import styles from "./SearchDropdown.module.css";

interface Props {
  icon: string;
  label: string;
  values: string[];
  open: boolean;
  setOpen: (open: boolean) => void;
  resetFilter: () => void;
}

const SearchDropdown: React.FC<React.PropsWithChildren<Props>> = ({
  icon,
  label,
  values,
  children,
  resetFilter,
  open,
  setOpen,
}) => {
  const onClickCross = useCallback(() => {
    resetFilter();
  }, [resetFilter]);

  return (
    <DropdownMenu.Root open={open} onOpenChange={() => setOpen(!open)}>
      <SearchButton open={open} icon={icon} label={label} values={values} onClickCross={onClickCross} />
      <DropdownMenu.Portal>
        <DropdownMenu.Content className={styles.menu} avoidCollisions side="bottom" align="start" sideOffset={2}>
          {children}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default SearchDropdown;
