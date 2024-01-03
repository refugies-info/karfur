import React from "react";
import styled from "styled-components/native";
import { RTLTouchableOpacity } from "../BasicComponents";
import { Icon } from "../iconography";
import { styles } from "../../theme";
import { useTranslationWithRTL } from "../../hooks";
import { Spacer } from "../layout";

const UpButtonContainer = styled(RTLTouchableOpacity)`
  border-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.action};
  align-items: flex-start;
`;
const UpButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.action};
`;

interface Props {
  scrollTop: () => void;
}

export const UpButton = (props: Props) => {
  const { t } = useTranslationWithRTL();

  return (
    <UpButtonContainer onPress={props.scrollTop}>
      <Icon name="arrow-upward" size={16} color={styles.colors.action} />
      <Spacer width={styles.margin} />
      <UpButtonText>
        {t("content_screen.scrollToTop", "Haut de page")}
      </UpButtonText>
    </UpButtonContainer>
  );
};
