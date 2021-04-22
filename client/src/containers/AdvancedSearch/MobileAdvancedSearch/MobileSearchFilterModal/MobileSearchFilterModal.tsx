import React from "react";
import { Modal } from "reactstrap";
import styled from "styled-components";
import "./MobileSearchFilterModal.scss";
import Streamline from "../../../../assets/streamline";
import Icon from "react-eva-icons";
import { Tag } from "../../../../types/interface";
//import colors from "../../../../colors";

const TextTitle = styled.div`
  width: 100%;
  margin-right: 10px;
  padding-top: 14px;
`;
const ButtonTitle = styled.div`
  height: 55px;
  background-color: black;
  display: flex;
  justify-content: space-between;
  width: 100%;
  color: white;
  padding: 14px;
  border-radius: 12px;
`;
const TitleContainer = styled.div`
  display: flex;
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
  border-color: #212121;
  border-radius: 12px;
  padding-top: 12px;
  margin: 5px 0;
  display: flex;
  justify-content: space-between;
`;

interface Props {
  toggle: () => void;
  type: string;
  show: boolean;
  title: string;
  defaultTitle: string;
  sentence: string;
  defaultSentence: string;
  t: (a: string, b: string) => void;
  data: Tag[] | string[];
}
export const MobileSearchFilterModal = (props: Props) => (
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
        <Icon name="close" fill="#FFFFFF" size="large" />
      </ButtonTitle>
    </TitleContainer>
    {/* Display list of possible values */}
    {props.data.map((item: any, index: any) => {
      return (
        <div key={index}>
          {props.type === "thème" ? (
            <FilterButton
              color={item.darkColor}
              textColor="white"
              textAlign="left"
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
            <FilterButton color="white" textColor="black" textAlign="center">
              {props.t("Tags." + item, item)}
            </FilterButton>
          ) : null}
        </div>
      );
    })}
  </Modal>
);
