import React from "react";
import FButton from "components/UI/FButton/FButton";
import styles from "./BandeauEdition.module.scss";

interface Props {
  visible: boolean;
  typeContenu: "dispositif" | "demarche";
  toggleTutoriel: () => void;
  displayTuto: boolean;
  toggleDispositifValidateModal: () => void;
  toggleDraftModal: () => void;
  tKeyValue: number;
  toggleDispositifCreateModal: () => void;
  isModified: boolean;
  isSaved: boolean;
}

const getInfoText = (
  step: number,
  displayTuto: boolean,
  typeContenu: "dispositif" | "demarche"
) => {
  const initialText = {
    title: "Pour démarrer, cliquez sur les zones surlignées en",
    subtitle: "",
  };

  if (step === -1 || !displayTuto) return initialText;
  if (step === -6)
    return {
      title: "Choix des thèmes",
      subtitle: "Choisissez jusqu'à trois thèmes décrivant votre fiche.",
    };
  if (step === -7)
    return {
      title: "Partenaires",
      subtitle:
        "Indiquez la structure responsable de la fiche ainsi que d'éventuelles structures associées.",
    };
  if (typeContenu === "dispositif") {
    if (step === -4)
      return {
        title: "Titre informatif",
        subtitle:
          "Rédigez une courte phrase qui décrit l'action principale de votre dispositif.",
      };
    if (step === 1)
      return {
        title: "Critères d'accès",
        subtitle:
          "Configurez les critères et conditions d'accès à votre dispositif.",
      };
    if (step === -3)
      return {
        title: "Nom du dispositif",
        subtitle: "Comment s'appelle votre dispositif ?",
      };

    if (step === 3)
      return {
        title: "Inscription et engagement",
        subtitle: "Décrivez chaque étape pour rejoindre votre dispositif.",
      };

    if (step === -2)
      return {
        title: "Site internet",
        subtitle: "Ajoutez un lien vers votre site ou une page web utile.",
      };
    if (step === 2)
      return {
        title: "Détails et arguments",
        subtitle:
          "Rédigez plusieurs arguments pour valoriser l'intérêt de votre dispositif.",
      };
    if (step === -5)
      return {
        title: "Points de contact",
        subtitle: "Précisez les modalités d'accueil d'un ou plusieurs lieux.",
      };

    if (step === 0)
      return {
        title: "Résumé",
        subtitle:
          "Expliquez votre dispositif en deux paragraphes synthétiques.",
      };
  }

  if (typeContenu === "demarche") {
    if (step === -4)
      return {
        title: "Titre de la démarche",
        subtitle: "Nommez votre fiche démarche avec les termes officiels.",
      };
    if (step === 0)
      return {
        title: "C'est quoi ?",
        subtitle:
          "Résumez la démarche en deux ou trois paragraphes synthétiques.",
      };

    if (step === 1)
      return {
        title: "C'est pour qui ?",
        subtitle:
          "Configurez les critères et conditions d'accès à la démarche.",
      };

    if (step === 2)
      return {
        title: "Comment faire ?",
        subtitle: "Expliquez chaque étape pour mener à bien la démarche.",
      };

    if (step === 3)
      return {
        title: "Et après ?",
        subtitle:
          "Abordez la fin ou le renouvellement du droit ou de la prestation obtenus.",
      };
  }

  return initialText;
};
export const BandeauEditionWithoutVariante = (props: Props) => {
  const { title, subtitle } = getInfoText(
    props.tKeyValue,
    props.displayTuto,
    props.typeContenu
  );
  const isDispositif = props.typeContenu === "dispositif";
  const correctContenu =
    props.typeContenu === "dispositif" ? "Dispositif" : "Démarche";
  return (
    <div className={`${styles.container} ${(props.visible ? "" : styles.top)}`}>
      <div className={styles.dashed} />
      <div
        className={styles.inner}
        style={{
          backgroundColor: props.displayTuto && props.tKeyValue !== -1 ? "#f9ef99" : "#edebeb"
        }}
      >
        <div className={styles.group_container}>
          <div className={styles.content}>{correctContenu}</div>
          <div className={styles.title}>{title}</div>
          {props.tKeyValue !== -1 && props.displayTuto && (
            <p className={styles.description}>{subtitle}</p>
          )}
          {(props.tKeyValue === -1 || !props.displayTuto) && (
            <div className={styles.group_container}>
              <span className={styles.yellow_text}>jaune.</span>
              {isDispositif && (
                <div
                  className={styles.more}
                  onClick={props.toggleDispositifCreateModal}
                >
                  <u>En savoir plus</u>
                </div>
              )}
            </div>
          )}
        </div>
        <div className={styles.group_container}>
          {isDispositif && (
            <FButton
              type="tuto"
              name={props.displayTuto ? "eye-off-outline" : "eye-outline"}
              className="mr-10"
              onClick={props.toggleTutoriel}
            >
              Tutoriel
            </FButton>
          )}
          <FButton
            type={
              props.isModified
                ? "modified"
                : props.isSaved
                ? "saved"
                : "light-action"
            }
            name="save-outline"
            className="mr-10"
            onClick={props.toggleDraftModal}
          >
            {props.isSaved && !props.isModified
              ? "Sauvegardé !"
              : "Sauvegarder"}
          </FButton>
          <FButton
            className="mr-15"
            type="validate"
            name="checkmark-outline"
            onClick={props.toggleDispositifValidateModal}
          >
            Valider
          </FButton>
        </div>
      </div>
    </div>
  );
};
