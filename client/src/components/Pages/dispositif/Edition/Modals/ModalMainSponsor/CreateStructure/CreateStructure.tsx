import React from "react";
import { Sponsor } from "@refugies-info/api-types";
import { SponsorForm } from "../../components";
import styles from "./CreateStructure.module.scss";

interface Props {
  sponsor: Sponsor;
  setSponsor: React.Dispatch<React.SetStateAction<Sponsor>>;
}

const CreateStructure = (props: Props) => {
  return (
    <SponsorForm
      name={props.sponsor.name}
      onNameChange={(e: any) => props.setSponsor({ ...props.sponsor, name: e.target.value })}
      link={props.sponsor.link}
      onLinkChange={(e: any) => props.setSponsor({ ...props.sponsor, link: e.target.value })}
      logo={props.sponsor.logo}
      onLogoChange={(img) =>
        props.setSponsor({
          ...props.sponsor,
          logo: img || {
            imgId: "",
            public_id: "",
            secure_url: "",
          },
        })
      }
    />
  );
};

export default CreateStructure;
