import React, { useCallback } from "react";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { ContentStructure, CreateDispositifRequest, Sponsor } from "@refugies-info/api-types";
import { cls } from "lib/classname";
import { sanitizeUrl } from "lib/sanitizeUrl";
import Button from "components/UI/Button";
import styles from "./Sponsors.module.scss";

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
    (image: string, name: string) => (
      <>
        {image && (
          <Image src={image} alt={name} width={60} height={60} style={{ objectFit: "contain" }} className="me-3" />
        )}
        <div>{name}</div>
      </>
    ),
    [],
  );

  return hasSponsors || props.editMode ? (
    <div className={styles.container}>
      <span className={cls("me-8", styles.label)}>{t("Dispositif.partners")}</span>
      <div className={styles.sponsors}>
        {(props?.sponsors || [])?.map((sponsor, i) => {
          if (!sponsor) return null;
          const image =
            (sponsor as Sponsor).logo?.secure_url || (sponsor as ContentStructure).picture?.secure_url || "";
          const name = (sponsor as Sponsor).name || (sponsor as ContentStructure).nom || "";
          const sponsorLink = (sponsor as Sponsor).link;
          const link = sponsorLink ? sanitizeUrl(sponsorLink) : null;
          return (
            <div key={i}>
              {props.editMode ? (
                <div className={cls(styles.sponsor, styles.edit)} onClick={() => props.onClick?.(i)}>
                  {getSponsorContent(image, name)}

                  <Button
                    priority="tertiary"
                    evaIcon="trash-2-outline"
                    onClick={(e: any) => {
                      e.stopPropagation();
                      e.preventDefault();
                      props.onDelete?.(i);
                    }}
                    className={cls(styles.delete)}
                  ></Button>
                </div>
              ) : link ? (
                <a className={cls(styles.sponsor, styles.link)} href={link} target="_blank" rel="noopener noreferer">
                  {getSponsorContent(image, name)}
                </a>
              ) : (
                <div className={cls(styles.sponsor)}>{getSponsorContent(image, name)}</div>
              )}
            </div>
          );
        })}
        {props.editMode && (
          <Button evaIcon="plus-circle-outline" priority="secondary" className={styles.add} onClick={props.onAdd}>
            Ajouter un partenaire
          </Button>
        )}
      </div>
    </div>
  ) : null;
};

export default Sponsors;
