import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import HeroBack from "~/assets/staticPages/mission-et-impact/hero-back.svg";
import HeroMobile from "~/assets/staticPages/mission-et-impact/hero-illu-mobile.svg";
import { Section } from "~/components/Pages/staticPages/common";
import SEO from "~/components/Seo";
import { defaultStaticProps } from "~/lib/getDefaultStaticProps";

const MissionImpact: NextPage = () => {
  const { t } = useTranslation();
  return (
    <div className="w-full">
      <SEO title="Qui sommes nous ?" />

      <Section
        className="bg-light-low-blue-france px-4 md:min-h-[520px] bg-contain bg-no-repeat bg-bottom max-lg:!bg-none"
        style={{
          backgroundImage: `url(${HeroBack.src})`,
        }}
      >
        <div className="md:max-w-[720px] lg:max-w-[600px] xl:max-w-[720px] mx-auto">
          <h1 className="!text-h1 md:!text-alt-title mb-6">{t("MissionImpact.title")}</h1>
          <p className="!text-chapo !mb-0">{t("MissionImpact.subtitle")}</p>
        </div>
        <Image src={HeroMobile} alt="" width={343} className="lg:hidden mt-10 mx-auto max-w-full" />
      </Section>
    </div>
  );
};

export const getStaticProps = defaultStaticProps;

export default MissionImpact;
