import React from "react";

interface Content {
  title: string;
  intro: string;
}

export type ContentKey = "expert" | "pending" | "incomplete" | "complete";

export const contentTitle: Record<ContentKey, string> = {
  expert: "Pourquoi ne pas publier votre traduction ?",
  pending: "Il reste des sections « en cours » !",
  incomplete: "Merci pour votre participation !",
  complete: "Toute la fiche est traduite, bravo !",
};

export const getContentIntro = (key: ContentKey, nbWords: number, locale: string) => {
  switch (key) {
    case "expert":
      return (
        <>
          Vous êtes sur le point de quitter l’éditeur sans avoir validé votre traduction alors que celle-ci est
          complète.
        </>
      );
    case "pending":
      return (
        <>
          Vous avez traduit {nbWords} mots, merci pour votre participation. Attention, vous avez commencé des nouvelles
          propositions. Pensez bien à les valider pour que celles-ci soient prises en compte.
        </>
      );
    case "incomplete":
      return (
        <>
          Félicitations, vous avez traduit {nbWords} mots. Vous recevrez une notification lorsque la fiche sera validée
          par l’expert et publiée en {locale.toLowerCase()}.
        </>
      );
    case "complete":
      return (
        <>
          Félicitations, vous avez traduit {nbWords} mots. Vous recevrez une notification lorsque la fiche sera validée
          par l’expert et publiée en {locale.toLowerCase()}.
        </>
      );
  }
};
