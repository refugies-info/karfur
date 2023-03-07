export const sharingOptions = (type: string, titreInformatif: string, titreMarque?: string) => {
  if (navigator.share) {
    const title = type === "dispositif" ? `${titreInformatif} avec ${titreMarque}` : `${titreInformatif}`;

    const text = `Voici le lien vers la fiche ${titreInformatif} : ${window.location.href} `;

    return navigator
      .share({ title, text })
      .then(() => { })
      .catch(() => { });
  }
  return null;
};
