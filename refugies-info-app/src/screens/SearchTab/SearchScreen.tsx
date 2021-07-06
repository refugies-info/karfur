import * as React from "react";
import { TextNormal } from "../../components/StyledText";
import { WrapperWithHeaderAndLanguageModal } from "../WrapperWithHeaderAndLanguageModal";
import { Button } from "react-native";
import { useDispatch } from "react-redux";
import { fetchContentsActionCreator } from "../../services/redux/Contents/contents.actions";

export const SearchScreen = () => {
  const dispatch = useDispatch();
  return (
    <WrapperWithHeaderAndLanguageModal>
      <TextNormal>Search screen</TextNormal>
      <TextNormal>{"api url " + process.env.API_URL}</TextNormal>
      <TextNormal>{"test " + process.env.TEST}</TextNormal>

      <Button
        title="fetch contents"
        onPress={() => {
          dispatch(fetchContentsActionCreator());
        }}
      />
    </WrapperWithHeaderAndLanguageModal>
  );
};
