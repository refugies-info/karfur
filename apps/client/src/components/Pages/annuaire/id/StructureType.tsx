import { useTranslations } from "next-intl";
import styles from "./StructureType.module.scss";

interface Props {
  type: string;
}
export const StructureType = (props: Props) => {
  const t = useTranslations();

  return <div className={styles.container}>{t("StructureType." + props.type, props.type)}</div>;
};
