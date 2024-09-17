import { fr } from "@codegouvfr/react-dsfr";
import { useMemo } from "react";
import styles from "./Camembert.module.scss";

interface Props {
  progress: number;
}

const Camembert = (props: Props) => {
  const degrees = useMemo(() => props.progress * 360, [props.progress]);

  return (
    <div className={styles.container}>
      <div
        className={styles.progress}
        style={{
          background: `conic-gradient(${fr.colors.decisions.background.actionHigh.blueFrance.active} ${degrees}deg, white ${degrees}deg, white 360deg)`,
        }}
      ></div>
    </div>
  );
};

export default Camembert;
