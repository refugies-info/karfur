import React from "react";
import { Modal } from "reactstrap";
import styled from "styled-components";
import Streamline from "../../../../assets/streamline";
import { colors } from "colors";
import { filtres } from "../../../Dispositif/data";
import { initial_data } from "../../data";
import "./MobileSearchFilterModal.module.scss";

const TextTitle = styled.div`
  width: fit-content;
  margin-right: 8px;
  padding-top: 14px;
  white-space: nowrap;
`;
const ButtonTitle = styled.div`
  height: 55px;
  background-color: black;
  display: flex;
  justify-content: space-between;
  width: fit-content;
  color: white;
  padding: 14px;
  border-radius: 12px;
  align-items: center;
  width: 100%;
`;
const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0;
  font-size: 18px;
  font-weight: 700;
`;

const FilterButton = styled.div`
  align-items: center;
  padding: 16px;
  height: 53px;
  width: 100%;
  background-color: ${(props) => props.color};
  color: ${(props) => props.textColor};
  text-align: ${(props) => props.textAlign};
  font-weight: 700;
  border-color: ${colors.noir};
  border-radius: 12px;
  margin: 5px 0;
  display: flex;
  justify-content: space-between;
`;

const FilterText = styled.div`
  margin: auto;
`;

interface Props {
  selectOption: (item: any, type: string) => void;
  toggle: () => void;
  type: string;
  show: boolean;
  title: string;
  defaultTitle: string;
  sentence: string;
  defaultSentence: string;

  t: (a: string, b: string) => void;
}

export const MobileSearchFilterModal = (props: Props) => {
  const data: any =
    props.type === "thème"
      ? filtres.tags
      : props.type === "age"
      ? initial_data.filter(
          (item: { title: string }) => item.title === "J'ai"
        )[0].children
      : props.type === "french"
      ? initial_data.filter(
          (item: { title: string }) => item.title === "Je parle"
        )[0].children
      : null;

  const selectOption = (item: any, type: string) => {
    props.selectOption(item, type);
    props.toggle();
  };

  return (
    <Modal
      isOpen={props.show}
      toggle={props.toggle}
      className="mobile-search-filter"
    >
      {/* Display Modal title */}
      <TitleContainer>
        <TextTitle> {props.t(props.sentence, props.defaultSentence)}</TextTitle>
        <ButtonTitle onClick={props.toggle}>
          {props.t(props.title, props.defaultTitle)}
          {/* <Icon name="close" fill="#FFFFFF" size="large" /> */}
        </ButtonTitle>
      </TitleContainer>
      {/* Display list of possible values */}
      {data &&
        data.map((item: any, index: number) => {
          return (
            <div key={index}>
              {props.type === "thème" ? (
                <FilterButton
                  color={item.darkColor}
                  textColor="white"
                  textAlign="left"
                  onClick={() => selectOption(item, props.type)}
                >
                  {props.t("Tags." + item.name, item.name)}
                  {item.icon ? (
                    <Streamline
                      name={item.icon}
                      stroke={"white"}
                      width={22}
                      height={22}
                    />
                  ) : null}
                </FilterButton>
              ) : props.type === "age" || props.type === "french" ? (
                <FilterButton
                  color="white"
                  textColor="black"
                  textAlign="center"
                  onClick={() => selectOption(item, props.type)}
                >
                  <FilterText>
                    {props.t("Tags." + item.name, item.name)}
                  </FilterText>
                </FilterButton>
              ) : null}
            </div>
          );
        })}
    </Modal>
  );
};
