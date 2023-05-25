import React, { useMemo } from "react";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { SimpleUser } from "@refugies-info/api-types";
import DefaultAvatar from "assets/dispositif/default-avatar.png";
import { cls } from "lib/classname";
import { getRole } from "./functions";
import AdminIcon from "assets/dispositif/crown.svg";
import styles from "./ContributorCard.module.scss";

interface Props {
  user: SimpleUser;
}

const ContributorCard = ({ user }: Props) => {
  const { t } = useTranslation();
  const role = useMemo(() => getRole(user.roles), [user]);
  const hasProfilePicture = useMemo(() => !!user.picture?.secure_url, [user]);

  return (
    <div className={styles.container}>
      <Image
        src={user.picture?.secure_url || DefaultAvatar}
        width={88}
        height={88}
        alt={user.username}
        className={cls(styles.image, hasProfilePicture && styles.profile)}
      />
      <span className={styles.username}>{user.username}</span>
      <span className={styles.role}>
        {t(`Roles.${role}`)}
        {role === "admin" && <Image src={AdminIcon} width={16} height={16} alt="" className="ms-2" />}
      </span>
    </div>
  );
};

export default ContributorCard;
