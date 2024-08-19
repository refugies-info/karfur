import { UserStatus } from "types/interface";

export const userHeaders = [
  { name: "Pseudonyme", order: "username" },
  { name: "Email", order: "email" },
  { name: "Structure", order: "structure" },
  { name: "Rôles", order: "" },
  { name: "Langues", order: "" },
  { name: "Création", order: "created_at" },
];

const green = "#4CAF50";

export const correspondingStatus: UserStatus[] = [
  {
    displayedStatus: "Respo",
    storedStatus: "Respo",
    color: green,
    order: 2
  },
  {
    displayedStatus: "Admin",
    storedStatus: "Admin",
    color: green,
    order: 1
  },
  {
    displayedStatus: "Experts",
    storedStatus: "Experts",
    color: green,
    order: 3
  },
  {
    displayedStatus: "Traducteurs",
    storedStatus: "Traducteurs",
    color: green,
    order: 4
  },
  {
    displayedStatus: "Rédacteurs",
    storedStatus: "Rédacteurs",
    color: green,
    order: 5
  },
  {
    displayedStatus: "Multi-structure",
    storedStatus: "Multi-structure",
    color: green,
    order: 6
  },
  {
    displayedStatus: "Tous",
    storedStatus: "Tous",
    color: green,
    order: 7
  },
];
