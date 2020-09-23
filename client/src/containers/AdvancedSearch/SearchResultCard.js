import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import { filtres } from "../Dispositif/data";
import CustomCard from "../../components/UI/CustomCard/CustomCard";
import { Col, CardBody, CardFooter } from "reactstrap";
import EVAIcon from "../../components/UI/EVAIcon/EVAIcon";
import variables from "scss/colors.scss"
import Streamline from "../../assets/streamline";
import "./AdvancedSearch.scss";

const SearchResultCard = ({ pin, pinnedList, dispositif }) => {
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
            <Col
              xl="3"
              lg="3"
              md="4"
              sm="6"
              xs="12"
              className={
                "card-col puff-in-center " +
                (dispositif.typeContenu || "dispositif")
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
            <p>{dispositif.abstract}</p>
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
      </Col>
    );
  }
  return false;
};

export default withRouter(SearchResultCard);
