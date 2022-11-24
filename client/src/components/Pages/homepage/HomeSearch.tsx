import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "next-i18next";
import Flippy, { FrontSide, BackSide } from "react-flippy";
import Streamline from "assets/streamline";
import Ripples from "react-ripples";
import { isMobile } from "react-device-detect";
import styles from "./HomeSearch.module.scss";
import { cls } from "lib/classname";
import { getThemeName } from "lib/getThemeName";
import { useRouter } from "next/router";
import ThemeIcon from "components/UI/ThemeIcon";
import { useSelector } from "react-redux";
import { themesSelector } from "services/Themes/themes.selectors";

interface Props {
  togglePopup: () => void;
  toggleOverlay: () => void;
  toggleModal: () => void;
}
const HomeSearch = (props: Props) => {
  const [flip, setFlip] = useState(true);
  const [indexFront, setIndexFront] = useState(0);
  const [indexBack, setIndexBack] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);

  const router = useRouter();
  const { t } = useTranslation();
  const flippy: any = useRef();
  const themes = useSelector(themesSelector);

  const showFront = useRef<boolean|undefined>();
  const flipFunc = useRef<any|undefined>();
  const timeoutFunc = useRef<any|undefined>();
  useEffect(() => {
    const nbThemes = themes.length;
    const isEven = nbThemes % 2 === 0;
    if (flip) {
      setIsLoaded(true);
      flipFunc.current = setInterval(() => {
        if (flippy.current) {
          flippy.current.toggle();
          timeoutFunc.current = setTimeout(() => {
            if (showFront.current) {
              setIndexBack((i) => (i >= nbThemes - (isEven ? 1 : 2) ? 1 : i + 2));
              showFront.current = false;
            } else {
              setIndexFront((i) => (i >= nbThemes - (isEven ? 2 : 1) ? 0 : i + 2));
              showFront.current = true;
            }
          }, 500);
        }
      }, 2000);
    }

    return () => {
      clearTimeout(timeoutFunc.current);
      clearInterval(flipFunc.current);
    };
  }, [flip, themes.length]);

  const open = (e: any) => {
    e.preventDefault();
    if (isMobile) {
      props.toggleModal();
    } else {
      setFlip(!flip);
      clearInterval(flipFunc.current);
      clearTimeout(timeoutFunc.current);
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

  return (
    <div onClick={open} className={styles.col}>
      <span className="mr-10 mb-15">{t("Homepage.need", "J'ai besoin de")}</span>
      {flip ? (
        <Flippy flipOnClick={false} flipDirection="vertical" ref={flippy} className={styles.flippy}>
          <FrontSide className={styles.flippy_side}>
            <button
              onClick={open}
              className={styles.flippy_btn + " search-home "}
              style={{ backgroundColor: themes[indexFront].colors.color100 }}
            >
              {themes[indexFront].icon ? (
                <div className={styles.icon}>
                  <ThemeIcon theme={themes[indexFront]} />
                </div>
              ) : null}
              {getThemeName(themes[indexFront], router.locale)}
            </button>
          </FrontSide>
          {isLoaded && (
            <BackSide className={styles.flippy_side}>
              <button
                onClick={open}
                className={styles.flippy_btn + " search-home "}
                style={{ backgroundColor: themes[indexBack].colors.color100 }}
              >
                {themes[indexBack].icon ? (
                  <div className={styles.icon}>
                    <ThemeIcon theme={themes[indexBack]} />
                  </div>
                ) : null}
                {getThemeName(themes[indexBack], router.locale)}
              </button>
            </BackSide>
          )}
        </Flippy>
      ) : (
        <Ripples>
          <button onClick={close} className={cls("search-home", styles.flippy_btn_open)}>
            <div className={styles.icon}>
              <Streamline name="search" width={20} height={20} />
            </div>
            {t("Homepage.theme", "thème")}
          </button>
        </Ripples>
      )}
    </div>
  );
};

export default HomeSearch;
