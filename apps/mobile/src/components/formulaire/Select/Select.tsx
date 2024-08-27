import { View } from "react-native";
import { Icon } from "react-native-eva-icons";
import styled, { useTheme } from "styled-components/native";
import { RTLTouchableOpacity } from "../../BasicComponents";
import Columns from "../../layout/Columns";
import { ReadableText } from "../../ReadableText";
import { TextDSFR_MD } from "../../StyledText";

export interface SelectProps {
  children: any;
  label?: string;
  onPress: () => void;
  testID: string;
}

const MainContainer = styled(RTLTouchableOpacity)`
  background-color: ${({ theme }) => theme.colors.white};
  ${({ theme }) => theme.shadows.sm_dsfr};
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-top: ${({ theme }) => theme.margin}px;
  padding: ${({ theme }) => theme.margin * 2}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.dsfr_borderGrey};
`;

export const Select = ({ children, label, onPress, testID }: SelectProps) => {
  const theme = useTheme();
  return (
    <View>
      <TextDSFR_MD>{label}</TextDSFR_MD>
      <MainContainer accessibilityRole="button" onPress={onPress} testID={testID}>
        <Columns RTLBehaviour layout="1 auto" verticalAlign="center">
          <ReadableText>{children}</ReadableText>
          <Icon name="chevron-down" width={24} height={24} fill={theme.colors.dsfr_dark} />
        </Columns>
      </MainContainer>
    </View>
  );
};

export default Select;
