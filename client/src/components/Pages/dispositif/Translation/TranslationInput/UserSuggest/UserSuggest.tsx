import Image from "next/image";
import { cls } from "lib/classname";
import GoogleLogo from "assets/dispositif/google.svg";
import UserAvatar from "assets/mario-profile.jpg";
import Crown from "assets/dispositif/crown.svg";
import styles from "./UserSuggest.module.scss";

interface Props {
  username: string;
  picture: "me" | "google" | "user";
  isBig?: boolean;
}

const UserSuggest = (props: Props) => {
  return (
    <div className={cls(styles.container, props.isBig && styles.big)}>
      <span className={styles.image}>
        {props.picture === "me" && (
          <Image src={Crown} width={props.isBig ? 21 : 16} height={props.isBig ? 21 : 16} alt="" />
        )}
        {props.picture === "google" && (
          <Image src={GoogleLogo} width={props.isBig ? 21 : 16} height={props.isBig ? 21 : 16} alt="" />
        )}
        {props.picture === "user" && (
          <Image src={UserAvatar} width={props.isBig ? 32 : 24} height={props.isBig ? 32 : 24} alt="" />
        )}
      </span>
      <span className="ms-2">{props.username}</span>
    </div>
  );
};

export default UserSuggest;
