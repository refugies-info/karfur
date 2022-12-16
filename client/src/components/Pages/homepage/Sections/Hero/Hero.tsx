import React from "react";
import { Container } from "reactstrap";
import { useTranslation } from "next-i18next";
import { cls } from "lib/classname";
import { HeroArrow } from "components/Pages/staticPages/common";
import HomeSearchHeader from "../../HomeSearchHeader";
import commonStyles from "scss/components/staticPages.module.scss";
import styles from "./Hero.module.scss";

interface Props {
  targetArrow: string;
}

const Hero = (props: Props) => {
  const { t } = useTranslation();

  return (
    <div className={styles.hero}>
      <Container className={cls(commonStyles.container)}>
        <h1>{t("Homepage.title")}</h1>
        <HomeSearchHeader />
        <HeroArrow center target={props.targetArrow} />
      </Container>
    </div>
  );
};

export default Hero;
