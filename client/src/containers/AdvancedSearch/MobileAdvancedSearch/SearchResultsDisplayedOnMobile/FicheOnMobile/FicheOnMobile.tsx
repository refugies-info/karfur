import React from "react";
import { IDispositif } from "../../../../../types/interface";
import styled from "styled-components";
import { colors } from "../../../../../colors";
import Streamline from "assets/streamline";

interface Props {
  item: IDispositif;
  t: (a: string, b: string) => void;
}

const ItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
  border: ${(props) =>
    props.typeContenu === "demarche" ? `2px solid ${props.darkColor}` : null};
  min-height: 76px;
  margin: 13px 0;
  background-color: ${(props) =>
    props.typeContenu === "dispositif" ? colors.blanc : props.lightColor};
  border-radius: 12px;
  align-items: center;
  padding: 16px;
`;

const TitleText = styled.div`
  color: ${(props) => props.color};
  display: flex;
  flex-direction: column;
  font-size: 16px;
  font-weight: 700;
`;

const SubTitleText = styled.div`
  color: ${(props) => props.color};
  font-size: 16px;
  font-weight: 400;
`;

const PictoCircle = styled.div`
  display: flex;
  justify-content: center;
  border-radius: 50%;
  align-items: center;
  min-width: 44px;
  height: 44px;
  background-color: ${(props) => props.color}; ;
`;

export const FicheOnMobile = (props: Props) => {
  return (
    <div>
      {props.item.tags[0] && (
        <ItemContainer
          darkColor={props.item.tags[0].darkColor}
          typeContenu={props.item.typeContenu}
          lightColor={props.item.tags[0].lightColor}
        >
          <TitleText color={props.item.tags[0].darkColor}>
            {props.item.titreInformatif}
            {props.item.titreMarque && (
              <SubTitleText>
                {" " + props.t("Dispositif.avec", "avec") + " "}{" "}
                {props.item.titreMarque}
              </SubTitleText>
            )}
          </TitleText>

          <PictoCircle color={props.item.tags[0].darkColor}>
            <Streamline
              name={props.item.tags[0].icon}
              stroke={"white"}
              width={22}
              height={22}
            />
          </PictoCircle>
        </ItemContainer>
      )}
    </div>
  );
};
