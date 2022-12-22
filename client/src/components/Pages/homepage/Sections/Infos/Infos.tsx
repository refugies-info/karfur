import React, { useState } from "react";
import { Container, Row, Col } from "reactstrap";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import Swal from "sweetalert2";
import { cls } from "lib/classname";
import API from "utils/API";
import FButton from "components/UI/FButton";
import Input from "components/UI/Input";
import { InlineLink } from "components/Pages/staticPages/common";
import NewsletterIllu from "assets/homepage/newsletter-illu.svg";
import FormationPhoto from "assets/homepage/photo-formation.jpg";
import commonStyles from "scss/components/staticPages.module.scss";
import styles from "./Infos.module.scss";

const Infos = () => {
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [newsletterError, setNewsletterError] = useState("");

  const sendMail = (e: any) => {
    setNewsletterError("");
    e.preventDefault();
    const regex = /^\S+@\S+\.\S+$/;
    const isEmail = !!email.match(regex);
    if (isEmail) {
      API.set_mail({ mail: email })
        .then(() => {
          Swal.fire({
            title: "Yay...",
            text: "Mail correctement enregistré !",
            type: "success",
            timer: 1500
          });
          setEmail("");
        })
        .catch((e) => {
          if (e.response?.data?.code === "CONTACT_ALREADY_EXIST")
            setNewsletterError(t("Footer.newsletter_contact_already_exist"));
          else setNewsletterError("Une erreur s'est produite");
        });
    } else {
      setNewsletterError(t("Register.Ceci n'est pas un email,") + " " + t("Register.vérifiez l'orthographe"));
    }
  };

  return (
    <div className={cls(commonStyles.section, styles.infos, "pb-0")}>
      <Container fluid className={cls(commonStyles.container, "text-center")}>
        <Row>
          <Col sm="12" lg="6" className={commonStyles.bg_blue}>
            <div className={styles.infos_col}>
              <Image src={NewsletterIllu} alt="" width={416} className={styles.img} />
              <h2 className={cls(commonStyles.title2, commonStyles.top_space, "mb-0 text-center text-white")}>
                {t("Homepage.newsletterTitle")}
              </h2>
              <p className={commonStyles.subtitle}>{t("Homepage.newsletterSubtitle")}</p>
              <div className={styles.action}>
                <div className={styles.newsletter}>
                  <Input
                    type="email"
                    placeholder={t("Register.Votre email")}
                    icon="email-outline"
                    className={styles.newsletter_input}
                    value={email}
                    onChange={(e: any) => setEmail(e.target.value)}
                    error={newsletterError}
                  />
                  <FButton
                    type="validate"
                    className={styles.newsletter_submit}
                    name="checkmark-outline"
                    disabled={!email}
                    onClick={sendMail}
                  >
                    Envoyer
                  </FButton>
                </div>
              </div>
            </div>
          </Col>
          <Col sm="12" lg="6" className={commonStyles.bg_grey}>
            <div className={styles.infos_col}>
              <Image src={FormationPhoto} alt="" width={416} className={styles.img} />
              <h2 className={cls(commonStyles.title2, commonStyles.top_space, "mb-0 text-center")}>
                {t("Homepage.trainingTitle")}
              </h2>
              <p className={commonStyles.subtitle}>{t("Homepage.trainingSubtitle")}</p>
              <div className={styles.action}>
                <InlineLink text={t("Homepage.trainingCTA")} link="https://kit.refugies.info/formation/" color="blue" />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Infos;
