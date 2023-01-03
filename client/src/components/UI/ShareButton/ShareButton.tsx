import React from "react";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import styles from "./ShareButton.module.scss";
declare const window: Window;

interface Props {
  name: string;
  onClick?: () => void;
  content?: { titreMarque: string; titreInformatif: string };
  typeContenu?: string;
  text: string;
  type: "a" | "button";
}

export const ShareButton = (props: Props) => {
  const emailBody = "Voici le lien vers cette fiche : " + window.location.href;
  const mailSubject = props.content
    ? props.typeContenu === "dispositif"
      ? `${props.content.titreInformatif} avec ${props.content.titreMarque}`
      : `${props.content.titreInformatif}`
    : "";

  return (
    <>
      {props.type === "button" && props.onClick && (
        <button onClick={props.onClick} className={styles.btn}>
          {props.name && <EVAIcon name={props.name} fill={"#000000"} size={"large"} />}
          {props.text && <span className="ms-2">{props.text}</span>}
        </button>
      )}
      {props.type === "a" && emailBody && (
        <a style={{ display: "flex", flexDirection: "row" }} href={`mailto:?subject=${mailSubject}&body=${emailBody}`}>
          <div className={styles.btn}>
            {props.name && <EVAIcon name={props.name} fill={"#000000"} size={"large"} />}
            {props.text && <span className="ms-2">{props.text}</span>}
          </div>
        </a>
      )}
    </>
  );
};
