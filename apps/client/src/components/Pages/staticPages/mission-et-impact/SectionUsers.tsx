import Badge from "@codegouvfr/react-dsfr/Badge";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import UsersGraph1 from "~/assets/staticPages/mission-et-impact/users-graph-1.png";
import UsersGraph2 from "~/assets/staticPages/mission-et-impact/users-graph-2.svg";
import { Section, Title2 } from "~/components/Pages/staticPages/common";

export const SectionUsers = () => {
  const { t } = useTranslation();
  return (
    <Section>
      <div className="fr-container">
        <Title2>{t("MissionImpact.users_title")}</Title2>
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 lg:px-30 mn-10 lg:mb-20">
          <div className="flex-1">
            <h3>{t("MissionImpact.users_subtitle_1")}</h3>
            <p className="text-large">{t("MissionImpact.users_text_1")}</p>
            <p className="text-large">{t("MissionImpact.users_testimony_1")}</p>
            <div className="space-x-2">
              <Badge small severity="info" noIcon>
                {t("MissionImpact.users_badges1_badge1")}
              </Badge>
              <Badge small severity="info" noIcon>
                {t("MissionImpact.users_badges1_badge2")}
              </Badge>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-8 justify-center">
            <Image
              src={UsersGraph1}
              alt={t("MissionImpact.users_legend_1")}
              className="mx-auto lg:mx-5"
              width={416}
              height={271}
            />
            <p className="text-small text-center text-gray italic">{t("MissionImpact.users_legend_1")}</p>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 lg:px-30 mn-10 lg:mb-20">
          <div className="flex-1">
            <h3>{t("MissionImpact.users_subtitle_2")}</h3>
            <p className="text-large">{t("MissionImpact.users_text_2")}</p>
            <p className="text-large">{t("MissionImpact.users_testimony_2")}</p>
            <div className="space-x-2">
              <Badge small severity="info" noIcon>
                {t("MissionImpact.users_badges2_badge")}
              </Badge>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-8 justify-center">
            <Image
              src={UsersGraph2}
              alt={t("MissionImpact.users_legend_2")}
              className="mx-auto lg:mx-10"
              width={376}
              height={191}
            />
            <p className="text-small text-center text-gray italic">{t("MissionImpact.users_legend_2")}</p>
          </div>
        </div>
      </div>
    </Section>
  );
};
