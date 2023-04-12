import React, { useMemo } from "react";
import { useTranslation } from "next-i18next";
import { cls } from "lib/classname";
import { getPasswordStrength } from "lib/validatePassword";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import styles from "./PasswordStrength.module.scss";

interface Props {
  password: string;
}

const PasswordStrength = (props: Props) => {
  const { t } = useTranslation();
  const passwordStrength = useMemo(() => getPasswordStrength(props.password), [props.password]);

  return props.password ? (
    <div className={cls(styles.strength, "mt-4")}>
      {passwordStrength.isOk ? (
        <p className={cls(styles.ok, "fw-bold")}>
          <EVAIcon name="done-all-outline" fill={styles.vert2} size={20} className="me-2" />
          {t("Register.strong_password")}
        </p>
      ) : (
        <p className="fw-bold">
          <EVAIcon name="alert-triangle" fill={styles.orange} size={20} className="me-2" />
          {t("Register.weak_password")}
        </p>
      )}
      {passwordStrength.criterias.map((criteria, i) => (
        <p key={i} className={styles[criteria.isOk ? "ok" : "ko"]}>
          <EVAIcon
            name={criteria.isOk ? "checkmark-circle-2" : "close-circle"}
            fill={criteria.isOk ? styles.vert2 : styles.error}
            size={20}
            className="me-2"
          />
          {t(criteria.label, criteria.label)}
        </p>
      ))}
    </div>
  ) : (
    <></>
  );
};

export default PasswordStrength;
