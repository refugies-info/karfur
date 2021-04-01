import styled from "styled-components";

export const StyledThead = styled.thead`
  flex: 1;
  flex-direction: row;
  width: 100%;
  justify-content: flex-end;
  align-items: flex-end;
`;

export const StyledSort = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: flex-end;
  align-items: flex-end;
  margin-right: 8px;
  margin-top: ${(props) => (props.marginTop ? props.marginTop : "0px")};
`;

export const StyledTitle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-end;
  font-weight: bold;
  font-size: 40px;
`;

export const StyledHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-bottom: 8px;
  margin-left: 24px;
`;

export const Content = styled.div`
  margin-left: 24px;
  margin-right: 8px;
`;

export const FigureContainer = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 8px;
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  width: fit-content;
  height: fit-content;
  margin-left: 16px;
`;

export const StyledInput = styled.input`
  border-radius: 8px;
  margin: 10px;
  border: 0px;
  padding: 10px;
  border: 1px solid #828282;
  font-weight: normal;
  font-size: 16px;
  line-height: 20px;
  color: #828282;
  width: 250px;
`;

export const SearchBarContainer = styled.div`
  position: absolute;
  top: 150px;
  right: 40px;
  display: flex;
  flexdirection: row;
`;
