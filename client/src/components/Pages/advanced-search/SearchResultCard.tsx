import React from "react";
import Link from "next/link"
import { useRouter } from "next/router";
import CustomCard from "components/UI/CustomCard/CustomCard";
import { CardBody, CardFooter } from "reactstrap";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { colors } from "colors";
import Streamline from "assets/streamline";
import { IDispositif, IUserFavorite } from "types/interface";
import styles from "./SearchResultCard.module.scss";
import { getPath } from "routes";

interface Props {
  pin?: (e: any, dispositif: IDispositif|IUserFavorite) => void
  pinnedList?: string[]
  dispositif: IDispositif|IUserFavorite
  showPinned: boolean
  linkBlank?: boolean
}

const SearchResultCard = (props: Props) => {
  const router = useRouter();
  const pinned = !props.pinnedList ? false : !!props.pinnedList.find(
    (pinnedDispostifId) => pinnedDispostifId === props.dispositif._id.toString()
  );

    let shortTheme = "";
    const theme = props.dispositif.theme;
    if (props.dispositif.theme) {
      shortTheme = props.dispositif.theme.short.fr.replace(/ /g, "-");
    }

  const typeContenu = props.dispositif.typeContenu === "demarche" ? "/demarche/[id]" : "/dispositif/[id]";
  const id = props.dispositif._id ? props.dispositif._id.toString() : "";

    return (
      <div
        className={
          "card-col puff-in-center " + (props.dispositif.typeContenu || "dispositif")
        }
        key={props.dispositif._id.toString()}
      >
        <Link href={{
          pathname: getPath(typeContenu, router.locale),
          query: {id: id}
        }}>
          <a target={props.linkBlank ? "_blank" : undefined}>
            <CustomCard
              className={
                props.dispositif.typeContenu === "demarche"
                  ? "texte-" +
                    shortTheme +
                    " bg-light-" +
                    shortTheme +
                    " border-" +
                    shortTheme
                  : "border-none"
              }
            >
              <CardBody>
                {props.showPinned && (
                  <div
                    className={styles.container + " bookmark-icon" + (pinned ? " pinned" : "")}
                    onClick={(e: any) => {
                      if(props.pin) props.pin(e, props.dispositif)
                    }}
                    data-test-id={"test-toggle-pin-" + props.dispositif._id}
                  >
                    <EVAIcon name="star" fill={colors.gray10} size="medium" />
                  </div>
                )}
                <h5>{props.dispositif.titreInformatif}</h5>
                <p className={styles.text}>{props.dispositif.abstract}</p>
              </CardBody>
              {props.dispositif.typeContenu !== "demarche" && (
                <CardFooter
                  className={
                    "correct-radius align-right bg-" +
                    shortTheme +
                    (theme ? "" : " no-icon")
                  }
                >
                  {theme ? (
                    <div
                      style={{
                        width: 35,
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                      }}
                    >
                      <Streamline
                        name={theme.icon}
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
};

export default SearchResultCard;
