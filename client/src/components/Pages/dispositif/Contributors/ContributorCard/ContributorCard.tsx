import React from "react";
import Image from "next/image";
import { SimpleUser } from "api-types";
import DefaultAvatar from "assets/dispositif/default-avatar.png";
import { cls } from "lib/classname";
import { getRole } from "./functions";
import AdminIcon from "assets/dispositif/admin-icon.svg";
import styles from "./ContributorCard.module.scss";

interface Props {
  user: SimpleUser;
}

const ContributorCard = ({ user }: Props) => {
  const role = getRole(user.roles);
  const hasProfilePicture = !!user.picture?.secure_url;
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
        {role}
        {role === "Admin" && <Image src={AdminIcon} width={24} height={24} alt="" className="ms-2" />}
      </span>
    </div>
  );
};

export default ContributorCard;
