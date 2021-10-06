import * as React from "react";
import { TextNormal } from "../../components/StyledText";
import { WrapperWithHeaderAndLanguageModal } from "../WrapperWithHeaderAndLanguageModal";

export const FavorisScreen = () => {
  return (
    <WrapperWithHeaderAndLanguageModal>
      <TextNormal>Favoris screen</TextNormal>
      <TextNormal>{"api url : " + process.env.API_URL}</TextNormal>
      <TextNormal>{"test key : " + process.env.TEST}</TextNormal>
    </WrapperWithHeaderAndLanguageModal>
  );
};
