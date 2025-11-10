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
  const logos: { image: StaticImageData; alt: string; title: string }[] = [
    {
      image: FTDA,
      title: "France Terre d'Asile",
      alt: "",
    },
    {
      image: SOS,
      title: "Groupe SOS",
      alt: "",
    },
    {
      image: FranceTravail,
      title: "France Travail",
      alt: "",
    },
    {
      image: COS,
      title: "Fondation COS",
      alt: "",
    },
    {
      image: FH,
      title: "France Horizon",
      alt: "",
    },
    {
      image: Coallia,
      title: "Coallia",
      alt: "",
    },
    {
      image: PierreValdo,
      title: "Entraide Pierre Valdo",
      alt: "",
    },
    {
      image: HIS,
      title: "GIP Habitat et Interventions Sociales",
      alt: "",
    },
    {
      image: ForumRefugie,
      title: "Forum Refugiés",
      alt: "",
    },
    {
      image: FederationActeurs,
      title: "Fédération des Acteurs de la Solidarité",
      alt: "",
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
      <p className="sr-only">
        {t("Homepage.StructuresLogosVocalisation", "Nos partenaires :")} {logos.map((logo) => logo.title).join(", ")}
      </p>
    </section>
  );
};

export default StructuresLogos;
