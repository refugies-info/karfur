import React from "react";
import { ScrollView } from "react-native";
import { styles } from "../../theme";
import { SimplifiedContent } from "../../types/interface";
import { sortByOrder } from "../../libs";
import { ContentSummary } from "../Contents/ContentSummary";
import { TagButton } from "../Explorer/TagButton";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { ReadableText } from "../ReadableText";
import { themesSelector } from "../../services/redux/Themes/themes.selectors";
import { useSelector } from "react-redux";
import { currentI18nCodeSelector } from "../../services/redux/User/user.selectors";
import { SectionTitle } from "../typography";

interface Props {
  contents: SimplifiedContent[];
  navigation: any;
}

const SearchSuggestions = (props: Props) => {
  const { t, isRTL } = useTranslationWithRTL();
  const themes = useSelector(themesSelector);
  const currentLanguageI18nCode = useSelector(currentI18nCodeSelector);

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

      {(props.contents || []).map((content: SimplifiedContent) => {
        return (
          <ContentSummary
            key={content._id}
            navigation={props.navigation}
            theme={content.theme}
            contentId={content._id}
            titreInfo={content.titreInformatif}
            titreMarque={content.titreMarque}
            typeContenu={content.typeContenu}
            sponsorUrl={content.sponsorUrl}
            style={{ marginBottom: styles.margin * 3 }}
            backScreen="Search"
          />
        );
      })}
      <SectionTitle>
        <ReadableText>{t("search_screen.themes", "Les thèmes")}</ReadableText>
      </SectionTitle>
      <ScrollView
        contentContainerStyle={{
          flexDirection: !isRTL ? "row" : "row-reverse",
          flexWrap: "wrap",
          width: 1100,
          paddingBottom: styles.margin,
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
    </>
  );
};

export default SearchSuggestions;
