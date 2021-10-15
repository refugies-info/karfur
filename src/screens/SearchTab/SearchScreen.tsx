import * as React from "react";
import { TextNormal } from "../../components/StyledText";
import { WrapperWithHeaderAndLanguageModal } from "../WrapperWithHeaderAndLanguageModal";
import { getEnvironment } from "../../libs/getEnvironment";

export const SearchScreen = () => {
  const { envName, debugModeFirebase } = getEnvironment();
  return (
    <WrapperWithHeaderAndLanguageModal>
      <TextNormal>Search screen</TextNormal>
      <TextNormal>{"env name : " + envName}</TextNormal>
      <TextNormal>{"debug mode : " + debugModeFirebase}</TextNormal>
    </WrapperWithHeaderAndLanguageModal>
  );
};
