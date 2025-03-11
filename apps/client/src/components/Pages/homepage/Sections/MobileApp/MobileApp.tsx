import Button from "@codegouvfr/react-dsfr/Button";
import { AnnotationsOverlay } from "@refugies-info/ui";
import { androidStoreLink, iosStoreLink } from "data/storeLinks";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { isAndroid, isIOS } from "react-device-detect";
import { assetsOnServer } from "~/assets/assetsOnServer";
import application from "~/assets/homepage/application.png";
import Image from "~/components/UI/Image";
import { useWindowSize } from "~/hooks";
import { cn } from "~/lib/classname";
import { AvailableLanguageI18nCode } from "~/types/interface";
import MobileAppSmsForm from "./MobileAppSmsForm";

const MobileApp = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const locale: AvailableLanguageI18nCode = (router.locale || "fr") as AvailableLanguageI18nCode;

  const { isMobile } = useWindowSize();

  const appStoreBadge = assetsOnServer.storeBadges.appStore[locale] || assetsOnServer.storeBadges.appStore.en;
  const playStoreBadge = assetsOnServer.storeBadges.playStore[locale] || assetsOnServer.storeBadges.playStore.en;

  const storeLinks = useMemo(
    () => (
      <p className="mb-0 flex w-full max-w-lg justify-center gap-4 xl:justify-start xl:pl-4">
        <a href={iosStoreLink} rel="noopener noreferrer" target="_blank" className="relative h-10 w-30">
          <Image src={appStoreBadge} alt="Get it on App Store" fill />
        </a>
        <a href={androidStoreLink} rel="noopener noreferrer" target="_blank" className="relative h-10 w-32">
          <Image src={playStoreBadge} alt="Get it on Play Store" fill />
        </a>
      </p>
    ),
    [appStoreBadge, playStoreBadge],
  );

  const handleOpenStoreLink = (storelink: string) => {
    window.open(storelink, "_blank");
  };

  return (
    <section
      id="application"
      className="container flex flex-col gap-10 py-10 md:grid md:grid-cols-2 lg:py-20 2xl:gap-20"
    >
      <div className="flex h-full flex-col items-center justify-center gap-10">
        <AnnotationsOverlay
          className="block aspect-[712/580] w-full max-w-lg md:aspect-[933/760]"
          annotations={[
            { text: t("MobileApp.AnnotationsShare", "Partage"), className: "top-[4%] left-[66%]" },
            {
              text: t("MobileApp.AnnotationsLangchange", "Changement de langue"),
              className: "top-[25%] left-[72%] max-w-[5em]",
            },
            {
              text: isMobile
                ? t("MobileApp.AnnotationsEasyfrench", "Français facile")
                : t("MobileApp.AnnotationsLangsimple", "Langage clair"),
              className: "top-[53%] left-[79%] ",
            },
            {
              text: isMobile
                ? t("MobileApp.AnnotationsListen", "Écoute")
                : t("MobileApp.AnnotationsVocalize", "Vocalisation des contenus"),
              className: "bottom-[8%] left-[65%] ",
            },
          ]}
        >
          <Image
            src={application}
            fill
            className="object-contain"
            alt={t(
              "MobileApp.imageAlt",
              "Capture d’écran de l’interface d’une application mobile nommée 'Réfugiés.info'. L’application propose des fiches d’information sur divers sujets liés à l’intégration des réfugiés. L’image met en avant plusieurs fonctionnalités accessibles : un bouton de partage, une option de changement de langue représentée par un drapeau, un contenu écrit en langage clair et simplifié, ainsi qu’un bouton de vocalisation permettant d’écouter les textes. L’interface utilise des illustrations et une disposition épurée pour faciliter la compréhension et l’utilisation.",
            )}
          />
        </AnnotationsOverlay>
        {storeLinks}
      </div>
      <div className="">
        <div className="mb-6 flex items-center gap-6">
          <Image src="/images/logoRI.svg" width={72} height={72} alt={t("MobileApp.logoAlt", "Logo Réfugiés.info")} />
          <p className="m-0 flex flex-col gap-2 font-medium">
            <span aria-label={t("MobileApp.rankingLabel", "Note : 5 sur 5")} role="img" className="inline-flex gap-3">
              {Array.from({ length: 5 }).map((_, index) => (
                // TODO @ledjay : fix yellow colors from DSFR
                <i key={index} className="fr-icon-star-fill h-4 w-4 text-[#fcc63a]" />
              ))}
            </span>
            {t("MobileApp.rankingText", "Top 3 des applications publiques")}
          </p>
        </div>
        <h2>
          {t(
            isMobile ? "MobileApp.title.mobile" : "MobileApp.title.desktop",
            isMobile
              ? "Télécharge l’application !"
              : "Envoyez un lien de téléchargement de l’application à vos bénéficiaires !",
          )}
        </h2>
        <p className="mb-10">
          {t(
            isMobile ? "MobileApp.subtitleMobile" : "MobileApp.subtitleDesktop",
            isMobile
              ? "Gratuite, traduite en 7 langues, facile à utiliser... L’application Réfugiés.info vous aide à construire votre vie en France !"
              : "Gratuite, l’application a été conçue avec et pour les personnes réfugiées. Elles pourront y trouver de l’information simplifiée, traduite en 7 langues et écoutable.",
          )}
        </p>
        {isMobile ? (
          <span className="flex flex-col gap-4">
            <Button
              iconId={"ri-app-store-fill"}
              iconPosition="right"
              className={cn("justify-center max-md:w-full", isAndroid && "hidden")}
              onClick={() => handleOpenStoreLink(iosStoreLink)}
            >
              {t("MobileApp.downloadButtonText", "Télécharger l’application")}
            </Button>
            <Button
              iconId={"ri-android-fill"}
              iconPosition="right"
              className={cn("justify-center max-md:w-full", isIOS && "hidden")}
              onClick={() => handleOpenStoreLink(androidStoreLink)}
            >
              {t("MobileApp.downloadButtonText", "Télécharger l’application")}
            </Button>
          </span>
        ) : (
          <MobileAppSmsForm />
        )}
      </div>
    </section>
  );
};

export default MobileApp;
