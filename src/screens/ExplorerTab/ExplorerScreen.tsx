import * as React from "react";
import { ScrollView } from "react-native";
import * as Linking from "expo-linking";
import { StackScreenProps } from "@react-navigation/stack";
import { useFocusEffect } from "@react-navigation/native";
import styled from "styled-components/native";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-native-modal";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { EnableNotifications } from "../../components/Notifications/EnableNotifications";

import {
  saveUserLocalizedWarningHiddenActionCreator,
  setInitialUrlUsed,
  setRedirectDispositifActionCreator,
} from "../../services/redux/User/user.actions";
import { WrapperWithHeaderAndLanguageModal } from "../WrapperWithHeaderAndLanguageModal";
import { RTLView } from "../../components/BasicComponents";
import { ViewChoice } from "../../components/Explorer/ViewChoice";
import { TagButton } from "../../components/Explorer/TagButton";
import { TagsCarousel } from "../../components/Explorer/TagsCarousel";
import { nbContentsSelector } from "../../services/redux/Contents/contents.selectors";
import {
  userLocationSelector,
  isLocalizedWarningHiddenSelector,
  isInitialUrlUsedSelector,
  redirectDispositifSelector,
} from "../../services/redux/User/user.selectors";
import { ExplorerParamList } from "../../../types";
import { logEventInFirebase } from "../../utils/logEvent";
import { FirebaseEvent } from "../../utils/eventsUsedInFirebase";
import { sortByOrder } from "../../libs";
import { getScreenFromUrl } from "../../libs/getScreenFromUrl";
import { styles } from "../../theme";
import { LocalizedWarningModal } from "../../components/Explorer/LocalizedWarningModal";
import { LocalizedWarningMessage } from "../../components/Explorer/LocalizedWarningMessage";
import { logger } from "../../logger";
import { useNotificationsStatus } from "../../hooks/useNotificationsStatus";
import { themesSelector } from "../../services/redux/Themes/themes.selectors";

const MAX_CONTENT_LOCALIZED = 10;

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
  const themes = useSelector(themesSelector);

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
    Linking.addEventListener("url", (event) => handleOpenUrl(event));
    if (!isInitialUrlUsed) {
      Linking.getInitialURL()
        .then(handleOpenUrl)
        .then(() => dispatch(setInitialUrlUsed(true)));
    }

    return Linking.removeEventListener("url", handleOpenUrl);
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

  // Calculate total content for warning
  const nbContents = useSelector(nbContentsSelector);
  const isLocalizedWarningHidden = useSelector(
    isLocalizedWarningHiddenSelector
  );
  const [isLocalizedModalVisible, setIsLocalizedModalVisible] = useState(false);
  const [totalContent, setTotalContent] = useState(0);

  useEffect(() => {
    setTotalContent(
      (nbContents.nbGlobalContent || 0) + (nbContents.nbLocalizedContent || 0)
    );
  }, [nbContents]);

  const [isLocalizedWarningVisible, setIsLocalizedWarningVisible] =
    useState(false);
  useEffect(() => {
    const isWarningVisible = !!(
      !isLocalizedWarningHidden &&
      selectedLocation.city &&
      nbContents.nbLocalizedContent !== null &&
      nbContents.nbLocalizedContent < MAX_CONTENT_LOCALIZED
    );
    setIsLocalizedWarningVisible(isWarningVisible);
  }, [isLocalizedWarningHidden, selectedLocation, nbContents]);

  const [accessGranted] = useNotificationsStatus();
  const [notificationsModalVisible, setNotificationsModalVisible] =
    useState<boolean>(false);

  useEffect(() => {
    const showModal = async () => {
      const keyExists = await AsyncStorage.getItem("notificationsModal");
      if (!accessGranted) {
        if (!keyExists) {
          await AsyncStorage.setItem("notificationsModal", "true");
          setNotificationsModalVisible(true);
        }
      } else if (accessGranted && notificationsModalVisible) {
        setNotificationsModalVisible(false);
      }
    };

    showModal();
  }, [accessGranted]);

  return (
    <WrapperWithHeaderAndLanguageModal>
      {isLocalizedWarningVisible && (
        <LocalizedWarningMessage
          totalContent={totalContent}
          city={selectedLocation.city || ""}
          openModal={() => {
            setIsLocalizedModalVisible(true);
          }}
          onClose={() =>
            dispatch(saveUserLocalizedWarningHiddenActionCreator())
          }
        />
      )}

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
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: styles.margin * 3,
            paddingBottom: styles.margin * 3,
            paddingTop: styles.margin,
          }}
          scrollIndicatorInsets={{ right: 1 }}
        >
          {themes.sort(sortByOrder).map((currentTheme, index) => (
            <TagButton
              key={index}
              name={currentTheme.name.fr}
              backgroundColor={currentTheme.colors.color100}
              iconName={currentTheme.icon}
              onPress={() => {
                logEventInFirebase(FirebaseEvent.CLIC_THEME, {
                  theme: currentTheme.name.fr,
                  view: "list",
                });

                navigation.navigate("NeedsScreen", {
                  theme: currentTheme
                });
                return;
              }}
              style={{
                marginBottom: styles.margin * 3,
                marginTop: 0,
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

      {isLocalizedWarningVisible && (
        <LocalizedWarningModal
          isVisible={isLocalizedModalVisible}
          closeModal={() => setIsLocalizedModalVisible(false)}
          nbGlobalContent={nbContents.nbGlobalContent || 0}
          nbLocalizedContent={nbContents.nbLocalizedContent || 0}
          city={selectedLocation.city || ""}
        />
      )}
      <Modal isVisible={notificationsModalVisible}>
        <View
          style={{
            flex: 0.5,
          }}
        >
          <EnableNotifications
            withMargin={false}
            fullSize={false}
            onDismiss={() => {
              setNotificationsModalVisible(false);
            }}
          />
        </View>
      </Modal>
    </WrapperWithHeaderAndLanguageModal>
  );
};
