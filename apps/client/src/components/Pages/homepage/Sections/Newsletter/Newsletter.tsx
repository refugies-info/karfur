import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { useWindowSize } from "@refugies-info/ui";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import NewsletterIllu from "~/assets/homepage/newsletter-illu.svg";
import Image from "~/components/UI/Image";
import { cls } from "~/lib/classname";
import API from "~/utils/API";

const Newsletter = () => {
  const { t } = useTranslation();
  const { isMobile } = useWindowSize();

  const [email, setEmail] = useState("");
  const [newsletterFormState, setNewsletterFormState] = useState<"default" | "success" | "error">(
    "default",
  );
  const [newsletterError, setNewsletterError] = useState("");

  const sendMail = (e: any) => {
    setNewsletterFormState("default");
    setNewsletterError("");

    e.preventDefault();
    const regex = /^\S+@\S+\.\S+$/;
    const isEmail = !!email.match(regex);

    if (!isEmail) {
      setNewsletterFormState("error");
      setNewsletterError(
        t("NewsletterForm.errorsEmailnotvalid", "Ceci n'est pas un email, vérifiez l'orthographe."),
      );
      return;
    }

    API.contacts({ email })
      .then((res) => {
        setNewsletterFormState("success");
        setNewsletterError("");
      })
      .catch((e) => {
        setNewsletterFormState("error");
        if (e.response?.data?.code === "CONTACT_ALREADY_EXIST")
          setNewsletterError(
            t(
              "NewsletterForm.errorsAlreadyexists",
              "Cette adresse mail est déjà inscrite à la newsletter Réfugiés.info !",
            ),
          );
        else setNewsletterError(t("NewsletterForm.errorsSystemerror", "Une erreur s'est produite"));
      });
  };

  if (isMobile) return null;

  return (
    <section className="bg-alt-blue-france w-full py-20" id="newsletter">
      <div className="container grid grid-cols-2 items-center gap-10">
        <Image src={NewsletterIllu} alt="" width={433} height={320} className="m-auto max-w-full" />

        <div className="stacked relative grid h-full grid-cols-1 grid-rows-1 items-center">
          {newsletterFormState === "success" && (
            <Alert
              closable
              onClose={() => setNewsletterFormState("default")}
              severity="success"
              description={
                <span
                  dangerouslySetInnerHTML={{
                    __html: t("NewsletterForm.confirmMessageText", {
                      defaultValue: "Mail correctement enregistré !",
                      email: email,
                    }),
                  }}
                ></span>
              }
              title={t("NewsletterForm.confirmMessageTitle", "Yay...")}
              className={cls("z-20 col-start-1 row-start-1 w-full bg-white transition")}
            />
          )}
          <form
            onSubmit={sendMail}
            className={cls(
              "col-start-1 row-start-1 overflow-y-clip transition-all duration-200 ease-in",
              newsletterFormState === "success"
                ? "z-10 max-h-0 opacity-0"
                : "max-h-full opacity-100 transition-all",
            )}
          >
            <h2>
              {t("NewsletterForm.title", "Inscrivez-vous à notre lettre d’information mensuelle !")}
            </h2>
            <p>{t("NewsletterForm.description", "Suivez l'évolution du service Réfugiés.info")}</p>

            <Input
              nativeInputProps={{
                type: "email",
                value: email,
                name: "email",
                onChange: (e: any) => setEmail(e.target.value),
                id: "newsletter-email",
              }}
              addon={
                <Button
                  iconId="fr-icon-send-plane-fill"
                  type="submit"
                  iconPosition="right"
                  className="whitespace-nowrap"
                >
                  {t("NewsletterForm.ok", "S'inscrire")}
                </Button>
              }
              label={t("NewsletterForm.label", "Adresse email (requise)")}
              state={newsletterFormState}
              stateRelatedMessage={newsletterError}
            />
          </form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
