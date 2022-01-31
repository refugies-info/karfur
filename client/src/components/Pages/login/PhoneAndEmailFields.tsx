import React, { ChangeEventHandler } from "react";
import { useTranslation } from "react-i18next";
import FButton from "components/FigmaUI/FButton/FButton";
import FInput from "components/FigmaUI/FInput/FInput";
import styles from "scss/components/login.module.scss";
import Image from "next/image";

interface Props {
  email: string;
  phone: string;
  isAdmin: boolean;
  structure: {
    nom: string;
    picture: {
      secure_url: string;
    };
  } | null;
  onChangeEmail: ChangeEventHandler<HTMLInputElement>;
  onChangePhone: ChangeEventHandler<HTMLInputElement>;
}

const PhoneAndEmailFields = (props: Props) => {
  const { t } = useTranslation();

  return props.isAdmin ? ( // ADMIN
    <>
      <FInput
        prepend
        prependName="at-outline"
        value={props.email}
        onChange={props.onChangeEmail}
        id="email"
        type="email"
        placeholder={t("Login.Entrez votre email", "Entrez votre email")}
        newSize
      />
      <FInput
        prepend
        prependName="smartphone-outline"
        value={props.phone}
        onChange={props.onChangePhone}
        id="phone"
        type="tel"
        placeholder={t(
          "Login.Entrez votre numéro",
          "Entrez votre numéro"
        )}
        newSize
      />
      <FButton
        type="validate-light"
        name="arrow-forward-outline"
        disabled={!props.phone || !props.email}
      >
        {t("Suivant", "Suivant")}
      </FButton>
    </>
  ) : ( // HAS STRUCTURE
    <>
      {props.structure?.nom && (
        <>
          <h5 className={styles.h5}>
            {t(
              "Login.new_has_structure_subtitle",
              "Vous avez été nommé « responsable de structure » pour la structure :"
            )}
          </h5>
          <FButton
            type="white"
            tag="div"
          >
            {props.structure?.picture?.secure_url && (
              <Image
                className="mr-10"
                src={props.structure?.picture?.secure_url}
                alt={props.structure.nom}
                width={40}
                height={80}
                objectFit="contain"
              />
            )}
            {props.structure.nom}
          </FButton>
        </>
      )}

        <h5 className={styles.h5}>
          {t(
            "Login.2fa_mandatory_subtitle",
            "La double authenfication est requise pour des raisons de sécurité :"
          )}
      </h5>
      <div
        className={styles.label}
        style={{ marginTop: 16 }}
      >
        {t(
          "Login.email_up_to_date_label",
          "Vérifiez votre adresse email, est-elle à jour ?"
        )}
      </div>
      <div style={{ maxWidth: 360 }}>
        <FInput
          prepend
          prependName="at-outline"
          value={props.email}
          onChange={props.onChangeEmail}
          id="email"
          type="email"
          placeholder={t(
            "Login.Entrez votre email",
            "Entrez votre email"
          )}
          newSize
        />
      </div>

      <div
        className={styles.label}
        style={{ marginTop: 16 }}
      >
        {t(
          "Login.enter_phone_label",
          "Entrez votre numéro de téléphone mobile pour recevoir le code d’identification"
        )}
      </div>
      <div style={{ maxWidth: 360 }}>
        <FInput
          prepend
          prependName="smartphone-outline"
          value={props.phone}
          onChange={props.onChangePhone}
          id="phone"
          type="tel"
          placeholder={t(
            "Login.Entrez votre numéro",
            "Entrez votre numéro"
          )}
          newSize
        />
      </div>

      <div className="text-right" style={{ marginTop: 24 }}>
        <FButton
          type="validate-light"
          name="arrow-forward-outline"
          disabled={!props.phone || !props.email}
        >
          {t("Suivant", "Suivant")}
        </FButton>
      </div>
    </>
  );
};

export default PhoneAndEmailFields;
