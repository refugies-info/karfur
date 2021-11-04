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
    return (
      <NeedsSummary
        id={props.item.objectID}
        needText={props.item.title_fr}
        needTextFr={props.item.title_fr}
        navigation={props.navigation}
        tagName={props.item.tagName}
        tagDarkColor={colors.tagDarkColor}
        tagVeryLightColor={colors.tagVeryLightColor}
        tagLightColor={colors.tagLightColor}
        iconName={colors.iconName}
        searchItem={props.item}
      />
    )
  } else if (props.item.typeContenu === "dispositif" || props.item.typeContenu === "demarche") {
    const primaryTagName = props.item.tags.length > 0 ? props.item.tags[0] : null;
    const colors = getColors(primaryTagName, "name");
    return (
      <ContentSummary
        navigation={props.navigation}
        route="SearchContentScreen"
        tagDarkColor={colors.tagDarkColor}
        tagVeryLightColor={colors.tagVeryLightColor}
        tagName={colors.tagName}
        tagLightColor={colors.tagLightColor}
        iconName={colors.iconName}
        contentId={props.item.objectID}
        titreInfo={props.item.title_fr}
        titreMarque={props.item.titreMarque_fr}
        typeContenu={props.item.typeContenu}
        sponsorUrl={props.item.sponsorUrl}
        showAbstract={true}
        searchItem={props.item}
      />
    );
  }
  const colors = getColors(props.item.name_fr, "name");
  return ( // theme
    <TagButton
      key={props.item.objectID}
      tagName={props.item.title_fr}
      backgroundColor={colors.tagDarkColor}
      iconName={colors.iconName}
      onPress={() => {
        logEventInFirebase(FirebaseEvent.CLIC_THEME, {
          theme: colors.tagName,
          view: "list",
        });

        props.navigation.navigate("NeedsScreen", {
          tagName: props.item.title_fr,
          tagDarkColor: colors.tagDarkColor,
          tagVeryLightColor: colors.tagVeryLightColor,
          tagLightColor: colors.tagLightColor,
          iconName: colors.iconName,
        });
        return;
      }}
      searchItem={props.item}
    />
  )
};
