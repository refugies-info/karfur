import React from "react";
import { View } from "react-native";
import { MobileFrenchLevel } from "@refugies-info/api-types";
import { Title } from "../../components/Onboarding/SharedStyledComponents";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { frenchLevelFilters } from "../../data/filtersData";
import { Explaination } from "../../components/Onboarding/Explaination";
import { FilterButton, RadioGroup, ReadableText } from "../../components";

interface Props {
  onSelectFrenchLevel: (key: MobileFrenchLevel) => void;
  selectedFrenchLevel: MobileFrenchLevel | null;
}

export const FilterFrenchLevelComponent = ({
  selectedFrenchLevel,
  onSelectFrenchLevel,
}: Props) => {
  const { t } = useTranslationWithRTL();

  return (
    <View>
      <Title>
        <ReadableText>
          {t(
            "onboarding_screens.french_level",
            "Quel est ton niveau en français ?"
          )}
        </ReadableText>
      </Title>
      <Explaination
        step={3}
        defaultText="C’est pour te montrer les formations faites pour ton niveau de français."
      />
      <RadioGroup>
        {frenchLevelFilters.map((frenchLevel) => (
          <FilterButton
            key={frenchLevel.name}
            text={frenchLevel.name}
            isSelected={
              !!selectedFrenchLevel && frenchLevel.key === selectedFrenchLevel
            }
            onPress={() => {
              onSelectFrenchLevel(frenchLevel.key);
            }}
            details={frenchLevel.cecrCorrespondency}
          />
        ))}
      </RadioGroup>
    </View>
  );
};
