import React from "react";
import { Input } from "reactstrap";
import { colors } from "colors";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import styles from "./CustomSearchBar.module.scss";
interface Props {
  placeholder: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  value: string;
  withMargin?: boolean;
}

export const CustomSearchBar = (props: Props) => (
  <div className={`${styles.container} ${!props.withMargin && styles.no_margin}`}>
    <Input
      onChange={props.onChange}
      type="text"
      plaintext={true}
      placeholder={props.placeholder}
      value={props.value}
      className={styles.input}
    />
    <EVAIcon
      name="search-outline"
      fill={colors.noir}
      id="bookmarkBtn"
      size="large"
    />
  </div>
);
