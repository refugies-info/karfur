import { ContentForApp } from "@refugies-info/api-types";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { useTheme } from "styled-components/native";
import { useTranslationWithRTL } from "~/hooks/useTranslationWithRTL";
import { sortByOrder } from "~/libs";
import { themesSelector } from "~/services/redux/Themes/themes.selectors";
import { currentI18nCodeSelector } from "~/services/redux/User/user.selectors";
import { styles } from "~/theme";
import { ContentSummary } from "../Contents/ContentSummary";
import { TagButton } from "../Explorer/TagButton";
import { Spacer } from "../layout";
import { ReadableText } from "../ReadableText";
import { SectionTitle } from "../typography";

interface Props {
  contents: ContentForApp[];
  navigation: any;
}

const stylesheet = StyleSheet.create({
  contentSummary: { marginBottom: styles.margin * 3 },
  container: { marginHorizontal: -(styles.margin * 3) },
  tagButton: { paddingVertical: styles.margin * 2 },
});

const SearchSuggestions = (props: Props) => {
  const { t, isRTL } = useTranslationWithRTL();
  const themes = useSelector(themesSelector);
  const currentLanguageI18nCode = useSelector(currentI18nCodeSelector);
  const _theme = useTheme();

  return (
    <>
      <Spacer height={_theme.margin * 3} />
      <SectionTitle>
        <ReadableText>{t("search_screen.most_searched_content", "Les fiches les plus recherchées")}</ReadableText>
      </SectionTitle>

      {(props.contents || []).map((content: ContentForApp) => {
        return (
          <ContentSummary key={content._id} backScreen="Search" content={content} style={stylesheet.contentSummary} />
        );
      })}
      <SectionTitle>
        <ReadableText>{t("search_screen.themes", "Les thèmes")}</ReadableText>
      </SectionTitle>
      <View style={stylesheet.container}>
        <ScrollView
          contentContainerStyle={{
            flexDirection: !isRTL ? "row" : "row-reverse",
            flexWrap: "wrap",
            width: 1150,
            paddingBottom: styles.margin,
            paddingHorizontal: _theme.margin * 3,
          }}
          horizontal={true}
        >
          {themes.sort(sortByOrder).map((theme, index) => (
            <TagButton
              key={index}
              name={theme.name[currentLanguageI18nCode || "fr"]}
              backgroundColor={theme.colors.color100}
              icon={theme.icon}
              inline={true}
              style={stylesheet.tagButton}
              onPress={() => {
                props.navigation.navigate("NeedsScreen", {
                  theme: theme,
                  backScreen: "Search",
                });
                return;
              }}
            />
          ))}
        </ScrollView>
      </View>
    </>
  );
};

export default SearchSuggestions;
