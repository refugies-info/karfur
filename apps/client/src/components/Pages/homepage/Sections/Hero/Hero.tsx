import Button from "@codegouvfr/react-dsfr/Button";
import { useTranslation } from "next-i18next";
import HeroBackground from "~/assets/homepage/hero/background-image.svg";
import Character from "~/assets/homepage/hero/character.svg";
import WhiteWave from "~/assets/homepage/hero/white-wave.svg";

import Image from "~/components/UI/Image";

interface Props {
  targetArrow: string;
}

const Hero = (props: Props) => {
  const { t } = useTranslation();

  return (
    <div className="relative flex flex-col-reverse md:min-h-[480px] 2xl:min-h-[600px]">
      <div className="relative z-10 m-auto inline-flex w-full flex-col items-center gap-10 bg-white/80 p-6 backdrop-blur-lg md:max-w-[30rem] lg:max-w-[42.5rem]">
        <h1 className="mb-0 text-center !text-[2.5rem] !leading-[3rem]">{t("Homepage.title")}</h1>
        <Button
          linkProps={{
            href: "/recherche",
          }}
        >
          {t("Homepage.searchButton", "Chercher une information")}
        </Button>
      </div>
      <div className="relative h-[50vh] w-full overflow-hidden md:absolute md:inset-0 md:z-0 md:h-auto">
        <Image
          src={HeroBackground}
          fill={true}
          className="-z-1 -translate-y-6 object-cover md:object-[0_80%]"
          alt={t(
            "Homepage.imageDescription",
            "Illustration colorée et minimaliste montrant une ville accueillante avec des bâtiments, des espaces verts et des activités communautaires. Des habitants interagissent avec des réfugiés, symbolisant l'entraide, l'intégration et les services d'accompagnement.",
          )}
        />
        <Image
          src={WhiteWave}
          width={100}
          height={121}
          className="object-fit absolute bottom-1/10 -left-1/3 w-full max-w-full scale-x-[2] scale-y-[6] md:bottom-0 md:left-0 md:scale-x-100 md:scale-y-100"
          alt=""
        />
        <Image
          src={Character}
          width={207}
          height={274}
          alt=""
          className="absolute bottom-0 left-1/2 z-10 -translate-x-1/2 translate-y-8 scale-65 md:left-0 md:-translate-x-4 md:translate-y-0 lg:translate-x-0 lg:scale-100 xl:left-1/16"
        />
      </div>
    </div>
  );
};

export default Hero;
