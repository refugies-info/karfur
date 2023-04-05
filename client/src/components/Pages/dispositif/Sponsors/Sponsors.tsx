import React from "react";
import Image from "next/image";
import { ContentStructure, CreateDispositifRequest, Sponsor } from "api-types";
import { cls } from "lib/classname";
import Button from "components/UI/Button";
import styles from "./Sponsors.module.scss";

interface Props {
  sponsors: (Sponsor | ContentStructure)[] | CreateDispositifRequest["sponsors"] | undefined;
  editMode?: boolean;
  onDelete?: (idx: number) => void;
  onClick?: (idx: number) => void;
}

/**
 * Show secondary sponsors of a dispositif.
 */
const Sponsors = (props: Props) => {
  const hasSponsors = props.sponsors && props.sponsors.length > 0;

  return hasSponsors || props.editMode ? (
    <div className={styles.container}>
      <span className={styles.label}>En partenariat avec</span>
      <div className={styles.sponsors}>
        {(props?.sponsors || [])?.map((sponsor, i) => {
          if (!sponsor) return null;
          const image =
            (sponsor as Sponsor).logo?.secure_url || (sponsor as ContentStructure).picture?.secure_url || "";
          const name = (sponsor as Sponsor).name || (sponsor as ContentStructure).nom || "";
          return (
            <div
              key={i}
              className={cls(styles.sponsor, props.editMode && styles.edit)}
              onClick={props.editMode ? () => props.onClick?.(i) : undefined}
            >
              {image && (
                <Image
                  src={image}
                  alt={name}
                  width={40}
                  height={40}
                  style={{ objectFit: "contain" }}
                  className="me-3"
                />
              )}
              <div>{name}</div>
              {props.editMode && (
                <Button
                  tertiary
                  icon="trash-2-outline"
                  onClick={(e: any) => {
                    e.stopPropagation();
                    e.preventDefault();
                    props.onDelete?.(i);
                  }}
                  className={cls("ms-2", styles.delete)}
                ></Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  ) : null;
};

export default Sponsors;
