export const getScreenFromUrl = (url: string): {
  rootNavigator: "Explorer" | "Profil"
  screenParams: any
}|null => {
  // Dispositif
  const rxDispositif = /([a-z][a-z]\/)?(dispositif|program)\/[a-z|0-9]*/g;
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
  const rxDemarche = /([a-z][a-z]\/)?(demarche|procedure)\/[a-z|0-9]*/g;
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
  if (url.includes("/qui-sommes-nous") || url.includes("/who-are-we")) {
    return {
      rootNavigator: "Profil",
      screenParams: {
        screen: "AboutScreen",
      }
    }
  }

  // Legal notice
  if (url.includes("/mentions-legales") || url.includes("/legal-notices")) {
    return {
      rootNavigator: "Profil",
      screenParams: {
        screen: "LegalNoticeScreen",
      }
    }
  }

  // Privacy policy
  if (url.includes("/politique-de-confidentialite") || url.includes("/privacy-policy")) {
    return {
      rootNavigator: "Profil",
      screenParams: {
        screen: "PrivacyPolicyScreen",
      }
    }
  }

  // Accessibility
  if (url.includes("/declaration-accessibilite") || url.includes("/accessibility-statement")) {
    return {
      rootNavigator: "Profil",
      screenParams: {
        screen: "AccessibilityScreen",
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
