import React from "react";
import { ScrollView, View } from "react-native";
import { styles } from "../../theme";
import { sortByOrder } from "../../libs";
import { ContentSummary } from "../Contents/ContentSummary";
import { TagButton } from "../Explorer/TagButton";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { ReadableText } from "../ReadableText";
import { themesSelector } from "../../services/redux/Themes/themes.selectors";
import { useSelector } from "react-redux";
import { currentI18nCodeSelector } from "../../services/redux/User/user.selectors";
import { SectionTitle } from "../typography";
import { useTheme } from "styled-components/native";
import { ContentForApp } from "@refugies-info/api-types";

interface Props {
  contents: ContentForApp[];
  navigation: any;
}

const SearchSuggestions = (props: Props) => {
  const { t, isRTL } = useTranslationWithRTL();
  const themes = useSelector(themesSelector);
  const currentLanguageI18nCode = useSelector(currentI18nCodeSelector);
  const _theme = useTheme();

  return (
    <>
      <SectionTitle>
        <ReadableText>
          {t(
            "search_screen.most_searched_content",
            "Les fiches les plus recherchées"
          )}
        </ReadableText>
      </SectionTitle>

      {(props.contents || []).map((content: ContentForApp) => {
        return (
          <ContentSummary
            key={content._id}
            backScreen="Search"
            content={content}
            style={{ marginBottom: styles.margin * 3 }}
          />
        );
      })}
      <SectionTitle>
        <ReadableText>{t("search_screen.themes", "Les thèmes")}</ReadableText>
      </SectionTitle>
      <View style={{ marginHorizontal: -(_theme.margin * 3) }}>
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
              style={{ paddingVertical: _theme.margin * 2 }}
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
