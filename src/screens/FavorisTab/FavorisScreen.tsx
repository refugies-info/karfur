import * as React from "react";
import styled from "styled-components/native";
import { StackScreenProps } from "@react-navigation/stack";
import { CompositeScreenProps, useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Icon } from "react-native-eva-icons";

import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { getContentById } from "../../utils/API";
import { SimplifiedContent, ObjectId } from "../../types/interface";
import { BottomTabParamList, FavorisParamList } from "../../../types";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { useHeaderAnimation } from "../../hooks/useHeaderAnimation";
import { contentsSelector } from "../../services/redux/Contents/contents.selectors";
import {
  hasUserNewFavoritesSelector,
  userFavorites,
} from "../../services/redux/User/user.selectors";
import { currentI18nCodeSelector } from "../../services/redux/User/user.selectors";
import {
  removeUserFavoriteActionCreator,
  removeUserAllFavoritesActionCreator,
  removeUserHasNewFavoritesActionCreator,
} from "../../services/redux/User/user.actions";
import {
  StyledTextBigBold,
  StyledTextSmall,
} from "../../components/StyledText";
import { CustomButton } from "../../components/CustomButton";
import { ContentSummary } from "../../components/Contents/ContentSummary";
import { ConfirmationModal } from "../../components/ConfirmationModal";
import { styles } from "../../theme";
import EmptyIllu from "../../theme/images/favoris/illu-empty-favorites.png";
import { HeaderAnimated } from "../../components/HeaderAnimated";
import { LanguageChoiceModal } from "../Modals/LanguageChoiceModal";
import { useVoiceover } from "../../hooks/useVoiceover";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

const EmptyContainer = styled.ScrollView`
  padding-horizontal: ${styles.margin * 4}px;
`;
const EmptyTitle = styled(StyledTextBigBold)`
  text-align: center;
  margin-top: ${styles.margin * 4}px;
  margin-bottom: ${styles.margin * 2}px;
`;
const EmptyText = styled(StyledTextSmall)`
  text-align: center;
  margin-bottom: ${styles.margin * 4}px;
`;
const CardItem = styled.View`
  margin-bottom: ${styles.margin * 1}px;
  flex: 1;
`;

type FavorisScreenProps = CompositeScreenProps<
  StackScreenProps<FavorisParamList, "FavorisScreen">,
  BottomTabScreenProps<BottomTabParamList>
>;

export const FavorisScreen = ({ navigation }: FavorisScreenProps) => {
  const currentLanguageI18nCode = useSelector(currentI18nCodeSelector);
  const favorites = useSelector(userFavorites);
  const contents = useSelector(contentsSelector);
  const { t, isRTL } = useTranslationWithRTL();
  const dispatch = useDispatch();
  const { handleScroll, showSimplifiedHeader } = useHeaderAnimation();

  const insets = useSafeAreaInsets();

  const [isLanguageModalVisible, setLanguageModalVisible] =
    React.useState(false);
  const toggleLanguageModal = () =>
    setLanguageModalVisible(!isLanguageModalVisible);

  // When the screen has focus, remove "new favorite" badge
  const hasNewFavorites = useSelector(hasUserNewFavoritesSelector);
  useFocusEffect(
    React.useCallback(() => {
      if (hasNewFavorites) {
        dispatch(removeUserHasNewFavoritesActionCreator());
      }
    }, [hasNewFavorites])
  );

  /**
   * Return the contents to display
   * @param contentsId - content ids to display
   * @param contents - list of all the content
   */
  const getContentsToDisplay = async (
    contentsId: ObjectId[],
    contents: SimplifiedContent[]
  ) => {
    let result: SimplifiedContent[] = [];
    for (let contentId of contentsId) {
      const contentWithInfosArray = contents.filter(
        (content) => content._id === contentId
      );
      if (contentWithInfosArray.length > 0) {
        // result already in store
        result.push(contentWithInfosArray[0]);
      } else {
        // fetch result
        await getContentById({
          contentId: contentId,
          locale: currentLanguageI18nCode || "fr",
        }).then((response: any) => {
          const data = response?.data?.data;
          if (data) {
            result.push({
              ...data,
              sponsorUrl: data.mainSponsor?.picture?.secure_url,
            });
          }
        });
      }
    }
    return result.reverse();
  };

  const [contentsToDisplay, setContentsToDisplay] = React.useState<
    SimplifiedContent[]
  >([]);
  React.useEffect(() => {
    getContentsToDisplay(favorites, contents).then(setContentsToDisplay);
  }, [favorites, contents]);

  const [favoriteToDelete, setFavoriteToDelete] = React.useState<
    string | "all"
  >("");
  const showDeleteModal = (contentId: string | "all") => {
    setFavoriteToDelete(contentId);
  };
  const hideDeleteModal = () => {
    if (favoriteToDelete !== "") {
      setFavoriteToDelete("");
    }
  };
  const deleteFavorite = (contentId: string | "all") => {
    if (contentId === "all") {
      dispatch(removeUserAllFavoritesActionCreator());
    } else {
      dispatch(removeUserFavoriteActionCreator(contentId));
    }
  };

  // Voiceover
  const scrollview = React.useRef<ScrollView | null>(null);
  const offset = 340;
  const { setScroll, saveList } = useVoiceover(scrollview, offset);

  const onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScroll(
      event.nativeEvent.contentOffset.y,
      showSimplifiedHeader ? offset : 0
    );
  };

  React.useEffect(() => {
    saveList();
  }, [contentsToDisplay]);

  const renderActions = () => {
    return (
      <View
        style={{
          backgroundColor: styles.colors.red,
          justifyContent: "center",
          alignItems: !isRTL ? "flex-end" : "flex-start",
          flex: 1,
          paddingHorizontal: styles.margin * 2,
          marginHorizontal: styles.margin * 3,
          borderRadius: styles.radius * 2,
          marginBottom: styles.margin * 2,
        }}
      >
        <Icon
          name="trash-2-outline"
          width={24}
          height={24}
          fill={styles.colors.white}
        ></Icon>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderAnimated
        title={t("favorites_screen.my_content", "Mes fiches")}
        showSimplifiedHeader={showSimplifiedHeader}
        onLongPressSwitchLanguage={toggleLanguageModal}
        useShadow={true}
      />

      {favorites.length > 0 ? (
        <ScrollView
          ref={scrollview}
          onScroll={handleScroll}
          alwaysBounceVertical={false}
          scrollEventThrottle={5}
          scrollIndicatorInsets={{ right: 1 }}
          onMomentumScrollEnd={onScrollEnd}
          onScrollEndDrag={onScrollEnd}
          contentContainerStyle={{
            justifyContent: "space-between",
            paddingHorizontal: styles.margin * 3,
            paddingTop: styles.margin * 3,
            paddingBottom: styles.margin * 5 + (insets.bottom || 0),
            flexShrink: 0,
            flexGrow: 1,
          }}
        >
          <View style={{ marginBottom: styles.margin * 2 }}>
            <View
              style={{
                marginHorizontal: -styles.margin * 3,
                flex: 1,
                justifyContent: "flex-start",
              }}
            >
              {contentsToDisplay.map((content: SimplifiedContent) => {
                return (
                  <CardItem key={content._id}>
                    <Swipeable
                      renderRightActions={!isRTL ? renderActions : undefined}
                      renderLeftActions={isRTL ? renderActions : undefined}
                      leftThreshold={!isRTL ? 9999 : 120}
                      rightThreshold={isRTL ? 9999 : 120}
                      onSwipeableRightOpen={
                        !isRTL ? () => deleteFavorite(content._id) : undefined
                      }
                      onSwipeableLeftOpen={
                        isRTL ? () => deleteFavorite(content._id) : undefined
                      }
                      overshootFriction={8}
                      childrenContainerStyle={{
                        paddingBottom: styles.margin * 2,
                      }}
                    >
                      <ContentSummary
                        navigation={navigation}
                        theme={content.theme}
                        contentId={content._id}
                        titreInfo={content.titreInformatif}
                        titreMarque={content.titreMarque}
                        typeContenu={content.typeContenu}
                        sponsorUrl={content.sponsorUrl}
                        actionPress={() => showDeleteModal(content._id)}
                        actionIcon={"trash-2-outline"}
                        actionLabel={t(
                          "favorites_screen.delete_content_accessibility"
                        )}
                        style={{ marginHorizontal: styles.margin * 3 }}
                        backScreen="Favoris"
                      />
                    </Swipeable>
                  </CardItem>
                );
              })}
            </View>
          </View>

          <CustomButton
            textColor={styles.colors.black}
            i18nKey="favorites_screen.delete_all_accessibility"
            defaultText="Supprimer toutes mes fiches"
            onPress={() => showDeleteModal("all")}
            backgroundColor={styles.colors.grey60}
            iconName="trash-2-outline"
            iconFirst={true}
            isTextNotBold={true}
          />
        </ScrollView>
      ) : (
        <EmptyContainer
          onScroll={handleScroll}
          scrollEventThrottle={5}
          alwaysBounceVertical={false}
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
            flexGrow: 1,
            paddingBottom: styles.margin * 5 + (insets.bottom || 0),
          }}
        >
          <Image
            source={EmptyIllu}
            style={{ width: 312, height: 250, marginTop: styles.margin * 4 }}
          />
          <EmptyTitle>{t("favorites_screen.empty", "C'est vide")}</EmptyTitle>
          <EmptyText>
            {t(
              "favorites_screen.add_content",
              "Pour ajouter une fiche dans tes favoris, clique sur l’étoile."
            )}
          </EmptyText>
          <CustomButton
            textColor={styles.colors.white}
            i18nKey="tab_bar.explorer"
            onPress={() => navigation.navigate("Explorer")}
            defaultText="Explorer"
            backgroundColor={styles.colors.black}
            iconName="compass-outline"
            iconFirst={true}
            notFullWidth={true}
          />
        </EmptyContainer>
      )}
      <ConfirmationModal
        isModalVisible={!!favoriteToDelete}
        toggleModal={hideDeleteModal}
        text={
          favoriteToDelete === "all"
            ? t(
                "favorites_screen.delete_all",
                "Veux-tu vraiment supprimer toutes les fiches de tes favoris ?"
              )
            : t(
                "favorites_screen.delete_content",
                "Veux-tu vraiment supprimer cette fiche de tes favoris ?"
              )
        }
        onValidate={() => deleteFavorite(favoriteToDelete)}
        i18nKeyValidateButton="global.delete"
        defaultTextValidateButton={"Supprimer"}
        iconValidateButton={"trash-2-outline"}
      />
      <LanguageChoiceModal
        isModalVisible={isLanguageModalVisible}
        toggleModal={toggleLanguageModal}
      />
    </View>
  );
};
