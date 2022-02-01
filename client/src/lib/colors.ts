const colorAvancement = (avancement: number) => {
  if (avancement > 0.75) {
    return "success";
  } else if (avancement > 0.5) {
    return "info";
  } else if (avancement > 0.25) {
    return "warning";
  }
  return "danger";

};

const fColorAvancement = (avancement: number) => {
  if (avancement > 0.75) {
    return "vert";
  } else if (avancement > 0.5) {
    return "jaune";
  } else if (avancement > 0.2) {
    return "orange";
  }
  return "rouge";

};

type AvancementText = "Annulé" | "Annulée" | "Exclu" | "Supprimé" | "Inactif" | "Inactive" | "En attente" | "En cours" | "Brouillon";
const colorStatut = (avancement: AvancementText) => {
  if (
    avancement === "Annulé" ||
    avancement === "Annulée" ||
    avancement === "Exclu" ||
    avancement === "Supprimé"
  ) {
    return "danger";
  } else if (avancement === "Inactif" || avancement === "Inactive") {
    return "secondary";
  } else if (
    avancement === "En attente" ||
    avancement === "En cours" ||
    avancement === "Brouillon"
  ) {
    return "warning";
  }
  return "success";

};

const randomColor = () => {
  let colorArr = [
    "primary",
    "secondary",
    "success",
    "warning",
    "danger",
    "info",
    "light",
    "dark",
  ];
  let nb = Math.floor(Math.random() * Math.floor(colorArr.length - 1));
  return colorArr[nb];
};

export { colorAvancement, colorStatut, randomColor, fColorAvancement };
