import styled from "styled-components/native";

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;
const Item = styled.View<{ done: boolean }>`
  height: 10px;
  width: 10px;
  background-color: ${({ done }) => (done ? "white" : "transparent")};
  border-radius: ${({ theme }) => theme.margin}px;
  border: 2px solid white;
`;

interface Props {
  step: number;
  maxStep: number;
}
export const OnboardingPagination = (props: Props) => (
  <Container>
    {[...new Array(props.maxStep).keys()].map((index) => (
      <Item key={index} done={index + 1 <= props.step} />
    ))}
  </Container>
);
