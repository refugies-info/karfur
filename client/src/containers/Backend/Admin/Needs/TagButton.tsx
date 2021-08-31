import React from "react";
import styled from "styled-components";
import Streamline from "../../../../assets/streamline";

interface Props {
  name: string;
  icon: string;
  isSelected: boolean;
  color: string;
  onClick?: () => void;
}

const TagContainer = styled.div`
  border-radius: 8px;
  padding: 10px;
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  color: #ffffff;
  display: flex;
  flex-direction: row;
  background-color: ${(props) => props.color};
  width: fit-content;
  margin: 4px;
  cursor: ${(props) => (props.isClickable ? "pointer" : "default")};
  opacity: ${(props) => (props.isSelected ? 1 : 0.5)};
  align-items: center;
`;
export const TagButton = (props: Props) => {
  const onTagClick = () => {
    if (props.onClick) {
      return props.onClick();
    }
    return;
  };
  return (
    <TagContainer
      color={props.color}
      onClick={onTagClick}
      isSelected={props.isSelected}
      isClickable={!!props.onClick}
    >
      {props.icon ? (
        <div
          style={{
            display: "flex",
            marginRight: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Streamline
            name={props.icon}
            stroke={"white"}
            width={22}
            height={22}
          />
        </div>
      ) : null}
      <div>{props.name}</div>
    </TagContainer>
  );
};
