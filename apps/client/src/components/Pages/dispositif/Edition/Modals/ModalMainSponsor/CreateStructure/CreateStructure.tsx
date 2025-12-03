import type { MainSponsor } from "@refugies-info/api-types";
import type React from "react";
import { SponsorForm } from "../../components";

interface Props {
  sponsor: MainSponsor;
  setSponsor: React.Dispatch<React.SetStateAction<MainSponsor>>;
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
      linkOptional
      logoOptional
    />
  );
};

export default CreateStructure;
