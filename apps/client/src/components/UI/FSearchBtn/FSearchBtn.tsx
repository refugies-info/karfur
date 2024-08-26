import EVAIcon from "@/components/UI/EVAIcon/EVAIcon";
import { cls } from "@/lib/classname";
import styles from "./FSearchBtn.module.scss";

interface Props {
  className?: string;
  active?: boolean;
  color?: string;
  iconCallback?: any;
  children?: any;
  inHeader?: boolean;
  filter?: boolean;
  extraPadding?: boolean;
  withMargins?: boolean;
  searchOption?: boolean;
  noHover?: boolean;
  lighter?: boolean;
  smallFont?: boolean;
  noIcon?: boolean;
  [x: string]: any;
}

/**
 * @deprecated replace by FilterButton or FButton
 */
const FSearchBtn = (props: Props) => {
  let {
    className,
    active,
    color,
    inHeader,
    children,
    filter,
    extraPadding,
    withMargins,
    searchOption,
    noHover,
    lighter,
    smallFont,
    iconCallback,
    noIcon,
    ...bProps
  } = props;

  return (
    <button
      className={cls(
        styles.search_btn,
        !!active && styles.active,
        !!inHeader && styles.in_header,
        !!filter && styles.filter,
        !!lighter && styles.lighter,
        !!extraPadding && styles.extra_padding,
        !!withMargins && styles.with_margins,
        !!searchOption && styles.search_option,
        !!noHover && styles.no_hover,
        !!smallFont && styles.small_font,
        !!color && styles.color,
        className || "",
      )}
      {...bProps}
      style={{ backgroundColor: color || "" }}
    >
      {children}
      {active && !noIcon && (
        <EVAIcon
          className="ms-2"
          name="close-outline"
          fill={filter ? "black" : ""}
          onClick={props.iconCallback || null}
        />
      )}
    </button>
  );
};

export default FSearchBtn;
