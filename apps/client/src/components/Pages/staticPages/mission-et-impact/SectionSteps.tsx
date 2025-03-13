import { useTranslation } from "next-i18next";
import StepIllu1 from "~/assets/staticPages/mission-et-impact/steps-illu-1.png";
import StepIllu2 from "~/assets/staticPages/mission-et-impact/steps-illu-2.png";
import StepIllu3 from "~/assets/staticPages/mission-et-impact/steps-illu-3.png";
import StepIllu4 from "~/assets/staticPages/mission-et-impact/steps-illu-4.png";
import StepIllu5 from "~/assets/staticPages/mission-et-impact/steps-illu-5.png";
import StepIllu6 from "~/assets/staticPages/mission-et-impact/steps-illu-6.png";
import StepIllu7 from "~/assets/staticPages/mission-et-impact/steps-illu-7.png";
import { Section, StepContent, Title2 } from "~/components/Pages/staticPages/common";

export const SectionSteps = () => {
  const { t } = useTranslation();
  return (
    <Section className="bg-alt-beige-gris-galet">
      <div className="container">
        <Title2>{t("MissionImpact.stepsTitle")}</Title2>
        <StepContent
          step={1}
          title={t("MissionImpact.steps_title_1")}
          texts={[t("MissionImpact.steps_text_1")]}
          badge={t("MissionImpact.steps_date_1")}
          image={StepIllu1}
          width={440}
        />
        <StepContent
          step={2}
          title={t("MissionImpact.steps_title_2")}
          texts={[t("MissionImpact.steps_text_2")]}
          badge={t("MissionImpact.steps_date_2")}
          image={StepIllu2}
          width={440}
        />
        <StepContent
          step={3}
          title={t("MissionImpact.steps_title_3")}
          texts={[t("MissionImpact.steps_text_3")]}
          badge={t("MissionImpact.steps_date_3")}
          image={StepIllu3}
          width={440}
        />
        <StepContent
          step={4}
          title={t("MissionImpact.steps_title_4")}
          texts={[t("MissionImpact.steps_text_4")]}
          badge={t("MissionImpact.steps_date_4")}
          image={StepIllu4}
          width={440}
        />
        <StepContent
          step={5}
          title={t("MissionImpact.steps_title_5")}
          texts={[t("MissionImpact.steps_text_5")]}
          badge={t("MissionImpact.steps_date_5")}
          image={StepIllu5}
          width={440}
        />
        <StepContent
          step={6}
          title={t("MissionImpact.steps_title_6")}
          texts={[t("MissionImpact.steps_text_6")]}
          badge={t("MissionImpact.steps_date_6")}
          image={StepIllu6}
          width={440}
        />
        <StepContent
          step={7}
          title={t("MissionImpact.steps_title_7")}
          texts={[
            t("MissionImpact.steps_text_7"),
            <ul key="list_7">
              <li>{t("MissionImpact.steps_text_7_item1")}</li>
              <li>{t("MissionImpact.steps_text_7_item2")}</li>
            </ul>,
          ]}
          badge={t("MissionImpact.steps_date_7")}
          image={StepIllu7}
          dottedLine
          width={440}
        />
      </div>
    </Section>
  );
};
