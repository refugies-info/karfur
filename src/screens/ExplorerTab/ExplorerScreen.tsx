import * as React from "react";
import { ScrollView } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import styled from "styled-components/native";
import { useDispatch, useSelector } from "react-redux";

import {
  saveUserLocalizedWarningHiddenActionCreator
} from "../../services/redux/User/user.actions";
import { WrapperWithHeaderAndLanguageModal } from "../WrapperWithHeaderAndLanguageModal";
import { RTLView } from "../../components/BasicComponents";
import { ViewChoice } from "../../components/Explorer/ViewChoice";
import { tags } from "../../data/tagData";
import { TagButton } from "../../components/Explorer/TagButton";
import { TagsCaroussel } from "../../components/Explorer/TagsCaroussel";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { nbContentsSelector } from "../../services/redux/Contents/contents.selectors";
import { userLocationSelector, isLocalizedWarningHiddenSelector } from "../../services/redux/User/user.selectors";
import { ExplorerParamList } from "../../../types";
import { logEventInFirebase } from "../../utils/logEvent";
import { FirebaseEvent } from "../../utils/eventsUsedInFirebase";
import { sortByOrder } from "../../libs";
import { theme } from "../../theme";
import { LocalizedWarningModal } from "../../components/Explorer/LocalizedWarningModal";
import { LocalizedWarningMessage } from "../../components/Explorer/LocalizedWarningMessage";

const MAX_CONTENT_LOCALIZED = 10;

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
  const dispatch = useDispatch();

  const [tabSelected, setTabSelected] = React.useState("galery");
  const selectedLocation = useSelector(userLocationSelector);
  const nbContents = useSelector(nbContentsSelector);
  const isLocalizedWarningHidden = useSelector(isLocalizedWarningHiddenSelector);

  const [isLocalizedModalVisible, setIsLocalizedModalVisible] = React.useState(false);
  const [totalContent, setTotalContent] = React.useState(0);
  React.useEffect(() => {
    setTotalContent(
      (nbContents.nbGlobalContent || 0) + (nbContents.nbLocalizedContent || 0)
    );
  }, [nbContents]);

  const [isLocalizedWarningVisible, setIsLocalizedWarningVisible] = React.useState(false);
  React.useEffect(() => {
    const isWarningVisible = !!(
      !isLocalizedWarningHidden &&
      selectedLocation.city &&
      nbContents.nbLocalizedContent !== null &&
      nbContents.nbLocalizedContent < MAX_CONTENT_LOCALIZED
    );
    setIsLocalizedWarningVisible(isWarningVisible);
  }, [isLocalizedWarningHidden, selectedLocation, nbContents]);


  return (
    <WrapperWithHeaderAndLanguageModal>
      {isLocalizedWarningVisible &&
        <LocalizedWarningMessage
          totalContent={totalContent}
          city={selectedLocation.city || ""}
          openModal={() => { setIsLocalizedModalVisible(true) }}
          onClose={() => dispatch(saveUserLocalizedWarningHiddenActionCreator())}
        />
      }

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

      {isLocalizedWarningVisible &&
        <LocalizedWarningModal
          isVisible={isLocalizedModalVisible}
          closeModal={() => setIsLocalizedModalVisible(false)}
          nbGlobalContent={nbContents.nbGlobalContent || 0}
          nbLocalizedContent={nbContents.nbLocalizedContent || 0}
          city={selectedLocation.city || ""}
        />
      }
    </WrapperWithHeaderAndLanguageModal>
  );
};
