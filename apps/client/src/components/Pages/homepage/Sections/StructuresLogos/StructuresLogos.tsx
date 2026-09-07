import type { StaticImageData } from "next/image";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import COS from "~/assets/homepage/structures-logos/Dispositif-COS.png";
import Coallia from "~/assets/homepage/structures-logos/Dispositif-Coallia.png";
import FederationActeurs from "~/assets/homepage/structures-logos/Dispositif-FAS.png";
import ForumRefugie from "~/assets/homepage/structures-logos/Dispositif-Forum-Refugie.png";
import FH from "~/assets/homepage/structures-logos/Dispositif-France-horizon.png";
import FranceTravail from "~/assets/homepage/structures-logos/Dispositif-France-Travail.png";
import FTDA from "~/assets/homepage/structures-logos/Dispositif-FTDA.png";
import SOS from "~/assets/homepage/structures-logos/Dispositif-Groupe-SOS.png";
import HIS from "~/assets/homepage/structures-logos/Dispositif-HIS.png";
import PierreValdo from "~/assets/homepage/structures-logos/Dispositif-Pierre-Valdo.png";

const StructuresLogos = () => {
  const { t } = useTranslation();
  const logos: { image: StaticImageData; alt: string }[] = [
    {
      image: FTDA,
      alt: "France Terre d'Asile",
    },
    {
      image: SOS,
      alt: "Groupe SOS",
    },
    {
      image: FranceTravail,
      alt: "France Travail",
    },
    {
      image: COS,
      alt: "Fondation COS Alexandre Glasberg",
    },
    {
      image: FH,
      alt: "France Horizon",
    },
    {
      image: Coallia,
      alt: "Coallia",
    },
    {
      image: PierreValdo,
      alt: "Entraide Pierre Valdo",
    },
    {
      image: HIS,
      alt: "HIS - Habitat et Interventions Sociales",
    },
    {
      image: ForumRefugie,
      alt: "Forum Réfugiés",
    },
    {
      image: FederationActeurs,
      alt: "FAS - Fédération des acteurs de la solidarité",
    },
  ];

  return (
    <section className="flex flex-col items-center justify-center gap-4 px-4 py-10 md:px-32 xl:px-4">
      <div className="flex flex-wrap justify-center gap-x-10">
        {logos.map((logo, index) => (
          <Image key={index} src={logo.image} alt={logo.alt} width={72} height={72} />
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
