import React from "react";
import { Image } from "react-native";
import { Icon } from "react-native-eva-icons";
import styled from "styled-components/native";

import { useTranslationWithRTL } from "../hooks/useTranslationWithRTL";
import { RTLTouchableOpacity } from "./BasicComponents";
import { TextBigBold, TextSmallNormal, TextSmallBold } from "./StyledText";
import { theme } from "../theme";
import ErrorImage from "../theme/images/error.png";

interface Props {
  onButtonClick?: () => void;
  text: string;
  title?: string;
  buttonText?: string;
  buttonIcon?: string;
  imageLast?: boolean;
}

const ErrorContainer = styled.View`
  margin-top: ${theme.margin * 7}px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-horizontal: ${theme.margin * 3}px;
`;

const RestartButton = styled(RTLTouchableOpacity)`
  background-color: ${theme.colors.black};
  padding: ${theme.margin * 2}px;
  border-radius: ${theme.radius * 2}px;
`;

export const ErrorScreen = (props: Props) => {
  const { t, isRTL } = useTranslationWithRTL();

  const image = (
    <Image
      source={ErrorImage}
      style={{
        width: 240,
        height: 160,
        marginBottom: theme.margin * 4
      }}
      width={240}
      height={160}
    />
  );

  return (
    <ErrorContainer>

      {!props.imageLast && image}

      <TextBigBold style={{ marginBottom: theme.margin * 2, textAlign: "center" }}>
        {props.title || t("Content.Oups", "Oups !")}
      </TextBigBold>
      <TextSmallNormal style={{ textAlign: "center", marginBottom: theme.margin * 4 }}>
        {props.text}
      </TextSmallNormal>

      {props.imageLast && image}

      {!!props.onButtonClick && !!props.buttonIcon && props.buttonText &&
        <RestartButton onPress={props.onButtonClick}>
          <Icon
            name={props.buttonIcon}
            height={20}
            width={20}
            fill={theme.colors.white}
          />
          <TextSmallBold
            style={{
              color: theme.colors.white,
              marginLeft: isRTL ? 0 : theme.margin,
              marginRight: isRTL ? theme.margin : 0,
            }}
          >
            {props.buttonText}
          </TextSmallBold>
        </RestartButton>
      }
    </ErrorContainer>
  );
};
