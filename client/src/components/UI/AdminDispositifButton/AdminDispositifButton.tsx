import { StyledStatus } from "containers/Backend/Admin/sharedComponents/SubComponents";
import { cls } from "lib/classname";
import React from "react";
import { SimplifiedDispositif } from "types/interface";
import styles from "./AdminDispositifButton.module.scss";

interface Props {
  dispositif: SimplifiedDispositif;
  onPress: () => void;
}

const AdminDispositifButton = (props: Props) => {
  const colors = props.dispositif.theme.colors;
  return (
    <button onClick={props.onPress} className={cls(styles.btn)} style={{ background: colors.color30 }}>
      <div style={{ color: colors.color100 }}>{props.dispositif.titreInformatif}</div>

      <div className={styles.infos}>
        <div>
          <p>
            Créé le <strong>{props.dispositif.created_at}</strong>
          </p>
          <p>
            par <strong>{props.dispositif.creatorId?.username}</strong>
          </p>
        </div>
        <div>
          <StyledStatus text={props.dispositif.status} />
        </div>
      </div>
    </button>
  );
};

export default AdminDispositifButton;
