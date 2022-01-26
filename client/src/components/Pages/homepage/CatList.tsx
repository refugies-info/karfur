import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import styled from "styled-components";
import i18n from "i18n";
import FSearchBtn from "components/FigmaUI/FSearchBtn/FSearchBtn";
import Streamline from "assets/streamline";
import { motion } from "framer-motion";
import { Tag } from "types/interface";

const InnerButton = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const IconContainer = styled.div`
  display: flex;
  margin-right: ${(props) => (props.isRTL ? "0px" : "10px")};
  margin-left: ${(props) => (props.isRTL ? "10px" : "0px")};
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
  tags: Tag[];
}

const CatList = (props: Props) => {
  const isRTL = ["ar", "ps", "fa"].includes(i18n.language);
  const { t } = useTranslation();
  const router = useRouter();

  const goToTag = (tag: string) => {
    router.push({
      pathname: "/advanced-search",
      search: "?tag=" + tag,
    });
  };

  return (
    <motion.ul
      className="options-wrapper"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {props.tags.map((tag: Tag, idx: number) => {
        return (
          <motion.li
            key={idx}
            variants={itemanim}
          >
            <FSearchBtn
              key={idx}
              onClick={() => goToTag(tag.name)}
              color={(tag.short || "").replace(/ /g, "-")}
              withMargins
            >
              <InnerButton>
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
              </InnerButton>
            </FSearchBtn>
          </motion.li>
        );
      })}
      <motion.li
        key={props.tags.length}
        className="advanced-search-a bg-noir"
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
      <motion.li key={props.tags.length + 1} variants={itemanim}>
        <button
          onClick={() => {
            router.push("/advanced-search");
          }}
          className="advanced-search-btn-menu bg-blanc"
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
