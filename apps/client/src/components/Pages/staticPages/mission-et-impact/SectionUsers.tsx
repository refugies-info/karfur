import Badge from "@codegouvfr/react-dsfr/Badge";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import UsersGraph1 from "~/assets/staticPages/mission-et-impact/users-graph-1.png";
import UsersGraph2 from "~/assets/staticPages/mission-et-impact/users-graph-2.svg";
import { Section, Title2 } from "~/components/Pages/staticPages/common";

export const SectionUsers = () => {
  const { t } = useTranslation();
  return (
    <Section>
      <div className="container">
        <Title2>{t("MissionImpact.users_title")}</Title2>
        <div className="mn-10 flex flex-col gap-10 lg:mb-20 lg:flex-row lg:gap-20 lg:px-30">
          <div className="flex-1">
            <h3>{t("MissionImpact.users_subtitle_1")}</h3>
            <p
              className="text-large"
              dangerouslySetInnerHTML={{
                __html: t("MissionImpact.users_text_1"),
              }}
            ></p>
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
          <div className="flex flex-1 flex-col justify-center gap-8">
            <figure>
              <Image
                src={UsersGraph1}
                alt=""
                className="mx-auto lg:mx-5"
                width={416}
                height={271}
                aria-labelledby="users_legend_1"
              />
              <figcaption
                aria-hidden="true"
                id="users_legend_1"
                className="text-small text-mention-grey text-center italic"
              >
                {t("MissionImpact.users_legend_1")}
              </figcaption>
            </figure>
          </div>
        </div>
        <div className="mn-10 flex flex-col gap-10 lg:mb-20 lg:flex-row lg:gap-20 lg:px-30">
          <div className="flex-1">
            <h3>{t("MissionImpact.users_subtitle_2")}</h3>
            <p
              className="text-large"
              dangerouslySetInnerHTML={{
                __html: t("MissionImpact.users_text_2"),
              }}
            ></p>
            <p className="text-large">{t("MissionImpact.users_testimony_2")}</p>
            <div className="space-x-2">
              <Badge small severity="info" noIcon>
                {t("MissionImpact.users_badges2_badge")}
              </Badge>
            </div>
          </div>
          <div className="flex flex-1 flex-col justify-center gap-8">
            <figure>
              <Image
                src={UsersGraph2}
                alt=""
                aria-labelledby="users_legend_2"
                className="mx-auto lg:mx-10"
                width={376}
                height={191}
              />
              <figcaption
                aria-hidden="true"
                id="users_legend_2"
                className="text-small text-mention-grey text-center italic"
              >
                {t("MissionImpact.users_legend_2")}
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </Section>
  );
};
