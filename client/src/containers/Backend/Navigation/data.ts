import { SelectedPage } from "./Navigation.component";

export const navigationData: {
  type: SelectedPage;
  iconName: string;
  title: string;
  access: string;
}[] = [
  {
    type: "notifications",
    iconName: "bell",
    title: "Mes notifications",
    access: "hasStructure",
  },
  {
    type: "favoris",
    iconName: "bookmark",
    title: "Mes favoris",
    access: "all",
  },
  {
    type: "contributions",
    iconName: "file-add",
    title: "Mes fiches",
    access: "all",
  },
  {
    type: "traductions",
    iconName: "play-circle",
    title: "Mes traductions",
    access: "all",
  },
  {
    type: "structure",
    iconName: "briefcase",
    title: "Ma structure",
    access: "hasStructure",
  },
  {
    type: "profil",
    iconName: "person",
    title: "Mon profil",
    access: "all",
  },
  { type: "admin", iconName: "shield", title: "Admin", access: "admin" },
  {
    type: "logout",
    iconName: "log-out",
    title: "Déconnexion",
    access: "all",
  },
];
