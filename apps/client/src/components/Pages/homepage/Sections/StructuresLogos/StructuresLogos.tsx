import type { StaticImageData } from "next/image";
import Image from "next/image";
import Coallia from "~/assets/homepage/structures-logos/Dispositif-Coallia.png";
import COS from "~/assets/homepage/structures-logos/Dispositif-COS.png";
import FederationActeurs from "~/assets/homepage/structures-logos/Dispositif-FAS.png";
import ForumRefugie from "~/assets/homepage/structures-logos/Dispositif-Forum-Refugie.png";
import FH from "~/assets/homepage/structures-logos/Dispositif-France-horizon.png";
import FranceTravail from "~/assets/homepage/structures-logos/Dispositif-France-Travail.png";
import FTDA from "~/assets/homepage/structures-logos/Dispositif-FTDA.png";
import SOS from "~/assets/homepage/structures-logos/Dispositif-Groupe-SOS.png";
import HIS from "~/assets/homepage/structures-logos/Dispositif-HIS.png";
import PierreValdo from "~/assets/homepage/structures-logos/Dispositif-Pierre-Valdo.png";

import { useTranslation } from "next-i18next";

const StructuresLogos = () => {
  const { t } = useTranslation();
  const logos: { image: StaticImageData; alt: string }[] = [
    {
      image: FTDA,
      alt: t("Homepage.StructuresLogosFtda", "Logo FTDA"),
    },
    {
      image: SOS,
      alt: t("Homepage.StructuresLogosSos", "Logo du Groupe SOS"),
    },
    {
      image: FranceTravail,
      alt: t("Homepage.StructuresLogosFrancetravail", "Logo France Travail"),
    },
    {
      image: COS,
      alt: t("Homepage.StructuresLogosCos", "Logo Fondation COS"),
    },
    {
      image: FH,
      alt: t("Homepage.StructuresLogosFh", "Logo France Horizon"),
    },
    {
      image: Coallia,
      alt: t("Homepage.StructuresLogosCoalia", "Logo Coallia"),
    },
    {
      image: PierreValdo,
      alt: t("Homepage.StructuresLogosPierrevaldo", "Logo Entraide Pierre Valdo"),
    },
    {
      image: HIS,
      alt: t("Homepage.StructuresLogosHis", "Logo GIP Habitat et Interventions Sociales"),
    },
    {
      image: ForumRefugie,
      alt: t("Homepage.StructuresLogosForumrefugie", "Logo Forum Réfugiés"),
    },
    {
      image: FederationActeurs,
      alt: t("Homepage.StructuresLogosFederationacteurs", "Logo Fédération des Acteurs de la Solidarité"),
    },
  ];

  return (
    <section className="flex flex-col items-center justify-center gap-4 px-4 py-10 md:px-32 xl:px-4">
      <div className="flex flex-wrap justify-center gap-x-10">
        {logos.map((logo) => (
          <Image key={logo.alt} src={logo.image} alt={logo.alt} width={72} height={72} />
        ))}
      </div>
      <p className="text-center text-lg">
        {t(
          "Homepage.StructuresLogosText",
          "Plus de 300 000 professionnels ont déjà adopté Réfugiés.info pour accompagner leurs bénéficiaires !",
        )}
      </p>
    </section>
  );
};

export default StructuresLogos;
