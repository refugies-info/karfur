import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { CreateDispositifRequest, Picture, Sponsor } from "api-types";
import Input from "components/Pages/dispositif/Input";
import { BaseModal } from "components/Pages/dispositif";
import { SimpleFooter } from "../components";
import { help } from "./data";
import LogoInput from "../../LogoInput";
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
        <Input
          id="sponsor-name"
          label="Nom de la structure"
          type="text"
          icon="briefcase-outline"
          value={name}
          onChange={(e: any) => setName(e.target.value)}
          valid={!!name}
          className="mb-4"
        />
        <Input
          id="sponsor-link"
          label="Site internet de la structure"
          type="text"
          icon="link-2-outline"
          value={link}
          onChange={(e: any) => setLink(e.target.value)}
          valid={!!link}
          className="mb-4"
        />
        <LogoInput
          id="sponsor-logo"
          label="Logo de la structure"
          image={logo}
          imageSize={64}
          onImageUploaded={(img) => setLogo(img)}
          dimensionsHelp="Formats acceptés : .jpeg, .png, .svg"
        />
        <SimpleFooter onValidate={validate} />
      </div>
    </BaseModal>
  );
};

export default ModalSponsors;
