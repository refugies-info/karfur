import * as React from "react";
import styled from "styled-components/native";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeaderWithBack } from "../components/HeaderWithBack";
import { StackScreenProps } from "@react-navigation/stack";
import { ExplorerParamList } from "../../types";
import { useTranslationWithRTL } from "../hooks/useTranslationWithRTL";
import { WrapperWithHeaderAndLanguageModal } from "./WrapperWithHeaderAndLanguageModal";
import { TouchableOpacity } from "react-native-gesture-handler";

export const ContentScreen = ({
  navigation,
}: StackScreenProps<ExplorerParamList, "ExplorerScreen">) => {
  const { t } = useTranslationWithRTL();
  return (
    <WrapperWithHeaderAndLanguageModal>
      <TouchableOpacity onPress={navigation.goBack}>
        <Text>Back</Text>
      </TouchableOpacity>
    </WrapperWithHeaderAndLanguageModal>
  );
};
