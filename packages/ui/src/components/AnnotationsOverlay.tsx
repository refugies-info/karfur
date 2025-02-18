import { cn } from "@/lib/cn";
import Image, { ImageProps } from "next/image";
import React, { ReactElement, useId } from "react";

type AnnotationType = {
  text: string;
  className?: string;
};

type ImageElement = ReactElement<HTMLImageElement | ImageProps, "img" | typeof Image>;

type AnnotationsOverlayType = {
  children: ImageElement;
  annotations: AnnotationType[];
  className?: string;
};

export const AnnotationsOverlay = ({ children, className, annotations }: AnnotationsOverlayType) => {
  const uid = useId();

  return (
    <figure className={cn("relative", className)}>
      {React.cloneElement(children, { "aria-describedby": `${uid}-annotations` })}
      <figcaption id={`${uid}-annotations`}>
        {annotations.map(({ text, className }) => (
          <span key={text} className={cn("font-caveat absolute block text-lg leading-4 font-bold", className)}>
            {text}
          </span>
        ))}
      </figcaption>
    </figure>
  );
};
