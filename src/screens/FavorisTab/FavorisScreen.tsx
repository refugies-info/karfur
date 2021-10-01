import * as React from "react"
import styled from "styled-components/native"
import { StackScreenProps } from "@react-navigation/stack"
import { Image } from "react-native"

import { WrapperWithHeaderAndLanguageModal } from "../WrapperWithHeaderAndLanguageModal"
import { StyledTextBigBold, StyledTextSmall } from "../../components/StyledText"
import { CustomButton } from "../../components/CustomButton"
import { theme } from "../../theme"
import { BottomTabParamList } from "../../../types"

import EmptyIllu from "../../theme/images/favoris/illu-empty-fav.png"

const MainContainer = styled.View`
  width: 310px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: ${theme.margin * 4}px;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
`
const EmptyTitle = styled(StyledTextBigBold)`
  text-align: center;
  margin-top: ${theme.margin * 4}px;
  margin-bottom: ${theme.margin * 2}px;
`
const EmptyText = styled(StyledTextSmall)`
  text-align: center;
  margin-bottom: ${theme.margin * 4}px;
`

export const FavorisScreen = ({
  navigation,
}: StackScreenProps<BottomTabParamList, "Favoris">) => {
  return (
    <WrapperWithHeaderAndLanguageModal>
      <MainContainer>
        <Image
          source={EmptyIllu}
          style={{ width: 225, height: 180 }}
          width={225}
          height={180}
        />
        <EmptyTitle>C'est vide !</EmptyTitle>
        <EmptyText>
          Pour ajouter une fiche dans tes favoris, clique sur l’étoile.
        </EmptyText>
        <CustomButton
          textColor={theme.colors.white}
          i18nKey="FavorisScreen.Explorer"
          onPress={() => navigation.navigate("Explorer")}
          defaultText="Explorer"
          backgroundColor={theme.colors.black}
          iconName="compass-outline"
          iconFirst={true}
          notFullWidth={true}
        />
      </MainContainer>
    </WrapperWithHeaderAndLanguageModal>
  )
}
