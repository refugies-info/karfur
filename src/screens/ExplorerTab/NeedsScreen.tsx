import * as React from "react";
import styled from "styled-components";
import { theme } from "../../theme";
import { TextNormal } from "../../components/StyledText";
import { ExplorerParamList } from "../../../types";
import { useSelector } from "react-redux";
import { currentI18nCodeSelector } from "../../services/redux/User/user.selectors";
import { contentsSelector } from "../../services/redux/Contents/contents.selectors";
import { WrapperWithHeaderAndLanguageModal } from "../WrapperWithHeaderAndLanguageModal";
import { ScrollView, View } from "react-native";
import { needsSelector } from "../../services/redux/Needs/needs.selectors";
import { LoadingStatusKey } from "../../services/redux/LoadingStatus/loadingStatus.actions";
import { isLoadingSelector } from "../../services/redux/LoadingStatus/loadingStatus.selectors";
import { RTLTouchableOpacity } from "../../components/BasicComponents";
import { groupedContentsSelector } from "../../services/redux/ContentsGroupedByNeeds/contentsGroupedByNeeds.selectors";
import { ObjectId, Need } from "../../types/interface";

const computeNeedsToDisplay = (
  allNeeds: Need[],
  groupedContents: Record<ObjectId, ObjectId[]>,
  tagName: string
) => {
  const filteredNeeds = allNeeds.filter((need) => {
    if (
      need.tagName === tagName &&
      groupedContents[need._id] &&
      groupedContents[need._id].length > 0
    )
      return true;
    return false;
  });

  return filteredNeeds;
};
const NeedContainer = styled(RTLTouchableOpacity)`
  padding: 16px;
  background-color: ${theme.colors.grey};
  margin: 8px;
`;

const Header = styled(TextNormal)`
  margin-left: 24px;
  margin-top: 8px;
`;
export const NeedsScreen = ({
  navigation,
  route,
}: StackScreenProps<ExplorerParamList, "NeedsScreen">) => {
  const currentLanguageI18nCode = useSelector(currentI18nCodeSelector);
  const contents = currentLanguageI18nCode
    ? useSelector(contentsSelector(currentLanguageI18nCode))
    : [];

  const isLoadingContents = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_CONTENTS)
  );
  const isLoadingNeeds = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_NEEDS)
  );
  const isLoading = isLoadingContents || isLoadingNeeds;

  const {
    tagName,
    tagDarkColor,
    tagVeryLightColor,
    tagLightColor,
  } = route.params;

  const allNeeds = useSelector(needsSelector);
  const groupedContents = useSelector(groupedContentsSelector);

  const needsToDisplay = computeNeedsToDisplay(
    allNeeds,
    // @ts-ignore
    groupedContents,
    tagName
  );

  if (isLoading) {
    return (
      <WrapperWithHeaderAndLanguageModal
        navigation={navigation}
        showSwitch={true}
      >
        <Header>{"loading"}</Header>
      </WrapperWithHeaderAndLanguageModal>
    );
  }

  return (
    <WrapperWithHeaderAndLanguageModal
      navigation={navigation}
      showSwitch={true}
    >
      <Header>{"needs screen : " + tagName + " "}</Header>

      <ScrollView scrollIndicatorInsets={{ right: 1 }}>
        {needsToDisplay.map((need) => (
          <NeedContainer
            onPress={() =>
              navigation.navigate("ContentsScreen", {
                tagName,
                tagDarkColor,
                tagVeryLightColor,
                tagLightColor,
                needId: need._id,
              })
            }
          >
            <TextNormal>{need.fr.text}</TextNormal>
          </NeedContainer>
        ))}
      </ScrollView>
    </WrapperWithHeaderAndLanguageModal>
  );
};
