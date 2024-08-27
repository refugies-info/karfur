import React from "react";
import Badge from "~/components/UI/Badge";
import EVAIcon from "~/components/UI/EVAIcon/EVAIcon";
import { cls } from "~/lib/classname";
import styles from "./PublicationSteps.module.scss";

type Item = {
  title: string;
  subtitle?: string | React.ReactNode;
  done?: boolean;
  notification?: boolean;
};

interface Props {
  items: Item[];
}

const PublicationSteps = (props: Props) => {
  return (
    <div className={styles.container}>
      {props.items.map((item, i) => (
        <div key={i} className={styles.item}>
          <EVAIcon
            name={item.done ? "checkmark-circle-2" : "radio-button-off"}
            size={24}
            fill={styles.lightBorderPlainInfo}
            className={cls("me-2", styles.icon)}
          />
          <div>
            <p className={styles.title}>{item.title}</p>
            {item.subtitle && <div className={styles.subtitle}>{item.subtitle}</div>}
            {item.notification && (
              <Badge severity="info" icon="ri-notification-4-line" small className={cls(styles.badge, "mt-2")}>
                Notification par mail
              </Badge>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PublicationSteps;
