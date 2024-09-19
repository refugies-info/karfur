import styled from "styled-components/native";
import { useTranslationWithRTL } from "~/hooks/useTranslationWithRTL";
import { ReadableText } from "../../ReadableText";
import { TextDSFR_MD_Med, TextDSFR_XS_Bold } from "../../StyledText";
import ChoiceButton from "../ChoiceButton";

export interface FilterButtonProps {
  text: string;
  isSelected: boolean;
  onPress: () => void;
  details?: undefined | string[];
}

const Content = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => 0.5 * theme.margin}px;
`;
const StyledText = styled(TextDSFR_MD_Med)<{ isSelected: boolean }>`
  color: ${({ isSelected, theme }) => (isSelected ? theme.colors.dsfr_action : theme.colors.dsfr_dark)};
  padding-vertical: ${({ theme }) => theme.margin / 2}px;
  vertical-align: middle;
`;
const Details = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => 0.5 * theme.margin}px;
`;
const DetailTag = styled.View`
  background-color: #e8edff;
  padding-horizontal: ${({ theme }) => 0.75 * theme.margin}px;
  border-radius: ${({ theme }) => 0.5 * theme.margin}px;
`;
const DetailTagText = styled(TextDSFR_XS_Bold)`
  color: #0063cb;
`;

const FilterButton = (props: FilterButtonProps) => {
  const { t } = useTranslationWithRTL();
  return (
    <ChoiceButton onPress={props.onPress} isSelected={props.isSelected} testID={`test-filter-${props.text}`}>
      <ReadableText text={t("filters." + props.text)}>
        <Content>
          <StyledText isSelected={props.isSelected}>{t("filters." + props.text, props.text)}</StyledText>
          {props.text !== "french_level_0" && props.details && (
            <Details>
              {props.details.map((detail, i) => (
                <DetailTag key={i}>
                  <DetailTagText>{detail}</DetailTagText>
                </DetailTag>
              ))}
            </Details>
          )}
        </Content>
      </ReadableText>
    </ChoiceButton>
  );
};

export default FilterButton;
