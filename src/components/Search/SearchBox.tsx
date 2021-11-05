import React from "react";
import styled from "styled-components/native";
import { TouchableOpacity, TextInput } from "react-native";
import { connectSearchBox } from "react-instantsearch-native";
import { theme } from "../../theme";
import {  RTLView } from "../BasicComponents";
import { Icon } from "react-native-eva-icons";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";

const InputContainer = styled(RTLView)`
  height:56px;
  width 100%;
  border-radius:${theme.radius * 2}px;
  padding:${theme.margin * 2}px;
  background-color : ${theme.colors.white};
  border: 1px solid ${theme.colors.darkGrey};
  flex: 1;
  margin-left: ${theme.margin}px;
`;
const StyledInput = styled.TextInput`
  height:100%;
  width 100%;
  margin-left: ${(props: { isRTL: boolean }) => (props.isRTL ? 0 : theme.margin)}px;
  margin-right: ${(props: { isRTL: boolean }) => (props.isRTL ? theme.margin : 0)}px;
  text-align: ${(props: { isRTL: boolean }) => (props.isRTL ? "right" : "left")};
  flex: 1;
`;
interface Props {
  currentRefinement: string;
  refine: any;
  backCallback: () => void;
}

const SearchBox = ({ currentRefinement, refine, backCallback }: Props) => {
  const input = React.useRef<TextInput>();
  const { isRTL } = useTranslationWithRTL();

  React.useEffect(() => {
    setTimeout(() => {
      if (input && input.current) input.current.focus()
    }, 100);
  }, [])

  return (
    <RTLView style={{ marginHorizontal: theme.margin * 3 }}>
      <TouchableOpacity onPress={backCallback}>
        <Icon
          name="arrow-back-outline"
          height={24}
          width={24}
          fill={theme.colors.darkGrey}
        />
      </TouchableOpacity>
      <InputContainer>
        <Icon
          name="search-outline"
          height={24}
          width={24}
          fill={theme.colors.darkGrey}
        />
        <StyledInput
          ref={input}
          onChangeText={(value: string) => refine(value)}
          value={currentRefinement}
          placeholder="Rechercher"
          isRTL={isRTL}
          testID="test-city-search"
        />
        <TouchableOpacity onPress={() => refine("")}>
          <Icon
            name="close-outline"
            height={24}
            width={24}
            fill={theme.colors.darkGrey}
          />
        </TouchableOpacity>
      </InputContainer>
    </RTLView>
  )
}

export default connectSearchBox(SearchBox);