import { AppUser } from "../../../typegoose";

export const targets: AppUser[] = [
  {
    uid: "1",
    city: "Rennes",
    department: "Ille-et-Vilaine",
    selectedLanguage: "fr",
    age: "18 à 25 ans",
    expoPushToken: "1",
    notificationsSettings: {
      global: true,
      local: true,
      demarches: true,
      themes: {
        "theme1": true
      }
    }
  },
  {
    uid: "2",
    selectedLanguage: "fa",
    expoPushToken: "2",
    notificationsSettings: {
      global: true,
      local: true,
      demarches: true,
      themes: {
        "theme1": true
      }
    }
  },
  {
    uid: "3",
    selectedLanguage: "fr",
    age: "25 à 56 ans",
    expoPushToken: "3",
    notificationsSettings: {
      global: true,
      local: false,
      demarches: true,
      themes: {
        "theme1": true
      }
    }
  },
  {
    uid: "4",
    selectedLanguage: "fr",
    expoPushToken: "4",
    notificationsSettings: {
      global: false,
      local: true,
      demarches: false,
      themes: {
        "theme1": true
      }
    }
  },
  {
    uid: "5",
    selectedLanguage: "fa",
    expoPushToken: "5",
    notificationsSettings: {
      global: true,
      local: true,
      demarches: true,
      themes: {
        "theme1": false
      }
    }
  },
  {
    uid: "6",
    city: "Rennes",
    department: "Ille-et-Vilaine",
    selectedLanguage: "fr",
    age: "18 à 25 ans",
    expoPushToken: "6",
    notificationsSettings: {
      global: true,
      local: false,
      demarches: true,
      themes: {
        "theme1": true
      }
    }
  },
  {
    uid: "7",
    city: "Paris",
    department: "Paris",
    selectedLanguage: "fr",
    expoPushToken: "7",
    notificationsSettings: {
      global: false,
      local: true,
      demarches: false,
      themes: {
        "trouver un travail": true
      }
    }
  },
]

