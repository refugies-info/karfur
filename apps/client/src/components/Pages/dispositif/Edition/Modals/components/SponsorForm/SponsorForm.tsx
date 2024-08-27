import { Picture } from "@refugies-info/api-types";
import React from "react";
import Input from "~/components/Pages/dispositif/Input";
import LogoInput from "../../../LogoInput";

interface Props {
  name: string | undefined;
  onNameChange: React.ChangeEventHandler<HTMLInputElement>;
  link: string | undefined;
  onLinkChange: React.ChangeEventHandler<HTMLInputElement>;
  linkOptional?: boolean;
  logo: Picture | undefined;
  onLogoChange: (image: Picture | undefined) => void;
  logoOptional?: boolean;
}

const SponsorForm = (props: Props) => {
  return (
    <div>
      <Input
        id="sponsor-name"
        label="Nom de la structure"
        type="text"
        icon="briefcase-outline"
        value={props.name}
        onChange={props.onNameChange}
        valid={!!props.name}
        className="mb-4"
      />
      <Input
        id="sponsor-link"
        label={`Site internet de la structure ${props.linkOptional ? "(optionnel)" : ""}`}
        type="text"
        icon="link-2-outline"
        value={props.link}
        onChange={props.onLinkChange}
        valid={!!props.link}
        className="mb-4"
      />
      <LogoInput
        id="sponsor-logo"
        label={`Logo de la structure ${props.logoOptional ? "(optionnel)" : ""}`}
        image={props.logo}
        imageSize={64}
        onImageUploaded={props.onLogoChange}
        dimensionsHelp="Formats acceptés : .jpeg, .png, .svg"
      />
    </div>
  );
};

export default SponsorForm;
