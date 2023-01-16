import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import FButton from "components/UI/FButton/FButton";
import { members } from "data/members";
import type { Member } from "data/members";
import styles from "./Team.module.scss";

interface MemberProps {
  member: Member;
}
const MemberCard = (props: MemberProps) => {
  const [isHover, setIsHover] = useState(false);
  const { t } = useTranslation();

  return (
    <div className={styles.member_container}>
      <div
        className={styles.member_card}
        style={{
          backgroundColor: isHover ? props.member.borderColor : props.member.color,
          borderColor: props.member.borderColor
        }}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        {isHover ? (
          <div className={styles.link}>
            {props.member.portfolio && (
              <FButton
                target="_blank"
                href={props.member.portfolio}
                type="white"
                className="mb-2 mt-2"
                name="external-link-outline"
              >
                {t("QuiSommesNous.Portfolio", "Portfolio ")}
              </FButton>
            )}
            {props.member.linkedin && (
              <FButton
                target="_blank"
                href={props.member.linkedin}
                type="white"
                className="mb-2  mt-2"
                name="linkedin-outline"
              >
                Linkedin
              </FButton>
            )}
            {props.member.twitter && (
              <FButton
                target="_blank"
                href={props.member.twitter}
                type="white"
                className="mb-2 mt-2"
                name="twitter-outline"
              >
                Twitter
              </FButton>
            )}
            {props.member.autre && (
              <FButton
                target="_blank"
                href={props.member.autre}
                type="white"
                className="mb-2  mt-2"
                name="external-link-outline"
              >
                {t("QuiSommesNous.Autre", "Autre ")}
              </FButton>
            )}
          </div>
        ) : (
          <>
            <div>
              <Image src={props.member.image} alt={props.member.name} width={120} height={120} />
            </div>
            <div className={styles.name}>{props.member.name}</div>
            <div className={styles.role}>{props.member.roleShort || props.member.roleName}</div>
          </>
        )}
      </div>
    </div>
  );
};

export const Team = () => (
  <div className={styles.container}>
    {members.map((member, i) => (
      <MemberCard key={i} member={member} />
    ))}
  </div>
);
