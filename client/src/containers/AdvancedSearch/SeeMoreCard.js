import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import CustomCard from "../../components/UI/CustomCard/CustomCard";
import { CardBody} from "reactstrap";
import EVAIcon from "../../components/UI/EVAIcon/EVAIcon";
import {colors} from "colors";

const CardText = styled.p`
  font-size: 32px;
  line-height: 40px !important;
  font-weight: 500;
  color: ${props => props.color};
`;

const SeeMoreButton = styled.div`
  background-color: ${props => props.color};
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
  margin-right: ${(props) => (props.mr ? `${props.mr}px` : "0px")};
  font-weight: 700;
`

const SeeMoreCard = ({ theme, seeMore, isRTL }) => {
  const { t } = useTranslation();
  return (
    <div
      className={
        "card-col puff-in-center dispositif"
      }
    >
      <CustomCard onClick={seeMore} className={"border-none"}>
        <CardBody>
          <CardText color={theme.darkColor}>{t("AdvancedSearch.Voir les fiches", "Voir toutes les fiches")}</CardText>
          <SeeMoreButton color={theme.darkColor}>
          <EVAIcon name="expand-outline" fill={colors.blanc} />
            <SeeMoreText mr={isRTL ? 8 : 0}>
              {t("Tags." + theme.short, theme.short)}
            </SeeMoreText>
          </SeeMoreButton>
        </CardBody>
      </CustomCard>
    </div>
  );
};

export default SeeMoreCard;
