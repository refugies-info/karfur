import React from "react";
import { cls } from "lib/classname";
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
      <Input
        id="author-contact-name"
        label="Votre prénom et nom"
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
        id="author-contact-comments"
        label="Pourquoi avez-vous proposé cette fiche ?"
        type="textarea"
        value={props.contact.comments}
        onChange={(e: any) => props.setContact({ ...props.contact, comments: e.target.value })}
        placeholder="Êtes-vous bénévole dans cette structure ? S’agit-il d’une structure partenaire ? Vous aviez connaissance de cette action près de chez vous ?"
        className={cls(styles.textarea, "mb-4")}
      />
    </div>
  );
};

export default AuthorContact;
