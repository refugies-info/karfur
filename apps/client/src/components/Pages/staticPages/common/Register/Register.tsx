import MobileRegisterImg from "@/assets/staticPages/publier/mobile-register.png";
import { ReceiveInvitationMailModal } from "@/components/Modals";
import { useAuth, useWindowSize } from "@/hooks";
import { cls } from "@/lib/classname";
import { setLoginRedirect, setRegisterInfos } from "@/lib/loginRedirect";
import { Event } from "@/lib/tracking";
import commonStyles from "@/scss/components/staticPages.module.scss";
import Button from "@codegouvfr/react-dsfr/Button";
import { RoleName } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
import { Container } from "reactstrap";
import { getPath } from "routes";
import styles from "./Register.module.scss";

interface Props {
  subtitleForm: string;
  subtitleLoggedIn: string;
  btnLoggedIn: string;
  onClickLoggedIn: () => void;
  subtitleMobile: string;
  associatedRole: RoleName.TRAD | RoleName.CONTRIB;
}

const Register = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { isTablet } = useWindowSize();
  const { isAuth } = useAuth();

  const [showInvitationEmailModal, setShowInvitationEmailModal] = useState(false);
  const toggleShowInvitationEmailModal = useCallback(() => {
    setShowInvitationEmailModal((o) => !o);
  }, []);

  const onRegister = () => {
    setLoginRedirect("#register");
    setRegisterInfos({ role: props.associatedRole });
    Event("AUTH", "start", props.associatedRole === RoleName.TRAD ? "translate_page" : "publish_page");
    router.push(getPath("/auth", "fr"));
  };

  const title = useMemo(
    () => <h2 className={cls(commonStyles.title2, "mb-0")}>{t("StaticPages.registerTitle")}</h2>,
    [t],
  );

  return (
    <Container className={cls(styles.register)}>
      {isTablet ? (
        <>
          <div className={styles.image}>
            <Image src={MobileRegisterImg} alt="Mockup of refugies.info" width={200} height={200} />
          </div>
          {title}
          <p className={cls(commonStyles.subtitle)}>{props.subtitleMobile}</p>
          <Button
            onClick={toggleShowInvitationEmailModal}
            iconId="fr-icon-mail-line"
            iconPosition="right"
            className={cls(styles.submit_btn, "mt-14")}
          >
            {t("StaticPages.registerMobileCTA")}
          </Button>

          <ReceiveInvitationMailModal
            toggle={toggleShowInvitationEmailModal}
            show={showInvitationEmailModal}
            togglePreviousModal={() => {}}
          />
        </>
      ) : (
        <>
          {title}
          <p className={cls(commonStyles.subtitle, "mb-14")}>{isAuth ? props.subtitleLoggedIn : props.subtitleForm}</p>
          {isAuth ? (
            <Button
              onClick={props.onClickLoggedIn}
              iconId="fr-icon-add-circle-line"
              iconPosition="right"
              className={styles.submit_btn}
            >
              {props.btnLoggedIn}
            </Button>
          ) : (
            <Button
              onClick={onRegister}
              iconId="fr-icon-arrow-right-line"
              iconPosition="right"
              className={styles.submit_btn}
            >
              {t("login_or_signup")}
            </Button>
          )}
        </>
      )}
    </Container>
  );
};

export default Register;
