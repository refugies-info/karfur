import styled from "styled-components/native";
import CityIcon from "~/theme/images/onboarding/city-icon.svg";
import { RTLTouchableOpacity, RTLView } from "../../BasicComponents";
import { ReadableText } from "../../ReadableText";
import { TextDSFR_MD, TextDSFR_MD_Bold } from "../../StyledText";

const CityText = styled(TextDSFR_MD_Bold)`
  color: ${({ theme }) => theme.colors.dsfr_dark};
`;
const DepartmentText = styled(TextDSFR_MD)`
  color: ${({ theme }) => theme.colors.dsfr_mentionGrey};
  margin-horizontal: ${({ theme }) => theme.margin}px;
`;

const ButtonContainer = styled(RTLTouchableOpacity)`
  padding-vertical: ${({ theme }) => theme.margin * 2}px;
  align-items: center;
  gap: ${({ theme }) => theme.margin * 1.5}px;
  border-top-width: 1px;
  border-top-style: solid;
  border-top-color: ${({ theme }) => theme.colors.dsfr_actionLowBlue};
`;

const ICON_SIZE = 24;

interface Props {
  city: string;
  department?: string;
  onSelect: () => void;
}

const CityChoice = ({ city, department, onSelect }: Props) => {
  return (
    <ButtonContainer onPress={onSelect} accessibilityRole="button">
      <CityIcon width={ICON_SIZE} height={ICON_SIZE} />
      <ReadableText text={`${city} (${department})`}>
        <RTLView>
          <CityText>{city}</CityText>
          {department && <DepartmentText>({department})</DepartmentText>}
        </RTLView>
      </ReadableText>
    </ButtonContainer>
  );
};

export default CityChoice;
