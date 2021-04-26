import React from "react";
import { Modal } from "reactstrap";
import styled from "styled-components";
import "./MobileSearchFilterModal.scss";
import Streamline from "../../../../assets/streamline";
import Icon from "react-eva-icons";
import { colors } from "colors";
import { filtres } from "../../../Dispositif/data";
import { initial_data } from "../../data";

const TextTitle = styled.div`
  width: fit-content;
  margin-right: 10px;
  padding-right: 10px;
  padding-top: 14px;
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
  padding-top: 12px;
  margin: 5px 0;
  display: flex;
  justify-content: space-between;
`;

const FilterText = styled.div`
  margin: auto;
`;

interface Props {
  setSelectedItem: (item: any) => void;
  toggle: () => void;
  type: string;
  show: boolean;
  title: string;
  defaultTitle: string;
  sentence: string;
  defaultSentence: string;
  t: (a: string, b: string) => void;
  recherche: string[];
  addParamasInRechercher: (index: number, item: any) => void;
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
    let index = 0;
    let el;
    switch (type) {
      case "thème":
        el = props.recherche.filter(
          (item: any) => item.queryName === "tags.name"
        )[0];
        index = props.recherche.indexOf(el);
        break;
      case "age":
        el = props.recherche.filter(
          (item: any) => item.queryName === "audienceAge"
        )[0];
        index = props.recherche.indexOf(el);
        break;
      case "french":
        el = props.recherche.filter(
          (item: any) => item.queryName === "niveauFrancais"
        )[0];
        index = props.recherche.indexOf(el);
        break;
      default:
        break;
    }
    props.addParamasInRechercher(index, item);
    props.setSelectedItem(item);
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
          <Icon name="close" fill="#FFFFFF" size="large" />
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
