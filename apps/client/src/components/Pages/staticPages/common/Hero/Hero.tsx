import Button from "@codegouvfr/react-dsfr/Button";
import Image from "next/image";
import React from "react";
import { Section } from "~/components/Pages/staticPages/common/Section";

interface Props {
  title: string;
  subtitle: string;
  buttonTitle: string;
  image: any;
  imageWidth: number;
}

export const Hero = React.forwardRef<HTMLDivElement | null, Props>((props, ref) => (
  <Section ref={ref} className="bg-blue-france">
    <div className="fr-container">
      <div className="flex flex-col md:flex-row md:items-center gap-10 lg:gap-20">
        <div className="flex-1 text-center md:text-left">
          <h1 className="!text-h1 !text-light-alt-blue md:!text-alt-title mb-6">{props.title}</h1>
          <p className="!text-chapo !text-light-alt-blue !mb-0">{props.subtitle}</p>
          <Button
            iconId="fr-icon-arrow-right-line"
            iconPosition="right"
            className="mt-10 !w-full justify-center md:!w-auto fr-button-reverse"
            linkProps={{
              href: "#register",
            }}
          >
            {props.buttonTitle}
          </Button>
        </div>
        <div className="flex-1">
          <Image src={props.image} alt="" width={props.imageWidth} className="max-w-full h-auto mx-auto" />
        </div>
      </div>
    </div>
  </Section>
));

Hero.displayName = "Hero";
