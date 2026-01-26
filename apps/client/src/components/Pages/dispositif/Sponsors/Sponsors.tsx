import Button from "@codegouvfr/react-dsfr/Button";
import type { ContentStructure, CreateDispositifRequest, Sponsor } from "@refugies-info/api-types";
import { cn } from "@refugies-info/ui";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import type React from "react";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { sanitizeUrl } from "~/lib/sanitizeUrl";
import { selectedDispositifSelector } from "~/services/SelectedDispositif/selectedDispositif.selector";

interface Props {
  mainSponsor?: ContentStructure | CreateDispositifRequest["mainSponsor"] | null;
  sponsors: (Sponsor | ContentStructure)[] | CreateDispositifRequest["sponsors"] | undefined;
  editMode?: boolean;
  onDelete?: (idx: number) => void;
  onClick?: (idx: number) => void;
  onMainSponsorClick?: () => void;
  onAdd?: () => void;
}

/**
 * Show secondary sponsors of a dispositif.
 */
const Sponsors = ({
  mainSponsor,
  sponsors,
  editMode,
  onDelete,
  onClick,
  onMainSponsorClick,
  onAdd,
}: Props) => {
  const { t } = useTranslation();
  const hasMainSponsor =
    mainSponsor !== null && mainSponsor !== undefined && typeof mainSponsor !== "string";
  const hasSponsors = sponsors && sponsors.length > 0;
  const dispositif = useSelector(selectedDispositifSelector);

  const getSponsorContent = useCallback(
    (link: string | null | undefined, name: string, forceLink = false) => (
      <>
        {link || forceLink ? (
          <Link
            href={link || ""}
            className={cn("fr-link", forceLink && "pointer-events-none")}
            target={!forceLink ? "_blank" : undefined}
            rel={!forceLink ? undefined : "noopener noreferrer"}
          >
            {name}
          </Link>
        ) : (
          <span className="font-bold">{name}</span>
        )}
      </>
    ),
    [],
  );

  return hasMainSponsor || hasSponsors || editMode ? (
    <span className="w-full">
      <span className="text-title-grey">{t("Dispositif.proposedBy")} </span>
      <span>
        {hasMainSponsor && mainSponsor?.nom && (
          <>
            {editMode ? (
              <>
                <span
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onMainSponsorClick?.();
                  }}
                >
                  {getSponsorContent(
                    mainSponsor?.link,
                    mainSponsor?.acronyme || mainSponsor?.nom,
                    true,
                  )}
                </span>
                <Button
                  iconId="fr-icon-edit-line"
                  title="Modifier"
                  size="small"
                  className="bg-action-high-blue-france min-h-0 translate-y-[0.15rem] rounded-full px-1 py-1 [&::before]:m-0"
                  onClick={(e: any) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onMainSponsorClick?.();
                  }}
                />
              </>
            ) : (
              <>{(mainSponsor as ContentStructure)?.nom}</>
            )}{" "}
            {hasSponsors && sponsors.length > 0 && ", "}
          </>
        )}

        {!hasMainSponsor && editMode && (
          <Button
            iconId="fr-icon-add-circle-fill"
            size="small"
            className="mx-2 mt-2 mb-2"
            priority="secondary"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onMainSponsorClick?.();
            }}
          >
            Ajouter une structure
          </Button>
        )}

        {(sponsors || [])?.map((sponsor, i, arr) => {
          if (!sponsor) return null;
          const name = (sponsor as Sponsor).name || (sponsor as ContentStructure).nom || "";
          const sponsorLink = (sponsor as Sponsor).link;
          const link = sponsorLink ? sanitizeUrl(sponsorLink) : null;
          return (
            <span key={i}>
              {editMode ? (
                <span
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onClick?.(i);
                  }}
                >
                  {getSponsorContent(link, name, true)}{" "}
                  <Button
                    iconId="fr-icon-close-line"
                    title="Supprimer"
                    size="small"
                    className="bg-action-high-red-marianne min-h-0 translate-y-[0.15rem] rounded-full px-1 py-1 [&::before]:m-0"
                    onClick={(e: any) => {
                      e.stopPropagation();
                      e.preventDefault();
                      onDelete?.(i);
                    }}
                  />
                </span>
              ) : (
                <>{getSponsorContent(link, name)}</>
              )}
              {i !== arr.length - 1 && ", "}
            </span>
          );
        })}
        {editMode && (
          <Button
            iconId="fr-icon-add-circle-fill"
            size="small"
            className="mt-2 mb-2 ml-2"
            priority="secondary"
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              e.stopPropagation();
              onAdd?.();
            }}
          >
            Ajouter un partenaire
          </Button>
        )}
      </span>
    </span>
  ) : null;
};

export default Sponsors;
