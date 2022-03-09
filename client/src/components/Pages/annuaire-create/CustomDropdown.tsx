import React from "react";
import styled from "styled-components";

interface Props {
  elementList: string[];
  onDropdownElementClick: Function;
}

const ItemContainer = styled.div`
  background: #f2f2f2;
  border-radius: 6px;
  padding: 8px;
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  margin-top: 4px;
  margin-bottom: 4px;
  width: fit-content;
  cursor: pointer;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  margin-right: 4px;
`;

const DropDownContainer = styled.div`
  position: absolute;
  z-index: 2;
  display: flex;
  flex-wrap: wrap;
  flex: 1;
`;

export const CustomDropDown = (props: Props) => {
  return (
    <DropDownContainer>
      {props.elementList.map((element) => (
        <ItemContainer
          onClick={() => props.onDropdownElementClick(element)}
          key={element}
        >
          {element}
        </ItemContainer>
      ))}
    </DropDownContainer>
  );
};
