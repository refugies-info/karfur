import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useState } from "react";
import { Col, Container, Row } from "reactstrap";
import Swal from "sweetalert2";
import NewsletterIllu from "~/assets/homepage/newsletter-illu.svg";
import FormationPhoto from "~/assets/homepage/photo-formation.jpg";
import { InlineLink } from "~/components/Pages/staticPages/common";
import FButton from "~/components/UI/FButton";
import Input from "~/components/UI/Input";
import { cls } from "~/lib/classname";
import commonStyles from "~/scss/components/staticPages.module.scss";
import API from "~/utils/API";
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
      API.contacts({ email })
        .then(() => {
          Swal.fire({
            title: "Yay...",
            text: "Mail correctement enregistré !",
            icon: "success",
            timer: 1500,
          });
          setEmail("");
        })
        .catch((e) => {
          if (e.response?.data?.code === "CONTACT_ALREADY_EXIST")
            setNewsletterError(t("Footer.newsletter_contact_already_exist"));
          else setNewsletterError("Une erreur s'est produite");
        });
    } else {
      setNewsletterError(t("Register.not_an_email") + " " + t("Register.check_mail"));
    }
  };

  return (
    <div className={cls(commonStyles.section, styles.infos, "py-0")}>
      <Container fluid className={cls(commonStyles.container, "text-center")}>
        <Row>
          <Col sm="12" lg="6" className={commonStyles.bg_blue}>
            <div className={styles.infos_col}>
              <Image src={NewsletterIllu} alt="" width={246} height={160} className={styles.img} />
              <h2 className={cls(styles.title2, "text-white")}>{t("Homepage.newsletterTitle")}</h2>
              <p className={styles.subtitle}>{t("Homepage.newsletterSubtitle")}</p>
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
                    {t("Envoyer", "Envoyer")}
                  </FButton>
                </div>
              </div>
            </div>
          </Col>
          <Col sm="12" lg="6" className={commonStyles.bg_grey}>
            <div className={styles.infos_col}>
              <Image src={FormationPhoto} alt="" width={246} height={160} className={styles.img} />
              <h2 className={cls(styles.title2)}>{t("Homepage.trainingTitle")}</h2>
              <p className={styles.subtitle}>{t("Homepage.trainingSubtitle")}</p>
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
