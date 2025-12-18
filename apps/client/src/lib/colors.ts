const colorAvancement = (avancement: number, type: "text" | "bg") => {
  if (avancement > 0.75) {
    return type === "bg" ? "bg-green-500" : "text-green-500";
  } else if (avancement > 0.5) {
    return type === "bg" ? "bg-blue-500" : "text-blue-500";
  } else if (avancement > 0.25) {
    return type === "bg" ? "bg-yellow-500" : "text-yellow-500";
  }
  return type === "bg" ? "bg-red-500" : "text-red-500";
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

type AvancementText =
  | "Annulé"
  | "Annulée"
  | "Exclu"
  | "Supprimé"
  | "Inactif"
  | "Inactive"
  | "En attente"
  | "En cours"
  | "Brouillon";
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
  const colorArr = [
    "primary",
    "secondary",
    "success",
    "warning",
    "danger",
    "info",
    "light",
    "dark",
  ];
  const nb = Math.floor(Math.random() * Math.floor(colorArr.length - 1));
  return colorArr[nb];
};

export { colorAvancement, colorStatut, fColorAvancement, randomColor };
