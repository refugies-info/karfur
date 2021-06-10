import React from "react";
import { Input } from "reactstrap";
import styled from "styled-components";
import { colors } from "colors";
import EVAIcon from "../../../UI/EVAIcon/EVAIcon";

export const SearchBarContainer = styled.div`
  background: #ffffff;
  border: 0.5px solid #ffffff;
  border-radius: 12px;
  padding-right: 12px;
  padding-left: 15px;
  margin-right: ${(props) => (props.withMargin ? "10px" : "0px")};
  font-size: 16px;
  font-weight: 400;
  width: ${(props) =>
    props.windowWidth > 1440 ? "240px" : props.windowWidth * 0.18 + "px"};
  min-width: 180px;
  height: 52px;
  color: #000000;
  flex-direction: row;
  display: flex;
  align-items: center;
  &:hover {
    box-shadow: 0px 4px 7px rgba(0, 0, 0, 0.1);
  }
  &:focus {
    outline: none !important;
  }
`;

export const SearchBar = styled(Input)`
  background: #ffffff;
  border: 0.5px solid #ffffff;
  border-radius: 12px;
  margin-right: 10px;
  font-size: 16px;
  font-weight: 400;
  width: 100%;
  color: #000000;
  &:focus {
    outline: none !important;
  }
`;

interface Props {
  placeholder: string;
  onChange: () => void;
  value: string;
  withMargin?: boolean;
  windowWidth?: string;
}

export const CustomSearchBar = (props: Props) => (
  <SearchBarContainer
    windowWidth={props.windowWidth}
    withMargin={props.withMargin}
  >
    <SearchBar
      onChange={props.onChange}
      type="text"
      plaintext={true}
      placeholder={props.placeholder}
      value={props.value}
    />
    <EVAIcon
      name="search-outline"
      fill={colors.noir}
      id="bookmarkBtn"
      size={"large"}
    />
  </SearchBarContainer>
);
