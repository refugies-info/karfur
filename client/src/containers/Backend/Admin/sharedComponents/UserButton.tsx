import React, { useMemo } from "react";
import Image from "next/image";
import { Link } from "react-router-dom";
import marioProfile from "assets/mario-profile.jpg";
import styles from "../Admin.module.scss";
import { cls } from "lib/classname";
import { StyledStatus } from "./SubComponents";
import { SimpleUser } from "api-types";

export const UserButton = (props: {
  user?: SimpleUser | null;
  onClick?: () => void;
  link?: any;
  condensed?: boolean;
  noImage?: boolean;
  text?: string;
  tags?: string[];
  wrap?: boolean;
}) => {
  const { noImage, user, text, tags, condensed } = props;
  const buttonContent = useMemo(
    () => (
      <>
        {!noImage && (
          <Image
            className={styles.user_img}
            src={user?.picture?.secure_url || marioProfile}
            alt="creator image"
            width={20}
            height={20}
            style={{ objectFit: "contain" }}
          />
        )}
        {user && (
          <p className={styles.text}>
            <strong className="mx-1">{user.username}</strong>
            {!condensed && "| " + user.email}
          </p>
        )}
        {text && (
          <p className={cls(styles.text, "w-100 text-center")}>
            <strong>{text}</strong>
          </p>
        )}
        {tags && (
          <div className={styles.tags}>
            {tags.map((tag, i) => (
              <StyledStatus key={i} text={tag} textToDisplay={tag} disabled />
            ))}
          </div>
        )}
      </>
    ),
    [noImage, user, text, tags, condensed]
  );

  if (props.link) {
    return (
      <Link
        className={cls(styles.details_button, !props.onClick && styles.disabled, !!props.wrap && styles.wrap)}
        to={props.link}
      >
        {buttonContent}
      </Link>
    );
  }
  return (
    <div
      className={cls(styles.details_button, !props.onClick && styles.disabled, !!props.wrap && styles.wrap)}
      onClick={props.onClick}
    >
      {buttonContent}
    </div>
  );
};
