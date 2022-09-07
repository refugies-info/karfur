import React from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import styled from "styled-components";
import FSearchBtn from "components/UI/FSearchBtn/FSearchBtn";
import Streamline from "assets/streamline";
import { motion } from "framer-motion";
import { Theme } from "types/interface";
import styles from "./CatList.module.scss";
import useRTL from "hooks/useRTL";
import { getPath } from "routes";
import ThemeIcon from "components/UI/ThemeIcon";

const InnerButton = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const IconContainer = styled.div`
  display: flex;
  margin-right: ${(props: {isRTL: boolean}) => (props.isRTL ? "0px" : "10px")};
  margin-left: ${(props: {isRTL: boolean}) => (props.isRTL ? "10px" : "0px")};
  justify-content: center;
  align-items: center;
`;

const container = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemanim = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

interface Props {
  themes: Theme[];
}

const CatList = (props: Props) => {
  const isRTL = useRTL();
  const { t } = useTranslation();
  const router = useRouter();

  const goToTheme = (theme: Theme) => {
    router.push({
      pathname: getPath("/recherche", router.locale),
      search: "?tag=" + theme.name.fr,
    });
  };

  return (
    <motion.ul
      className={styles.options}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {props.themes.map((theme: Theme, idx: number) => {
        return (
          <motion.li
            key={idx}
            variants={itemanim}
          >
            <FSearchBtn
              key={idx}
              onClick={() => goToTheme(theme)}
              color={theme.colors.color100}
              withMargins
            >
              <InnerButton>
                {theme.icon ? (
                  <IconContainer isRTL={isRTL}>
                    <ThemeIcon theme={theme} />
                  </IconContainer>
                ) : null}
                {theme.name.fr}
              </InnerButton>
            </FSearchBtn>
          </motion.li>
        );
      })}
      <motion.li
        key={props.themes.length}
        className={styles.link + " bg-gray90"}
        variants={itemanim}
      >
        <a target="_blank" href="https://soliguide.fr/" rel="noopener noreferrer">
          <InnerButton>
            <IconContainer isRTL={isRTL}>
              <Streamline
                name="message"
                stroke="white"
                width={22}
                height={22}
              />
            </IconContainer>
            {t("manger, me doucher", "manger, me doucher...")}
          </InnerButton>
        </a>
      </motion.li>
      <motion.li key={props.themes.length + 1} variants={itemanim}>
        <button
          onClick={() => {
            router.push(getPath("/recherche", router.locale));
          }}
          className={styles.menu + " bg-gray10"}
        >
          <InnerButton>
            <IconContainer isRTL={isRTL}>
              <Streamline name="menu" stroke="black" />
            </IconContainer>
            {t("Toolbar.Tout voir", "Tout voir")}
          </InnerButton>
        </button>
      </motion.li>
    </motion.ul>
  );
};

export default CatList;
