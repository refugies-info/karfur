import { useTranslation } from "next-i18next";
import { Section, Title2 } from "~/components/Pages/staticPages/common";
import { TeamCard } from "~/components/Pages/staticPages/mission-et-impact/TeamCard";
import { useTeamData } from "~/data/useTeamData";

export const SectionTeam = () => {
  const { t } = useTranslation();
  const teamData = useTeamData();

  return (
    <Section>
      <div className="container mx-auto">
        <Title2>{t("MissionImpact.team_title")}</Title2>
        <div className="grid grid-cols-1 justify-center gap-4 md:grid-cols-2 lg:gap-10 xl:px-20">
          {teamData.map((team) => (
            <TeamCard key={team.name} {...team} />
          ))}
        </div>
      </div>
    </Section>
  );
};
