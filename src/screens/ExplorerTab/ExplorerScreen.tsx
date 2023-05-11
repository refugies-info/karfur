import React, { useState, useEffect } from "react";
import * as Linking from "expo-linking";
import { StackScreenProps } from "@react-navigation/stack";
import { useFocusEffect } from "@react-navigation/native";
import styled from "styled-components/native";
import { useDispatch, useSelector } from "react-redux";

import {
  setInitialUrlUsed,
  setRedirectDispositifActionCreator,
} from "../../services/redux/User/user.actions";
import { RTLView } from "../../components/BasicComponents";
import { ViewChoice } from "../../components/Explorer/ViewChoice";
import { TagButton } from "../../components/Explorer/TagButton";
import { TagsCarousel } from "../../components/Explorer/TagsCarousel";
import {
  isInitialUrlUsedSelector,
  redirectDispositifSelector,
  currentI18nCodeSelector,
} from "../../services/redux/User/user.selectors";
import { ExplorerParamList } from "../../../types";
import { logEventInFirebase } from "../../utils/logEvent";
import { FirebaseEvent } from "../../utils/eventsUsedInFirebase";
import { sortByOrder } from "../../libs";
import { getScreenFromUrl } from "../../libs/getScreenFromUrl";
import { styles } from "../../theme";
import { logger } from "../../logger";
import { themesSelector } from "../../services/redux/Themes/themes.selectors";
import LocationWarning from "../../components/Explorer/LocationWarning";
import { NotificationsModal } from "../../components/Notifications";
import { Page, Rows } from "../../components";

const ViewChoiceContainer = styled(RTLView)`
  margin-top: ${styles.margin * 4}px;
  background-color: ${styles.colors.grey60};
  margin-bottom: ${styles.margin * 3}px;
  border-radius: ${styles.radius * 2}px;
  justify-content: center;
  align-items: center;
  align-self: center;
  ${styles.shadows.lg}
  width: 270px;
`;
const CarousselContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;
export const ExplorerScreen = ({
  navigation,
}: StackScreenProps<ExplorerParamList, "ExplorerScreen">) => {
  const dispatch = useDispatch();

  const [tabSelected, setTabSelected] = useState("galery");
  const themes = useSelector(themesSelector);
  const currentLanguageI18nCode = useSelector(currentI18nCodeSelector);

  // Handle share link
  const handleOpenUrl = (event: Linking.EventType | string | null) => {
    if (event) {
      let url = typeof event === "object" ? event.url : event;
      logger.info("[initialUrl]", url);
      if (!url.includes("refugies.info")) return;
      const screen = getScreenFromUrl(url);
      if (screen) {
        //@ts-ignore
        navigation.navigate(screen.rootNavigator, screen.screenParams);
      }
    }
  };
  const isInitialUrlUsed = useSelector(isInitialUrlUsedSelector);
  useEffect(() => {
    const emitter = Linking.addEventListener("url", (event) =>
      handleOpenUrl(event)
    );
    if (!isInitialUrlUsed) {
      Linking.getInitialURL()
        .then(handleOpenUrl)
        .then(() => dispatch(setInitialUrlUsed(true)));
    }

    return emitter.remove;
  }, []);

  // When the screen gets focus, redirect if needed
  const redirectDispositif = useSelector(redirectDispositifSelector);
  const redirect = React.useCallback(() => {
    if (redirectDispositif) {
      navigation.navigate("NeedsScreen", {
        theme: redirectDispositif.theme,
      });
      navigation.navigate("ContentsScreen", {
        needId: redirectDispositif.needId,
        theme: redirectDispositif.theme,
        backScreen: "",
      });
      navigation.navigate("ContentScreen", {
        contentId: redirectDispositif.contentId,
        needId: redirectDispositif.needId,
        theme: redirectDispositif.theme,
        backScreen: "",
      });
      dispatch(setRedirectDispositifActionCreator(null));
    }
  }, [redirectDispositif]);
  useFocusEffect(redirect);

  return (
    <>
      <Page showLogo>
        <LocationWarning />

        <Rows layout="auto 1" verticalAlign="space-between">
          <ViewChoiceContainer>
            <ViewChoice
              text={"gallery"}
              isSelected={tabSelected === "galery"}
              iconName={"galery"}
              onPress={() => {
                logEventInFirebase(FirebaseEvent.CLIC_CAROUSEL, {});

                setTabSelected("galery");
              }}
            />
            <ViewChoice
              text={"list"}
              isSelected={tabSelected === "list"}
              iconName={"list"}
              onPress={() => {
                logEventInFirebase(FirebaseEvent.CLIC_LIST, {});

                setTabSelected("list");
              }}
            />
          </ViewChoiceContainer>
          {tabSelected === "list" ? (
            themes.sort(sortByOrder).map((currentTheme, index) => (
              <TagButton
                key={index}
                name={currentTheme.name[currentLanguageI18nCode || "fr"]}
                backgroundColor={[
                  currentTheme.colors.color100,
                  currentTheme.colors.color80,
                ]}
                icon={currentTheme.appImage}
                iconSize={60}
                onPress={() => {
                  logEventInFirebase(FirebaseEvent.CLIC_THEME, {
                    theme: currentTheme.name.fr,
                    view: "list",
                  });

                  navigation.navigate("NeedsScreen", {
                    theme: currentTheme,
                  });
                  return;
                }}
                style={{
                  marginBottom: styles.margin,
                  marginTop: 0,
                  padding: 8,
                }}
              />
            ))
          ) : (
            <Rows verticalAlign="center">
              <CarousselContainer>
                <TagsCarousel navigation={navigation} />
              </CarousselContainer>
            </Rows>
          )}
        </Rows>
      </Page>
      <NotificationsModal />
    </>
  );
};
