import { useTranslation } from "next-i18next";
import { Section, Title2 } from "~/components/Pages/staticPages/common";
import { TeamCard } from "~/components/Pages/staticPages/mission-et-impact/TeamCard";
import { useTeamData } from "~/data/useTeamData";

export const SectionTeam = () => {
  const { t } = useTranslation();
  const teamData = useTeamData();

  return (
    <Section>
      <div className="container">
        <Title2>{t("MissionImpact.team_title")}</Title2>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-10 sm:px-20">
          {teamData.map((team) => (
            <TeamCard key={team.name} {...team} />
          ))}
        </div>
      </div>
    </Section>
  );
};
