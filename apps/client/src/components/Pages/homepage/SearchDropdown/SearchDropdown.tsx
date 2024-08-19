import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import React, { useCallback, useState } from "react";
import SearchButton from "./SearchButton";
import styles from "./SearchDropdown.module.css";

interface Props {
  icon: string;
  label: string;
  values: string[];
  resetFilter: () => void;
}

const SearchDropdown: React.FC<React.PropsWithChildren<Props>> = ({ icon, label, values, children, resetFilter }) => {
  const [open, setOpen] = useState(false);

  const onClickCross = useCallback(() => {
    resetFilter();
  }, [resetFilter]);

  return (
    <DropdownMenu.Root open={open} onOpenChange={() => setOpen((o) => !o)}>
      <SearchButton open={open} icon={icon} label={label} values={values} onClickCross={onClickCross} />
      <DropdownMenu.Portal>
        <DropdownMenu.Content className={styles.menu} avoidCollisions>
          {children}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default SearchDropdown;
