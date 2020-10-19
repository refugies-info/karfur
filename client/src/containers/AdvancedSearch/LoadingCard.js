import React from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import CustomCard from "../../components/UI/CustomCard/CustomCard";
import { CardBody} from "reactstrap";
import { withTranslation } from "react-i18next";
import EVAIcon from "../../components/UI/EVAIcon/EVAIcon";
import variables from "scss/colors.scss";
import "./AdvancedSearch.scss";

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

const LoadingCard = () => {
  return (
    <div
      className={
        "card-col puff-in-center dispositif"
      }
    >
      <CustomCard className={"border-none"}>
        <CardBody />
      </CustomCard>
    </div>
  );
};

export default withRouter(withTranslation()(LoadingCard));
