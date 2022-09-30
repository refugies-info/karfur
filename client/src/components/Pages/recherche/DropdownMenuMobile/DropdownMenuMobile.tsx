import React from "react";
import { Button } from "reactstrap";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { colors } from "colors";
import styles from "./DropdownMenuMobile.module.scss";

interface Props {
  title: string;
  icon: string;
  close: () => void;
  reset: () => void;
  children: any;
}

const DropdownMenuMobile = (props: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>
          <span className={styles.icon}>
            <EVAIcon name={props.icon} />
          </span>
          <p className="h4">{props.title}</p>
        </div>

        <Button onClick={props.close} className={styles.close}>
          <EVAIcon name="close-outline" fill="dark" />
        </Button>
      </div>

      {props.children}

      <div className={styles.footer}>
        <Button color="white" className={styles.reset} onClick={props.reset}>
          <EVAIcon name="refresh-outline" fill={colors.bleuCharte} className="mr-2" />
          Réinitialiser
        </Button>
        <Button color="primary" className={styles.btn_search} onClick={props.close}>
          Voir les fiches
        </Button>
      </div>
    </div>
  );
};

export default DropdownMenuMobile;
