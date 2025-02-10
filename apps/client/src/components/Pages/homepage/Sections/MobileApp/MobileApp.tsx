import Button from "@codegouvfr/react-dsfr/Button";
import { androidStoreLink, iosStoreLink } from "data/storeLinks";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { isAndroid, isIOS } from "react-device-detect";
import { assetsOnServer } from "~/assets/assetsOnServer";
import applicationMobile from "~/assets/homepage/application-mobile.png";
import application from "~/assets/homepage/application.png";
import Image from "~/components/UI/Image";
import { useWindowSize } from "~/hooks";
import { cls } from "~/lib/classname";
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
    <section className="container flex flex-col gap-10 py-10 lg:grid lg:grid-cols-2 lg:py-20 2xl:gap-20">
      <div className="flex h-full flex-col items-center justify-center gap-10">
        <span className="relative block aspect-[712/580] w-full max-w-lg md:aspect-[933/760]">
          <Image
            src={isMobile ? applicationMobile : application}
            fill
            className="object-contain"
            alt={t(
              "MobileApp.imageAlt",
              "Capture d’écran de l’interface d’une application mobile nommée 'Réfugiés.info'. L’application propose des fiches d’information sur divers sujets liés à l’intégration des réfugiés. L’image met en avant plusieurs fonctionnalités accessibles : un bouton de partage, une option de changement de langue représentée par un drapeau, un contenu écrit en langage clair et simplifié, ainsi qu’un bouton de vocalisation permettant d’écouter les textes. L’interface utilise des illustrations et une disposition épurée pour faciliter la compréhension et l’utilisation.",
            )}
          />
        </span>
        {storeLinks}
      </div>
      <div className="">
        <div className="mb-6 flex items-center gap-6">
          <Image src="/images/logoRI.svg" width={72} height={72} alt={t("MobileApp.logoAlt", "Logo Réfugiés.info")} />
          <p className="m-0 flex flex-col gap-2 font-medium">
            <span aria-label={t("MobileApp.rankingLabel", "Note : 5 sur 5")} role="img" className="inline-flex gap-3">
              <i className="fr-icon-star-fill text-theme-famille-clair h-4 w-4" />
              <i className="fr-icon-star-fill text-theme-famille-clair h-4 w-4" />
              <i className="fr-icon-star-fill text-theme-famille-clair h-4 w-4" />
              <i className="fr-icon-star-fill text-theme-famille-clair h-4 w-4" />
              <i className="fr-icon-star-fill text-theme-famille-clair h-4 w-4" />
            </span>
            {t("MobileApp.rankingText", "Top 3 des applications publiques")}
          </p>
        </div>
        <h2>{t("MobileApp.title", "Envoyez un lien de téléchargement de l’application à vos bénéficiaires !")}</h2>
        <p
          className="mb-10"
          dangerouslySetInnerHTML={{
            __html: t(
              "MobileApp.subtitle",
              "Gratuite, l’application a été conçue <em>avec</em> et <em>pour</em> les personnes réfugiées. Elles pourront y trouver de l’information simplifiée, traduite en 7 langues et écoutable.",
            ),
          }}
        />
        {isMobile ? (
          <span className="flex flex-col gap-4">
            <Button
              iconId={"ri-app-store-fill"}
              iconPosition="right"
              className={cls("justify-center max-md:w-full", isAndroid && "hidden")}
              onClick={() => handleOpenStoreLink(iosStoreLink)}
            >
              {t("MobileApp.downloadButtonText", "Je télécharge l’application")}
            </Button>
            <Button
              iconId={"ri-android-fill"}
              iconPosition="right"
              className={cls("justify-center max-md:w-full", isIOS && "hidden")}
              onClick={() => handleOpenStoreLink(androidStoreLink)}
            >
              {t("MobileApp.downloadButtonText", "Je télécharge l’application")}
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
