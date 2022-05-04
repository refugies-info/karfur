export type FilterStructureStatus = "Actif" | "En attente" | "Supprimé";
export type StructureStatus = {
  status: FilterStructureStatus
  order: number
}

export const headers = [
  { name: "Nom", order: "nom" },
  { name: "Statut", order: "" },
  { name: "Membres", order: "nbMembres" },
  { name: "Responsable", order: "responsable" },
  { name: "Fiches", order: "nbFiches" },
  { name: "Création", order: "created_at" },
];

export const correspondingStatus: StructureStatus[] = [
  { status: "Actif", order: 2 },
  { status: "En attente", order: 1 },
  { status: "Supprimé", order: 3 },
];
