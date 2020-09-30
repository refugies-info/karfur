import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import styled from "styled-components";
import { filtres } from "../Dispositif/data";
import CustomCard from "../../components/UI/CustomCard/CustomCard";
import { CardBody, CardFooter } from "reactstrap";
import EVAIcon from "../../components/UI/EVAIcon/EVAIcon";
import variables from "scss/colors.scss";
import Streamline from "../../assets/streamline";
import "./AdvancedSearch.scss";

const CardText = styled.p`
  font-weight: 14px;
`;

const SearchResultCard = ({ pin, pinnedList, dispositif, themeList}) => {

  if (themeList) {
    return
  }
  const pinned =
    pinnedList.includes(dispositif._id) ||
    pinnedList.filter(
      (pinnedDispostif) =>
        pinnedDispostif && pinnedDispostif._id === dispositif._id
    ).length > 0;

  if (!dispositif.hidden) {
    let shortTag = null;
    let shortTagFull = null;
    let iconTag = null;
    if (
      dispositif.tags &&
      dispositif.tags.length > 0 &&
      dispositif.tags[0] &&
      dispositif.tags[0].short
    ) {
      shortTag = (dispositif.tags[0].short || {}).replace(/ /g, "-");
      shortTagFull = dispositif.tags[0].short;
    }
    if (shortTagFull) {
      iconTag = filtres.tags.find((tag) => tag.short === shortTagFull);
    }

    return (
      <div
        className={
          "card-col puff-in-center " + (dispositif.typeContenu || "dispositif")
        }
        key={dispositif._id}
      >
        <NavLink
          to={{
            pathname:
              "/" +
              (dispositif.typeContenu || "dispositif") +
              (dispositif._id ? "/" + dispositif._id : ""),
            state: { previousRoute: "advanced-search" },
          }}
        >
          <CustomCard
            className={
              dispositif.typeContenu === "demarche"
                ? "texte-" +
                  shortTag +
                  " bg-light-" +
                  shortTag +
                  " border-" +
                  shortTag
                : "border-none"
            }
          >
            <CardBody>
              <EVAIcon
                name="bookmark"
                size="xlarge"
                onClick={(e) => pin(e, dispositif)}
                fill={pinned ? variables.noir : variables.noirCD}
                className={"bookmark-icon" + (pinned ? " pinned" : "")}
              />
              <h5>{dispositif.titreInformatif}</h5>
              <CardText>{dispositif.abstract}</CardText>
            </CardBody>
            {dispositif.typeContenu !== "demarche" && (
              <CardFooter
                className={
                  "correct-radius align-right bg-" +
                  shortTag +
                  (iconTag ? "" : " no-icon")
                }
              >
                {iconTag ? (
                  <div
                    style={{
                      width: 50,
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                    }}
                  >
                    <Streamline
                      name={iconTag.icon}
                      stroke={"white"}
                      width={22}
                      height={22}
                    />
                  </div>
                ) : null}
                {dispositif.titreMarque}
              </CardFooter>
            )}
          </CustomCard>
        </NavLink>
      </div>
    );
  }
  return false;
};

export default withRouter(SearchResultCard);
