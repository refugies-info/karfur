import styled from "styled-components";

interface MainContainerProps {
  isClickable: boolean;
}
const MainContainer = styled.a<MainContainerProps>`
  border-radius: 8px;
  width: 36px;
  height: 36px;
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);
  position: relative;
  z-index: 25;
  cursor: ${(props: MainContainerProps) => (props.isClickable ? "pointer" : "default")};
  background: #ffffff;
  color: ${(props: MainContainerProps) => (!props.isClickable ? "#C6C6C6" : "#212121")};
  margin: 4px;
  &:hover {
    background: ${(props: MainContainerProps) => (props.isClickable ? "#212121" : "")};
    color: ${(props: MainContainerProps) => (props.isClickable ? "#ffffff" : "")};
  }
`;

interface Props {
  letter: string;
  isClickable: boolean;
}

export const Letter = (props: Props) => (
  <MainContainer isClickable={props.isClickable}>{props.letter.toUpperCase()}</MainContainer>
);
