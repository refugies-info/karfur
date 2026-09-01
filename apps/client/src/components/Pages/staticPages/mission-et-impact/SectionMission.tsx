import Image from "next/image";
import { useTranslation } from "next-i18next";
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
            {/* Levée de fait du 9.4 prescrit ici : la citation a disparu du contenu le 25/06
                (commit 4efd162f5), voir docs/notes-tickets/rga-13.md. */}
            <p className="!text-large">{t("MissionImpact.mission_p1")}</p>
            <p className="!text-large">{t("MissionImpact.mission_p2")}</p>
            <p className="!text-large !mb-0">{t("MissionImpact.mission_p3")}</p>
          </div>
        </div>
      </div>
    </Section>
  );
};
