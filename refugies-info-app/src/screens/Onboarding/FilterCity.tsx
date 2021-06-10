import * as React from "react";
import styled from "styled-components/native";
import { View, Text } from "react-native";
import { OnboardingParamList } from "../../../types";
import { StackScreenProps } from "@react-navigation/stack";
import { SmallButton } from "../../components/SmallButton";

export const FilterCity = ({
  navigation,
}: StackScreenProps<OnboardingParamList, "FilterCity">) => {
  return (
    <View
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
      }}
    >
      <SmallButton iconName="arrow-back-outline" onPress={navigation.goBack} />
      <Text>Filter city</Text>
    </View>
  );
};
