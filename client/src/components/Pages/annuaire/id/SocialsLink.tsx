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

const onLinkClicked = (link: string | undefined) => {
  if (!link) return;
  window.open((link.includes("http") ? "" : "http://") + link, "_blank");
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
              onClick={() => onLinkClicked(website)}
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
            onClick={() => onLinkClicked(props.facebook)}
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
            onClick={() => onLinkClicked(props.twitter)}
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
            onClick={() => onLinkClicked(props.linkedin)}
          >
            {t("Annuaire.linkedin", "Suivre sur LinkedIn")}
          </FButton>
        </div>
      )}
    </div>
  )
}
