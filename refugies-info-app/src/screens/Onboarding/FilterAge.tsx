import * as React from "react";
import { View, Text, Button } from "react-native";
import { OnboardingParamList } from "../../../types";
import { StackScreenProps } from "@react-navigation/stack";
import { SmallButton } from "../../components/SmallButton";

export const FilterAge = ({
  navigation,
}: StackScreenProps<OnboardingParamList, "FilterAge">) => {
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

      <Text>Filter age</Text>
      <Button
        title="next"
        onPress={() => navigation.navigate("FilterFrenchLevel")}
      />
    </View>
  );
};
