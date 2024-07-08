import * as React from "react";
import styled from "styled-components/native";
import { View } from "react-native";
import { RTLView } from "../BasicComponents";
import { styles } from "../../theme";
import { TextDSFR_MD_Med } from "../StyledText";
import { Icon } from "../iconography";
import { useTranslationWithRTL } from "../../hooks";
import Separator, { SeparatorSpacing } from "../layout/Separator/Separator";

const Container = styled.View`
  background-color: white;
  padding-vertical: ${({ theme }) => theme.margin}px;
  padding-horizontal: ${({ theme }) => theme.margin * 3}px;
  margin-bottom: ${({ theme }) => theme.margin * 2}px;
  border: 1px solid ${({ theme }) => theme.colors.dsfr_borderGrey};
`;

const Option = styled(RTLView)`
  padding-vertical: ${({ theme }) => theme.margin * 2}px;
`;

interface Props {
  items: { text: string; icon: string }[];
}

export const IconList = (props: Props) => {
  const { isRTL } = useTranslationWithRTL();

  return (
    <Container>
      {props.items.map((item, i) => (
        <View key={i}>
          <Option>
            <Icon name={item.icon} size={24} color={styles.colors.black} />
            <TextDSFR_MD_Med
              style={{
                marginRight: isRTL ? styles.margin * 2 : 0,
                marginLeft: !isRTL ? styles.margin * 2 : 0,
              }}
            >
              {item.text}
            </TextDSFR_MD_Med>
          </Option>
          {i < props.items.length - 1 && (
            <Separator spacing={SeparatorSpacing.NoSpace} fullWidth />
          )}
        </View>
      ))}
    </Container>
  );
};
