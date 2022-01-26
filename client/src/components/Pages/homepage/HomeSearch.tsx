import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
//@ts-ignore
import Flippy, { FrontSide, BackSide } from "react-flippy";
import { colors } from "colors";
import Streamline from "assets/streamline";
import Ripples from "react-ripples";
import i18n from "i18n";
import styled from "styled-components";
import { isMobile } from "react-device-detect";
import { Tag } from "types/interface";

const IconContainer = styled.div`
  display: flex;
  margin-right: ${(props) => (props.isRTL ? "0px" : "10px")};
  margin-left: ${(props) => (props.isRTL ? "10px" : "0px")};
  justify-content: center;
  align-items: center;
`;

interface Props {
  searchItem: any;
  togglePopup: () => void;
  toggleOverlay: () => void;
  toggleModal: () => void;
}
const HomeSearch = (props: Props) => {
  const [flip, setFlip] = useState(true);
  const [indexF, setIndexF] = useState(0);
  const [indexB, setIndexB] = useState(1);

  const isRTL = ["ar", "ps", "fa"].includes(i18n.language);
  const { t } = useTranslation();
  const flippy: any = useRef();

  useEffect(() => {
    setTimeout(() => {
      if (flippy.current) {
        flippy.current.toggle();
        setTimeout(() => {
          setIndexF(indexF === 10 ? 0 : indexF + 2);
        }, 1000);
      }
    }, 1500);
  }, [indexF]);

  useEffect(() => {
    if (flip) {
      setTimeout(() => {
        if (flippy.current) {
          flippy.current.toggle();
          setTimeout(() => {
            setIndexB(indexB === 9 ? 1 : indexB + 2);
          }, 1000);
        }
      }, 1500);
    }
  }, [indexF, flip, indexB]);

  useEffect(() => {
    if (flip) {
      setTimeout(() => {
        if (flippy.current) {
          flippy.current.toggle();
          setTimeout(() => {
            setIndexF(indexF === 10 ? 0 : indexF + 2);
          }, 1000);
        }
      }, 1500);
    }
  }, [indexB, indexF, flip]);

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

  return (
    <div onClick={open} className="search-col">
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
            {searchItem.children.map((tag: Tag, idx: number) =>
              idx === indexF ? (
                <button
                  key={idx}
                  onClick={open}
                  className={
                    "search-home " +
                    "bg-" +
                    (tag.short || "").replace(/ /g, "-")
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
                  {tag.icon ? (
                    <IconContainer isRTL={isRTL}>
                      <Streamline
                        name={tag.icon}
                        stroke={"white"}
                        width={22}
                        height={22}
                      />
                    </IconContainer>
                  ) : null}
                  {t("Tags." + tag.name, tag.name)}
                </button>
              ) : null
            )}
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
            {searchItem.children.map((tag: Tag, idx: number) =>
              idx === indexB ? (
                <button
                  key={idx}
                  onClick={open}
                  className={
                    "search-home " +
                    "bg-" +
                    (tag.short || "").replace(/ /g, "-")
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
                  {tag.icon ? (
                    <IconContainer isRTL={isRTL}>
                      <Streamline
                        name={tag.icon}
                        stroke={"white"}
                        width={22}
                        height={22}
                      />
                    </IconContainer>
                  ) : null}
                  {t("Tags." + tag.name, tag.name)}
                </button>
              ) : null
            )}
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

      {searchItem.title2 && (
        <span className="ml-10">
          {t("SearchItem." + searchItem.title2, searchItem.title2)}
        </span>
      )}
    </div>
  );
};

export default HomeSearch;
