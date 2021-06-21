import * as React from "react";

import { WrapperWithHeaderAndLanguageModal } from "../WrapperWithHeaderAndLanguageModal";
import { RTLView } from "../../components/BasicComponents";
import { theme } from "../../theme";
import styled from "styled-components/native";
import { ViewChoice } from "../../components/Explorer/ViewChoice";
import { tags } from "../../data/tagData";
import { TagButton } from "../../components/Explorer/TagButton";
import { TagsCaroussel } from "../../components/Explorer/TagsCaroussel";
import { sortByOrder } from "../../libs";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";

const ViewChoiceContainer = styled(RTLView)`
  margin-top: ${theme.margin * 4}px;
  justify-content: center;
  align-items: center;
`;

const TagListContainer = styled.ScrollView`
  margin-horizontal: ${theme.margin * 3}px;
`;

const CarousselContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const CenteredView = styled.View`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
`;
export const ExplorerScreen = () => {
  const { isRTL } = useTranslationWithRTL();
  const [tabSelected, setTabSelected] = React.useState("galery");

  return (
    <WrapperWithHeaderAndLanguageModal>
      <ViewChoiceContainer>
        <ViewChoice
          text={"Galerie"}
          isSelected={tabSelected === "galery"}
          iconName={"galery"}
          onPress={() => setTabSelected("galery")}
        />
        <ViewChoice
          text={"Liste"}
          isSelected={tabSelected === "list"}
          iconName={"list"}
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
        <CenteredView>
          <CarousselContainer>
            <TagsCaroussel isRTL={isRTL} />
          </CarousselContainer>
        </CenteredView>
      )}
    </WrapperWithHeaderAndLanguageModal>
  );
};
