import React from "react";
import { IDispositif } from "types/interface";
import { useTranslation } from "next-i18next";
import styled from "styled-components";
import { colors } from "colors";
import Streamline from "assets/streamline";
import { tags } from "data/tags";

interface Props {
  item: IDispositif;
  history: any;
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
  font-weight: bold;
`;

const SubTitleText = styled.div`
  color: ${(props) => props.color};
  font-size: 16px;
  font-weight: normal;
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
  const { t } = useTranslation();

  const navigateToContent = () => {
    return props.history.push({
      pathname:
        "/" +
        (props.item.typeContenu || "dispositif") +
        (props.item._id ? "/" + props.item._id : ""),
    });
  };
  return (
    <div>
      {props.item.tags[0] && (
        <ItemContainer
          darkColor={props.item.tags[0].darkColor}
          typeContenu={props.item.typeContenu}
          lightColor={props.item.tags[0].lightColor}
          onClick={navigateToContent}
        >
          <TitleText color={props.item.tags[0].darkColor}>
            {props.item.titreInformatif}
            {props.item.titreMarque && (
              <SubTitleText>
                {" " + t("Dispositif.avec", "avec") + " "}{" "}
                {props.item.titreMarque}
              </SubTitleText>
            )}
          </TitleText>

          <PictoCircle color={props.item.tags[0].darkColor}>
            <Streamline
              name={
                props.item.tags[0].icon
                  ? props.item.tags[0].icon
                  : tags.filter(
                      (el) => el.short === props.item.tags[0].short
                    )[0].icon
              }
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
