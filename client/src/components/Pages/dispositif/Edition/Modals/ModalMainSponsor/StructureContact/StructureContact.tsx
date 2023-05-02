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
        label="Prénom et nom du contact"
        type="text"
        icon="person-outline"
        value={props.contact.name}
        onChange={(e: any) => props.setContact({ ...props.contact, name: e.target.value })}
        valid={!!props.contact.name}
        className="mb-4"
      />
      <Input
        id="structure-contact-comments"
        label="Commentaires"
        type="textarea"
        value={props.contact.comments}
        onChange={(e: any) => props.setContact({ ...props.contact, comments: e.target.value })}
        placeholder="Quel est votre lien avec la personne (collègue, partenaire, connaissance...) ? Connaissez-vous son poste ?"
        className="mb-6"
      />
      <Input
        id="structure-contact-email"
        label="Email du contact (optionnel)"
        type="text"
        icon="at-outline"
        value={props.contact.email}
        onChange={(e: any) => props.setContact({ ...props.contact, email: e.target.value })}
        className="mb-4"
      />
      <Input
        id="structure-contact-phone"
        label="Téléphone du contact (optionnel)"
        type="text"
        icon="phone-outline"
        value={props.contact.phone}
        onChange={(e: any) => props.setContact({ ...props.contact, phone: e.target.value })}
        className="mb-4"
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
