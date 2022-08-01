import React from "react";
import Image from "next/image";
import { Responsable, SimplifiedCreator } from "types/interface";
import marioProfile from "assets/mario-profile.jpg";
import styles from "../Admin.module.scss";
import { cls } from "lib/classname";
import { StyledStatus } from "./SubComponents";

export const UserButton = (props: {
  user?: Responsable | SimplifiedCreator | null;
  onClick?: () => void;
  condensed?: boolean;
  noImage?: boolean;
  text?: string;
  tags?: string[];
}) => {
  return (
    <div
      className={cls(styles.details_button, !props.onClick && styles.disabled)}
      onClick={props.onClick}
    >
      {!props.noImage &&
        <Image
          className={styles.user_img}
          src={props.user?.picture?.secure_url || marioProfile}
          alt="creator image"
          width={20}
          height={20}
          objectFit="contain"
        />
      }
      {props.user && (
        <p className={styles.text}>
          <strong className="mx-1">{props.user.username}</strong>
          {!props.condensed && ("| " + props.user.email)}
        </p>
      )}
      {props.text && (
        <p className={cls(styles.text, "w-100 text-center")}>
          <strong>{props.text}</strong>
        </p>
      )}
      {props.tags && (
        <div>
          {props.tags.map((tag, i) => {
            return (
              <StyledStatus
                key={i}
                text={tag}
                textToDisplay={tag}
                disabled
              />
            )
            })}
        </div>
      )}
    </div>
  );
};
