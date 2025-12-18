import Button from "@codegouvfr/react-dsfr/Button";
import { useWindowSize } from "@refugies-info/ui";
import { useTranslation } from "next-i18next";
import { isIOS } from "react-device-detect";
import HeroBackground from "~/assets/homepage/hero/background-image.svg";
import Character from "~/assets/homepage/hero/character.svg";
import WhiteWave from "~/components/Pages/homepage/Sections/Hero/WhiteWave";
import Image from "~/components/UI/Image";

interface Props {
  targetArrow: string;
}

const Hero = (props: Props) => {
  const { t } = useTranslation();
  const { isMobile } = useWindowSize();
  const mobileButtonIcon = isIOS ? "ri-app-store-line" : "ri-android-line";
  const buttonIconName = isMobile ? mobileButtonIcon : "fr-icon-smartphone-line";

  return (
    <div className="relative flex flex-col-reverse md:min-h-[504px] 2xl:min-h-[700px]">
      <div className="md:border-default-grey relative z-10 m-auto inline-flex w-full flex-col items-center gap-8 bg-white/80 px-10 pt-2 pb-10 backdrop-blur-lg max-sm:px-4 md:max-w-[68vw] md:border md:py-10 lg:max-w-[40rem] xl:max-w-[48rem]">
        <h1
          className="-mb-2 text-center !text-[2.5rem] !leading-[3rem] max-sm:!text-[2rem] max-sm:!leading-[2.5rem]"
          dangerouslySetInnerHTML={{
            __html: t(
              isMobile ? "Homepage.titleMobile" : "Homepage.titleDesktop",
              isMobile
                ? "L'information <br/> pour les personnes réfugiées en France"
                : "Le service public d’information pour les personnes réfugiées",
            ),
          }}
        />

        {isMobile ? (
          <p className="mb-0 text-center text-lg">
            {t(
              "Homepage.subtitleMobile",
              "Des informations claires et traduites pour les personnes réfugiées en France",
            )}
          </p>
        ) : (
          <p className="mb-0 flex flex-col items-center text-xl">
            <span>{t("Homepage.subtitle1", "Des ressources claires et traduites")}</span>
            <span>
              {t("Homepage.subtitle2", "pour accompagner les personnes réfugiées en France")}
            </span>
          </p>
        )}

        <div className="flex w-full items-center justify-center gap-4 max-lg:flex-col">
          <Button
            linkProps={{
              href: "/recherche",
            }}
            iconId="fr-icon-search-line"
            iconPosition="right"
            className="justify-center max-lg:w-full"
          >
            {t("Homepage.searchButton", "Chercher une information")}
          </Button>
          <Button
            linkProps={{
              href: "#application",
            }}
            priority="secondary"
            iconId={buttonIconName}
            iconPosition="right"
            className="justify-center max-lg:w-full"
          >
            {t("Homepage.donwloadAppButton", "Télécharger l'application")}
          </Button>
        </div>
      </div>
      <div className="relative h-[11.2rem] w-full overflow-hidden md:absolute! md:inset-0 md:z-0 md:min-h-[504px] 2xl:min-h-[700px]">
        <span className="absolute inset-0 z-0 h-full w-full shadow-[inset_0px_-4.167px_20.833px_0px_rgba(0,0,0,0.10)]"></span>
        <Image
          src={HeroBackground}
          width={1920}
          height={1120}
          priority={true}
          className="-z-1 -translate-y-6 object-cover max-sm:-translate-x-4 max-sm:-translate-y-16 max-sm:scale-[1.4] md:h-full md:w-full md:object-[50%_80%] 2xl:object-[50%_90%]"
          alt=""
        />
        {/* White wave */}
        <WhiteWave className="absolute bottom-0 -left-1/3 w-full max-w-full origin-[50%_68%] scale-x-[2] scale-y-[6] md:bottom-0 md:left-0 md:origin-bottom md:scale-x-100 md:scale-y-100 2xl:scale-y-60" />

        {/* Characters */}
        <Image
          src={Character}
          width={207}
          height={274}
          priority={true}
          alt=""
          className="absolute bottom-0 left-4 z-10 max-w-[8rem] max-md:left-1/2 max-md:-translate-x-1/2 max-sm:left-1/2 xl:left-[2%] xl:max-w-[14rem] 2xl:left-[10%]"
        />
      </div>
    </div>
  );
};

export default Hero;
