import React from "react";
import { ContentSummary } from "../Contents/ContentSummary";
import { NeedsSummary } from "../Needs/NeedsSummary";
import { FirebaseEvent } from "../../utils/eventsUsedInFirebase";
import { logEventInFirebase } from "../../utils/logEvent";
import { TagButton } from "../Explorer/TagButton";
import { useSelector } from "react-redux";
import { themeSelector } from "../../services";
import { contentSelector } from "../../services/redux/Contents/contents.selectors";
import { groupedContentsSelector } from "../../services/redux/ContentsGroupedByNeeds/contentsGroupedByNeeds.selectors";
import { styles } from "../../theme";

interface Props {
  navigation: any;
  item: any;
  languageMatch: string;
  hasSponsorMatch: boolean;
  nbContents?: number | null;
  pressCallback?: () => void;
}

export const SearchContentSummary = (props: Props) => {
  const themeId =
    props.item.typeContenu === "theme"
      ? props.item.objectID
      : props.item.theme._id.toString();
  const theme = useSelector(themeSelector(themeId));
  if (!theme) {
    return null;
  }

  if (props.item.typeContenu === "besoin") {
    // empty need
    const groupedContents = useSelector(groupedContentsSelector);
    if (
      !groupedContents[props.item.objectID] ||
      groupedContents[props.item.objectID].length === 0
    ) {
      return null;
    }
    return (
      // BESOIN
      <NeedsSummary
        id={props.item.objectID}
        image={theme.appImage}
        needTextFr={props.item.title_fr}
        searchLanguageMatch={props.languageMatch}
        theme={theme}
        searchItem={props.item}
        backScreen="Search"
        pressCallback={props.pressCallback}
        style={{ marginBottom: styles.margin * 2 }}
      />
    );
  } else if (
    props.item.typeContenu === "dispositif" ||
    props.item.typeContenu === "demarche"
  ) {
    const content = useSelector(contentSelector(props.item.objectID));
    if (!content) return null;
    // DISPOSITIF & DEMARCHE
    return (
      <ContentSummary
        backScreen="Search"
        content={content}
        hasSponsorMatch={props.hasSponsorMatch}
        pressCallback={props.pressCallback}
        searchItem={props.item}
        searchLanguageMatch={props.languageMatch}
        showAbstract
        theme={theme}
        style={{ marginBottom: styles.margin * 2 }}
      />
    );
  }

  return (
    // THEME
    <TagButton
      key={props.item.objectID}
      searchLanguageMatch={props.languageMatch}
      backgroundColor={theme.colors.color100}
      icon={theme.icon}
      searchItem={props.item}
      onPress={() => {
        logEventInFirebase(FirebaseEvent.CLIC_THEME, {
          theme: props.item.name_fr,
          view: "list",
        });
        if (props.pressCallback) props.pressCallback();

        props.navigation.navigate("Explorer", {
          screen: "NeedsScreen",
          params: {
            theme,
            backScreen: "Search",
          },
        });
        return;
      }}
      style={{ marginBottom: styles.margin * 2 }}
    />
  );
};
