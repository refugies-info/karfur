import { Image } from "react-native";
import { Icon } from "react-native-eva-icons";
import styled from "styled-components/native";

import { useTranslationWithRTL } from "~/hooks/useTranslationWithRTL";
import { styles } from "~/theme";
import ErrorImage from "~/theme/images/error.png";
import { RTLTouchableOpacity } from "./BasicComponents";
import { TextDSFR_MD, TextDSFR_MD_Bold, TextDSFR_XL } from "./StyledText";

interface Props {
  onButtonClick?: () => void;
  text: string;
  title?: string;
  buttonText?: string;
  buttonIcon?: string;
  imageLast?: boolean;
}

const ErrorContainer = styled.View`
  margin-top: ${styles.margin * 7}px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-horizontal: ${styles.margin * 3}px;
`;

const RestartButton = styled(RTLTouchableOpacity)`
  background-color: ${styles.colors.black};
  padding: ${styles.margin * 2}px;
  border-radius: ${styles.radius * 2}px;
`;

export const ErrorScreen = (props: Props) => {
  const { t, isRTL } = useTranslationWithRTL();

  const image = (
    <Image
      source={ErrorImage}
      style={{
        width: 240,
        height: 160,
        marginBottom: styles.margin * 4,
      }}
    />
  );

  return (
    <ErrorContainer>
      {!props.imageLast && image}

      <TextDSFR_XL style={{ marginBottom: styles.margin * 2, textAlign: "center" }}>
        {props.title || t("content_screen.error_title", "Oh non !")}
      </TextDSFR_XL>
      <TextDSFR_MD style={{ textAlign: "center", marginBottom: styles.margin * 4 }}>{props.text}</TextDSFR_MD>

      {props.imageLast && image}

      {!!props.onButtonClick && !!props.buttonIcon && props.buttonText && (
        <RestartButton onPress={props.onButtonClick} accessibilityRole="button">
          <Icon name={props.buttonIcon} height={20} width={20} fill={styles.colors.white} />
          <TextDSFR_MD_Bold
            style={{
              color: styles.colors.white,
              marginLeft: isRTL ? 0 : styles.margin,
              marginRight: isRTL ? styles.margin : 0,
            }}
          >
            {props.buttonText}
          </TextDSFR_MD_Bold>
        </RestartButton>
      )}
    </ErrorContainer>
  );
};
