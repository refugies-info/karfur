import React from "react";
import { ContentSummary } from "../Contents/ContentSummary";
import { NeedsSummary } from "../Needs/NeedsSummary";
import { FirebaseEvent } from "../../utils/eventsUsedInFirebase";
import { logEventInFirebase } from "../../utils/logEvent";
import { TagButton } from "../Explorer/TagButton";
import { useSelector } from "react-redux";
import { themesSelector } from "../../services/redux/Themes/themes.selectors";

interface Props {
  navigation: any;
  item: any;
  languageMatch: string;
  hasSponsorMatch: boolean;
  nbContents?: number|null;
}

export const SearchContentSummary = (props: Props) => {
  const themes = useSelector(themesSelector);

  if (props.item.typeContenu === "besoin") {
    const theme = themes.find(t => t._id === props.item.theme);
    if (!theme) return null;
    return ( // BESOIN
      <NeedsSummary
        id={props.item.objectID}
        needTextFr={props.item.title_fr}
        searchLanguageMatch={props.languageMatch}
        navigation={props.navigation}
        theme={theme}
        searchItem={props.item}
        nbContents={props.nbContents || 0}
        backScreen="Search"
      />
    )
  } else if (
    props.item.typeContenu === "dispositif" || props.item.typeContenu === "demarche"
  ) { // DISPOSITIF & DEMARCHE
    const theme = themes.find(t => t._id === props.item.theme);
    if (!theme) return null;
    return (
      <ContentSummary
        navigation={props.navigation}
        theme={theme}
        contentId={props.item.objectID}
        searchLanguageMatch={props.languageMatch}
        typeContenu={props.item.typeContenu}
        sponsorUrl={props.item.sponsorUrl}
        showAbstract={true}
        hasSponsorMatch={props.hasSponsorMatch}
        searchItem={props.item}
        backScreen="Search"
      />
    );
  }

  const theme = themes.find(t => t._id === props.item._id);
  if (!theme) return null;
  return ( // THEME
    <TagButton
      key={props.item.objectID}
      searchLanguageMatch={props.languageMatch}
      backgroundColor={theme.colors.color100}
      iconName={theme.icon}
      searchItem={props.item}
      onPress={() => {
        logEventInFirebase(FirebaseEvent.CLIC_THEME, {
          theme: theme.name.fr,
          view: "list",
        });

        props.navigation.navigate("Explorer", {
          screen: "NeedsScreen",
          params: {
            theme,
            backScreen: "Search"
          }
        });
        return;
      }}
    />
  )
};
