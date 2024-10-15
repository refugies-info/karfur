import { CreateDispositifRequest, DemarcheAdministration, Picture } from "@refugies-info/api-types";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import LogoInput from "~/components/Pages/dispositif/Edition/LogoInput";
import Input from "~/components/Pages/dispositif/Input";
import BaseModal from "~/components/UI/BaseModal";
import { SimpleFooter } from "../components";
import { help } from "./data";

interface Props {
  show: boolean;
  toggle: () => void;
}

const ModalDemarcheAdministration = (props: Props) => {
  const { setValue, getValues, watch } = useFormContext<CreateDispositifRequest>();
  const initialValue = getValues("administration");

  const [name, setName] = useState<string | undefined | null>(initialValue?.name);
  const [logo, setLogo] = useState<Picture | undefined | null>(initialValue?.logo);

  const administrationValue = watch("administration");
  useEffect(() => {
    if (administrationValue) {
      if (administrationValue.name === null) setName(null);
      if (administrationValue.logo === null) setLogo(null);
    }
  }, [administrationValue]);

  const validate = () => {
    const administration: DemarcheAdministration = {};
    if (!name && !logo) {
      props.toggle();
      return;
    }
    if (name) administration.name = name;
    if (logo) administration.logo = logo;
    setValue("administration", administration);
    props.toggle();
  };

  return (
    <BaseModal show={props.show} toggle={props.toggle} help={help} title="Ajouter une illustration pour les démarches">
      <div>
        <Input
          id="sponsor-name"
          label="Nom de l'administration"
          type="text"
          icon="briefcase-outline"
          value={name || ""}
          onChange={(e: any) => setName(e.target.value)}
          className="mb-4"
        />
        <LogoInput
          id="sponsor-logo"
          label="Logo de l'administration"
          image={logo || undefined}
          imageSize={64}
          onImageUploaded={(img) => setLogo(img)}
          dimensionsHelp="Formats acceptés : .jpeg, .png, .svg. Le logo doit avoir un fond transparent, demander de l'aide au designer si nécessaire !"
        />
        <SimpleFooter onValidate={validate} disabled={!name} />
      </div>
    </BaseModal>
  );
};

export default ModalDemarcheAdministration;
