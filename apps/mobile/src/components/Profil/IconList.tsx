import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import styled, { useTheme } from "styled-components/native";
import { useTranslationWithRTL } from "~/hooks";
import { RTLTouchableOpacity } from "../BasicComponents";
import { TextDSFR_L_Bold, TextDSFR_MD_Med } from "../StyledText";
import { Icon } from "../iconography";
import Separator, { SeparatorSpacing } from "../layout/Separator/Separator";

const Container = styled.View`
  background-color: white;
  padding-vertical: ${({ theme }) => theme.margin}px;
  padding-horizontal: ${({ theme }) => theme.margin * 3}px;
  margin-bottom: ${({ theme }) => theme.margin * 2}px;
  border: 1px solid ${({ theme }) => theme.colors.dsfr_borderGrey};
`;

const Option = styled(RTLTouchableOpacity)`
  padding-vertical: ${({ theme }) => theme.margin * 2}px;
`;

interface Props {
  items: { text: string; icon: string; path?: string }[];
  title?: string;
}

export const IconList = (props: Props) => {
  const { isRTL } = useTranslationWithRTL();
  const theme = useTheme();
  const navigation: any = useNavigation();

  return (
    <Container>
      {props.title && <TextDSFR_L_Bold style={{ paddingVertical: theme.margin * 2 }}>{props.title}</TextDSFR_L_Bold>}
      {props.items.map((item, i) => (
        <View key={i}>
          <Option
            accessibilityRole={!!item.path ? "link" : "text"}
            onPress={() => (!!item.path ? navigation.navigate(item.path) : null)}
          >
            <Icon name={item.icon} size={24} color={theme.colors.black} />
            <TextDSFR_MD_Med
              style={{
                marginRight: isRTL ? theme.margin * 2 : 0,
                marginLeft: !isRTL ? theme.margin * 2 : 0,
              }}
            >
              {item.text}
            </TextDSFR_MD_Med>

            {!!item.path && (
              <Icon
                name="chevron-right-outline"
                size={24}
                color={theme.colors.dsfr_mentionGrey}
                style={{ marginLeft: "auto" }}
              />
            )}
          </Option>
          {i < props.items.length - 1 && (
            <Separator spacing={SeparatorSpacing.NoSpace} fullWidth color={theme.colors.dsfr_borderGrey} />
          )}
        </View>
      ))}
    </Container>
  );
};
