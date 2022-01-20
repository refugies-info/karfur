import styles from "components/Pages/dispositif/MapParagraphe/MapParagraphe.module.scss";
export const markerInfo = [
  {
    id: 0,
    label: "Titre du lieu",
    mandatory: true,
    customClass: styles.is_title,
    item: "nom",
    placeholder: "Saisir le titre",
  },
  {
    id: 1,
    label: "Adresse",
    item: "address",
    customClass: styles.no_highlight,
    placeholder: "3 rue de la Folie-Méricourt",
  },
  {
    id: 2,
    label: "Ville",
    item: "vicinity",
    customClass: styles.no_highlight,
    placeholder: "Ville",
  },
  {
    id: 3,
    label: "Informations pratiques",
    item: "description",
    placeholder: "Saisir des informations complémentaires si besoin",
  },
  {
    id: 4,
    label: "Email de contact",
    item: "email",
    placeholder: "ajouter@votreemail.fr",
  },
  {
    id: 5,
    label: "Numéro de téléphone",
    item: "telephone",
    placeholder: "00 11 22 33 44",
  },
];
