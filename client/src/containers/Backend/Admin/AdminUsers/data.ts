export type FilterUserStatus =
  "Respo" |
  "Admin" |
  "Experts" |
  "Traducteurs" |
  "Rédacteurs" |
  "Multi-structure" |
  "Tous";

export type UserStatus = {
  status: FilterUserStatus
  order: number
}

export const userHeaders = [
  { name: "Pseudonyme", order: "username" },
  { name: "Email", order: "email" },
  { name: "Structure", order: "structure" },
  { name: "Rôles", order: "" },
  { name: "Langues", order: "" },
  { name: "Création", order: "created_at" },
];

export const correspondingStatus: UserStatus[] = [
  { status: "Respo", order: 2 },
  { status: "Admin", order: 1 },
  { status: "Experts", order: 3 },
  { status: "Traducteurs", order: 4 },
  { status: "Rédacteurs", order: 5 },
  { status: "Multi-structure", order: 6 },
  { status: "Tous", order: 7 },
];
