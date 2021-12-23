import React from "react";
import FButton from "../../../../components/FigmaUI/FButton/FButton";
import FInput from "../../../../components/FigmaUI/FInput/FInput";
import * as S from "../../styles";

interface Props {
  email: string;
  phone: string;
  isAdmin: boolean;
  structure: {
    nom: string;
    picture: {
      secure_url: string;
    };
  };
  onChange: void;
  t: any;
}

export const PhoneAndEmailFields = (props: Props) => {
  return props.isAdmin ? ( // ADMIN
    <>
      <FInput
        prepend
        prependName="at-outline"
        value={props.email}
        onChange={props.onChange}
        id="email"
        type="email"
        placeholder={props.t("Login.Entrez votre email", "Entrez votre email")}
        newSize
      />
      <FInput
        prepend
        prependName="smartphone-outline"
        value={props.phone}
        onChange={props.onChange}
        id="phone"
        type="tel"
        placeholder={props.t(
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
        {props.t("Suivant", "Suivant")}
      </FButton>
    </>
  ) : ( // HAS STRUCTURE
    <>
      {props.structure?.nom && (
        <>
          <S.StyledH5>
            {props.t(
              "Login.new_has_structure_subtitle",
              "Vous avez été nommé « responsable de structure » pour la structure :"
            )}
          </S.StyledH5>
          <div className="figma-btn white">
            {props.structure?.picture?.secure_url && (
              <img
                className="mr-10"
                src={props.structure?.picture?.secure_url}
                alt={props.structure.nom}
                width="40"
              />
            )}
            {props.structure.nom}
          </div>
        </>
      )}

        <S.StyledH5>
          {props.t(
            "Login.2fa_mandatory_subtitle",
            "La double authenfication est requise pour des raisons de sécurité :"
          )}
      </S.StyledH5>
      <S.StyledEnterValue style={{ marginTop: 16 }}>
        {props.t(
          "Login.email_up_to_date_label",
          "Vérifiez votre adresse email, est-elle à jour ?"
        )}
      </S.StyledEnterValue>
      <div style={{ maxWidth: 360 }}>
        <FInput
          prepend
          prependName="at-outline"
          value={props.email}
          onChange={props.onChange}
          id="email"
          type="email"
          placeholder={props.t(
            "Login.Entrez votre email",
            "Entrez votre email"
          )}
          newSize
        />
      </div>

      <S.StyledEnterValue style={{ marginTop: 16 }}>
        {props.t(
          "Login.enter_phone_label",
          "Entrez votre numéro de téléphone mobile pour recevoir le code d’identification"
        )}
      </S.StyledEnterValue>
      <div style={{ maxWidth: 360 }}>
        <FInput
          prepend
          prependName="smartphone-outline"
          value={props.phone}
          onChange={props.onChange}
          id="phone"
          type="tel"
          placeholder={props.t(
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
          {props.t("Suivant", "Suivant")}
        </FButton>
      </div>
    </>
  );
};
