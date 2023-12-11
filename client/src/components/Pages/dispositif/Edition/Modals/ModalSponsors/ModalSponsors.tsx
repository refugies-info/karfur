import React, { useCallback, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { CreateDispositifRequest, Picture, Sponsor } from "@refugies-info/api-types";
import BaseModal from "components/UI/BaseModal";
import { SimpleFooter, SponsorForm } from "../components";
import { help } from "./data";
import styles from "./ModalSponsors.module.scss";

interface Props {
  show: boolean;
  toggle: () => void;
  currentSponsorIndex: number; // -1 if creation, else index to use for sponsor edition
}

const ModalSponsors = (props: Props) => {
  const { setValue, getValues } = useFormContext<CreateDispositifRequest>();

  const [name, setName] = useState<string | undefined>(undefined);
  const [link, setLink] = useState<string | undefined>(undefined);
  const [logo, setLogo] = useState<Picture | undefined>(undefined);

  const resetForm = useCallback(() => {
    setName(undefined);
    setLink(undefined);
    setLogo(undefined);
  }, []);

  const validate = () => {
    if (name) {
      const sponsor: Sponsor = { name };
      if (link) sponsor.link = link;
      if (logo) sponsor.logo = logo;
      const newSponsors = [...(getValues("sponsors") || [])];
      if (props.currentSponsorIndex >= 0) {
        newSponsors[props.currentSponsorIndex] = sponsor;
      } else {
        newSponsors.push(sponsor);
      }
      setValue("sponsors", newSponsors);
      resetForm();
      props.toggle();
    }
  };

  useEffect(() => {
    if (props.currentSponsorIndex >= 0) {
      const sponsor = getValues("sponsors")?.[props.currentSponsorIndex];
      setName(sponsor?.name);
      setLink(sponsor?.link);
      setLogo(sponsor?.logo);
    } else {
      resetForm();
    }
  }, [props.currentSponsorIndex, getValues, resetForm]);

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
        <SimpleFooter onValidate={validate} disabled={!name} />
      </div>
    </BaseModal>
  );
};

export default ModalSponsors;
