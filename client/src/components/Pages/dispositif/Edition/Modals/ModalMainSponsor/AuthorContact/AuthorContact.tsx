import React from "react";
import Input from "components/Pages/dispositif/Input";
import { ContactInfos } from "../ModalMainSponsor";
import styles from "./AuthorContact.module.scss";

interface Props {
  contact: ContactInfos;
  setContact: React.Dispatch<React.SetStateAction<ContactInfos>>;
}

const AuthorContact = (props: Props) => {
  return (
    <div>
      <p>Afin qu'on puisse vous contacter</p>
      <Input
        id="author-contact-name"
        label="Votre nom et prénom"
        type="text"
        icon="person-outline"
        value={props.contact.name}
        onChange={(e: any) => props.setContact({ ...props.contact, name: e.target.value })}
        valid={!!props.contact.name}
        className="mb-4"
      />
      <Input
        id="author-contact-email"
        label="Votre email"
        type="text"
        icon="at-outline"
        value={props.contact.email}
        onChange={(e: any) => props.setContact({ ...props.contact, email: e.target.value })}
        valid={!!props.contact.email}
        className="mb-4"
      />
      <Input
        id="author-contact-phone"
        label="Votre nom et prénom"
        type="text"
        icon="phone-outline"
        value={props.contact.phone}
        onChange={(e: any) => props.setContact({ ...props.contact, phone: e.target.value })}
        valid={!!props.contact.phone}
        className="mb-4"
      />
      <Input
        id="author-contact-comments"
        label="Commentaires"
        type="textarea"
        value={props.contact.comments}
        onChange={(e: any) => props.setContact({ ...props.contact, comments: e.target.value })}
        placeholder="Ajoutez ici toutes les précisions nécessaires : fonction, disponibilité, relation avec le contact..."
        className="mb-4"
      />
    </div>
  );
};

export default AuthorContact;
