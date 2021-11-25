import React from "react";
import { ContentSummary } from "../Contents/ContentSummary";
import { NeedsSummary } from "../Needs/NeedsSummary";
import { FirebaseEvent } from "../../utils/eventsUsedInFirebase";
import { logEventInFirebase } from "../../utils/logEvent";
import { TagButton } from "../Explorer/TagButton";
import { getThemeTag } from "../../libs/getThemeTag"

interface Props {
  navigation: any;
  item: any;
  languageMatch: string;
  hasSponsorMatch: boolean;
  nbContents?: number|null;
}

export const SearchContentSummary = (props: Props) => {
  if (props.item.typeContenu === "besoin") {
    const colors = getThemeTag(props.item.tagName);
    return ( // BESOIN
      <NeedsSummary
        id={props.item.objectID}
        needTextFr={props.item.title_fr}
        searchLanguageMatch={props.languageMatch}
        navigation={props.navigation}
        themeTag={colors}
        searchItem={props.item}
        nbContents={props.nbContents || 0}
        backScreen="Search"
      />
    )
  } else if (
    props.item.typeContenu === "dispositif" || props.item.typeContenu === "demarche"
  ) { // DISPOSITIF & DEMARCHE
    const primaryTagName = props.item.tags.length > 0 ? props.item.tags[0] : null;
    const colors = getThemeTag(primaryTagName);
    return (
      <ContentSummary
        navigation={props.navigation}
        themeTag={colors}
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
  const colors = getThemeTag(props.item.name_fr);
  return ( // THEME
    <TagButton
      key={props.item.objectID}
      searchLanguageMatch={props.languageMatch}
      backgroundColor={colors.tagDarkColor}
      iconName={colors.iconName}
      searchItem={props.item}
      onPress={() => {
        logEventInFirebase(FirebaseEvent.CLIC_THEME, {
          theme: colors.tagName,
          view: "list",
        });

        props.navigation.navigate("Explorer", {
          screen: "NeedsScreen",
          params: {
            colors: colors,
            backScreen: "Search"
          }
        });
        return;
      }}
    />
  )
};
