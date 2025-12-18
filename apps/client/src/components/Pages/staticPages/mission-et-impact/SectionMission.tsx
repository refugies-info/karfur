import Image from "next/image";
import { useTranslation } from "next-i18next";
import AlainRegnier from "~/assets/staticPages/mission-et-impact/photo-alain-regnier.png";
import ScreenshotRI from "~/assets/staticPages/mission-et-impact/ri-screenshot.png";
import { Section, Title2 } from "~/components/Pages/staticPages/common";

export const SectionMission = () => {
  const { t } = useTranslation();
  return (
    <Section>
      <div className="container">
        <div className="flex flex-col gap-10 md:flex-row md:gap-20">
          <div className="flex-1">
            <Title2 smallMb className="!text-left">
              {t("MissionImpact.mission_title")}
            </Title2>
            <p className="!text-h4 md:!text-h3 text-artwork-minor-blue-france !mb-0">
              {t("MissionImpact.mission_subtitle")}
            </p>
            <Image
              src={ScreenshotRI}
              alt=""
              width={540}
              height={357}
              className="mx-auto mt-10 max-w-full md:mt-14"
            />
          </div>
          <div className="flex-1">
            <p
              className="!text-large"
              dangerouslySetInnerHTML={{
                __html: t("MissionImpact.mission_p1"),
              }}
            />
            <p className="!text-large">{t("MissionImpact.mission_p2")}</p>
            <p className="!text-large !mb-0">{t("MissionImpact.mission_p3")}</p>
            <div className="mt-10 flex items-center gap-6">
              <Image src={AlainRegnier} alt="Alain Regnier - Photo" width={120} height={120} />
              <p className="!text-large !mb-0">
                <strong className="block">Alain Régnier</strong>
                <span>{t("MissionImpact.mission_alain_position")}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};
