import { SimpleUser } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useMemo } from "react";
import AdminIcon from "~/assets/dispositif/crown.svg";
import DefaultAvatar from "~/assets/dispositif/default-avatar.png";
import { cls } from "~/lib/classname";
import styles from "./ContributorCard.module.scss";
import { getRole } from "./functions";

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
        alt={user.username || "user picture"}
        className={cls(styles.image, hasProfilePicture && styles.profile)}
      />
      <span className={styles.username}>{user.username || "Utilisateur"}</span>
      <span className={styles.role}>
        {t(`Roles.${role}`)}
        {role === "admin" && <Image src={AdminIcon} width={16} height={16} alt="" className="ms-2" />}
      </span>
    </div>
  );
};

export default ContributorCard;
