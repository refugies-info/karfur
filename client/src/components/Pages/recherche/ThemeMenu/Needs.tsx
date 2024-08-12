import Separator from "components/UI/Separator";
import React from "react";
import Need from "./Need";
import styles from "./Needs.module.css";

const Needs: React.FC = () => {
  return (
    <div className={styles.container}>
      <Need label="Tous" />
      <Separator />
    </div>
  );
};

export default Needs;
