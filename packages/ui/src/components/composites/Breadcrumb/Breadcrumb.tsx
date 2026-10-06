import { Breadcrumb as DsfrBreadcrumb } from "@codegouvfr/react-dsfr/Breadcrumb";
import type { ReactNode } from "react";

export type BreadcrumbSegment = {
  label: ReactNode;
  linkProps: {
    href: string;
    className?: string;
    [key: string]: string | undefined;
  };
};

export interface BreadcrumbProps {
  segments: BreadcrumbSegment[];
  currentPageLabel: string;
  className?: string;
  homeLabel?: string;
}

export const Breadcrumb = ({
  segments = [],
  currentPageLabel,
  className = "w-full",
  homeLabel = "Accueil",
}: BreadcrumbProps) => {
  const homeSegment: BreadcrumbSegment = {
    label: (
      <span className="relative inline-flex gap-2">
        <i className="ri-home-4-line" aria-hidden="true" />
      </span>
    ),
    linkProps: { href: "/", className: "bg-none", "aria-label": homeLabel },
  };

  const allSegments = [homeSegment, ...segments];

  return (
    <DsfrBreadcrumb
      className={className}
      segments={allSegments}
      currentPageLabel={currentPageLabel}
    />
  );
};

export default Breadcrumb;
