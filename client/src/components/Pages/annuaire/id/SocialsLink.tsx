import React from "react";
import { useTranslation } from "next-i18next";
import FButton from "components/UI/FButton/FButton";
import styles from "./SocialLinks.module.scss";

interface Props {
  websites: string[] | undefined;
  facebook: string | undefined;
  twitter: string | undefined;
  linkedin: string | undefined;
}

const getLink = (link: string | undefined) => {
  if (!link) return;
  return (link.includes("http") ? "" : "http://") + link
};

export const SocialsLink = (props: Props) => {
  const { t } = useTranslation();

  return (
    <div>
      {props.websites &&
        props.websites.map((website) => (
          <div key={website} className={styles.button}>
            <FButton
              type="white"
              name="globe"
              href={getLink(website)}
              tag="a"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("Annuaire.Visiter internet", "Visiter le site internet")}
            </FButton>
          </div>
        ))}
      {props.facebook && (
        <div className={styles.button}>
          <FButton
            type="white"
            name="facebook"
            href={getLink(props.facebook)}
            tag="a"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("Annuaire.facebook", "Suivre sur Facebook")}
          </FButton>
        </div>
      )}
      {props.twitter && (
        <div className={styles.button}>
          <FButton
            type="white"
            name="twitter"
            href={getLink(props.twitter)}
            tag="a"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("Annuaire.twitter", "Suivre sur Twitter")}
          </FButton>
        </div>
      )}
      {props.linkedin && (
        <div className={styles.button}>
          <FButton
            type="white"
            name="linkedin"
            href={getLink(props.linkedin)}
            tag="a"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("Annuaire.linkedin", "Suivre sur LinkedIn")}
          </FButton>
        </div>
      )}
    </div>
  )
}
