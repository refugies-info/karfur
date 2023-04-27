import React from "react";
import Input from "components/Pages/dispositif/Input";
import ChoiceButton from "../../../ChoiceButton";
import { ContactInfos } from "../ModalMainSponsor";
import styles from "./StructureContact.module.scss";

interface Props {
  contact: ContactInfos;
  setContact: React.Dispatch<React.SetStateAction<ContactInfos>>;
  unknownContact: boolean | null;
  setUnknownContact: React.Dispatch<React.SetStateAction<boolean | null>>;
}

const StructureContact = (props: Props) => {
  return (
    <div>
      <p>Nous avons besoin de contacter un membre de cette structure pour lui faire valider la fiche.</p>
      <Input
        id="structure-contact-name"
        label="Votre nom et prénom"
        type="text"
        icon="person-outline"
        value={props.contact.name}
        onChange={(e: any) => props.setContact({ ...props.contact, name: e.target.value })}
        valid={!!props.contact.name}
        className="mb-4"
      />
      <Input
        id="structure-contact-email"
        label="Votre email"
        type="text"
        icon="at-outline"
        value={props.contact.email}
        onChange={(e: any) => props.setContact({ ...props.contact, email: e.target.value })}
        valid={!!props.contact.email}
        className="mb-4"
      />
      <Input
        id="structure-contact-phone"
        label="Votre numéro de téléphone"
        type="text"
        icon="phone-outline"
        value={props.contact.phone}
        onChange={(e: any) => props.setContact({ ...props.contact, phone: e.target.value })}
        valid={!!props.contact.phone}
        className="mb-4"
      />
      <Input
        id="structure-contact-comments"
        label="Commentaires"
        type="textarea"
        value={props.contact.comments}
        onChange={(e: any) => props.setContact({ ...props.contact, comments: e.target.value })}
        placeholder="Ajoutez ici toutes les précisions nécessaires : fonction, disponibilité, relation avec le contact..."
        className="mb-6"
      />
      <ChoiceButton
        text="Je ne connais personne dans cette structure"
        selected={props.unknownContact === true}
        onSelect={() => props.setUnknownContact(true)}
        type="radio"
        size="lg"
      />
    </div>
  );
};

export default StructureContact;
