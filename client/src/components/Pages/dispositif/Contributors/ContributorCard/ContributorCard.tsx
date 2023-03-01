import React from "react";
import Image from "next/image";
import { SimpleUser } from "api-types";
import DefaultAvatar from "assets/dispositif/default-avatar.png";
import { getRole } from "./functions";
import AdminIcon from "assets/dispositif/admin-icon.svg";
import styles from "./ContributorCard.module.scss";

interface Props {
  user: SimpleUser;
}

const ContributorCard = ({ user }: Props) => {
  const role = getRole(user.roles);
  return (
    <div className={styles.container}>
      {/* TODO: handle image style */}
      <Image src={user.picture?.secure_url || DefaultAvatar} width={88} height={88} alt={user.username} />
      <span className={styles.username}>{user.username}</span>
      <span className={styles.role}>
        {role}
        {role === "Admin" && <Image src={AdminIcon} width={24} height={24} alt="" className="ms-2" />}
      </span>
    </div>
  );
};

export default ContributorCard;
