import { SelectedPage } from "./Navigation.component";

export const navigationData: {
  type: SelectedPage;
  iconName: string;
  title: string;
}[] = [
  {
    type: "notifications",
    iconName: "bell",

    title: "Mes notifications",
  },
  {
    type: "favoris",
    iconName: "bookmark",

    title: "Mes favoris",
  },
  {
    type: "contributions",
    iconName: "file-add",

    title: "Mes fiches",
  },
  {
    type: "traductions",
    iconName: "play-circle",

    title: "Mes traductions",
  },
  {
    type: "structure",
    iconName: "briefcase",

    title: "Ma structure",
  },
  {
    type: "profil",
    iconName: "person",

    title: "Mon profil",
  },
  { type: "admin", iconName: "shield", title: "Admin" },
  {
    type: "logout",
    iconName: "log-out",

    title: "Déconnexion",
  },
];
