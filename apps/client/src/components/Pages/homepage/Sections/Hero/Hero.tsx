import React from "react";
import { Container } from "reactstrap";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { cls } from "lib/classname";
import { HeroArrow } from "components/Pages/staticPages/common";
import HomeSearchHeader from "../../HomeSearchHeader";
import commonStyles from "scss/components/staticPages.module.scss";
import Character from "assets/homepage/hero/character.svg";
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
      </Container>
      <HeroArrow center target={props.targetArrow} />
      <div className={styles.bottom_img}>
        <Image src={Character} width={207} height={274} alt="" />
      </div>
    </div>
  );
};

export default Hero;
