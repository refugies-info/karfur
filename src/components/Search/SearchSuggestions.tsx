import React from "react";
import styled from "styled-components/native";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "../../theme";
import { SimplifiedContent } from "../../types/interface";
import { sortByOrder } from "../../libs";
import { ContentSummary } from "../Contents/ContentSummary";
import { TagButton } from "../Explorer/TagButton";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { StyledTextNormalBold } from "../StyledText";
import { initHorizontalScroll } from "../../libs/rtlHorizontalScroll";
import { ReadableText } from "../ReadableText";
import { themesSelector } from "../../services/redux/Themes/themes.selectors";
import { useSelector } from "react-redux";
import { currentI18nCodeSelector } from "../../services/redux/User/user.selectors";

const ListSubtitle = styled(StyledTextNormalBold)`
  margin-top: ${styles.margin * 7}px;
  margin-bottom: ${styles.margin * 3}px;
`;

interface Props {
  handleScroll?: any;
  contents: SimplifiedContent[];
  navigation: any;
  onScrollEnd: any
  parentScrollview: any
}

const SearchSuggestions = (props: Props) => {
  const { t, isRTL } = useTranslationWithRTL();
  const scrollview = React.useRef<ScrollView>(null);
  const themes = useSelector(themesSelector);
  const currentLanguageI18nCode = useSelector(currentI18nCodeSelector);

  const insets = useSafeAreaInsets();

  React.useLayoutEffect(() => {
    initHorizontalScroll(scrollview, isRTL)
  }, [isRTL])

  return (
    <ScrollView
      ref={props.parentScrollview}
      style={{ flex: 1 }}
      onScroll={props.handleScroll}
      scrollEventThrottle={20}
      onMomentumScrollEnd={props.onScrollEnd}
      onScrollEndDrag={props.onScrollEnd}
      contentContainerStyle={{
        paddingBottom: styles.margin * 5 + (insets.bottom || 0)
      }}
    >
      <View style={{ marginHorizontal: styles.margin * 3 }}>
        <ListSubtitle isRTL={isRTL}>
          <ReadableText>
            {t("search_screen.most_searched_content", "Les fiches les plus recherchées")}
          </ReadableText>
        </ListSubtitle>

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
          )
        })}
      </View>
      <View>
        <ListSubtitle style={{ marginHorizontal: styles.margin * 3 }} isRTL={isRTL}>
            <ReadableText>
              {t("search_screen.themes", "Les thèmes")}
            </ReadableText>
        </ListSubtitle>
        <ScrollView
          ref={scrollview}
          contentContainerStyle={{
            flexDirection: !isRTL ? "row" : "row-reverse",
            flexWrap: "wrap",
            width: 1100,
            paddingHorizontal: styles.margin * 3,
            paddingBottom: styles.margin,
            marginBottom: styles.margin
          }}
          horizontal={true}
        >
          {themes.sort(sortByOrder).map((theme, index) => (
            <TagButton
              key={index}
              name={theme.name[currentLanguageI18nCode || "fr"]}
              backgroundColor={theme.colors.color100}
              iconName={theme.icon}
              inline={true}
              onPress={() => {
                props.navigation.navigate("NeedsScreen", {
                  theme: theme,
                  backScreen: "Search"
                });
                return;
              }}
            />
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  )
}

export default SearchSuggestions;