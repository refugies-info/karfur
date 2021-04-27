import React from "react";
import { Tag } from "../../../../../types/interface";
import styled from "styled-components";
import { colors } from "../../../../../colors";
import Streamline from "assets/streamline";
import { filtres } from "../../../../Dispositif/data";

interface Props {
  item: any;
  tagSelected: Tag | null;
  t: (a: string, b: string) => void;
  type: string;
}

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  border: ${(props) =>
    props.typeContenu === "demarche" ? `2px solid ${props.color}` : null};
  min-height: 76px;
  margin: 13px 0;
  background-color: ${(props) =>
    props.typeContenu === "dispositif" ? colors.blanc : null};
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

export const DispositifsItem = (props: Props) => {
  const tagItem =
    props.type === "primary" && props.tagSelected
      ? props.tagSelected
      : props.item.tags[0]
      ? filtres.tags.filter((el) => el.short === props.item.tags[0].short)[0]
      : null;
  return (
    <div>
      <Item color={tagItem?.darkColor} typeContenu={props.item.typeContenu}>
        <TitleText color={tagItem?.darkColor}>
          {props.item.titreInformatif}
          {props.item.titreMarque && (
            <SubTitleText>
              {" " + props.t("Dispositif.avec", "avec") + " "}{" "}
              {props.item.titreMarque}
            </SubTitleText>
          )}
        </TitleText>

        {props.tagSelected ? (
          <PictoCircle color={props.tagSelected.darkColor}>
            <Streamline
              name={props.tagSelected.icon}
              stroke={"white"}
              width={22}
              height={22}
            />
          </PictoCircle>
        ) : tagItem ? (
          <PictoCircle color={tagItem.darkColor}>
            <Streamline
              name={tagItem.icon}
              stroke={"white"}
              width={22}
              height={22}
            />
          </PictoCircle>
        ) : null}
      </Item>
    </div>
  );
};
