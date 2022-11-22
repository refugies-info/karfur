import React, { useCallback } from "react";
import { StyleProp, ViewStyle } from "react-native";
import {
  TextVerySmallNormal,
  TextSmallBold,
} from "../../components/StyledText";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { RTLTouchableOpacity, RTLView } from "../../components/BasicComponents";
import { logEventInFirebase } from "../../utils/logEvent";
import { FirebaseEvent } from "../../utils/eventsUsedInFirebase";
import Highlight from "../Search/Highlight";
import { Picture, Theme } from "../../types/interface";
import { ReadableText } from "../ReadableText";
import { Columns, ColumnsSpacing, Rows } from "../layout";
import { ExplorerParamList } from "../../../types";
import { isEmpty } from "lodash";
import { UriImage } from "../iconography";

const NeedContainer = styled(RTLTouchableOpacity)<{ needTheme: Theme }>`
  padding: ${({ theme }) => theme.margin * 2}px
  background-color: ${({ needTheme }) => needTheme.colors.color30};
  border-radius: ${({ theme }) => theme.radius * 2}px;
  ${({ theme }) => theme.shadows.needSummary}
  shadow-color: ${({ needTheme }) => needTheme.colors.color100};
`;

const IndicatorContainer = styled(RTLView)`
  height: 50px;
  width: 50px;
  margin-horizontal: ${({ theme }) => theme.margin}px;
`;

interface Props {
  backScreen?: string;
  id: string;
  image: Picture;
  needSubtitle?: string;
  needText?: string;
  needTextFr: string;
  searchItem?: any;
  searchLanguageMatch?: string;
  style?: StyleProp<ViewStyle>;
  theme: Theme;
}

type NeedsScreenNavigationProp = StackNavigationProp<ExplorerParamList>;

export const NeedsSummary = ({
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
}: Props) => {
  const navigation = useNavigation<NeedsScreenNavigationProp>();
  const goToContent = useCallback(() => {
    logEventInFirebase(FirebaseEvent.CLIC_NEED, {
      need: needTextFr,
    });

    navigation.navigate("ContentsScreen", {
      theme: theme,
      needId: id,
      backScreen: backScreen,
    });
    return;
  }, [needTextFr, theme, id, backScreen]);

  return (
    <NeedContainer
      accessibilityRole="button"
      needTheme={theme}
      onPress={goToContent}
      style={style}
    >
      <Columns
        layout="1 auto"
        horizontalAlign="center"
        verticalAlign="center"
        spacing={ColumnsSpacing.Large}
      >
        <Rows verticalAlign="center">
          <TextSmallBold color={theme.colors.color100}>
            {searchItem ? (
              <Highlight
                hit={searchItem}
                attribute={`title_${searchLanguageMatch}`}
                //@ts-ignore
                color={theme.colors.color100}
              />
            ) : (
              <ReadableText>{needText || ""}</ReadableText>
            )}
          </TextSmallBold>

          {!isEmpty(needSubtitle) ? (
            <TextVerySmallNormal color={theme.colors.color100}>
              {needSubtitle}
            </TextVerySmallNormal>
          ) : null}
        </Rows>

        <IndicatorContainer>
          <UriImage uri={image.secure_url} />
        </IndicatorContainer>
      </Columns>
    </NeedContainer>
  );
};
