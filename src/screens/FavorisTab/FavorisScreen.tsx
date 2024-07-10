import * as React from "react";
import { Image, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import useAsync from "react-use/lib/useAsync";
import styled, { useTheme } from "styled-components/native";
import { StackScreenProps } from "@react-navigation/stack";
import { CompositeScreenProps, useFocusEffect } from "@react-navigation/native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Icon } from "react-native-eva-icons";

import { BottomTabParamList, FavorisParamList } from "../../../types";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
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
import { TextDSFR_XL, TextDSFR_MD } from "../../components/StyledText";
import { CustomButton } from "../../components/CustomButton";
import { ContentSummary } from "../../components/Contents/ContentSummary";
import { ConfirmationModal } from "../../components/ConfirmationModal";
import EmptyIllu from "../../theme/images/favoris/illu-empty-favorites.png";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { Page, Rows } from "../../components";
import getContentsToDisplay from "./getContentsToDisplay";
import { ReadableText } from "../../components/ReadableText";
import { ContentForApp } from "@refugies-info/api-types";

const EmptyContainer = styled.View`
  padding-horizontal: ${({ theme }) => theme.margin * 4}px;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  padding-bottom: ${({ theme }) =>
    theme.margin * 5 + (theme.insets.bottom || 0)}px;
`;
const EmptyTitle = styled(TextDSFR_XL)`
  text-align: center;
  margin-top: ${({ theme }) => theme.margin * 4}px;
  margin-bottom: ${({ theme }) => theme.margin * 2}px;
`;
const EmptyText = styled(TextDSFR_MD)`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.margin * 4}px;
`;
const CardItem = styled.View``;

const ActionContainer = styled.View`
  background-color: ${({ theme }) => theme.colors.red};
  justify-content: center;
  align-items: ${({ theme }) => (theme.i18n.isRTL ? "flex-start" : "flex-end")};
  flex: 1;
  padding-horizontal: ${({ theme }) => theme.margin * 2}px;
  border-radius: ${({ theme }) => theme.radius * 2}px;
`;

type FavorisScreenProps = CompositeScreenProps<
  StackScreenProps<FavorisParamList, "FavorisScreen">,
  BottomTabScreenProps<BottomTabParamList>
>;

export const FavorisScreen = ({ navigation }: FavorisScreenProps) => {
  const theme = useTheme();
  const currentLanguageI18nCode = useSelector(currentI18nCodeSelector);
  const favorites = useSelector(userFavorites);
  const contents = useSelector(contentsSelector);
  const { t, isRTL } = useTranslationWithRTL();
  const dispatch = useDispatch();

  // When the screen has focus, remove "new favorite" badge
  const hasNewFavorites = useSelector(hasUserNewFavoritesSelector);
  useFocusEffect(
    React.useCallback(() => {
      if (hasNewFavorites) {
        dispatch(removeUserHasNewFavoritesActionCreator());
      }
    }, [hasNewFavorites])
  );

  const { value: contentsToDisplay = [], loading } = useAsync(
    () => getContentsToDisplay(favorites, contents, currentLanguageI18nCode),
    [favorites, contents, currentLanguageI18nCode]
  );

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

  const renderActions = () => {
    return (
      <ActionContainer>
        <Icon
          name="trash-2-outline"
          width={24}
          height={24}
          fill={theme.colors.white}
        ></Icon>
      </ActionContainer>
    );
  };

  return (
    <>
      <Page
        hideBack
        loading={loading}
        title={t("favorites_screen.my_content", "Mes fiches")}
      >
        {favorites.length > 0 ? (
          <Rows layout="1 auto">
            <View>
              <Rows layout="1" verticalAlign="flex-start">
                {contentsToDisplay.map(
                  (content: ContentForApp, index: number) => (
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
                        containerStyle={{ overflow: "visible" }}
                      >
                        <ContentSummary
                          content={content}
                          actionPress={() => showDeleteModal(content._id)}
                          actionIcon={"trash-2-outline"}
                          actionLabel={t(
                            "favorites_screen.delete_content_accessibility"
                          )}
                          backScreen="Favoris"
                        />
                      </Swipeable>
                    </CardItem>
                  )
                )}
              </Rows>
            </View>

            <CustomButton
              textColor={theme.colors.black}
              i18nKey="favorites_screen.delete_all_accessibility"
              defaultText="Supprimer toutes mes fiches"
              onPress={() => showDeleteModal("all")}
              backgroundColor={theme.colors.grey60}
              iconName="trash-2-outline"
              iconFirst
              isTextNotBold
              style={{ marginBottom: theme.margin * 5 }}
            />
          </Rows>
        ) : (
          <EmptyContainer>
            <Image
              source={EmptyIllu}
              style={{ width: 312, height: 250, marginTop: theme.margin * 4 }}
            />
            <EmptyTitle>
              <ReadableText>
                {t("favorites_screen.empty", "C'est vide")}
              </ReadableText>
            </EmptyTitle>
            <EmptyText>
              <ReadableText>
                {t(
                  "favorites_screen.add_content",
                  "Pour ajouter une fiche dans tes favoris, clique sur l’étoile."
                )}
              </ReadableText>
            </EmptyText>
            <CustomButton
              textColor={theme.colors.white}
              i18nKey="tab_bar.explorer"
              onPress={() => navigation.navigate("Explorer")}
              defaultText="Explorer"
              backgroundColor={theme.colors.black}
              iconName="compass-outline"
              iconFirst
              notFullWidth
            />
          </EmptyContainer>
        )}
      </Page>
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
    </>
  );
};
