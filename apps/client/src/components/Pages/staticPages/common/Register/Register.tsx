import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { RoleName, type SubscriptionRequest } from "@refugies-info/api-types";
import { useWindowSize } from "@refugies-info/ui";
import { useRouter } from "next/router";
import { useState } from "react";
import { getPath } from "routes";
import DesktopRegisterImg from "~/assets/staticPages/publier/desktop-register.svg";
import MobileRegisterImg from "~/assets/staticPages/publier/mobile-register.png";
import { Title2 } from "~/components/Pages/staticPages/common/Title2";
import Image from "~/components/UI/Image";
import { useAuth } from "~/hooks";
import { handleApiError } from "~/lib/handleApiErrors";
import { setLoginRedirect, setRegisterInfos } from "~/lib/loginRedirect";
import { Event } from "~/lib/tracking";
import API from "~/utils/API";

interface Props {
  subtitleForm: string;
  subtitleLoggedIn: string;
  btnLoggedIn: string;
  onClickLoggedIn?: () => void;
  /** When the action is a plain navigation it must be a link, not a button (RGAA 7.1). */
  hrefLoggedIn?: string;
  subtitleMobile: string;
  associatedRole: RoleName.TRAD | RoleName.CONTRIB;
}

const Register = (props: Props) => {
  const router = useRouter();
  const { isTablet } = useWindowSize();
  const { isAuth } = useAuth();

  const onRegister = () => {
    setLoginRedirect("#register");
    setRegisterInfos({ role: props.associatedRole });
    Event(
      "AUTH",
      "start",
      props.associatedRole === RoleName.TRAD ? "translate_page" : "publish_page",
    );
    router.push(getPath("/auth", "fr"));
  };

  const [showReceiveMailForm, setShowReceiveMailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [notEmailError, setNotEmailError] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const onSendEmail = (e: any) => {
    e.preventDefault();
    if (email === "") return;
    const regex = /^\S+@\S+\.\S+$/;
    const isEmail = !!email.match(regex);
    if (isEmail) {
      const body: SubscriptionRequest = { email };
      API.sendSubscriptionReminderMail(body)
        .then(() => setEmailSent(true))
        .catch(() => handleApiError({ text: "Erreur lors de l'envoi" }));
    } else {
      setNotEmailError(true);
    }
  };

  return (
    <div className="mx-auto max-w-[480px] text-center">
      {isTablet ? (
        <>
          <Image
            src={MobileRegisterImg}
            alt="Mockup of refugies.info"
            width={195}
            height={154}
            className="mx-auto mb-10"
          />
          <Title2 smallMb>Rendez-vous sur votre ordinateur !</Title2>
          <p className="text-chapo mb-6">{props.subtitleMobile}</p>
          {!showReceiveMailForm ? (
            <Button
              onClick={() => setShowReceiveMailForm(true)}
              iconId="fr-icon-mail-line"
              iconPosition="right"
              className="w-full justify-center"
              size="large"
            >
              Recevoir un mail
            </Button>
          ) : (
            <div className="text-left">
              <form onSubmit={onSendEmail}>
                <Input
                  id="email"
                  label="Votre email"
                  state={notEmailError ? "error" : "default"}
                  stateRelatedMessage="Ceci n'est pas un email, vérifiez l'orthographe."
                  nativeInputProps={{
                    name: "email",
                    value: email,
                    readOnly: emailSent,
                    onChange: (e: any) => setEmail(e.target.value),
                  }}
                />
                <Button
                  type="submit"
                  iconId={emailSent ? "fr-icon-check-line" : "fr-icon-send-plane-fill"}
                  iconPosition="right"
                  disabled={emailSent}
                  className="w-full justify-center"
                  size="large"
                >
                  {emailSent ? "Lien envoyé !" : "Envoyer le lien"}
                </Button>
              </form>
            </div>
          )}
        </>
      ) : (
        <>
          <Image
            src={DesktopRegisterImg}
            alt=""
            width={175}
            height={160}
            className="mx-auto mb-10"
          />
          <Title2 smallMb>C’est parti !</Title2>
          <p className="text-chapo mb-6">{isAuth ? props.subtitleLoggedIn : props.subtitleForm}</p>
          {isAuth ? (
            <Button
              {...(props.hrefLoggedIn
                ? { linkProps: { href: props.hrefLoggedIn } }
                : { onClick: props.onClickLoggedIn })}
              iconId="fr-icon-add-circle-line"
              iconPosition="right"
            >
              {props.btnLoggedIn}
            </Button>
          ) : (
            <Button
              onClick={onRegister}
              iconId="fr-icon-account-pin-circle-line"
              iconPosition="right"
            >
              Me connecter ou m'inscrire
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default Register;
