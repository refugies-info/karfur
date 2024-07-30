import { fr } from "@codegouvfr/react-dsfr";
import { useIsDark } from "@codegouvfr/react-dsfr/useIsDark";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { cls } from "lib/classname";
import styles from "./Checkbox.module.scss";

interface Props {
  children: any;
  checked: boolean;
  disabled?: boolean;
  color?: string;
  onChange?: () => void;
  className?: string;
  id?: string;
  tabIndex?: number;
}

const Checkbox = (props: Props) => {
  const { isDark } = useIsDark();
  const theme = fr.colors.getHex({ isDark });
  return (
    <div className={cls(styles.checkbox, props.className)}>
      <input
        id={props.id}
        type="checkbox"
        defaultChecked={props.checked}
        onChange={props.onChange}
        tabIndex={props.tabIndex}
      />
      <span className={styles.check}>
        <EVAIcon
          name={props.checked ? "checkmark-square-2" : "square-outline"}
          fill={
            props.disabled
              ? theme.decisions.text.disabled.grey.default
              : theme.decisions.text.actionHigh.blueFrance.default
          }
          size="large"
        />
      </span>
      <label htmlFor={props.id}>{props.children}</label>
    </div>
  );
};

export default Checkbox;
