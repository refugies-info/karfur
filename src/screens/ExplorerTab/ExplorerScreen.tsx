import * as React from "react";
import { /* Linking,  */ScrollView } from "react-native";
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
import { TagsCarousel } from "../../components/Explorer/TagsCarousel";
import { nbContentsSelector } from "../../services/redux/Contents/contents.selectors";
import { userLocationSelector, isLocalizedWarningHiddenSelector } from "../../services/redux/User/user.selectors";
import { ExplorerParamList } from "../../../types";
import { logEventInFirebase } from "../../utils/logEvent";
import { FirebaseEvent } from "../../utils/eventsUsedInFirebase";
import { sortByOrder } from "../../libs";
// import { getScreenFromUrl } from "../../libs/getScreenFromUrl";
import { theme } from "../../theme";
import { LocalizedWarningModal } from "../../components/Explorer/LocalizedWarningModal";
import { LocalizedWarningMessage } from "../../components/Explorer/LocalizedWarningMessage";
// import { logger } from "../../logger";

const MAX_CONTENT_LOCALIZED = 10;

const ViewChoiceContainer = styled(RTLView)`
  margin-top: ${theme.margin * 4}px;
  background-color: ${theme.colors.grey60};
  margin-bottom: ${theme.margin * 3}px;
  border-radius: ${theme.radius * 2}px;
  justify-content: center;
  align-items: center;
  align-self: center;
  box-shadow: 1px 1px 8px rgba(33, 33, 33, 0.24);
  elevation: 7;
  width: 270px;
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
  const dispatch = useDispatch();

  const [tabSelected, setTabSelected] = React.useState("galery");
  const selectedLocation = useSelector(userLocationSelector);
  const nbContents = useSelector(nbContentsSelector);
  const isLocalizedWarningHidden = useSelector(isLocalizedWarningHiddenSelector);

  const [isLocalizedModalVisible, setIsLocalizedModalVisible] = React.useState(false);
  const [totalContent, setTotalContent] = React.useState(0);

/*   React.useEffect(() => {
    Linking.getInitialURL().then(url => {
      if (url) {
        logger.info("[initial url]", url)
        const screen = getScreenFromUrl(url);
        if (screen) {
          //@ts-ignore
          navigation.navigate(screen.screenName, screen.params);
        }
      }
    })
  }, []) */

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
          contentContainerStyle={{
            paddingHorizontal: theme.margin * 3,
            paddingBottom: theme.margin * 3,
            paddingTop: theme.margin,
          }}
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
                  colors: {
                    tagName: tag.name,
                    tagDarkColor: tag.darkColor,
                    tagVeryLightColor: tag.color30,
                    tagLightColor: tag.lightColor,
                    iconName: tag.icon,
                  }
                });
                return;
              }}
              style={{
                marginBottom: theme.margin * 3,
                marginTop: 0
              }}
            />
          ))}
        </ScrollView>
      ) : (
        <CenteredView>
          <CarousselContainer>
            <TagsCarousel navigation={navigation} />
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
