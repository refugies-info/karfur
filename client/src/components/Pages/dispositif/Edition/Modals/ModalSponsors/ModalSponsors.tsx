import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { CreateDispositifRequest, Picture, Sponsor } from "api-types";
import { BaseModal } from "components/Pages/dispositif";
import { SimpleFooter, SponsorForm } from "../components";
import { help } from "./data";
import styles from "./ModalSponsors.module.scss";

interface Props {
  show: boolean;
  toggle: () => void;
}

const ModalSponsors = (props: Props) => {
  const { setValue, getValues } = useFormContext<CreateDispositifRequest>();

  const [name, setName] = useState<string | undefined>(undefined);
  const [link, setLink] = useState<string | undefined>(undefined);
  const [logo, setLogo] = useState<Picture | undefined>(undefined);

  const validate = () => {
    if (name && link && logo) {
      const sponsor: Sponsor = {
        name,
        link,
        logo,
      };
      const sponsors = getValues("sponsors") || [];
      setValue("sponsors", [...sponsors, sponsor]);
      props.toggle();
    }
  };

  return (
    <BaseModal show={props.show} toggle={props.toggle} help={help} title="Ajouter une structure partenaire">
      <div>
        <SponsorForm
          name={name}
          onNameChange={(e: any) => setName(e.target.value)}
          link={link}
          onLinkChange={(e: any) => setLink(e.target.value)}
          logo={logo}
          onLogoChange={(img) => setLogo(img)}
        />
        <SimpleFooter onValidate={validate} disabled={!name || !link || !logo} />
      </div>
    </BaseModal>
  );
};

export default ModalSponsors;
