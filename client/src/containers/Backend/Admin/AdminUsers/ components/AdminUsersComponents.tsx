import React from "react";
import checkStyles from "scss/components/checkbox.module.scss";
import { cls } from "lib/classname";
import styles from "./AdminUsersComponent.module.scss";
import { Button } from "reactstrap";
import { GetLanguagesResponse } from "api-types";
interface RoleProps {
  role: string;
}

export const Role = (props: RoleProps) => <div className={styles.role}>{props.role}</div>;

interface LangueFlagProps {
  langue: string;
}

export const LangueFlag = (props: LangueFlagProps) => (
  <div className={styles.langue}>
    <span className={"fi fi-" + props.langue} title={props.langue} id={props.langue} key={props.langue} />
  </div>
);

interface RoleCheckBoxProps {
  name: string;
  isSelected: boolean;
  handleCheckBoxChange: (arg: string) => void;
}

export const RoleCheckBox = (props: RoleCheckBoxProps) => (
  <div className={cls(styles.role_checkbox, props.isSelected && styles.selected)}>
    <label className={cls(checkStyles.checkbox, checkStyles.v2, checkStyles.reverse)}>
      <input onChange={() => props.handleCheckBoxChange(props.name)} type="checkbox" checked={props.isSelected} />
      <span className={checkStyles.checkmark}></span>
    </label>
    <span className={styles.role_name}>{props.name}</span>
  </div>
);

interface LangueDetailProps {
  langue: { langueCode: string; langueFr: string };
}
export const LangueDetail = (props: LangueDetailProps) => (
  <div className={styles.langue}>
    <div style={{ marginRight: "8px" }}>
      <span
        className={"fi fi-" + props.langue.langueCode}
        title={props.langue.langueCode}
        id={props.langue.langueCode}
        key={props.langue.langueCode}
      />
    </div>
    {props.langue.langueFr === "Persan" ? "Persan/Dari" : props.langue.langueFr}
  </div>
);

interface LangueButtonProps {
  langue: GetLanguagesResponse;
  onClick: () => void;
  valid?: boolean;
}
export const LangueButton = (props: LangueButtonProps) => (
  <Button className={cls(styles.langue, styles.btn, props.valid && styles.valid)} onClick={props.onClick}>
    <span style={{ marginRight: "8px" }}>
      <span
        className={"fi fi-" + props.langue.langueCode}
        title={props.langue.langueCode}
        id={props.langue.langueCode}
        key={props.langue.langueCode}
      />
    </span>
    {props.langue.langueFr === "Persan" ? "Persan/Dari" : props.langue.langueFr}
  </Button>
);
