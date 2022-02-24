//@ts-nocheck
import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "next-i18next";
//@ts-ignore
import Flippy, { FrontSide, BackSide } from "react-flippy";
import { colors } from "colors";
import Streamline from "assets/streamline";
import Ripples from "react-ripples";
import styled from "styled-components";
import { isMobile } from "react-device-detect";
import { Tag } from "types/interface";
import styles from "./HomeSearch.module.scss";
import useRTL from "hooks/useRTL";
import { SearchItemType } from "data/searchFilters";

const IconContainer = styled.div`
  display: flex;
  margin-right: ${(props) => (props.isRTL ? "0px" : "10px")};
  margin-left: ${(props) => (props.isRTL ? "10px" : "0px")};
  justify-content: center;
  align-items: center;
`;

interface Props {
  searchItem: SearchItemType;
  togglePopup: () => void;
  toggleOverlay: () => void;
  toggleModal: () => void;
}
const HomeSearch = (props: Props) => {
  const [flip, setFlip] = useState(true);
  const [indexFront, setIndexFront] = useState(0);
  const [indexBack, setIndexBack] = useState(1);

  const isRTL = useRTL();
  const { t } = useTranslation();
  const flippy: any = useRef();

  const showFront = useRef();
  const flipFunc = useRef();
  useEffect(() => {
    if (flip) {
      flipFunc.current = setInterval(() => {
        if (flippy.current) {
          flippy.current.toggle();
          setTimeout(() => {
            if (showFront.current) {
              setIndexBack((i) => (i === 9 ? 1 : i + 2));
              showFront.current = false;
            } else {
              setIndexFront((i) => (i === 10 ? 0 : i + 2));
              showFront.current = true;
            }
          }, 500);
        }
      }, 2000);
    } else {
      clearInterval(flipFunc.current)
    }

    return(() => {
      clearInterval(flipFunc.current)
    })
  }, [flip]);

  const open = (e: any) => {
    e.preventDefault();
    if (isMobile) {
      props.toggleModal();
    } else {
      setFlip(!flip);
      props.togglePopup();
      props.toggleOverlay();
    }
  };

  const close = (e: any) => {
    e.preventDefault();
    setFlip(true);
    props.togglePopup();
    props.toggleOverlay();
  };

  const { searchItem } = props;
  const tags: Tag[] = searchItem.children;

  return (
    <div onClick={open} className={styles.col}>
      <span className="mr-10 mb-15">
        {t("SearchItem." + searchItem.title, searchItem.title)}
      </span>
      {flip ? (
        <Flippy
          flipOnClick={false}
          flipDirection="vertical"
          ref={flippy}
          style={{ width: "280px", height: "50px" }}
        >
          <FrontSide
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              width: "280px",
              height: "50px",
              borderRadius: 10,
            }}
          >
            <button
              onClick={open}
              className={
                "search-home " +
                "bg-" +
                (tags[indexFront].short || "").replace(/ /g, "-")
              }
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                borderRadius: 10,
                padding: 0,
                fontWeight: 600,
              }}
            >
              {tags[indexFront].icon ? (
                <IconContainer isRTL={isRTL}>
                  <Streamline
                    name={tags[indexFront].icon}
                    stroke={"white"}
                    width={22}
                    height={22}
                  />
                </IconContainer>
              ) : null}
              {t("Tags." + tags[indexFront].name, tags[indexFront].name)}
            </button>
          </FrontSide>
          <BackSide
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              width: "280px",
              height: "50px",
              borderRadius: 10,
            }}
          >
            <button
              onClick={open}
              className={
                "search-home " +
                "bg-" +
                (tags[indexBack].short || "").replace(/ /g, "-")
              }
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                borderRadius: 10,
                padding: 0,
                fontWeight: 600,
              }}
            >
              {tags[indexBack].icon ? (
                <IconContainer isRTL={isRTL}>
                  <Streamline
                    name={tags[indexBack].icon}
                    stroke={"white"}
                    width={22}
                    height={22}
                  />
                </IconContainer>
              ) : null}
              {t("Tags." + tags[indexBack].name, tags[indexBack].name)}
            </button>
          </BackSide>
        </Flippy>
      ) : (
        <Ripples>
          <button
            onClick={close}
            className="search-home"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              borderRadius: 10,
              backgroundColor: colors.grisFonce,
              // fontWeight: "600",
            }}
          >
            <IconContainer isRTL={isRTL}>
              <Streamline name="search" width={20} height={20} />
            </IconContainer>
            {searchItem.value
              ? t("Tags." + searchItem.value, searchItem.value)
              : t("Tags." + searchItem.placeholder, searchItem.placeholder)}
          </button>
        </Ripples>
      )}
    </div>
  );
};

export default HomeSearch;
