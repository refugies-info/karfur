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
import { ScrollView } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { ExplorerParamList } from "../../../types";
import { logEventInFirebase } from "../../utils/logEvent";
import { FirebaseEvent } from "../../utils/eventsUsedInFirebase";

const ViewChoiceContainer = styled(RTLView)`
  margin-top: ${theme.margin * 4}px;
  justify-content: center;
  align-items: center;
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
export const ExplorerScreen = ({
  navigation,
}: StackScreenProps<ExplorerParamList, "ExplorerScreen">) => {
  const { isRTL } = useTranslationWithRTL();
  const [tabSelected, setTabSelected] = React.useState("galery");

  return (
    <WrapperWithHeaderAndLanguageModal>
      <ViewChoiceContainer>
        <ViewChoice
          text={"Galerie"}
          isSelected={tabSelected === "galery"}
          iconName={"galery"}
          onPress={() => {
            logEventInFirebase(FirebaseEvent.CLIC_CAROUSEL, {});

            setTabSelected("galery");
          }}
        />
        <ViewChoice
          text={"Liste"}
          isSelected={tabSelected === "list"}
          iconName={"list"}
          onPress={() => {
            logEventInFirebase(FirebaseEvent.CLIC_LIST, {});

            setTabSelected("list");
          }}
        />
      </ViewChoiceContainer>
      {tabSelected === "list" ? (
        <ScrollView
          contentContainerStyle={{ padding: theme.margin * 3 }}
          scrollIndicatorInsets={{ right: 1 }}
        >
          {tags.sort(sortByOrder).map((tag, index) => (
            <TagButton
              key={index}
              tagName={tag.name}
              backgroundColor={tag.darkColor}
              iconName={tag.icon}
              onPress={() => {
                // eslint-disable-next-line no-undef
                logEventInFirebase(FirebaseEvent.CLIC_THEME, {
                  theme: tag.name,
                  view: "list",
                });

                navigation.navigate("NeedsScreen", {
                  tagName: tag.name,
                  tagDarkColor: tag.darkColor,
                  tagVeryLightColor: tag.color30,
                  tagLightColor: tag.lightColor,
                  iconName: tag.icon,
                });
                return;
              }}
            />
          ))}
        </ScrollView>
      ) : (
        <CenteredView>
          <CarousselContainer>
            <TagsCaroussel isRTL={isRTL} navigation={navigation} />
          </CarousselContainer>
        </CenteredView>
      )}
    </WrapperWithHeaderAndLanguageModal>
  );
};
