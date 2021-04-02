import React from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import { filtres } from "../Dispositif/data";
import CustomCard from "../../components/UI/CustomCard/CustomCard";
import { CardBody, CardFooter } from "reactstrap";
import EVAIcon from "../../components/UI/EVAIcon/EVAIcon";
import { colors } from "colors";
import Streamline from "../../assets/streamline";
import "./AdvancedSearch.scss";

const CardText = styled.p`
  font-weight: 14px;
`;

const SearchResultCard = ({
  pin,
  pinnedList,
  dispositif,
  themeList,
  history,
  showPinned,
}) => {
  if (themeList) {
    return;
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
        <CustomCard
          onClick={() => {
            history.push({
              pathname:
                "/" +
                (dispositif.typeContenu || "dispositif") +
                (dispositif._id ? "/" + dispositif._id : ""),
              state: { previousRoute: "advanced-search" },
            });
          }}
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
            {showPinned && (
              <EVAIcon
                name="bookmark"
                size="xlarge"
                onClick={(e) => pin(e, dispositif)}
                fill={pinned ? colors.validationHover : colors.noirCD}
                className={"bookmark-icon" + (pinned ? " pinned" : "")}
                testID={"test-toggle-pin-" + dispositif._id}
              />
            )}
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
                    width: 35,
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                  }}
                >
                  <Streamline
                    name={iconTag.icon}
                    stroke={"white"}
                    width={20}
                    height={20}
                  />
                </div>
              ) : null}
              {dispositif.titreMarque}
            </CardFooter>
          )}
        </CustomCard>
      </div>
    );
  }
  return false;
};

export default withRouter(SearchResultCard);
