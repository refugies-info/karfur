import React, { useCallback } from "react";
import Input from "components/Pages/dispositif/Input";
import ChoiceButton from "../../../ChoiceButton";
import { ContactInfos } from "../ModalMainSponsor";
import NoIcon from "assets/dispositif/no-icon.svg";
import styles from "./StructureContact.module.scss";

interface Props {
  contact: ContactInfos;
  setContact: React.Dispatch<React.SetStateAction<ContactInfos>>;
  unknownContact: boolean | null;
  setUnknownContact: React.Dispatch<React.SetStateAction<boolean | null>>;
}

const StructureContact = (props: Props) => {
  const { setUnknownContact, unknownContact } = props;
  const resetUnknownContact = useCallback(() => {
    if (unknownContact) {
      setUnknownContact(null);
    }
  }, [setUnknownContact, unknownContact]);

  return (
    <div>
      <p>Nous avons besoin de contacter un membre de cette structure pour lui faire valider la fiche.</p>
      <Input
        id="structure-contact-name"
        label="Prénom et nom du contact"
        type="text"
        icon="person-outline"
        value={props.contact.name}
        onChange={(e: any) => {
          resetUnknownContact();
          props.setContact({ ...props.contact, name: e.target.value });
        }}
        valid={!!props.contact.name}
        className="mb-4"
      />
      <Input
        id="structure-contact-comments"
        label="Informations"
        type="textarea"
        value={props.contact.comments}
        onChange={(e: any) => {
          resetUnknownContact();
          props.setContact({ ...props.contact, comments: e.target.value });
        }}
        placeholder="Quel est votre lien avec la personne (collègue, partenaire, connaissance...) ? Connaissez-vous son poste ?"
        className="mb-6"
      />
      <Input
        id="structure-contact-email"
        label="Email du contact (optionnel)"
        type="text"
        icon="at-outline"
        value={props.contact.email}
        onChange={(e: any) => {
          resetUnknownContact();
          props.setContact({ ...props.contact, email: e.target.value });
        }}
        className="mb-4"
      />
      <Input
        id="structure-contact-phone"
        label="Téléphone du contact (optionnel)"
        type="text"
        icon="phone-outline"
        value={props.contact.phone}
        onChange={(e: any) => {
          resetUnknownContact();
          props.setContact({ ...props.contact, phone: e.target.value });
        }}
        className="mb-4"
      />

      <ChoiceButton
        text="Je ne connais personne dans cette structure"
        selected={unknownContact === true}
        onSelect={() => setUnknownContact(true)}
        type="radio"
        size="lg"
        image={NoIcon}
      />
    </div>
  );
};

export default StructureContact;
