import React from "react";
import styled from "styled-components";
import { CardBody } from "reactstrap";
import { useTranslation } from "next-i18next";
import CustomCard from "components/UI/CustomCard/CustomCard";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import {colors} from "colors";
import { Theme } from "types/interface";

const CardText = styled.p`
  font-size: 32px;
  line-height: 40px !important;
  font-weight: 600;
  color: ${(props: {color: string}) => props.color};
`;

const SeeMoreButton = styled.div`
  background-color: ${(props: {color: string}) => props.color};
  align-self: flex-end;
  display: flex;
  flex-direction: row;
  padding: 12px;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
`
const SeeMoreText = styled.p`
  color: white;
  font-size: 18px;
  margin-left: 8px;
  margin-right: ${(props: {mr?: number}) => (props.mr ? `${props.mr}px` : "0px")};
  font-weight: bold;
`

interface Props {
  theme: Theme
  seeMore: any
  isRTL: boolean
}

const SeeMoreCard = (props: Props) => {
  const { t } = useTranslation();

  return (
    <div className="card-col puff-in-center dispositif">
      <CustomCard onClick={props.seeMore} className="border-none">
        <CardBody>
          <CardText color={props.theme.colors.color100}>{t("AdvancedSearch.Voir les fiches", "Voir toutes les fiches")}</CardText>
          <SeeMoreButton color={props.theme.colors.color100}>
          <EVAIcon name="expand-outline" fill={colors.gray10} />
            <SeeMoreText mr={props.isRTL ? 8 : 0}>
              {/* TODO: translate */}
              {t("Tags." + props.theme.short.fr, props.theme.short.fr)}
            </SeeMoreText>
          </SeeMoreButton>
        </CardBody>
      </CustomCard>
    </div>
  );
};

export default SeeMoreCard;
