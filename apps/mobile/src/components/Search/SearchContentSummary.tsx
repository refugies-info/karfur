import type { CompositeNavigationProp } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { GetThemeResponse } from "@refugies-info/api-types";
import { useSelector } from "react-redux";
import type { SearchItem } from "~/components/Search/types";
import { themeSelector } from "~/services";
import { contentSelector } from "~/services/redux/Contents/contents.selectors";
import { groupedContentsSelector } from "~/services/redux/ContentsGroupedByNeeds/contentsGroupedByNeeds.selectors";
import { styles } from "~/theme";
import type { ExplorerParamList, RootStackParamList } from "~/types/navigation";
import { FirebaseEvent } from "~/utils/eventsUsedInFirebase";
import { logEventInFirebase } from "~/utils/logEvent";
import { ContentSummary } from "../Contents/ContentSummary";
import { TagButton } from "../Explorer/TagButton";
import { NeedsSummary } from "../Needs/NeedsSummary";

type NavigationProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamList>,
  StackNavigationProp<ExplorerParamList>
>;

interface Props {
  navigation: NavigationProp;
  item: SearchItem;
  languageMatch: string;
  hasSponsorMatch: boolean;
  nbContents?: number | null;
  pressCallback?: () => void;
}

const paddingTagButton = { marginBottom: styles.margin * 2 };

export const SearchContentSummary = (props: Props) => {
  const themeId =
    props.item.typeContenu === "theme"
      ? props.item.objectID
      : typeof props.item.theme === "string"
        ? props.item.theme
        : (props.item.theme as { _id: string })._id;
  // Title is not used in this component but kept for future use
  const _title = (props.item.name_fr || props.item.title_fr || props.item.title || "").trim();
  const theme = useSelector(themeSelector(themeId));
  if (!theme) {
    return null;
  }

  if (props.item.typeContenu === "besoin") {
    // empty need
    const groupedContents = useSelector(groupedContentsSelector);
    const needId = props.item.objectID;
    const needContents = (groupedContents as Record<string, unknown[]>)[needId] || [];
    if (needContents.length === 0) {
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
  } else if (props.item.typeContenu === "dispositif" || props.item.typeContenu === "demarche") {
    const content = useSelector(contentSelector(props.item.objectID));
    if (!content) return null;
    // DISPOSITIF & DEMARCHE
    return (
      <ContentSummary
        backScreen="Search"
        content={content}
        hasSponsorMatch={props.hasSponsorMatch}
        pressCallback={props.pressCallback}
        searchItem={{ ...props.item, __position: 1 }}
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
      icon={theme.appImage}
      iconSize={50}
      searchItem={props.item}
      onPress={() => {
        logEventInFirebase(FirebaseEvent.CLIC_THEME, {
          theme: props.item.name_fr,
          view: "list",
        });
        if (props.pressCallback) props.pressCallback();

        // @ts-expect-error - Need to fix navigation types
        props.navigation.navigate("Explorer", {
          screen: "ContentsScreen",
          params: {
            theme: theme as unknown as GetThemeResponse,
            needId: props.item.objectID,
            backScreen: "Search",
          },
        });
        return;
      }}
      style={paddingTagButton}
    />
  );
};
