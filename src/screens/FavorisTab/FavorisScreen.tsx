import * as React from "react"
import styled from "styled-components/native"
import { StackScreenProps } from "@react-navigation/stack"
import { Image, ScrollView } from "react-native"
import { useDispatch, useSelector } from "react-redux";

import { SimplifiedContent, ObjectId } from "../../types/interface";
import { BottomTabParamList } from "../../../types"
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { contentsSelector } from "../../services/redux/Contents/contents.selectors";
import { userFavorites } from "../../services/redux/User/user.selectors";
import { currentI18nCodeSelector } from "../../services/redux/User/user.selectors";
import { removeUserFavoriteActionCreator } from "../../services/redux/User/user.actions";
import { StyledTextBigBold, StyledTextSmall, TextBigBold } from "../../components/StyledText"
import { CustomButton } from "../../components/CustomButton"
import { ContentSummary } from "../../components/Contents/ContentSummary";
import { ConfirmationModal } from "../../components/ConfirmationModal";
import { WrapperWithHeaderAndLanguageModal } from "../WrapperWithHeaderAndLanguageModal"
import { tags } from "../../data/tagData";
import { theme } from "../../theme"
import EmptyIllu from "../../theme/images/favoris/illu-empty-fav.png"

const EmptyContainer = styled.View`
  margin-bottom: ${theme.margin * 4}px;
  padding-horizontal: ${theme.margin * 4}px;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
`;
const EmptyTitle = styled(StyledTextBigBold)`
  text-align: center;
  margin-top: ${theme.margin * 4}px;
  margin-bottom: ${theme.margin * 2}px;
`;
const EmptyText = styled(StyledTextSmall)`
  text-align: center;
  margin-bottom: ${theme.margin * 4}px;
`;
const Title = styled(TextBigBold)`
  margin-bottom: ${theme.margin * 3}px;
`;

export const FavorisScreen = ({
  navigation,
}: StackScreenProps<BottomTabParamList, "Favoris">) => {

  const currentLanguageI18nCode = useSelector(currentI18nCodeSelector);
  const favorites = useSelector(userFavorites);
  const contents = currentLanguageI18nCode
  ? useSelector(contentsSelector(currentLanguageI18nCode)) : [];
  const { t } = useTranslationWithRTL();

  /**
   * Return the contents to display
   * @param contentsId - content ids to display
   * @param contents - list of all the content
   */
  const getContentsToDisplay = (
    contentsId: ObjectId[],
    contents: SimplifiedContent[]
  ) => {
    let result: SimplifiedContent[] = [];

    contentsId.forEach((contentId: ObjectId) => {
      const contentWithInfosArray = contents.filter(
        (content) => content._id === contentId
      );
      if (contentWithInfosArray.length > 0) {
        result.push(contentWithInfosArray[0]);
        return;
      }
      return;
    });
    return result;
  };

  /**
   * Return colors of the ContentSummary card
   * @param content
   */
  const getCardColors = (content: SimplifiedContent) => {
    const defaultColors = {
      tagDarkColor: theme.colors.black,
      tagVeryLightColor: theme.colors.white,
      tagName: "",
      tagLightColor: theme.colors.white,
      iconName: ""
    };

    const primaryTagName = content.tags.length > 0 ? content.tags[0] : null;
    if (!primaryTagName) return defaultColors;
    const currentTag = tags.find(t => primaryTagName.short === t.short);
    if (!currentTag) return defaultColors;

    return {
      tagDarkColor: currentTag.darkColor,
      tagVeryLightColor: currentTag.veryLightColor,
      tagName: currentTag.name,
      tagLightColor: currentTag.lightColor,
      iconName: currentTag.icon
    }
  }

  const contentsToDisplay = getContentsToDisplay(favorites, contents);

  const dispatch = useDispatch();
  const [favoriteToDelete, setFavoriteToDelete] = React.useState("");
  const showDeleteModal = (contentId: string) => {
    setFavoriteToDelete(contentId);
  }
  const hideDeleteModal = () => {
    if (favoriteToDelete !== "") setFavoriteToDelete("");
  }
  const deleteFavorite = (contentId: string) => {
    dispatch(removeUserFavoriteActionCreator(contentId))
  }

  return (
    <WrapperWithHeaderAndLanguageModal>

      {favorites.length > 0 ?
        <ScrollView
          scrollIndicatorInsets={{ right: 1 }}
          contentContainerStyle={{
            justifyContent: "center",
            paddingHorizontal: theme.margin * 3,
            paddingTop: theme.margin * 3,
            paddingBottom: theme.margin * 3,
          }}
        >
          <Title>{t("FavorisScreen.Mes fiches", "Mes fiches")}</Title>
          {contentsToDisplay.map((content: SimplifiedContent) => {
            const colors = getCardColors(content);
            return (
              <ContentSummary
                key={content._id}
                navigation={navigation}
                tagDarkColor={colors.tagDarkColor}
                tagVeryLightColor={colors.tagVeryLightColor}
                tagName={colors.tagName}
                tagLightColor={colors.tagLightColor}
                iconName={colors.iconName}
                contentId={content._id}
                titreInfo={content.titreInformatif}
                titreMarque={content.titreMarque}
                typeContenu={content.typeContenu}
                sponsorUrl={content.sponsorUrl}
                actionPress={() => showDeleteModal(content._id)}
                actionIcon={"trash-2-outline"}
              />
            )
          })}
        </ScrollView> :
        <EmptyContainer>
          <Image
            source={EmptyIllu}
            style={{ width: 220, height: 278 }}
            width={220}
            height={278}
          />
          <EmptyTitle>
            {t("FavorisScreen.C'est vide", "C'est vide")}
          </EmptyTitle>
          <EmptyText>
            {t(
              "FavorisScreen.Ajouter une fiche",
              "Pour ajouter une fiche dans tes favoris, clique sur l’étoile."
            )}
          </EmptyText>
          <CustomButton
            textColor={theme.colors.white}
            i18nKey="tabBar.Explorer"
            onPress={() => navigation.navigate("Explorer")}
            defaultText="Explorer"
            backgroundColor={theme.colors.black}
            iconName="compass-outline"
            iconFirst={true}
            notFullWidth={true}
          />
        </EmptyContainer>
      }
      <ConfirmationModal
        isModalVisible={!!favoriteToDelete}
        toggleModal={hideDeleteModal}
        text={t(
          "FavorisScreen.Supprimer la fiche",
          "Veux-tu vraiment supprimer cette fiche de tes favoris ?"
        )}
        onValidate={() => deleteFavorite(favoriteToDelete)}
        i18nKeyValidateButton={"Supprimer"}
        defaultTextValidateButton={"Supprimer"}
        iconValidateButton={"trash-2-outline"}
      />
    </WrapperWithHeaderAndLanguageModal>
  )
}
