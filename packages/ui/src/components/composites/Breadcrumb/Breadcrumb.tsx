import { Breadcrumb as DsfrBreadcrumb } from "@codegouvfr/react-dsfr/Breadcrumb";
import { type ReactNode } from "react";

export type BreadcrumbSegment = {
  label: ReactNode;
  linkProps: {
    href: string;
    className?: string;
    [key: string]: any;
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
      <span className="relative inline-flex gap-2" aria-label={homeLabel}>
        <i className="ri-home-4-line" />
      </span>
    ),
    linkProps: { href: "/", className: "bg-none" },
  };

  const allSegments = [homeSegment, ...segments];

  return <DsfrBreadcrumb className={className} segments={allSegments} currentPageLabel={currentPageLabel} />;
};

export default Breadcrumb;
