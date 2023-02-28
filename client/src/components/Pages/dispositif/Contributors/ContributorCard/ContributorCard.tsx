import React from "react";
import Image from "next/image";
import { SimpleUser } from "api-types";
import DefaultAvatar from "assets/dispositif/default-avatar.png";
import { getRole } from "./functions";
import styles from "./ContributorCard.module.scss";

interface Props {
  user: SimpleUser;
}

const ContributorCard = ({ user }: Props) => {
  return (
    <div className={styles.container}>
      {/* TODO: handle image style */}
      <Image src={user.picture?.secure_url || DefaultAvatar} width={88} height={88} alt={user.username} />
      <span className={styles.username}>{user.username}</span>
      <span className={styles.role}>{getRole(user.roles)}</span>
    </div>
  );
};

export default ContributorCard;
