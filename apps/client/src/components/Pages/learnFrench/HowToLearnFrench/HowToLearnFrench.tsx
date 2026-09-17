import { useTranslation } from "next-i18next";
import Card from "~/components/Pages/staticPages/common/Card";
import { RowCards } from "~/components/Pages/staticPages/common/RowCards";
import { Section } from "~/components/Pages/staticPages/common/Section";
import { Title2 } from "~/components/Pages/staticPages/common/Title2";

export interface HowToLearnFrenchCard {
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
        <RowCards>
          {props.cards.map((card) => (
            <Card key={card.href} title={card.title} link={card.href} newTab={false}>
              <p className="text-title-blue-france !mb-2 text-sm font-bold uppercase">
                {t(card.tagKey, card.tagKey)}
              </p>
              <p className="mb-0">{card.description}</p>
            </Card>
          ))}
        </RowCards>
      </div>
    </Section>
  );
};
