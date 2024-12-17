import { useTranslations } from "next-intl";
import Link from "next/link";
import { Col, Container, Row } from "reactstrap";
import FreeResourcesImg from "~/assets/homepage/free-resources.png";
import { InlineLink } from "~/components/Pages/staticPages/common";
import Image from "~/components/UI/Image";
import { cls } from "~/lib/classname";
import commonStyles from "~/scss/components/staticPages.module.scss";
import styles from "./FreeResources.module.scss";

const FreeResources = () => {
  const t = useTranslations();

  return (
    <div className={cls(commonStyles.section, commonStyles.bg_red)}>
      <Container className={commonStyles.container}>
        <Row>
          <Col sm="12" lg="6" className="lg:order-1">
            <h2 className={cls(commonStyles.title2, commonStyles.white, "mb-0")}>{t("Homepage.resourcesTitle")}</h2>
            <p className={cls(commonStyles.subtitle, commonStyles.bottom_space)}>{t("Homepage.resourcesText")}</p>
            <div className={commonStyles.bottom_space}>
              <InlineLink text={t("Homepage.resourcesCTA")} link="https://kit.refugies.info/" color="white" />
            </div>
          </Col>
          <Col sm="12" lg="6" className="lg:order-0">
            <Link href="https://kit.refugies.info/" target="_blank" rel="noopener noreferrer">
              <Image
                src={FreeResourcesImg}
                alt={t("Homepage.resourcesTitle")}
                width={500}
                height={272}
                className={cls(styles.resources_image, commonStyles.bottom_space)}
              />
            </Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FreeResources;
