import React from "react";
import { ContentSummary } from "../Contents/ContentSummary";
import { NeedsSummary } from "../Needs/NeedsSummary";
import { FirebaseEvent } from "../../utils/eventsUsedInFirebase";
import { logEventInFirebase } from "../../utils/logEvent";
import { TagButton } from "../Explorer/TagButton";
import { theme } from "../../theme"
import { tags } from "../../data/tagData";

interface Props {
  navigation: any;
  item: any;
  languageMatch: string;
}


const getColors = (tagName: string, tagProperty: "name"|"short") => {
  const defaultColors = {
    tagDarkColor: theme.colors.black,
    tagVeryLightColor: theme.colors.white,
    tagName: "",
    tagLightColor: theme.colors.white,
    iconName: ""
  };

  const currentTag = tags.find(t => tagName === t[tagProperty]);
  if (!currentTag) return defaultColors;

  return {
    tagDarkColor: currentTag.darkColor,
    tagVeryLightColor: currentTag.veryLightColor,
    tagName: currentTag.name,
    tagLightColor: currentTag.lightColor,
    iconName: currentTag.icon
  }
}

export const SearchContentSummary = (props: Props) => {
  if (props.item.typeContenu === "besoin") {
    const colors = getColors(props.item.tagName, "name");
    return ( // BESOIN
      <NeedsSummary
        id={props.item.objectID}
        needTextFr={props.item.title_fr}
        searchLanguageMatch={props.languageMatch}
        navigation={props.navigation}
        tagName={props.item.tagName}
        tagDarkColor={colors.tagDarkColor}
        tagVeryLightColor={colors.tagVeryLightColor}
        tagLightColor={colors.tagLightColor}
        iconName={colors.iconName}
        searchItem={props.item}
        backScreen="Search"
      />
    )
  } else if (
    props.item.typeContenu === "dispositif" || props.item.typeContenu === "demarche"
  ) { // DISPOSITIF & DEMARCHE
    const primaryTagName = props.item.tags.length > 0 ? props.item.tags[0] : null;
    const colors = getColors(primaryTagName, "name");
    return (
      <ContentSummary
        navigation={props.navigation}
        tagDarkColor={colors.tagDarkColor}
        tagVeryLightColor={colors.tagVeryLightColor}
        tagName={colors.tagName}
        tagLightColor={colors.tagLightColor}
        iconName={colors.iconName}
        contentId={props.item.objectID}
        searchLanguageMatch={props.languageMatch}
        typeContenu={props.item.typeContenu}
        sponsorUrl={props.item.sponsorUrl}
        showAbstract={true}
        searchItem={props.item}
        backScreen="Search"
      />
    );
  }
  const colors = getColors(props.item.name_fr, "name");
  return ( // THEME
    <TagButton
      key={props.item.objectID}
      searchLanguageMatch={props.languageMatch}
      backgroundColor={colors.tagDarkColor}
      iconName={colors.iconName}
      onPress={() => {
        logEventInFirebase(FirebaseEvent.CLIC_THEME, {
          theme: colors.tagName,
          view: "list",
        });

        props.navigation.navigate("Explorer", {
          screen: "NeedsScreen",
          params: {
            tagName: props.item.name_fr,
            tagDarkColor: colors.tagDarkColor,
            tagVeryLightColor: colors.tagVeryLightColor,
            tagLightColor: colors.tagLightColor,
            iconName: colors.iconName,
            backScreen: "Search"
          }
        });
        return;
      }}
      searchItem={props.item}
    />
  )
};
