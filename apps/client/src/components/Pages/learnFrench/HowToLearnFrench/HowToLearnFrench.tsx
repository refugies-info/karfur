import type { StaticImageData } from "next/image";
import { useTranslation } from "next-i18next";
import { Section } from "~/components/Pages/staticPages/common/Section";
import { Title2 } from "~/components/Pages/staticPages/common/Title2";
import { HowToCard } from "./HowToCard";

export interface HowToLearnFrenchCard {
  icon: StaticImageData;
  title: string;
  description: string;
  href: string;
  tagKey: string;
}

interface Props {
  cards: HowToLearnFrenchCard[];
}

export const HowToLearnFrench = (props: Props) => {
  const { t } = useTranslation();

  return (
    <Section>
      <div className="container">
        <Title2 smallMb className="!text-left">
          {t("LearnFrench.howTo_title")}
        </Title2>
        <p className="!text-large mb-10">{t("LearnFrench.howTo_subtitle")}</p>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-8">
          {props.cards.map((card) => (
            <HowToCard
              key={card.href}
              icon={card.icon}
              tagKey={card.tagKey}
              title={card.title}
              description={card.description}
              href={card.href}
            />
          ))}
        </div>
      </div>
    </Section>
  );
};
