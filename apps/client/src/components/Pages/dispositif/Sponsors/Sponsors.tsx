import Button from "@codegouvfr/react-dsfr/Button";
import { ContentStructure, CreateDispositifRequest, Sponsor } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useCallback } from "react";
import { sanitizeUrl } from "~/lib/sanitizeUrl";

interface Props {
  sponsors: (Sponsor | ContentStructure)[] | CreateDispositifRequest["sponsors"] | undefined;
  editMode?: boolean;
  onDelete?: (idx: number) => void;
  onClick?: (idx: number) => void;
  onAdd?: (e: any) => void;
}

/**
 * Show secondary sponsors of a dispositif.
 */
const Sponsors = (props: Props) => {
  const { t } = useTranslation();
  const hasSponsors = props.sponsors && props.sponsors.length > 0;

  const getSponsorContent = useCallback(
    (link: string | null, name: string) => (
      <>
        {link ? (
          <Link href={link} className="fr-link" target="_blank" rel="noopener norefeerer">
            {name}
          </Link>
        ) : (
          <span>{name}</span>
        )}
      </>
    ),
    [],
  );

  return hasSponsors || props.editMode ? (
    <span className="w-full">
      <span className="text-title-grey">{t("Dispositif.proposedBy")} </span>
      <span>
        {(props?.sponsors || [])?.map((sponsor, i, arr) => {
          if (!sponsor) return null;
          const name = (sponsor as Sponsor).name || (sponsor as ContentStructure).nom || "";
          const sponsorLink = (sponsor as Sponsor).link;
          const link = sponsorLink ? sanitizeUrl(sponsorLink) : null;
          return (
            <span key={i}>
              {props.editMode ? (
                <span onClick={() => props.onClick?.(i)}>
                  {getSponsorContent(link, name)}{" "}
                  <Button
                    iconId="fr-icon-close-line"
                    title="Supprimer"
                    size="small"
                    className="bg-action-high-red-marianne min-h-0 translate-y-[0.15rem] rounded-full px-1 py-1 [&::before]:m-0"
                    onClick={(e: any) => {
                      e.stopPropagation();
                      e.preventDefault();
                      props.onDelete?.(i);
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
        {props.editMode && (
          <Button
            iconId="fr-icon-add-circle-fill"
            size="small"
            className="mt-2 mb-2 ml-2"
            priority="secondary"
            onClick={props.onAdd}
          >
            Ajouter un partenaire
          </Button>
        )}
      </span>
    </span>
  ) : null;
};

export default Sponsors;
