import { GetContentsForAppRequest } from "@refugies-info/api-types";
import { View } from "react-native";
import { FilterButton, RadioGroup, ReadableText } from "~/components";
import { Explaination } from "~/components/Onboarding/Explaination";
import { Title } from "~/components/Onboarding/SharedStyledComponents";
import { ageFilters } from "~/data/filtersData";
import { useTranslationWithRTL } from "~/hooks/useTranslationWithRTL";

interface Props {
  onAgeClick: (key: GetContentsForAppRequest["age"]) => void;
  selectedAge: GetContentsForAppRequest["age"];
}

export const FilterAgeComponent = (props: Props) => {
  const { t } = useTranslationWithRTL();

  return (
    <View>
      <Title>
        <ReadableText>{t("onboarding_screens.age", "Quel âge as-tu ?")}</ReadableText>
      </Title>
      <Explaination step={2} defaultText="C’est pour te montrer les démarches et les activités pour ton âge." />
      <RadioGroup>
        {ageFilters.map((age) => (
          <FilterButton
            key={age.name}
            text={age.name}
            isSelected={age.key === props.selectedAge}
            onPress={() => props.onAgeClick(age.key)}
          />
        ))}
      </RadioGroup>
    </View>
  );
};
