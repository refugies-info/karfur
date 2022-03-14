import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "next-i18next";
import Flippy, { FrontSide, BackSide } from "react-flippy";
import { colors } from "colors";
import Streamline from "assets/streamline";
import Ripples from "react-ripples";
import { isMobile } from "react-device-detect";
import { Tag } from "types/interface";
import styles from "./HomeSearch.module.scss";
import { SearchItemType } from "data/searchFilters";
import { cls } from "lib/classname";

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
  const [isLoaded, setIsLoaded] = useState(false);

  const { t } = useTranslation();
  const flippy: any = useRef();

  const showFront = useRef<boolean|undefined>();
  const flipFunc = useRef<number|undefined>();
  const timeoutFunc = useRef<number|undefined>();
  useEffect(() => {
    if (flip) {
      setIsLoaded(true);
      flipFunc.current = setInterval(() => {
        if (flippy.current) {
          flippy.current.toggle();
          timeoutFunc.current = setTimeout(() => {
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
    }

    return (() => {
      clearTimeout(timeoutFunc.current)
      clearInterval(flipFunc.current)
    })
  }, [flip]);

  const open = (e: any) => {
    e.preventDefault();
    if (isMobile) {
      props.toggleModal();
    } else {
      setFlip(!flip);
      clearInterval(flipFunc.current)
      clearTimeout(timeoutFunc.current)
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
  const tags: Tag[] = searchItem.children as Tag[];

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
          className={styles.flippy}
        >
          <FrontSide className={styles.flippy_side}>
            <button
              onClick={open}
              className={
                styles.flippy_btn +
                " search-home " +
                "bg-" +
                (tags[indexFront].short || "").replace(/ /g, "-")
              }
            >
              {tags[indexFront].icon ? (
                <div className={styles.icon}>
                  <Streamline
                    name={tags[indexFront].icon}
                    stroke={"white"}
                    width={22}
                    height={22}
                  />
                </div>
              ) : null}
              {t("Tags." + tags[indexFront].name, tags[indexFront].name)}
            </button>
          </FrontSide>
          {isLoaded &&
            <BackSide className={styles.flippy_side}>
              <button
                onClick={open}
                className={
                  styles.flippy_btn +
                  " search-home " +
                  "bg-" +
                  (tags[indexBack].short || "").replace(/ /g, "-")
                }
              >
                {tags[indexBack].icon ? (
                  <div className={styles.icon}>
                    <Streamline
                      name={tags[indexBack].icon}
                      stroke={"white"}
                      width={22}
                      height={22}
                    />
                  </div>
                ) : null}
                {t("Tags." + tags[indexBack].name, tags[indexBack].name)}
              </button>
            </BackSide>
          }
        </Flippy>
      ) : (
        <Ripples>
          <button
            onClick={close}
            className={cls("search-home", styles.flippy_btn_open)}
          >
            <div className={styles.icon}>
              <Streamline name="search" width={20} height={20} />
            </div>
            {t("Tags." + searchItem.placeholder, searchItem.placeholder)}
          </button>
        </Ripples>
      )}
    </div>
  );
};

export default HomeSearch;
