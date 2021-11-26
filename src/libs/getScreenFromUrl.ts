export const getScreenFromUrl = (url: string): {
  rootNavigator: "Explorer" | "Profil"
  screenParams: any
}|null => {
  // Dispositif
  const rx = /dispositif\/[a-z|0-9]*/g;
  const res = rx.exec(url);
  if (res && res[0]) {
    return {
      rootNavigator: "Explorer",
      screenParams: {
        screen: "ContentScreen",
        params: {
          contentId: res[0].replace("dispositif/", "")
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
