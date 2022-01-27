import React from "react";
import styled from "styled-components";
import Link from "next/link"
import { filtres } from "data/dispositif";
import CustomCard from "components/UI/CustomCard/CustomCard";
import { CardBody, CardFooter } from "reactstrap";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { colors } from "colors";
import Streamline from "assets/streamline";

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

interface Props {
  pin: any
  pinnedList: any[]
  dispositif: any
  showPinned: boolean
}

const SearchResultCard = (props: Props) => {
  const pinned =
  props.pinnedList.includes(props.dispositif._id) ||
  props.pinnedList.filter(
      (pinnedDispostif) =>
        pinnedDispostif && pinnedDispostif._id === props.dispositif._id
    ).length > 0;

  if (!props.dispositif.hidden) {
    let shortTag = "";
    let shortTagFull = "";
    let iconTag = null;
    if (
      props.dispositif.tags &&
      props.dispositif.tags.length > 0 &&
      props.dispositif.tags[0] &&
      props.dispositif.tags[0].short
    ) {
      shortTag = (props.dispositif.tags[0].short || {}).replace(/ /g, "-");
      shortTagFull = props.dispositif.tags[0].short;
    }
    if (shortTagFull) {
      iconTag = filtres.tags.find((tag) => tag.short === shortTagFull);
    }

    return (
      <div
        className={
          "card-col puff-in-center " + (props.dispositif.typeContenu || "dispositif")
        }
        key={props.dispositif._id}
      >
        <Link
          href={{
            pathname:
              "/" +
              (props.dispositif.typeContenu || "dispositif") +
              (props.dispositif._id ? "/" + props.dispositif._id : ""),
            // state: { previousRoute: "advanced-search" },
          }}
        >
          <a>
            <CustomCard
              className={
                props.dispositif.typeContenu === "demarche"
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
                {props.showPinned && (
                  <BookmarkedContainer
                    className={"bookmark-icon" + (pinned ? " pinned" : "")}
                    onClick={(e: any) => props.pin(e, props.dispositif)}
                    testID={"test-toggle-pin-" + props.dispositif._id}
                  >
                    <EVAIcon name="star" fill={colors.blanc} size="medium" />
                  </BookmarkedContainer>
                )}
                <h5>{props.dispositif.titreInformatif}</h5>
                <CardText>{props.dispositif.abstract}</CardText>
              </CardBody>
              {props.dispositif.typeContenu !== "demarche" && (
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
                  <span>{props.dispositif.titreMarque}</span>
                </CardFooter>
              )}
            </CustomCard>
          </a>
        </Link>
      </div>
    );
  }
  return null;
};

export default SearchResultCard;
