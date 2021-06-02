import * as React from "react";
import { t } from "../../services/i18n";
import { useSelector } from "react-redux";
import {
  currentI18nCodeSelector,
  selectedI18nCodeSelector,
} from "../../services/redux/User/user.selectors";
import { WrapperWithHeaderAndLanguageModal } from "../WrapperWithHeaderAndLanguageModal";
import { RTLView } from "../../components/BasicComponents";
import { theme } from "../../theme";
import styled from "styled-components/native";
import { ViewChoice } from "../../components/Explorer/ViewChoice";
import { tags } from "../../data/tagData";
import { TagButton } from "../../components/Explorer/TagButton";
import { TagsCaroussel } from "../../components/Explorer/TagsCaroussel";

import { sortByOrder } from "../../libs";

const ViewChoiceContainer = styled(RTLView)`
  margin-top: ${theme.margin * 6}px;
  justify-content: center;
  align-items: center;
  margin-bottom: ${theme.margin * 2}px;
`;

const TagListContainer = styled.ScrollView`
  margin-horizontal: ${theme.margin * 3}px;
`;

const CarousselContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: ${theme.margin * 5}px;
`;
export const ExplorerScreen = () => {
  const [tabSelected, setTabSelected] = React.useState("galery");

  const currentLanguageI18nCode = useSelector(currentI18nCodeSelector);
  const selectedLanguageI18nCode = useSelector(selectedI18nCodeSelector);

  return (
    <WrapperWithHeaderAndLanguageModal
      currentLanguageI18nCode={currentLanguageI18nCode}
      selectedLanguageI18nCode={selectedLanguageI18nCode}
    >
      <ViewChoiceContainer>
        <ViewChoice
          text={t("ExplorerScreen.Galerie", "Galerie")}
          isSelected={tabSelected === "galery"}
          iconName={"star"}
          onPress={() => setTabSelected("galery")}
        />
        <ViewChoice
          text={t("ExplorerScreen.Liste", "Liste")}
          isSelected={tabSelected === "list"}
          iconName={"star"}
          onPress={() => setTabSelected("list")}
        />
      </ViewChoiceContainer>
      {tabSelected === "list" ? (
        <TagListContainer>
          {tags.sort(sortByOrder).map((tag, index) => (
            <TagButton
              key={index}
              tagName={tag.name}
              backgroundColor={tag.darkColor}
              iconName={tag.icon}
            />
          ))}
        </TagListContainer>
      ) : (
        <CarousselContainer>
          <TagsCaroussel />
        </CarousselContainer>
      )}
    </WrapperWithHeaderAndLanguageModal>
  );
};
