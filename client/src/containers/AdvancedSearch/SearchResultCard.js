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

const BookmarkedContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  height: 40px;
  width: 40px;
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
        {"nb vues : " +
          dispositif.nbVues +
          " - date publication : " +
          dispositif.publishedAt}
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
              <BookmarkedContainer
                className={"bookmark-icon" + (pinned ? " pinned" : "")}
                onClick={(e) => pin(e, dispositif)}
                testID={"test-toggle-pin-" + dispositif._id}
              >
                <EVAIcon name="star" fill={colors.blanc} size="medium" />
              </BookmarkedContainer>
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
