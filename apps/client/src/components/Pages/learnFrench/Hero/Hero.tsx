import Button from "@codegouvfr/react-dsfr/Button";
import Image, { type StaticImageData } from "next/image";
import React from "react";
import { Section } from "~/components/Pages/staticPages/common/Section";

interface Props {
  title: string;
  subtitle: string;
  searchCtaText: string;
  searchCtaHref: string;
  learnMoreCtaText: string;
  learnMoreCtaHref: string;
  image: StaticImageData;
}

export const Hero = React.forwardRef<HTMLDivElement | null, Props>((props, ref) => (
  <Section ref={ref} className="bg-action-low-blue-france">
    <div className="container">
      <div className="flex flex-col gap-10 md:flex-row md:items-center lg:gap-20">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-h1 md:text-alt-title mb-6">{props.title}</h1>
          <p className="text-chapo mb-10">{props.subtitle}</p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button
              iconId="fr-icon-search-line"
              iconPosition="left"
              linkProps={{ href: props.searchCtaHref }}
            >
              {props.searchCtaText}
            </Button>
            <Button priority="secondary" linkProps={{ href: props.learnMoreCtaHref }}>
              {props.learnMoreCtaText}
            </Button>
          </div>
        </div>
        <div className="flex-1">
          <Image src={props.image} alt="" className="mx-auto h-auto max-w-full" />
        </div>
      </div>
    </div>
  </Section>
));

Hero.displayName = "Hero";
