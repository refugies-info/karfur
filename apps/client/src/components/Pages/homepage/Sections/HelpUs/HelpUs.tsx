import HelpUsIcon1 from "@/assets/homepage/helpus-icon-1.png";
import HelpUsIcon3 from "@/assets/homepage/helpus-icon-3.svg";
import { Card, InlineLink, LanguageIcon } from "@/components/Pages/staticPages/common";
import Warning from "@/components/UI/Warning";
import { cls } from "@/lib/classname";
import commonStyles from "@/scss/components/staticPages.module.scss";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import { Col, Container, Row } from "reactstrap";
import { getPath } from "routes";
import styles from "./HelpUs.module.scss";

const HelpUs = () => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className={cls(commonStyles.section, commonStyles.bg_grey)}>
      <Container className={commonStyles.container}>
        <h2 className={cls(commonStyles.title2, commonStyles.center, "mb-0")}>{t("Homepage.helpUsTitle")}</h2>
        <p className={cls(commonStyles.subtitle, commonStyles.center)}>{t("Homepage.helpUsSubtitle")}</p>
        <Row className={commonStyles.top_space}>
          <Col sm="12" lg="4" className="mb-lg-0 mb-5">
            <Link
              href={getPath("/publier", router.locale)}
              prefetch={false}
              title={t("Homepage.helpUsCardTitle1")}
              className={styles.link}
            >
              <Card
                image={HelpUsIcon1}
                title={t("Homepage.helpUsCardTitle1")}
                footer={<InlineLink link="#" text={t("Homepage.helpUsCardCTA1")} color="purple" type="span" />}
                withShadow
              >
                <Warning text={t("Homepage.helpUsCardHelp1")} color="purple" />
                <p className={styles.help_text}>{t("Homepage.helpUsCardText1")}</p>
              </Card>
            </Link>
          </Col>

          <Col sm="12" lg="4" className="mb-lg-0 mb-5">
            <Link
              href={getPath("/traduire", router.locale)}
              prefetch={false}
              title={t("Homepage.helpUsCardTitle2")}
              className={styles.link}
            >
              <Card
                title={t("Homepage.helpUsCardTitle2")}
                header={
                  <>
                    <LanguageIcon language="ua" size={40} color="red" />
                    <LanguageIcon language="ir" size={40} color="red" />
                    <LanguageIcon language="sa" size={40} color="red" />
                    <LanguageIcon language="gb" size={40} color="red" />
                    <LanguageIcon language="af" size={40} color="red" />
                    <LanguageIcon language="ru" size={40} color="red" />
                    <LanguageIcon language="er" size={40} color="red" />
                  </>
                }
                footer={<InlineLink link="#" text={t("Homepage.helpUsCardCTA2")} color="red" type="span" />}
                withShadow
              >
                <Warning text={t("Homepage.helpUsCardHelp2")} color="red" />
                <p className={styles.help_text}>{t("Homepage.helpUsCardText2")}</p>
              </Card>
            </Link>
          </Col>

          <Col sm="12" lg="4" className="mb-lg-0 mb-5">
            <Link
              href="https://help.refugies.info/fr/article/commenter-une-fiche-rkuwpn/?bust=1670576881639"
              target="_blank"
              rel="noopener noreferrer"
              title={t("Homepage.helpUsCardTitle3")}
              className={styles.link}
            >
              <Card
                image={HelpUsIcon3}
                title={t("Homepage.helpUsCardTitle3")}
                footer={<InlineLink link="#" text={t("Homepage.helpUsCardCTA3")} color="orange" type="span" />}
                withShadow
              >
                <Warning text={t("Homepage.helpUsCardHelp3")} color="orange" />
                <p className={styles.help_text}>{t("Homepage.helpUsCardText3")}</p>
              </Card>
            </Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HelpUs;
