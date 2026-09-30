import type { StaticImageData } from "next/image";
import { useTranslation } from "next-i18next";
import { useCallback, useEffect, useRef, useState } from "react";
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

const CARDS_GAP_PX = 24;

const CAROUSEL_BUTTON_CLASSNAME =
  "border-action-high-blue-france text-title-blue-france flex h-11 w-11 items-center justify-center border bg-white disabled:border-default-grey disabled:text-mention-grey";

export const HowToLearnFrench = (props: Props) => {
  const { t } = useTranslation();
  const listRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    const scrolled = Math.abs(list.scrollLeft);
    setCanScrollPrev(scrolled > 1);
    setCanScrollNext(scrolled + list.clientWidth < list.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    updateScrollState();
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(list);
    return () => observer.disconnect();
  }, [updateScrollState]);

  const scrollByCard = (direction: 1 | -1) => {
    const list = listRef.current;
    const firstCard = list?.firstElementChild;
    if (!list || !firstCard) return;
    const isRtl = getComputedStyle(list).direction === "rtl";
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.scrollBy({
      left: direction * (isRtl ? -1 : 1) * (firstCard.getBoundingClientRect().width + CARDS_GAP_PX),
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <Section>
      <div className="container">
        <Title2 smallMb className="!text-left">
          {t("LearnFrench.howTo_title")}
        </Title2>
        <p className="!text-large mb-10">{t("LearnFrench.howTo_subtitle")}</p>
        <div
          ref={listRef}
          onScroll={updateScrollState}
          className="flex snap-x snap-mandatory items-stretch gap-6 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:snap-none lg:gap-8 lg:overflow-visible lg:pb-0"
        >
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
        <div className="mt-6 flex justify-end gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={!canScrollPrev}
            title={t("LearnFrench.howTo_prev", "Démarche précédente")}
            aria-label={t("LearnFrench.howTo_prev", "Démarche précédente")}
            className={CAROUSEL_BUTTON_CLASSNAME}
          >
            <i className="fr-icon-arrow-left-line rtl:rotate-180" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={!canScrollNext}
            title={t("LearnFrench.howTo_next", "Démarche suivante")}
            aria-label={t("LearnFrench.howTo_next", "Démarche suivante")}
            className={CAROUSEL_BUTTON_CLASSNAME}
          >
            <i className="fr-icon-arrow-right-line rtl:rotate-180" aria-hidden="true" />
          </button>
        </div>
      </div>
    </Section>
  );
};
