import React from "react";
import Image from "next/image";
import { ContentStructure, CreateDispositifRequest, Sponsor } from "api-types";
import styles from "./Sponsors.module.scss";

interface Props {
  sponsors: (Sponsor | ContentStructure)[] | CreateDispositifRequest["sponsors"] | undefined;
  editMode?: boolean;
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
            <div key={i} className={styles.sponsor}>
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
            </div>
          );
        })}
      </div>
    </div>
  ) : null;
};

export default Sponsors;
