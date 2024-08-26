import useLocale from "@/hooks/useLocale";
import { GetThemeResponse } from "@refugies-info/api-types";
import ThemeIcon from "../ThemeIcon";
import styles from "./TagName.module.scss";

interface Props {
  theme: GetThemeResponse;
  colored?: boolean;
  size?: number;
}

const TagName = (props: Props) => {
  const locale = useLocale();

  return (
    <span className={styles.container} style={props.colored ? { color: props.theme.colors.color100 } : {}}>
      <span className={styles.icon}>
        <ThemeIcon
          theme={props.theme}
          color={props.colored ? props.theme.colors.color100 : undefined}
          size={props.size}
        />
      </span>
      <span className={styles.name} style={props.size ? { minHeight: props.size } : {}}>
        {props.theme.short[locale] || ""}
      </span>
    </span>
  );
};

export default TagName;
