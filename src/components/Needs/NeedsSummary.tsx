import React, { useCallback } from "react";
import { StyleProp, ViewStyle } from "react-native";
import {
  TextVerySmallNormal,
  TextSmallBold,
} from "../../components/StyledText";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SvgUri } from "react-native-svg";

import { RTLTouchableOpacity, RTLView } from "../../components/BasicComponents";
import { logEventInFirebase } from "../../utils/logEvent";
import { FirebaseEvent } from "../../utils/eventsUsedInFirebase";
import Highlight from "../Search/Highlight";
import { Theme } from "../../types/interface";
import { ReadableText } from "../ReadableText";
import { getImageUri } from "../../libs/getImageUri";
import { Columns, ColumnsSpacing, Rows } from "../layout";
import { ExplorerParamList } from "../../../types";

const NeedContainer = styled(RTLTouchableOpacity)`
  padding: ${({ theme }) => theme.margin * 2}px
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radius * 2}px;
  ${({ theme }) => theme.shadows.lg}
`;

const IndicatorContainer = styled(RTLView)`
  height: 50px;
  width: 50px;
`;

interface Props {
  backScreen?: string;
  id: string;
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
      theme,
      needId: id,
      backScreen: backScreen,
    });
    return;
  }, [needTextFr, theme, id, backScreen]);

  return (
    <NeedContainer
      accessibilityRole="button"
      onPress={goToContent}
      style={style}
    >
      <Columns
        layout="1 auto"
        horizontalAlign="center"
        verticalAlign="center"
        spacing={ColumnsSpacing.NoSpace}
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

          {needSubtitle && (
            <TextVerySmallNormal color={theme.colors.color100}>
              {needSubtitle}
            </TextVerySmallNormal>
          )}
        </Rows>

        <IndicatorContainer>
          <SvgUri
            width={"100%"}
            height={"100%"}
            uri={getImageUri(theme.appImage.secure_url)}
          />
        </IndicatorContainer>
      </Columns>
    </NeedContainer>
  );
};
