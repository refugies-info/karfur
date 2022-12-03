import React from "react";
import { View } from "react-native";
import { useQueryClient } from "react-query";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import styled, { useTheme } from "styled-components/native";
//@ts-expect-error
import moment from "moment/min/moment-with-locales";

import { Notification } from "../../hooks/useNotifications";
import { markNotificationAsSeen } from "../../utils/API";

import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";

import { CustomButton } from "../CustomButton";
import { ExplorerParamList } from "../../../types";
import { StyledTextSmall, TextVerySmallNormal } from "../StyledText";
import { Columns, Rows, RowsSpacing } from "../layout";

const Container = styled.TouchableOpacity<{ seen: boolean }>`
  padding-vertical: ${({ theme }) => theme.margin * 2}px;
  padding-horizontal: ${({ theme }) => theme.margin * 3}px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radius * 2}px;
  ${({ seen, theme }) =>
    seen ? theme.shadows.lg : `background-color: ${theme.colors.lightBlue};`}
  flex-direction: ${({ theme }) => (theme.i18n.isRTL ? "row-reverse" : "row")};
`;

const CardTitle = styled(StyledTextSmall)<{ seen: boolean }>`
  font-weight: ${({ seen }) => (seen ? "bold" : "500")};
  font-family: ${({ seen, theme }) =>
    seen
      ? theme.fonts.families.circularStandard
      : theme.fonts.families.circularBold};
`;

const Dot = styled.View`
  background-color: #e8140f;
  width: 10px;
  height: 10px;
  border-radius: 100px;
  position: absolute;
  left: ${({ theme }) => theme.margin}px;
  top: ${({ theme }) => theme.margin * 3}px;
`;

interface NotificationCardProps {
  notification: Notification;
}

export const NotificationCard = ({ notification }: NotificationCardProps) => {
  const { isRTL, i18n } = useTranslationWithRTL();
  const theme = useTheme();
  const { data, _id, title, seen, createdAt } = notification;
  const navigation =
    useNavigation<
      StackNavigationProp<ExplorerParamList, "NotificationsScreen">
    >();
  const queryClient = useQueryClient();

  const markAsSeen = async () => {
    await markNotificationAsSeen(_id);
    queryClient.invalidateQueries("notifications");
  };

  const navigateToContent = async () => {
    navigation.navigate("Explorer", {
      screen: "ContentScreen",
      params: {
        contentId: data?.contentId,
      },
    });
    markAsSeen();
  };

  return (
    <Container activeOpacity={0.8} onPress={navigateToContent} seen={seen}>
      {!seen && <Dot />}
      <Rows spacing={RowsSpacing.Text}>
        <CardTitle seen={seen}>{title}</CardTitle>
        <TextVerySmallNormal>
          {moment(createdAt).locale(i18n.language).fromNow()}
        </TextVerySmallNormal>
        <Columns horizontalAlign="space-between" RTLBehaviour>
          <CustomButton
            i18nKey="notifications.viewFiche"
            backgroundColor={
              seen ? theme.colors.lightBlue : theme.colors.darkBlue
            }
            defaultText="Voir la fiche"
            textColor={seen ? theme.colors.darkBlue : theme.colors.white}
            isTextNotBold={seen}
            notFullWidth={true}
            isSmall={true}
            withShadows={false}
            iconName={isRTL ? "arrow-back" : "arrow-forward"}
            onPress={navigateToContent}
            style={{
              marginTop: theme.margin,
              flexGrow: !seen ? 1 : 0,
            }}
            textStyle={{
              fontSize: theme.fonts.sizes.verySmall,
            }}
            iconSize={16}
          />
          {seen ? (
            <View />
          ) : (
            <CustomButton
              i18nKey="notifications.markAsSeen"
              defaultText="Marquer comme vu"
              textColor={theme.colors.darkBlue}
              backgroundColor={theme.colors.lightBlue}
              isTextNotBold={true}
              notFullWidth={true}
              isSmall={true}
              withShadows={false}
              onPress={markAsSeen}
              style={{
                marginTop: theme.margin,
                borderColor: theme.colors.darkBlue,
                borderWidth: 1,
              }}
              textStyle={{
                fontSize: theme.fonts.sizes.verySmall,
              }}
            />
          )}
        </Columns>
      </Rows>
    </Container>
  );
};
