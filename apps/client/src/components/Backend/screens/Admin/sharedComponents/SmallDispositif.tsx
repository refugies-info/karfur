import moment from "moment";
import { Dispositif } from "../AdminStructures/StructureDetailsModal/functions";
import styles from "./SmallDispositif.module.scss";
import { StyledStatus } from "./SubComponents";

interface Props {
  dispositif: Dispositif;
  onClick: () => void;
  bgColor?: boolean;
}

export const SmallDispositif = (props: Props) => {
  const { dispositif, onClick } = props;
  return (
    <div className={styles.container} onClick={onClick} style={props.bgColor ? { background: dispositif.color30 } : {}}>
      <div className={styles.title} style={{ color: dispositif.color }}>
        {dispositif.titreInformatif}
      </div>

      <div>
        <div>Créé le {moment(dispositif.created_at).format("LLL")}</div>
        {dispositif.creator && (
          <div>
            par <strong>{dispositif.creator.username || dispositif.creator.email}</strong>
          </div>
        )}
        {dispositif.hasCreatedStructure && (
          <div>
            <strong>Fiche ayant créé la structure</strong>
          </div>
        )}
      </div>
      <div className={styles.status}>
        <StyledStatus
          text={dispositif.status}
          textToDisplay={dispositif.hasDraftVersion ? "Nouvelle version en cours" : undefined}
        />
      </div>
    </div>
  );
};
