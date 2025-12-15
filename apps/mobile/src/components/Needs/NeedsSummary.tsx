import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { GetThemeResponse, Picture } from "@refugies-info/api-types";
import type { Hit } from "algoliasearch";
import isEmpty from "lodash/isEmpty";
import { memo, useCallback } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import styled from "styled-components/native";
import { RTLTouchableOpacity, RTLView } from "~/components/BasicComponents";
import type { SearchItem } from "~/components/Search/types";
import { TextDSFR_MD_Bold, TextDSFR_S } from "~/components/StyledText";
import type { ValidScreen } from "~/libs/backButton";
import type { ExplorerParamList } from "~/types/navigation";
import { FirebaseEvent } from "~/utils/eventsUsedInFirebase";
import { logEventInFirebase } from "~/utils/logEvent";
import { UriImage } from "../iconography";
import { Columns, ColumnsSpacing, Rows, RowsSpacing } from "../layout";
import { ReadableText } from "../ReadableText";
import Highlight from "../Search/Highlight";

const NeedContainer = styled(RTLTouchableOpacity)<{
  needTheme: GetThemeResponse;
}>`
  padding: ${({ theme }) => theme.margin * 2}px;
  background-color: ${({ needTheme }) => needTheme.colors.color30};
  border-radius: ${({ theme }) => theme.radius * 2}px;
  ${({ theme }) => theme.shadows.needSummary}
  shadow-color: ${({ needTheme }) => needTheme.colors.color100};
`;

const IndicatorContainer = styled(RTLView)`
  height: 40px;
  width: 40px;
  margin-horizontal: ${({ theme }) => theme.margin}px;
`;

interface Props {
  backScreen?: ValidScreen;
  id: string;
  image?: Picture;
  needSubtitle?: string;
  needText?: string;
  needTextFr: string;
  searchItem?: Hit<SearchItem>;
  searchLanguageMatch?: string;
  style?: StyleProp<ViewStyle>;
  theme: GetThemeResponse;
  pressCallback?: () => void;
  beforeNavigate?: () => boolean;
}

type NeedsScreenNavigationProp = StackNavigationProp<ExplorerParamList>;

const NeedsSummaryComponent = ({
  backScreen,
  id,
  image,
  needSubtitle,
  needText,
  needTextFr,
  searchItem,
  searchLanguageMatch = "fr",
  style = {},
  theme,
  pressCallback,
  beforeNavigate,
}: Props) => {
  const navigation = useNavigation<NeedsScreenNavigationProp>();
  const goToContent = useCallback(() => {
    const shouldNavigate = !beforeNavigate ? true : beforeNavigate();
    if (shouldNavigate) {
      logEventInFirebase(FirebaseEvent.CLIC_NEED, {
        need: needTextFr,
      });
      if (pressCallback) pressCallback();

      navigation.navigate("ContentsScreen", {
        theme: theme,
        needId: id,
        backScreen: backScreen,
      });
      return;
    }
  }, [needTextFr, theme, id, backScreen, pressCallback]);

  return (
    <NeedContainer accessibilityRole="button" needTheme={theme} onPress={goToContent} style={style}>
      <Columns
        layout="1 auto"
        horizontalAlign="center"
        verticalAlign="center"
        spacing={ColumnsSpacing.Large}
      >
        <Rows spacing={RowsSpacing.Text} verticalAlign="center">
          <TextDSFR_MD_Bold color={theme.colors.color100}>
            {searchItem ? (
              <Highlight
                hit={searchItem}
                attribute={`title_${searchLanguageMatch}`}
                color={theme.colors.color100}
              />
            ) : (
              <ReadableText>{needText || ""}</ReadableText>
            )}
          </TextDSFR_MD_Bold>

          {!isEmpty(needSubtitle) ? (
            <TextDSFR_S color={theme.colors.color100}>
              <ReadableText>{needSubtitle}</ReadableText>
            </TextDSFR_S>
          ) : null}
        </Rows>

        <IndicatorContainer>{image && <UriImage uri={image.secure_url} />}</IndicatorContainer>
      </Columns>
    </NeedContainer>
  );
};

export const NeedsSummary = memo(NeedsSummaryComponent);
