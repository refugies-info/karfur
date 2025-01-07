import { useTranslation } from "next-i18next";
import { Container } from "reactstrap";
import Character from "~/assets/homepage/hero/character.svg";
import Image from "~/components/UI/Image";
import { cls } from "~/lib/classname";
import commonStyles from "~/scss/components/staticPages.module.scss";
import styles from "./Hero.module.scss";

interface Props {
  targetArrow: string;
}

const Hero = (props: Props) => {
  const { t } = useTranslation();

  return (
    <div className={styles.hero}>
      <Container className={cls(commonStyles.container)}>
        <div>
          <h1>{t("Homepage.title")}</h1>
        </div>
      </Container>
      <div className={styles.bottom_img}>
        <Image src={Character} width={207} height={274} alt="" />
      </div>
    </div>
  );
};

export default Hero;
