import EVAIcon from "@/components/UI/EVAIcon/EVAIcon";
import { colors } from "@/utils/colors";
import { useTranslation } from "next-i18next";
import { Button } from "reactstrap";
import styles from "./DropdownMenuMobile.module.scss";

interface Props {
  title: string;
  icon: string;
  close: () => void;
  reset: () => void;
  children: any;
  nbResults?: number;
  showFooter: boolean;
}

const DropdownMenuMobile = (props: Props) => {
  const { t } = useTranslation();
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>
          <span className={styles.icon}>
            <EVAIcon name={props.icon} />
          </span>
          <p className="h5">{props.title}</p>
        </div>

        <Button onClick={props.close} className={styles.close}>
          <EVAIcon name="close-outline" fill="dark" size={24} />
        </Button>
      </div>

      {props.children}

      {props.showFooter && (
        <div className={styles.footer}>
          <Button color="white" className={styles.reset} onClick={props.reset}>
            <EVAIcon name="refresh-outline" fill={colors.bleuCharte} className="me-2" />
            {t("Recherche.resetButton", "Réinitialiser")}
          </Button>
          <Button color="primary" className={styles.btn_search} onClick={props.close}>
            {props.nbResults ? t("Recherche.seeButton", "Voir les fiches", { count: props.nbResults }) : t("Valider")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default DropdownMenuMobile;
