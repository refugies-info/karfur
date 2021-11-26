export const getScreenFromUrl = (url: string): {
  rootNavigator: "Explorer" | "Profil"
  screenParams: any
}|null => {
  // Dispositif
  const rxDispositif = /dispositif\/[a-z|0-9]*/g;
  const resDispositif = rxDispositif.exec(url);
  if (resDispositif && resDispositif[0]) {
    return {
      rootNavigator: "Explorer",
      screenParams: {
        screen: "ContentScreen",
        params: {
          contentId: resDispositif[0].replace("dispositif/", "")
        }
      }
    }
  }

  // Demarche
  const rxDemarche = /demarche\/[a-z|0-9]*/g;
  const resDemarche = rxDemarche.exec(url);
  if (resDemarche && resDemarche[0]) {
    return {
      rootNavigator: "Explorer",
      screenParams: {
        screen: "ContentScreen",
        params: {
          contentId: resDemarche[0].replace("demarche/", "")
        }
      }
    }
  }

  // About
  if (url.includes("/qui-sommes-nous")) {
    return {
      rootNavigator: "Profil",
      screenParams: {
        screen: "AboutScreen",
      }
    }
  }

  // Legal notice
  if (url.includes("/mentions-legales")) {
    return {
      rootNavigator: "Profil",
      screenParams: {
        screen: "LegalNoticeScreen",
      }
    }
  }

  // Privacy policy
  if (url.includes("/politique-de-confidentialite")) {
    return {
      rootNavigator: "Profil",
      screenParams: {
        screen: "PrivacyPolicyScreen",
      }
    }
  }

  return {
    rootNavigator: "Explorer",
    screenParams: {
      screen: "ExplorerScreen",
    }
  };
};
