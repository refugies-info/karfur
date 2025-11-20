import { cn } from "@refugies-info/ui";
import React, { useId } from "react";

type AnnotationType = {
  text: string;
  className?: string;
};

interface AnnotationsOverlayType {
  annotations: AnnotationType[];
  className?: string;
  children: React.ReactElement;
}

export const AnnotationsOverlay = ({ children, className, annotations }: AnnotationsOverlayType) => {
  const uid = useId();

  return (
    <figure className={cn("relative", className)}>
      {React.cloneElement(children, { "aria-describedby": `${uid}-annotations` } as React.HTMLAttributes<HTMLElement>)}
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
